import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Boxes, Check, Copy, Terminal } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { MODEL_RUNTIME, ROUTES } from '@/content/site';
import type { ReadyMode } from '../shared/mode';
import { SectionHeading, StatusPill } from '../shared/primitives';
import { CARD_CLASS, SECONDARY_BUTTON } from '../shared/styles';

const BUILD_STEPS = [
  ['Open Models in Chotu', 'The Models screen lists what we recommend and what you have built.'],
  ['Pick brains and powers', 'Choose a model per role, attach the capabilities the work needs, set a budget.'],
  ['Use it like any model', 'Your model appears in the composer, and answers chat and code on this Mac.'],
] as const;

/**
 * Models are built and served on the customer's own machine, so this section is a
 * pointer and a connection recipe rather than a control panel — there is nothing
 * on the server for the website to read.
 */
export function ModelsSection({ mode }: { mode: ReadyMode }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied((current) => (current === label ? null : current)), 1600);
    } catch {
      setCopied(null);
    }
  };

  const keyLine =
    mode === 'managed'
      ? 'Your Sankhya Key authorises the runtime. Every brain inside a model draws from the same monthly credits.'
      : mode === 'byok'
        ? 'Your own provider key authorises the brains inside your models, so that usage bills with your provider.'
        : 'Choose how Chotu connects to models and your builds will have brains to work with.';

  return (
    <section className="space-y-3">
      <SectionHeading title="Your models" detail="Models you build inside Chotu, and how to call them from your own code." />

      <article className={CARD_CLASS}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#e1e6ea] bg-[#f7f8f9]"><Boxes className="size-5 text-[#c46a36]" /></span>
            <div>
              <h2 className="text-[15px] font-semibold text-[#111820]">Built in Chotu, served on your Mac</h2>
              <p className="mt-1 max-w-2xl text-[13px] leading-5 text-[#6b7782]">
                A model is a recipe: the brains you choose, the powers you attach, and a budget. Sankhya compiles it and
                serves it locally under one model id — nothing to deploy.
              </p>
            </div>
          </div>
          <StatusPill tone="neutral">Local runtime</StatusPill>
        </div>

        <ol className="mt-5 grid overflow-hidden rounded-lg border border-[#e1e6ea] sm:grid-cols-3">
          {BUILD_STEPS.map(([title, detail], index) => (
            <li key={title} className="border-b border-[#e1e6ea] bg-[#f7f8f9] p-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
              <span className="grid size-5 place-items-center rounded-full bg-white text-[10px] font-semibold text-[#c46a36]">{index + 1}</span>
              <p className="mt-3 text-[12px] font-semibold text-[#404b55]">{title}</p>
              <p className="mt-1 text-[11px] leading-4 text-[#6b7782]">{detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#e1e6ea] pt-4">
          <Link to={ROUTES.models} className={`inline-flex items-center justify-center gap-2 ${SECONDARY_BUTTON}`}>
            How model building works<ArrowUpRight className="size-4" />
          </Link>
          <Link to={`${ROUTES.account}/desktop`} className={`inline-flex items-center justify-center gap-2 ${SECONDARY_BUTTON}`}>
            Get Chotu Desktop<ArrowRight className="size-4" />
          </Link>
        </div>
      </article>

      <article className={CARD_CLASS}>
        <div className="flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#e1e6ea] bg-[#f7f8f9]"><Terminal className="size-5 text-[#6b7782]" /></span>
          <div>
            <h2 className="text-[15px] font-semibold text-[#111820]">Call your models from your own code</h2>
            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-[#6b7782]">
              The runtime speaks the OpenAI chat-completions API, so point an existing client at it and pass your model id.
            </p>
          </div>
        </div>

        <dl className="mt-5 divide-y divide-[#e1e6ea] overflow-hidden rounded-lg border border-[#e1e6ea]">
          {[
            ['Base URL', MODEL_RUNTIME.baseUrl],
            ['Model id', `${MODEL_RUNTIME.idPrefix}your-model`],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-2 bg-[#f7f8f9] px-3 py-3 sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:items-center sm:gap-[18px]">
              <dt className="text-[12px] font-medium text-[#6b7782]">{label}</dt>
              <dd className="min-w-0 break-all font-mono text-[12px] text-[#1f2933]">{value}</dd>
              <Button
                type="button"
                variant="outline"
                onClick={() => void copy(label, value)}
                className="min-h-8 shrink-0 justify-self-start rounded-[7px] border-[#d6dee4] bg-white px-2.5 text-[11px] font-medium text-[#404b55] hover:bg-[#eef1f3] sm:justify-self-end"
              >
                {copied === label ? <Check className="size-3.5 text-[#2f7b60]" /> : <Copy className="size-3.5" />}
                {copied === label ? 'Copied' : 'Copy'}
              </Button>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-[12px] leading-5 text-[#6b7782]">{keyLine}</p>

        {mode === 'managed' ? (
          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-[#e1e6ea] pt-4 sm:flex-row sm:items-center">
            <p className="text-[12px] leading-5 text-[#6b7782]">
              One request to your model can call several brains, so a turn may draw more credits than a single model would.
            </p>
            <Link to={`${ROUTES.account}/sankhya-key`} className={`inline-flex shrink-0 items-center justify-center gap-2 ${SECONDARY_BUTTON}`}>
              View credit usage<ArrowRight className="size-4" />
            </Link>
          </div>
        ) : mode === 'byok' ? null : (
          <div className="mt-4 border-t border-[#e1e6ea] pt-4">
            <Link to={`${ROUTES.account}/billing`} className={`inline-flex items-center justify-center gap-2 ${SECONDARY_BUTTON}`}>
              Choose model access<ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </article>
    </section>
  );
}
