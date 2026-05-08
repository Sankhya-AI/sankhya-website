const integrations = [
  { name: 'Claude Code', description: "Terminal coding agents can inherit repo decisions, prior attempts, and review constraints without replaying the whole transcript." },
  { name: 'Codex', description: "A second agent can resume the same project with the same shared trail, not a pasted summary that goes stale by the next change." },
  { name: 'Cursor', description: 'Editor-native work stays connected to CLI work so rules, preferences, and learnings move with the codebase.' },
  { name: 'Voice Agents', description: 'Live calls can route intent, location, and policy context to the right follow-up system while keeping operators in control.' },
  { name: 'Research', description: 'Signals from papers, policy changes, markets, or field notes can become traceable tasks with source context attached.' },
  { name: 'Git', description: "Repo memory rides on the trail teams already produce: commits, branches, diffs, and review threads." },
  { name: 'GitHub', description: "PR decisions, code ownership, and review feedback become scoped memory when an agent edits nearby files." },
  { name: 'Routing API', description: "Reusable schemas score memories, scope context, and share promoted learnings between agentic systems." },
  { name: 'Local-first', description: "Systems can run close to the work, then become reviewable and collaborative when a team needs a shared layer." },
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
