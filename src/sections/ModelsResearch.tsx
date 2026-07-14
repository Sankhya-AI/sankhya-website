import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { blogPreviews } from '@/content/blog-manifest';
import {
  ROUTES,
  SANKHYA_MODEL_PROOF,
  type ModelProof,
} from '@/content/site';

function ProofPanel({ proof }: { proof: ModelProof }) {
  return (
    <article className="relative isolate overflow-hidden border border-[#29241f] bg-[#151311] p-6 text-[#f8ead8] md:p-8">
      <img
        src="/assets/sankhya-memory-fabric-hero.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20 mix-blend-luminosity"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(18,16,14,0.93),rgba(18,16,14,0.76))]" />

      <div className="flex items-center justify-between gap-4 border-b border-white/14 pb-5">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">
            Sankhya Models
          </p>
          <h3 className="mt-2 font-bit text-3xl">Benchmarking</h3>
        </div>
        <span className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-white/60">
          <span className="benchmark-pulse size-2 bg-[#ff7548]" />
          Evaluation running
        </span>
      </div>

      {proof.status === 'verified' ? (
        <div className="border-b border-white/14 py-6">
          <p className="font-bit text-3xl leading-tight">{proof.performanceHeadline}</p>
          <a href={proof.reportUrl} className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-[#ff9b78]">
            Read the verified report <ArrowUpRight size={13} />
          </a>
        </div>
      ) : (
        <p className="border-b border-white/14 py-6 text-base leading-7 text-white/66">
          Paired Fugu and Fable evaluation is running. Results stay private until the proof gate is complete.
        </p>
      )}

      <dl className="grid sm:grid-cols-2">
        {[
          ['Task policy', proof.taskPolicy],
          ['Minimum gate', `${proof.minimumSampleSize}+ examples`],
          ['Primary metric', proof.primaryMetric],
          ['Publication', proof.publicationPolicy],
        ].map(([label, value], index) => (
          <div key={label} className={`border-white/12 py-5 ${index % 2 === 0 ? 'sm:border-r sm:pr-5' : 'sm:pl-5'} ${index < 2 ? 'border-b' : ''}`}>
            <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white/38">{label}</dt>
            <dd className="mt-2 font-mono text-xs leading-5 text-white/78">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        to={ROUTES.models}
        className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#ff9b78] hover:text-white"
      >
        Inspect the methodology <ArrowUpRight size={14} />
      </Link>
    </article>
  );
}

export function ModelsResearch() {
  return (
    <section className="border-b border-[#c9c2b8] bg-cream text-[#171411]">
      <div className="mx-auto max-w-[1540px] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,840px)] md:items-end">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">
            03 / Models &amp; research
          </p>
          <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.25rem)] leading-[0.94] tracking-[-0.02em]">
            Claims earn their place.
          </h2>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ProofPanel proof={SANKHYA_MODEL_PROOF} />

          <div className="border-t border-[#26211d]">
            <div className="flex items-center justify-between border-b border-[#c9c2b8] py-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#746d65]">Latest lab notes</p>
              <Link to={ROUTES.research} className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#9b3e21] hover:text-[#171411]">
                All notes ↗
              </Link>
            </div>
            {blogPreviews.slice(0, 3).map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group grid gap-4 border-b border-[#c9c2b8] py-6 transition-colors hover:bg-[#e9e4dc] sm:grid-cols-[38px_minmax(0,1fr)_auto] sm:px-3"
              >
                <span className="font-mono text-[10px] text-[#958d84]">0{index + 1}</span>
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a4a32]">{post.category}</p>
                  <h3 className="mt-2 font-bit text-2xl leading-[1.08] md:text-[28px]">{post.title}</h3>
                  <p className="mt-3 line-clamp-1 text-sm text-[#777067]">{post.excerpt}</p>
                </div>
                <ArrowUpRight size={16} className="hidden text-[#8f877f] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
