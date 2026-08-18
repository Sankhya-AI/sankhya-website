import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { blogPreviews } from '@/content/blog-manifest';
import { EXTERNAL_ROUTES, ROUTES } from '@/content/site';

const learningLoop = [
  ['01', 'Understand', 'Plank explains the specific idea blocking the page in front of you.'],
  ['02', 'Practise', 'It chooses an example or question aimed at that idea, not the whole chapter.'],
  ['03', 'Prove', 'What you can apply is banked. What still fails becomes the next lesson.'],
] as const;

export function ModelsResearch() {
  return (
    <section className="border-b border-[#c9c2b8] bg-cream text-[#171411]">
      <div className="mx-auto max-w-[1540px] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,900px)] md:items-end">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">
            03 / Learning that compounds
          </p>
          <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.25rem)] leading-[0.94] tracking-[-0.02em]">
            It remembers the learner, not just the conversation.
          </h2>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.75fr)]">
          <div>
            <p className="max-w-3xl text-[17px] leading-8 text-[#6e675f]">
              Under Plank is Dhee, a memory layer built to remember where a specific student gets stuck. Not what they
              clicked. Not how long a tab stayed open. The concepts they have seen, practised, and actually proven.
            </p>

            <ol className="mt-9 border-t border-[#bcb5aa]">
              {learningLoop.map(([number, title, detail]) => (
                <li key={number} className="grid gap-4 border-b border-[#c9c2b8] py-6 sm:grid-cols-[54px_180px_minmax(0,1fr)] sm:items-baseline">
                  <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#b94827]">{number}</span>
                  <h3 className="font-bit text-2xl">{title}</h3>
                  <p className="text-[15px] leading-7 text-[#746d65]">{detail}</p>
                </li>
              ))}
            </ol>

            <a
              href={EXTERNAL_ROUTES.dhee}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#9b3e21] hover:text-[#171411]"
            >
              Explore the Dhee memory layer <ArrowUpRight size={14} />
            </a>
          </div>

          <article className="border border-[#29241f] bg-[#151311] p-6 text-[#f8ead8] md:p-8">
            <div className="flex items-center justify-between gap-5 border-b border-white/14 pb-5">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">Dhee · Student 024</p>
                <h3 className="mt-2 font-bit text-3xl">Learning record</h3>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.08em] text-white/46">
                <span className="benchmark-pulse size-2 bg-[#ff7548]" /> live
              </span>
            </div>

            <dl className="divide-y divide-white/12">
              {[
                ['Pages read', '42'],
                ['Ideas seen', '18'],
                ['Ideas proven', '11'],
                ['Needs attention', 'Growing perpetuities'],
              ].map(([label, value], index) => (
                <div key={label} className="flex justify-between gap-6 py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/34">{label}</dt>
                  <dd className={`text-right text-sm ${index === 3 ? 'text-[#ff9b78]' : 'text-white/74'}`}>{value}</dd>
                </div>
              ))}
            </dl>

            <blockquote className="mt-5 border-l-2 border-[#ff7548] bg-white/[0.035] p-4 text-[15px] leading-7 text-white/68">
              “Missed the same idea three times across two weeks. It is now blocking the valuation project.”
            </blockquote>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.1em] text-white/30">
              A learning agent can act on this. A progress bar cannot.
            </p>
          </article>
        </div>

        <div className="mt-16 grid gap-8 border-t border-[#26211d] pt-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a4a32]">From the lab</p>
            <Link to={ROUTES.research} className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#9b3e21] hover:text-[#171411]">
              All notes <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid border-l border-[#c9c2b8] md:grid-cols-3">
            {blogPreviews.slice(0, 3).map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group min-h-56 border-r border-b border-[#c9c2b8] p-5 transition-colors hover:bg-[#e9e4dc] md:border-b-0 md:p-6"
              >
                <span className="font-mono text-[10px] text-[#958d84]">0{index + 1}</span>
                <p className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a4a32]">{post.category}</p>
                <h3 className="mt-3 font-bit text-2xl leading-[1.08]">{post.title}</h3>
                <ArrowUpRight size={15} className="mt-6 text-[#8f877f] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
