import {
  creditsToUpstreamUsd,
  privateBillingRef,
  upstreamLimitUsd,
  upstreamUsdToCredits,
} from './_credits.js';
import { admin } from './_firebase-admin.js';
import { updateKeyLimit } from './_openrouter.js';

export function managedBaseCreditUsd() {
  const value = parseFloat(process.env.OPENROUTER_CREDIT_LIMIT_USD || '12');
  return Number.isFinite(value) && value > 0 ? value : 12;
}

export function topUpUsdFromNotes(notes = {}) {
  const kind = String(notes.kind || '').trim().toLowerCase();
  if (kind !== 'topup') return null;

  // Razorpay's dashboard-configured notes still carry topup_usd; the site now
  // identifies a pack by credits so no dollar figure reaches the browser. Accept
  // either and resolve to the USD we provision upstream.
  const credits = parseFloat(notes.topup_credits ?? notes.topupCredits ?? '');
  if (Number.isFinite(credits) && credits > 0) {
    const usdForCredits = creditsToUpstreamUsd(credits);
    if (usdForCredits > 0) return usdForCredits;
  }

  const usd = parseFloat(notes.topup_usd ?? notes.topupUsd ?? '');
  return Number.isFinite(usd) && usd > 0 ? usd : null;
}

function paymentClaimId(paymentId) {
  return encodeURIComponent(String(paymentId));
}

async function claimTopUpPayment(db, paymentId, source) {
  if (!paymentId) return true;
  const claimRef = db.collection('topupPayments').doc(paymentClaimId(paymentId));
  return db.runTransaction(async (t) => {
    const snap = await t.get(claimRef);
    if (snap.exists) return false;
    t.set(claimRef, {
      paymentId,
      source,
      at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  });
}

export async function applyManagedTopUp({
  db,
  subRef,
  paymentId = null,
  source,
  usd,
}) {
  const amount = Number(usd);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { applied: false, ignored: true, limit: null };
  }

  const claimed = await claimTopUpPayment(db, paymentId, source);
  if (!claimed) return { applied: false, duplicate: true, limit: null };

  let newLimit = null;
  let hash = null;
  const uid = subRef.parent.parent.id;
  const privateRef = privateBillingRef(db, uid);
  await db.runTransaction(async (t) => {
    const [snap, privateSnap] = await Promise.all([t.get(subRef), t.get(privateRef)]);
    const data = snap.data() || {};
    if (!data.access?.managedKeys) return;
    const current = upstreamLimitUsd({
      privateData: privateSnap.data(),
      subscriptionData: data,
      fallbackUsd: managedBaseCreditUsd(),
    });
    newLimit = current + amount;
    hash = data.managedApiKey?.openrouterKeyHash || null;

    // Dollars go to the server-only document; the client-readable one carries
    // credits and sheds any legacy USD field it still has.
    t.set(privateRef, {
      creditLimitUsd: newLimit,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    t.set(subRef, {
      managedApiKey: {
        grantedCredits: upstreamUsdToCredits(newLimit),
        creditLimitUsd: admin.firestore.FieldValue.delete(),
        lastTopUpPaymentId: paymentId || null,
        limitSyncPending: true,
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  });

  if (newLimit != null && hash) {
    try {
      await updateKeyLimit(hash, newLimit);
      await subRef.set({ managedApiKey: { limitSyncPending: false } }, { merge: true });
    } catch (err) {
      console.error(`${source} top-up immediate limit update failed (cron will retry):`, err);
    }
  }

  return {
    applied: newLimit != null,
    ignored: newLimit == null,
    limit: newLimit,
  };
}
