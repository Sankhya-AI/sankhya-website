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
        title="Building Dhee, a portable memory OS that turns any coding agent into a personalized, self-evolving collaborator."
        description="Dhee gives any agent a persistent, portable cognition layer that routes the right context at the right time, adapts from usage, and lets multiple agents collaborate through shared memory instead of through a separate orchestrator."
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
              The surface stays small on purpose. Dhee is meant to plug into the agents you already run, not force a new workflow just to get durable memory.
            </p>
          </aside>
        }
      />

      <section className="space-y-8">
        <SectionHeading
          eyebrow="What Dhee does"
          title="Portable memory, context routing, and self-evolution for coding agents."
          description="Dhee keeps the layer around the model stable so software agents can remember, resume, and collaborate without reloading bloated context into every run."
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
            Most memory systems today live inside a model session. That feels convenient until the provider changes, the context window shifts, or the same developer keeps paying to replay history, rules, and tool output. Dhee keeps that layer portable so the cognition survives those changes.
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            This is not about replacing the model. It is about giving the model a durable substrate for memory, context, and state so performance does not collapse every time the surface changes.
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
            Most multi-agent systems add another agent whose job is orchestration. We think that is the wrong abstraction. Dhee lets any coding agent become a self-evolving collaborator by giving it shared memory, artifacts, checkpoints, and resumable state.
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
          description="Dhee is most useful when agents need to carry state across time, providers, and teammates while staying efficient under growing context."
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
