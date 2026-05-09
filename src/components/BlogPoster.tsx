import type { CSSProperties } from 'react';

type BlogPosterProps = {
  date?: string;
  author?: string;
  className?: string;
  size?: 'hero' | 'thumb';
  showMeta?: boolean;
  style?: CSSProperties;
};

export function BlogPoster({
  date = '2026',
  author = 'Ashish Dwivedi',
  className = '',
  size = 'hero',
  showMeta = true,
  style,
}: BlogPosterProps) {
  const isThumb = size === 'thumb';

  return (
    <div
      className={`relative overflow-hidden bg-[#d2cec5] ${isThumb ? 'min-h-[178px]' : 'min-h-[320px]'} ${className}`}
      style={style}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            'radial-gradient(rgba(0,0,0,0.28) 1px, transparent 1px), radial-gradient(circle at 68% 38%, rgba(248,246,236,0.95) 0, rgba(248,246,236,0.86) 18%, rgba(40,72,108,0.7) 33%, rgba(86,44,92,0.56) 49%, transparent 66%)',
          backgroundSize: '7px 7px, 100% 100%',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(14,14,14,0.92) 0%, rgba(14,14,14,0.84) 16%, transparent 28%), linear-gradient(160deg, rgba(211,188,69,0.72) 0%, transparent 34%), linear-gradient(115deg, transparent 44%, rgba(112,48,130,0.55) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-x-[10%] top-[18%] h-[56%] border-black/90 ${isThumb ? 'border-[8px]' : 'border-[12px] md:border-[18px]'}`}
      />
      <div aria-hidden="true" className="absolute inset-0 border border-black/18" />
      {showMeta ? (
        <div
          className={`absolute z-10 max-w-[180px] text-right font-sans font-semibold leading-tight ${
            isThumb
              ? 'right-3 top-3 rounded-sm bg-black/42 px-2 py-1 text-[8px] text-white/76'
              : 'right-5 top-5 rounded-sm bg-black/38 px-3 py-2 text-[10px] text-white/78 md:right-8 md:top-8 md:text-[11px]'
          }`}
        >
          <div>{date}</div>
          <div>Blog Post</div>
          <div>Authored by {author}</div>
        </div>
      ) : null}
      <div
        className={`absolute font-sans font-black leading-[0.74] tracking-[-0.07em] text-white/88 ${
          isThumb
            ? 'bottom-6 left-5 text-[clamp(4rem,7vw,7.5rem)]'
            : 'bottom-8 left-7 text-[clamp(4.6rem,12vw,11rem)] md:bottom-12 md:left-10'
        }`}
      >
        BLOG
      </div>
      <div
        className={`absolute max-w-[560px] font-sans leading-tight text-white/50 ${
          isThumb ? 'bottom-3 left-5 text-[8px]' : 'bottom-5 left-7 text-[10px] md:left-10'
        }`}
      >
        Context that survives the session. Memory that turns into learning.
      </div>
    </div>
  );
}
