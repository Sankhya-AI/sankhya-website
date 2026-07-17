import crypto from 'node:crypto';

const SCHEMA_VERSION = 'chotu.entitlement.v1';
const ACCOUNT_PRODUCT_ID = 'chotu';
const OFFER_ID = 'chotu-trial-monthly-2026';
const DEFAULT_DEVICES_ALLOWED = 3;
const DESKTOP_LOGIN_TOKEN_SCHEMA = 'chotu.desktop_login_token.v2';
const DESKTOP_LOGIN_TOKEN_TTL_MS = 60 * 1000;

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== 'object' || value instanceof Date) return value;
  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = sortValue(value[key]);
      return acc;
    }, {});
}

export function stableStringify(value) {
  return JSON.stringify(sortValue(value));
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function emailHash(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return '';
  return `sha256:${crypto.createHash('sha256').update(normalized).digest('hex')}`;
}

function stableId(prefix, seed) {
  const secret =
    process.env.CHOTU_LICENSE_ID_SECRET ||
    process.env.CHOTU_LICENSE_PRIVATE_KEY_PEM ||
    process.env.CHOTU_LICENSE_PRIVATE_KEY ||
    process.env.DOWNLOAD_TOKEN_SECRET ||
    'sankhya-development-license-id-secret';
  const digest = crypto.createHmac('sha256', secret).update(seed).digest('base64url');
  return `${prefix}_${digest.slice(0, 24)}`;
}

function signingKey() {
  const raw = process.env.CHOTU_LICENSE_PRIVATE_KEY_PEM || process.env.CHOTU_LICENSE_PRIVATE_KEY || '';
  if (!raw.trim()) {
    const error = new Error('CHOTU_LICENSE_PRIVATE_KEY_PEM is required for Chotu Desktop login');
    error.statusCode = 500;
    throw error;
  }
  return crypto.createPrivateKey(raw.replace(/\\n/g, '\n'));
}

export function desktopLicensePublicKeyPem() {
  return crypto.createPublicKey(signingKey()).export({ type: 'spki', format: 'pem' });
}

function signEntitlement(entitlement) {
  const payload = { ...entitlement };
  delete payload.signature;
  const signature = crypto.sign(null, Buffer.from(stableStringify(payload), 'utf8'), signingKey());
  return {
    ...payload,
    signature: `ed25519:${signature.toString('base64url')}`,
  };
}

function addDaysIso(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

export function isoFromFirestore(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (typeof value.toMillis === 'function') return new Date(value.toMillis()).toISOString();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000).toISOString();
  return null;
}

export function desktopEntitlementWindow(subscription) {
  if (!subscription || subscription.status === 'none' || subscription.status === 'pending') {
    const trialEndsAt = addDaysIso(30);
    return {
      status: 'trialing',
      trialEndsAt,
      updatesUntil: trialEndsAt,
      downloadEnabled: true,
    };
  }
  if (subscription.access?.localApp === false) return null;
  // Free BYOK plan: perpetual local app + downloads, no managed credits. Granted
  // regardless of billing dates because nothing is billed.
  if (subscription.plan === 'byok' || subscription.billingMode === 'byok') {
    return {
      status: 'active',
      trialEndsAt: isoFromFirestore(subscription.trialEndsAt),
      updatesUntil: addDaysIso(3650),
      downloadEnabled: true,
    };
  }
  if (subscription.status !== 'active') return null;
  const accessUntil = isoFromFirestore(subscription.currentPeriodEnd) || isoFromFirestore(subscription.updateUntil);
  if (!accessUntil) {
    return {
      status: 'active',
      trialEndsAt: isoFromFirestore(subscription.trialEndsAt),
      updatesUntil: addDaysIso(31),
      downloadEnabled: true,
    };
  }
  const accessUntilMs = new Date(accessUntil).getTime();
  if (!Number.isFinite(accessUntilMs) || accessUntilMs <= Date.now()) return null;
  return {
    status: 'active',
    trialEndsAt: isoFromFirestore(subscription.trialEndsAt),
    updatesUntil: accessUntil,
    downloadEnabled: true,
  };
}

export function desktopEntitlementFromSubscription(decodedUser, subscription) {
  const email = normalizeEmail(decodedUser.email || subscription?.email || subscription?.emailLower);
  const hash = emailHash(email);
  if (!hash) {
    const error = new Error('Google account email is required for Chotu Desktop login');
    error.statusCode = 400;
    throw error;
  }

  const entitlementWindow = desktopEntitlementWindow(subscription);
  if (!entitlementWindow) {
    const error = new Error('Active Chotu plan required before desktop sign-in');
    error.statusCode = 403;
    throw error;
  }
  const customerSeed =
    subscription?.razorpayCustomerId ||
    subscription?.razorpaySubscriptionId ||
    decodedUser.uid ||
    hash;

  return signEntitlement({
    schema_version: SCHEMA_VERSION,
    license_id: stableId('lic', customerSeed),
    user_id: stableId('usr', decodedUser.uid || hash),
    email_hash: hash,
    product_id: ACCOUNT_PRODUCT_ID,
    offer_id: subscription?.offerId || OFFER_ID,
    status: entitlementWindow.status,
    perpetual_use: false,
    issued_at: new Date().toISOString(),
    trial_ends_at: entitlementWindow.trialEndsAt,
    updates_until: entitlementWindow.updatesUntil,
    credit_card_required: true,
    download_enabled: entitlementWindow.downloadEnabled,
    devices_allowed: subscription?.devicesAllowed || DEFAULT_DEVICES_ALLOWED,
    activated_devices: [],
    managed_ai: {
      enabled: Boolean(subscription?.access?.managedKeys),
      billing_mode: subscription?.access?.managedKeys ? 'razorpay' : 'none',
      usage_account_id: subscription?.razorpayCustomerId || null,
      hard_limit_cents: null,
    },
  });
}

export function desktopManagedKey(subscription, secret) {
  if (!subscription?.access?.managedKeys) return null;

  if (subscription?.managedApiKey?.status !== 'active') {
    const error = new Error('Chotu is preparing secure managed cognition. Please wait a moment.');
    error.statusCode = 409;
    error.code = 'managed_key_pending';
    throw error;
  }

  const apiKey = typeof secret?.apiKey === 'string' ? secret.apiKey.trim() : '';
  if (!apiKey) {
    const error = new Error('Managed cognition credential is unavailable.');
    error.statusCode = 503;
    error.code = 'managed_key_unavailable';
    throw error;
  }
  return apiKey;
}

export function encodeLicenseToken(entitlement, managedKey = null, options = {}) {
  const now = options.now || Date.now;
  const nonce = options.nonce || crypto.randomBytes(24).toString('base64url');
  const issuedAt = now();
  const payload = {
    schema_version: DESKTOP_LOGIN_TOKEN_SCHEMA,
    issued_at_unix_ms: issuedAt,
    expires_at_unix_ms: issuedAt + DESKTOP_LOGIN_TOKEN_TTL_MS,
    nonce,
    entitlement,
  };
  // The per-user managed OpenRouter key rides alongside (not inside) the signed
  // entitlement so the signature stays clean. It only travels over the
  // short-lived 127.0.0.1 desktop callback.
  if (typeof managedKey === 'string' && managedKey.trim()) {
    payload.managed_key = managedKey.trim();
  }
  const signature = crypto.sign(
    null,
    Buffer.from(stableStringify(payload), 'utf8'),
    signingKey(),
  );
  return Buffer.from(JSON.stringify({
    ...payload,
    token_signature: `ed25519:${signature.toString('base64url')}`,
  }), 'utf8').toString('base64url');
}
