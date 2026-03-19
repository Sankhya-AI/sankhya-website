"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Brand } from "@/components/brand";
import { SiteNav } from "@/components/site-nav";

export function SiteHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto max-w-7xl px-4 transition-all duration-300 ease-out sm:px-6 md:px-10 lg:px-12 ${
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
                  href="https://www.sensai.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary min-h-11 px-5 py-2.5 text-sm"
                >
                  Explore SensAI
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
