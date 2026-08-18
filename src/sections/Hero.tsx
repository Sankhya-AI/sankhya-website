import { ArrowDownRight, ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router';
import { PixelDither } from '@/components/PixelDither';
import { DITHER_PRESETS, ROUTES } from '@/content/site';

const PLANK_DOWNLOAD_ROUTE = `${ROUTES.account}/desktop?intent=get-plank`;

const learningSignals = [
  ['Course', 'Valuation · Chapter 5'],
  ['Understands', 'Discounted cash flow'],
  ['Needs work', 'Growing perpetuities'],
] as const;

export function Hero() {
  return (
    <section
      id="home"
      data-navbar-inverse="true"
      className="relative isolate min-h-[900px] overflow-hidden bg-[#0d0906] pt-[148px] pb-36 text-[#fff8f0] md:pt-[178px] md:pb-48"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-[position:62%_center] bg-no-repeat md:bg-center"
        style={{ backgroundImage: 'url(/assets/sankhya-ghats-hero.png)' }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[#100904]/60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,5,3,0.94) 0%, rgba(8,5,3,0.82) 48%, rgba(8,5,3,0.46) 100%), linear-gradient(180deg, rgba(8,5,3,0.18) 0%, rgba(8,5,3,0.08) 58%, rgba(8,5,3,0.82) 100%)',
        }}
      />
      <div aria-hidden="true" className="lab-grid absolute inset-0 -z-10 opacity-[0.11]" />

      <div className="relative mx-auto w-full max-w-[1540px] px-5 md:px-8 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.62fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#f6dfc8]/72 md:text-xs">
              <span className="size-1.5 bg-[#ff7a3d]" />
              Plank · A learning agent by Sankhya AI Labs
            </div>

            <h1 className="mt-7 max-w-[1050px] text-balance font-bit text-[clamp(3.2rem,7.2vw,7.3rem)] leading-[0.89] tracking-[-0.025em] text-[#fff8f0] [text-shadow:0_3px_30px_rgba(0,0,0,0.36)]">
              Every student deserves a teacher of their own.
            </h1>

            <p className="mt-8 max-w-[760px] text-base font-medium leading-7 text-[#f6e6d6]/72 md:text-xl md:leading-8">
              Plank learns your course, sees where you get stuck, and gives you the next explanation, question, or project.
              It does not finish the work for you. It makes sure you can do it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={PLANK_DOWNLOAD_ROUTE}
                className="inline-flex h-12 items-center gap-2 border border-[#fff8f0] bg-[#fff8f0] px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#17110d] transition-colors hover:bg-white"
              >
                Download Plank · Free
                <ArrowUpRight size={15} />
              </Link>
              <a
                href={ROUTES.learning}
                className="inline-flex h-12 items-center gap-2 border border-white/28 bg-black/16 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#fff8f0] backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                See how it teaches
                <ArrowDownRight size={15} />
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.08em] text-white/54">
              {['Free to use', 'Bring your OpenRouter key', 'Apple silicon Mac'].map((label) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <Check size={12} className="text-[#ff8a5c]" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <article className="relative border border-white/16 bg-[#100d0b]/72 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-7">
            <div className="flex items-start justify-between gap-5 border-b border-white/12 pb-6">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#ff8a5c]">Dhee · Learning memory</p>
                <h2 className="mt-3 font-bit text-3xl leading-none text-[#fff8f0]">What Plank knows now</h2>
              </div>
              <img src="/assets/plank-icon.svg" alt="" className="size-16" width="64" height="64" />
            </div>
            <dl className="divide-y divide-white/10">
              {learningSignals.map(([label, value], index) => (
                <div key={label} className="grid grid-cols-[105px_minmax(0,1fr)] gap-4 py-4 text-sm">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/36">{label}</dt>
                  <dd className={index === learningSignals.length - 1 ? 'text-[#ff9b78]' : 'text-white/76'}>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="border-l-2 border-[#ff7548] bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white/62">
              Next: one worked example, then a question that proves the denominator is understood.
            </p>
          </article>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-white/20 pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/48 md:mt-20">
          <span>Plank / Dhee / Chotu</span>
          <span className="hidden sm:inline">Teach · Remember · Act</span>
        </div>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-36 sm:h-44 md:h-56">
        <PixelDither {...DITHER_PRESETS.hero} className="opacity-100" />
      </div>
    </section>
  );
}
