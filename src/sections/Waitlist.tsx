import { useState, useEffect, useRef } from 'react';

export function Waitlist() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${name || 'a builder'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n`);
    window.location.href = `mailto:hello@sankhyaailabs.com?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full bg-cream py-16 md:py-24 px-4 md:px-8"
    >
      <div className={`max-w-[480px] mx-auto text-center transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {/* Header */}
        <h2 className="font-pixel text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
          Talk to the lab.
        </h2>
        <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
          Building with coding agents and want shared memory across them? Designing on top of the agentic stack? Drop a line — we read every note and answer in days, not weeks.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="font-mono text-xs text-[var(--text-muted)] mb-2 block">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full bg-transparent border-b border-[var(--border-light)] py-2 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-[var(--text-muted)] mb-2 block">
              Your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="w-full bg-transparent border-b border-[var(--border-light)] py-2 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>
          <div className="text-center pt-4">
            <button type="submit" className="btn-outline">
              Send a note
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
