"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { navItems } from "@/content/site";
import type { SiteNavItem } from "@/types/site";

type SiteNavProps = {
  vertical?: boolean;
  onNavigate?: () => void;
  plain?: boolean;
};

function matchesPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isItemActive(pathname: string, item: SiteNavItem) {
  if (matchesPath(pathname, item.href)) {
    return true;
  }

  return item.children?.some((child) => matchesPath(pathname, child.href)) ?? false;
}

export function SiteNav({ vertical = false, onNavigate, plain = false }: SiteNavProps) {
  const pathname = usePathname();
  const [openItem, setOpenItem] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (vertical || !openItem) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenItem(null);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [openItem, vertical]);

  return (
    <nav
      ref={navRef}
      className={`hide-scrollbar max-w-full ${
        plain
          ? ""
          : "rounded-full border border-[var(--border)] bg-white/82 p-1 shadow-[0_12px_24px_rgba(15,20,31,0.05)]"
      } ${
        vertical
          ? "flex flex-col gap-1 rounded-[1.5rem]"
          : "flex gap-1.5 overflow-x-auto"
      }`}
    >
      {navItems.map((item) => {
        const active = isItemActive(pathname, item);
        const hasChildren = Boolean(item.children?.length);
        const open = openItem === item.label;
        const baseClass = `rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-3.5 sm:text-[0.92rem] ${
          vertical ? "text-left" : "whitespace-nowrap"
        } ${
          plain && vertical ? "px-4 py-2.5" : ""
        } ${
          active || open
            ? "bg-white text-[var(--ink)] shadow-[0_12px_24px_rgba(15,20,31,0.08)]"
            : "text-[var(--ink-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"
        }`;

        if (!hasChildren) {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={baseClass}
            >
              {item.label}
            </Link>
          );
        }

        if (vertical) {
          const expanded = open || item.children?.some((child) => matchesPath(pathname, child.href));

          return (
            <div key={item.label} className="rounded-[1.3rem]">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpenItem((current) => (current === item.label ? null : item.label))}
                className={`${baseClass} flex w-full items-center justify-between gap-3`}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-200 ${
                  expanded ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-1 rounded-[1.2rem] border border-[var(--border)] bg-white/82 p-2">
                    {item.children?.map((child) => {
                      const childActive = matchesPath(pathname, child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onNavigate}
                          className={`block rounded-[1rem] px-4 py-2.5 text-sm font-medium transition ${
                            childActive
                              ? "bg-[var(--surface-soft)] text-[var(--ink)]"
                              : "text-[var(--ink-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setOpenItem(item.label)}
            onMouseLeave={() => setOpenItem(null)}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenItem((current) => (current === item.label ? null : item.label))}
              className={`${baseClass} flex items-center gap-2`}
            >
              <span>{item.label}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`absolute left-0 top-full pt-3 transition duration-200 ${
                open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="min-w-[15rem] rounded-[1.4rem] border border-[var(--border)] bg-white/95 p-2 shadow-[0_22px_54px_rgba(15,20,31,0.12)] backdrop-blur">
                {item.children?.map((child) => {
                  const childActive = matchesPath(pathname, child.href);

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => {
                        setOpenItem(null);
                        onNavigate?.();
                      }}
                      className={`block rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
                        childActive
                          ? "bg-[var(--surface-soft)] text-[var(--ink)]"
                          : "text-[var(--ink-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
