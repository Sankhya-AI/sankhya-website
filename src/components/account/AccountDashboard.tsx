import { useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  Download,
  Gauge,
  KeyRound,
  Laptop,
  LogOut,
  Plus,
  ReceiptText,
  Save,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChotuOrb } from '@/components/ChotuOrb';
import {
  CHOTU_MANAGED_MONTHLY_CREDIT_USD,
  CHOTU_MANAGED_PRICE_INR,
  CHOTU_SUPPORTED_PLATFORM,
} from '@/config/chotu';
import { CUSTOMER_DISPLAY_NAME_MAX_LENGTH, normalizeCustomerDisplayName } from '@/lib/customer';
import {
  TOPUP_PACKS,
  type ChotuSubscription,
  type TopUpUsd,
} from '@/lib/firebase';

type DashboardMode =
  | 'loading'
  | 'signed-out'
  | 'choose-plan'
  | 'pending'
  | 'local'
  | 'byok'
  | 'managed'
  | 'expired';

type ReadyMode = Exclude<DashboardMode, 'loading' | 'signed-out'>;

type NavigationItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type AccountDashboardProps = {
  authResolved: boolean;
  user: User | null;
  subscription: ChotuSubscription | null;
  message: string;
  hasAccountServices: boolean;
  signInBusy: boolean;
  planBusy: boolean;
  downloadBusy: boolean;
  profileName: string;
  profileBusy: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onDownload: () => void;
  onSelectByok: () => void;
  onOpenManagedCheckout: () => void;
  onTopUp: (usd: TopUpUsd) => void;
  onProfileNameChange: (name: string) => void;
  onSaveProfile: () => void;
};

const ACCOUNT_NAVIGATION: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'desktop', label: 'Chotu Desktop', icon: Laptop },
  { id: 'sankhya-key', label: 'Sankhya Key', icon: KeyRound },
  { id: 'billing', label: 'Plan & billing', icon: ReceiptText },
  { id: 'profile', label: 'Personal info', icon: UserRound },
];

const MODE_COPY: Record<ReadyMode, { label: string; title: string; detail: string; tone: 'ready' | 'attention' | 'neutral' }> = {
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

const CARD_CLASS = 'rounded-lg border border-[#e1e6ea] bg-white p-5 shadow-none';
const PRIMARY_BUTTON =
  'min-h-10 rounded-[7px] border border-[#111820] bg-[#111820] px-4 text-[13px] font-medium text-white hover:bg-[#2b333c]';
const SECONDARY_BUTTON =
  'min-h-10 rounded-[7px] border border-[#d6dee4] bg-white px-4 text-[13px] font-medium text-[#1f2933] hover:bg-[#eef1f3]';

const INTEGER_FORMATTER = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const COMPACT_FORMATTER = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });

function getDashboardMode(
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

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

function formatMoney(value: number) {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
}

function StatusPill({ children, tone }: { children: ReactNode; tone: 'ready' | 'attention' | 'neutral' }) {
  const toneClass = {
    ready: 'bg-[#eef6f2] text-[#2f7b60]',
    attention: 'bg-[#f5f0ed] text-[#9b5a34]',
    neutral: 'bg-[#f1f3f5] text-[#5d6974]',
  }[tone];

  return (
    <span className={`inline-flex min-h-[30px] items-center rounded-full px-3 text-[12px] font-semibold ${toneClass}`}>
      {children}
    </span>
  );
}

function useActiveSection(navigation: NavigationItem[]) {
  const [activeSection, setActiveSection] = useState(navigation[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.15, 0.35] },
    );
    navigation.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [navigation]);

  return { activeSection, setActiveSection };
}

