import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

export type ChotuShowcaseStep = {
  eyebrow: string;
  title: string;
  caption: string;
  screen: string;
  screenAlt: string;
  screenLabel: string;
  proof: string[];
  tone?: 'light' | 'dark';
};

function ScreenShell({
  children,
  label,
  tone = 'light',
}: {
  children: ReactNode;
  label: string;
  tone?: 'light' | 'dark';
}) {
  const isDark = tone === 'dark';

  return (
    <div className={`overflow-hidden rounded-lg border shadow-[0_30px_90px_rgba(0,0,0,0.28)] ${isDark ? 'border-white/10 bg-[#070807]' : 'border-black/10 bg-[#f6f3ed]'}`}>
      <div className={`flex items-center gap-2 border-b px-3 py-2.5 md:px-4 ${isDark ? 'border-white/10 bg-[#0e100f]' : 'border-black/10 bg-[#e8e2d8]'}`}>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ef6a4a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f2c763]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5fc878]" />
        <span className={`ml-2 truncate font-mono text-[10px] font-bold uppercase tracking-normal md:text-[11px] ${isDark ? 'text-[#d7d1ca]' : 'text-[#6c625a]'}`}>
          {label}
        </span>
        <span className="ml-auto h-2 w-2 rounded-full bg-[#66d878] shadow-[0_0_16px_rgba(102,216,120,0.82)]" />
      </div>
      {children}
    </div>
  );
}

function RealScreenImage({
  src,
  alt,
  tone = 'light',
  compact = false,
}: {
  src: string;
  alt: string;
  tone?: 'light' | 'dark';
  compact?: boolean;
}) {
  const isDark = tone === 'dark';

  return (
    <div className={`relative grid place-items-center overflow-hidden p-4 md:p-5 ${compact ? 'min-h-[260px]' : 'min-h-[300px] md:min-h-[340px]'} ${isDark ? 'bg-[#070807]' : 'bg-[#fbfaf6]'}`}>
      <img
        src={src}
        alt={alt}
        className={`${compact ? 'max-h-[390px]' : 'max-h-[min(36svh,460px)]'} block h-auto w-auto max-w-full object-contain`}
      />
    </div>
  );
}

function ProofStrip({ items, tone = 'light' }: { items: string[]; tone?: 'light' | 'dark' }) {
  const isDark = tone === 'dark';

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item}
          className={`flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-[11px] font-bold ${
            isDark
              ? 'border-[#2e4e32] bg-[#122016] text-[#bfeec4]'
              : 'border-[#d8c9bb] bg-white text-[#332c27]'
          }`}
        >
          <CheckCircle2 size={14} className={`shrink-0 ${isDark ? 'text-[#73dd84]' : 'text-[#d66f43]'}`} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function ChotuProductShowcase({ step }: { step: ChotuShowcaseStep }) {
  const tone = step.tone ?? 'light';
  const isDark = tone === 'dark';

  return (
    <ScreenShell label={step.screenLabel} tone={tone}>
      <div className={`grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px] ${isDark ? 'bg-[#070807]' : 'bg-[#f6f3ed]'}`}>
        <RealScreenImage src={step.screen} alt={step.screenAlt} tone={tone} />

        <aside className={`border-t p-4 md:p-5 xl:border-t-0 xl:border-l ${isDark ? 'border-white/10 bg-[#0e100f] text-[#f8f1e8]' : 'border-black/10 bg-[#fffaf3] text-[#211d1a]'}`}>
          <div className={`mb-4 font-mono text-[10px] font-bold uppercase tracking-normal ${isDark ? 'text-[#8fd6ff]' : 'text-[#d26a3c]'}`}>
            {step.eyebrow} · real Chotu screen
          </div>
          <h4 className={`font-pixel text-3xl leading-none ${isDark ? 'text-white' : 'text-[#14110f]'}`}>
            {step.title}
          </h4>
          <p className={`mt-4 font-mono text-sm leading-relaxed ${isDark ? 'text-[#d7d1ca]' : 'text-[#6f6760]'}`}>
            {step.caption}
          </p>
          <div className="mt-6">
            <ProofStrip items={step.proof} tone={tone} />
          </div>
        </aside>
      </div>
    </ScreenShell>
  );
}

export function ChotuMemoryShowcase() {
  return (
    <ScreenShell label="Chotu memory screen">
      <div className="grid bg-[#f6f3ed] xl:grid-cols-[minmax(0,1fr)_340px]">
        <RealScreenImage
          src="/assets/chotu-screens/memory.png"
          alt="Chotu memory screen showing saved conversations, files, screenshots, notes, and local memory groups"
          compact
        />

        <aside className="border-t border-black/10 bg-[#fffaf3] p-4 md:p-5 xl:border-t-0 xl:border-l">
          <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-normal text-[#d26a3c]">
            Memory in the product
          </div>
          <h4 className="font-pixel text-3xl leading-none text-[#14110f]">
            Dhee shows up as useful recall.
          </h4>
          <p className="mt-4 font-mono text-sm leading-relaxed text-[#6f6760]">
            The memory page is not an architecture diagram. It is where Chotu
            can search saved conversations, notes, decisions, files, screenshots,
            and the places it learned them.
          </p>

          <div className="mt-6">
            <ProofStrip items={['741 saved', '14 places', 'local only']} />
          </div>

          <a
            href="https://github.com/Sankhya-AI/Dhee/blob/main/benchmarks/longmemeval/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#1a1a1a]/70 px-3 py-2 font-mono text-[11px] font-bold text-[#28231f] transition-colors hover:bg-[#e8e4dc]"
          >
            See Dhee proof
            <ArrowUpRight size={13} />
          </a>
        </aside>
      </div>
    </ScreenShell>
  );
}
