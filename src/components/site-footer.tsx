import Link from "next/link";

import { Brand } from "@/components/brand";
import { navItems } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:px-10 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl space-y-4">
            <Brand compact />
            <p className="text-sm leading-7 text-[var(--muted)]">
              Sankhya AI Labs builds product, memory, and speech systems for how
              India learns. SensAI is the flagship product surface of that work.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>Built in India. Designed for institutions, coaching workflows, and learners.</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.sensai.co.in"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[var(--accent)]"
            >
              sensai.co.in
            </a>
            <a
              href="https://engram.sensai.co.in"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[var(--accent)]"
            >
              engram.sensai.co.in
            </a>
            <a
              href="https://github.com/Sankhya-AI/Dhee"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[var(--accent)]"
            >
              Dhee on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
