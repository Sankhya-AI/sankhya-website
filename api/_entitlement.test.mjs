import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeAccessPatch, addDaysIso } from './_entitlement.js';

test('activeAccessPatch grants full managed access', () => {
  const periodEndIso = addDaysIso(31);
  const patch = activeAccessPatch({ customerId: 'cust_1', paymentId: 'pay_1', periodEndIso });
  assert.equal(patch.status, 'active');
  assert.equal(patch.plan, 'chotu');
  assert.equal(patch.billingMode, 'razorpay');
  assert.equal(patch.razorpayCustomerId, 'cust_1');
  assert.equal(patch.razorpayPaymentId, 'pay_1');
  assert.equal(patch.currentPeriodEnd, periodEndIso);
  assert.deepEqual(patch.access, {
    localApp: true,
    updates: true,
    support: true,
    managedKeys: true,
    chotuApi: true,
  });
  // Must not clobber usage mirrors.
  assert.ok(!('usage' in patch));
});

test('addDaysIso advances the date', () => {
  const from = new Date('2026-01-01T00:00:00.000Z');
  assert.equal(addDaysIso(31, from), new Date('2026-02-01T00:00:00.000Z').toISOString());
});
