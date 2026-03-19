import Link from "next/link";

import { ProductFrame } from "@/components/product-frame";
import { SectionHeading } from "@/components/section-heading";
import {
  homeHero,
  homeStats,
  indiaFirstPoints,
  labPhilosophy,
  modelCards,
  problemCards,
  productShowcases,
  stackLayers,
} from "@/content/site";

export default function Home() {
  return (
    <div className="space-y-20 pb-10 md:space-y-28 md:pb-14">
      {/* ─── HERO: SANA MINIMALISM ─── */}
      <section className="hero-minimal relative isolate mt-2 flex min-h-[85vh] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--border)] px-4 py-14 text-center sm:mt-3 sm:px-6 sm:py-16 md:rounded-[2.75rem] md:px-10 md:py-20 lg:mt-0">
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center">
          {homeHero.eyebrow ? (
            <p className="hero-animate text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)] sm:text-[0.78rem] sm:tracking-[0.34em]">
              {homeHero.eyebrow}
            </p>
          ) : null}
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
            {homeHero.secondaryCta && (
              <Link
                href={homeHero.secondaryCta.href}
                className="btn-secondary min-h-12 border-transparent bg-transparent px-6 text-base hover:bg-[var(--surface-soft)]"
              >
                {homeHero.secondaryCta.label} →
              </Link>
            )}
          </div>
        </div>

        {/* Teaching Stack Visual */}
        <div className="hero-animate hero-animate-delay-4 relative z-10 mt-12 w-full max-w-3xl md:mt-24">
          
          {/* Ambient Glows behind the glass terminal */}
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
                Teaching stack status
              </div>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="terminal-line opacity-50">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.00</span>
                <span>[system] Loading SensAI classroom stack...</span>
              </div>
              <div className="terminal-line mt-2 opacity-75">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.12</span>
                <span>[dhee] Learner memory attached. Prior progress restored.</span>
              </div>
              <div className="terminal-line mt-2 opacity-90">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.26</span>
                <span>[akshar/shlok] Speech input and teaching voice ready.</span>
              </div>
              <div className="terminal-line mt-2">
                <span className="shrink-0 w-12 text-[var(--muted)]">00.45</span>
                <span>
                  <span className="text-emerald-600 font-semibold">success</span> Session live. Lesson flow, notes, and guidance online...<span className="terminal-cursor" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STAT STRIP ─── */}
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

      {/* ─── PHILOSOPHY: WHY SMALL MODELS ─── */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Why this stack"
          title="An AI teacher needs memory, speech, and structure"
          description="Useful education AI is not just a chatbot. It has to remember the learner, understand spoken input, explain clearly, and work inside the real constraints of Indian classrooms and coaching workflows."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {labPhilosophy.map((item) => (
            <article key={item.title} className="surface-card p-6 md:p-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)] text-xl text-[var(--accent)]">
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── MODELS: THE CORE OFFERING ─── */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="What we are building"
          title="One product surface, four core systems behind it"
          description="SensAI is the visible product. Underneath it, we are building Dhee for learner memory, Akshar for speech recognition, Shlok for instructional voice, and a compact runtime for lower-cost deployment."
        />
        <div className="grid gap-4">
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
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://github.com/Sankhya-AI/Dhee"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary min-h-11 px-5 py-2.5 text-sm"
          >
            View Dhee on GitHub ↗
          </Link>
          <Link
            href="/models"
            className="btn-secondary min-h-11 px-5 py-2.5 text-sm"
          >
            Learn more about our models →
          </Link>
        </div>
      </section>

      {/* ─── WHY THIS MATTERS: THE PROBLEM ─── */}
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Why this matters"
            title="Generic AI tools do not solve Indian education well"
            description="Most AI products are built for broad conversation, stable connectivity, and English-first workflows. Teaching in India needs tighter memory, clearer speech handling, and systems that work in real institutional conditions."
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
            Build the stack education actually needs.
          </h3>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--muted)]">
            Sankhya&apos;s answer is to own the layers that shape teaching quality:
            learner memory, speech input, instructional voice, and efficient
            deployment. That is how we move beyond generic chat and toward a
            product that can actually support Indian classrooms and coaching
            systems.
          </p>
          <div className="mt-8 grid gap-4">
            {homeStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              >
                <div className="text-3xl font-semibold tracking-tight text-[var(--ink)]">
                  {item.value}
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SENSAI: PROOF OF WORK ─── */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Proof in product"
          title="SensAI is where the stack meets the classroom"
          description="SensAI is our adaptive AI teacher product for schools, coaching institutes, and learners. It is where we test teaching workflows, memory continuity, and product behavior with real users instead of stopping at model demos."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {productShowcases.map((showcase) => (
            <ProductFrame key={showcase.title} showcase={showcase} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://www.sensai.co.in"
            target="_blank"
            rel="noreferrer"
            className="btn-primary min-h-11 px-5 py-2.5 text-sm"
          >
            Explore SensAI ↗
          </Link>
          <Link
            href="/products"
            className="btn-secondary min-h-11 px-5 py-2.5 text-sm"
          >
            Learn more about SensAI →
          </Link>
        </div>
      </section>

      {/* ─── INDIA-FIRST: WHY INDIA ─── */}
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-card p-6 md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            India-first by design
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Building for India forces better model decisions
          </h3>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            The constraints — multiple languages, mixed devices, unreliable
            connectivity, dense classrooms — are features, not bugs. They force
            us to build models that are smaller, faster, and more resilient. If
            our models work here, they work anywhere.
          </p>
          <div className="mt-8 grid gap-4">
            {modelCards.map((model) => (
              <div
                key={model.name}
                className="rounded-[1.3rem] border border-[var(--border)] bg-white p-5 shadow-[0_20px_45px_rgba(15,20,31,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-semibold text-[var(--ink)]">
                      {model.name}
                    </h4>
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
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="grid gap-px bg-[var(--border)] md:grid-cols-2">
            {indiaFirstPoints.map((point) => (
              <div key={point.title} className="bg-white p-6 md:p-7">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                  {point.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="surface-card p-8 md:p-12 lg:p-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Built in India. Built for India.
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
            Deploy SensAI or build with the stack
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
            If you&apos;re a school, college, coaching institute, or a partner
            interested in memory, speech, and learning infrastructure for
            education, we&apos;d love to talk.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn-primary">
              Talk to us
            </Link>
            <Link href="/products" className="btn-secondary">
              Explore SensAI
            </Link>
            <Link
              href="https://github.com/Sankhya-AI/Dhee"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Dhee on GitHub ↗
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
