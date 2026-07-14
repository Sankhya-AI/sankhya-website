import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { useLocation } from 'react-router';
import { AccountDashboard } from '@/components/account/AccountDashboard';
import { Seo } from '@/components/Seo';
import { ROUTE_SEO } from '@/content/site';
import { CHOTU_SUPPORTED_PLATFORM } from '@/config/chotu';
import { ensureCustomerProfile, updateCustomerDisplayName } from '@/lib/customer';
import {
  buildCheckoutUrl,
  createDesktopLoginRequest,
  fetchChotuSubscription,
  hasFirebaseConfig,
  prepareManagedDesktopLogin,
  selectByokPlan,
  signInWithGoogle,
  signOutOfFirebase,
  syncSubscription,
  topUpCheckoutUrl,
  watchAuthState,
  type ChotuSubscription,
  type TopUpUsd,
} from '@/lib/firebase';

export function AccountPage() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [subscription, setSubscription] = useState<ChotuSubscription | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [planBusy, setPlanBusy] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);
  const desktopRedirectStarted = useRef(false);
  const managedKeyPreparationStarted = useRef(false);
  const getChotuAuthStarted = useRef(false);
  const getChotuIntent = new URLSearchParams(location.search).get('intent') === 'get-chotu';
  const desktopLoginRequested = useMemo(() => new URLSearchParams(window.location.search).get('desktop_login') === '1', []);
  const desktopCallbackUrl = useMemo(
    () => new URLSearchParams(window.location.search).get('callback') || 'http://127.0.0.1:7777/v1/auth/browser-callback',
    []
  );
  const redirectPaymentId = useMemo(
    () => new URLSearchParams(window.location.search).get('razorpay_payment_id'),
    []
  );

  useEffect(
    () => watchAuthState((nextUser) => {
      setSubscription(null);
      setUser(nextUser);
      setProfileName(nextUser?.displayName ?? '');
      setAuthResolved(true);
    }),
    [],
  );

  useEffect(() => {
    if (!desktopLoginRequested) return;
    if (!user) {
      setMessage('Sign in with Google to finish Chotu Desktop login.');
      return;
    }
    if (!subscription) {
      setMessage('Loading your secure Chotu account...');
      return;
    }
    if (subscription.access.managedKeys && subscription.managedApiKey?.status !== 'active') {
      setMessage('Preparing secure managed cognition for Chotu...');
      return;
    }
    if (desktopRedirectStarted.current) return;
    desktopRedirectStarted.current = true;
    setMessage('Finishing Chotu Desktop login...');
    createDesktopLoginRequest(user, desktopCallbackUrl)
      .then(({ url, licenseToken }) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        const token = document.createElement('input');
        token.type = 'hidden';
        token.name = 'license_token';
        token.value = licenseToken;
        form.appendChild(token);
        document.body.appendChild(form);
        form.submit();
      })
      .catch((error) => {
        desktopRedirectStarted.current = false;
        setMessage(error instanceof Error ? error.message : 'Could not finish Chotu Desktop sign-in.');
      });
  }, [desktopCallbackUrl, desktopLoginRequested, subscription, user]);

  useEffect(() => {
    if (!user || !subscription?.access.managedKeys) return;
    if (subscription.managedApiKey?.status === 'active') return;
    if (managedKeyPreparationStarted.current) return;
    managedKeyPreparationStarted.current = true;
    if (desktopLoginRequested) setMessage('Preparing secure managed cognition for Chotu...');
    prepareManagedDesktopLogin(user, subscription)
      .then((next) => {
        setSubscription(next);
        managedKeyPreparationStarted.current = false;
      })
      .catch((error) => {
        managedKeyPreparationStarted.current = false;
        setMessage(error instanceof Error ? error.message : 'Could not prepare managed cognition.');
      });
  }, [desktopLoginRequested, subscription, user]);

  // Reliability: right after a Razorpay redirect, verify the captured payment so
  // access is granted even if the webhook was missed or delayed.
  useEffect(() => {
    if (!user || !redirectPaymentId) return;
    syncSubscription(user, redirectPaymentId)
      .then((next) => {
        if (next) {
          setSubscription(next);
          setMessage('Payment confirmed. Your Chotu plan is active.');
        }
      })
      .catch(() => undefined);
  }, [user, redirectPaymentId]);

  // Reliability: if the account still looks unpaid/pending, ask the server to
  // reconcile against Razorpay in case a webhook was missed or delayed.
  const reconciliationStatus = subscription?.status;

  useEffect(() => {
    if (!user || !reconciliationStatus) return;
    if (!['pending', 'none', 'expired'].includes(reconciliationStatus)) return;
    syncSubscription(user)
      .then((next) => {
        if (next) setSubscription(next);
      })
      .catch(() => undefined);
  }, [user, reconciliationStatus]);

  useEffect(() => {
    let mounted = true;

    if (!authResolved || !user) return () => {
      mounted = false;
    };

    ensureCustomerProfile(user).catch(() => {
      if (mounted) setMessage('Signed in, but the account profile could not be refreshed.');
    });

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
  }, [authResolved, user]);

  const handleGoogleAuth = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (!authResolved || user || !getChotuIntent || getChotuAuthStarted.current) return;
    getChotuAuthStarted.current = true;
    void handleGoogleAuth();
  }, [authResolved, getChotuIntent, handleGoogleAuth, user]);

  const handleStartSubscription = async () => {
    try {
      const checkoutUrl = await buildCheckoutUrl(user);
      window.location.href = checkoutUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not open the Razorpay subscription link.');
    }
  };

  const handleSelectByok = async () => {
    if (!user) {
      setMessage('Sign in first to choose the free plan.');
      return;
    }
    setPlanBusy(true);
    setMessage('');
    try {
      await selectByokPlan(user);
      setSubscription(await fetchChotuSubscription(user));
      setMessage('Free Bring-your-own-key plan is active. Download Chotu, then add your own model key in Settings.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not select the free plan.');
    } finally {
      setPlanBusy(false);
    }
  };

  const handleTopUp = (usd: TopUpUsd) => {
    if (!user) {
      setMessage('Sign in first to top up credits.');
      return;
    }
    try {
      window.location.href = topUpCheckoutUrl(user, usd);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Top-up is not available yet.');
    }
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
        body: JSON.stringify({ artifact: CHOTU_SUPPORTED_PLATFORM.artifact }),
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

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileBusy(true);
    setMessage('');
    try {
      const savedName = await updateCustomerDisplayName(user, profileName);
      setProfileName(savedName);
      setMessage('Personal information updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update personal information.');
    } finally {
      setProfileBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfcfd] pt-24 text-[#1f2933]">
      <Seo {...ROUTE_SEO.account} />
      <AccountDashboard
        authResolved={authResolved}
        user={user}
        subscription={subscription}
        message={message}
        hasAccountServices={hasFirebaseConfig}
        signInBusy={busy}
        planBusy={planBusy}
        downloadBusy={downloadBusy}
        profileName={profileName}
        profileBusy={profileBusy}
        onSignIn={() => void handleGoogleAuth()}
        onSignOut={() => void signOutOfFirebase()}
        onDownload={() => void handleDownload()}
        onSelectByok={() => void handleSelectByok()}
        onOpenManagedCheckout={() => void handleStartSubscription()}
        onTopUp={handleTopUp}
        onProfileNameChange={setProfileName}
        onSaveProfile={() => void handleSaveProfile()}
      />
    </main>
  );
}
