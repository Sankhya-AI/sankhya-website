import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, type Firestore } from 'firebase/firestore';

export type ChotuSubscription = {
  status: 'none' | 'pending' | 'active' | 'expired';
  plan: 'chotu' | 'byok';
  entitlement: string;
  updateUntil: string | null;
  access: {
    localApp: boolean;
    updates: boolean;
    support: boolean;
    managedKeys: boolean;
    chotuApi: boolean;
  };
  billingMode: 'one_time' | 'manual' | 'razorpay' | 'lago' | 'demo' | 'byok';
  razorpayCustomerId?: string | null;
  razorpaySubscriptionId?: string | null;
  currentPeriodEnd?: string | null;
  usage: {
    apiSpendUsd: number;
    requests: number;
    tokens: number;
  };
  managedApiKey?: {
    status: 'pending' | 'provisioning' | 'active' | 'pending_revocation' | 'disabled';
    openrouterKeyHash: string | null;
    provisionedAt: string | null;
    creditLimitUsd?: number | null;
  } | null;
};

// Base monthly managed-credit grant (USD). Top-ups stack on top within a month.
export const MANAGED_BASE_CREDIT_USD = 12;

// Top-up packs: ₹ price → USD credits added to the current month's limit.
export const TOPUP_PACKS = [
  { usd: 3, inr: 499, envName: 'VITE_RAZORPAY_TOPUP_LINK_3USD', link: 'https://rzp.io/rzp/MrUioHC' },
  { usd: 6, inr: 999, envName: 'VITE_RAZORPAY_TOPUP_LINK_6USD', link: 'https://rzp.io/rzp/f1e43wc0' },
  { usd: 12, inr: 1999, envName: 'VITE_RAZORPAY_TOPUP_LINK_12USD', link: 'https://rzp.io/rzp/tMc5XGg' },
] as const;

export type TopUpUsd = (typeof TOPUP_PACKS)[number]['usd'];

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

const firebaseConfig = {
  apiKey: 'AIzaSyBmPJA94vIrRygxbvcmqxAghFkRQnQIrx0',
  authDomain: 'chotu-webapp-server.firebaseapp.com',
  projectId: 'chotu-webapp-server',
  storageBucket: 'chotu-webapp-server.firebasestorage.app',
  messagingSenderId: '330762326580',
  appId: '1:330762326580:web:d8d84890808747ef6ab061',
  measurementId: 'G-TPML5YJSJH',
};

export const RAZORPAY_SUBSCRIPTION_LINK = 'https://rzp.io/rzp/eEubzej';

const requiredFirebaseConfig = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
};

const hasFirebaseConfig = Object.values(requiredFirebaseConfig).every(Boolean);

export const firebaseServices: FirebaseServices | null = hasFirebaseConfig
  ? (() => {
      const app = initializeApp(firebaseConfig);
      return {
        app,
        auth: getAuth(app),
        db: getFirestore(app),
      };
    })()
  : null;

const demoSubscription: ChotuSubscription = {
  status: 'pending',
  plan: 'chotu',
  entitlement: 'Chotu subscription with launch month free, then Rs 1999 through Razorpay',
  updateUntil: null,
  access: {
    localApp: true,
    updates: false,
    support: false,
    managedKeys: false,
    chotuApi: false,
  },
  billingMode: 'demo',
  usage: {
    apiSpendUsd: 0,
    requests: 0,
    tokens: 0,
  },
};

export function watchAuthState(callback: (user: User | null) => void) {
  if (!firebaseServices) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(firebaseServices.auth, callback);
}

