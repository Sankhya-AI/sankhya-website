import {
  desktopEntitlementFromSubscription,
  desktopManagedKey,
  encodeLicenseToken,
} from './_desktop-license.js';
import { getAdminAuth, getAdminDb } from './_firebase-admin.js';

const DESKTOP_CALLBACK_URL = 'http://127.0.0.1:7777/v1/auth/browser-callback';

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

export function validateLoopbackCallback(value) {
  const url = new URL(String(value || DESKTOP_CALLBACK_URL));
  if (url.toString() !== DESKTOP_CALLBACK_URL) {
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
    const userRef = db.collection('users').doc(decoded.uid);
    const snapshot = await userRef.collection('subscriptions').doc('chotu').get();
    const subscription = snapshot.data();
    const entitlement = desktopEntitlementFromSubscription(decoded, subscription);

    // Deliver the account's own managed OpenRouter key inside the same
    // short-lived loopback token, but only when managed AI is active. The key
    // is never readable by the browser (firestore.rules denies the secrets
    // subcollection); only this admin-side handler can read it.
    let managedSecret = null;
    if (subscription?.access?.managedKeys && subscription?.managedApiKey?.status === 'active') {
      const secretSnap = await userRef.collection('secrets').doc('openrouter').get();
      managedSecret = secretSnap.data();
    }
    const managedKey = desktopManagedKey(subscription, managedSecret);

    const licenseToken = encodeLicenseToken(entitlement, managedKey);
    return res.status(200).json({
      url: callbackUrl.toString(),
      licenseToken,
      expiresInSeconds: 60,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Could not start Chotu Desktop sign-in',
      ...(error.code ? { code: error.code } : {}),
    });
  }
}
