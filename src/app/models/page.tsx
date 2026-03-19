import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { modelApproach, modelCards, stackLayers, stackNotes } from "@/content/site";

export const metadata: Metadata = {
  title: "Models",
  description: "Explore Dhee, Akshar, Shlok, and the compact model stack Sankhya AI Labs is building — small, focused models designed to run independently.",
};

export default function ModelsPage() {
  return (
    <div className="space-y-20 pb-10 md:space-y-24 md:pb-14">
      <PageHero
        eyebrow="Models and systems"
        title="Small models that do specific jobs exceptionally well"
        description="We don't build models to be large. We build them to be good at a defined task — memory, speech recognition, voice generation, edge deployment. Each model is optimised to run independently with minimal infrastructure."
        primaryCta={{ label: "View Dhee on GitHub", href: "https://github.com/Sankhya-AI/Dhee" }}
        secondaryCta={{ label: "Explore SensAI", href: "https://www.sensai.co.in", external: true }}
      />

      {/* ─── MODEL APPROACH ─── */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="How we build"
          title="Our approach to model development"
          description="We take a principled path: start from the task, build small, and replace external dependencies with owned models as we prove each layer in production."
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

      {/* ─── THE STACK ─── */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="The stack"
          title="Four layers. Four specific problems. One integrated system."
          description="Each layer is designed for a defined task and optimised to be as compact as possible. Together, they form the teaching stack that powers SensAI."
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
                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
                    layer.state === "Live"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : layer.state === "Coming Soon"
                        ? "border-slate-200 bg-slate-50 text-slate-600"
                        : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)]"
                  }`}
                >
                  {layer.state}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── MODEL CARDS ─── */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {modelCards.map((model) => (
          <article key={model.name} className="surface-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                  {model.name}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{model.role}</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
                  model.status === "Live"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : model.status === "Coming Soon"
                      ? "border-slate-200 bg-slate-50 text-slate-600"
                      : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)]"
                }`}
              >
                {model.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {model.description}
            </p>
          </article>
        ))}
      </section>

      {/* ─── STRATEGY + LINKS ─── */}
      <section className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="surface-card p-7 md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Why this matters
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Small, owned models unlock what large external models cannot
          </h3>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            Lower inference costs. Better privacy. Offline capability. Indian-language
            quality. Edge deployment. These are not features you can reliably get
            from general-purpose API providers — they require models you control.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="https://github.com/Sankhya-AI/Dhee"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary min-h-12 px-5 py-3 text-sm"
            >
              View Dhee on GitHub ↗
            </Link>
            <Link
              href="https://engram.sensai.co.in"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary min-h-12 px-5 py-3 text-sm"
            >
              Explore Engram ↗
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
