import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { EXTERNAL_ROUTES, ROUTES } from '@/content/site';

export function CompanyClose() {
  return (
    <section id="company" className="scroll-mt-24 bg-[#e6dfd5] text-[#171411]">
      <div className="mx-auto grid max-w-[1540px] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[220px_minmax(0,980px)] lg:px-10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">
          04 / Company
        </p>
        <div>
          <p className="max-w-5xl text-balance font-bit text-[clamp(2.3rem,4.4vw,4.8rem)] leading-[0.98] tracking-[-0.02em]">
            Sankhya AI Labs turns memory, agency, and collective reasoning into systems people can actually use.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={EXTERNAL_ROUTES.dhee}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 border border-[#171411] bg-[#171411] px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#f8ead8] hover:bg-[#2c2722]"
            >
              Explore Dhee <ArrowUpRight size={14} />
            </a>
            <Link
              to={ROUTES.pricing}
              className="inline-flex h-11 items-center gap-2 border border-[#171411]/35 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] hover:border-[#171411]"
            >
              Get Chotu <ArrowUpRight size={14} />
            </Link>
            <Link
              to={ROUTES.research}
              className="inline-flex h-11 items-center gap-2 border border-[#171411]/35 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] hover:border-[#171411]"
            >
              Read lab notes <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
