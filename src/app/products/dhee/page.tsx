import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { dheeCapabilities, dheeUseCases } from "@/content/site";

const coreLoop = ["remember()", "route()", "checkpoint()", "handoff()"];
const integrationModes = ["MCP", "Python", "CLI", "Native runtimes"];

export const metadata: Metadata = {
  title: "Dhee",
  description:
    "Explore Dhee, Sankhya AI Labs' Memory OS for AGI cognition.",
};

export default function DheePage() {
  return (
    <div className="space-y-20 pb-10 md:space-y-24 md:pb-14">
      <PageHero
        eyebrow="Product: Dhee"
        title="Dhee is portable memory for coding agents."
        description="It routes the right context, improves through use, and lets agents collaborate through shared memory."
        primaryCta={{ label: "View Dhee on GitHub", href: "https://github.com/Sankhya-AI/Dhee", external: true }}
        secondaryCta={{ label: "Talk to us", href: "/contact" }}
        aside={
          <aside className="surface-card space-y-6 p-6 md:p-7">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                Core loop
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {coreLoop.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--ink)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                Adoption modes
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {integrationModes.map((mode) => (
                  <span
                    key={mode}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-sm font-medium text-[var(--ink-soft)]"
                  >
                    {mode}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm leading-7 text-[var(--muted)]">
              Small surface. Easy to plug in. No new workflow just to get memory.
            </p>
          </aside>
        }
      />

      <section className="space-y-8">
        <SectionHeading
          eyebrow="What Dhee does"
          title="Memory, routing, and collaboration."
          description="Dhee helps agents remember, resume, and work together without replaying everything."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {dheeCapabilities.map((capability) => (
            <article key={capability.title} className="surface-card p-6">
              <h3 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {capability.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {capability.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <article className="surface-card p-7 md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Why it matters
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Own memory outside the provider.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            Most memory systems live inside a model session. That breaks when the provider changes or the task gets long.
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            Dhee keeps memory outside the provider so agents can keep working with stable context.
          </p>
        </article>
        <article className="surface-card p-7 md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            How it behaves
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            No orchestrator agent in the middle.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            Most multi-agent systems add a boss agent. Dhee lets agents coordinate through shared memory instead.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--ink-soft)]">
              Agents collaborate through shared digests and artifacts, not through one controller agent.
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--ink-soft)]">
              Context is routed per task, so the active agent gets the right slice without drowning in history or wasting tokens on full transcript replay.
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--ink-soft)]">
              Every resume, expansion, and handoff becomes feedback that sharpens future retrieval.
            </div>
          </div>
        </article>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Where it fits"
          title="Built for real agent work, not just clean demos."
          description="Best for long tasks, repeated sessions, and multi-agent workflows."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {dheeUseCases.map((useCase) => (
            <article key={useCase.title} className="surface-card p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                {useCase.label}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {useCase.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {useCase.description}
              </p>
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
              If you want to stop wasting context and give your agents real memory, let&apos;s talk.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://github.com/Sankhya-AI/Dhee"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              View on GitHub
            </Link>
            <Link href="/models" className="btn-secondary">
              Explore the systems
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
