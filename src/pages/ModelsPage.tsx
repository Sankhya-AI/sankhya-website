import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Seo } from '@/components/Seo';
import {
  MODEL_ARCHITECTURES,
  MODEL_BUDGETS,
  MODEL_KITCHEN_STEPS,
  MODEL_POWERS,
  MODEL_RUNTIME,
  ROUTE_SEO,
  ROUTES,
  SANKHYA_MODEL_PROOF,
  type ModelProof,
} from '@/content/site';

const RECIPE_ROWS = [
  ['Architecture', 'Verify'],
  ['Main', 'Your pick'],
  ['Verifier', 'Your pick'],
  ['Powers', 'Web · GitHub · Run code'],
  ['Budget', 'Balanced'],
  ['Endpoint', MODEL_RUNTIME.baseUrl.replace('http://', '')],
] as const;

const API_FACTS = [
  ['Versioned', `Every edit publishes a new immutable version, pinnable as ${MODEL_RUNTIME.exampleVersionedId}.`],
  ['Discoverable', 'Your models list alongside the catalogue on /v1/models, under your own account key.'],
  ['Unmodified clients', 'Chat completions and responses both work. Existing SDKs need one line changed.'],
] as const;

/** The example spec sheet in the hero: what a compiled model actually looks like. */
function RecipeCard() {
  return (
    <div className="border border-white/14 bg-white/[0.035] p-6 text-[#f8ead8]">
      <div className="flex items-center justify-between gap-4 border-b border-white/14 pb-4">
        <p className="font-mono text-xs text-[#ff9b78]">{MODEL_RUNTIME.exampleId}</p>
      </div>
      <dl className="font-mono text-xs">
        {RECIPE_ROWS.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-6 border-b border-white/8 py-3 last:border-b-0">
            <dt className="text-white/38">{label}</dt>
            <dd className="text-right text-white/78">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 flex items-center gap-2 border-t border-white/14 pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#ff8a5c]">
        <span className="benchmark-pulse size-2 bg-[#ff7548]" />
        Compiles to one model id
      </p>
    </div>
  );
}

function EvidenceGate({ proof }: { proof: ModelProof }) {
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

  // A dark inset panel, not a translucent one: this card sits in the cream receipts
  // section, so light-on-light would disappear.
  return (
    <div className="flex flex-col justify-center border border-[#26211d] bg-[#151311] p-7 text-[#f8ead8] md:p-9">
      <p className="font-bit text-[clamp(1.9rem,2.4vw,2.6rem)] leading-[1.05]">Measured against the best single model.</p>
      <p className="mt-5 max-w-xl text-base leading-7 text-[#f8ead8]/70">
        A cooked model has to win on frozen tasks, on cost per solved task, before we put a figure next to it.
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
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8a5c]">Sankhya Models · Model kitchen</p>
            <h1 className="mt-7 max-w-6xl text-balance font-bit text-[clamp(3.8rem,7.8vw,8.4rem)] leading-[0.88] tracking-[-0.03em]">
              Stop picking a model. Cook your own.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f8ead8]/62">
              Choose the brains. Hand them powers. Set a budget. Sankhya works out how they cooperate and hands back one
              model id — no orchestration to write, no infrastructure to stand up, running on your own machine.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#kitchen" className="inline-flex h-11 items-center gap-2 border border-[#fff8f0] bg-[#fff8f0] px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#17110d] hover:bg-white">
                See how it cooks <ArrowDownRight size={14} />
              </a>
              <Link to={ROUTES.chotu} className="inline-flex h-11 items-center gap-2 border border-white/28 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#f8ead8] hover:border-white/60">
                Build one in Chotu <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          <RecipeCard />
        </div>
      </section>

      <section id="kitchen" className="scroll-mt-24 border-b border-[#c9c2b8] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,820px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">01 / How it cooks</p>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.94]">Four choices, and the wiring is our problem.</h2>
          </div>
          <div className="mt-8 grid border border-[#c9c2b8] lg:grid-cols-4">
            {MODEL_KITCHEN_STEPS.map(([number, title, description]) => (
              <article key={number} className="min-h-64 border-b border-[#c9c2b8] p-6 last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0">
                <span className="font-mono text-[10px] text-[#b9552c]">{number}</span>
                <h3 className="mt-10 font-bit text-3xl leading-none">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#6e675f]">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#6e675f]">
            You are not drawing a graph or naming a framework. A recipe is data — roles, powers, and limits — and the
            compiler turns it into an execution plan the runtime can actually defend.
          </p>
        </div>
      </section>

      <section className="border-b border-[#c9c2b8] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,820px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">02 / Architectures</p>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.94]">Choose the shape of the thinking.</h2>
          </div>

          <div className="grid border-x border-b border-[#c9c2b8] lg:grid-cols-2">
            {MODEL_ARCHITECTURES.map((architecture, index) => (
              <article key={architecture.id} className="flex min-h-[320px] flex-col border-t border-[#c9c2b8] p-7 lg:p-9 lg:[&:nth-child(odd)]:border-r">
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#837b73]">
                  <span>0{index + 1} / {architecture.brains}</span>
                  {architecture.badge ? (
                    <span
                      className={`shrink-0 border px-2.5 py-1 ${
                        architecture.badge === 'Default'
                          ? 'border-[#39714b]/30 bg-[#dce9df] text-[#285a39]'
                          : 'border-[#cf5a32]/30 bg-[#f5dfd5] text-[#9b3e21]'
                      }`}
                    >
                      {architecture.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-12 font-bit text-[clamp(2.4rem,3.6vw,3.6rem)] leading-none">{architecture.name}</h3>
                <p className="mt-5 max-w-md text-base leading-7 text-[#6e675f]">{architecture.tagline}</p>
                <p className="mt-auto pt-7 font-mono text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f877f]">
                  Best for · {architecture.bestFor}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 border-t border-[#c9c2b8] pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <p className="max-w-xl text-base leading-7 text-[#6e675f]">
              A shape declares what each role must be able to do, not which model fills it. Swap a brain, and the model
              still works. Retire a brain entirely, and the architecture survives it.
            </p>
            <dl className="grid border border-[#c9c2b8] sm:grid-cols-3">
              {MODEL_BUDGETS.map(([label, detail]) => (
                <div key={label} className="border-b border-[#c9c2b8] p-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
                  <dt className="font-bit text-2xl">{label}</dt>
                  <dd className="mt-2 font-mono text-[11px] leading-5 text-[#6e675f]">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-[#151311] px-5 py-20 text-[#f8ead8] md:px-8 md:py-28 lg:px-10" data-navbar-inverse="true">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-white/14 pb-10 md:grid-cols-[220px_minmax(0,850px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">03 / Powers</p>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.94]">A model that can go and check.</h2>
          </div>

          <div className="mt-8 grid border-x border-t border-white/12 sm:grid-cols-2 lg:grid-cols-3">
            {MODEL_POWERS.map(([label, detail]) => (
              <article key={label} className="min-h-32 border-b border-white/12 p-6 lg:border-r lg:[&:nth-child(3n)]:border-r-0">
                <h3 className="font-bit text-2xl leading-none">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-white/54">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-8 border-t border-white/14 pt-8 lg:grid-cols-2">
            <p className="max-w-xl text-base leading-7 text-white/62">
              Powers are not prompts. Each one is a typed contract behind an adapter, so a model asks for a capability and
              gets a result — never a credential, never raw reach into your machine.
            </p>
            <p className="max-w-xl text-base leading-7 text-white/62">
              Your keys stay outside model context. Fetches are guarded against the obvious abuses, and every power a
              recipe declares is one you chose.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#c9c2b8] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,820px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">04 / One id</p>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.94]">Then it behaves like any other model.</h2>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            {/* The light text colour has to live on this wrapper: a dark card inside a
                cream section would otherwise inherit the section's near-black ink. */}
            <div className="overflow-x-auto border border-[#26211d] bg-[#151311] p-6 text-[#f8ead8]/90 md:p-7">
              <pre className="font-mono text-[12px] leading-6 md:text-[13px]">
                <code>{`from openai import OpenAI

sankhya = OpenAI(
    base_url="${MODEL_RUNTIME.baseUrl}",
    api_key=SANKHYA_KEY,
)

answer = sankhya.chat.completions.create(
    model="${MODEL_RUNTIME.exampleId}",
    messages=[{"role": "user", "content": "Review my plan."}],
)`}</code>
              </pre>
            </div>

            <dl className="grid border-x border-t border-[#c9c2b8]">
              {API_FACTS.map(([label, detail]) => (
                <div key={label} className="border-b border-[#c9c2b8] p-6">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#b9552c]">{label}</dt>
                  <dd className="mt-3 text-base leading-7 text-[#6e675f]">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#6e675f]">
            Behind that one call, several models may draft, argue, check, and hand off. Outside it, there is a model id and
            a response — which is exactly the point.
          </p>
        </div>
      </section>

      <section className="bg-[#0d0c0b] px-5 py-20 text-[#f8ead8] md:px-8 md:py-28 lg:px-10" data-navbar-inverse="true">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-white/14 pb-10 md:grid-cols-[220px_minmax(0,850px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">05 / Where it runs</p>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.94]">On your machine, then wherever you want.</h2>
          </div>

          <div className="mt-8 grid border border-white/12 lg:grid-cols-3">
            <article className="min-h-56 border-b border-white/12 p-6 lg:border-r lg:border-b-0">
              <h3 className="font-bit text-3xl leading-none">Test it in Chotu</h3>
              <p className="mt-4 text-sm leading-6 text-white/54">
                Build a model in Chotu's Models screen and it appears in the composer as one of your own. Same model for
                chat and for code, on the machine you built it on.
              </p>
            </article>
            <article className="min-h-56 border-b border-white/12 p-6 lg:border-r lg:border-b-0">
              <h3 className="font-bit text-3xl leading-none">Host it locally</h3>
              <p className="mt-4 text-sm leading-6 text-white/54">
                The runtime serves your models at <span className="font-mono text-[12px] text-[#ff9b78]">{MODEL_RUNTIME.baseUrl}</span> for
                anything else on your machine — scripts, editors, agents you already run.
              </p>
            </article>
            <article className="min-h-56 p-6">
              <h3 className="font-bit text-3xl leading-none">One key, one bill</h3>
              <p className="mt-4 text-sm leading-6 text-white/54">
                Use a Sankhya Key and the credits already in your account cover every brain inside the model. Or bring your
                own provider key and pay upstream directly.
              </p>
            </article>
          </div>

          <p className="mt-6 font-mono text-xs leading-5 text-white/46">
            Model building is in early access with Chotu for Apple silicon Macs. The standalone runtime — same recipes,
            without the desktop app — follows it.
          </p>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-24 border-b border-[#c9c2b8] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,850px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">06 / Receipts</p>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.94]">The number comes last.</h2>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <h3 className="font-bit text-3xl leading-none">Your model keeps its own scoreboard.</h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#6e675f]">
                More brains is not better. The runtime tracks, per kind of task, whether a model in your recipe actually
                improved the answer — and stops calling the ones that never do. Test and compare shows you which brain to
                drop before it costs you anything more.
              </p>
              <dl className="mt-7 grid border-x border-t border-[#c9c2b8] sm:grid-cols-2">
                {[
                  ['Comparison', proof.comparison],
                  ['Tasks', proof.taskPolicy],
                  ['Sample gate', `${proof.minimumSampleSize}+ examples`],
                  ['Decision metric', proof.primaryMetric],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-[#c9c2b8] p-5 sm:[&:nth-child(odd)]:border-r">
                    <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#8f877f]">{label}</dt>
                    <dd className="mt-2 font-mono text-xs leading-5 text-[#57514a]">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 font-mono text-xs text-[#6e675f]">Publication rule: {proof.publicationPolicy}.</p>
            </div>
            <EvidenceGate proof={proof} />
          </div>
        </div>
      </section>

      <section className="bg-[#e6dfd5] px-5 py-20 md:px-8 md:py-24 lg:px-10">
        <div className="mx-auto flex max-w-[1540px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-4xl font-bit text-[clamp(2.8rem,5.5vw,5.8rem)] leading-[0.92]">The kitchen is open.</h2>
          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.pricing} className="inline-flex h-11 items-center gap-2 bg-[#171411] px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#f8ead8]">Get Chotu <ArrowUpRight size={14} /></Link>
            <Link to={ROUTES.research} className="inline-flex h-11 items-center gap-2 border border-[#171411]/35 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em]">Read lab notes <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
