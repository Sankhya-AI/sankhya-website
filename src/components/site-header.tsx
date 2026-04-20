"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Brand } from "@/components/brand";
import { SiteNav } from "@/components/site-nav";

export function SiteHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const mobileCompact = collapsed && !mobileMenuOpen;

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;

      if (currentY <= 24) {
        setCollapsed(false);
      } else if (scrollingDown && currentY > 72) {
        setCollapsed(true);
      } else if (!scrollingDown) {
        setCollapsed(false);
      }

      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:hidden">
        <div
          className={`pointer-events-auto transition-all duration-300 ease-out ${
            mobileCompact ? "mx-auto max-w-[11.5rem]" : "w-full"
          }`}
        >
          <div
            className={`border border-[var(--border)] bg-[color:rgba(255,255,255,0.82)] shadow-[0_20px_45px_rgba(15,20,31,0.08)] backdrop-blur-xl transition-all duration-300 ease-out ${
              mobileCompact
                ? "rounded-full px-3 py-2 shadow-[0_16px_32px_rgba(15,20,31,0.1)]"
                : "rounded-[1.6rem] px-4 py-3"
            }`}
          >
          <div className="flex items-center justify-between gap-4">
            <div className="transition-all duration-300 ease-out">
              <Brand compact iconOnly={mobileCompact} />
            </div>
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={`inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--ink)] shadow-[0_8px_20px_rgba(15,20,31,0.05)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${
                mobileCompact ? "h-10 w-10" : "h-11 w-11"
              }`}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              mobileMenuOpen ? "max-h-[34rem] pt-4 opacity-100" : "max-h-0 pt-0 opacity-0"
            }`}
          >
            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              <SiteNav vertical plain onNavigate={() => setMobileMenuOpen(false)} />
              <div className="grid gap-3">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary min-h-11 w-full px-5 py-2.5 text-sm"
                >
                  Talk to us
                </Link>
                <Link
                  href="/products/dhee"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary min-h-11 w-full px-5 py-2.5 text-sm"
                >
                  Explore Dhee
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div
        className={`mx-auto hidden max-w-7xl px-4 transition-all duration-300 ease-out sm:px-6 md:px-10 lg:block lg:px-12 ${
          collapsed ? "pointer-events-none invisible max-h-0 -translate-y-4 overflow-hidden opacity-0" : "max-h-[200px] translate-y-0 opacity-100"
        }`}
      >
        <div className="pointer-events-auto backdrop-blur-xl transition-all duration-300">
          <div className="flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:py-4">
            <Brand />
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <SiteNav />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
                <Link
                  href="/contact"
                  className="btn-primary min-h-11 px-5 py-2.5 text-sm"
                >
                  Talk to us
                </Link>
                <Link
                  href="/products/dhee"
                  className="btn-secondary min-h-11 px-5 py-2.5 text-sm"
                >
                  Explore Dhee
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mx-auto hidden max-w-7xl justify-center px-4 pt-2 transition-all duration-300 ease-out sm:px-6 md:px-10 md:pt-2 lg:flex lg:px-12 ${
          collapsed
            ? "translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-5 opacity-0"
        }`}
      >
        <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[color:rgba(255,255,255,0.78)] px-3 py-2 shadow-[0_20px_45px_rgba(15,20,31,0.08)] backdrop-blur-xl transition-all duration-300">
          <Brand compact iconOnly />
          <SiteNav />
        </div>
      </div>
    </header>
  );
}
