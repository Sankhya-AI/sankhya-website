import { Pause, Play } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import type { DemoFilm, DemoScene } from '@/content/site';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type ProofReelProps = {
  film: DemoFilm;
  scenes: readonly DemoScene[];
  surface: keyof DemoScene['labels'];
  className?: string;
};

export function ProofReel({ film, scenes, surface, className = '' }: ProofReelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reelId = useId();
  const reducedMotion = useReducedMotion();
  const activeScene = scenes[activeIndex];

  const activateScene = (index: number, moveFocus = false) => {
    setActiveIndex(index);
    setPaused(false);
    if (moveFocus) tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = scenes.length - 1;
    let nextIndex = index;

    if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = lastIndex;

    if (nextIndex !== index) {
      event.preventDefault();
      activateScene(nextIndex, true);
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  };

  return (
    <div className={`overflow-hidden border border-white/12 bg-[#11100f] ${className}`}>
      <div
        role="tablist"
        aria-label={`${film.title} scenes`}
        className="flex overflow-x-auto border-b border-white/12 bg-[#0b0a09]"
      >
        {scenes.map((scene, index) => {
          const selected = index === activeIndex;
          const tabLabel = scene.labels[surface];
          return (
            <button
              key={scene.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`${reelId}-${scene.id}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${reelId}-${scene.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => activateScene(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`relative min-w-max border-r border-white/10 px-5 py-4 text-left font-mono text-[11px] font-bold uppercase tracking-[0.08em] transition-colors md:flex-1 md:px-6 ${
                selected
                  ? 'bg-[#cf5a32] text-white'
                  : 'bg-[#0b0a09] text-white/48 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="mr-3 opacity-[0.55]">{String(index + 1).padStart(2, '0')}</span>
              {tabLabel}
            </button>
          );
        })}
      </div>

      <div
        id={`${reelId}-${activeScene.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${reelId}-${activeScene.id}-tab`}
        className="grid lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.65fr)]"
      >
        <figure className="relative aspect-video min-w-0 overflow-hidden bg-black">
          {reducedMotion ? (
            <img
              src={activeScene.posterSrc}
              alt=""
              className="h-full w-full object-cover"
              width="1920"
              height="1080"
            />
          ) : (
            <video
              key={activeScene.id}
              ref={videoRef}
              src={activeScene.videoSrc}
              poster={activeScene.posterSrc}
              autoPlay
              muted
              playsInline
              preload="metadata"
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              onEnded={() => activateScene((activeIndex + 1) % scenes.length)}
              className="h-full w-full object-cover"
              aria-label={`${activeScene.labels[surface]} demonstration`}
            />
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute right-4 bottom-4 flex items-center gap-3">
            {reducedMotion ? (
              <span className="border border-white/20 bg-black/65 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-white/66 backdrop-blur">
                Motion reduced · Poster shown
              </span>
            ) : (
              <button
                type="button"
                onClick={togglePlayback}
                className="inline-flex size-9 items-center justify-center border border-white/25 bg-black/65 text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a4c]"
                aria-label={paused ? 'Play demonstration' : 'Pause demonstration'}
              >
                {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
              </button>
            )}
          </div>
        </figure>

        <div className="flex flex-col justify-between border-t border-white/12 p-6 text-[#f8ead8] lg:border-t-0 lg:border-l lg:p-8">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8a4c]">
              {activeScene.eyebrow}
            </p>
            <h3 className="mt-5 max-w-md font-bit text-[32px] leading-[1.04] md:text-[40px]">
              {activeScene.title}
            </h3>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-[#f8ead8]/62">
              {activeScene.description}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-white/12 pt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-white/38">
            <span>Rendered product capture</span>
            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {film.status === 'published' ? (
        <div className="flex justify-end border-t border-white/12 bg-[#0b0a09] p-4">
          <a
            href={film.fullVideo.src}
            className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#f8ead8] underline decoration-white/25 underline-offset-4 hover:decoration-[#ff8a4c]"
          >
            {film.fullVideo.label}
          </a>
        </div>
      ) : null}
    </div>
  );
}
