import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  desktopEntitlementFromSubscription,
  desktopEntitlementWindow,
  desktopManagedKey,
  encodeLicenseToken,
} from './_desktop-license.js';

const tokenSigningKey = crypto.generateKeyPairSync('ed25519');
process.env.CHOTU_LICENSE_PRIVATE_KEY_PEM = tokenSigningKey.privateKey.export({
  type: 'pkcs8',
  format: 'pem',
});

function decode(token) {
  return JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
}

function stableStringify(value) {
  const sortValue = (item) => {
    if (Array.isArray(item)) return item.map(sortValue);
    if (!item || typeof item !== 'object') return item;
    return Object.keys(item).sort().reduce((result, key) => {
      result[key] = sortValue(item[key]);
      return result;
    }, {});
  };
  return JSON.stringify(sortValue(value));
}

test('encodeLicenseToken wraps the managed key alongside the entitlement', () => {
  const token = encodeLicenseToken(
    { license_id: 'lic_1', status: 'active' },
    'sk-or-test',
    { now: () => 1_000, nonce: 'nonce_abcdefghijklmnopqrstuvwxyz123456' },
  );
  const payload = decode(token);
  assert.equal(payload.schema_version, 'chotu.desktop_login_token.v2');
  assert.equal(payload.issued_at_unix_ms, 1_000);
  assert.equal(payload.expires_at_unix_ms, 61_000);
  assert.equal(payload.nonce, 'nonce_abcdefghijklmnopqrstuvwxyz123456');
  assert.equal(payload.entitlement.license_id, 'lic_1');
  assert.equal(payload.managed_key, 'sk-or-test');
  const { token_signature: tokenSignature, ...signedPayload } = payload;
  assert.ok(tokenSignature.startsWith('ed25519:'));
  assert.equal(
    crypto.verify(
      null,
      Buffer.from(stableStringify(signedPayload), 'utf8'),
      tokenSigningKey.publicKey,
      Buffer.from(tokenSignature.slice('ed25519:'.length), 'base64url'),
    ),
    true,
  );
  signedPayload.managed_key = 'sk-or-tampered';
  assert.equal(
    crypto.verify(
      null,
      Buffer.from(stableStringify(signedPayload), 'utf8'),
      tokenSigningKey.publicKey,
      Buffer.from(tokenSignature.slice('ed25519:'.length), 'base64url'),
    ),
    false,
  );
});

test('encodeLicenseToken omits managed_key when none is given', () => {
  const payload = decode(encodeLicenseToken({ license_id: 'lic_2' }));
  assert.equal(payload.entitlement.license_id, 'lic_2');
  assert.ok(!('managed_key' in payload));
});

test('encodeLicenseToken ignores blank managed keys', () => {
  const payload = decode(encodeLicenseToken({ license_id: 'lic_3' }, '   '));
  assert.ok(!('managed_key' in payload));
});

test('desktop sign-in entitlement targets the Chotu account product', () => {
  const entitlement = desktopEntitlementFromSubscription(
    { uid: 'user_1', email: 'owner@example.com' },
    undefined,
  );
  assert.equal(entitlement.product_id, 'chotu');
});

test('managed desktop login fails closed until its scoped key is active', () => {
  assert.throws(
    () => desktopManagedKey(
      { access: { managedKeys: true }, managedApiKey: { status: 'provisioning' } },
      null,
    ),
    (error) => error.statusCode === 409 && error.code === 'managed_key_pending',
  );
});

test('managed desktop login requires the server-side scoped secret', () => {
  assert.throws(
    () => desktopManagedKey(
      { access: { managedKeys: true }, managedApiKey: { status: 'active' } },
      null,
    ),
    (error) => error.statusCode === 503 && error.code === 'managed_key_unavailable',
  );
  assert.equal(
    desktopManagedKey(
      { access: { managedKeys: true }, managedApiKey: { status: 'active' } },
      { apiKey: '  sk-or-user  ' },
    ),
    'sk-or-user',
  );
});

test('BYOK desktop login never requires a managed credential', () => {
  assert.equal(desktopManagedKey({ access: { managedKeys: false } }, null), null);
});

test('no subscription yields a download-enabled trial', () => {
  const window = desktopEntitlementWindow(undefined);
  assert.equal(window.status, 'trialing');
  assert.equal(window.downloadEnabled, true);
});

test('pending subscription stays in trial', () => {
  const window = desktopEntitlementWindow({ status: 'pending' });
  assert.equal(window.status, 'trialing');
});

test('BYOK plan grants perpetual download-enabled access', () => {
  const window = desktopEntitlementWindow({
    status: 'active',
    plan: 'byok',
    billingMode: 'byok',
    access: { localApp: true, managedKeys: false },
  });
  assert.equal(window.status, 'active');
  assert.equal(window.downloadEnabled, true);
  assert.ok(new Date(window.updatesUntil).getTime() > Date.now() + 1000 * 60 * 60 * 24 * 365);
});

test('active paid plan with a future period end is active', () => {
  const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString();
  const window = desktopEntitlementWindow({
    status: 'active',
    plan: 'chotu',
    currentPeriodEnd: future,
    access: { localApp: true, managedKeys: true },
  });
  assert.equal(window.status, 'active');
  assert.equal(window.updatesUntil, future);
});

test('expired paid plan is blocked', () => {
  const past = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
  const window = desktopEntitlementWindow({
    status: 'active',
    plan: 'chotu',
    currentPeriodEnd: past,
    access: { localApp: true, managedKeys: true },
  });
  assert.equal(window, null);
});

test('local app explicitly revoked is blocked', () => {
  const window = desktopEntitlementWindow({ status: 'active', access: { localApp: false } });
  assert.equal(window, null);
});
