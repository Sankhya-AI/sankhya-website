import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Check, CreditCard, Download, FileText, LinkIcon, LogIn, LogOut } from 'lucide-react';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Seo } from '@/components/Seo';
import { ensureCustomerProfile } from '@/lib/customer';
import {
  buildCheckoutUrl,
  createDesktopLoginUrl,
  fetchChotuSubscription,
  hasFirebaseConfig,
  RAZORPAY_SUBSCRIPTION_LINK,
  signInWithGoogle,
  signOutOfFirebase,
  watchAuthState,
  type ChotuSubscription,
} from '@/lib/firebase';

const downloadOptions = [
  {
    artifact: 'chotu-darwin-arm64.dmg',
    label: 'Mac M-series',
    detail: 'Apple Silicon DMG',
    available: true,
  },
  {
    artifact: 'chotu-windows-x64.zip',
    label: 'Windows',
    detail: 'Windows x64 coming next',
    available: false,
  },
] as const;

type ChotuArtifact = (typeof downloadOptions)[number]['artifact'];

function statusTone(status: ChotuSubscription['status']) {
  if (status === 'active') return 'border-[#1f8f4a]/35 bg-[#e4f7eb] text-[#176b39]';
  if (status === 'pending') return 'border-[#e9c46a]/50 bg-[#fff4cc] text-[#745d12]';
  return 'border-[#d4d0c8] bg-[#f7f2ea] text-[#5f5a54]';
}

