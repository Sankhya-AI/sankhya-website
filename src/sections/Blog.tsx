import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { BlogPoster } from '../components/BlogPoster';
import { blogPosts } from '../content/blog';

export function Blog() {
  const [featured, ...sideArticles] = blogPosts;
  const hasSideArticles = sideArticles.length > 0;

  if (!featured) {
    return null;
  }

  return (
    <section id="blog" className="w-full border-y border-[#c9c2ba] bg-cream">
      <div className={`grid min-h-[660px] ${hasSideArticles ? 'md:grid-cols-[60%_40%]' : ''}`}>
        <Link
          to={`/blog/${featured.slug}`}
          className={`group flex flex-col border-[#c9c2ba] ${hasSideArticles ? 'md:border-r' : ''}`}
        >
          <BlogPoster
            date={featured.date}
            author={featured.author}
            showMeta={false}
            className="min-h-[330px] border-b border-[#c9c2ba]"
          />

          <article className="p-8 md:p-11">
            <div className="font-mono text-xs font-bold uppercase tracking-normal text-[#8b8580]">
              {featured.category}
            </div>
            <h3 className="mt-5 font-bit text-[32px] font-normal leading-[1.12] tracking-normal text-[#14110f] md:text-[40px]">
              {featured.title}
            </h3>
            <p className="mt-5 max-w-[900px] font-mono text-base leading-[1.2] tracking-normal text-[#7a746f]">
              {featured.excerpt}
            </p>
            <div className="mt-8 font-mono text-sm uppercase tracking-normal text-[#8b8580]">
              {featured.readTime}
            </div>
          </article>
        </Link>

        {hasSideArticles ? (
          <div className="grid">
            {sideArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="group flex min-h-[260px] flex-col justify-center border-b border-[#c9c2ba] p-8 transition-colors hover:bg-[#e9e4dc] md:p-11"
              >
                <div className="font-mono text-xs uppercase tracking-normal text-[#8b8580]">
                  {article.category}
                </div>
                <h3 className="mt-5 font-bit text-[28px] font-normal leading-[1.15] tracking-normal text-[#14110f] md:text-[34px]">
                  {article.title}
                </h3>
                <p className="mt-5 line-clamp-2 font-mono text-base leading-[1.2] tracking-normal text-[#8a837d]">
                  {article.excerpt}
                </p>
                <div className="mt-8 font-mono text-sm uppercase tracking-normal text-[#8b8580]">
                  {article.readTime}
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex min-h-28 items-center justify-end px-8 md:px-11">
        <Link
          to="/blog"
          className="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-normal text-[#8b8580] transition-colors hover:text-[#14110f]"
        >
          View all posts
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
