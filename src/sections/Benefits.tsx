import { useEffect, useRef, useState } from 'react';

const benefits = [
  {
    title: 'Memory',
    metric: '01 - Dhee',
    description: 'Keep preferences, decisions, prior work, and accepted lessons available across tools and sessions.',
  },
  {
    title: 'Approvals',
    metric: '02 - Control',
    description: 'Gate commands, edits, sharing, spending, and other risky steps so autonomy does not take ownership away from you.',
  },
  {
    title: 'Tool use',
    metric: '03 - Action',
    description: 'Let agents move through browsers, terminals, editors, coding tools, and local workflows with clear scope.',
  },
  {
    title: 'Proof',
    metric: '04 - Verify',
    description: 'Return diffs, tests, screenshots, console state, and runtime checks with the answer.',
  },
  {
    title: 'Self-evolution',
    metric: '05 - Improve',
    description: 'Turn accepted outcomes and rejected attempts into better future behavior.\nThe assistant gets warmer instead of restarting cold.',
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
      className="flex min-h-[calc(100svh-112px)] w-full items-center bg-cream grid-pattern px-4 py-16 md:px-8 md:py-20"
    >
      <div className={`mx-auto w-full max-w-[1400px] transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="mb-12">
          <h2 className="font-pixel text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
            Sankhya builds infrastructure for autonomous agents.
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-[700px] leading-relaxed">
            Chotu is the first agent built on the stack. Under it sits the
            work that matters for reliable autonomy: memory, approvals, proof,
            tool use, and learning loops that improve with accepted outcomes.
          </p>
        </div>

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

          <div className="p-6 md:p-8 border-b md:border-r border-[var(--border-light)] flex flex-col justify-center">
            <div className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] leading-tight">
              Remember
            </div>
            <div className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] leading-tight mt-2">
              Verify
            </div>
            <div className="font-pixel text-3xl md:text-4xl text-[#d97445] leading-tight mt-2">
              Evolve
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
