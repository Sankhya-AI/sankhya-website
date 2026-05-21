import {
  desktopEntitlementFromSubscription,
  encodeLicenseToken,
} from './_desktop-license.js';
import { getAdminAuth, getAdminDb } from './_firebase-admin.js';

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

function validateLoopbackCallback(value) {
  const url = new URL(String(value || 'http://127.0.0.1:7777/v1/auth/browser-callback'));
  const host = url.hostname.toLowerCase();
  const isLoopback = host === '127.0.0.1' || host === 'localhost' || host === '::1';
  if (url.protocol !== 'http:' || !isLoopback || url.pathname !== '/v1/auth/browser-callback') {
    const error = new Error('Invalid Chotu Desktop callback URL');
    error.statusCode = 400;
    throw error;
  }
  return url;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await verifyBearer(req);
    if (!decoded?.uid) return res.status(401).json({ error: 'Sign in required' });

    const body = await readJson(req);
    const callbackUrl = validateLoopbackCallback(body.callbackUrl);
    const db = getAdminDb();
    const snapshot = await db.collection('users').doc(decoded.uid).collection('subscriptions').doc('chotu').get();
    const subscription = snapshot.data();
    const entitlement = desktopEntitlementFromSubscription(decoded, subscription);
    callbackUrl.searchParams.set('license_token', encodeLicenseToken(entitlement));
    return res.status(200).json({
      url: callbackUrl.toString(),
      expiresInSeconds: 60,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Could not start Chotu Desktop sign-in' });
  }
}
