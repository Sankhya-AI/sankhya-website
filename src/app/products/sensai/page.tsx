import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "SensAI",
  description:
    "SensAI is Sankhya AI Labs' secondary edtech product.",
};

const productNotes = [
  {
    label: "Secondary product",
    title: "SensAI is our secondary edtech product.",
    description:
      "SensAI focuses on structured learning and guided study.",
  },
  {
    label: "What it taught us",
    title: "Workflow matters more than blank-chat UX.",
    description:
      "Useful software needs structure, state, and continuity.",
  },
  {
    label: "Current focus",
    title: "Our main product is now Dhee.",
    description:
      "Dhee carries the main thesis for Sankhya now.",
  },
];

export default function SensaiPage() {
  return (
    <div className="space-y-20 pb-10 md:space-y-24 md:pb-14">
      <PageHero
        eyebrow="Secondary product: SensAI"
        title="SensAI is Sankhya&apos;s secondary edtech product."
        description="SensAI stays in the portfolio as the secondary education product. Dhee is the main product."
        primaryCta={{ label: "Explore Dhee", href: "/products/dhee" }}
        secondaryCta={{ label: "See all products", href: "/products" }}
      />

      <section className="grid gap-5 md:grid-cols-3">
        {productNotes.map((note) => (
          <article key={note.title} className="surface-card p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
              {note.label}
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
              {note.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {note.description}
            </p>
          </article>
        ))}
      </section>

      <section className="surface-card p-7 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Current direction
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              The main Sankhya story is Dhee.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/products/dhee" className="btn-primary">
              Explore Dhee
            </Link>
            <Link href="/about" className="btn-secondary">
              Read our philosophy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
