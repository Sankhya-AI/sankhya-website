"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/content/site";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="hide-scrollbar flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-[var(--border)] bg-white/82 p-1 shadow-[0_12px_24px_rgba(15,20,31,0.05)]">
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-3.5 sm:text-[0.92rem] ${
              active
                ? "bg-white text-[var(--ink)] shadow-[0_12px_24px_rgba(15,20,31,0.08)]"
                : "text-[var(--ink-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
