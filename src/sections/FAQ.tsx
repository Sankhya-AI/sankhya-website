import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const faqs = [
  {
    question: 'What is Sankhya AI Labs?',
    answer: 'Sankhya AI Labs builds information infrastructure for AI agents: shared memory, context routing, approval lanes, and learning loops that let agentic systems keep working across tools, teams, and time.',
  },
  {
    question: 'What do you mean by information infrastructure?',
    answer: 'The durable layer beneath agents: what they should remember, what context they should route, what actions need approval, and what outcomes should become future operating knowledge instead of being lost in a chat transcript.',
  },
  {
    question: 'How is this different from "just put it in the prompt"?',
    answer: 'A prompt is a moment. Infrastructure is a system. Sankhya keeps the reusable trail outside any one agent, scores what matters for the task, and routes only the few facts, decisions, and constraints needed at the point of action.',
  },
  {
    question: 'Which systems can this power?',
    answer: 'Coding agents, voice-agent operations, civic service workflows, research monitors, internal copilots, and any environment where multiple agents need to share state without replaying history from scratch.',
  },
  {
    question: 'Is this a product or a lab?',
    answer: 'Both. Sankhya is the lab and systems company. Individual surfaces can be local-first products, private deployments, or collaboration with teams building their own agentic stack.',
  },
  {
    question: 'How do I get started?',
    answer: 'If you are building with agents and need continuity, routing, or execution memory, send the lab a note. We can start with a focused use case, map the existing tools, and design the shared layer around the work already happening.',
  },
];

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[var(--border-light)]">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-mono text-sm md:text-base text-[var(--text-primary)]">
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`text-[var(--text-muted)] flex-shrink-0 ml-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
      id="faq"
      ref={sectionRef}
      className="w-full bg-cream grid-pattern py-16 md:py-24 px-4 md:px-8"
    >
      <div className={`max-w-[800px] mx-auto transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {/* Header */}
        <h2 className="font-pixel text-4xl md:text-5xl text-[var(--text-primary)] text-center mb-12">
          Frequently Asked Questions
        </h2>

        {/* Accordion */}
        <div>
          {faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-8 text-center">
          <a href="#" className="font-mono text-sm text-[var(--text-primary)] inline-flex items-center gap-1 hover:underline">
            View all questions <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
