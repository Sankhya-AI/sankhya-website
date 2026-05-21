const integrations = [
  { name: 'Desktop Orb', description: 'Chotu starts as a tiny surface on your desktop, then opens into chat or tasks only when the work needs structure.' },
  { name: 'Chat UI', description: 'Ask, clarify, plan, and hand over context without turning every request into a giant prompt ritual.' },
  { name: 'Task UI', description: 'Longer work becomes visible: intent, plan, blocked steps, owner approval, browser proof, and final handoff.' },
  { name: 'Coding Runs', description: 'Chotu can inspect a repo, prepare a bounded patch, verify in the browser, and ask before applying risky changes.' },
  { name: 'Dhee Memory', description: 'Dhee compiles the right context from prior decisions, preferences, task state, and evidence before Chotu acts.' },
  { name: 'Screen Context', description: 'Useful screen observations become evidence for the current task, not permanent truth that overwrites your profile.' },
  { name: 'Browser Proof', description: 'Visual work is checked where users see it: screenshots, console logs, DOM state, and interaction evidence.' },
  { name: 'GitHub', description: 'Repo decisions, review feedback, and accepted patches become scoped memory for future coding runs.' },
  { name: 'Local-first', description: 'Chotu runs close to your machine, keeps control with you, and shares only what you choose to share.' },
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
