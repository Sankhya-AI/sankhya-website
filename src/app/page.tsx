import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import {
  audienceCards,
  homeHero,
  homeStats,
  indiaFirstPoints,
  labPhilosophy,
  problemCards,
  stackLayers,
} from "@/content/site";

export default function Home() {
  return (
    <div className="space-y-20 pb-10 md:space-y-28 md:pb-14">
      <section className="hero-minimal relative isolate mt-2 flex min-h-[85vh] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--border)] px-4 py-14 text-center sm:mt-3 sm:px-6 sm:py-16 md:rounded-[2.75rem] md:px-10 md:py-20 lg:mt-0">
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center">
          <p className="hero-animate text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)] sm:text-[0.78rem] sm:tracking-[0.34em]">
            {homeHero.eyebrow}
          </p>
          <h1 className="hero-animate hero-animate-delay-1 text-[clamp(2.35rem,10vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-[var(--ink)]">
            {homeHero.title}
          </h1>
          <p className="hero-animate hero-animate-delay-2 mt-5 max-w-2xl text-base leading-7 text-[var(--ink-soft)] sm:mt-6 sm:text-lg sm:leading-8 md:text-xl md:leading-9">
            {homeHero.description}
          </p>
          <div className="hero-animate hero-animate-delay-3 mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link href={homeHero.primaryCta.href} className="btn-primary min-h-12 px-6 text-base">
              {homeHero.primaryCta.label}
            </Link>
            {homeHero.secondaryCta ? (
              <Link
                href={homeHero.secondaryCta.href}
                className="btn-secondary min-h-12 border-transparent bg-transparent px-6 text-base hover:bg-[var(--surface-soft)]"
              >
                {homeHero.secondaryCta.label} →
              </Link>
            ) : null}
          </div>
        </div>

        <div className="hero-animate hero-animate-delay-4 relative z-10 mt-12 w-full max-w-3xl md:mt-24">
          <div className="absolute inset-0 z-0">
            <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[rgba(255,214,111,0.4)] opacity-70 blur-[80px]" />
            <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-[rgba(240,107,60,0.3)] opacity-70 blur-[80px]" />
            <div className="absolute left-1/2 top-1/2 h-72 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(150,180,255,0.2)] opacity-70 blur-[80px]" />
          </div>

          <div className="agent-terminal relative z-10 overflow-hidden rounded-2xl border border-white/60 text-left">
            <div className="flex items-center gap-2 border-b border-white/30 bg-white/20 px-3 py-3 backdrop-blur-md sm:px-4">
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <div className="ml-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] sm:ml-2 sm:text-[0.65rem] sm:tracking-widest">
                Dhee memory runtime
              </div>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="terminal-line opacity-50">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.00</span>
                <span>[system] Coding agent attached. Session identity verified.</span>
              </div>
              <div className="terminal-line mt-2 opacity-75">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.11</span>
                <span>[dhee] Restoring prior tasks, artifacts, rules, and durable memory.</span>
              </div>
              <div className="terminal-line mt-2 opacity-90">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.24</span>
                <span>[router] Relevant context loaded. Wasteful history held back.</span>
              </div>
              <div className="terminal-line mt-2 opacity-95">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.37</span>
                <span>[agents] Shared handoff open. No orchestrator agent required.</span>
              </div>
              <div className="terminal-line mt-2">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.48</span>
                <span>
                  <span className="font-semibold text-emerald-600">success</span> Work resumed with portable state and live continuity...
                  <span className="terminal-cursor" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {homeStats.map((item) => (
          <div
            key={item.label}
            className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-[0_14px_30px_rgba(15,20,31,0.03)]"
          >
            <div className="text-xl font-semibold tracking-tight text-[var(--ink)]">
              {item.value}
            </div>
            <div className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
              {item.label}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Philosophy"
          title="We think AGI is model plus cognitive infrastructure."
          description="Dhee exists because session memory, giant transcripts, and orchestration-heavy systems are not enough for durable software work."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {labPhilosophy.map((item) => (
            <article key={item.title} className="surface-card p-6 md:p-7">
              <p className="text-2xl text-[var(--accent)]">{item.icon}</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--ink)]">
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
          eyebrow="How Dhee works"
          title="Three layers turn a coding agent into a personalized, self-evolving collaborator."
          description="Dhee does not try to replace the model. It gives the model a portable cognition layer that remembers, routes context, and coordinates shared work."
        />
        <div className="space-y-4">
          {stackLayers.map((layer) => (
            <article
              key={layer.label}
              className={`rounded-[1.6rem] border p-5 shadow-[0_18px_40px_rgba(15,20,31,0.04)] transition-all md:p-6 ${
                layer.highlight
                  ? "border-[var(--accent)]/20 bg-gradient-to-br from-white to-[var(--accent-soft)]/30"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl space-y-1">
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      {layer.label}
                    </h3>
                    <span className="text-sm text-[var(--muted)]">
                      {layer.tagline}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-[var(--muted)]">
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
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products/dhee"
            className="btn-secondary min-h-11 px-5 py-2.5 text-sm"
          >
            Explore Dhee →
          </Link>
          <Link
            href="/models"
            className="btn-secondary min-h-11 px-5 py-2.5 text-sm"
          >
            Explore the systems →
          </Link>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
        <SectionHeading
          eyebrow="Why now"
          title="Developers are still burning tokens on wasteful context."
          description="Long tasks, provider changes, and multiple agents expose the same gap: models are strong, but the cognitive layer around them is still weak."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {problemCards.map((card) => (
              <article key={card.title} className="surface-card p-6">
                <p className="text-xl font-semibold text-[var(--ink)]">{card.title}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="surface-card p-6 md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Our response
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Own the layer between the model and the work.
          </h3>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--muted)]">
            Dhee is the memory layer you own. It keeps agents from repeatedly loading bloated context, learns from what actually gets used, and lets multiple agents coordinate through shared memory instead of orchestration overhead.
          </p>
          <div className="mt-8 grid gap-4">
            {indiaFirstPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              >
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {item.label}
                </div>
                <div className="mt-2 text-lg font-semibold tracking-tight text-[var(--ink)]">
                  {item.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Who it serves"
          title="Built for developers doing real software work."
          description="Dhee is most useful when memory quality, continuity, and collaboration matter more than one clean demo run."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {audienceCards.map((card) => (
            <article key={card.title} className="surface-card p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                {card.label}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {card.description}
              </p>
              <div className="mt-5 grid gap-3">
                {card.points.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--ink-soft)]"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card p-7 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Next step
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              If you are building agents that need durable memory, let&apos;s talk.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Talk to us
            </Link>
            <Link
              href="https://github.com/Sankhya-AI/Dhee"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              View Dhee on GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
