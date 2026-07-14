import { FOOTER_GROUPS } from '@/content/site';

export function Footer() {
  return (
    <footer className="relative isolate -mt-px w-full overflow-hidden bg-[#050505] text-[#f8f2ea]">
      <img
        src="/assets/sankhya-footer-network.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-bottom"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,1)_0%,rgba(5,5,5,0.94)_24%,rgba(5,5,5,0.66)_62%,rgba(5,5,5,0.18)_100%)]"
      />
      <div aria-hidden="true" className="lab-grid absolute inset-0 -z-10 opacity-30" />

      <div className="mx-auto flex min-h-[380px] max-w-[1540px] flex-col px-5 pt-12 pb-7 md:px-8 md:pt-14 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(130px,1fr))_minmax(260px,1.5fr)]">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.label}>
              <h2 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/88">
                {group.label}
              </h2>
              <ul className="space-y-2.5">
                {group.links.map((link) => {
                  const external = link.href.startsWith('http');
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-2 font-mono text-xs text-white/52 transition-colors hover:text-white"
                      >
                        <span className="text-[#cf5a32]">↳</span>
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="border-t border-white/14 pt-5 sm:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <p className="font-bit text-3xl leading-[1.05] text-[#f8ead8]">
              Remember.<br />Act.<br />Reason.
            </p>
            <p className="mt-5 max-w-[310px] text-sm leading-6 text-white/48">
              Memory, personal agents, and collective-intelligence models from Sankhya AI Labs.
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.08em] text-white/38 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Sankhya AI Labs</span>
          <span>Remember. Act. Reason.</span>
        </div>
      </div>
    </footer>
  );
}
