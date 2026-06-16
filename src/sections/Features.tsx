import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ChotuProductShowcase } from '../components/ChotuProductShowcase';
import type { ChotuShowcaseStep } from '../components/ChotuProductShowcase';
import { PixelDither } from '../components/PixelDither';

type Stage = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  showcase: ChotuShowcaseStep;
};

const stages: Stage[] = [
  {
    id: '01',
    eyebrow: 'See',
    title: 'Start from the screen you are already using.',
    description:
      'Chotu begins with the active app, browser, repo, and task in front of you. You do not have to narrate your whole laptop.',
    showcase: {
      eyebrow: 'screen context',
      title: 'Chotu opens where you are.',
      caption:
        'The floating assistant can sit on top of your laptop, listen to the current ask, and start from the screen you already have open.',
      screen: '/assets/chotu-screens/floating-chat-dark.png',
      screenAlt: 'Floating Chotu assistant chat window without blue background',
      screenLabel: 'Floating Chotu assistant',
      proof: ['floating assistant', 'screen-first', 'ready to help'],
      tone: 'dark',
    },
  },
  {
    id: '02',
    eyebrow: 'Remember',
    title: 'Bring back the rules you asked Chotu to keep.',
    description:
      'Preferences, accepted decisions, names, workflows, and rejected paths come back when they matter, without replaying every old chat.',
    showcase: {
      eyebrow: 'memory',
      title: 'Memory is a real workspace.',
      caption:
        'Chotu has a memory surface for saved conversations, notes, decisions, people, projects, files, screenshots, and the source of each fact.',
      screen: '/assets/chotu-screens/memory.png',
      screenAlt: 'Chotu memory page showing saved memory groups, files, screenshots, notes, and local-only state',
      screenLabel: 'Chotu memory',
      proof: ['741 saved', '14 places', 'local only'],
    },
  },
  {
    id: '03',
    eyebrow: 'Plan',
    title: 'Turn a messy request into visible steps.',
    description:
      'Chotu turns the ask into a short plan, chooses the right tools, and shows the approval points before doing high-risk work.',
    showcase: {
      eyebrow: 'planning',
      title: 'Today becomes a task list.',
      caption:
        'Ask what to work on and Chotu can surface urgent loops, pending approvals, notifications, improvement candidates, and a clear next choice.',
      screen: '/assets/chotu-screens/day-plan.png',
      screenAlt: 'Chotu today planning screen with task options and pending work',
      screenLabel: 'Chotu today plan',
      proof: ['priorities ranked', 'choices visible', 'next step queued'],
    },
  },
  {
    id: '04',
    eyebrow: 'Act',
    title: 'Use Claude, Codex, browser, terminal, and local tools.',
    description:
      'Chotu can delegate to the right tool, patch files, run checks, browse, and operate apps while keeping you in control of the laptop.',
    showcase: {
      eyebrow: 'tool use',
      title: 'Point Chotu at your code.',
      caption:
        'Choose a workspace, describe the task, pick Claude Code, Codex, or Kimi, and let Chotu run bounded work from the same interface.',
      screen: '/assets/chotu-screens/today-code.png',
      screenAlt: 'Chotu Today page showing workspace picker, code task prompt, model choices, and recent runs',
      screenLabel: 'Chotu coding run',
      proof: ['workspace selected', 'tools chosen', 'run bounded'],
    },
  },
  {
    id: '05',
    eyebrow: 'Prove',
    title: 'Show what changed before it becomes memory.',
    description:
      'Chotu returns the diff, checks, screenshots, and decisions left open. Only accepted outcomes should teach the next run.',
    showcase: {
      eyebrow: 'proof',
      title: 'Show files, activity, and results.',
      caption:
        'Chotu can keep the conversation, workspace state, changed branch, files, artifacts, and activity visible while it completes the task.',
      screen: '/assets/chotu-screens/workspace-files.png',
      screenAlt: 'Chotu workspace screen with assistant response and file activity panel',
      screenLabel: 'Chotu workspace proof',
      proof: ['files visible', 'activity visible', 'owner can end'],
    },
  },
];

