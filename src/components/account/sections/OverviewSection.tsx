import { ShieldCheck } from 'lucide-react';
import type { ChotuSubscription } from '@/lib/firebase';
import { MODE_COPY, type ReadyMode } from '../shared/mode';
import { AccessTile, StatusPill } from '../shared/primitives';
import { CARD_CLASS, formatDate } from '../shared/styles';

export function OverviewSection({ subscription, mode }: { subscription: ChotuSubscription; mode: ReadyMode }) {
  const state = MODE_COPY[mode];
  const managedPreparing = mode === 'managed' && subscription.managedApiKey?.status !== 'active';
  const modelValue = mode === 'managed' ? 'Sankhya Key' : mode === 'byok' ? 'Own provider key' : 'Not selected';

  return (
    <section className="space-y-3">
      <article className={CARD_CLASS}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#e1e6ea] bg-[#f7f8f9]"><ShieldCheck className="size-5 text-[#c46a36]" /></span>
            <div>
              <p className="text-[11px] font-semibold text-[#6b7782]">Control center</p>
              <h2 className="mt-1 text-[20px] font-semibold leading-7 text-[#111820]">{managedPreparing ? 'Sankhya Key is preparing' : state.title}</h2>
              <p className="mt-1 max-w-2xl text-[13px] leading-5 text-[#6b7782]">{managedPreparing ? 'Managed model access is being prepared against your paid Chotu entitlement.' : state.detail}</p>
            </div>
          </div>
          <StatusPill tone={managedPreparing ? 'attention' : state.tone}>{managedPreparing ? 'Setting up' : state.label}</StatusPill>
        </div>
      </article>

      <div className="grid gap-3 sm:grid-cols-2">
        <AccessTile enabled={subscription.access.localApp} label="Desktop apps" value={subscription.access.localApp ? 'Plank + Chotu available' : 'Not included'} />
        <AccessTile enabled={subscription.access.updates} label="Updates" value={subscription.access.updates ? `Included through ${formatDate(subscription.updateUntil)}` : 'Not included'} />
        <AccessTile enabled={subscription.access.support} label="Support" value={subscription.access.support ? 'Included' : 'Not included'} />
        <AccessTile enabled={mode === 'managed' || mode === 'byok'} label="Model connection" value={modelValue} />
      </div>
    </section>
  );
}
