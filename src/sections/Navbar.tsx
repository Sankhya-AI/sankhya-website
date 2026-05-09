import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useLocation } from 'react-router';

const navItems = [
  { label: 'Stack', href: '/#stack', id: 'stack' },
  { label: 'Why us', href: '/#why-us', id: 'why-us' },
  { label: 'Systems', href: '/#systems', id: 'systems' },
  { label: 'Blog', href: '/#blog', id: 'blog' },
];

export function Navbar() {
  const location = useLocation();
  const [inverted, setInverted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const frameRef = useRef(0);

  useEffect(() => {
    const updateNavState = () => {
      const isBlogRoute = location.pathname.startsWith('/blog');
      const inverseSections = Array.from(document.querySelectorAll('[data-navbar-inverse]'));
      const shouldInvert = inverseSections.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top < 76 && rect.bottom > 0;
      });
      setInverted(shouldInvert);

      if (isBlogRoute) {
        setActiveId('blog');
        return;
      }

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
  }, [location.pathname]);

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

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className={`hidden h-4 border-x border-b backdrop-blur-2xl sm:block ${navSurface}`} />
      <nav className={`h-16 border-y backdrop-blur-2xl transition-colors duration-300 md:h-14 ${navSurface}`}>
        <div className="mx-auto flex h-full w-full items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex shrink-0 items-center gap-3 px-3 md:px-4" aria-label="Sankhya AI Labs home">
              <img src="/assets/sankhya-logo.png" alt="Sankhya AI Labs" className="h-[29px] w-[29px] shrink-0 self-center" />
              <span className="flex items-center gap-2.5 leading-none">
                <span className={`font-mono text-[25px] font-normal leading-none tracking-normal md:text-[26px] ${inverted ? 'text-[#f8ead8]' : 'text-[#14110f]'}`}>
                  sankhya
                </span>
                <span className={`translate-y-[5px] font-mono text-[10px] font-bold leading-none tracking-normal md:text-[11px] ${inverted ? 'text-[#f8ead8]/72' : 'text-[#14110f]/72'}`}>
                  AI LABS
                </span>
              </span>
            </a>
          </div>

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
              href="https://dhee.sankhyaailabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-5 hidden h-8 items-center justify-center gap-2 rounded-md border px-3 py-0.5 font-mono text-xs font-medium transition-colors md:inline-flex ${ctaClass}`}
            >
              Explore Dhee
              <ArrowUpRight size={14} />
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className={`mr-4 rounded-md border p-2 md:hidden ${
              inverted
                ? 'border-white/50 bg-transparent text-white'
                : 'border-[#1a1a1a]/40 bg-transparent text-[#1a1a1a]'
            }`}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className={`border-t px-5 py-5 shadow-lg backdrop-blur-2xl md:hidden ${
            inverted ? 'border-white/10 bg-[#0d0d0d]/92' : 'border-[#d4d0c8]/70 bg-[#f0ede6]/92'
          }`}
        >
          <div className="space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block font-sans text-sm font-medium ${activeId === item.id ? activeLinkClass : linkClass}`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://dhee.sankhyaailabs.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 py-0.5 font-mono text-xs font-medium ${ctaClass}`}
            >
              Explore Dhee
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
