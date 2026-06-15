import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { BlogPoster } from '../components/BlogPoster';
import { Seo } from '../components/Seo';
import { blogPosts } from '../content/blog';
import { blogIndexJsonLd } from '../lib/seo';

export function BlogIndexPage() {
  const [featured, ...sideArticles] = blogPosts;

  if (!featured) {
    return null;
  }

  return (
    <main className="bg-cream pt-20 text-[#14110f]">
      <Seo
        title="Notes - Sankhya AI Labs"
        description="First-party notes from Sankhya AI Labs on Dhee, agent memory, context routing, portable cognition, approval gates, and self-evolving AI systems."
        path="/blog"
        keywords={[
          'Sankhya AI Labs notes',
          'Dhee memory',
          'agent memory',
          'context routing',
          'portable cognition',
          'self-evolving AI systems',
        ]}
        jsonLd={blogIndexJsonLd(blogPosts)}
      />
      <section className="border-b border-[#bdb6ae] px-5 pt-16 pb-16 md:px-8 md:pt-24 md:pb-24">
        <h1 className="max-w-[1480px] font-bit text-[clamp(4.2rem,8vw,9rem)] font-normal leading-[0.92] tracking-normal">
          Latest from the blog.
        </h1>
      </section>

      <section className="border-b border-[#bdb6ae]">
        <div className="grid min-h-[720px] lg:grid-cols-[60%_40%]">
          <Link
            to={`/blog/${featured.slug}`}
            className="group flex flex-col border-[#bdb6ae] transition-colors hover:bg-[#e9e4dc] lg:border-r"
          >
            <BlogPoster
              date={featured.date}
              author={featured.author}
              showMeta={false}
              className="min-h-[430px] border-b border-[#bdb6ae] md:min-h-[560px]"
            />
            <article className="p-8 md:p-11">
              <div className="font-mono text-xs font-bold uppercase tracking-normal text-[#8d8781]">
                {featured.category}
              </div>
              <h2 className="mt-5 max-w-[960px] font-bit text-[32px] font-normal leading-[1.1] tracking-normal text-[#14110f] md:text-[42px]">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-[980px] font-mono text-base leading-[1.3] tracking-normal text-[#7d7771] md:text-lg">
                {featured.excerpt}
              </p>
              <div className="mt-8 font-mono text-sm uppercase tracking-normal text-[#8d8781]">
                {featured.readTime}
              </div>
            </article>
          </Link>

          <div className="grid">
            {sideArticles.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex min-h-[300px] flex-col justify-center border-b border-[#bdb6ae] p-8 transition-colors last:border-b-0 hover:bg-[#e9e4dc] md:p-11"
              >
                <div className="font-mono text-xs uppercase tracking-normal text-[#8d8781]">
                  {post.category}
                </div>
                <h2 className="mt-5 font-bit text-[28px] font-normal leading-[1.16] tracking-normal text-[#14110f] md:text-[34px]">
                  {post.title}
                </h2>
                <p className="mt-5 line-clamp-3 font-mono text-base leading-[1.28] tracking-normal text-[#817b75] md:text-lg">
                  {post.excerpt}
                </p>
                <div className="mt-8 font-mono text-sm uppercase tracking-normal text-[#8d8781]">
                  {post.readTime}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex min-h-28 items-center justify-end border-t border-[#bdb6ae] px-8 md:px-11">
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-normal text-[#8d8781] transition-colors hover:text-[#14110f]"
          >
            View all posts
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
