import { getAdminAuth, getAdminDb, requireEnv } from './_firebase-admin.js';
import { activeAccessPatch, addDaysIso, ensureManagedKeyPending } from './_entitlement.js';
import { applyManagedTopUp, topUpUsdFromNotes } from './_topups.js';

const RAZORPAY_API = 'https://api.razorpay.com/v1';

async function verifyBearer(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  if (!token) return null;
  return getAdminAuth().verifyIdToken(token);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

function razorpayAuthHeader() {
  const id = requireEnv('RAZORPAY_KEY_ID');
  const secret = requireEnv('RAZORPAY_KEY_SECRET');
  return `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`;
}

async function razorpayGet(path) {
  const res = await fetch(`${RAZORPAY_API}${path}`, {
    headers: { Authorization: razorpayAuthHeader() },
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

function paymentBelongsToUser(payment, decoded) {
  if (!payment) return false;
  const uid = decoded.uid;
  const email = String(decoded.email || '').toLowerCase();
  const notes = payment.notes || {};
  if ((notes.firebase_uid || notes.firebaseUid) === uid) return true;
  if (email && String(payment.email || '').toLowerCase() === email) return true;
  return false;
}

// Reliability fallback: if a Razorpay webhook was missed or delayed, the signed-in
// user (or the post-checkout redirect) can ask the server to re-derive access
// directly from Razorpay. Only ever GRANTS access for a verified, captured
// payment that belongs to this user; never charges or mutates Razorpay.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await verifyBearer(req);
    if (!decoded?.uid) return res.status(401).json({ error: 'Sign in required' });

    const body = await readJson(req);
    const paymentId = typeof body.paymentId === 'string' ? body.paymentId.trim() : '';

    const db = getAdminDb();
    const subRef = db.collection('users').doc(decoded.uid).collection('subscriptions').doc('chotu');
    const subSnap = await subRef.get();
    const sub = subSnap.data() || {};

    // 1. Verify a specific captured payment (the post-checkout redirect carries
    //    razorpay_payment_id) — recovers a dropped plan payment or top-up.
    if (paymentId) {
      const payment = await razorpayGet(`/payments/${encodeURIComponent(paymentId)}`);
      if (payment && payment.status === 'captured' && paymentBelongsToUser(payment, decoded)) {
        const notes = payment.notes || {};
        const topUpUsd = topUpUsdFromNotes(notes);
        if (topUpUsd == null) {
          await subRef.set(
            activeAccessPatch({
              customerId: payment.customer_id || sub.razorpayCustomerId || null,
              paymentId: payment.id,
              periodEndIso: addDaysIso(31),
            }),
            { merge: true },
          );
          await ensureManagedKeyPending(db, subRef);
          return res.status(200).json({ ok: true, recovered: 'payment', status: 'active' });
        }
        const result = await applyManagedTopUp({
          db,
          subRef,
          paymentId: payment.id,
          source: 'sync-subscription',
          usd: topUpUsd,
        });
        return res.status(200).json({
          ok: true,
          recovered: result.duplicate ? 'topup_duplicate' : result.applied ? 'topup' : 'topup_ignored',
          topup: topUpUsd,
          limit: result.limit,
        });
      }
    }

    // 2. Otherwise reconcile from a stored subscription id.
    if (sub.razorpaySubscriptionId) {
      const subscription = await razorpayGet(`/subscriptions/${encodeURIComponent(sub.razorpaySubscriptionId)}`);
      const active = subscription && ['active', 'authenticated', 'charged'].includes(subscription.status);
      if (active) {
        const periodEndIso = subscription.current_end
          ? new Date(subscription.current_end * 1000).toISOString()
          : addDaysIso(31);
        await subRef.set(
          activeAccessPatch({
            customerId: subscription.customer_id || sub.razorpayCustomerId || null,
            subscriptionId: subscription.id,
            periodEndIso,
          }),
          { merge: true },
        );
        await ensureManagedKeyPending(db, subRef);
        return res.status(200).json({ ok: true, recovered: 'subscription', status: 'active' });
      }
    }

    return res.status(200).json({ ok: true, recovered: false, status: sub.status || 'none' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not sync subscription' });
  }
}
