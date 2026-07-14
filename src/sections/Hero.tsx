import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { PixelDither } from '@/components/PixelDither';
import { DITHER_PRESETS, ROUTES } from '@/content/site';

export function Hero() {
  return (
    <section
      id="home"
      data-navbar-inverse="true"
      className="relative isolate min-h-[810px] overflow-hidden bg-[#0d0906] pt-[150px] pb-36 text-[#fff8f0] md:min-h-[880px] md:pt-[190px] md:pb-48"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-[position:58%_center] bg-no-repeat md:bg-center"
        style={{ backgroundImage: 'url(/assets/sankhya-ghats-hero.png)' }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[#100904]/55" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,5,3,0.86) 0%, rgba(8,5,3,0.62) 54%, rgba(8,5,3,0.32) 100%), linear-gradient(180deg, rgba(8,5,3,0.20) 0%, rgba(8,5,3,0.08) 58%, rgba(8,5,3,0.78) 100%)',
        }}
      />
      <div aria-hidden="true" className="lab-grid absolute inset-0 -z-10 opacity-[0.11]" />

      <div className="relative mx-auto w-full max-w-[1540px] px-5 md:px-8 lg:px-10">
        <div className="max-w-[1110px]">
          <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#f6dfc8]/72 md:text-xs">
            <span className="size-1.5 bg-[#ff7a3d]" />
            Sankhya AI Labs
          </div>

          <h1 className="mt-7 text-balance font-bit text-[clamp(3.1rem,7.2vw,7.25rem)] leading-[0.91] tracking-[-0.025em] text-[#fff8f0] [text-shadow:0_3px_30px_rgba(0,0,0,0.36)]">
            AI systems that remember, act, and reason together.
          </h1>

          <div className="mt-8 max-w-[760px]">
            <p className="max-w-[720px] text-base font-medium leading-7 text-[#f6e6d6]/72 md:text-xl md:leading-8">
              We build the memory layer, personal agent, and mixture-of-agents models that make intelligence compound.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={ROUTES.systems}
                className="inline-flex h-11 items-center gap-2 border border-[#fff8f0] bg-[#fff8f0] px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#17110d] transition-colors hover:bg-white"
              >
                Explore our systems
                <ArrowDownRight size={15} />
              </a>
              <Link
                to={ROUTES.research}
                className="inline-flex h-11 items-center gap-2 border border-white/28 bg-black/16 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#fff8f0] backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Read the research
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-white/20 pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/48 md:mt-20">
          <span>Memory / Agents / Models</span>
          <span className="hidden sm:inline">One system · Three layers</span>
        </div>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-36 sm:h-44 md:h-56">
        <PixelDither {...DITHER_PRESETS.hero} className="opacity-100" />
      </div>
    </section>
  );
}
