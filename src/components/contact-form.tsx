"use client";

import { useMemo, useState } from "react";

import { contactMeta } from "@/content/site";

const interestOptions = [
  "Deploy Dhee in our runtime",
  "Agent infrastructure partnership",
  "SensAI conversation",
  "Research conversation",
  "General conversation",
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    interest: interestOptions[0],
    message: "",
  });

  const mailtoHref = useMemo(() => {
    const subject = `${form.interest} | Sankhya AI Labs enquiry`;
    const body = [
      `Name: ${form.name || "-"}`,
      `Organization: ${form.organization || "-"}`,
      `Email: ${form.email || "-"}`,
      `Interest: ${form.interest || "-"}`,
      "",
      "Message:",
      form.message || "-",
    ].join("\n");

    return `mailto:${contactMeta.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  return (
    <section className="surface-card p-7 md:p-8">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
        Start the conversation
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
        Tell us what you are trying to build
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        Fill this out and it will open your mail client with a structured brief.
        That keeps the first conversation simple while the site stays lightweight.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          <span>Name</span>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className="h-13 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
            placeholder="Your name"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          <span>Organization</span>
          <input
            value={form.organization}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                organization: event.target.value,
              }))
            }
            className="h-13 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
            placeholder="Company, runtime team, lab, or studio"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="h-13 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
            placeholder="name@company.com"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          <span>What is this about?</span>
          <select
            value={form.interest}
            onChange={(event) =>
              setForm((current) => ({ ...current, interest: event.target.value }))
            }
            className="h-13 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
          >
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-[var(--ink)] md:col-span-2">
          <span>Message</span>
          <textarea
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({ ...current, message: event.target.value }))
            }
            className="min-h-40 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
            placeholder="Tell us about the agents, workflows, or memory problem you want to solve."
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={mailtoHref}
          className="btn-primary"
        >
          Open enquiry email
        </a>
        <a
          href={`mailto:${contactMeta.email}`}
          className="btn-secondary"
        >
          Write directly
        </a>
      </div>
    </section>
  );
}
