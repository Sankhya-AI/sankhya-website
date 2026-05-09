const menuLinks = [
  ['Stack', '/#stack'],
  ['Why us', '/#why-us'],
  ['Systems', '/#systems'],
  ['Blog', '/#blog'],
];

const followLinks = [
  ['Star on GitHub', 'https://github.com/Sankhya-AI/dhee'],
];

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
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,1)_0%,rgba(5,5,5,0.94)_18%,rgba(5,5,5,0.68)_52%,rgba(5,5,5,0.18)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="mx-auto flex min-h-[340px] max-w-[1540px] flex-col px-5 pt-14 pb-7 md:min-h-[410px] md:px-8 md:pt-16">
        <div className="grid gap-12 md:grid-cols-[180px_180px_minmax(0,1fr)_270px]">
          <div>
            <h4 className="mb-3 font-mono text-xs font-bold uppercase tracking-normal text-white/88">
              Menu
            </h4>
            <ul className="space-y-2">
              {menuLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="inline-flex items-center gap-2 font-mono text-sm text-white/58 transition-colors hover:text-white"
                  >
                    <span>↳</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-mono text-xs font-bold uppercase tracking-normal text-white/88">
              Follow
            </h4>
            <ul className="space-y-2">
              {followLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-sm text-white/58 transition-colors hover:text-white"
                  >
                    <span>↳</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-[420px] font-mono text-sm leading-relaxed text-white/58 md:justify-self-center">
            Sankhya builds shared memory, context routing, and execution fabric for agentic systems that need to keep work moving across tools, teams, and time.
          </div>

          <div>
            <h4 className="mb-3 font-mono text-xs font-bold uppercase tracking-normal text-white/88">
              Privacy & Terms
            </h4>
            <a
              href="#home"
              className="inline-flex items-center gap-2 font-mono text-sm text-white/58 transition-colors hover:text-white"
            >
              <span>↳</span>
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-[11px] uppercase text-white/42 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Sankhya AI Labs</span>
          <span>Built for memory-aware agents and human operators</span>
        </div>
      </div>
    </footer>
  );
}
