import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Stack', href: '/#stack', id: 'stack' },
  { label: 'Why us', href: '/#why-us', id: 'why-us' },
  { label: 'Systems', href: '/#systems', id: 'systems' },
  { label: 'Memory', href: '/#memory', id: 'memory' },
  { label: 'Blog', href: '/#blog', id: 'blog' },
];

const productItems = [
  {
    label: 'Chotu Personal AI Assistant',
    href: '/#home',
    meta: 'Orb, chat, tasks, coding, self-improvement',
  },
  {
    label: 'Chotu Desk Companion',
    href: '/#systems',
    meta: 'Coming soon',
  },
];

const offerMessages = [
  'Check out Chotu, your personal super assistant',
];

export function Navbar() {
  const [inverted, setInverted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const frameRef = useRef(0);

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
    ? 'border-white/10 bg-[#0d0d0d]/78 text-[#f8ead8] shadow-lg'
    : 'border-[#d4d0c8]/70 bg-[#f0ede6]/82 text-[#1a1a1a] shadow-lg';

  const linkClass = inverted
    ? 'text-white/62 hover:text-white'
    : 'text-[#6b6b6b] hover:text-[#1a1a1a]';

  const activeLinkClass = inverted ? 'text-white' : 'text-[#1a1a1a]';

  const ctaClass = inverted
    ? 'border-white/70 bg-transparent text-white shadow-sm hover:bg-white/10'
    : 'border-[#1a1a1a]/70 bg-transparent text-[#45413d] shadow-sm hover:bg-[#e8e4dc] hover:text-[#1a1a1a]';

  const dropdownSurface = inverted
    ? 'border-white/12 bg-[#101010]/96 text-white shadow-[0_18px_60px_rgba(0,0,0,0.38)]'
    : 'border-[#d4d0c8] bg-[#f5f1ea]/98 text-[#1a1a1a] shadow-[0_18px_60px_rgba(0,0,0,0.12)]';

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
              <span className={`font-mono text-[25px] font-normal leading-none tracking-normal md:text-[26px] ${inverted ? 'text-[#f8ead8]' : 'text-[#14110f]'}`}>
                sankhya
              </span>
              <span className={`font-mono text-[10px] font-bold leading-none tracking-normal md:text-[11px] ${inverted ? 'text-[#f8ead8]/72' : 'text-[#14110f]/72'}`}>
                AI LABS
              </span>
            </span>
          </a>

          <div className="ml-auto mr-4 hidden items-center gap-1 md:flex">
            <div className="group relative">
              <button
                className={`inline-flex h-8 items-center justify-center gap-1 rounded-md bg-transparent px-3 py-1 font-sans text-sm font-medium transition-colors ${linkClass}`}
                type="button"
              >
                Products
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className={`invisible absolute right-0 top-9 w-[300px] translate-y-1 rounded-lg border p-2 opacity-0 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${dropdownSurface}`}>
                {productItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`block rounded-md px-3 py-3 transition-colors ${
                      inverted ? 'hover:bg-white/[0.08]' : 'hover:bg-[#ebe5dc]'
                    }`}
                  >
                    <span className="block font-mono text-xs font-bold">{item.label}</span>
                    <span className={`mt-1 block font-mono text-[11px] ${inverted ? 'text-white/48' : 'text-[#77706a]'}`}>
                      {item.meta}
                    </span>
                  </a>
                ))}
              </div>
            </div>

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
              className={`ml-5 hidden h-8 items-center justify-center gap-2 rounded-md border px-3 py-0.5 font-mono text-xs font-medium transition-colors md:inline-flex ${ctaClass}`}
            >
              Subscribe
              <ArrowUpRight size={14} />
            </a>
            <a
              href="/account"
              className={`hidden h-8 items-center justify-center gap-2 rounded-md border px-3 py-0.5 font-mono text-xs font-medium transition-colors md:inline-flex ${ctaClass}`}
            >
              Account
            </a>
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

              <div className="pt-3">
                <div className={`px-2 pb-2 font-mono text-[10px] font-bold uppercase ${inverted ? 'text-white/45' : 'text-[#8b8580]'}`}>
                  Products
                </div>
                {productItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-md px-2 py-2 font-mono text-sm ${linkClass}`}
                  >
                    <span className="block font-bold">{item.label}</span>
                    <span className={`mt-1 block text-[11px] ${inverted ? 'text-white/45' : 'text-[#77706a]'}`}>
                      {item.meta}
                    </span>
                  </a>
                ))}
              </div>

              <a
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className={`mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 py-0.5 font-mono text-xs font-medium transition-colors ${ctaClass}`}
              >
                Subscribe
                <ArrowUpRight size={14} />
              </a>
              <a
                href="/account"
                onClick={() => setMenuOpen(false)}
                className={`ml-2 mt-3 inline-flex h-9 items-center justify-center rounded-md border px-3 py-0.5 font-mono text-xs font-medium transition-colors ${ctaClass}`}
              >
                Account
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
