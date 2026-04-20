import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { contactCards, contactMeta } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Sankhya AI Labs about Dhee, agent memory, context routing, multi-agent infrastructure, or SensAI.",
};

export default function ContactPage() {
  return (
    <div className="space-y-20 pb-10 md:space-y-24 md:pb-14">
      <PageHero
        eyebrow="Contact"
        title="Let&apos;s talk about memory, context, and agent continuity."
        description="If you are exploring Dhee or building agents that need better memory, start here."
        primaryCta={{ label: "Explore Dhee", href: "/products/dhee" }}
        secondaryCta={{ label: "See the systems", href: "/models" }}
      />

      <section className="grid gap-5 md:grid-cols-3">
        {contactCards.map((card) => (
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
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <ContactForm />
        <div className="space-y-6">
          <article className="surface-card p-7 md:p-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Direct links
            </p>
            <div className="mt-6 space-y-4">
              <Link
                href="/products/dhee"
                className="flex items-center justify-between rounded-[1.2rem] border border-[var(--border)] bg-white px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>Dhee product page</span>
                <span className="text-[var(--muted)]">sankhyaailabs.com/products/dhee</span>
              </Link>
              <Link
                href="https://github.com/Sankhya-AI/Dhee"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-[1.2rem] border border-[var(--border)] bg-white px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>Dhee on GitHub</span>
                <span className="text-[var(--muted)]">github.com</span>
              </Link>
              <Link
                href="/models"
                className="flex items-center justify-between rounded-[1.2rem] border border-[var(--border)] bg-white px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>Systems overview</span>
                <span className="text-[var(--muted)]">sankhyaailabs.com/models</span>
              </Link>
              <Link
                href="/products/sensai"
                className="flex items-center justify-between rounded-[1.2rem] border border-[var(--border)] bg-white px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>SensAI product page</span>
                <span className="text-[var(--muted)]">sankhyaailabs.com/products/sensai</span>
              </Link>
            </div>
          </article>

          <article className="surface-card p-7 md:p-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Contact path
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
              Mail-first for now
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Simple email for now.
            </p>
            <a
              href={`mailto:${contactMeta.email}`}
              className="btn-secondary mt-6 min-h-12 px-5 py-3 text-sm"
            >
              {contactMeta.email}
            </a>
          </article>
        </div>
      </section>
    </div>
  );
}
