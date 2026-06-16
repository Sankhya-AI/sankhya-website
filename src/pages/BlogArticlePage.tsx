import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { BlogPoster } from '../components/BlogPoster';
import { Seo } from '../components/Seo';
import { blogPosts, getBlogPost } from '../content/blog';
import type { BlogVisual } from '../content/blog';
import { blogPostingJsonLd, breadcrumbJsonLd } from '../lib/seo';

function DiagramShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="mt-10 overflow-hidden rounded-lg bg-[#171717] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:p-6">
      <figcaption className="mb-4 font-mono text-[11px] uppercase tracking-normal text-white/42">
        {title}
      </figcaption>
      <div className="overflow-x-auto rounded-md bg-[#1c1c1b]">
        {children}
      </div>
    </figure>
  );
}

function Box({
  x,
  y,
  width,
  height,
  title,
  lines = [],
  accent = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  lines?: string[];
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="3"
        fill={accent ? '#24211f' : '#1a1a19'}
        stroke={accent ? '#d6663d' : '#73706b'}
        strokeWidth="1.3"
      />
      <text
        x={x + width / 2}
        y={y + 26}
        textAnchor="middle"
        className="fill-[#e8e3dc] font-mono text-[14px] font-semibold"
      >
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={line}
          x={x + width / 2}
          y={y + 48 + index * 18}
          textAnchor="middle"
          className="fill-[#9f9a92] font-mono text-[12px]"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function DheeFsArchitectureDiagram() {
  return (
    <DiagramShell title="DheeFS routing and memory architecture">
      <svg
        viewBox="0 0 1040 560"
        className="block h-auto min-w-[760px] p-4"
        role="img"
        aria-label="DheeFS architecture flowchart"
      >
        <defs>
          <marker id="arrowDhee" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a8580" />
          </marker>
        </defs>

        <rect x="0" y="0" width="1040" height="560" rx="8" fill="#1c1c1b" />
        <g stroke="#4f4b47" strokeWidth="1.2" fill="none" markerEnd="url(#arrowDhee)">
          <path d="M 188 270 H 250" />
          <path d="M 368 252 C 458 140, 508 118, 594 118" />
          <path d="M 706 118 H 760" />
          <path d="M 368 288 C 456 402, 506 424, 594 424" />
          <path d="M 688 400 C 728 350, 776 326, 826 326" />
          <path d="M 688 414 C 736 416, 776 418, 826 418" />
          <path d="M 688 438 C 724 488, 764 508, 822 508" />
          <path d="M 688 246 C 728 198, 774 176, 824 176" />
          <path d="M 928 176 H 974" />
          <path d="M 688 260 C 730 252, 774 248, 824 248" />
          <path d="M 928 248 H 974" />
          <path d="M 688 284 C 730 310, 774 326, 824 326" />
        </g>

        <Box x={36} y={220} width={152} height={100} title="Agent host" lines={['Claude Code', 'Codex', 'MCP client']} />
        <Box x={250} y={230} width={118} height={80} title="Harness" lines={['adapter']} accent />
        <Box x={594} y={72} width={112} height={92} title="Router" lines={['read', 'bash', 'grep', 'agent digests']} />
        <Box x={760} y={78} width={136} height={80} title="Pointer store" lines={['raw output', 'expansion logs']} />
        <Box x={594} y={380} width={94} height={88} title="DheeFS" lines={['FullMemory', 'scope core']} accent />
        <Box x={824} y={136} width={104} height={80} title="Write" lines={['pipeline']} />
        <Box x={974} y={136} width={58} height={80} title="SQLite" lines={['history']} />
        <Box x={824} y={208} width={104} height={80} title="Search" lines={['pipeline']} />
        <Box x={974} y={208} width={58} height={80} title="Vector" lines={['store']} />
        <Box x={824} y={290} width={104} height={72} title="Orchestrate" lines={['shared task']} />
        <Box x={824} y={382} width={104} height={72} title="Cognition" lines={['evolution', 'profiles']} />
        <Box x={822} y={472} width={114} height={72} title="Portable pack" lines={['signed', '.dheemem']} />

        <text x="520" y="516" textAnchor="middle" className="fill-[#77716b] font-mono text-[12px]">
          DheeFS keeps fat skills addressable while serving only the scoped context needed for the current task.
        </text>
      </svg>
    </DiagramShell>
  );
}

function SequenceBox({
  x,
  y,
  text,
  active = false,
}: {
  x: number;
  y: number;
  text: string;
  active?: boolean;
}) {
  return (
    <g>
      <rect x={x - 56} y={y - 18} width="112" height="36" rx="3" fill={active ? '#25211f' : '#1b1b1a'} stroke={active ? '#d6663d' : '#6d6862'} strokeWidth="1.2" />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-[#ded8cf] font-mono text-[11px]">
        {text}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, dashed = false }: { x1: number; y1: number; x2: number; y2: number; label: string; dashed?: boolean }) {
  return (
    <g>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={dashed ? '#6b6660' : '#8a8580'}
        strokeWidth="1.2"
        strokeDasharray={dashed ? '4 5' : undefined}
        markerEnd="url(#arrowSeq)"
      />
      <text
        x={(x1 + x2) / 2}
        y={y1 - 8}
        textAnchor="middle"
        className="fill-[#9d968e] font-mono text-[10px]"
      >
        {label}
      </text>
    </g>
  );
}

function PortableCognitionSequence() {
  const lanes = [
    { x: 120, label: 'User' },
    { x: 300, label: 'Host agent' },
    { x: 500, label: 'DheeFS router' },
    { x: 700, label: 'Memory layer' },
    { x: 900, label: 'SQLite/vector' },
  ];

  return (
    <DiagramShell title="Portable cognition sequence">
      <svg
        viewBox="0 0 1040 640"
        className="block h-auto min-w-[760px] p-4"
        role="img"
        aria-label="DheeFS portable cognition sequence diagram"
      >
        <defs>
          <marker id="arrowSeq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a8580" />
          </marker>
        </defs>
        <rect x="0" y="0" width="1040" height="640" rx="8" fill="#1c1c1b" />

        {lanes.map((lane) => (
          <g key={lane.label}>
            <SequenceBox x={lane.x} y={58} text={lane.label} active={lane.label === 'DheeFS router'} />
            <path d={`M ${lane.x} 82 V 555`} stroke="#4f4b47" strokeWidth="1" />
            <SequenceBox x={lane.x} y={586} text={lane.label} active={lane.label === 'DheeFS router'} />
          </g>
        ))}

        <Arrow x1={120} y1={120} x2={300} y2={120} label="prompt" />
        <Arrow x1={300} y1={165} x2={500} y2={165} label="session event" />
        <Arrow x1={500} y1={214} x2={700} y2={214} label="fetch relevant context" />
        <Arrow x1={700} y1={262} x2={900} y2={262} label="search and rerank" />
        <Arrow x1={900} y1={305} x2={700} y2={305} label="matched memories" dashed />
        <Arrow x1={700} y1={348} x2={500} y2={348} label="scoped context" dashed />
        <Arrow x1={500} y1={392} x2={300} y2={392} label="inject memory/context" dashed />
        <Arrow x1={300} y1={438} x2={500} y2={438} label="tool output digest" />
        <Arrow x1={500} y1={482} x2={700} y2={482} label="store episode" />
        <Arrow x1={700} y1={526} x2={900} y2={526} label="write metadata and vector" />

        <text x="520" y="606" textAnchor="middle" className="fill-[#77716b] font-mono text-[12px]">
          The learned routing behavior survives host changes, handoffs, resumes, and parallel agents.
        </text>
      </svg>
    </DiagramShell>
  );
}

function ArticleVisual({ type }: { type: BlogVisual }) {
  if (type === 'dheefs-architecture') {
    return <DheeFsArchitectureDiagram />;
  }

  return <PortableCognitionSequence />;
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const post = getBlogPost(slug);
  const [activeSectionId, setActiveSectionId] = useState('');

  useEffect(() => {
    if (!post) {
      return undefined;
    }

    const sectionIds = post.sections.slice(1).map((section) => section.id);

    const updateActiveSection = () => {
      const readingLine = Math.min(260, window.innerHeight * 0.32);
      let currentSection = sectionIds[0];

      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);

        if (element && element.getBoundingClientRect().top <= readingLine) {
          currentSection = sectionId;
        }
      }

      setActiveSectionId(currentSection);
    };

    const scrollToHash = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (!rawHash) return;

      const target = document.getElementById(decodeURIComponent(rawHash));
      if (target) {
        target.scrollIntoView();
        updateActiveSection();
      }
    };

    const hashTimer = window.setTimeout(scrollToHash, 0);
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      window.clearTimeout(hashTimer);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const morePosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleSections = post.sections;
  const tocSections = articleSections.slice(1);

  return (
    <main className="bg-cream">
      <Seo
        title={`${post.title} - Sankhya AI Labs`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={[
          blogPostingJsonLd(post),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article>
        <header data-navbar-inverse="true" className="relative overflow-visible bg-[#20201f] px-6 pt-32 pb-0 text-[#f5efe7] sm:px-10 md:px-12 md:pt-36 lg:px-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-44"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,rgba(32,32,31,0.92))]"
          />
          <div className="relative mx-auto max-w-[1364px]">
            <div className="mx-auto max-w-[1040px]">
              <nav className="font-mono text-[11px] uppercase tracking-normal text-white/34 md:text-xs">
                <Link to="/" className="transition-colors hover:text-white/70">Home</Link>
                <span className="mx-2 text-white/20">/</span>
                <Link to="/blog" className="transition-colors hover:text-white/70">Blog</Link>
                <span className="mx-2 text-white/20">/</span>
                <span>{post.category}</span>
              </nav>

              <div className="mt-10 font-mono text-xs font-bold uppercase tracking-normal text-white/54">
                {post.category}
              </div>
              <h1 className="mt-6 max-w-[1040px] font-serif text-[42px] font-semibold leading-[0.98] tracking-[-0.025em] md:text-[64px] lg:text-[74px]">
                {post.title}
              </h1>
              <p className="mt-7 max-w-[900px] font-sans text-lg leading-relaxed text-white/62 md:text-xl">
                {post.excerpt}
              </p>

              <div className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/12 py-6 font-mono text-[11px] uppercase tracking-normal text-white/34 md:text-xs">
                <span>{post.author}</span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-[1180px]">
              <BlogPoster
                date={post.date}
                author={post.author}
                className="relative -mb-28 mt-12 min-h-[320px] rounded-[10px] border border-white/12 shadow-[0_28px_80px_rgba(0,0,0,0.38)] md:-mb-36 md:min-h-[520px]"
              />
            </div>
          </div>
        </header>

        <div className="px-8 pt-40 pb-24 sm:px-12 md:pt-52 lg:px-16 xl:px-8">
          <div className="mx-auto grid w-full max-w-[1180px] min-w-0 gap-14 lg:grid-cols-[minmax(0,760px)_260px] lg:gap-24 xl:gap-32">
            <div className="min-w-0 w-full max-w-[760px] font-sans text-[19px] leading-[1.76] text-[#2b2927] md:text-[21px]">
              {articleSections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  {index > 0 ? (
                    <h2 className="mt-16 border-b border-[#14110f]/28 pb-1 font-sans text-[30px] font-semibold leading-tight tracking-[-0.01em] text-[#111] md:text-[34px]">
                      {section.title}
                    </h2>
                  ) : null}
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className={`${index === 0 ? 'first:mt-0' : ''} mt-7 text-[#3f3b37]`}>
                      {paragraph}
                    </p>
                  ))}
                  {section.visual ? <ArticleVisual type={section.visual} /> : null}
                </section>
              ))}

              <div className="mt-16 flex flex-col items-start gap-4 border-t border-[#c9c2ba] pt-8">
                {post.xUrl ? (
                  <a
                    href={post.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-sm uppercase text-[#c84f29] transition-colors hover:text-[#8f3519]"
                  >
                    Read the original X article
                    <ArrowUpRight size={16} />
                  </a>
                ) : null}
                {post.links?.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-sm uppercase text-[#77716b] transition-colors hover:text-[#111]"
                  >
                    {link.label}
                    <ArrowUpRight size={16} />
                  </a>
                ))}
                {!post.xUrl && !post.links?.length ? (
                  <div className="font-mono text-sm uppercase text-[#8b8580]">
                    Original X article link will appear here once you send it.
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 font-sans">
                <div className="font-mono text-xs font-bold uppercase tracking-normal text-[#68615b]">
                  On this page
                </div>
                <nav className="mt-6 space-y-4">
                  {tocSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      aria-current={activeSectionId === section.id ? 'true' : undefined}
                      className={`block border-l pl-4 text-[15px] leading-snug transition-colors ${
                        activeSectionId === section.id
                          ? 'border-[#14110f] font-semibold text-[#111]'
                          : 'border-transparent text-[#756e68] hover:text-[#111]'
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {morePosts.length > 0 ? (
        <section className="border-t border-[#c9c2ba] px-6 py-16 sm:px-10 md:py-20 lg:px-16">
          <div className="mx-auto max-w-[1180px]">
            <h2 className="font-serif text-[34px] font-semibold text-[#77716b]">More from the blog</h2>
            <div className="mt-9 grid gap-9 md:grid-cols-2">
              {morePosts.map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="group block">
                  <BlogPoster
                    date={item.date}
                    author={item.author}
                    size="thumb"
                    className="h-[210px] rounded-[8px] border border-[#c9c2ba] shadow-[0_18px_46px_rgba(24,18,14,0.12)] transition-transform duration-300 group-hover:scale-[1.01] md:h-[240px]"
                  />
                  <div className="mt-5 font-mono text-xs uppercase text-[#8b8580]">{item.date}</div>
                  <h3 className="mt-3 font-sans text-xl font-semibold leading-tight text-[#151210] group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 font-sans text-base leading-snug text-[#77716b]">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

    </main>
  );
}
