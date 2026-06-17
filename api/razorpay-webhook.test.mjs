// Deterministic integration test of the money-critical webhook logic.
// No real secrets, no prod, no account side effects: Firestore + OpenRouter are
// faked, webhooks are signed with a local test secret.
// Run: node --experimental-test-module-mocks --test api/razorpay-webhook.test.mjs
import { test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { createFakeFirestore, fakeAdmin } from './_test-firestore.mjs';

const WEBHOOK_SECRET = 'test_whsec_123';
process.env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;
process.env.OPENROUTER_CREDIT_LIMIT_USD = '12';

let fs;
let limitCalls;

mock.module('./_firebase-admin.js', {
  namedExports: {
    admin: fakeAdmin,
    getAdminDb: () => fs.db,
    getAdminAuth: () => ({}),
    requireEnv: (name) => {
      const value = process.env[name];
      if (!value) throw new Error(`Missing ${name}`);
      return value;
    },
  },
});
mock.module('./_openrouter.js', {
  namedExports: {
    updateKeyLimit: async (hash, limit) => { limitCalls.push({ hash, limit }); return { ok: true, limit }; },
    createProvisionedKey: async () => ({ key: 'sk-or-x', hash: 'hash-x' }),
    disableKey: async () => ({ ok: true }),
  },
});

const { default: handler } = await import('./razorpay-webhook.js');

function sign(body) {
  return crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');
}

async function invoke(event, { eventId, badSignature } = {}) {
  const body = Buffer.from(JSON.stringify(event), 'utf8');
  const req = Readable.from([body]);
  req.method = 'POST';
  req.headers = {
    'x-razorpay-signature': badSignature ? 'deadbeef' : sign(body),
    ...(eventId ? { 'x-razorpay-event-id': eventId } : {}),
  };
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    setHeader() {},
  };
  await handler(req, res);
  return res;
}

function sub(uid) {
  return fs.store.get(`users/${uid}/subscriptions/chotu`);
}

function seedManaged(uid, managedApiKey) {
  fs.store.set(`users/${uid}/subscriptions/chotu`, {
    status: 'active',
    access: { localApp: true, managedKeys: true },
    managedApiKey,
  });
}

function planPayment(uid, email = 'u@x.com') {
  return { event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1', email, notes: { firebase_uid: uid } } } } };
}

function topUp(uid, usd, paymentId = `pay_top_${uid}_${usd}`) {
  return {
    event: 'payment_link.paid',
    payload: {
      payment: { entity: { id: paymentId, notes: { firebase_uid: uid, kind: 'topup', topup_usd: String(usd) } } },
      payment_link: { entity: { id: 'plink_1', notes: { firebase_uid: uid, kind: 'topup', topup_usd: String(usd) } } },
    },
  };
}

function renewal(uid) {
  return { event: 'subscription.charged', payload: { subscription: { entity: { id: 'sub_1', notes: { firebase_uid: uid } } } } };
}

beforeEach(() => {
  fs = createFakeFirestore();
  limitCalls = [];
});

test('plan payment activates entitlement and queues key provisioning', async () => {
  const res = await invoke(planPayment('u1'));
  assert.equal(res.statusCode, 200);
  const s = sub('u1');
  assert.equal(s.status, 'active');
  assert.equal(s.access.managedKeys, true);
  assert.equal(s.managedApiKey.status, 'pending');
  assert.equal(s.managedApiKey.creditLimitUsd, 12);
});

test('invalid signature is rejected', async () => {
  const res = await invoke(planPayment('u1'), { badSignature: true });
  assert.equal(res.statusCode, 401);
  assert.equal(sub('u1'), undefined);
});

test('top-up adds credits and raises the key limit immediately', async () => {
  seedManaged('u2', { status: 'active', openrouterKeyHash: 'hashA', creditLimitUsd: 12 });
  const res = await invoke(topUp('u2', 3));
  assert.equal(res.statusCode, 200);
  assert.equal(sub('u2').managedApiKey.creditLimitUsd, 15);
  assert.deepEqual(limitCalls, [{ hash: 'hashA', limit: 15 }]);
  // entitlement/access untouched by a top-up
  assert.equal(sub('u2').status, 'active');
});

test('duplicate top-up event id never double-charges credits', async () => {
  seedManaged('u3', { status: 'active', openrouterKeyHash: 'hashA', creditLimitUsd: 12 });
  await invoke(topUp('u3', 6), { eventId: 'evt_top' });
  const second = await invoke(topUp('u3', 6), { eventId: 'evt_top' });
  assert.equal(second.body.duplicate, true);
  assert.equal(sub('u3').managedApiKey.creditLimitUsd, 18); // applied once, not twice
  assert.equal(limitCalls.length, 1);
});

test('duplicate top-up payment id never double-charges credits', async () => {
  seedManaged('u6', { status: 'active', openrouterKeyHash: 'hashA', creditLimitUsd: 12 });
  await invoke(topUp('u6', 3, 'pay_same'), { eventId: 'evt_top_a' });
  const second = await invoke(topUp('u6', 3, 'pay_same'), { eventId: 'evt_top_b' });
  assert.equal(second.body.duplicate, true);
  assert.equal(sub('u6').managedApiKey.creditLimitUsd, 15);
  assert.equal(limitCalls.length, 1);
});

test('monthly renewal resets the credit limit to base', async () => {
  seedManaged('u4', { status: 'active', openrouterKeyHash: 'hashA', creditLimitUsd: 18 });
  const res = await invoke(renewal('u4'));
  assert.equal(res.statusCode, 200);
  assert.equal(sub('u4').managedApiKey.creditLimitUsd, 12);
  assert.deepEqual(limitCalls, [{ hash: 'hashA', limit: 12 }]);
});

test('top-up is ignored for non-managed accounts', async () => {
  fs.store.set('users/u5/subscriptions/chotu', { status: 'active', access: { managedKeys: false } });
  const res = await invoke(topUp('u5', 3));
  assert.equal(res.statusCode, 200);
  assert.equal(limitCalls.length, 0);
  assert.equal(sub('u5').managedApiKey?.creditLimitUsd, undefined);
});
