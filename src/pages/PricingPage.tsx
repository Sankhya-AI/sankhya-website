import {
  ArrowRight,
  Check,
  Gauge,
  KeyRound,
  Laptop,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router';
import { ChotuOrb } from '@/components/ChotuOrb';
import { Seo } from '@/components/Seo';
import {
  CHOTU_LAUNCH_TRIAL_DAYS,
  CHOTU_MANAGED_MONTHLY_CREDIT_USD,
  CHOTU_MANAGED_PRICE_INR,
  CHOTU_SUPPORTED_PLATFORM,
} from '@/config/chotu';
import { ROUTE_SEO, ROUTES } from '@/content/site';

type PlanFeature = {
  label: string;
  managed: string;
  byok: string;
};

const MANAGED_FEATURES = [
  `$${CHOTU_MANAGED_MONTHLY_CREDIT_USD} managed model credits each month`,
  'Sankhya Key with usage, token, and request visibility',
  'Top-ups when the monthly managed limit runs low',
  'Credits reset with each paid period',
] as const;

const BYOK_FEATURES = [
  'Connect your own OpenRouter or provider key',
  'Pay your model provider directly',
  'No Sankhya Key credit or usage billing',
  'Change the provider inside Chotu Settings',
] as const;

const PLAN_COMPARISON: readonly PlanFeature[] = [
  { label: 'Chotu Desktop', managed: 'Included', byok: 'Included' },
  { label: 'Dhee memory', managed: 'Included', byok: 'Included' },
  { label: 'Updates & support', managed: 'Included', byok: 'Included' },
  { label: 'Model connection', managed: 'Sankhya Key', byok: 'Your provider key' },
  { label: 'Managed monthly credits', managed: `$${CHOTU_MANAGED_MONTHLY_CREDIT_USD}`, byok: '—' },
  { label: 'Usage dashboard & top-ups', managed: 'Included', byok: 'Provider managed' },
];

const PRIMARY_CTA =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] border border-[#111820] bg-[#111820] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2b333c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d7b7a5]/50';
const SECONDARY_CTA =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] border border-[#d6dee4] bg-white px-5 text-[13px] font-semibold text-[#1f2933] transition-colors hover:bg-[#eef1f3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d7b7a5]/50';

function FeatureList({ features }: { features: readonly string[] }) {
  return (
    <ul className="space-y-2.5">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-5 text-[#53606b]">
          <Check className="mt-0.5 size-4 shrink-0 text-[#2f7b60]" />
          {feature}
        </li>
      ))}
    </ul>
  );
}

