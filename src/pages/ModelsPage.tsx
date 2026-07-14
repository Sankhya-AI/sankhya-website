import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Seo } from '@/components/Seo';
import { ROUTE_SEO, ROUTES, SANKHYA_MODEL_PROOF, type ModelProof } from '@/content/site';

const variants = [
  {
    name: 'Sankhya Thinking',
    mode: 'Deliberate',
    description: 'A collective reasoning model for problems that benefit from competing approaches and synthesis.',
  },
  {
    name: 'Sankhya Deep',
    mode: 'Extended',
    description: 'A deeper mixture-of-agents model for long-horizon analysis and demanding technical work.',
  },
] as const;

const evaluationSteps = [
  ['01', 'Freeze', 'Lock identical tasks, prompts, model versions, and scoring rules.'],
  ['02', 'Pair', 'Run Sankhya and comparison models against the same examples.'],
  ['03', 'Score', 'Measure solved tasks, quality, and total cost per solved task.'],
  ['04', 'Publish', 'Release the task set, methodology, wins, and losses together.'],
] as const;

function ResultGate({ proof }: { proof: ModelProof }) {
  if (proof.status === 'verified') {
    return (
      <div className="border border-[#cf5a32] bg-[#211712] p-6 text-[#f8ead8]">
        <p className="font-bit text-3xl">{proof.performanceHeadline}</p>
        <dl className="mt-6 grid gap-4 font-mono text-xs sm:grid-cols-2">
          <div><dt className="text-white/40">Quality</dt><dd className="mt-1">{proof.qualityResult}</dd></div>
          <div><dt className="text-white/40">Cost / solved</dt><dd className="mt-1">{proof.costPerSolvedResult}</dd></div>
        </dl>
        <a href={proof.reportUrl} className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#ff9b78]">
          Read verified report <ArrowUpRight size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="border border-white/14 bg-white/[0.035] p-6 text-[#f8ead8]">
      <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#ff8a5c]">
        <span className="benchmark-pulse size-2 bg-[#ff7548]" />
        Benchmark gate open
      </div>
      <p className="mt-5 max-w-xl text-base leading-7 text-white/62">
        Paired evaluation against Fugu and Fable is running. No performance number ships before the full gate is verified.
      </p>
    </div>
  );
}

export function ModelsPage() {
  const proof = SANKHYA_MODEL_PROOF;

  return (
    <main className="bg-cream text-[#171411]">
      <Seo {...ROUTE_SEO.models} />

      <section data-navbar-inverse="true" className="relative isolate overflow-hidden bg-[#0d0c0b] px-5 pt-40 pb-20 text-[#f8ead8] md:px-8 md:pt-48 md:pb-28 lg:px-10">
        <img src="/assets/sankhya-memory-fabric-hero.png" alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(10,9,8,0.97)_0%,rgba(10,9,8,0.78)_58%,rgba(10,9,8,0.48)_100%)]" />
        <div aria-hidden="true" className="lab-grid absolute inset-0 -z-10 opacity-[0.08]" />

        <div className="mx-auto grid max-w-[1540px] gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(330px,0.55fr)] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8a5c]">Sankhya Models · Coming soon</p>
            <h1 className="mt-7 max-w-6xl text-balance font-bit text-[clamp(3.8rem,7.8vw,8.4rem)] leading-[0.88] tracking-[-0.03em]">
              Collective intelligence, exposed as a model.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f8ead8]/62">
              Thinking and Deep combine multiple reasoning paths behind one model API. The family launches when the paired evidence is publishable.
            </p>
            <a href="#methodology" className="mt-9 inline-flex h-11 items-center gap-2 border border-white/28 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#f8ead8] hover:border-white/60">
              See benchmark methodology <ArrowDownRight size={14} />
            </a>
          </div>
          <ResultGate proof={proof} />
        </div>
      </section>

      <section className="border-b border-[#c9c2b8] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,820px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">Model family</p>
            <h2 className="font-bit text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.94]">Two depths of collective reasoning.</h2>
          </div>
          <div className="grid border-x border-b border-[#c9c2b8] lg:grid-cols-2">
            {variants.map((variant, index) => (
              <article key={variant.name} className="min-h-[340px] border-t border-[#c9c2b8] p-7 lg:border-t-0 lg:border-r lg:p-9 lg:last:border-r-0">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#837b73]">
                  <span>0{index + 1} / {variant.mode}</span>
                  <span className="border border-[#c9c2b8] px-2.5 py-1">Coming soon</span>
                </div>
                <h3 className="mt-16 font-bit text-[clamp(2.5rem,4vw,4.2rem)] leading-[0.94]">{variant.name}</h3>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#6e675f]">{variant.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="methodology" className="scroll-mt-24 bg-[#151311] px-5 py-20 text-[#f8ead8] md:px-8 md:py-28 lg:px-10" data-navbar-inverse="true">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-white/14 pb-10 md:grid-cols-[220px_minmax(0,850px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">Benchmark contract</p>
            <h2 className="font-bit text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.94]">The number comes last.</h2>
          </div>

          <div className="mt-8 grid border border-white/14 lg:grid-cols-4">
            {evaluationSteps.map(([number, title, description]) => (
              <article key={number} className="min-h-64 border-b border-white/12 p-6 last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0">
                <span className="font-mono text-[10px] text-[#ff8255]">{number}</span>
                <h3 className="mt-10 font-bit text-3xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/54">{description}</p>
              </article>
            ))}
          </div>

          <dl className="mt-8 grid border-y border-white/14 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Comparisons', proof.competitors.join(' + ')],
              ['Tasks', proof.taskPolicy],
              ['Sample gate', `${proof.minimumSampleSize}+ examples`],
              ['Decision metric', proof.primaryMetric],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-white/10 py-5 sm:px-5 lg:border-r lg:border-b-0 lg:first:pl-0 lg:last:border-r-0">
                <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white/34">{label}</dt>
                <dd className="mt-2 font-mono text-xs text-white/74">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 font-mono text-xs text-white/46">Publication rule: {proof.publicationPolicy}.</p>
        </div>
      </section>

      <section className="bg-[#e6dfd5] px-5 py-20 md:px-8 md:py-24 lg:px-10">
        <div className="mx-auto flex max-w-[1540px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-4xl font-bit text-[clamp(2.8rem,5.5vw,5.8rem)] leading-[0.92]">Follow the work before the claim.</h2>
          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.research} className="inline-flex h-11 items-center gap-2 bg-[#171411] px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#f8ead8]">Read lab notes <ArrowUpRight size={14} /></Link>
            <Link to={ROUTES.chotu} className="inline-flex h-11 items-center gap-2 border border-[#171411]/35 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em]">Meet Chotu <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
