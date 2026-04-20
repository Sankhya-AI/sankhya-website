import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { modelApproach, modelCards, stackLayers, stackNotes } from "@/content/site";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "Explore the systems underneath Dhee: portable memory, context routing, and shared agent continuity.",
};

export default function ModelsPage() {
  return (
    <div className="space-y-20 pb-10 md:space-y-24 md:pb-14">
      <PageHero
        eyebrow="Systems"
        title="The stack under Dhee is cognitive infrastructure."
        description="We focus on the systems around the model that make agents usable on long-running work: durable memory, routed context, and shared state for collaboration."
        primaryCta={{ label: "Explore Dhee", href: "/products/dhee" }}
        secondaryCta={{ label: "Talk to us", href: "/contact" }}
      />

      <section className="space-y-8">
        <SectionHeading
          eyebrow="How we think"
          title="Build the layer the model cannot own well by itself."
          description="Provider models will keep changing. We care about the substrate that should survive those changes and keep making agents better."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {modelApproach.map((item) => (
            <article key={item.title} className="surface-card p-6 md:p-7">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                {item.label}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="The stack"
          title="Three systems, one direction."
          description="Each layer exists to make memory more durable, context more precise, and multi-agent work less dependent on central orchestration."
        />
        <div className="space-y-4">
          {stackLayers.map((layer) => (
            <article
              key={layer.label}
              className={`rounded-[1.6rem] border p-5 shadow-[0_18px_40px_rgba(15,20,31,0.04)] transition-all md:p-7 ${
                layer.highlight
                  ? "border-[var(--accent)]/20 bg-gradient-to-br from-white to-[var(--accent-soft)]/30"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-semibold tracking-tight text-[var(--ink)]">
                      {layer.label}
                    </p>
                    <span className="text-sm text-[var(--muted)]">
                      {layer.tagline}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {layer.description}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {layer.state}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modelCards.map((model) => (
          <article key={model.name} className="surface-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                  {model.name}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{model.role}</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {model.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {model.description}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="surface-card p-7 md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Why this matters
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Better agents come from better state management.
          </h3>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            When memory survives provider churn, context is routed instead of dumped, and collaboration happens through shared state, agents become more reliable without pretending the model alone solved cognition.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products/dhee"
              className="btn-secondary min-h-12 px-5 py-3 text-sm"
            >
              Explore Dhee →
            </Link>
            <Link href="/about" className="btn-secondary min-h-12 px-5 py-3 text-sm">
              Read our philosophy →
            </Link>
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="grid gap-px bg-[var(--border)]">
            {stackNotes.map((note) => (
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
    </div>
  );
}
