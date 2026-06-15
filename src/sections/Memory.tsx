import { ArrowUpRight } from 'lucide-react';
import { ChotuMemoryShowcase } from '../components/ChotuProductShowcase';

export function Memory() {
  return (
    <section id="memory" className="flex min-h-[calc(100svh-112px)] w-full items-center border-y border-[#c9c2ba] bg-cream grid-pattern px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto grid w-full max-w-[1500px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-normal text-[#8b8580]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cf5a32]" />
            Remember with Dhee
          </div>
          <h2 className="max-w-[700px] font-pixel text-[46px] leading-[0.95] text-[#14110f] md:text-[72px]">
            Tell Chotu what to remember.
          </h2>
          <p className="mt-6 max-w-[680px] font-mono text-base leading-relaxed text-[#6f6760]">
            Chotu should not ask you the same setup questions every week.
            Dhee is the memory layer underneath Chotu: it keeps preferences,
            decisions, work history, rejected paths, and proof useful across
            sessions while leaving noisy history behind.
          </p>
          <a
            href="https://github.com/Sankhya-AI/Dhee/blob/main/benchmarks/longmemeval/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#1a1a1a]/70 px-4 py-2 font-mono text-sm font-medium text-[#28231f] transition-colors hover:bg-[#e8e4dc]"
          >
            See Dhee memory proof
            <ArrowUpRight size={15} />
          </a>
        </div>

        <ChotuMemoryShowcase />
      </div>
    </section>
  );
}
