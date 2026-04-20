import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { productDirectory } from "@/content/site";

const portfolioNotes = [
  {
    label: "Product",
    title: "Dhee is the main product.",
    description:
      "Sankhya is centered on Dhee as the portable memory OS for coding agents and AGI cognition. This is the product we are actively shaping around real developer workflows.",
  },
  {
    label: "Underneath",
    title: "The deeper work is in the substrate.",
    description:
      "Memory ownership, context routing, retrieval policy, and shared multi-agent continuity are the systems work underneath the product surface.",
  },
  {
    label: "Secondary",
    title: "SensAI remains the secondary edtech product.",
    description:
      "SensAI continues as a secondary product line, but the main company story and primary product focus are now clearly centered on Dhee.",
  },
];

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Sankhya AI Labs' products with Dhee as the main product and SensAI as the secondary edtech product.",
};

export default function ProductsPage() {
  return (
    <div className="space-y-20 pb-10 md:space-y-24 md:pb-14">
      <PageHero
        eyebrow="Products"
        title="Dhee is the main product. SensAI is secondary."
        description="Sankhya AI Labs is centered on Dhee as the memory layer for coding agents."
        primaryCta={{ label: "See Dhee", href: "/products/dhee" }}
        secondaryCta={{ label: "Explore the systems", href: "/models" }}
      />

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Current surface"
          title="Two products, with one clear center of gravity."
          description="Dhee carries the main thesis. SensAI stays as a secondary product."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {productDirectory.map((product) => (
            <article key={product.name} className="surface-card flex h-full flex-col p-7 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                    {product.label}
                  </p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)]">
                    {product.name}
                  </h2>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
                    product.status === "Active"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)]">
                {product.description}
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {product.points.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--ink-soft)] shadow-[0_18px_36px_rgba(15,20,31,0.04)]"
                  >
                    {point}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href={product.href} className="btn-secondary min-h-12 px-5 py-3 text-sm">
                  {product.ctaLabel} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card p-7 md:p-10">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Why this focus
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
            We are not building another wrapper around one model.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            The bet is simple: the missing layer is memory and context handling outside the provider.
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            We are starting with coding agents because wasted context and brittle handoffs are already painful there.
          </p>
        </div>
        <div className="surface-card overflow-hidden">
          <div className="grid gap-px bg-[var(--border)]">
            {portfolioNotes.map((note) => (
              <div key={note.title} className="bg-white p-6 md:p-7">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                  {note.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                  {note.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {note.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card p-7 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Next step
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              If Dhee fits what you are building, let&apos;s talk.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Talk to us
            </Link>
            <Link href="/products/dhee" className="btn-secondary">
              Explore Dhee
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
