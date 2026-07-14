import { ArrowDownRight, ArrowUpRight, Bell, Brain, Code2, Eye, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { ChotuOrb } from '@/components/ChotuOrb';
import { ProofReel } from '@/components/ProofReel';
import { Seo } from '@/components/Seo';
import { CHOTU_DEMO_FILM, ROUTE_SEO, ROUTES } from '@/content/site';
import { chotuSoftwareApplicationJsonLd } from '@/lib/seo';

const capabilities = [
  {
    icon: Search,
    title: 'Research',
    detail: 'Investigate questions and bring the useful answer back into your task.',
  },
  {
    icon: Code2,
    title: 'Build in a workspace',
    detail: 'Choose the repo boundary, request a change, and keep coding work attached to it.',
  },
  {
    icon: Eye,
    title: 'Use the current screen',
    detail: 'Read and operate the visible interface for the task you initiated.',
  },
  {
    icon: Brain,
    title: 'Remember with Dhee',
    detail: 'Carry decisions and preferences forward through local-first memory.',
  },
  {
    icon: Bell,
    title: 'Notify at the right moment',
    detail: 'Surface task progress and moments that need your attention.',
  },
  {
    icon: ShieldCheck,
    title: 'Gate sensitive actions',
    detail: 'Keep consequential steps behind explicit permission and owner control.',
  },
] as const;

export function ChotuPage() {
  return (
    <main className="bg-cream text-[#171411]">
      <Seo {...ROUTE_SEO.chotu} jsonLd={chotuSoftwareApplicationJsonLd()} />

      <section data-navbar-inverse="true" className="relative isolate overflow-hidden bg-[#0d0c0b] px-5 pt-40 pb-20 text-[#f8ead8] md:px-8 md:pt-48 md:pb-28 lg:px-10">
        <div aria-hidden="true" className="lab-grid absolute inset-0 -z-10 opacity-[0.08]" />
        <div className="mx-auto grid max-w-[1540px] gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.75fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8a5c]">
              <span className="size-1.5 bg-[#ff7548]" />
              Chotu · Early access · Mac
            </div>
            <h1 className="mt-7 max-w-5xl text-balance font-bit text-[clamp(3.8rem,7.7vw,8.2rem)] leading-[0.88] tracking-[-0.03em]">
              Your computer, finally personal.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f8ead8]/62">
              A local-first personal AI for research, coding inside chosen workspaces, current-screen actions, and memory that carries useful context forward.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to={ROUTES.pricing}
                className="inline-flex h-11 items-center gap-2 bg-[#f8ead8] px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#171411] hover:bg-white"
              >
                Get Chotu for Mac <ArrowUpRight size={14} />
              </Link>
              <a
                href="#proof"
                className="inline-flex h-11 items-center gap-2 border border-white/24 px-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#f8ead8] hover:border-white/50"
              >
                Watch Chotu work <ArrowDownRight size={14} />
              </a>
            </div>
          </div>

          <div className="border border-white/14 bg-white/[0.035] p-5 md:p-7">
            <div className="flex items-start justify-between gap-5 border-b border-white/12 pb-6">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white/40">Product / 01</p>
                <p className="mt-3 font-bit text-3xl">Chotu for Mac</p>
              </div>
              <ChotuOrb size="lg" label="Chotu" variant="dark" />
            </div>
            <dl className="divide-y divide-white/10 font-mono text-xs">
              <div className="flex justify-between gap-5 py-4"><dt className="text-white/38">Availability</dt><dd>Early access</dd></div>
              <div className="flex justify-between gap-5 py-4"><dt className="text-white/38">Platform</dt><dd>Apple silicon Mac</dd></div>
              <div className="flex justify-between gap-5 py-4"><dt className="text-white/38">Memory</dt><dd>Dhee, local-first</dd></div>
              <div className="flex justify-between gap-5 py-4"><dt className="text-white/38">Control</dt><dd>Permission gated</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section id="proof" data-navbar-inverse="true" className="scroll-mt-20 bg-[#0d0c0b] px-5 pb-20 text-[#f8ead8] md:px-8 md:pb-28 lg:px-10">
        <div className="mx-auto max-w-[1540px] border-t border-white/14 pt-10">
          <div className="grid gap-6 pb-8 md:grid-cols-[220px_minmax(0,720px)]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff8255]">Chotu in action</p>
            <h2 className="font-bit text-[clamp(2.5rem,4.5vw,4.8rem)] leading-[0.94]">Ask. Build. Act. Remember.</h2>
          </div>
          <ProofReel film={CHOTU_DEMO_FILM} scenes={CHOTU_DEMO_FILM.scenes} surface="product" />
        </div>
      </section>

      <section className="border-b border-[#c9c2b8] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,820px)] md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">Demonstrated today</p>
            <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.3rem)] leading-[0.94]">Useful because it stays grounded.</h2>
          </div>
          <div className="grid border-x border-[#c9c2b8] md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ detail, icon: Icon, title }) => (
              <article key={title} className="min-h-64 border-b border-r border-[#c9c2b8] p-6 last:border-r-0 md:p-8">
                <Icon size={20} strokeWidth={1.5} className="text-[#b94827]" />
                <h3 className="mt-10 font-bit text-3xl">{title}</h3>
                <p className="mt-4 max-w-sm text-[15px] leading-7 text-[#6e675f]">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e6dfd5] px-5 py-20 md:px-8 md:py-24 lg:px-10">
        <div className="mx-auto flex max-w-[1540px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">Early access · Apple silicon</p>
            <h2 className="mt-5 max-w-4xl font-bit text-[clamp(2.8rem,5.5vw,6rem)] leading-[0.92]">Put Chotu to work on your Mac.</h2>
          </div>
          <Link to={ROUTES.pricing} className="inline-flex h-12 shrink-0 items-center gap-2 bg-[#171411] px-6 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#f8ead8] hover:bg-[#302a25]">
            Get Chotu for Mac <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