export function Features() {
  const [activeStage, setActiveStage] = useState(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const stage = stages[activeStage];
  const arrowClass = 'bg-transparent text-white hover:bg-white/10';

  useEffect(() => {
    if (isAutoPaused) return undefined;

    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setActiveStage((current) => (current === stages.length - 1 ? 0 : current + 1));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isAutoPaused]);

  const goToPrevious = () => {
    setActiveStage((current) => (current === 0 ? stages.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveStage((current) => (current === stages.length - 1 ? 0 : current + 1));
  };

  return (
    <section data-navbar-inverse="true" className="relative bg-dark">
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

      <div className="relative z-10 px-4 pt-2 md:px-8 md:pt-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="mb-5 hidden items-center gap-2 font-mono text-xs font-bold uppercase tracking-normal text-[#d8cec4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff8a4c]" />
            How Chotu works
          </div>
          <div className="hidden gap-6 lg:grid-cols-[0.85fr_1fr] lg:items-end">
            <h2 className="max-w-[980px] font-pixel text-[54px] leading-[0.88] text-white md:text-[88px] lg:text-[112px]">
              See. Remember. Plan. Act. Prove.
            </h2>
            <p className="max-w-[720px] font-mono text-[15px] leading-relaxed text-[#cfc7be] lg:justify-self-end lg:text-right">
              Five moments from the real app: floating assistant, memory,
              today plan, code run, and workspace proof.
            </p>
          </div>
        </div>
      </div>

      <div id="stack" className="relative z-10 min-h-[118svh] scroll-mt-[360px] px-4 pb-12 md:px-8 md:pb-14">
        <div className="mx-auto w-full max-w-[1500px] py-4 md:sticky md:top-[96px] md:flex md:min-h-[calc(100svh-96px)] md:items-start md:py-5">
          <div
            className="w-full"
            onPointerEnter={() => setIsAutoPaused(true)}
            onPointerLeave={() => setIsAutoPaused(false)}
            onFocus={() => setIsAutoPaused(true)}
            onBlur={(event) => {
              const nextFocus = event.relatedTarget;
              if (!(nextFocus instanceof Node) || !event.currentTarget.contains(nextFocus)) {
                setIsAutoPaused(false);
              }
            }}
          >
          <div className="flex flex-wrap gap-2">
            {stages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveStage(index)}
                className={`rounded-md border px-3 py-2 font-mono text-xs font-bold transition-colors ${
                  index === activeStage
                    ? 'border-[#ff8a4c] bg-[#171717] text-white'
                    : 'border-[#8d867d] bg-[#171717] text-[#d6cec4] hover:border-[#f1e4d4] hover:text-white'
                }`}
                aria-pressed={index === activeStage}
              >
                {item.id} · {item.eyebrow}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-[#4c4945] bg-[#19191c] shadow-[0_36px_110px_rgba(0,0,0,0.44)]">
            <div className="grid gap-4 border-b border-[#333236] p-4 md:grid-cols-[minmax(0,0.82fr)_minmax(420px,1.18fr)] md:p-5">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#69d87b] shadow-[0_0_16px_rgba(105,216,123,0.8)]" />
                  <span className="font-mono text-sm font-bold uppercase tracking-normal text-[#d9f1db]">{stage.eyebrow}</span>
                </div>
                <h3 className="mt-3 font-pixel text-2xl leading-none text-white md:text-4xl">
                  {stage.title}
                </h3>
              </div>
              <p className="font-mono text-[15px] leading-relaxed text-[#d7d1ca] md:text-right">
                {stage.description}
              </p>
            </div>

            <div key={stage.id} className="p-4 pb-7 transition-opacity duration-300 md:grid md:grid-cols-[46px_minmax(0,1fr)_46px] md:items-center md:gap-4 md:p-5 md:pb-8">
              <button
                type="button"
                onClick={goToPrevious}
                className={`hidden h-11 w-11 place-items-center rounded-md transition-colors md:grid ${arrowClass}`}
                aria-label="Show previous Chotu screen"
              >
                <ChevronLeft size={24} strokeWidth={2.4} />
              </button>
              <div className="min-w-0">
                <ChotuProductShowcase step={stage.showcase} />
                <div className="mt-4 flex items-center justify-center gap-2">
                  {stages.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveStage(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === activeStage ? 'w-9 bg-[#ff8a4c]' : 'w-4 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Show ${item.eyebrow} screen`}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={goToNext}
                className={`hidden h-11 w-11 place-items-center rounded-md transition-colors md:grid ${arrowClass}`}
                aria-label="Show next Chotu screen"
              >
                <ChevronRight size={24} strokeWidth={2.4} />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      <section aria-hidden="true" className="pointer-events-none relative z-10 h-[12rem] overflow-hidden bg-dark md:h-[14rem]">
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
