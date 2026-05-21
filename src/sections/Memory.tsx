import { ArrowUpRight, BrainCircuit, Database, GitBranch, Route, Sparkles } from 'lucide-react';

const memoryCards = [
  {
    icon: Route,
    title: 'Context routing',
    text: 'Dhee decides which repo facts, screen notes, browser traces, and prior decisions belong in this task.',
  },
  {
    icon: Sparkles,
    title: 'Prospective memory',
    text: 'Chotu can surface pending intentions before you ask, because Dhee matches the current work to saved triggers.',
  },
  {
    icon: GitBranch,
    title: 'Learning writeback',
    text: 'Accepted patches, owner feedback, and verification evidence become reusable context for the next run.',
  },
];

export function Memory() {
  return (
    <section id="memory" className="w-full border-y border-[#c9c2ba] bg-cream grid-pattern px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-normal text-[#8b8580]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cf5a32]" />
            Chotu Memory
          </div>
          <h2 className="max-w-[700px] font-pixel text-[46px] leading-[0.95] text-[#14110f] md:text-[72px]">
            Dhee is Chotu&apos;s context compiler.
          </h2>
          <p className="mt-6 max-w-[680px] font-mono text-base leading-relaxed text-[#6f6760]">
            Before Chotu chats, plans, codes, or verifies, Dhee compiles the working set: the current request, repo state, screen context, browser evidence, owner preferences, prior decisions, and the things that should stay out of the context window.
          </p>
          <a
            href="https://github.com/Sankhya-AI/Dhee/blob/main/benchmarks/longmemeval/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#1a1a1a]/70 px-4 py-2 font-mono text-sm font-medium text-[#28231f] transition-colors hover:bg-[#e8e4dc]"
          >
            Recall R@5 99.4% on LongMemEval
            <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d] p-4 text-[#f8f2ea] shadow-[0_28px_80px_rgba(0,0,0,0.22)] md:p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4 font-mono text-xs text-white/55">
            <BrainCircuit size={15} className="text-[#cf5a32]" />
            dhee.context.compile(request)
            <span className="ml-auto rounded bg-[#1a2b1c] px-2 py-1 text-[10px] text-[#79dd88]">local-first</span>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_1fr]">
            <div className="space-y-3">
              {['user request', 'screen evidence', 'repo state', 'browser proof'].map((item) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/[0.04] p-3 font-mono text-xs text-white/70">
                  {item}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <div className="grid h-36 w-36 place-items-center rounded-full border border-[#cf5a32]/70 bg-[#cf5a32]/10 text-center font-mono text-[11px] uppercase leading-snug text-[#ffd3c0] shadow-[0_0_70px_rgba(207,90,50,0.24)]">
                context
                <br />
                compiler
              </div>
            </div>

            <div className="space-y-3">
              {['task packet', 'bounded plan', 'approval gate', 'memory writeback'].map((item) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/[0.04] p-3 font-mono text-xs text-white/70">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {memoryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                  <div className="mb-4 grid h-8 w-8 place-items-center rounded border border-white/15 bg-white/[0.05]">
                    <Icon size={15} className="text-[#f0a37e]" />
                  </div>
                  <h3 className="font-mono text-xs font-bold text-white">{card.title}</h3>
                  <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/48">{card.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded border border-[#304632] bg-[#111d13] p-4 font-mono text-xs leading-relaxed text-[#bfeec4]">
            <Database size={14} className="mr-2 inline-block" />
            Skills stay rich. Runtime context stays thin. Chotu gets the right packet, acts inside the right boundary, and sends the result back to Dhee so the next run starts warmer.
          </div>
        </div>
      </div>
    </section>
  );
}