export async function signInWithGoogle() {
  if (!firebaseServices) {
    throw new Error('Firebase is not configured yet.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(firebaseServices.auth, provider);
}

export async function signOutOfFirebase() {
  if (!firebaseServices) return;
  await signOut(firebaseServices.auth);
}

export async function fetchChotuSubscription(user: User | null): Promise<ChotuSubscription> {
  if (!firebaseServices || !user) return demoSubscription;

  const snapshot = await getDoc(doc(firebaseServices.db, 'users', user.uid, 'subscriptions', 'chotu'));
  if (!snapshot.exists()) {
    return { ...demoSubscription, status: 'none', billingMode: 'manual' };
  }

  return {
    ...demoSubscription,
    ...snapshot.data(),
    access: {
      ...demoSubscription.access,
      ...(snapshot.data().access ?? {}),
    },
    usage: {
      ...demoSubscription.usage,
      ...(snapshot.data().usage ?? {}),
    },
  } as ChotuSubscription;
}

export async function buildCheckoutUrl(user: User | null) {
  const checkoutUrl =
    import.meta.env.VITE_RAZORPAY_PAYMENT_LINK_URL ||
    import.meta.env.VITE_CHOTU_CHECKOUT_URL ||
    RAZORPAY_SUBSCRIPTION_LINK;

  const url = new URL(checkoutUrl);
  if (url.hostname === 'rzp.io') return url.toString();

  if (user) {
    url.searchParams.set('firebase_uid', user.uid);
    if (user.email) url.searchParams.set('email', user.email);
  }
  url.searchParams.set('product', 'chotu');
  url.searchParams.set('price_inr', '1999');
  url.searchParams.set('approx_price_usd', '20');
  url.searchParams.set('launch_trial_days', '30');
  url.searchParams.set('provider', 'razorpay');

  return url.toString();
}

export async function createDesktopLoginUrl(
  user: User,
  callbackUrl = 'http://127.0.0.1:7777/v1/auth/browser-callback'
) {
  const idToken = await user.getIdToken();
  const response = await fetch('/api/create-desktop-login-token', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ callbackUrl }),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string; url?: string };
  if (!response.ok || !body.url) {
    throw new Error(body.error ?? 'Could not start Chotu Desktop sign-in.');
  }
  return body.url;
}

export async function selectByokPlan(user: User): Promise<void> {
  const idToken = await user.getIdToken();
  const response = await fetch('/api/select-plan', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: 'byok' }),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(body.error ?? 'Could not select the free plan.');
}

// Re-derive entitlement from Razorpay in case a webhook was missed or delayed.
// `paymentId` (from the post-checkout redirect) recovers a dropped first payment.
export async function syncSubscription(
  user: User,
  paymentId?: string | null
): Promise<ChotuSubscription | null> {
  const idToken = await user.getIdToken();
  const response = await fetch('/api/sync-subscription', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentId ? { paymentId } : {}),
  });
  if (!response.ok) return null;
  return fetchChotuSubscription(user);
}

export function topUpCheckoutUrl(user: User | null, usd: TopUpUsd): string {
  const pack = TOPUP_PACKS.find((entry) => entry.usd === usd);
  const link = pack ? (import.meta.env[pack.envName] as string | undefined) || pack.link : undefined;
  if (!link) throw new Error('Top-up is not configured yet. Try again soon.');

  const url = new URL(link);
  // rzp.io short links carry their notes (kind=topup, topup_usd) server-side and
  // ignore query params; full checkout URLs can take buyer hints for matching.
  if (url.hostname !== 'rzp.io' && user) {
    url.searchParams.set('firebase_uid', user.uid);
    if (user.email) url.searchParams.set('email', user.email);
    url.searchParams.set('kind', 'topup');
    url.searchParams.set('topup_usd', String(usd));
  }
  return url.toString();
}

export async function triggerManagedKeyProvisioning(user: User): Promise<{ status: string }> {
  const idToken = await user.getIdToken();
  const response = await fetch('/api/provision-managed-key', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string; status?: string; ok?: boolean };
  if (!response.ok) throw new Error(body.error ?? 'Key provisioning failed');
  return { status: body.status ?? 'active' };
}

export { hasFirebaseConfig };
