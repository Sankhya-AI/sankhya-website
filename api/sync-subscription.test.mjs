import { beforeEach, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createFakeFirestore, fakeAdmin } from './_test-firestore.mjs';

process.env.RAZORPAY_KEY_ID = 'rzp_test_key';
process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secret';
process.env.OPENROUTER_CREDIT_LIMIT_USD = '12';

let fs;
let decoded;
let payments;
let subscriptions;
let limitCalls;

mock.module('./_firebase-admin.js', {
  namedExports: {
    admin: fakeAdmin,
    getAdminDb: () => fs.db,
    getAdminAuth: () => ({ verifyIdToken: async () => decoded }),
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

mock.method(globalThis, 'fetch', async (url) => {
  const path = new URL(url).pathname.replace('/v1', '');
  const body = payments.get(path) || subscriptions.get(path);
  return {
    ok: Boolean(body),
    json: async () => body,
  };
});

const { default: handler } = await import('./sync-subscription.js');

function sub(uid = decoded.uid) {
  return fs.store.get(`users/${uid}/subscriptions/chotu`);
}

function seedManaged(uid, managedApiKey) {
  fs.store.set(`users/${uid}/subscriptions/chotu`, {
    status: 'active',
    access: { localApp: true, managedKeys: true },
    managedApiKey,
  });
}

async function invoke(body = {}) {
  const req = Readable.from([Buffer.from(JSON.stringify(body), 'utf8')]);
  req.method = 'POST';
  req.headers = { authorization: 'Bearer firebase-token' };
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

beforeEach(() => {
  fs = createFakeFirestore();
  decoded = { uid: 'u1', email: 'u@example.com' };
  payments = new Map();
  subscriptions = new Map();
  limitCalls = [];
});

test('captured plan payment recovery activates entitlement and queues managed key', async () => {
  payments.set('/payments/pay_plan', {
    id: 'pay_plan',
    status: 'captured',
    email: 'u@example.com',
    customer_id: 'cust_1',
    notes: {},
  });

  const res = await invoke({ paymentId: 'pay_plan' });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.recovered, 'payment');
  assert.equal(sub().status, 'active');
  assert.equal(sub().managedApiKey.status, 'pending');
});

test('captured top-up payment recovery raises managed key limit once', async () => {
  seedManaged('u1', { status: 'active', openrouterKeyHash: 'hashA', creditLimitUsd: 12 });
  payments.set('/payments/pay_top', {
    id: 'pay_top',
    status: 'captured',
    email: 'u@example.com',
    notes: { kind: 'topup', topup_usd: '3' },
  });

  const res = await invoke({ paymentId: 'pay_top' });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.recovered, 'topup');
  assert.equal(res.body.limit, 15);
  assert.equal(sub().managedApiKey.creditLimitUsd, 15);
  assert.deepEqual(limitCalls, [{ hash: 'hashA', limit: 15 }]);
});

test('captured top-up payment recovery is idempotent by Razorpay payment id', async () => {
  seedManaged('u1', { status: 'active', openrouterKeyHash: 'hashA', creditLimitUsd: 12 });
  payments.set('/payments/pay_top', {
    id: 'pay_top',
    status: 'captured',
    email: 'u@example.com',
    notes: { kind: 'topup', topup_usd: '6' },
  });

  await invoke({ paymentId: 'pay_top' });
  const second = await invoke({ paymentId: 'pay_top' });

  assert.equal(second.body.recovered, 'topup_duplicate');
  assert.equal(sub().managedApiKey.creditLimitUsd, 18);
  assert.equal(limitCalls.length, 1);
});

test('captured top-up payment for non-managed account is ignored', async () => {
  fs.store.set('users/u1/subscriptions/chotu', { status: 'active', access: { managedKeys: false } });
  payments.set('/payments/pay_top', {
    id: 'pay_top',
    status: 'captured',
    email: 'u@example.com',
    notes: { kind: 'topup', topup_usd: '3' },
  });

  const res = await invoke({ paymentId: 'pay_top' });

  assert.equal(res.body.recovered, 'topup_ignored');
  assert.equal(sub().managedApiKey?.creditLimitUsd, undefined);
  assert.equal(limitCalls.length, 0);
});