function formatDate(value?: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

export function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<ChotuSubscription | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<ChotuArtifact>('chotu-darwin-arm64.dmg');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const desktopRedirectStarted = useRef(false);
  const desktopLoginRequested = useMemo(() => new URLSearchParams(window.location.search).get('desktop_login') === '1', []);
  const desktopCallbackUrl = useMemo(
    () => new URLSearchParams(window.location.search).get('callback') || 'http://127.0.0.1:7777/v1/auth/browser-callback',
    []
  );

  useEffect(() => watchAuthState(setUser), []);

  useEffect(() => {
    if (!desktopLoginRequested) return;
    if (!user) {
      setMessage('Sign in with Google to finish Chotu Desktop login.');
      return;
    }
    if (desktopRedirectStarted.current) return;
    desktopRedirectStarted.current = true;
    setMessage('Finishing Chotu Desktop login...');
    createDesktopLoginUrl(user, desktopCallbackUrl)
      .then((url) => {
        window.location.href = url;
      })
      .catch((error) => {
        desktopRedirectStarted.current = false;
        setMessage(error instanceof Error ? error.message : 'Could not finish Chotu Desktop sign-in.');
      });
  }, [desktopCallbackUrl, desktopLoginRequested, user]);

  useEffect(() => {
    let mounted = true;

    if (user) {
      ensureCustomerProfile(user).catch(() => {
        if (mounted) setMessage('Signed in, but the account profile could not be refreshed.');
      });
    }

    fetchChotuSubscription(user)
      .then((nextSubscription) => {
        if (mounted) setSubscription(nextSubscription);
      })
      .catch(() => {
        if (mounted) setMessage('Could not load billing state. Please sign in again.');
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const subscriptionStatus = subscription?.status ?? 'pending';
  const nextPaymentDate = subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'After free month';
  const selectedDownload = downloadOptions.find((option) => option.artifact === selectedArtifact) ?? downloadOptions[0];

  const handleGoogleAuth = async () => {
    setBusy(true);
    setMessage('');

    try {
      const result = await signInWithGoogle();
      setUser(result.user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not complete Google login.');
    } finally {
      setBusy(false);
    }
  };

  const handleStartSubscription = async () => {
    try {
      const checkoutUrl = await buildCheckoutUrl(user);
      window.location.href = checkoutUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not open the Razorpay subscription link.');
    }
  };

  const handleInvoiceMessage = () => {
    setMessage('Past invoices will appear here after Razorpay webhook sync is connected. Razorpay also emails receipts after successful payments.');
  };

  const handleDownload = async () => {
    if (!user) {
      setMessage('Sign in first, then Chotu can create a private one-use download link.');
      return;
    }

    setDownloadBusy(true);
    setMessage('');

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/create-download-token', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artifact: selectedArtifact }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string; url?: string };
      if (!response.ok || !body.url) {
        throw new Error(body.error ?? 'Active plan or launch trial required before downloading Chotu.');
      }

      setMessage('Opening a one-use download link. If it expires before the download starts, click Download again.');
      window.location.href = body.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create the download link.');
    } finally {
      setDownloadBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 pb-14 pt-28 text-[#1a1a1a] md:px-8 lg:px-10">
      <Seo
        title="Account - Sankhya AI Labs"
        description="Private Sankhya AI Labs account dashboard for desktop assistant downloads, plan state, and billing access."
        path="/account"
        robots="noindex, nofollow"
      />
      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(380px,1fr)]">
        <article className="rounded-lg border border-[#d4d0c8] bg-[#fffaf2] p-5 shadow-[0_20px_60px_rgba(24,20,16,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-[#77706a]">Account details</p>
              <h1 className="mt-2 font-mono text-2xl font-bold text-[#14110f]">Your Chotu account</h1>
            </div>
            <span className={`rounded-md border px-3 py-1 font-mono text-xs font-bold uppercase ${statusTone(subscriptionStatus)}`}>
              {subscriptionStatus}
            </span>
          </div>

          <dl className="mt-5 grid gap-4 border-t border-[#d4d0c8] pt-5 font-mono text-xs sm:grid-cols-2">
            <div>
              <dt className="uppercase text-[#77706a]">Name</dt>
              <dd className="mt-2 break-words font-bold text-[#14110f]">{user?.displayName ?? 'Not set'}</dd>
            </div>
            <div>
              <dt className="uppercase text-[#77706a]">Email</dt>
              <dd className="mt-2 break-words font-bold text-[#14110f]">{user?.email ?? 'No account connected'}</dd>
            </div>
            <div>
              <dt className="uppercase text-[#77706a]">Plan</dt>
              <dd className="mt-2 font-bold text-[#14110f]">Chotu Personal</dd>
            </div>
            <div>
              <dt className="uppercase text-[#77706a]">Next payment</dt>
              <dd className="mt-2 font-bold text-[#14110f]">{nextPaymentDate}</dd>
            </div>
          </dl>

          {!hasFirebaseConfig && (
            <div className="mt-5 rounded-md border border-[#e9c46a]/50 bg-[#fff4cc] p-3 font-mono text-xs leading-5 text-[#745d12]">
              Firebase is not available, so this dashboard is running in demo mode.
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {user ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void signOutOfFirebase()}
                className="h-10 rounded-md font-mono text-xs"
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={busy || !hasFirebaseConfig}
                className="h-10 rounded-md bg-[#14110f] px-4 font-mono text-xs text-[#f8ead8] hover:bg-[#2a2521]"
              >
                <LogIn className="size-4" />
                {busy ? 'Opening Google' : 'Login with Google'}
              </Button>
            )}
          </div>

          {message && (
            <p className="mt-5 rounded-md border border-[#d4d0c8] bg-[#f7f2ea] p-3 font-mono text-xs leading-5 text-[#5f5a54]">
              {message}
            </p>
          )}
        </article>

        <article className="rounded-lg border border-[#d4d0c8] bg-[#14110f] p-5 text-[#f8ead8] shadow-[0_20px_60px_rgba(24,20,16,0.14)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-[#f8ead8]/55">Download</p>
              <h2 className="mt-2 font-mono text-2xl font-bold">Download Chotu Desktop App</h2>
            </div>
            <Download className="size-5 text-[#e9c46a]" />
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Choose Chotu desktop download">
            {downloadOptions.map((option) => {
              const selected = selectedArtifact === option.artifact;

              return (
                <button
                  key={option.artifact}
                  type="button"
                  onClick={() => {
                    if (option.available) {
                      setSelectedArtifact(option.artifact);
                    } else {
                      setMessage('Windows downloads are not published yet. Use Mac M-series for this release.');
                    }
                  }}
                  disabled={!option.available}
                  className={`min-h-[92px] rounded-md border p-3 text-left font-mono transition ${
                    selected
                      ? 'border-[#e9c46a] bg-[#f8ead8] text-[#14110f]'
                      : option.available
                        ? 'border-white/12 bg-white/[0.06] text-[#f8ead8] hover:border-white/35 hover:bg-white/[0.1]'
                        : 'cursor-not-allowed border-white/10 bg-white/[0.03] text-[#f8ead8]/45'
                  }`}
                  aria-checked={selected}
                  role="radio"
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-bold">
                    {option.label}
                    {selected && <Check className="size-4" />}
                  </span>
                  <span className={`mt-2 block text-[11px] ${selected ? 'text-[#5f5a54]' : 'text-[#f8ead8]/55'}`}>
                    {option.detail}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-md border border-white/10 bg-white/[0.06] p-4">
            <p className="font-mono text-xs uppercase text-[#f8ead8]/55">Selected</p>
            <p className="mt-1 font-mono text-lg font-bold">{selectedDownload.label}</p>
            <Button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloadBusy || !user}
              className="mt-4 h-10 w-full justify-center rounded-md bg-[#f8ead8] font-mono text-xs text-[#14110f] hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Download className="size-4" />
              {downloadBusy ? 'Preparing download' : `Download ${selectedDownload.label}`}
            </Button>
            <p className="mt-3 font-mono text-[11px] leading-5 text-[#f8ead8]/60">
              Private one-use links are created after checking your active plan or launch trial.
            </p>
          </div>
        </article>
      </section>

      <section className="mx-auto mt-5 grid max-w-7xl gap-4 md:grid-cols-3">
        <article className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-[#77706a]">Payment link</p>
              <h2 className="mt-2 font-mono text-xl font-bold text-[#14110f]">Razorpay checkout</h2>
            </div>
            <LinkIcon className="size-5 text-[#cf5a32]" />
          </div>
          <p className="mt-4 break-all font-mono text-xs leading-5 text-[#5f5a54]">{RAZORPAY_SUBSCRIPTION_LINK}</p>
          <Button
            type="button"
            onClick={() => void handleStartSubscription()}
            className="mt-5 h-10 w-full justify-center rounded-md bg-[#14110f] font-mono text-xs text-[#f8ead8] hover:bg-[#2a2521]"
          >
            Open payment link
            <ArrowUpRight className="size-4" />
          </Button>
        </article>

        <article className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-[#77706a]">Upcoming payment</p>
              <h2 className="mt-2 font-mono text-xl font-bold text-[#14110f]">{nextPaymentDate}</h2>
            </div>
            <CreditCard className="size-5 text-[#cf5a32]" />
          </div>
          <dl className="mt-5 space-y-3 border-t border-[#d4d0c8] pt-4 font-mono text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-[#77706a]">Amount</dt>
              <dd className="font-bold text-[#14110f]">Rs 1999</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#77706a]">Collection</dt>
              <dd className="text-right font-bold text-[#14110f]">Razorpay hosted</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-[#77706a]">Invoice</p>
              <h2 className="mt-2 font-mono text-xl font-bold text-[#14110f]">No invoices yet</h2>
            </div>
            <FileText className="size-5 text-[#cf5a32]" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#5f5a54]">
            Razorpay emails receipts after successful payments. Synced invoices will show up here.
          </p>
          <Button type="button" variant="outline" onClick={handleInvoiceMessage} className="mt-5 h-10 w-full rounded-md font-mono text-xs">
            View invoice status
          </Button>
        </article>
      </section>

      <section className="mx-auto mt-5 max-w-7xl overflow-hidden rounded-lg border border-[#14110f] bg-[#14110f] p-5 text-[#f8ead8]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-[#f8ead8]/55">Footer banner</p>
            <h2 className="mt-2 font-mono text-3xl font-bold leading-none">chotu_api coming soon</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#f8ead8]/68">
            Hosted Chotu API access will be added to this dashboard when it opens.
          </p>
        </div>
      </section>
    </main>
  );
}
