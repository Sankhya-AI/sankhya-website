import { admin, getAdminAuth, getAdminDb } from './_firebase-admin.js';

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

function addDaysIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

// Free "bring your own key" plan. Self-service because it grants no managed
// credits and collects no payment. Paid plans must come through Razorpay only,
// so this endpoint refuses anything but `byok`.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await verifyBearer(req);
    if (!decoded?.uid) return res.status(401).json({ error: 'Sign in required' });

    const body = await readJson(req);
    const plan = String(body.plan || '').trim().toLowerCase();
    if (plan !== 'byok') {
      return res.status(400).json({
        error: 'Only the free Bring-your-own-key plan can be selected here. Paid plans activate through Razorpay.',
      });
    }

    const db = getAdminDb();
    const subRef = db.collection('users').doc(decoded.uid).collection('subscriptions').doc('chotu');

    let kept = false;
    await db.runTransaction(async (t) => {
      const snap = await t.get(subRef);
      const current = snap.data() || {};

      // Never silently downgrade an active paid plan.
      if (current.status === 'active' && current.billingMode === 'razorpay' && current.access?.managedKeys) {
        kept = true;
        return;
      }

      const patch = {
        status: 'active',
        plan: 'byok',
        entitlement: 'Bring your own key: local Chotu app, updates, and support. No managed credits.',
        billingMode: 'byok',
        updateUntil: addDaysIso(3650),
        currentPeriodEnd: null,
        access: {
          localApp: true,
          updates: true,
          support: true,
          managedKeys: false,
          chotuApi: false,
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // If the user previously had a managed key, queue it for revocation so the
      // daily cron disables it (it owns the OpenRouter key hash).
      const keyStatus = current.managedApiKey?.status;
      if (keyStatus === 'active' || keyStatus === 'pending' || keyStatus === 'provisioning') {
        patch.managedApiKey = { status: 'pending_revocation' };
      }

      t.set(subRef, patch, { merge: true });
    });

    return res.status(200).json({ ok: true, plan: 'byok', keptExistingPaidPlan: kept });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not select the free plan' });
  }
}
