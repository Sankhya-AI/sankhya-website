import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { PixelDither } from '../components/PixelDither';

export function Hero() {
  return (
    <section
      id="home"
      data-navbar-inverse="true"
      className="relative z-20 min-h-[820px] w-full overflow-hidden bg-[#0f0a06] pt-[156px] pb-20 md:min-h-[860px] md:pt-[224px]"
    >
      {/* Background image with parallax-like fixed attachment */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/sankhya-ghats-hero.png)' }}
      />

      {/* Darkening overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Radial spotlight over the image */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Subtle grid overlay for texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'linear-gradient(180deg, transparent 0%, black 18%, black 70%, transparent 100%)',
        }}
      />

      {/* Hero content */}
      <div className="relative z-20 mx-auto flex max-w-[1500px] flex-col items-center px-4 text-center md:px-8">
        <h1
          className="max-w-[1160px] font-bit text-[44px] font-normal leading-[1.04] text-[#fff8f0] md:text-[68px] xl:text-[80px]"
          style={{
            textShadow:
              '0 2px 8px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3)',
          }}
        >
          Let <span className="text-[#ff8a4c]">Chotu</span> use your laptop
          like you do.
        </h1>

        <p className="mt-6 max-w-[830px] font-sans text-base font-medium leading-[1.62] text-[#d8cfc4] md:text-lg">
          Chotu sees what you see, remembers what you ask it to keep, and
          completes tasks through Claude, Codex, browser, terminal, and local
          tools. It asks before risky steps and shows what changed.
        </p>

        <div className="mt-6 flex max-w-[980px] flex-wrap items-center justify-center gap-2 font-mono text-[10px] font-bold uppercase leading-none text-[#b8afa6] md:text-[11px]">
          {[
            'See your screen',
            'Use your tools',
            'Remember your rules',
            'Ask before changes',
            'Show proof',
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/15 bg-white/8 px-3 py-2 shadow-[0_1px_0_rgba(20,17,15,0.2)]"
            >
              {item}
            </span>
          ))}
          <a
            href="https://github.com/Sankhya-AI/Dhee/blob/main/benchmarks/longmemeval/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-[#c84f29]/40 bg-[#c84f29]/15 px-3 py-2 text-[#ff9e7a] transition-colors hover:bg-[#c84f29]/25 hover:text-[#ffdac9]"
          >
            Dhee memory proof
            <ArrowUpRight size={12} />
          </a>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/pricing"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#f8ead8]/70 bg-[#f8ead8] px-5 py-2 font-mono text-sm font-bold text-[#15110e] shadow-sm transition-colors hover:bg-white"
          >
            <Download size={16} />
            Download / Sign in
          </a>
          <a
            href="#stack"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 py-2 font-mono text-sm font-medium text-[#ede8e1] shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            See how Chotu works
            <ArrowDown size={15} />
          </a>
        </div>
      </div>

      {/* Pixel Dither transition at bottom */}
      <section
        aria-hidden="true"
        className="absolute inset-x-0 top-[706px] z-10 hidden h-[270px] sm:block"
      >
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
