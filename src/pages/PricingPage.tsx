import { useEffect, useState } from 'react';
import { ArrowRight, Check, KeyRound, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { ChotuOrb } from '@/components/ChotuOrb';
import { ensureCustomerProfile } from '@/lib/customer';
import {
  fetchChotuSubscription,
  hasFirebaseConfig,
  signInWithGoogle,
  signOutOfFirebase,
  watchAuthState,
  type ChotuSubscription,
} from '@/lib/firebase';

const chotuFeatures = [
  {
    title: 'Desktop-native assistant',
    detail: 'Chotu lives on your machine as a personal assistant for the work you are already doing.',
  },
  {
    title: 'Repo-aware memory',
    detail: 'Run chotu init and Chotu compiles rich Dhee context so it can reason across your codebase.',
  },
  {
    title: 'Kimi K2.6-native',
    detail: 'Built for fast agent workflows with strong model context and practical developer actions.',
  },
  {
    title: 'You control keys',
    detail: 'Use your own model key locally today, with Sankhya-managed keys coming soon.',
  },
  {
    title: 'Updates and support',
    detail: 'The local app remains yours after download; dashboard plans keep updates and support flowing.',
  },
  {
    title: 'chotu_api coming soon',
    detail: 'Lowest cost, highest quality API access for Chotu when the hosted API opens.',
  },
];

export function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<ChotuSubscription | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => watchAuthState(setUser), []);

  useEffect(() => {
    let mounted = true;

    if (user) {
      ensureCustomerProfile(user).catch(() => {
        if (mounted) setMessage('Signed in, but could not create the customer profile yet.');
      });
    }

    fetchChotuSubscription(user)
      .then((nextSubscription) => {
        if (mounted) setSubscription(nextSubscription);
      })
      .catch(() => {
        if (mounted) setMessage('Could not load subscription state. Please try again after signing in again.');
      });

    return () => {
      mounted = false;
    };
  }, [user]);

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

  const handlePricingCta = async () => {
    if (user) {
      window.location.href = '/account';
      return;
    }

    await handleGoogleAuth();
  };

  return (
    <main className="min-h-screen bg-cream pt-24 text-[#1a1a1a]">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-6 md:grid-cols-[minmax(0,1fr)_400px] md:px-8 lg:px-10">
        <div className="pt-8 md:pt-16">
          <h1 className="max-w-4xl text-balance font-pixel text-5xl leading-[0.98] tracking-normal text-[#14110f] md:text-7xl">
            Chotu, your personal super assistant.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f5a54]">
            A desktop AI assistant that understands your repo, keeps rich Dhee memory, and helps you move through developer work faster.
          </p>

          <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {chotuFeatures.map((feature) => (
              <article key={feature.title} className="rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-4">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#1f8f4a]" />
                  <h2 className="font-mono text-lg font-bold text-[#14110f]">{feature.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5f5a54]">{feature.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <div>
              <div className="font-mono text-2xl font-bold leading-none text-[#14110f]">Free for the first month</div>
              <div className="mt-2 font-mono text-xs uppercase text-[#77706a]">Sign in to open your Chotu dashboard</div>
            </div>
            <Button
              onClick={() => void handlePricingCta()}
              disabled={busy || (!user && !hasFirebaseConfig)}
              className="h-11 rounded-md bg-[#14110f] px-5 font-mono text-sm text-[#f8ead8] hover:bg-[#2a2521]"
            >
              {user ? 'Dashboard' : busy ? 'Opening Google' : 'Sign in with Google'}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <aside className="self-start rounded-lg border border-[#d4d0c8] bg-[#f7f2ea] p-4 shadow-[0_22px_70px_rgba(24,20,16,0.10)] md:sticky md:top-28">
          <div className="rounded-md border border-[#d4d0c8] bg-[#14110f] p-5 text-[#f8ead8]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-[#f8ead8]/55">Launch plan</p>
                <h2 className="mt-2 font-mono text-3xl font-bold">Free for 1 month</h2>
                <p className="mt-3 text-sm leading-6 text-[#f8ead8]/70">
                  Sign in to connect your account, download Chotu, and manage plan details from the dashboard.
                </p>
              </div>
              <ChotuOrb size="md" label="Chotu" variant="dark" />
            </div>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-5 font-mono text-xs text-[#f8ead8]/78">
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-[#e9c46a]" />
                <span>Desktop app access</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-[#e9c46a]" />
                <span>Updates and support while active</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-[#e9c46a]" />
                <span>Account dashboard after Google sign-in</span>
              </div>
            </div>

            <Button
              onClick={() => void handlePricingCta()}
              disabled={busy || (!user && !hasFirebaseConfig)}
              className="mt-6 h-11 w-full justify-center rounded-md bg-[#f8ead8] px-5 font-mono text-sm text-[#14110f] hover:bg-white"
            >
              {user ? (
                <>
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  {busy ? 'Opening Google' : 'Sign in with Google'}
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-[#77706a]">Buyer account</p>
                <h3 className="mt-1 break-words font-mono text-lg font-bold tracking-normal text-[#14110f]">
                  {user?.email ?? 'Optional dashboard sign in'}
                </h3>
              </div>
              {user && (
                <Button variant="outline" size="icon-sm" onClick={() => void signOutOfFirebase()} aria-label="Sign out">
                  <LogOut className="size-4" />
                </Button>
              )}
            </div>

            {!hasFirebaseConfig && (
              <div className="mt-4 rounded-md border border-[#e9c46a]/50 bg-[#fff4cc] p-3 font-mono text-xs leading-5 text-[#745d12]">
                Firebase is not available, so this page is running in demo mode.
              </div>
            )}

            {!user && (
              <div className="mt-5">
                <Button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={busy || !hasFirebaseConfig}
                  className="h-11 w-full justify-center rounded-md bg-[#14110f] font-mono text-sm text-[#f8ead8] hover:bg-[#2a2521]"
                >
                  <ShieldCheck className="size-4" />
                  Sign in with Google
                </Button>
                <p className="mt-3 font-mono text-xs leading-5 text-[#77706a]">
                  Sign in connects your dashboard. Plan and account actions live there.
                </p>
              </div>
            )}

            {message && (
              <p className="mt-4 rounded-md border border-[#d4d0c8] bg-[#f7f2ea] p-3 font-mono text-xs leading-5 text-[#5f5a54]">
                {message}
              </p>
            )}
          </div>

          <div className="mt-4 rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-[#77706a]">Subscription</p>
                <h3 className="mt-1 font-mono text-xl font-bold text-[#14110f]">
                  {subscription?.status === 'active' ? 'Active' : 'Dashboard managed'}
                </h3>
              </div>
              <LayoutDashboard className="size-5 text-[#cf5a32]" />
            </div>
            <p className="mt-4 border-t border-[#d4d0c8] pt-4 text-sm leading-6 text-[#5f5a54]">
              {subscription?.status === 'active'
                ? 'Your Chotu dashboard is ready for downloads and account actions.'
                : 'Sign in to view downloads, invoices, account details, and chotu_api updates.'}
            </p>
          </div>

          <div className="mt-4 rounded-md border border-[#d4d0c8] bg-[#fffaf2] p-4">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-1 size-4 text-[#cf5a32]" />
              <p className="text-sm leading-6 text-[#5f5a54]">
                chotu_api and Sankhya-managed model keys are coming soon.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
