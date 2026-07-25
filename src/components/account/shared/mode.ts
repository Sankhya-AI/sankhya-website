import { Boxes, Gauge, KeyRound, Laptop, ReceiptText, UserRound, type LucideIcon } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { ChotuSubscription } from '@/lib/firebase';

export type DashboardMode =
  | 'loading'
  | 'signed-out'
  | 'choose-plan'
  | 'pending'
  | 'local'
  | 'byok'
  | 'managed'
  | 'expired';

export type ReadyMode = Exclude<DashboardMode, 'loading' | 'signed-out'>;

export type NavigationItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export const ACCOUNT_NAVIGATION: NavigationItem[] = [
  { path: 'overview', label: 'Overview', icon: Gauge },
  { path: 'desktop', label: 'Chotu Desktop', icon: Laptop },
  { path: 'models', label: 'Your models', icon: Boxes },
  { path: 'sankhya-key', label: 'Sankhya Key', icon: KeyRound },
  { path: 'billing', label: 'Plan & billing', icon: ReceiptText },
  { path: 'profile', label: 'Personal info', icon: UserRound },
];

export const MODE_COPY: Record<ReadyMode, { label: string; title: string; detail: string; tone: 'ready' | 'attention' | 'neutral' }> = {
  'choose-plan': {
    label: 'Choose access',
    title: 'Choose how Chotu connects to models',
    detail: 'Use managed Sankhya Key access or connect your own provider key inside Chotu.',
    tone: 'attention',
  },
  pending: {
    label: 'Confirming',
    title: 'Your account access is being confirmed',
    detail: 'Payment and entitlement checks run against the server before managed access turns on.',
    tone: 'attention',
  },
  local: {
    label: 'Desktop access',
    title: 'Chotu Desktop is available',
    detail: 'Your current entitlement includes the local app. Choose a model connection when you are ready.',
    tone: 'neutral',
  },
  byok: {
    label: 'Own key active',
    title: 'Chotu is ready for your provider key',
    detail: 'Desktop access, updates, and support are active. Add your provider key in Chotu Settings.',
    tone: 'ready',
  },
  managed: {
    label: 'Paid Chotu active',
    title: 'Chotu and Sankhya Key are ready',
    detail: 'Managed model access, monthly credits, updates, and support follow this account.',
    tone: 'ready',
  },
  expired: {
    label: 'Renewal needed',
    title: 'Local access remains available',
    detail: 'Renew paid Chotu for Sankhya Key and hosted services, or switch to your own provider key.',
    tone: 'attention',
  },
};

export function getDashboardMode(
  authResolved: boolean,
  user: User | null,
  subscription: ChotuSubscription | null,
): DashboardMode {
  if (!authResolved) return 'loading';
  if (!user) return 'signed-out';
  if (!subscription) return 'loading';
  if (subscription.status === 'expired') return 'expired';
  if (subscription.plan === 'byok' || subscription.billingMode === 'byok') return 'byok';
  if (subscription.access.managedKeys) return 'managed';
  if (subscription.status === 'pending') return 'pending';
  if (subscription.access.localApp) return 'local';
  return 'choose-plan';
}
