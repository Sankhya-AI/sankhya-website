import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  Database,
  FileText,
  MessageSquare,
  Network,
  RadioTower,
  Search,
  ShieldCheck,
  Terminal,
  Workflow,
} from 'lucide-react';
import { PixelDither } from '../components/PixelDither';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function ScreenFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-[#f6f1e9] shadow-[0_26px_70px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-2 border-b border-black/10 bg-[#ebe5dc] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ef6a4a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f2c763]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5fc878]" />
        <span className="ml-3 truncate font-mono text-[11px] text-[#5f5a55]">{title}</span>
        <span className="ml-auto h-2 w-2 rounded-full bg-[#60d36f] shadow-[0_0_14px_rgba(96,211,111,0.9)]" />
      </div>
      {children}
    </div>
  );
}

function DottedSurface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#fbfaf6] ${className}`}
      style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.13) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      {children}
    </div>
  );
}

function SmallSignalCard({ label, title, meta }: { label: string; title: string; meta: string }) {
  return (
    <div className="rounded-lg border border-[#dfb9a4] bg-white/92 p-3 shadow-sm">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-normal text-[#8a8178]">{label}</div>
      <div className="font-mono text-xs font-bold leading-snug text-[#27221f]">{title}</div>
      <div className="mt-2 font-mono text-[10px] text-[#82776f]">{meta}</div>
    </div>
  );
}

function CentralCommandDemo() {
  return (
    <ScreenFrame title="sankhya://command-fabric">
      <DottedSurface className="min-h-[clamp(320px,42svh,380px)] p-4 md:p-5">
        <div className="grid min-h-[300px] gap-4 md:grid-cols-[1fr_1.05fr_1fr]">
          <div className="space-y-4 self-center">
            <SmallSignalCard label="voice agent" title="Citizen callback needs policy context" meta="JanSetu / ward 12" />
            <SmallSignalCard label="code agent" title="Deploy blocked by stale environment state" meta="repo / infra" />
            <SmallSignalCard label="research" title="New circular changes eligibility wording" meta="policy monitor" />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-[78%] w-px border-l border-dashed border-[#b8aea6]" />
            <div className="absolute h-px w-[86%] border-t border-dashed border-[#b8aea6]" />
            <div className="relative z-10 w-full max-w-[260px] rounded-lg border border-black bg-[#111] p-5 text-white shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded bg-[#d04c23]">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold">Sankhya Fabric</div>
                  <div className="font-mono text-[10px] uppercase tracking-normal text-white/55">shared context</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="rounded bg-white/10 p-2">
                  <div className="text-white/50">signals</div>
                  <div className="text-lg">14</div>
                </div>
                <div className="rounded bg-white/10 p-2">
                  <div className="text-white/50">agents</div>
                  <div className="text-lg">6</div>
                </div>
                <div className="rounded bg-white/10 p-2">
                  <div className="text-white/50">actions</div>
                  <div className="text-lg">3</div>
                </div>
                <div className="rounded bg-white/10 p-2">
                  <div className="text-white/50">memory</div>
                  <div className="text-lg">live</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 self-center">
            <SmallSignalCard label="field ops" title="Operator approval needed before escalation" meta="human in loop" />
            <SmallSignalCard label="analytics" title="Pattern found across 38 similar requests" meta="trend signal" />
            <SmallSignalCard label="memory" title="Decision saved for the next matching case" meta="learning layer" />
          </div>
        </div>
      </DottedSurface>
    </ScreenFrame>
  );
}

function ContextIntakeDemo() {
  const rows = [
    ['policy_pdf', 'eligibility rule', '0.94', 'route'],
    ['meeting_note', 'operator preference', '0.88', 'attach'],
    ['repo_log', 'deploy blocker', '0.86', 'assign'],
    ['old_thread', 'duplicate chatter', '0.22', 'skip'],
  ];

  return (
    <ScreenFrame title="sankhya://context-intake">
      <div className="min-h-[clamp(320px,42svh,380px)] bg-[#11100e] p-4 font-mono text-xs text-[#f7efe4] md:p-5">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-[#8d857c]">
          <span className="text-[#64c779]">~/lab</span>
          <span>scan --sources calls docs repos notes</span>
          <span className="ml-auto rounded bg-[#1e2b1f] px-2 py-1 text-[#75d586]">connected</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-3">
            {[
              ['Call transcript', 'intent, location, urgency'],
              ['Policy PDF', 'rule, exception, evidence'],
              ['Repo history', 'decision, blocker, owner'],
              ['Operator notes', 'preference, approval path'],
            ].map(([title, meta]) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-[#d67243]" />
                  <div>
                    <div className="font-bold text-[#fff8ed]">{title}</div>
                    <div className="mt-1 text-[11px] text-[#8d857c]">{meta}</div>
                  </div>
                  <CheckCircle2 size={16} className="ml-auto text-[#64c779]" />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-white/10 bg-[#161b1c] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#74aee8]">
              <Database size={15} />
              context_router.score
            </div>
            <div className="grid grid-cols-[1.1fr_1fr_0.6fr_0.6fr] gap-x-3 gap-y-2 text-[11px]">
              <div className="text-[#8d857c]">source</div>
              <div className="text-[#8d857c]">entity</div>
              <div className="text-[#8d857c]">score</div>
              <div className="text-[#8d857c]">action</div>
              {rows.flatMap(([source, entity, score, action]) => [
                <div key={`${source}-a`} className="border-t border-white/10 pt-2 text-[#fff8ed]">{source}</div>,
                <div key={`${source}-b`} className="border-t border-white/10 pt-2 text-[#fff8ed]">{entity}</div>,
                <div key={`${source}-c`} className={`border-t border-white/10 pt-2 ${Number(score) > 0.5 ? 'text-[#64c779]' : 'text-[#8d857c]'}`}>{score}</div>,
                <div key={`${source}-d`} className={`border-t border-white/10 pt-2 ${action === 'skip' ? 'text-[#8d857c]' : 'text-[#d67243]'}`}>{action}</div>,
              ])}
            </div>
            <div className="mt-5 rounded border border-[#2b5630] bg-[#112015] p-3 text-[#74d582]">
              selected 6 useful facts, skipped 112 noisy lines, opened 2 agent tasks
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function SignalRouterDemo() {
  return (
    <ScreenFrame title="sankhya://signal-router">
      <DottedSurface className="min-h-[clamp(320px,42svh,380px)] p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-black/10 bg-white/92 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
              <div className="font-mono text-[11px] uppercase tracking-normal text-[#7c746d]">channel / public-services</div>
              <div className="font-mono text-[11px] text-[#7c746d]">Today 14:02</div>
            </div>
            <div className="space-y-4 font-mono text-sm text-[#24201d]">
              <p><strong>Sankhya</strong> flagged a spike in ward 12 benefit calls: <span className="rounded bg-[#ffe2d4] px-2 py-1 text-[#b64923]">eligibility confusion</span> +38% above baseline.</p>
              <p className="rounded-lg bg-[#f0ece6] p-4">
                No prior approved playbook for this policy class. Ask research agent to verify circular, then route a human-readable update to operators?
              </p>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded bg-[#d982a8] font-bold text-white">OP</div>
                <p>Yes. Keep the outbound note short and include the document link.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-black bg-[#101010] p-4 text-white shadow-[0_18px_44px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex items-center gap-3">
              <RadioTower size={18} className="text-[#70d980]" />
              <div>
                <div className="font-mono text-sm font-bold">Running procedure</div>
                <div className="font-mono text-[10px] uppercase tracking-normal text-white/45">signal {'->'} action</div>
              </div>
            </div>
            {[
              ['Research agent', 'Circular verified', 'done'],
              ['Context router', 'Operator note drafted', 'done'],
              ['Human approval', 'Awaiting review', 'open'],
              ['Voice agent', 'Queue update after approval', 'queued'],
            ].map(([label, desc, state]) => (
              <div key={label} className="flex items-start gap-3 border-t border-white/10 py-3 font-mono">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${state === 'done' ? 'bg-[#70d980]' : state === 'open' ? 'bg-[#f0b35c]' : 'bg-white/30'}`} />
                <div>
                  <div className="text-xs font-bold">{label}</div>
                  <div className="mt-1 text-[11px] text-white/55">{desc}</div>
                </div>
                <span className="ml-auto rounded bg-white/10 px-2 py-1 text-[9px] uppercase text-white/70">{state}</span>
              </div>
            ))}
          </div>
        </div>
      </DottedSurface>
    </ScreenFrame>
  );
}

function ActionLoopDemo() {
  return (
    <ScreenFrame title="sankhya://action-loop">
      <div className="min-h-[clamp(320px,42svh,380px)] bg-[#f8f5ee] p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-[#ded4c8] bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <Workflow size={18} className="text-[#c94d25]" />
              <div>
                <div className="font-mono text-sm font-bold text-[#211d1a]">Approval lane</div>
                <div className="font-mono text-[10px] uppercase tracking-normal text-[#8a8178]">human guided execution</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                ['Draft operator update', 'ready for review', 'review'],
                ['Schedule follow-up call', 'needs location confirmation', 'blocked'],
                ['Update playbook', 'will save after approval', 'queued'],
              ].map(([title, meta, state]) => (
                <div key={title} className="rounded-lg border border-[#ded4c8] bg-[#fbfaf6] p-4 font-mono">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded bg-[#f2dfd1] text-[#c94d25]">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#211d1a]">{title}</div>
                      <div className="mt-1 text-[11px] text-[#7e746c]">{meta}</div>
                    </div>
                    <span className="ml-auto rounded border border-[#d7c5b8] px-2 py-1 text-[10px] text-[#8a4a31]">{state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-black bg-[#101010] p-5 font-mono text-white shadow-[0_18px_44px_rgba(0,0,0,0.26)]">
            <div className="mb-4 flex items-center gap-2 text-[11px] text-white/50">
              <Terminal size={14} />
              sankhya run --with-approval
            </div>
            <div className="space-y-3 text-xs">
              <div><span className="text-[#70d980]">ok</span> loaded live context packet: ward_12_policy_confusion</div>
              <div><span className="text-[#70d980]">ok</span> matched 38 similar calls and 1 policy change</div>
              <div><span className="text-[#f0b35c]">hold</span> action requires operator approval</div>
              <div className="rounded border border-[#324a35] bg-[#111d13] p-4 text-[#dcebd8]">
                Proposed response: "We are verifying eligibility under the updated circular. Please keep your location proof ready for the callback."
              </div>
              <div className="flex gap-2 pt-1">
                <button className="rounded bg-[#d04c23] px-4 py-2 text-xs font-bold text-white">Approve</button>
                <button className="rounded border border-white/20 px-4 py-2 text-xs text-white/80">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function LearningLayerDemo() {
  return (
    <ScreenFrame title="sankhya://learning-layer">
      <DottedSurface className="min-h-[clamp(320px,42svh,380px)] p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-black/10 bg-white/92 p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded bg-black text-white">
                <MessageSquare size={18} />
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-[#24201d]">Reusable decision</div>
                <div className="font-mono text-[10px] uppercase tracking-normal text-[#8a8178]">learned from operator approval</div>
              </div>
              <span className="ml-auto rounded bg-[#dff6e4] px-2 py-1 font-mono text-[10px] font-bold text-[#27753a]">saved</span>
            </div>
            <p className="font-mono text-sm leading-relaxed text-[#39332e]">
              For this policy class, ask for location proof before escalation and keep the citizen-facing message under 80 words.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {['trigger: eligibility_confusion', 'scope: ward-level policy', 'approval: operator first'].map((item) => (
                <div key={item} className="rounded border border-[#ded4c8] bg-[#fbfaf6] p-3 font-mono text-[10px] text-[#5f5a55]">{item}</div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {[
              ['Next matching case', 'The agent starts with the saved playbook instead of asking the same questions again.'],
              ['Team preference', 'Human approvals become clear operating rules, not tribal memory.'],
              ['System feedback', 'Every action writes back what happened so the next run is smarter.'],
            ].map(([title, text], index) => (
              <div key={title} className="rounded-lg border border-[#ded4c8] bg-white/92 p-4 font-mono shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#111] text-[11px] text-white">{index + 1}</span>
                  <div>
                    <div className="text-xs font-bold text-[#24201d]">{title}</div>
                    <div className="mt-1 text-[11px] leading-relaxed text-[#786f68]">{text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DottedSurface>
    </ScreenFrame>
  );
}

const stages = [
  {
    id: '01',
    eyebrow: 'The central command',
    title: 'Connect the moving parts without flattening them into chat.',
    description:
      'Sankhya gives agents, people, and systems a shared operating surface. Calls, repos, documents, approvals, and signals stay connected to the work they change.',
    note: 'context graph',
    icon: Network,
    Demo: CentralCommandDemo,
  },
  {
    id: '02',
    eyebrow: 'Context intake',
    title: 'Turn scattered artifacts into usable context packets.',
    description:
      'Agents should not reread the whole world every time. Sankhya scores the useful fragments, skips noise, and hands each agent the context it needs.',
    note: 'router',
    icon: Search,
    Demo: ContextIntakeDemo,
  },
  {
    id: '03',
    eyebrow: 'Signal routing',
    title: 'Spot the pattern and route the next step.',
    description:
      'When something important appears across calls, code, operations, or research, the system opens the right task with the right memory and the right owner.',
    note: 'live signals',
    icon: RadioTower,
    Demo: SignalRouterDemo,
  },
  {
    id: '04',
    eyebrow: 'Execution loops',
    title: 'Agents can act, but the important steps stay reviewable.',
    description:
      'Sankhya closes the gap between insight and action with approval lanes, tool runs, operator updates, and traceable outcomes.',
    note: 'human in loop',
    icon: ShieldCheck,
    Demo: ActionLoopDemo,
  },
  {
    id: '05',
    eyebrow: 'Learning layer',
    title: 'Every approved action becomes better starting context.',
    description:
      'The system remembers decisions, preferences, and procedures so useful behavior compounds instead of resetting at the next session.',
    note: 'shared memory',
    icon: BrainCircuit,
    Demo: LearningLayerDemo,
  },
];

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = clamp(-rect.top / scrollableDistance);
      const nextStage = Math.min(stages.length - 1, Math.floor(nextProgress * stages.length));

      setActiveStage(nextStage);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const stage = stages[activeStage];
  const Demo = stage.Demo;

  const jumpToStage = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
    const target = section.offsetTop + (index / stages.length) * scrollableDistance + 2;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <section id="stack" data-navbar-inverse="true" className="relative bg-dark">
      <section data-navbar-inverse="true" aria-hidden="true" className="absolute inset-x-0 -top-60 z-0 h-[36rem]">
        <PixelDither
          fillColor="var(--bg-dark)"
          pattern="noise"
          seed={7}
          direction="bottom-left"
          startWeight={-0.5}
          erosionWeight={0.78}
        />
      </section>

      <div className="relative z-10 px-4 md:px-8">
        <div className="mx-auto flex min-h-[42svh] w-full max-w-[1500px] flex-col justify-start pt-24 pb-8 md:min-h-[44svh] md:pt-28">
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-normal text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
            Systems in motion
          </div>
          <h2 className="max-w-[1120px] font-pixel text-[54px] leading-[0.88] text-white md:text-[88px] lg:text-[112px]">
            Infrastructure for agentic work.
          </h2>
        </div>
      </div>

      <div ref={sectionRef} className="relative z-10 -mt-8 min-h-[500svh] px-4 md:px-8">
        <div className="sticky top-[72px] flex min-h-[calc(100svh-72px)] items-center py-8">
          <div className={`mx-auto w-full max-w-[1500px] transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="mb-4 flex items-center justify-between gap-5">
              <div className="font-mono text-xs text-white/50">
                {stage.id} / {String(stages.length).padStart(2, '0')} · {stage.eyebrow}
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {stages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => jumpToStage(index)}
                    className={`h-0.5 transition-all duration-300 ${
                      index === activeStage ? 'w-10 bg-white' : 'w-5 bg-white/24 hover:bg-white/55'
                    }`}
                    aria-label={`View stage ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid items-start gap-5">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-[#18181b] shadow-[0_36px_110px_rgba(0,0,0,0.44)]">
                <div className="grid gap-4 border-b border-white/10 p-4 md:grid-cols-[0.9fr_1.1fr] md:p-5">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#69d87b] shadow-[0_0_16px_rgba(105,216,123,0.8)]" />
                    <span className="font-mono text-sm uppercase tracking-normal text-white/86">{stage.eyebrow}</span>
                  </div>
                  <p className="font-mono text-sm leading-relaxed text-white/70 md:text-right">
                    {stage.description}
                  </p>
                </div>

                <div key={stage.id} className="p-4 transition-all duration-500 md:p-5">
                  <Demo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section aria-hidden="true" className="pointer-events-none relative z-10 h-[22rem] overflow-hidden bg-dark">
        <PixelDither
          fillColor="var(--bg-cream)"
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
