import Image from "next/image";

import type { ProductShowcase } from "@/types/site";

export function ProductFrame({ showcase }: { showcase: ProductShowcase }) {
  return (
    <article className="surface-card overflow-hidden">
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-white p-3">
        <div className="absolute inset-x-3 top-3 h-10 rounded-[1rem] border border-[var(--border)] bg-[var(--surface-soft)]" />
        <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white pt-12">
          <Image
            src={showcase.image}
            alt={showcase.alt}
            width={1365}
            height={768}
            className="h-auto w-full"
          />
        </div>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-[0.72rem] sm:tracking-[0.28em]">
          {showcase.eyebrow}
        </p>
        <h3 className="text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl">
          {showcase.title}
        </h3>
        <p className="text-sm leading-7 text-[var(--muted)]">
          {showcase.description}
        </p>
      </div>
    </article>
  );
}
