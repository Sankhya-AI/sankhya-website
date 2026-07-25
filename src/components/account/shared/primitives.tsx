import type { ReactNode } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export function StatusPill({ children, tone }: { children: ReactNode; tone: 'ready' | 'attention' | 'neutral' }) {
  const toneClass = {
    ready: 'bg-[#eef6f2] text-[#2f7b60]',
    attention: 'bg-[#f5f0ed] text-[#9b5a34]',
    neutral: 'bg-[#f1f3f5] text-[#5d6974]',
  }[tone];

  return (
    <span className={`inline-flex min-h-[30px] items-center rounded-full px-3 text-[12px] font-semibold ${toneClass}`}>
      {children}
    </span>
  );
}

export function SectionHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-[15px] font-semibold text-[#111820]">{title}</h2>
      <p className="mt-1 text-[13px] leading-5 text-[#6b7782]">{detail}</p>
    </div>
  );
}

export function AccountNotice({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="status" aria-live="polite" className="rounded-lg border border-[#d7b7a5] bg-[#f5f0ed] px-4 py-3 text-[13px] leading-5 text-[#70452e]">
      {message}
    </div>
  );
}

export function AccessTile({ enabled, label, value }: { enabled: boolean; label: string; value: string }) {
  const Icon = enabled ? CheckCircle2 : Circle;
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-lg border border-[#e1e6ea] bg-[#f7f8f9] px-4 py-3">
      <Icon className={`size-4 shrink-0 ${enabled ? 'text-[#2f7b60]' : 'text-[#9aa4ad]'}`} />
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-[#404b55]">{label}</p>
        <p className="mt-0.5 truncate text-[11px] text-[#6b7782]">{value}</p>
      </div>
    </div>
  );
}
