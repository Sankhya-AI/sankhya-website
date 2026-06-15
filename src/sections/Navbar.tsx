import { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, LogIn, Menu, X } from 'lucide-react';
import type { User } from 'firebase/auth';
import { hasFirebaseConfig, signInWithGoogle, watchAuthState } from '@/lib/firebase';

const navItems = [
  { label: 'See', href: '/#home', id: 'home' },
  { label: 'Do', href: '/#stack', id: 'stack' },
  { label: 'Remember', href: '/#memory', id: 'memory' },
  { label: 'Use Cases', href: '/#systems', id: 'systems' },
  { label: 'Notes', href: '/#blog', id: 'blog' },
];

const offerMessages = [
  'Chotu sees your screen, uses your tools, and asks before it changes anything',
];

export function Navbar() {
  const [inverted, setInverted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => watchAuthState(setUser), []);

  useEffect(() => {
    const updateNavState = () => {
      const inverseSections = Array.from(document.querySelectorAll('[data-navbar-inverse]'));
      const shouldInvert = inverseSections.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top < 92 && rect.bottom > 0;
      });
      setInverted(shouldInvert);

      const current = navItems.find((item) => {
        const section = document.getElementById(item.id);
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      setActiveId(current?.id ?? '');
    };

    const schedule = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(updateNavState);
    };

    updateNavState();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const navSurface = inverted
    ? 'border-white/12 bg-[#080706]/88 text-[#f8ead8] shadow-lg'
    : 'border-[#d4d0c8]/70 bg-[#f0ede6]/82 text-[#1a1a1a] shadow-lg';

  const linkClass = inverted
    ? 'text-[#f8ead8]/78 hover:text-white'
    : 'text-[#6b6b6b] hover:text-[#1a1a1a]';

  const activeLinkClass = inverted ? 'text-white' : 'text-[#1a1a1a]';

  const ctaClass = inverted
    ? 'border-[#f8ead8]/70 bg-transparent text-[#f8ead8] shadow-sm hover:bg-white/10 hover:text-white'
    : 'border-[#1a1a1a]/70 bg-transparent text-[#45413d] shadow-sm hover:bg-[#e8e4dc] hover:text-[#1a1a1a]';

  const currentPath = window.location.pathname;
  const accountLabel = user ? 'Dashboard' : 'Login';
  const offerActionLabel = user ? 'Dashboard' : 'Sign up';
  const AccountIcon = user ? LayoutDashboard : LogIn;

  const handleAccountAction = async () => {
    if (user) {
      window.location.href = '/account';
      return;
    }

    if (!hasFirebaseConfig) {
      window.location.href = '/account';
      return;
    }

    setAuthBusy(true);
    try {
      const result = await signInWithGoogle();
      setUser(result.user);
    } catch {
      window.location.href = '/account';
    } finally {
      setAuthBusy(false);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="h-8 overflow-hidden border-b border-white/10 bg-[#080706] text-[#f8ead8]">
        <div className="flex h-full items-center whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex min-w-full animate-offer-ticker items-center gap-8 pr-8 font-mono text-[10px] font-bold uppercase tracking-[0.08em] md:text-[11px]"
            >
              {offerMessages.map((message) => (
                <span key={`${copy}-${message}`} className="inline-flex items-center gap-8">
                  <span>{message}</span>
                  <button
                    type="button"
                    onClick={() => void handleAccountAction()}
                    disabled={authBusy}
                    tabIndex={copy === 1 ? -1 : 0}
                    className="hidden h-5 items-center gap-1 rounded-sm border border-[#f8ead8]/24 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#f8ead8] transition-colors hover:border-[#f8ead8]/55 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex md:text-[11px]"
                  >
                    {offerActionLabel}
                    <AccountIcon size={12} />
                  </button>
                  <span className="h-1 w-1 rounded-full bg-[#cf5a32]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <nav className={`h-16 border-y backdrop-blur-2xl transition-colors duration-300 md:h-14 ${navSurface}`}>
        <div className="mx-auto flex h-full w-full items-center justify-between">
          <a href="/#home" className="flex shrink-0 items-center gap-3 px-3 md:px-4" aria-label="Sankhya AI Labs home">
            <img src="/assets/sankhya-logo.png" alt="Sankhya AI Labs" className="h-[29px] w-[29px] shrink-0 self-center" />
            <span className="flex items-baseline gap-2.5 leading-none">
              <span className={`font-bit text-[25px] font-normal leading-none tracking-normal md:text-[26px] ${inverted ? 'text-[#f8ead8]' : 'text-[#050505]'}`}>
                Sankhya
              </span>
              <span className={`font-bit text-[10px] font-bold leading-none tracking-normal md:text-[11px] ${inverted ? 'text-[#f8ead8]/72' : 'text-[#050505]'}`}>
                AI LABS
              </span>
            </span>
          </a>

          <div className="ml-auto mr-4 hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`group relative inline-flex h-8 w-max items-center justify-center rounded-md bg-transparent px-3 py-1 font-sans text-sm font-medium transition-colors ${
                  activeId === item.id ? activeLinkClass : linkClass
                }`}
              >
                {item.label}
                {activeId === item.id && (
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                      inverted ? 'bg-[#f8ead8]' : 'bg-[#cf5a32]'
                    }`}
                  />
                )}
              </a>
            ))}

            <a
              href="/pricing"
              className={`group relative inline-flex h-8 w-max items-center justify-center rounded-md bg-transparent px-3 py-1 font-sans text-sm font-medium transition-colors ${
                currentPath === '/pricing' ? activeLinkClass : linkClass
              }`}
            >
              Pricing
              {currentPath === '/pricing' && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                    inverted ? 'bg-[#f8ead8]' : 'bg-[#cf5a32]'
                  }`}
                />
              )}
            </a>
            <button
              type="button"
              onClick={() => void handleAccountAction()}
              disabled={authBusy}
              className={`hidden h-8 items-center justify-center gap-2 rounded-md border px-3 py-0.5 font-mono text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex ${ctaClass}`}
            >
              <AccountIcon size={14} />
              {authBusy ? 'Opening...' : accountLabel}
            </button>
          </div>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className={`mr-4 rounded-md border p-2 md:hidden ${
              inverted
                ? 'border-white/50 bg-transparent text-white'
                : 'border-[#1a1a1a]/40 bg-transparent text-[#1a1a1a]'
            }`}
            type="button"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className={`border-t px-4 py-4 backdrop-blur-2xl md:hidden ${navSurface}`}>
            <div className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-md px-2 py-2 font-mono text-sm ${
                    activeId === item.id ? activeLinkClass : linkClass
                  }`}
                >
                  {item.label}
                  {activeId === item.id && <span className="h-1 w-1 rounded-full bg-[#cf5a32]" />}
                </a>
              ))}

              <a
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between rounded-md px-2 py-2 font-mono text-sm ${
                  currentPath === '/pricing' ? activeLinkClass : linkClass
                }`}
              >
                Pricing
                {currentPath === '/pricing' && <span className="h-1 w-1 rounded-full bg-[#cf5a32]" />}
              </a>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void handleAccountAction();
                }}
                disabled={authBusy}
                className={`mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 py-0.5 font-mono text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${ctaClass}`}
              >
                <AccountIcon size={14} />
                {authBusy ? 'Opening...' : accountLabel}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
