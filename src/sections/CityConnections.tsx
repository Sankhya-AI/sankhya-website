import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bot, BrainCircuit, MonitorDot, Workflow } from 'lucide-react';

const audiences = [
  {
    eyebrow: 'Available soon',
    title: 'Chotu Personal AI Assistant',
    description:
      'The desktop orb, chat surface, task view, private Chotu Memory, and approval-gated actions for people who want an assistant that can carry real work.',
    cta: 'View pricing',
    href: '/pricing',
    points: [
      'Orb, chat, and task UI',
      'Dhee-powered Chotu Memory',
      'Bounded coding runs with browser proof',
    ],
  },
  {
    eyebrow: 'Coming soon',
    title: 'Chotu Desk Companion',
    description:
      'A physical companion for the desk that brings the same Chotu Memory into voice-first, ambient work without turning your day into another dashboard.',
    cta: 'Follow the build',
    href: '#blog',
    points: [
      'Ambient presence',
      'Voice-first help',
      'Same private Chotu Memory',
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
        <div className="mb-12 md:mb-16">
          <h2 className="font-pixel text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
            Products from Sankhya.
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-[720px] leading-relaxed">
            Chotu is the product layer. Dhee is the memory engine underneath it. The lab builds both so the assistant can remember, act, verify, and stay under your control.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border border-[var(--border-light)] mb-12">
          <div className="p-6 border-b md:border-r border-[var(--border-light)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
            </div>
            <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] mb-2">
              Personal assistant
            </h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
              The orb, chat, and task surface for everyday work that needs memory, judgment, and follow-through.
            </p>
          </div>

          <div className="p-6 border-b md:border-r border-[var(--border-light)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                <Workflow size={16} className="text-white" />
              </div>
            </div>
            <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] mb-2">
              Coding loop
            </h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
              Repo context, isolated patches, browser evidence, owner feedback, and safe approval gates in one loop.
            </p>
          </div>

          <div className="p-6 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                <BrainCircuit size={16} className="text-white" />
              </div>
            </div>
            <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] mb-2">
              Memory substrate
            </h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
              Dhee compiles context, preserves decisions, and turns accepted work into reusable learning.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-[var(--border-light)]">
          {audiences.map((a, idx) => (
            <div
              key={idx}
              className={`p-6 md:p-8 ${idx === 0 ? 'border-b md:border-b-0 md:border-r border-[var(--border-light)]' : ''}`}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                  {a.eyebrow}
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border-light)] bg-white/55">
                  <MonitorDot size={17} className="text-[#c94d25]" />
                </div>
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
                    <span className="text-[var(--text-muted)] mt-0.5">-&gt;</span>
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
