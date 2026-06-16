import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bot, BrainCircuit, Database, MonitorDot, Search, Workflow } from 'lucide-react';

const useCases = [
  {
    icon: Workflow,
    title: 'Fix code',
    description:
      'Ask Chotu to inspect a repo, run Codex or Claude, patch the right files, and come back with tests, screenshots, and diffs.',
  },
  {
    icon: Search,
    title: 'Research a task',
    description:
      'Let Chotu gather sources, compare options, keep notes, and turn messy browsing into a decision you can act on.',
  },
  {
    icon: MonitorDot,
    title: 'Use the browser',
    description:
      'Have Chotu open pages, read visible state, check forms, inspect console output, and verify what a real user would see.',
  },
  {
    icon: BrainCircuit,
    title: 'Remember preferences',
    description:
      'Save how you like things done: writing style, repo habits, review standards, names, tools, and recurring decisions.',
  },
  {
    icon: Database,
    title: 'Continue yesterday',
    description:
      'Resume from prior work with the useful context already loaded, instead of reconstructing the whole session from chat history.',
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
      className="flex min-h-[calc(100svh-112px)] w-full items-center overflow-hidden bg-cream grid-pattern px-4 py-16 md:px-8 md:py-20"
    >
      <div className={`mx-auto w-full max-w-[1400px] transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="mb-12 md:mb-16">
          <h2 className="font-pixel text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
            Give <span className="text-[#d97445]">Chotu</span> work.
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-[720px] leading-relaxed">
            Chotu is not another empty chat box. It is built for people who
            live on their laptop and want an assistant that can see the work,
            use tools, remember instructions, and bring back proof.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border border-[var(--border-light)] mb-12">
          {useCases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`p-6 border-[var(--border-light)] ${
                  idx < 3 ? 'border-b' : ''
                } ${idx !== 2 && idx !== 4 ? 'md:border-r' : ''} ${idx === 3 ? 'md:col-span-1' : ''} ${idx === 4 ? 'md:col-span-2' : ''}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-0 border border-[var(--border-light)]">
          {[
            {
              eyebrow: 'Start',
              title: 'Download Chotu',
              description:
                'Sign in to open your Chotu dashboard, download the desktop app, and connect the assistant to your working machine.',
              cta: 'Download / Sign in',
              href: '/pricing',
              icon: Bot,
            },
            {
              eyebrow: 'Underneath',
              title: 'Explore Dhee',
              description:
                'Dhee is the memory layer that helps Chotu keep preferences, decisions, proof, and lessons useful across sessions.',
              cta: 'Open Dhee',
              href: 'https://dhee.sankhyaailabs.com',
              icon: BrainCircuit,
            },
          ].map((a, idx) => {
            const Icon = a.icon;
            return (
            <div
              key={idx}
              className={`p-6 md:p-8 ${idx === 0 ? 'border-b md:border-b-0 md:border-r border-[var(--border-light)]' : ''}`}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                  {a.eyebrow}
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border-light)] bg-white/55">
                  <Icon size={17} className="text-[#c94d25]" />
                </div>
              </div>
              <h3 className="font-pixel text-2xl md:text-3xl text-[var(--text-primary)] mb-4 leading-tight">
                {a.title}
              </h3>
              <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {a.description}
              </p>
              <a
                href={a.href}
                target={a.href.startsWith('http') ? '_blank' : undefined}
                rel={a.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn-outline inline-flex items-center gap-2 text-sm"
              >
                {a.cta} <ArrowUpRight size={14} />
              </a>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
