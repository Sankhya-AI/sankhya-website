import { useEffect, useRef, useState } from 'react';

const benefits = [
  {
    title: 'Capture the trail',
    metric: '01 · Repo memory',
    description: 'Commands, diffs, errors, decisions, and handoffs become memory as work happens — not pasted into a prompt.',
  },
  {
    title: 'Route the useful parts',
    metric: '02 · Context routing',
    description: 'The agent gets the few memories that matter for this task, not the whole attic. Right slice, right agent, right time.',
  },
  {
    title: 'Keep control',
    metric: '03 · Local-first',
    description: 'Local-first by default, reviewable when shared, clear enough for a team to trust. Open core — start free, scale when teams need it.',
  },
  {
    title: 'Cold starts, gone',
    metric: 'What breaks today',
    description: "A coding agent opens the repo with no memory of yesterday. Sankhya turns that handoff into infrastructure, not a habit.",
  },
  {
    title: 'Scattered context, joined',
    metric: '',
    description: 'Context lives across chats, terminals, tests, and half-written notes.\nSankhya routes it where it actually gets used.',
    large: true,
  },
];

export function Benefits() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="w-full bg-cream grid-pattern py-16 md:py-24 px-4 md:px-8"
    >
      <div className={`max-w-[1400px] mx-auto transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-pixel text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
            What you get with Sankhya.
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-[640px] leading-relaxed">
            Information as infrastructure, not chat history. Sankhya is building the routing, preferences, and feedback layer agentic systems share — so useful agent behavior compounds across Claude Code, Codex, Cursor, Hermes and Aider instead of getting lost between sessions.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-0 border border-[var(--border-light)]">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className={`p-6 md:p-8 border-b md:border-r border-[var(--border-light)] ${
                benefit.large ? 'md:col-span-1' : ''
              } ${idx === 4 ? 'md:col-span-1 md:row-span-1' : ''}`}
            >
              {benefit.metric && (
                <div className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  {benefit.metric}
                </div>
              )}
              <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] mb-3">
                {benefit.title}
              </h3>
              <p className={`font-mono text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line ${benefit.large ? 'text-base' : ''}`}>
                {benefit.description}
              </p>
            </div>
          ))}
          {/* Large text cell */}
          <div className="p-6 md:p-8 border-b md:border-r border-[var(--border-light)] flex flex-col justify-center">
            <div className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] leading-tight">
              one shared layer
            </div>
            <div className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] leading-tight mt-2">
              every agent at work
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
