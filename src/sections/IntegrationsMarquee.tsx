const integrations = [
  { name: 'Read the screen', description: 'Chotu starts from the browser, editor, terminal, and task you already have open.' },
  { name: 'Open apps', description: 'It can move through local tools and browser surfaces instead of waiting for pasted context.' },
  { name: 'Run Codex', description: 'Send coding work through Codex when the job needs repo edits, tests, and verification.' },
  { name: 'Use Claude', description: 'Lean on Claude for reasoning, drafting, and long-context work when that is the better tool.' },
  { name: 'Patch files', description: 'Keep code changes scoped, inspectable, and tied to the request you actually made.' },
  { name: 'Search memory', description: 'Dhee brings back your preferences, prior decisions, and accepted lessons at the right moment.' },
  { name: 'Ask approval', description: 'Commands, edits, spending, sharing, and risky actions stay visible before they happen.' },
  { name: 'Show proof', description: 'Chotu returns the diff, checks, screenshots, console state, and unresolved questions.' },
  { name: 'Keep learning', description: 'Accepted outcomes warm the next run without making every session start from zero.' },
];

function IntegrationCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="inline-flex items-start gap-3 bg-cream border border-[var(--border-light)] rounded-lg p-4 mx-2 min-w-[280px] max-w-[320px]">
      <div className="text-[var(--text-primary)] flex-shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded bg-[var(--text-primary)]/5 border border-[var(--border-light)] flex items-center justify-center font-pixel text-sm">
          {name[0]}
        </div>
      </div>
      <div>
        <div className="font-mono text-sm font-bold text-[var(--text-primary)] mb-1">{name}</div>
        <div className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">{description}</div>
      </div>
    </div>
  );
}

export function IntegrationsMarquee() {
  const row1 = integrations.slice(0, 5);
  const row2 = integrations.slice(4).reverse();

  return (
    <section className="w-full bg-cream py-8 overflow-hidden">
      {/* Row 1 - scrolls left */}
      <div className="flex animate-marquee-left mb-4">
        {[...row1, ...row1].map((item, idx) => (
          <IntegrationCard key={`r1-${idx}`} name={item.name} description={item.description} />
        ))}
      </div>
      {/* Row 2 - scrolls right */}
      <div className="flex animate-marquee-right">
        {[...row2, ...row2].map((item, idx) => (
          <IntegrationCard key={`r2-${idx}`} name={item.name} description={item.description} />
        ))}
      </div>
    </section>
  );
}
