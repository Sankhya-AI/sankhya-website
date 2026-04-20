import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { aboutPrinciples, companyStory } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sankhya AI Labs is building Dhee as its main product and the cognitive infrastructure around self-evolving agents.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-10 md:space-y-24 md:pb-14">
      <PageHero
        eyebrow="About Sankhya AI Labs"
        title="We think AGI needs a memory OS, not just a bigger model."
        description="Sankhya AI Labs builds the memory and context layer around models. Dhee is the main product. SensAI is secondary."
        primaryCta={{ label: "Explore Dhee", href: "/products/dhee" }}
        secondaryCta={{ label: "See the systems", href: "/models" }}
      />

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card p-7 md:p-10">
          <SectionHeading
            eyebrow="The name"
            title="Sankhya stands for structure, clarity, and disciplined thinking."
            description="In the Samkhya tradition, understanding comes from careful distinction and layered reasoning. That maps naturally to how we think about agents: better cognition comes from the right structure around the model, not from scale alone."
          />
        </div>
        <div className="surface-card p-7 md:p-10">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Core belief
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Memory is the first system.
          </h3>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            If agents cannot hold state across time, they are not reliable on real work.
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            That is why Dhee is the main product for us.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Who we are"
          title="A product lab shaping agent cognition through shipped systems."
          description="We care about what actually helps agents work better in real coding workflows."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {companyStory.map((item) => (
            <article key={item.title} className="surface-card p-6">
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

      <section className="surface-card overflow-hidden">
        <div className="grid gap-px bg-[var(--border)] md:grid-cols-2">
          {aboutPrinciples.map((principle) => (
            <article key={principle.title} className="bg-white p-7 md:p-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                {principle.label}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