export function PricingPage() {
  const managedPrice = CHOTU_MANAGED_PRICE_INR.toLocaleString('en-IN');

  return (
    <main className="min-h-screen bg-[#fbfcfd] pt-24 text-[#1f2933]">
      <Seo {...ROUTE_SEO.pricing} />

      <section className="border-b border-[#e1e6ea] bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center lg:px-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#c46a36]">
              Chotu · Early access · {CHOTU_SUPPORTED_PLATFORM.label} ({CHOTU_SUPPORTED_PLATFORM.detail})
            </p>
            <h1 className="mt-5 max-w-4xl text-balance font-bit text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.9] tracking-[-0.04em] text-[#17202a]">
              One Chotu. Two ways to think.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-7 text-[#65727d]">
              Choose managed Sankhya Key access or connect your own provider key. The local Chotu app stays the same.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {['Mac early access', 'Dhee memory', 'Permission gates'].map((label) => (
                <span key={label} className="rounded-full border border-[#e1e6ea] bg-[#f7f8f9] px-3 py-1.5 text-[12px] font-medium text-[#53606b]">{label}</span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto grid aspect-square w-full max-w-[260px] place-items-center rounded-[28px] border border-[#e1e6ea] bg-[#f7f8f9]">
            <div className="absolute inset-5 rounded-[22px] border border-[#e7ebee] bg-white" />
            <ChotuOrb size="lg" className="relative scale-150" />
            <span className="absolute bottom-6 rounded-full bg-[#eef6f2] px-3 py-1.5 text-[12px] font-semibold text-[#2f7b60]">Early access</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#c46a36]">Plans</p>
          <h2 className="mt-3 font-sans text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-[#111820]">Choose your model connection</h2>
          <p className="mt-3 text-[14px] leading-6 text-[#65727d]">Both paths include Chotu Desktop for Apple silicon, Dhee memory, updates, and support.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="relative flex min-h-[520px] flex-col rounded-xl border border-[#d7b7a5] bg-white p-6 shadow-[0_16px_38px_rgba(41,60,66,0.05)] sm:p-8">
            <span className="absolute right-6 top-6 rounded-full bg-[#f5f0ed] px-3 py-1.5 text-[11px] font-semibold text-[#9b5a34]">Most direct</span>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-[#eef6f2]"><ShieldCheck className="size-5 text-[#2f7b60]" /></span>
              <div>
                <h3 className="font-sans text-[17px] font-semibold text-[#111820]">Paid Chotu</h3>
                <p className="mt-0.5 text-[12px] text-[#6b7782]">Includes managed Sankhya Key</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="font-sans text-[42px] font-semibold leading-none tracking-[-0.035em] text-[#111820]">₹{managedPrice}</p>
              <p className="mt-2 text-[13px] text-[#6b7782]">per month for managed model access</p>
            </div>

            <div className="my-7 border-t border-[#e1e6ea]" />
            <FeatureList features={MANAGED_FEATURES} />

            <Link to={`${ROUTES.account}?intent=get-chotu#billing`} className={`${PRIMARY_CTA} mt-auto w-full`}>
              Get Chotu<ArrowRight className="size-4" />
            </Link>
          </article>

          <article className="flex min-h-[520px] flex-col rounded-xl border border-[#e1e6ea] bg-white p-6 shadow-none sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-[#f5f0ed]"><KeyRound className="size-5 text-[#c46a36]" /></span>
              <div>
                <h3 className="font-sans text-[17px] font-semibold text-[#111820]">Bring your own key</h3>
                <p className="mt-0.5 text-[12px] text-[#6b7782]">Model billing stays with your provider</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="font-sans text-[42px] font-semibold leading-none tracking-[-0.035em] text-[#111820]">Free</p>
              <p className="mt-2 text-[13px] text-[#6b7782]">you pay your model provider directly</p>
            </div>

            <div className="my-7 border-t border-[#e1e6ea]" />
            <FeatureList features={BYOK_FEATURES} />

            <Link to={`${ROUTES.account}?intent=get-chotu#billing`} className={`${SECONDARY_CTA} mt-auto w-full`}>
              Get Chotu<ArrowRight className="size-4" />
            </Link>
          </article>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#d7b7a5] bg-[#f5f0ed] p-5">
          <Laptop className="mt-0.5 size-4 shrink-0 text-[#c46a36]" />
          <p className="text-[13px] leading-5 text-[#70452e]">
            <strong>Launch access:</strong> sign in to download Chotu Desktop for {CHOTU_LAUNCH_TRIAL_DAYS} days before choosing a plan. Managed Sankhya Key credits are not included in launch access.
          </p>
        </div>

        <div className="mt-14">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#c46a36]">Compare</p>
              <h2 className="mt-2 font-sans text-[24px] font-semibold text-[#111820]">What changes between plans</h2>
            </div>
            <p className="max-w-md text-[13px] leading-5 text-[#6b7782]">The Chotu desktop experience is shared. Only the model connection and managed services change.</p>
          </div>

          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-[#e1e6ea] bg-white sm:block">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(180px,1fr)] border-b border-[#e1e6ea] bg-[#f7f8f9] px-5 py-4 text-[12px] font-semibold text-[#404b55]">
                <span>Capability</span><span>Paid Chotu</span><span>Bring your own key</span>
              </div>
              {PLAN_COMPARISON.map((row) => (
                <div key={row.label} className="grid min-h-14 grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(180px,1fr)] items-center border-b border-[#e1e6ea] px-5 py-3 text-[13px] last:border-b-0">
                  <span className="font-medium text-[#1f2933]">{row.label}</span>
                  <span className="text-[#53606b]">{row.managed}</span>
                  <span className="text-[#53606b]">{row.byok}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2 sm:hidden">
            {PLAN_COMPARISON.map((row) => (
              <article key={row.label} className="rounded-lg border border-[#e1e6ea] bg-white p-4">
                <h3 className="font-sans text-[13px] font-semibold text-[#111820]">{row.label}</h3>
                <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-[#e1e6ea] pt-3">
                  <div>
                    <dt className="text-[10px] font-semibold text-[#6b7782]">Paid Chotu</dt>
                    <dd className="mt-1 text-[12px] font-medium text-[#404b55]">{row.managed}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold text-[#6b7782]">Your own key</dt>
                    <dd className="mt-1 text-[12px] font-medium text-[#404b55]">{row.byok}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-14 grid gap-4 rounded-xl border border-[#e1e6ea] bg-[#f7f8f9] p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-8">
          <span className="grid size-11 place-items-center rounded-lg border border-[#e1e6ea] bg-white"><Gauge className="size-5 text-[#c46a36]" /></span>
          <div>
            <h2 className="font-sans text-[17px] font-semibold text-[#111820]">Your account decides the next screen</h2>
            <p className="mt-1 text-[13px] leading-5 text-[#6b7782]">Already signed in? Get Chotu opens your dashboard. Otherwise, continue with Google first.</p>
          </div>
          <Link to={`${ROUTES.account}?intent=get-chotu`} className={`${PRIMARY_CTA} w-full sm:w-auto`}>
            Get Chotu<ArrowRight className="size-4" />
          </Link>
        </section>

        <div className="mt-8 flex items-start gap-3 rounded-lg border border-[#e1e6ea] bg-white p-4">
          <Laptop className="mt-0.5 size-4 shrink-0 text-[#c46a36]" />
          <p className="text-[12px] leading-5 text-[#6b7782]">
            Sankhya Models are coming soon and are separate from the model access available inside Chotu today.
          </p>
        </div>
      </section>
    </main>
  );
}
