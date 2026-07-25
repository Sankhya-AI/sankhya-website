import { ArrowRight, KeyRound, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/content/site';
import { CHOTU_MANAGED_MONTHLY_CREDITS, formatCredits } from '@/config/chotu';
import { TOPUP_PACKS, type ChotuSubscription, type TopUpCredits } from '@/lib/firebase';
import type { ReadyMode } from '../shared/mode';
import { SectionHeading, StatusPill } from '../shared/primitives';
import { CARD_CLASS, COMPACT_FORMATTER, INTEGER_FORMATTER, formatDate } from '../shared/styles';

export function SankhyaKeySection({
  subscription,
  mode,
  onTopUp,
}: {
  subscription: ChotuSubscription;
  mode: ReadyMode;
  onTopUp: (credits: TopUpCredits) => void;
}) {
  const managed = mode === 'managed';
  const keyStatus = subscription.managedApiKey?.status;
  const grantedCredits = subscription.managedApiKey?.grantedCredits ?? CHOTU_MANAGED_MONTHLY_CREDITS;
  const usedCredits = Math.min(subscription.usage.creditsUsed, grantedCredits);
  const remainingCredits = Math.max(grantedCredits - usedCredits, 0);
  const usagePercent = grantedCredits > 0 ? Math.min((usedCredits / grantedCredits) * 100, 100) : 0;
  const keyReady = keyStatus === 'active';

  return (
    <section>
      <SectionHeading title="Sankhya Key" detail="Managed model usage included with paid Chotu." />
      {!managed ? (
        <article className={CARD_CLASS}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="grid size-10 place-items-center rounded-lg border border-[#e1e6ea] bg-[#f7f8f9]"><KeyRound className="size-5 text-[#6b7782]" /></span>
              <div>
                <h2 className="text-[15px] font-semibold text-[#111820]">{mode === 'byok' ? 'You are using your own provider key' : 'Sankhya Key is not active'}</h2>
                <p className="mt-1 text-[12px] leading-5 text-[#6b7782]">{mode === 'byok' ? 'Managed usage and limits stay hidden because billing happens with your provider.' : 'Choose paid Chotu to see managed limits, requests, tokens, remaining credits, and top-ups here.'}</p>
              </div>
            </div>
            <Link to={`${ROUTES.account}/billing`} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-[7px] border border-[#d6dee4] bg-white px-4 text-[13px] font-medium text-[#1f2933] hover:bg-[#eef1f3]">
              Review plans<ArrowRight className="size-4" />
            </Link>
          </div>
        </article>
      ) : (
        <article className={CARD_CLASS}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-4">
              <span className="grid size-10 place-items-center rounded-lg bg-[#eef6f2]"><KeyRound className="size-5 text-[#2f7b60]" /></span>
              <div>
                <h2 className="text-[15px] font-semibold text-[#111820]">Managed Sankhya Key</h2>
                <p className="mt-1 text-[12px] text-[#6b7782]">Usage for the current paid Chotu period.</p>
              </div>
            </div>
            <StatusPill tone={keyReady ? 'ready' : 'attention'}>{keyReady ? 'Active' : keyStatus || 'Setting up'}</StatusPill>
          </div>

          <div className="mt-5 grid overflow-hidden rounded-lg border border-[#e1e6ea] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Monthly credits', formatCredits(grantedCredits)],
              ['Remaining', formatCredits(remainingCredits)],
              ['Requests', INTEGER_FORMATTER.format(subscription.usage.requests)],
              ['Tokens used', COMPACT_FORMATTER.format(subscription.usage.tokens)],
            ].map(([label, value]) => (
              <div key={label} className="min-h-20 border-b border-[#e1e6ea] bg-[#f7f8f9] p-4 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
                <p className="text-[11px] font-medium text-[#6b7782]">{label}</p>
                <p className="mt-2 text-[18px] font-semibold text-[#111820]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-[#e1e6ea] p-4">
            <div className="flex items-center justify-between gap-4 text-[12px]">
              <span className="font-medium text-[#404b55]">{formatCredits(usedCredits)} credits used</span>
              <span className="text-[#6b7782]">Resets {formatDate(subscription.currentPeriodEnd)}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8ecef]" role="progressbar" aria-label="Sankhya Key credit usage" aria-valuemin={0} aria-valuemax={grantedCredits} aria-valuenow={usedCredits}>
              <div className="h-full rounded-full bg-[#c46a36]" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>

          <div className="mt-5 border-t border-[#e1e6ea] pt-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><h3 className="text-[13px] font-semibold text-[#111820]">Add credits this period</h3><p className="mt-1 text-[11px] text-[#6b7782]">Top-ups add to the current managed limit.</p></div>
              <div className="flex flex-wrap gap-2">
                {TOPUP_PACKS.map((pack) => (
                  <Button key={pack.credits} type="button" variant="outline" onClick={() => onTopUp(pack.credits)} disabled={!keyReady} className="min-h-9 rounded-[7px] border-[#d6dee4] bg-white px-3 text-[12px] font-medium text-[#1f2933] hover:bg-[#eef1f3]">
                    <Plus className="size-3.5" />{formatCredits(pack.credits)} credits · ₹{pack.inr}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
