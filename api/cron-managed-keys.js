import crypto from 'node:crypto';
import { admin, getAdminDb, requireEnv } from './_firebase-admin.js';
import { createProvisionedKey, disableKey } from './_openrouter.js';

const STALE_LOCK_MS = 5 * 60 * 1000;
const BATCH_LIMIT = 5;

function verifyCronSecret(req) {
  const cronSecret = requireEnv('CRON_SECRET');
  const auth = req.headers.authorization || '';
  const provided = Buffer.from(auth.startsWith('Bearer ') ? auth.slice(7) : '');
  const expected = Buffer.from(cronSecret);
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(provided, expected);
}

async function provisionKey(db, subRef, uid) {
  let didLock = false;
  await db.runTransaction(async (t) => {
    const snap = await t.get(subRef);
    const status = snap.data()?.managedApiKey?.status;
    if (status !== 'pending') return;
    t.update(subRef, {
      'managedApiKey.status': 'provisioning',
      'managedApiKey.provisionedAt': new Date().toISOString(),
    });
    didLock = true;
  });

  if (!didLock) return;

  try {
    const name = `chotu_${uid.slice(0, 8)}_${Math.floor(Date.now() / 1000)}`;
    const limitUsd = requireEnv('OPENROUTER_CREDIT_LIMIT_USD');
    const { key, hash } = await createProvisionedKey(name, limitUsd);

    const secretRef = db.collection('users').doc(uid).collection('secrets').doc('openrouter');
    await secretRef.set({ apiKey: key, createdAt: admin.firestore.FieldValue.serverTimestamp() });

    await subRef.update({
      'managedApiKey.status': 'active',
      'managedApiKey.openrouterKeyHash': hash,
    });
  } catch (err) {
    console.error(`[cron] provision failed uid=${uid}:`, err);
    await subRef.update({
      'managedApiKey.status': 'pending',
      'managedApiKey.provisionedAt': null,
    }).catch((e) => console.error('[cron] reset failed:', e));
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyCronSecret(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = getAdminDb();
  let processed = 0;

  // 1. Provision pending keys
  try {
    const pendingSnap = await db.collectionGroup('subscriptions')
      .where('managedApiKey.status', '==', 'pending')
      .limit(BATCH_LIMIT)
      .get();

    for (const doc of pendingSnap.docs) {
      const uid = doc.ref.parent.parent.id;
      try {
        await provisionKey(db, doc.ref, uid);
        processed++;
      } catch (err) {
        console.error(`[cron] pending uid=${uid}:`, err);
      }
    }
  } catch (err) {
    console.error('[cron] pending query failed:', err);
  }

  // 2. Revoke pending_revocation keys
  try {
    const revokeSnap = await db.collectionGroup('subscriptions')
      .where('managedApiKey.status', '==', 'pending_revocation')
      .limit(BATCH_LIMIT)
      .get();

    for (const doc of revokeSnap.docs) {
      const uid = doc.ref.parent.parent.id;
      const hash = doc.data()?.managedApiKey?.openrouterKeyHash;
      try {
        if (hash) await disableKey(hash);
        await doc.ref.update({ 'managedApiKey.status': 'disabled' });
        processed++;
      } catch (err) {
        console.error(`[cron] revoke uid=${uid}:`, err);
      }
    }
  } catch (err) {
    console.error('[cron] revoke query failed:', err);
  }

  // 3. Reset stale provisioning locks
  try {
    const staleSnap = await db.collectionGroup('subscriptions')
      .where('managedApiKey.status', '==', 'provisioning')
      .limit(BATCH_LIMIT)
      .get();

    const cutoff = new Date(Date.now() - STALE_LOCK_MS).toISOString();
    for (const doc of staleSnap.docs) {
      const uid = doc.ref.parent.parent.id;
      const provisionedAt = doc.data()?.managedApiKey?.provisionedAt;
      if (provisionedAt && provisionedAt < cutoff) {
        try {
          await doc.ref.update({
            'managedApiKey.status': 'pending',
            'managedApiKey.provisionedAt': null,
          });
          processed++;
        } catch (err) {
          console.error(`[cron] stale-lock-reset uid=${uid}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('[cron] stale-lock query failed:', err);
  }

  return res.status(200).json({ ok: true, processed });
}
