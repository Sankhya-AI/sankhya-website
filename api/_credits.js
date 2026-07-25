// Server-only credit accounting.
//
// Customers see credits; we see dollars. This file is the only place the two
// meet, and it never ships to the browser: `src/` is bundled and public, `api/`
// is not. Every USD figure — the upstream cost of a credit, the provider limit
// we provision, the margin between that and the plan price — stays here.
//
// One credit is a fixed slice of upstream capacity. A full monthly grant buys
// exactly MANAGED_MONTHLY_UPSTREAM_USD of provider usage, so a customer who
// burns every credit costs us that and no more.

export const MANAGED_MONTHLY_CREDITS = 2_000;

// What a full grant is allowed to cost us upstream. Never expose this, or the
// plan price divided by it is the margin.
const MANAGED_MONTHLY_UPSTREAM_USD = 12;

const UPSTREAM_USD_PER_CREDIT = MANAGED_MONTHLY_UPSTREAM_USD / MANAGED_MONTHLY_CREDITS;

// Top-ups stack onto the current grant. Customers see credits and rupees only;
// the USD column is what we provision upstream.
export const TOPUP_PACKS = [
  { inr: 499, credits: 500, upstreamUsd: 3 },
  { inr: 999, credits: 1_000, upstreamUsd: 6 },
  { inr: 1_999, credits: 2_000, upstreamUsd: 12 },
];

export function creditsToUpstreamUsd(credits) {
  const value = Number(credits);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Number((value * UPSTREAM_USD_PER_CREDIT).toFixed(6));
}

// Round up: a partly used credit is a used credit, so rounding can never let a
// customer draw more upstream usage than they paid for.
export function upstreamUsdToCredits(usd) {
  const value = Number(usd);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.ceil(value / UPSTREAM_USD_PER_CREDIT);
}

export function creditsForTopUpInr(inr) {
  const pack = TOPUP_PACKS.find((entry) => entry.inr === Number(inr));
  return pack ? pack.credits : 0;
}

// Where the dollars live.
//
// The client reads users/{uid}/subscriptions/chotu directly (firestore.rules
// allows it), and Firestore rules can gate documents but not fields — so a USD
// field on that document is public no matter what the UI renders. Upstream
// limits and spend therefore live in users/{uid}/secrets/{...}, which the rules
// deny to every client.
export function privateBillingRef(db, uid) {
  return db.collection('users').doc(uid).collection('secrets').doc('billing');
}

// Legacy documents carry managedApiKey.creditLimitUsd; read the private doc
// first and fall back while old records are still being migrated.
export function upstreamLimitUsd({ privateData, subscriptionData, fallbackUsd }) {
  const priv = Number(privateData?.creditLimitUsd);
  if (Number.isFinite(priv) && priv > 0) return priv;
  const legacy = Number(subscriptionData?.managedApiKey?.creditLimitUsd);
  if (Number.isFinite(legacy) && legacy > 0) return legacy;
  return Number(fallbackUsd) || 0;
}

// Strip the legacy USD fields from the client-readable document as we touch it,
// so existing customers stop exposing the margin without a backfill job.
export function legacyUsdCleanupPatch(FieldValue) {
  return {
    managedApiKey: { creditLimitUsd: FieldValue.delete() },
    usage: { apiSpendUsd: FieldValue.delete() },
  };
}

// Everything the client is allowed to know about a balance.
export function creditBalance({ grantedCredits, usedCredits }) {
  const granted = Math.max(Math.round(Number(grantedCredits) || 0), 0);
  const used = Math.min(Math.max(Math.round(Number(usedCredits) || 0), 0), granted);
  return {
    grantedCredits: granted,
    usedCredits: used,
    remainingCredits: granted - used,
  };
}
