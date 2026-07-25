import { Button } from '@/components/ui/button';
import { CARD_CLASS, PRIMARY_BUTTON } from './shared/styles';
import { AccountNotice } from './shared/primitives';

export function AuthLoading() {
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

export function SignedOutAuth({
  message,
  hasAccountServices,
  signInBusy,
  onSignIn,
}: {
  message: string;
  hasAccountServices: boolean;
  signInBusy: boolean;
  onSignIn: () => void;
}) {
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
