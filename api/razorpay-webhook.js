import crypto from 'node:crypto';
import { admin, getAdminDb, requireEnv } from './_firebase-admin.js';

const activeEvents = new Set(['payment.captured', 'payment_link.paid', 'subscription.authenticated', 'subscription.charged']);
const inactiveEvents = new Set(['payment.failed', 'subscription.cancelled', 'subscription.halted', 'subscription.completed']);
const keyProvisioningEvents = new Set(['payment.captured', 'payment_link.paid']);

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function verifyRazorpaySignature(rawBody, signature) {
  const expected = crypto
    .createHmac('sha256', requireEnv('RAZORPAY_WEBHOOK_SECRET'))
    .update(rawBody)
    .digest('hex');

  if (!signature || signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

function getEntity(payload, name) {
  return payload?.[name]?.entity ?? {};
}

function getNotes(...entities) {
  return entities.reduce((notes, entity) => ({ ...notes, ...(entity?.notes ?? {}) }), {});
}

function getCustomerEmail(payload) {
  const payment = getEntity(payload, 'payment');
  const paymentLink = getEntity(payload, 'payment_link');
  const customer = getEntity(payload, 'customer');
  const notes = getNotes(payment, paymentLink, customer);

  return (
    payment.email ||
    paymentLink.customer?.email ||
    paymentLink.customer_email ||
    customer.email ||
    notes.email ||
    notes.customer_email ||
    null
  );
}

function getFirebaseUid(payload) {
  const payment = getEntity(payload, 'payment');
  const paymentLink = getEntity(payload, 'payment_link');
  const subscription = getEntity(payload, 'subscription');
  const notes = getNotes(payment, paymentLink, subscription);
  return notes.firebase_uid || notes.firebaseUid || null;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function unixToIso(value) {
  if (!value) return null;
  return new Date(Number(value) * 1000).toISOString();
}

async function findUserRef(db, payload) {
  const firebaseUid = getFirebaseUid(payload);
  if (firebaseUid) return db.collection('users').doc(firebaseUid);

  const email = getCustomerEmail(payload);
  if (!email) return null;

  const emailLower = String(email).toLowerCase();
  let snapshot = await db.collection('users').where('emailLower', '==', emailLower).limit(1).get();
  if (snapshot.empty) {
    snapshot = await db.collection('users').where('email', '==', emailLower).limit(1).get();
  }

  return snapshot.empty ? null : snapshot.docs[0].ref;
}

function buildSubscriptionPatch(eventName, payload) {
  const subscription = getEntity(payload, 'subscription');
  const payment = getEntity(payload, 'payment');
  const paymentLink = getEntity(payload, 'payment_link');
  const active = activeEvents.has(eventName);
  const currentPeriodEnd = unixToIso(subscription.current_end || subscription.charge_at) || addDays(new Date(), 31);

  return {
    status: active ? 'active' : 'expired',
    plan: 'chotu',
    entitlement: active
      ? 'Active plan keeps Chotu updates, support, managed keys, and chotu_api access'
      : 'Local app remains yours; updates and hosted services require an active plan',
    updateUntil: active ? currentPeriodEnd : new Date().toISOString(),
    currentPeriodEnd: active ? currentPeriodEnd : null,
    billingMode: 'razorpay',
    razorpayCustomerId: subscription.customer_id || payment.customer_id || paymentLink.customer_id || null,
    razorpaySubscriptionId: subscription.id || null,
    razorpayPaymentId: payment.id || null,
    razorpayPaymentLinkId: paymentLink.id || null,
    access: {
      localApp: true,
      updates: active,
      support: active,
      managedKeys: active,
      chotuApi: active,
    },
    usage: {
      apiSpendUsd: 0,
      requests: 0,
      tokens: 0,
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'];
    if (!verifyRazorpaySignature(rawBody, Array.isArray(signature) ? signature[0] : signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const eventName = event.event;
    if (!activeEvents.has(eventName) && !inactiveEvents.has(eventName)) {
      return res.status(200).json({ ok: true, ignored: eventName });
    }

    const db = getAdminDb();
    const userRef = await findUserRef(db, event.payload);
    if (!userRef) {
      return res.status(202).json({ ok: true, unmatched: true });
    }

    const subRef = userRef.collection('subscriptions').doc('chotu');
    await subRef.set(buildSubscriptionPatch(eventName, event.payload), { merge: true });

    if (keyProvisioningEvents.has(eventName)) {
      await db.runTransaction(async (t) => {
        const snap = await t.get(subRef);
        const currentStatus = snap.data()?.managedApiKey?.status;
        if (!currentStatus || currentStatus === 'disabled') {
          t.update(subRef, {
            'managedApiKey.status': 'pending',
            'managedApiKey.openrouterKeyHash': null,
            'managedApiKey.provisionedAt': null,
          });
        }
      });
    }

    if (inactiveEvents.has(eventName)) {
      await subRef.update({ 'managedApiKey.status': 'pending_revocation' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Webhook failed' });
  }
}
