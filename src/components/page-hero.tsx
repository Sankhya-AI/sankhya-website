import Link from "next/link";
import type { ReactNode } from "react";

import type { HeroContent } from "@/types/site";

type PageHeroProps = HeroContent & {
  aside?: ReactNode;
};

function ActionButton({
  label,
  href,
  external,
  tone = "primary",
}: {
  label: string;
  href: string;
  external?: boolean;
  tone?: "primary" | "secondary";
}) {
  const className =
    tone === "primary"
      ? "btn-primary"
      : "btn-secondary";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  aside,
}: PageHeroProps) {
  return (
    <section
      className={
        aside
          ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-start"
          : "space-y-7 pt-4 md:pt-8"
      }
    >
      <div className={aside ? "space-y-7 pt-4 md:pt-8" : "space-y-7"}>
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.36em] text-[var(--accent)]">
          {eyebrow}
        </p>
        <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-[var(--ink)] md:text-6xl md:leading-[1.03]">
          {title}
        </h1>
        <p className="max-w-3xl text-lg leading-9 text-[var(--muted)]">
          {description}
        </p>
        <div className="flex flex-wrap gap-3">
          <ActionButton {...primaryCta} tone="primary" />
          {secondaryCta ? <ActionButton {...secondaryCta} tone="secondary" /> : null}
        </div>
      </div>
      {aside}
    </section>
  );
}
