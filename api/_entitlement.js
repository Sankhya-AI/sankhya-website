import { admin } from './_firebase-admin.js';

// Shared activation shape so the webhook and the sync-subscription fallback can
// never drift. Intentionally does NOT reset `usage` (so a recovery sync never
// clobbers accumulated usage mirrors).
export function activeAccessPatch({
  customerId = null,
  subscriptionId = null,
  paymentId = null,
  paymentLinkId = null,
  periodEndIso,
}) {
  return {
    status: 'active',
    plan: 'chotu',
    entitlement: 'Active plan keeps Chotu updates, support, managed keys, and chotu_api access',
    updateUntil: periodEndIso,
    currentPeriodEnd: periodEndIso,
    billingMode: 'razorpay',
    razorpayCustomerId: customerId,
    razorpaySubscriptionId: subscriptionId,
    razorpayPaymentId: paymentId,
    razorpayPaymentLinkId: paymentLinkId,
    access: {
      localApp: true,
      updates: true,
      support: true,
      managedKeys: true,
      chotuApi: true,
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

// Bring the managed key into a provisionable state after activation, mirroring
// the webhook's key-provisioning transaction. Safe to call repeatedly.
export async function ensureManagedKeyPending(db, subRef) {
  await db.runTransaction(async (t) => {
    const snap = await t.get(subRef);
    const key = snap.data()?.managedApiKey;
    const status = key?.status;
    if (!status || status === 'disabled') {
      t.set(subRef, {
        managedApiKey: { status: 'pending', openrouterKeyHash: null, provisionedAt: null },
      }, { merge: true });
    } else if (status === 'pending_revocation') {
      t.set(subRef, {
        managedApiKey: key.openrouterKeyHash
          ? { status: 'active' }
          : { status: 'pending', openrouterKeyHash: null, provisionedAt: null },
      }, { merge: true });
    }
  });
}

export function addDaysIso(days, from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
