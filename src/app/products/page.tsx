import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { productCapabilities, productShowcases, productUseCases } from "@/content/site";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore SensAI and the learning workflows Sankhya AI Labs is building for institutions and learners.",
};

export default function ProductsPage() {
  return (
    <div className="space-y-20 pb-10 md:space-y-24 md:pb-14">
      <PageHero
        eyebrow="Products"
        title="SensAI is our flagship learning platform"
        description="SensAI turns Sankhya’s teaching logic into an actual learner experience: structured modules, guided study, AI-assisted notes, and teacher support across curriculum learning and competitive preparation."
        primaryCta={{ label: "Talk to us", href: "/contact" }}
        secondaryCta={{ label: "Visit SensAI", href: "https://www.sensai.co.in", external: true }}
      />

      <section className="space-y-8">
        <SectionHeading
          eyebrow="What it does"
          title="A product surface for teaching, not just answering"
          description="SensAI is meant to feel like a learning workflow. It helps create structure, carry context forward, and support the learner through notes, modules, and AI teaching assistance."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {productCapabilities.map((capability) => (
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

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Product proof"
          title="Three views into the current SensAI experience"
          description="These are current product surfaces that show how the learner flow is already being shaped."
        />
        <div className="space-y-10">
          {productShowcases.map((showcase, index) => (
            <article
              key={showcase.title}
              className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-3 shadow-[0_24px_60px_rgba(15,20,31,0.08)]">
                  <div className="absolute inset-x-3 top-3 h-10 rounded-[1rem] border border-[var(--border)] bg-[var(--surface-soft)]" />
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white pt-12">
                    <Image
                      src={showcase.image}
                      alt={showcase.alt}
                      width={1365}
                      height={768}
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  {showcase.eyebrow}
                </p>
                <h3 className="text-4xl font-semibold tracking-tight text-[var(--ink)]">
                  {showcase.title}
                </h3>
                <p className="max-w-xl text-base leading-8 text-[var(--muted)]">
                  {showcase.description}
                </p>
                <div className="grid gap-3">
                  {showcase.points.map((point) => (
                    <div
                      key={point}
                      className="rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--ink-soft)] shadow-[0_18px_36px_rgba(15,20,31,0.04)]"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Deployment modes"
          title="The same product can support institutions and direct learners"
          description="The teaching stack stays the same. The surrounding workflow changes depending on who is using it."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {productUseCases.map((useCase) => (
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
              Product next step
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              If you want to see SensAI in the context of your institution or
              learner cohort, let’s talk.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="btn-primary"
            >
              Talk to us
            </Link>
            <Link
              href="https://www.sensai.co.in"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Open sensai.co.in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
