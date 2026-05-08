import { ArrowRight } from 'lucide-react';

const articles = [
  {
    category: 'AGENT INFRASTRUCTURE',
    title: 'Why agent memory fails when every tool learns alone',
    description:
      'Most teams keep asking agents to restart from zero. The higher leverage question is what a shared learning layer should preserve across sessions.',
    readTime: '11 MIN READ',
    featured: true,
  },
  {
    category: 'SYSTEMS DESIGN',
    title: 'Context routing is the hidden API of agentic systems',
    description:
      'Agents do not need the whole transcript. They need the right few facts, decisions, preferences, and constraints at the moment of action.',
    readTime: '9 MIN READ',
  },
  {
    category: 'LAB NOTES',
    title: 'Building approval lanes for agents that can actually act',
    description:
      'The useful layer between autonomous execution and human judgment is not another chat window. It is traceable shared state.',
    readTime: '14 MIN READ',
  },
];

export function Blog() {
  const [featured, ...sideArticles] = articles;

  return (
    <section id="blog" className="w-full border-y border-[#c9c2ba] bg-cream">
      <div className="grid min-h-[660px] md:grid-cols-[60%_40%]">
        <a href="#" className="group flex flex-col border-[#c9c2ba] md:border-r">
          <div
            className="min-h-[330px] border-b border-[#c9c2ba] bg-[#d8d0c6]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(135deg, rgba(201,73,34,0.28), rgba(13,13,13,0.12))',
              backgroundSize: '6px 6px, cover',
            }}
          >
            <div className="flex h-full items-end p-8">
              <div className="font-sans text-[clamp(4rem,10vw,9rem)] font-black leading-[0.78] tracking-normal text-[#f0ede6]/90">
                LAB
              </div>
            </div>
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
              href="#"
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
        <a href="#" className="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-normal text-[#8b8580] transition-colors hover:text-[#14110f]">
          View all posts
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
