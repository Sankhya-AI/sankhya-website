import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MANAGED_MONTHLY_CREDITS,
  TOPUP_PACKS,
  creditBalance,
  creditsForTopUpInr,
  creditsToUpstreamUsd,
  legacyUsdCleanupPatch,
  upstreamLimitUsd,
  upstreamUsdToCredits,
} from './_credits.js';

test('a full monthly grant buys exactly the upstream capacity we budgeted', () => {
  // The margin lives here and nowhere the client can read: a whole grant must
  // cost us the budgeted upstream amount, never more.
  assert.equal(MANAGED_MONTHLY_CREDITS, 2_000);
  assert.equal(creditsToUpstreamUsd(MANAGED_MONTHLY_CREDITS), 12);
  assert.equal(upstreamUsdToCredits(12), 2_000);
});

test('usage rounds up so a partial credit can never be spent for free', () => {
  assert.equal(upstreamUsdToCredits(0.0001), 1);
  assert.equal(upstreamUsdToCredits(0.006), 1);
  assert.equal(upstreamUsdToCredits(0.0061), 2);
  assert.equal(upstreamUsdToCredits(0), 0);
  assert.equal(upstreamUsdToCredits(-5), 0);
  assert.equal(upstreamUsdToCredits('nonsense'), 0);
});

test('top-up packs map rupees to credits without publishing a dollar price', () => {
  assert.deepEqual(
    TOPUP_PACKS.map((pack) => [pack.inr, pack.credits]),
    [[499, 500], [999, 1_000], [1_999, 2_000]],
  );
  assert.equal(creditsForTopUpInr(999), 1_000);
  assert.equal(creditsForTopUpInr(12345), 0);
  // Each pack's credits must cost us exactly the pack's upstream budget.
  for (const pack of TOPUP_PACKS) {
    assert.equal(creditsToUpstreamUsd(pack.credits), pack.upstreamUsd);
  }
});

test('upstream limit prefers the private doc and falls back for legacy records', () => {
  assert.equal(
    upstreamLimitUsd({ privateData: { creditLimitUsd: 15 }, subscriptionData: {}, fallbackUsd: 12 }),
    15,
  );
  // A customer whose document predates the split still syncs the right limit.
  assert.equal(
    upstreamLimitUsd({
      privateData: undefined,
      subscriptionData: { managedApiKey: { creditLimitUsd: 18 } },
      fallbackUsd: 12,
    }),
    18,
  );
  assert.equal(upstreamLimitUsd({ privateData: {}, subscriptionData: {}, fallbackUsd: 12 }), 12);
});

test('legacy USD fields are deleted from the client-readable document', () => {
  const FieldValue = { delete: () => 'DELETE_SENTINEL' };

  const patch = legacyUsdCleanupPatch(FieldValue);

  assert.equal(patch.managedApiKey.creditLimitUsd, 'DELETE_SENTINEL');
  assert.equal(patch.usage.apiSpendUsd, 'DELETE_SENTINEL');
});

test('a client balance exposes credits only and never goes negative', () => {
  const balance = creditBalance({ grantedCredits: 2_000, usedCredits: 250 });

  assert.deepEqual(balance, {
    grantedCredits: 2_000,
    usedCredits: 250,
    remainingCredits: 1_750,
  });
  // Overspend clamps rather than revealing a negative (and thus the real cost).
  assert.deepEqual(creditBalance({ grantedCredits: 100, usedCredits: 500 }), {
    grantedCredits: 100,
    usedCredits: 100,
    remainingCredits: 0,
  });
  for (const forbidden of ['usd', 'cost', 'upstream', 'margin']) {
    assert.ok(!JSON.stringify(balance).toLowerCase().includes(forbidden));
  }
});
