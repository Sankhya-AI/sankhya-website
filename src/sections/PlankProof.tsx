import { ArrowUpRight, BookOpen, Brain, Eye, ListChecks } from 'lucide-react';
import { Link } from 'react-router';
import { PixelDither } from '@/components/PixelDither';
import { DITHER_PRESETS, ROUTES } from '@/content/site';

const PLANK_DOWNLOAD_ROUTE = `${ROUTES.account}/desktop?intent=get-plank`;

const capabilities = [
  {
    icon: Eye,
    label: 'Sees',
    title: 'It teaches what is on your screen.',
    detail: 'A diagram, a paper, a page in a book — Plank starts from the exact thing in front of you.',
  },
  {
    icon: BookOpen,
    label: 'Reads',
    title: 'It learns your actual course.',
    detail: 'Your lecture decks, textbooks, and notes become the syllabus: real topics, chapters, and page numbers.',
  },
  {
    icon: Brain,
    label: 'Remembers',
    title: 'It knows what has not clicked yet.',
    detail: 'Dhee carries forward the concepts you understand, the ones you miss, and the patterns behind both.',
  },
  {
    icon: ListChecks,
    label: 'Checks',
    title: 'It asks you to prove the learning.',
    detail: 'Notes, quizzes, worked examples, and projects are built around what you need next — not generic revision.',
  },
] as const;

const generalAssistant = [
  'Answers the question it is given',
  'Has never seen your syllabus',
  'Forgets the learner between sessions',
  'Finishes the task for you',
] as const;

const plank = [
  'Teaches the page you are stuck on',
  'Builds from your own course material',
  'Remembers where you struggle',
  'Sets work, checks it, and leaves the building to you',
] as const;

export function PlankProof() {
  return (
    <section id="learning" data-navbar-inverse="true" className="relative scroll-mt-20 bg-[#0d0c0b] text-[#f8ead8]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-16 -translate-y-full overflow-hidden">
        <PixelDither {...DITHER_PRESETS.section} className="opacity-100" />
      </div>

      <div className="mx-auto max-w-[1540px] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="grid gap-8 border-b border-white/14 pb-10 lg:grid-cols-[220px_minmax(0,850px)_auto] lg:items-end">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">
            02 / Learning with Plank
          </p>
          <div>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.35rem)] leading-[0.94] tracking-[-0.02em]">
              Stuck on a page? It teaches that page.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#f8ead8]/58">
              No copying the question out. No describing the diagram. Plank looks at the work in front of you and finds
              the idea you are missing before it explains a word.
            </p>
          </div>
          <Link
            to={PLANK_DOWNLOAD_ROUTE}
            className="group inline-flex h-11 items-center justify-center gap-2 border border-white/24 px-5 font-mono text-xs font-bold uppercase tracking-[0.07em] text-[#f8ead8] transition-colors hover:border-[#ff8255] hover:text-white lg:justify-self-end"
          >
            Try Plank free
            <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.72fr)]">
          <article className="relative isolate min-h-[520px] overflow-hidden border border-white/14 bg-[#151311] p-5 md:p-8">
            <div aria-hidden="true" className="lab-grid absolute inset-0 -z-10 opacity-[0.06]" />
            <div className="flex items-center justify-between border-b border-white/12 pb-5">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.11em] text-white/36">Valuation · Chapter 5 · Page 7</p>
                <p className="mt-2 font-bit text-2xl">Growing perpetuities</p>
              </div>
              <img src="/assets/plank-icon.svg" alt="Plank" className="size-16" width="64" height="64" />
            </div>

            <div className="mt-7 max-w-3xl space-y-5 text-[15px] leading-7 text-white/58">
              <p>
                A perpetuity pays a fixed amount forever. A growing perpetuity raises that payment by a constant rate
                each period. The value is <span className="border-b border-[#ff8255] text-white/82">P₀ = D₁ / (r − g)</span>.
              </p>
              <div className="border-l-2 border-[#ff7548] bg-white/[0.04] p-5 text-white/74">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#ff9b78]">Plank · from your question on this page</p>
                <p className="mt-3">
                  You used r on its own twice. Think of growth as chasing the discount rate: that is why the denominator
                  is r − g. Let&apos;s work one example before you continue.
                </p>
              </div>
            </div>

            <div className="absolute inset-x-5 bottom-5 grid gap-px bg-white/10 md:inset-x-8 md:grid-cols-3">
              {[
                ['Next', 'Worked example'],
                ['Then', 'One proof question'],
                ['Memory', 'Concept needs work'],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#11100f] px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.09em] text-white/30">{label}</p>
                  <p className="mt-2 text-sm text-white/72">{value}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid border-x border-t border-white/14 sm:grid-cols-2 lg:grid-cols-1">
            {capabilities.map(({ detail, icon: Icon, label, title }) => (
              <article key={label} className="border-r border-b border-white/14 p-5 last:border-r-0 sm:p-6">
                <div className="flex items-center gap-3">
                  <Icon size={17} strokeWidth={1.5} className="text-[#ff8255]" />
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.11em] text-[#ff9b78]">{label}</p>
                </div>
                <h3 className="mt-4 font-bit text-2xl leading-[1.05]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/48">{detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 grid border-t border-white/14 lg:grid-cols-[220px_minmax(0,1fr)]">
          <p className="pt-8 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">
            The difference
          </p>
          <div>
            <h2 className="max-w-4xl pt-8 font-bit text-[clamp(2.4rem,4.5vw,4.8rem)] leading-[0.94]">
              The point is not to finish the task. The point is to change the student.
            </h2>
            <div className="mt-9 grid border-y border-white/14 md:grid-cols-2">
              <div className="py-7 md:border-r md:border-white/14 md:pr-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30">A general assistant</p>
                <ul className="mt-5 space-y-3 text-sm text-white/34">
                  {generalAssistant.map((item) => <li key={item}>— {item}</li>)}
                </ul>
              </div>
              <div className="border-t border-white/14 py-7 md:border-t-0 md:pl-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#ff8255]">Plank</p>
                <ul className="mt-5 space-y-3 text-sm text-white/78">
                  {plank.map((item) => <li key={item}>↳ {item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
