import { useEffect, useRef, useState } from 'react';

const benefits = [
  {
    title: 'A small orb, not another tab',
    metric: '01 - Product surface',
    description: 'Chotu stays close to the desktop as an orb, then expands into chat and task views when a request becomes real work.',
  },
  {
    title: 'Context before action',
    metric: '02 - Dhee compiler',
    description: 'Dhee turns screen context, repo state, browser evidence, prior decisions, and preferences into the compact working set Chotu needs.',
  },
  {
    title: 'Coding with receipts',
    metric: '03 - Browser proof',
    description: 'For code work, Chotu plans, patches, verifies in the browser, asks for feedback, and saves evidence instead of pretending a diff is done.',
  },
  {
    title: 'Control stays yours',
    metric: 'What breaks today',
    description: 'Most assistants either only talk or act too freely. Chotu keeps risky steps behind owner approval and keeps every run reviewable.',
  },
  {
    title: 'Every run teaches the next',
    metric: '',
    description: 'Accepted decisions, rejected attempts, product taste, and working habits become memory.\nThe assistant gets warmer instead of restarting cold.',
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
        <div className="mb-12">
          <h2 className="font-pixel text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
            Why Chotu feels different.
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-[700px] leading-relaxed">
            Most assistants talk. Chotu carries context, plans bounded work, asks before acting, verifies the result, and remembers what you approved. It is built for people who want an assistant that can actually stay with the work.
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
              small orb
            </div>
            <div className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] leading-tight mt-2">
              serious work
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
