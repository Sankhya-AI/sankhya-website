import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { NavLink } from 'react-router';
import { UserRound } from 'lucide-react';
import { ROUTES } from '@/content/site';
import { ACCOUNT_NAVIGATION, MODE_COPY, type ReadyMode } from './shared/mode';
import { AccountNotice } from './shared/primitives';

function DashboardNavigation() {
  return (
    <aside className="z-30 border-b border-[#e1e6ea] bg-white lg:sticky lg:top-[88px] lg:h-[calc(100svh-88px)] lg:border-r lg:border-b-0">
      <div className="hidden border-b border-[#e1e6ea] px-5 py-6 lg:block">
        <p className="text-[12px] font-semibold text-[#111820]">Account</p>
        <div className="mt-3 flex items-center gap-3">
          <img src="/assets/plank-icon.svg" alt="" className="size-9" width="36" height="36" />
          <div>
            <p className="text-[13px] font-semibold text-[#1f2933]">Sankhya</p>
            <p className="mt-0.5 text-[11px] text-[#6b7782]">Product control center</p>
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:grid lg:p-4" aria-label="Account sections">
        {ACCOUNT_NAVIGATION.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={`${ROUTES.account}/${path}`}
            className={({ isActive }) =>
              `flex min-h-10 shrink-0 items-center gap-2.5 rounded-[9px] border px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b7a5] ${
                isActive
                  ? 'border-[#e1e6ea] bg-[#eef1f3] text-[#111820]'
                  : 'border-transparent text-[#404b55] hover:border-[#e1e6ea] hover:bg-[#eef1f3] hover:text-[#111820]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`size-4 ${isActive ? 'text-[#c46a36]' : 'text-[#7b8791]'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function PageHeader({ user, mode, profileName }: { user: User; mode: ReadyMode; profileName: string }) {
  const state = MODE_COPY[mode];
  return (
    <header className="flex flex-col justify-between gap-5 border-b border-[#e1e6ea] pb-[18px] sm:flex-row sm:items-end">
      <div>
        <h1 className="chotu-dashboard__title text-[clamp(28px,3vw,36px)] leading-none text-[#17202a]">Account</h1>
        <p className="mt-2 text-[13.5px] leading-5 text-[#65727d]">Download Plank and Chotu, manage model access, and review your account.</p>
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

export function AccountShell({
  user,
  mode,
  profileName,
  message,
  children,
}: {
  user: User;
  mode: ReadyMode;
  profileName: string;
  message: string;
  children: ReactNode;
}) {
  return (
    <div className="chotu-dashboard min-h-[calc(100svh-96px)] bg-[#fbfcfd] text-[#1f2933] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <DashboardNavigation />
      <div className="min-w-0">
        <div className="mx-auto w-full max-w-[1012px] px-4 py-7 sm:px-7 lg:px-9 lg:py-10">
          <div className="space-y-[18px]">
            <PageHeader user={user} mode={mode} profileName={profileName} />
            <AccountNotice message={message} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
