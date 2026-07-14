import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { PixelDither } from '@/components/PixelDither';
import { ProofReel } from '@/components/ProofReel';
import { CHOTU_DEMO_FILM, DITHER_PRESETS, HOME_DEMO_SCENE_IDS, ROUTES, type DemoScene } from '@/content/site';

const homeSceneIds: ReadonlySet<DemoScene['id']> = new Set(HOME_DEMO_SCENE_IDS);
const homeScenes = CHOTU_DEMO_FILM.scenes.filter((scene) => homeSceneIds.has(scene.id));

export function ChotuProof() {
  return (
    <section data-navbar-inverse="true" className="relative bg-[#0d0c0b] text-[#f8ead8]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-16 -translate-y-full overflow-hidden">
        <PixelDither {...DITHER_PRESETS.section} className="opacity-100" />
      </div>
      <div className="mx-auto max-w-[1540px] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="grid gap-8 border-b border-white/14 pb-10 lg:grid-cols-[220px_minmax(0,790px)_auto] lg:items-end">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">
            02 / Chotu proof reel
          </p>
          <div>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.25rem)] leading-[0.94] tracking-[-0.02em]">
              A personal AI, shown doing the work.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#f8ead8]/58">
              Real product captures. No capability theatre.
            </p>
          </div>
          <Link
            to={ROUTES.chotu}
            className="group inline-flex h-11 items-center justify-center gap-2 border border-white/24 px-5 font-mono text-xs font-bold uppercase tracking-[0.07em] text-[#f8ead8] transition-colors hover:border-[#ff8255] hover:text-white lg:justify-self-end"
          >
            Meet Chotu
            <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ProofReel film={CHOTU_DEMO_FILM} scenes={homeScenes} surface="home" className="mt-8" />
      </div>
    </section>
  );
}