function DashboardNavigation({
  activeSection,
  navigation,
  onNavigate,
}: {
  activeSection: string;
  navigation: NavigationItem[];
  onNavigate: (id: string) => void;
}) {
  return (
    <aside className="z-30 border-b border-[#e1e6ea] bg-white lg:sticky lg:top-[88px] lg:h-[calc(100svh-88px)] lg:border-r lg:border-b-0">
      <div className="hidden border-b border-[#e1e6ea] px-5 py-6 lg:block">
        <p className="text-[12px] font-semibold text-[#111820]">Account</p>
        <div className="mt-3 flex items-center gap-3">
          <ChotuOrb size="sm" />
          <div>
            <p className="text-[13px] font-semibold text-[#1f2933]">Chotu</p>
            <p className="mt-0.5 text-[11px] text-[#6b7782]">Control center</p>
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:grid lg:p-4" aria-label="Account sections">
        {navigation.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => onNavigate(id)}
              className={`flex min-h-10 shrink-0 items-center gap-2.5 rounded-[9px] border px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b7a5] ${
                active
                  ? 'border-[#e1e6ea] bg-[#eef1f3] text-[#111820]'
                  : 'border-transparent text-[#404b55] hover:border-[#e1e6ea] hover:bg-[#eef1f3] hover:text-[#111820]'
              }`}
            >
              <Icon className={`size-4 ${active ? 'text-[#c46a36]' : 'text-[#7b8791]'}`} />
              {label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function DashboardShell({
  children,
  navigation,
}: {
  children: ReactNode;
  navigation: NavigationItem[];
}) {
  const { activeSection, setActiveSection } = useActiveSection(navigation);

  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    if (!targetId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="chotu-dashboard min-h-[calc(100svh-96px)] bg-[#fbfcfd] text-[#1f2933] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <DashboardNavigation activeSection={activeSection} navigation={navigation} onNavigate={setActiveSection} />
      <div className="min-w-0">
        <div className="mx-auto w-full max-w-[1012px] px-4 py-7 sm:px-7 lg:px-9 lg:py-10">{children}</div>
      </div>
    </div>
  );
}

function SectionHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-[15px] font-semibold text-[#111820]">{title}</h2>
      <p className="mt-1 text-[13px] leading-5 text-[#6b7782]">{detail}</p>
    </div>
  );
}

function AccountNotice({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="status" aria-live="polite" className="rounded-lg border border-[#d7b7a5] bg-[#f5f0ed] px-4 py-3 text-[13px] leading-5 text-[#70452e]">
      {message}
    </div>
  );
}

function PageHeader({ user, mode, profileName }: { user: User; mode: ReadyMode; profileName: string }) {
  const state = MODE_COPY[mode];
  return (
    <header className="flex flex-col justify-between gap-5 border-b border-[#e1e6ea] pb-[18px] sm:flex-row sm:items-end">
      <div>
        <h1 className="chotu-dashboard__title text-[clamp(28px,3vw,36px)] leading-none text-[#17202a]">Account</h1>
        <p className="mt-2 text-[13.5px] leading-5 text-[#65727d]">Manage Chotu Desktop, Sankhya Key usage, billing, and personal information.</p>
      </div>
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="size-9 rounded-full border border-[#d6dee4] object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid size-9 place-items-center rounded-full border border-[#d6dee4] bg-white"><UserRound className="size-4 text-[#6b7782]" /></span>
        )}
        <div className="min-w-0">
          <p className="max-w-48 truncate text-[13px] font-semibold text-[#111820]">{profileName || user.displayName || 'Your account'}</p>
          <p className="mt-0.5 text-[11px] text-[#6b7782]">{state.label}</p>
        </div>
      </div>
    </header>
  );
}

function AuthLoading() {
  return (
    <div className="chotu-dashboard grid min-h-[calc(100svh-96px)] place-items-center bg-[#fbfcfd] px-4 py-12" aria-live="polite">
      <div className="text-center">
        <img src="/assets/sankhya-logo.png" alt="" className="mx-auto size-10" />
        <p className="mt-5 text-[13px] font-medium text-[#404b55]">Checking your session…</p>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.38l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.92A6.01 6.01 0 0 1 6.08 12c0-.67.12-1.32.31-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.53l3.35-2.61Z" />
      <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z" />
    </svg>
  );
}

