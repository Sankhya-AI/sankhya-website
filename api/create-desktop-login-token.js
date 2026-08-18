import {
  desktopEntitlementFromSubscription,
  desktopManagedKey,
  encodeLicenseToken,
} from './_desktop-license.js';
import { getAdminAuth, getAdminDb } from './_firebase-admin.js';

// One account, three desktop apps. Each build runs its hub on its own loopback
// port — Chotu on 7777, Manu on 8787, Plank on 9797 — so the callback the app
// asks us to post the licence back to is how we know which app is signing in.
//
// This stays an exact-match allowlist rather than "any loopback port": the licence
// token, and the account's managed key with it, is delivered to whatever URL is named
// here, so a port this table does not know is a port we do not hand secrets to.
const DESKTOP_CALLBACK_URLS = {
  chotu: 'http://127.0.0.1:7777/v1/auth/browser-callback',
  manu: 'http://127.0.0.1:8787/v1/auth/browser-callback',
  // Plank is Chotu's runtime sold to students, with the tutor on top. Its port
  // must be listed here or sign-in fails with "Invalid desktop callback URL" —
  // which is exactly what a fresh Plank install did, because the allowlist is
  // deliberately exact-match: a port this table does not know is a port we do
  // not hand a licence and a managed key to.
  plank: 'http://127.0.0.1:9797/v1/auth/browser-callback',
};

const DEFAULT_DESKTOP_CALLBACK_URL = DESKTOP_CALLBACK_URLS.chotu;

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
  const requested = String(value || DEFAULT_DESKTOP_CALLBACK_URL);
  const url = new URL(requested);
  const product = Object.keys(DESKTOP_CALLBACK_URLS).find(
    (name) => DESKTOP_CALLBACK_URLS[name] === url.toString(),
  );
  if (!product) {
    const error = new Error('Invalid desktop callback URL');
    error.statusCode = 400;
    throw error;
  }
  return { url, product };
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
    const { url: callbackUrl } = validateLoopbackCallback(body.callbackUrl);
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
