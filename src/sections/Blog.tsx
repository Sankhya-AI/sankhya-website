import { ArrowRight } from 'lucide-react';

const articles = [
  {
    category: 'AGENT INFRASTRUCTURE',
    title: 'Thin Harness, Fat Skills, and the Coming Context Hell',
    description:
      'Fat skills compound, but unmanaged context becomes baggage. Dhee turns repo memory into a portable cognition layer that routes, compresses, forgets, and learns from use.',
    readTime: '14 MIN READ',
    href: 'https://x.com/ashish_dwi/status/2046213227898687678',
    featured: true,
  },
  {
    category: 'AGENT COGNITION',
    title: "I Built a Cognition Layer That Turns Any AI Agent Into a HyperAgent. Here's How",
    description:
      'Memory is not enough if every session still feels new. Dhee adds Buddhi: insights, intentions, performance trends, and prospective memory.',
    readTime: '12 MIN READ',
    href: 'https://x.com/ashish_dwi/status/2037460448405336147',
  },
  {
    category: 'MEMORY SYSTEMS',
    title: 'Every AI Agent You Use Has Amnesia. I Have Fixed It.',
    description:
      'The origin story of Engram: shared handoffs, decay, staged memory writes, episodic scenes, EchoMem, and local-first agent continuity.',
    readTime: '13 MIN READ',
    href: 'https://github.com/Sankhya-AI/dhee',
  },
];

export function Blog() {
  const [featured, ...sideArticles] = articles;

  return (
    <section id="blog" className="w-full border-y border-[#c9c2ba] bg-cream">
      <div className="grid min-h-[660px] md:grid-cols-[60%_40%]">
        <a
          href={featured.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col border-[#c9c2ba] md:border-r"
        >
          <div
            className="relative min-h-[330px] overflow-hidden border-b border-[#c9c2ba] bg-[#d8d0c6]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(135deg, rgba(201,73,34,0.18), rgba(13,13,13,0.14), rgba(157,117,167,0.32))',
              backgroundSize: '6px 6px, cover',
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,13,0.8)_0%,rgba(13,13,13,0.12)_38%,rgba(13,13,13,0)_100%)]" />
            <div className="pointer-events-none absolute left-8 bottom-8 font-sans text-[clamp(4rem,10vw,9rem)] font-black leading-[0.78] tracking-normal text-[#0d0d0d]/78">
              BLOG
            </div>
            <p className="absolute left-8 bottom-5 max-w-[420px] font-mono text-xs text-white/68">
              Context that survives the session. Memory that turns into learning.
            </p>
          </div>

          <article className="p-8 md:p-11">
            <div className="font-mono text-xs font-bold uppercase tracking-normal text-[#8b8580]">
              {featured.category}
            </div>
            <h3 className="mt-5 font-bit text-[32px] font-normal leading-[1.12] tracking-normal text-[#14110f] md:text-[40px]">
              {featured.title}
            </h3>
            <p className="mt-5 max-w-[900px] font-mono text-base leading-[1.2] tracking-normal text-[#7a746f]">
              {featured.description}
            </p>
            <div className="mt-8 font-mono text-sm uppercase tracking-normal text-[#8b8580]">
              {featured.readTime}
            </div>
          </article>
        </a>

        <div className="grid">
          {sideArticles.map((article) => (
            <a
              key={article.title}
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[260px] flex-col justify-center border-b border-[#c9c2ba] p-8 transition-colors hover:bg-[#e9e4dc] md:p-11"
            >
              <div className="font-mono text-xs uppercase tracking-normal text-[#8b8580]">
                {article.category}
              </div>
              <h3 className="mt-5 font-bit text-[28px] font-normal leading-[1.15] tracking-normal text-[#14110f] md:text-[34px]">
                {article.title}
              </h3>
              <p className="mt-5 line-clamp-2 font-mono text-base leading-[1.2] tracking-normal text-[#8a837d]">
                {article.description}
              </p>
              <div className="mt-8 font-mono text-sm uppercase tracking-normal text-[#8b8580]">
                {article.readTime}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="flex min-h-28 items-center justify-end px-8 md:px-11">
        <a
          href="https://x.com/ashish_dwi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-normal text-[#8b8580] transition-colors hover:text-[#14110f]"
        >
          View all posts
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
