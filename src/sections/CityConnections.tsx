import { useEffect, useRef, useState } from 'react';
import { Terminal, GitBranch, Workflow, ArrowUpRight } from 'lucide-react';

const audiences = [
  {
    eyebrow: 'For operating teams',
    title: 'Turn scattered tools into one working memory.',
    description:
      'Sankhya connects calls, documents, repos, approvals, and signals so agents can act with the history humans already built.',
    cta: 'See the systems',
    href: '#stack',
    points: [
      'Shared memory for agents and teams',
      'Approval lanes for high-stakes work',
      'Reusable learning from every outcome',
    ],
  },
  {
    eyebrow: 'For agent builders',
    title: 'Build on routing, memory, and execution fabric.',
    description:
      'The lab designs the primitives that let useful agent behavior compound instead of disappearing at the end of a session.',
    cta: 'See the systems',
    href: '#stack',
    points: [
      'Context routers for task-specific memory',
      'Schemas for multi-agent handoffs',
      'Interfaces that keep humans in control',
    ],
  },
];

export function CityConnections() {
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
      id="systems"
      ref={sectionRef}
      className="w-full bg-cream grid-pattern py-16 md:py-24 px-4 md:px-8 overflow-hidden"
    >
      <div className={`max-w-[1400px] mx-auto transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-pixel text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
            One lab. Many surfaces.
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-[640px] leading-relaxed">
            Sankhya builds the connective infrastructure agents need before they can become dependable coworkers: memory, routing, approvals, and feedback loops.
          </p>
        </div>

        {/* Three quick-route cards */}
        <div className="grid md:grid-cols-3 gap-0 border border-[var(--border-light)] mb-12">
          <div className="p-6 border-b md:border-r border-[var(--border-light)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                <Terminal size={16} className="text-white" />
              </div>
            </div>
            <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] mb-2">
              Capture the working trail
            </h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
              Calls, repos, support notes, research, policies, and approvals become durable context instead of scattered residue.
            </p>
          </div>

          <div className="p-6 border-b md:border-r border-[var(--border-light)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                <GitBranch size={16} className="text-white" />
              </div>
            </div>
            <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] mb-2">
              Route context to the right agent
            </h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
              Each agent gets the few facts, constraints, and decisions needed for its work without dragging the full history along.
            </p>
          </div>

          <div className="p-6 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                <Workflow size={16} className="text-white" />
              </div>
            </div>
            <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] mb-2">
              Close the learning loop
            </h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
              Human approvals, blocked actions, and successful outcomes become reusable operating knowledge for the next run.
            </p>
          </div>
        </div>

        {/* Two audience paths */}
        <div className="grid md:grid-cols-2 gap-0 border border-[var(--border-light)]">
          {audiences.map((a, idx) => (
            <div
              key={idx}
              className={`p-6 md:p-8 ${idx === 0 ? 'border-b md:border-b-0 md:border-r border-[var(--border-light)]' : ''}`}
            >
              <div className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                {a.eyebrow}
              </div>
              <h3 className="font-pixel text-2xl md:text-3xl text-[var(--text-primary)] mb-4 leading-tight">
                {a.title}
              </h3>
              <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {a.description}
              </p>
              <ul className="space-y-2 mb-6">
                {a.points.map((p) => (
                  <li key={p} className="font-mono text-sm text-[var(--text-primary)] flex items-start gap-2">
                    <span className="text-[var(--text-muted)] mt-0.5">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <a
                href={a.href}
                className="btn-outline inline-flex items-center gap-2 text-sm"
              >
                {a.cta} <ArrowUpRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
