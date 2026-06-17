import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  desktopEntitlementWindow,
  encodeLicenseToken,
} from './_desktop-license.js';

function decode(token) {
  return JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
}

test('encodeLicenseToken wraps the managed key alongside the entitlement', () => {
  const token = encodeLicenseToken({ license_id: 'lic_1', status: 'active' }, 'sk-or-test');
  const payload = decode(token);
  assert.equal(payload.entitlement.license_id, 'lic_1');
  assert.equal(payload.managed_key, 'sk-or-test');
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
