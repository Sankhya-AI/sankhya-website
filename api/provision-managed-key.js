import { admin, getAdminAuth, getAdminDb, requireEnv } from './_firebase-admin.js';
import { createProvisionedKey, disableKey } from './_openrouter.js';

async function verifyBearer(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  if (!token) return null;
  return getAdminAuth().verifyIdToken(token);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await verifyBearer(req);
    if (!decoded?.uid) return res.status(401).json({ error: 'Sign in required' });

    const db = getAdminDb();
    const subRef = db.collection('users').doc(decoded.uid).collection('subscriptions').doc('chotu');
    const snap = await subRef.get();
    const sub = snap.data();

    if (!sub?.access?.managedKeys) {
      return res.status(403).json({ error: 'Active plan required' });
    }

    const currentStatus = sub?.managedApiKey?.status;
    if (currentStatus === 'active') {
      return res.status(200).json({ ok: true, status: 'already_active' });
    }
    if (currentStatus === 'provisioning') {
      return res.status(409).json({ error: 'Key provisioning already in progress' });
    }

    // Atomic lock: pending → provisioning
    let didLock = false;
    let abortReason = null;
    await db.runTransaction(async (t) => {
      const freshSnap = await t.get(subRef);
      const fresh = freshSnap.data();
      const freshStatus = fresh?.managedApiKey?.status;
      if (!fresh?.access?.managedKeys) { abortReason = 'inactive'; return; }
      if (freshStatus === 'active') { abortReason = 'active'; return; }
      if (freshStatus === 'provisioning') { abortReason = 'provisioning'; return; }
      if (freshStatus === 'pending_revocation') { abortReason = 'revocation'; return; }
      t.update(subRef, {
        'managedApiKey.status': 'provisioning',
        'managedApiKey.provisionedAt': new Date().toISOString(),
      });
      didLock = true;
    });

    if (!didLock) {
      if (abortReason === 'provisioning') return res.status(409).json({ error: 'Key provisioning already in progress' });
      if (abortReason === 'inactive') return res.status(403).json({ error: 'Active plan required' });
      if (abortReason === 'revocation') return res.status(409).json({ error: 'Key revocation already in progress' });
      return res.status(200).json({ ok: true, status: 'already_active' });
    }

    let createdHash = null;
    try {
      const uid = decoded.uid;
      const name = `chotu_${uid.slice(0, 8)}_${Math.floor(Date.now() / 1000)}`;
      const limitUsd = requireEnv('OPENROUTER_CREDIT_LIMIT_USD');
      const { key, hash } = await createProvisionedKey(name, limitUsd);
      createdHash = hash;

      const secretRef = db.collection('users').doc(uid).collection('secrets').doc('openrouter');
      let shouldDisableCreatedKey = false;
      await db.runTransaction(async (t) => {
        const freshSnap = await t.get(subRef);
        const fresh = freshSnap.data();
        if (!fresh?.access?.managedKeys || fresh?.managedApiKey?.status !== 'provisioning') {
          shouldDisableCreatedKey = true;
          t.update(subRef, {
            'managedApiKey.status': 'pending_revocation',
            'managedApiKey.openrouterKeyHash': hash,
            'managedApiKey.provisionedAt': new Date().toISOString(),
          });
          return;
        }

        t.set(secretRef, { apiKey: key, createdAt: admin.firestore.FieldValue.serverTimestamp() });
        t.update(subRef, {
          'managedApiKey.status': 'active',
          'managedApiKey.openrouterKeyHash': hash,
          'managedApiKey.provisionedAt': new Date().toISOString(),
        });
      });

      if (shouldDisableCreatedKey) {
        try {
          await disableKey(hash);
          await subRef.update({
            'managedApiKey.status': 'disabled',
            'managedApiKey.provisionedAt': null,
          });
        } catch (disableError) {
          console.error('Created key after plan changed; queued revocation:', disableError);
        }
        return res.status(409).json({ error: 'Plan changed while provisioning; key queued for revocation' });
      }

      return res.status(200).json({ ok: true, status: 'active' });
    } catch (provisionError) {
      console.error('Provisioning failed, resetting to pending:', provisionError);
      if (createdHash) {
        await disableKey(createdHash)
          .then(() => subRef.update({
            'managedApiKey.status': 'disabled',
            'managedApiKey.openrouterKeyHash': createdHash,
            'managedApiKey.provisionedAt': null,
          }))
          .catch((e) => {
            console.error('Failed to disable orphaned key:', e);
            return subRef.update({
              'managedApiKey.status': 'pending_revocation',
              'managedApiKey.openrouterKeyHash': createdHash,
              'managedApiKey.provisionedAt': null,
            });
          });
      } else {
        await subRef.update({
          'managedApiKey.status': 'pending',
          'managedApiKey.provisionedAt': null,
        }).catch((e) => console.error('Failed to reset status:', e));
      }
      return res.status(500).json({ error: 'Key provisioning failed, will retry' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
