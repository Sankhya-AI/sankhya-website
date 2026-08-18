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

export type DesktopProductId = 'chotu' | 'plank';

export type DesktopProduct = {
  id: DesktopProductId;
  name: string;
  role: string;
  detail: string;
  artifact: string;
  icon: string;
  accent: string;
};

export const DESKTOP_PRODUCTS = [
  {
    id: 'chotu',
    name: 'Chotu',
    role: 'Your local-first personal AI',
    detail: CHOTU_SUPPORTED_PLATFORM.detail,
    artifact: CHOTU_SUPPORTED_PLATFORM.artifact,
    icon: '/assets/chotu-icon.png',
    accent: '#eef6f2',
  },
  {
    id: 'plank',
    name: 'Plank',
    role: 'Your AI tutor for every course',
    detail: 'Apple silicon',
    artifact: 'plank-darwin-arm64.dmg',
    icon: '/assets/plank-icon.svg',
    accent: '#fbefe5',
  },
] as const satisfies readonly DesktopProduct[];

export function formatCredits(credits: number): string {
  return Math.max(Math.round(credits), 0).toLocaleString('en-IN');
}
