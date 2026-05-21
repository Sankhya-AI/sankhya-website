import crypto from 'node:crypto';
import { desktopEntitlementWindow } from './_desktop-license.js';
import { admin, getAdminAuth, getAdminDb, requireEnv } from './_firebase-admin.js';

const allowedArtifacts = new Set([
  'chotu-darwin-arm64.zip',
  'chotu-darwin-x86_64.zip',
  'chotu-darwin-x64.zip',
  'chotu-windows-x64.zip',
  'chotu-win32-x64.zip',
]);
const downloadTokenTtlSeconds = 60;

function signPayload(payload) {
  return crypto.createHmac('sha256', requireEnv('DOWNLOAD_TOKEN_SECRET')).update(payload).digest('base64url');
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

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

    const { artifact = 'chotu-darwin-arm64.zip' } = await readJson(req);
    if (!allowedArtifacts.has(artifact)) return res.status(400).json({ error: 'Unknown artifact' });

    const db = getAdminDb();
    const snapshot = await db.collection('users').doc(decoded.uid).collection('subscriptions').doc('chotu').get();
    const subscription = snapshot.data();
    const entitlementWindow = desktopEntitlementWindow(subscription);
    if (!entitlementWindow?.downloadEnabled) {
      return res.status(403).json({ error: 'Active Chotu plan or launch trial required for downloads' });
    }

    const jti = crypto.randomUUID();
    const exp = Math.floor(Date.now() / 1000) + downloadTokenTtlSeconds;
    const payload = Buffer.from(JSON.stringify({ artifact, uid: decoded.uid, jti, exp })).toString('base64url');
    const signature = signPayload(payload);
    await db.collection('downloadTokens').doc(jti).set({
      uid: decoded.uid,
      artifact,
      expiresAt: admin.firestore.Timestamp.fromMillis(exp * 1000),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      usedAt: null,
    });

    return res.status(200).json({
      url: `/downloads/${artifact}?token=${payload}.${signature}`,
      expiresAt: exp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not create download token' });
  }
}
