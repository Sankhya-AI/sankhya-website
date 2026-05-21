import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CreditCard, Download, FileText, KeyRound, LinkIcon, LogOut, ShieldCheck } from 'lucide-react';
import type { User } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChotuOrb } from '@/components/ChotuOrb';
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
    artifact: 'chotu-darwin-arm64.zip',
    label: 'Mac Apple Silicon',
    detail: 'M1, M2, M3, M4',
  },
  {
    artifact: 'chotu-darwin-x64.zip',
    label: 'Mac Intel',
    detail: 'Older Intel Macs',
  },
  {
    artifact: 'chotu-win32-x64.zip',
    label: 'Windows',
    detail: 'Windows x64',
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
  const [selectedArtifact, setSelectedArtifact] = useState<ChotuArtifact>('chotu-darwin-arm64.zip');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [desktopLoginBusy, setDesktopLoginBusy] = useState(false);
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
    setDesktopLoginBusy(true);
    setMessage('Finishing Chotu Desktop login...');
    createDesktopLoginUrl(user, desktopCallbackUrl)
      .then((url) => {
        window.location.href = url;
      })
      .catch((error) => {
        desktopRedirectStarted.current = false;
        setMessage(error instanceof Error ? error.message : 'Could not finish Chotu Desktop sign-in.');
      })
      .finally(() => setDesktopLoginBusy(false));
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
  const access = subscription?.access ?? {
    localApp: true,
    updates: false,
    support: false,
    managedKeys: false,
    chotuApi: false,
  };

  const apiKeyState = useMemo(() => {
    if (!subscription?.razorpaySubscriptionId) return 'Use your own key';
    if (subscription.status === 'active') return 'Sankhya key ready';
    return 'Coming soon';
  }, [subscription]);
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

  const handleDesktopLogin = async () => {
    if (!user) {
      setMessage('Sign in with Google first, then connect Chotu Desktop.');
      return;
    }

    setDesktopLoginBusy(true);
    setMessage('');
    try {
      const url = await createDesktopLoginUrl(user, desktopCallbackUrl);
      window.location.href = url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not start Chotu Desktop sign-in.');
    } finally {
      setDesktopLoginBusy(false);
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
        throw new Error(body.error ?? 'Active plan required before downloading Chotu.');
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
    <main className="min-h-screen bg-cream px-4 pb-16 pt-28 text-[#1a1a1a] md:px-8 lg:px-10">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.4fr)]">
        <div>
          <Badge className="mb-5 rounded-md border-[#cf5a32]/25 bg-[#ffe2d4] px-3 py-1 font-mono text-[#b64923]">
            Billing
          </Badge>
          <h1 className="max-w-4xl font-pixel text-5xl leading-none tracking-normal text-[#14110f] md:text-7xl">
            Chotu billing.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f5a54]">
            Manage your plan, payment link, updates, and hosted Chotu services. The local app remains yours; updates, support, managed keys, and chotu_api require an active plan.
          </p>
        </div>

        <aside className="rounded-lg border border-[#d4d0c8] bg-[#fffaf2] p-5 shadow-[0_22px_70px_rgba(24,20,16,0.10)]">
          <p className="font-mono text-xs uppercase text-[#77706a]">Account details</p>
          <dl className="mt-4 space-y-4 font-mono text-xs">
            <div className="border-t border-[#d4d0c8] pt-4">
              <dt className="text-[#77706a]">Name</dt>
              <dd className="mt-1 break-words font-bold text-[#14110f]">{user?.displayName ?? 'Not set'}</dd>
            </div>
            <div className="border-t border-[#d4d0c8] pt-4">
              <dt className="text-[#77706a]">Email</dt>
              <dd className="mt-1 break-words font-bold text-[#14110f]">{user?.email ?? 'No account connected'}</dd>
            </div>
          </dl>

          {!hasFirebaseConfig && (
            <div className="mt-4 rounded-md border border-[#e9c46a]/50 bg-[#fff4cc] p-3 font-mono text-xs leading-5 text-[#745d12]">
              Firebase is not available, so this dashboard is running in demo mode.
            </div>
          )}

          {user ? (
            <div className="mt-5 grid gap-2">
              <Button
                type="button"
                onClick={() => void handleDesktopLogin()}
                disabled={desktopLoginBusy}
                className="h-11 w-full justify-center rounded-md bg-[#14110f] font-mono text-sm text-[#f8ead8] hover:bg-[#2a2521]"
              >
                <ShieldCheck className="size-4" />
                {desktopLoginBusy ? 'Opening Chotu Desktop' : 'Sign in Chotu Desktop'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void signOutOfFirebase()}
                className="h-11 w-full justify-center rounded-md font-mono text-sm"
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleGoogleAuth}
              disabled={busy || !hasFirebaseConfig}
              className="mt-5 h-11 w-full justify-center rounded-md bg-[#14110f] font-mono text-sm text-[#f8ead8] hover:bg-[#2a2521]"
            >
              <ShieldCheck className="size-4" />
              Sign in with Google
            </Button>
          )}

          {message && (
            <p className="mt-4 rounded-md border border-[#d4d0c8] bg-[#f7f2ea] p-3 font-mono text-xs leading-5 text-[#5f5a54]">
              {message}
            </p>
          )}
        </aside>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <article className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase text-[#77706a]">Current plan</p>
                <div className="mt-2 flex items-center gap-3">
                  <ChotuOrb size="lg" label="Chotu" />
                  <h2 className="font-mono text-3xl font-bold text-[#14110f]">Chotu Personal</h2>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f5a54]">
                  First month free. After month one, pay Rs 1999 through Razorpay to keep updates, support, managed keys, and chotu_api access. Outside India, cards are charged in the cardholder currency by their bank.
                </p>
              </div>
              <div className={`rounded-md border px-3 py-1 font-mono text-xs uppercase ${statusTone(subscriptionStatus)}`}>
                {subscriptionStatus}
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-[#d4d0c8] pt-5 font-mono text-xs sm:grid-cols-3">
              <div>
                <p className="uppercase text-[#77706a]">Checkout</p>
                <p className="mt-2 font-bold text-[#14110f]">Razorpay payment link</p>
              </div>
              <div>
                <p className="uppercase text-[#77706a]">Upcoming payment</p>
                <p className="mt-2 font-bold text-[#14110f]">{nextPaymentDate}</p>
              </div>
              <div>
                <p className="uppercase text-[#77706a]">Amount</p>
                <p className="mt-2 font-bold text-[#14110f]">Rs 1999 / about $20</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => void handleStartSubscription()}
                className="h-10 rounded-md bg-[#14110f] px-4 font-mono text-xs text-[#f8ead8] hover:bg-[#2a2521]"
              >
                Open payment link
                <ArrowUpRight className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleStartSubscription()}
                className="h-10 rounded-md font-mono text-xs"
              >
                Open Razorpay
              </Button>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase text-[#77706a]">Payment link</p>
                  <h3 className="mt-2 font-mono text-2xl font-bold text-[#14110f]">Razorpay checkout</h3>
                </div>
                <LinkIcon className="size-5 text-[#cf5a32]" />
              </div>
              <p className="mt-4 break-all font-mono text-sm leading-6 text-[#5f5a54]">
                {RAZORPAY_SUBSCRIPTION_LINK}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleStartSubscription()}
                className="mt-5 h-10 w-full justify-center rounded-md font-mono text-xs"
              >
                Open payment link
                <ArrowUpRight className="size-4" />
              </Button>
            </article>

            <article className="rounded-md border border-[#d4d0c8] bg-[#14110f] p-5 text-[#f8ead8]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase text-[#f8ead8]/55">Upcoming payment</p>
                  <h3 className="mt-2 font-mono text-2xl font-bold">{nextPaymentDate}</h3>
                </div>
                <CreditCard className="size-5 text-[#e9c46a]" />
              </div>
              <dl className="mt-5 space-y-3 font-mono text-xs">
                <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-[#f8ead8]/55">Amount</dt>
                  <dd className="font-bold">Rs 1999</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-[#f8ead8]/55">Collection</dt>
                  <dd className="text-right font-bold">Razorpay hosted</dd>
                </div>
              </dl>
            </article>
          </div>

          <article className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase text-[#77706a]">Past invoices</p>
                <h3 className="mt-2 font-mono text-2xl font-bold text-[#14110f]">No invoices yet</h3>
              </div>
              <FileText className="size-5 text-[#cf5a32]" />
            </div>
            <div className="mt-5 space-y-3 border-y border-[#d4d0c8] py-4 font-mono text-xs text-[#5f5a54]">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <span>Invoices will appear here after Razorpay webhook sync is connected.</span>
                <span className="font-bold text-[#14110f]">Razorpay</span>
                <span>Email receipt</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={handleInvoiceMessage} className="h-10 rounded-md font-mono text-xs">
                View invoice status
              </Button>
              <Button type="button" variant="outline" onClick={() => void handleStartSubscription()} className="h-10 rounded-md font-mono text-xs">
                Open Razorpay checkout
              </Button>
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-[#77706a]">Access policy</p>
                <h3 className="mt-2 font-mono text-2xl font-bold text-[#14110f]">Entitlements</h3>
              </div>
              <ShieldCheck className="size-5 text-[#cf5a32]" />
            </div>
            <dl className="mt-4 space-y-4 font-mono text-xs">
              <div className="border-t border-[#d4d0c8] pt-4">
                <dt className="text-[#77706a]">Local Chotu app</dt>
                <dd className="mt-1 font-bold text-[#14110f]">{access.localApp ? 'Yours after download' : 'Not available'}</dd>
              </div>
              <div className="border-t border-[#d4d0c8] pt-4">
                <dt className="text-[#77706a]">Updates and support</dt>
                <dd className="mt-1 font-bold text-[#14110f]">{access.updates && access.support ? 'Active' : 'Active plan required'}</dd>
              </div>
              <div className="border-t border-[#d4d0c8] pt-4">
                <dt className="text-[#77706a]">Release downloads</dt>
                <dd className="mt-2 space-y-3">
                  <div className="grid gap-2">
                    {downloadOptions.map((option) => (
                      <button
                        key={option.artifact}
                        type="button"
                        onClick={() => setSelectedArtifact(option.artifact)}
                        className={`rounded-md border px-3 py-2 text-left transition ${
                          selectedArtifact === option.artifact
                            ? 'border-[#14110f] bg-[#14110f] text-[#f8ead8]'
                            : 'border-[#d4d0c8] bg-[#fffaf2] text-[#14110f] hover:border-[#77706a]'
                        }`}
                      >
                        <span className="block font-bold">{option.label}</span>
                        <span className="mt-1 block text-[11px] opacity-70">{option.detail}</span>
                      </button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => void handleDownload()}
                    disabled={downloadBusy || !user}
                    className="h-10 w-full justify-center rounded-md bg-[#14110f] font-mono text-xs text-[#f8ead8] hover:bg-[#2a2521]"
                  >
                    <Download className="size-4" />
                    Download {selectedDownload.label}
                  </Button>
                  <p className="text-[11px] leading-5 text-[#5f5a54]">
                    Creates a one-use 60 second link after checking your active plan. If it expires, click Download again.
                  </p>
                </dd>
              </div>
              <div className="border-t border-[#d4d0c8] pt-4">
                <dt className="text-[#77706a]">Managed keys and chotu_api</dt>
                <dd className="mt-1 font-bold text-[#14110f]">{access.managedKeys && access.chotuApi ? 'Active' : 'Active plan required'}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-[#77706a]">Model key</p>
                <h3 className="mt-2 font-mono text-2xl font-bold text-[#14110f]">{apiKeyState}</h3>
              </div>
              <KeyRound className="size-5 text-[#cf5a32]" />
            </div>
            <p className="mt-4 text-sm leading-6 text-[#5f5a54]">
              Bring your own model key today. Sankhya-managed Chotu keys are coming soon and will be tied to this billing account.
            </p>
          </article>

          <article className="rounded-md border border-[#d4d0c8] bg-[#14110f] p-5 text-[#f8ead8]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-[#f8ead8]/55">Coming soon</p>
                <h3 className="mt-2 font-mono text-2xl font-bold">Buy chotu_api</h3>
              </div>
              <KeyRound className="size-5 text-[#e9c46a]" />
            </div>
            <p className="mt-4 text-sm leading-6 text-[#f8ead8]/70">
              Lowest cost, highest quality API access for Chotu. Requires an active plan when launched.
            </p>
            <Button
              type="button"
              disabled
              className="mt-5 h-10 w-full justify-center rounded-md bg-white/12 font-mono text-xs text-[#f8ead8] opacity-70"
            >
              Coming soon
            </Button>
          </article>
        </aside>
      </section>
    </main>
  );
}
