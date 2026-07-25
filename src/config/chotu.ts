export const CHOTU_MANAGED_PRICE_INR = 1_999;

// Customers buy credits, never dollars. What a credit costs us upstream, and the
// margin between that and the plan price, are server-only facts: this file is
// compiled into the public bundle, so a USD figure here would publish the margin
// to anyone who opens devtools. Conversion lives in api/_credits.js.
export const CHOTU_MANAGED_MONTHLY_CREDITS = 2_000;

export const CHOTU_LAUNCH_TRIAL_DAYS = 30;

export const CHOTU_SUPPORTED_PLATFORM = {
  label: 'Mac',
  detail: 'Apple silicon',
  artifact: 'chotu-darwin-arm64.dmg',
} as const;

export function formatCredits(credits: number): string {
  return Math.max(Math.round(credits), 0).toLocaleString('en-IN');
}
