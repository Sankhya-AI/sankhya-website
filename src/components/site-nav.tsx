"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/content/site";

type SiteNavProps = {
  vertical?: boolean;
  onNavigate?: () => void;
};

export function SiteNav({ vertical = false, onNavigate }: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`hide-scrollbar max-w-full rounded-full border border-[var(--border)] bg-white/82 p-1 shadow-[0_12px_24px_rgba(15,20,31,0.05)] ${
        vertical
          ? "flex flex-col gap-1 rounded-[1.5rem]"
          : "flex gap-1.5 overflow-x-auto"
      }`}
    >
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-3.5 sm:text-[0.92rem] ${
              vertical ? "text-left" : "whitespace-nowrap"
            } ${
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