function SignedOutAuth({
  message,
  hasAccountServices,
  signInBusy,
  onSignIn,
}: Pick<AccountDashboardProps, 'message' | 'hasAccountServices' | 'signInBusy' | 'onSignIn'>) {
  return (
    <div className="chotu-dashboard grid min-h-[calc(100svh-96px)] place-items-center bg-[#fbfcfd] px-4 py-12 text-[#1f2933]">
      <div className="w-full max-w-[420px]">
        <div className="text-center">
          <img src="/assets/sankhya-logo.png" alt="" className="mx-auto size-11" />
          <h1 className="chotu-dashboard__title mt-6 text-[34px] leading-none text-[#17202a]">Sign in to Sankhya</h1>
          <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-5 text-[#65727d]">Continue with Google to access your Chotu dashboard.</p>
        </div>

        <section className={`${CARD_CLASS} mt-7`}>
          <Button type="button" onClick={onSignIn} disabled={signInBusy || !hasAccountServices} className={`${PRIMARY_BUTTON} w-full justify-center`}>
            <GoogleMark />{signInBusy ? 'Opening Google' : 'Continue with Google'}
          </Button>
          <p className="mt-4 text-center text-[12px] leading-5 text-[#6b7782]">New to Sankhya? Your account is created automatically when you continue.</p>
          {!hasAccountServices ? <p className="mt-3 text-center text-[12px] text-[#9b5a34]">Account services are not configured for this deployment.</p> : null}
        </section>

        {message ? <div className="mt-4"><AccountNotice message={message} /></div> : null}
        <p className="mt-6 text-center text-[11px] leading-5 text-[#87919a]">Your Google identity is used for account access and private downloads.</p>
      </div>
    </div>
  );
}

function AccessTile({ enabled, label, value }: { enabled: boolean; label: string; value: string }) {
  const Icon = enabled ? CheckCircle2 : Circle;
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-lg border border-[#e1e6ea] bg-[#f7f8f9] px-4 py-3">
      <Icon className={`size-4 shrink-0 ${enabled ? 'text-[#2f7b60]' : 'text-[#9aa4ad]'}`} />
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-[#404b55]">{label}</p>
        <p className="mt-0.5 truncate text-[11px] text-[#6b7782]">{value}</p>
      </div>
    </div>
  );
}

function OverviewSection({ subscription, mode }: { subscription: ChotuSubscription; mode: ReadyMode }) {
  const state = MODE_COPY[mode];
  const managedPreparing = mode === 'managed' && subscription.managedApiKey?.status !== 'active';
  const modelValue = mode === 'managed' ? 'Sankhya Key' : mode === 'byok' ? 'Own provider key' : 'Not selected';

  return (
    <section id="overview" className="scroll-mt-36 space-y-3 lg:scroll-mt-24">
      <article className={CARD_CLASS}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#e1e6ea] bg-[#f7f8f9]"><ShieldCheck className="size-5 text-[#c46a36]" /></span>
            <div>
              <p className="text-[11px] font-semibold text-[#6b7782]">Control center</p>
              <h2 className="mt-1 text-[20px] font-semibold leading-7 text-[#111820]">{managedPreparing ? 'Sankhya Key is preparing' : state.title}</h2>
              <p className="mt-1 max-w-2xl text-[13px] leading-5 text-[#6b7782]">{managedPreparing ? 'Managed model access is being prepared against your paid Chotu entitlement.' : state.detail}</p>
            </div>
          </div>
          <StatusPill tone={managedPreparing ? 'attention' : state.tone}>{managedPreparing ? 'Setting up' : state.label}</StatusPill>
        </div>
      </article>

      <div className="grid gap-3 sm:grid-cols-2">
        <AccessTile enabled={subscription.access.localApp} label="Chotu Desktop" value={subscription.access.localApp ? 'Download available' : 'Not included'} />
        <AccessTile enabled={subscription.access.updates} label="Updates" value={subscription.access.updates ? `Included through ${formatDate(subscription.updateUntil)}` : 'Not included'} />
        <AccessTile enabled={subscription.access.support} label="Support" value={subscription.access.support ? 'Included' : 'Not included'} />
        <AccessTile enabled={mode === 'managed' || mode === 'byok'} label="Model connection" value={modelValue} />
      </div>
    </section>
  );
}

function DesktopSection({ downloadBusy, onDownload }: Pick<AccountDashboardProps, 'downloadBusy' | 'onDownload'>) {
  return (
    <section id="desktop" className="scroll-mt-36 lg:scroll-mt-24">
      <SectionHeading title="Chotu Desktop" detail="Published builds and account-verified downloads." />
      <article className={CARD_CLASS}>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eef6f2] text-[#2f7b60]"><Laptop className="size-5" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-semibold text-[#111820]">Chotu for Mac</h2>
                <StatusPill tone="ready">Published</StatusPill>
              </div>
              <p className="mt-1 text-[12px] text-[#6b7782]">{CHOTU_SUPPORTED_PLATFORM.detail} · DMG · private one-use link</p>
            </div>
          </div>
          <Button type="button" onClick={onDownload} disabled={downloadBusy} className={`${PRIMARY_BUTTON} shrink-0`}>
            <Download className="size-4" />{downloadBusy ? 'Preparing link' : 'Download for Mac'}
          </Button>
        </div>

        <div className="mt-5 grid gap-0 overflow-hidden rounded-lg border border-[#e1e6ea] bg-[#f7f8f9] sm:grid-cols-3">
          {['Open the DMG', 'Drag Chotu to Applications', 'Launch Chotu'].map((step, index) => (
            <div key={step} className="flex min-h-14 items-center gap-2 border-b border-[#e1e6ea] px-3 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[10px] font-semibold text-[#c46a36]">{index + 1}</span>
              <span className="text-[12px] text-[#404b55]">{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#e1e6ea] pt-4">
          <span className="text-[12px] text-[#6b7782]">Windows x64</span>
          <span className="text-[11px] font-medium text-[#9b5a34]">Not published</span>
        </div>
      </article>
    </section>
  );
}

function SankhyaKeySection({ subscription, mode, onTopUp }: { subscription: ChotuSubscription; mode: ReadyMode; onTopUp: (usd: TopUpUsd) => void }) {
  const managed = mode === 'managed';
  const keyStatus = subscription.managedApiKey?.status;
  const creditLimit = subscription.managedApiKey?.creditLimitUsd ?? CHOTU_MANAGED_MONTHLY_CREDIT_USD;
  const spend = subscription.usage.apiSpendUsd;
  const remaining = Math.max(creditLimit - spend, 0);
  const usagePercent = creditLimit > 0 ? Math.min((spend / creditLimit) * 100, 100) : 0;
  const keyReady = keyStatus === 'active';

  return (
    <section id="sankhya-key" className="scroll-mt-36 lg:scroll-mt-24">
      <SectionHeading title="Sankhya Key" detail="Managed model usage included with paid Chotu." />
      {!managed ? (
        <article className={CARD_CLASS}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="grid size-10 place-items-center rounded-lg border border-[#e1e6ea] bg-[#f7f8f9]"><KeyRound className="size-5 text-[#6b7782]" /></span>
              <div>
                <h2 className="text-[15px] font-semibold text-[#111820]">{mode === 'byok' ? 'You are using your own provider key' : 'Sankhya Key is not active'}</h2>
                <p className="mt-1 text-[12px] leading-5 text-[#6b7782]">{mode === 'byok' ? 'Managed usage and limits stay hidden because billing happens with your provider.' : 'Choose paid Chotu to see managed limits, requests, tokens, remaining credits, and top-ups here.'}</p>
              </div>
            </div>
            <a href="#billing" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-[7px] border border-[#d6dee4] bg-white px-4 text-[13px] font-medium text-[#1f2933] hover:bg-[#eef1f3]">
              Review plans<ArrowRight className="size-4" />
            </a>
          </div>
        </article>
      ) : (
        <article className={CARD_CLASS}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-4">
              <span className="grid size-10 place-items-center rounded-lg bg-[#eef6f2]"><KeyRound className="size-5 text-[#2f7b60]" /></span>
              <div>
                <h2 className="text-[15px] font-semibold text-[#111820]">Managed Sankhya Key</h2>
                <p className="mt-1 text-[12px] text-[#6b7782]">Usage for the current paid Chotu period.</p>
              </div>
            </div>
            <StatusPill tone={keyReady ? 'ready' : 'attention'}>{keyReady ? 'Active' : keyStatus || 'Setting up'}</StatusPill>
          </div>

          <div className="mt-5 grid overflow-hidden rounded-lg border border-[#e1e6ea] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Monthly limit', formatMoney(creditLimit)],
              ['Remaining', formatMoney(remaining)],
              ['Requests', INTEGER_FORMATTER.format(subscription.usage.requests)],
              ['Tokens used', COMPACT_FORMATTER.format(subscription.usage.tokens)],
            ].map(([label, value]) => (
              <div key={label} className="min-h-20 border-b border-[#e1e6ea] bg-[#f7f8f9] p-4 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
                <p className="text-[11px] font-medium text-[#6b7782]">{label}</p>
                <p className="mt-2 text-[18px] font-semibold text-[#111820]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-[#e1e6ea] p-4">
            <div className="flex items-center justify-between gap-4 text-[12px]">
              <span className="font-medium text-[#404b55]">{formatMoney(spend)} used</span>
              <span className="text-[#6b7782]">Resets {formatDate(subscription.currentPeriodEnd)}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8ecef]" role="progressbar" aria-label="Managed Sankhya Key credit usage" aria-valuemin={0} aria-valuemax={creditLimit} aria-valuenow={Math.min(spend, creditLimit)}>
              <div className="h-full rounded-full bg-[#c46a36]" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>

          <div className="mt-5 border-t border-[#e1e6ea] pt-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><h3 className="text-[13px] font-semibold text-[#111820]">Add credits this period</h3><p className="mt-1 text-[11px] text-[#6b7782]">Top-ups add to the current managed limit.</p></div>
              <div className="flex flex-wrap gap-2">
                {TOPUP_PACKS.map((pack) => (
                  <Button key={pack.usd} type="button" variant="outline" onClick={() => onTopUp(pack.usd)} disabled={!keyReady} className="min-h-9 rounded-[7px] border-[#d6dee4] bg-white px-3 text-[12px] font-medium text-[#1f2933] hover:bg-[#eef1f3]">
                    <Plus className="size-3.5" />{formatMoney(pack.usd)} · ₹{pack.inr}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

function Feature({ children }: { children: ReactNode }) {
  return <li className="flex items-start gap-2 text-[12px] leading-5 text-[#5b6772]"><Check className="mt-1 size-3.5 shrink-0 text-[#2f7b60]" />{children}</li>;
}

function PlanCard({
  active,
  children,
  description,
  name,
  price,
}: {
  active: boolean;
  children: ReactNode;
  description: string;
  name: string;
  price: string;
}) {
  return (
    <article className={`flex min-h-[300px] flex-col rounded-lg border p-5 ${active ? 'border-[#9fcab7] bg-[#f6fbf8]' : 'border-[#e1e6ea] bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="text-[15px] font-semibold text-[#111820]">{name}</h3><p className="mt-1 text-[12px] text-[#6b7782]">{description}</p></div>
        {active ? <StatusPill tone="ready">Active</StatusPill> : null}
      </div>
      <p className="mt-5 text-[24px] font-semibold text-[#111820]">{price}</p>
      {children}
    </article>
  );
}

function BillingSection({
  mode,
  planBusy,
  subscription,
  onOpenManagedCheckout,
  onSelectByok,
}: Pick<AccountDashboardProps, 'planBusy' | 'onOpenManagedCheckout' | 'onSelectByok'> & {
  mode: ReadyMode;
  subscription: ChotuSubscription;
}) {
  const managed = mode === 'managed';
  const byok = mode === 'byok';
  const planLabel = managed ? 'Paid Chotu + Sankhya Key' : byok ? 'Bring your own key' : 'No model plan selected';
  const periodLabel = managed ? 'Current period ends' : 'Updates through';
  const periodValue = managed ? subscription.currentPeriodEnd : subscription.updateUntil;

  return (
    <section id="billing" className="scroll-mt-36 lg:scroll-mt-24">
      <SectionHeading title="Plan & billing" detail="Choose model access and review the entitlement stored for this account." />
      <div className="grid gap-3 md:grid-cols-2">
        <PlanCard active={managed} name="Paid Chotu" description="Includes managed Sankhya Key" price={`₹${CHOTU_MANAGED_PRICE_INR.toLocaleString('en-IN')} / month`}>
          <ul className="mt-5 space-y-1.5 border-t border-[#e1e6ea] pt-4">
            <Feature>Managed monthly model credits</Feature>
            <Feature>Chotu Desktop, updates, and support</Feature>
            <Feature>Sankhya Key usage, limits, and top-ups</Feature>
          </ul>
          <Button type="button" onClick={onOpenManagedCheckout} className={`mt-auto w-full justify-center ${managed ? SECONDARY_BUTTON : PRIMARY_BUTTON}`}>
            {managed ? 'Open Razorpay plan' : 'Choose paid Chotu'}<ArrowUpRight className="size-4" />
          </Button>
        </PlanCard>

        <PlanCard active={byok} name="Bring your own key" description="Model billing stays with your provider" price="Free">
          <ul className="mt-5 space-y-1.5 border-t border-[#e1e6ea] pt-4">
            <Feature>Add your provider key inside Chotu</Feature>
            <Feature>Chotu Desktop, updates, and support</Feature>
            <Feature>No managed usage or Sankhya Key credits</Feature>
          </ul>
          <Button type="button" variant="outline" onClick={onSelectByok} disabled={planBusy || byok} className={`mt-auto w-full justify-center ${SECONDARY_BUTTON}`}>
            {byok ? 'Own-key plan active' : planBusy ? 'Activating' : 'Use my own key'}
          </Button>
        </PlanCard>
      </div>

      <article className={`${CARD_CLASS} mt-3`}>
        <h3 className="text-[15px] font-semibold text-[#111820]">Account access</h3>
        <dl className="mt-4 divide-y divide-[#e1e6ea] overflow-hidden rounded-lg border border-[#e1e6ea]">
          {[
            ['Plan', planLabel],
            ['Account status', subscription.status],
            ['Billing mode', subscription.billingMode],
            [periodLabel, formatDate(periodValue)],
          ].map(([label, value]) => (
            <div key={label} className="grid min-h-[54px] gap-1 bg-[#f7f8f9] px-3 py-2.5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:gap-[18px]">
              <dt className="text-[12px] font-medium text-[#6b7782]">{label}</dt>
              <dd className="break-words text-[13px] font-medium text-[#1f2933] sm:text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

function PersonalInfoSection({
  profileBusy,
  profileName,
  user,
  onProfileNameChange,
  onSaveProfile,
  onSignOut,
}: Pick<AccountDashboardProps, 'profileBusy' | 'profileName' | 'onProfileNameChange' | 'onSaveProfile' | 'onSignOut'> & { user: User }) {
  const savedName = user.displayName ?? '';
  const nameChanged = normalizeCustomerDisplayName(profileName) !== normalizeCustomerDisplayName(savedName);

  return (
    <section id="profile" className="scroll-mt-36 lg:scroll-mt-24">
      <SectionHeading title="Personal information" detail="The name shown across your Sankhya account and Chotu sign-in." />
      <article className={CARD_CLASS}>
        <form onSubmit={(event) => { event.preventDefault(); onSaveProfile(); }}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-medium text-[#404b55]">Name</span>
              <input
                type="text"
                value={profileName}
                onChange={(event) => onProfileNameChange(event.target.value)}
                maxLength={CUSTOMER_DISPLAY_NAME_MAX_LENGTH}
                autoComplete="name"
                className="mt-2 min-h-10 w-full rounded-[7px] border border-[#d6dee4] bg-white px-3 text-[13px] text-[#1f2933] outline-none transition focus:border-[#d7b7a5] focus:ring-4 focus:ring-[#f5f0ed]"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-[#404b55]">Email</span>
              <input
                type="email"
                value={user.email ?? ''}
                readOnly
                className="mt-2 min-h-10 w-full rounded-[7px] border border-[#e1e6ea] bg-[#f7f8f9] px-3 text-[13px] text-[#6b7782] outline-none"
              />
            </label>
          </div>
          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#e1e6ea] pt-5 sm:flex-row sm:items-center">
            <Button type="submit" disabled={profileBusy || !nameChanged || !normalizeCustomerDisplayName(profileName)} className={PRIMARY_BUTTON}>
              <Save className="size-4" />{profileBusy ? 'Saving' : 'Save changes'}
            </Button>
            <Button type="button" variant="outline" onClick={onSignOut} className={SECONDARY_BUTTON}>
              <LogOut className="size-4" />Sign out
            </Button>
          </div>
        </form>
      </article>
    </section>
  );
}

function SignedInDashboard(props: AccountDashboardProps & { user: User; subscription: ChotuSubscription; mode: ReadyMode }) {
  return (
    <div className="space-y-[18px]">
      <PageHeader user={props.user} mode={props.mode} profileName={props.profileName} />
      <AccountNotice message={props.message} />
      <OverviewSection subscription={props.subscription} mode={props.mode} />
      <DesktopSection downloadBusy={props.downloadBusy} onDownload={props.onDownload} />
      <SankhyaKeySection subscription={props.subscription} mode={props.mode} onTopUp={props.onTopUp} />
      <BillingSection
        mode={props.mode}
        subscription={props.subscription}
        planBusy={props.planBusy}
        onOpenManagedCheckout={props.onOpenManagedCheckout}
        onSelectByok={props.onSelectByok}
      />
      <PersonalInfoSection
        user={props.user}
        profileName={props.profileName}
        profileBusy={props.profileBusy}
        onProfileNameChange={props.onProfileNameChange}
        onSaveProfile={props.onSaveProfile}
        onSignOut={props.onSignOut}
      />
    </div>
  );
}

export function AccountDashboard(props: AccountDashboardProps) {
  const mode = getDashboardMode(props.authResolved, props.user, props.subscription);
  if (mode === 'loading') return <AuthLoading />;
  if (mode === 'signed-out') {
    return (
      <SignedOutAuth
        message={props.message}
        hasAccountServices={props.hasAccountServices}
        signInBusy={props.signInBusy}
        onSignIn={props.onSignIn}
      />
    );
  }

  return (
    <DashboardShell navigation={ACCOUNT_NAVIGATION}>
      {props.user && props.subscription ? (
        <SignedInDashboard {...props} user={props.user} subscription={props.subscription} mode={mode} />
      ) : null}
    </DashboardShell>
  );
}
