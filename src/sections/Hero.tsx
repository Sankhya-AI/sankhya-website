import { ArrowUpRight, Github } from 'lucide-react';
import { ChotuOrb } from '../components/ChotuOrb';
import { PixelDither } from '../components/PixelDither';

export function Hero() {
  return (
    <section id="home" className="relative z-20 min-h-[840px] w-full overflow-hidden bg-[#f8ead8] pt-[172px] pb-20 md:min-h-[880px] md:pt-[252px]">
      <div className="absolute inset-x-0 top-[88px] h-[756px] overflow-hidden">
        <img
          src="/assets/sankhya-hero-clean-fabric.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover object-center opacity-72 md:block"
        />
        <img
          src="/assets/sankhya-hero-clean-fabric.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full object-cover object-[52%_50%] opacity-72 md:hidden"
        />
      </div>

      <div className="absolute inset-x-0 top-[88px] h-[756px] bg-[linear-gradient(180deg,rgba(255,255,255,0.56)_0%,rgba(255,244,226,0.22)_42%,rgba(248,234,216,0)_100%)]" />
      <div className="absolute inset-x-0 top-[88px] h-[756px] bg-[radial-gradient(ellipse_at_50%_34%,rgba(255,250,244,0.9)_0%,rgba(255,247,235,0.66)_38%,rgba(248,234,216,0.1)_74%,rgba(248,234,216,0)_100%)]" />

      <div className="relative z-20 mx-auto flex max-w-[1500px] flex-col items-center px-4 text-center md:px-8">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#d8d3ca] bg-[#fffaf2]/92 py-1.5 pl-1.5 pr-4 text-left shadow-[0_2px_0_rgba(20,17,15,0.08),0_16px_42px_rgba(42,18,8,0.10)] backdrop-blur-sm">
          <ChotuOrb size="md" />
          <span className="font-mono text-sm font-bold leading-none text-[#4b4641]">Chotu is live</span>
        </div>

        <h1
          className="mt-6 max-w-[1220px] font-bit text-[48px] font-normal leading-[1.06] text-[#201008] md:text-[72px] xl:text-[88px]"
          style={{ textShadow: '0 1px 0 rgba(255,250,244,0.88), 0 0 34px rgba(255,250,244,0.9)' }}
        >
          Superhuman architecture for agents that work everywhere.
        </h1>

        <p className="mt-5 max-w-[920px] font-mono text-sm font-medium leading-[1.32] text-[#35251b] md:mt-6 md:text-base">
          Sankhya AI Labs builds the memory, runtime, and control systems that turn frontier models into reliable agents for every serious workflow.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] font-bold uppercase leading-none text-[#5d4d43] md:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#cf5a32]" />
          <span>Native to Kimi K2.6. Powered by Dhee. Recall R@5 99.4% on LongMemEval.</span>
          <a
            href="https://github.com/Sankhya-AI/Dhee/blob/main/benchmarks/longmemeval/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#c84f29] underline decoration-[#c84f29]/35 underline-offset-4 transition-colors hover:text-[#8f3519]"
          >
            proof
            <ArrowUpRight size={12} />
          </a>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/Sankhya-AI/dhee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#2a1208]/70 bg-[#f0ede6]/82 px-4 py-2 font-mono text-sm font-medium text-[#2a1208] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#e8e4dc]"
          >
            <Github size={16} />
            Dhee GitHub
          </a>
        </div>
      </div>

      <section aria-hidden="true" className="absolute inset-x-0 top-[706px] z-10 hidden h-[270px] sm:block">
        <PixelDither
          fillColor="var(--bg-dark)"
          pattern="noise"
          seed={11}
          direction="bottom-up"
          startWeight={0.05}
          erosionWeight={0.62}
          pixelSize={18}
          className="opacity-100"
        />
      </section>
    </section>
  );
}
