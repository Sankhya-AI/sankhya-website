import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  PRIMARY_NAV,
  PRODUCTS,
  PRODUCT_STATUS_LABELS,
  ROUTES,
  type ProductDefinition,
} from '@/content/site';

function ProductMenuItem({
  product,
  onSelect,
}: {
  product: ProductDefinition;
  onSelect: () => void;
}) {
  const content = (
    <>
      <span>
        <span className="block font-bit text-xl leading-none">{product.name}</span>
        <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.08em] text-[#70685f]">
          {product.role} · {product.qualifier}
        </span>
      </span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#9b3e22]">
        {PRODUCT_STATUS_LABELS[product.status]}
      </span>
    </>
  );
  const className =
    'flex min-h-20 items-center justify-between gap-5 border-b border-[#c8bfb3] px-5 py-4 text-left text-[#171411] transition-colors last:border-b-0 hover:bg-[#cf5a32]/10 focus-visible:bg-[#cf5a32]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9b3e22]';

  if (product.external) {
    return (
      <a href={product.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onSelect}>
        {content}
      </a>
    );
  }

  return (
    <Link to={product.href} className={className} onClick={onSelect}>
      {content}
    </Link>
  );
}

export function Navbar() {
  const [inverted, setInverted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const frameRef = useRef(0);
  const productsRef = useRef<HTMLDivElement>(null);
  const productsButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    const updateNavState = () => {
      const inverseSections = Array.from(document.querySelectorAll('[data-navbar-inverse]'));
      setInverted(
        inverseSections.some((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top < 92 && rect.bottom > 0;
        }),
      );
    };

    const schedule = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(updateNavState);
    };

    updateNavState();
    const routeContentObserver = new MutationObserver(schedule);
    routeContentObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      routeContentObserver.disconnect();
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [location.pathname]);

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (productsRef.current?.contains(event.target as Node)) return;
      setProductsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setProductsOpen(false);
      productsButtonRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const navSurface = inverted
    ? 'border-white/12 bg-[#080706]/88 text-[#f8ead8] shadow-lg'
    : 'border-[#d4d0c8]/80 bg-[#f0ede6]/90 text-[#1a1a1a] shadow-lg';
  const linkClass = inverted
    ? 'text-[#f8ead8]/68 hover:text-white'
    : 'text-[#5e5953] hover:text-[#171411]';
  const menuSurface =
    'border-[#b9b0a4] bg-[#f6efe5] text-[#171411] shadow-[0_24px_80px_rgba(20,16,13,0.3)]';
  const productRouteActive = location.pathname === ROUTES.chotu || location.pathname === ROUTES.models;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="h-8 overflow-hidden border-b border-white/10 bg-[#080706] text-[#f8ead8]">
        <div className="flex h-full w-max animate-offer-ticker whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex min-w-[100vw] shrink-0 items-center justify-around gap-8 px-5 font-mono text-[9px] font-bold uppercase tracking-[0.09em] md:text-[10px]"
            >
              {PRODUCTS.map((product) => (
                <span key={product.id} className="inline-flex items-center gap-4">
                  {product.tickerLabel}
                  <span className="size-1 bg-[#cf5a32]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <nav className={`h-16 border-b backdrop-blur-2xl transition-colors duration-300 md:h-14 ${navSurface}`} aria-label="Primary navigation">
        <div className="mx-auto flex h-full max-w-[1540px] items-center justify-between">
          <Link to={ROUTES.home} className="flex shrink-0 items-center gap-3 px-4" aria-label="Sankhya AI Labs home">
            <img src="/assets/sankhya-logo.png" alt="" className="size-[29px] shrink-0" width="29" height="29" />
            <span className="flex items-baseline gap-2.5 leading-none">
              <span className={`font-bit text-[24px] leading-none md:text-[26px] ${inverted ? 'text-[#f8ead8]' : 'text-[#050505]'}`}>
                Sankhya
              </span>
              <span className={`font-bit text-[9px] font-bold leading-none md:text-[10px] ${inverted ? 'text-[#f8ead8]/64' : 'text-[#050505]/68'}`}>
                AI LABS
              </span>
            </span>
          </Link>

          <div className="ml-auto hidden h-full items-center gap-1 pr-3 md:flex">
            <div
              ref={productsRef}
              className="relative flex h-full items-center"
            >
              <button
                ref={productsButtonRef}
                type="button"
                aria-expanded={productsOpen}
                aria-controls="products-navigation"
                onClick={() => setProductsOpen((open) => !open)}
                className={`inline-flex h-9 items-center gap-1.5 px-3 text-sm font-medium transition-colors ${productRouteActive ? (inverted ? 'text-white' : 'text-[#171411]') : linkClass}`}
              >
                Products
                <ChevronDown size={13} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>

              {productsOpen ? (
                <div id="products-navigation" className={`absolute top-[calc(100%-1px)] right-0 z-[60] w-[410px] max-w-[calc(100vw-2rem)] border ${menuSurface}`}>
                  {PRODUCTS.map((product) => (
                    <ProductMenuItem key={product.id} product={product} onSelect={() => setProductsOpen(false)} />
                  ))}
                </div>
              ) : null}
            </div>

            {PRIMARY_NAV.filter((item) => item.kind === 'link').map((item) => {
              const active = item.href === location.pathname;
              const className = `inline-flex h-9 items-center px-3 text-sm font-medium transition-colors ${active ? (inverted ? 'text-white' : 'text-[#171411]') : linkClass}`;

              return item.href.includes('#') ? (
                <a key={item.label} href={item.href} className={className}>{item.label}</a>
              ) : (
                <Link key={item.label} to={item.href} className={className}>{item.label}</Link>
              );
            })}

            <Link
              to={`${ROUTES.account}?intent=get-chotu`}
              className={`ml-2 inline-flex h-9 items-center border px-4 font-mono text-[11px] font-bold uppercase tracking-[0.06em] transition-colors ${
                inverted
                  ? 'border-[#f8ead8]/50 text-[#f8ead8] hover:bg-white/10'
                  : 'border-[#171411] bg-[#171411] text-[#f8ead8] hover:bg-[#302a25]'
              }`}
            >
              Get Chotu
            </Link>
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
            className={`mr-4 inline-flex size-9 items-center justify-center border md:hidden ${inverted ? 'border-white/32 text-white' : 'border-[#171411]/35 text-[#171411]'}`}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen ? (
          <div id="mobile-navigation" className={`max-h-[calc(100svh-96px)] overflow-y-auto border-t p-4 md:hidden ${menuSurface}`}>
            <p className="px-2 pb-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#70685f]">Products</p>
            <div className="border border-[#c8bfb3]">
              {PRODUCTS.map((product) => (
                <ProductMenuItem key={product.id} product={product} onSelect={() => setMenuOpen(false)} />
              ))}
            </div>
            <div className="mt-4 grid">
              {PRIMARY_NAV.filter((item) => item.kind === 'link').map((item) => {
                const className =
                  'border-b border-[#c8bfb3] px-2 py-3 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#5e5953] transition-colors hover:bg-[#cf5a32]/10 hover:text-[#171411] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9b3e22]';
                return item.href.includes('#') ? (
                  <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className={className}>{item.label}</a>
                ) : (
                  <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)} className={className}>{item.label}</Link>
                );
              })}
              <Link
                to={`${ROUTES.account}?intent=get-chotu`}
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex h-11 items-center justify-center bg-[#cf5a32] px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-white"
              >
                Get Chotu
              </Link>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
