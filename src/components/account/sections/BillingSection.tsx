import type { ReactNode } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CHOTU_MANAGED_PRICE_INR } from '@/config/chotu';
import type { ChotuSubscription } from '@/lib/firebase';
import type { ReadyMode } from '../shared/mode';
import { SectionHeading, StatusPill } from '../shared/primitives';
import { CARD_CLASS, PRIMARY_BUTTON, SECONDARY_BUTTON, formatDate } from '../shared/styles';

function Feature({ children }: { children: ReactNode }) {
  return <li className="flex items-start gap-2 text-[12px] leading-5 text-[#5b6772]"><Check className="mt-1 size-3.5 shrink-0 text-[#2f7b60]" />{children}</li>;
}

function PlanCard({
  active,
  children,
  description,
  name,
  price,
}: {
  active: boolean;
  children: ReactNode;
  description: string;
  name: string;
  price: string;
}) {
  return (
    <article className={`flex min-h-[300px] flex-col rounded-lg border p-5 ${active ? 'border-[#9fcab7] bg-[#f6fbf8]' : 'border-[#e1e6ea] bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="text-[15px] font-semibold text-[#111820]">{name}</h3><p className="mt-1 text-[12px] text-[#6b7782]">{description}</p></div>
        {active ? <StatusPill tone="ready">Active</StatusPill> : null}
      </div>
      <p className="mt-5 text-[24px] font-semibold text-[#111820]">{price}</p>
      {children}
    </article>
  );
}

export function BillingSection({
  mode,
  planBusy,
  subscription,
  onOpenManagedCheckout,
  onSelectByok,
}: {
  mode: ReadyMode;
  planBusy: boolean;
  subscription: ChotuSubscription;
  onOpenManagedCheckout: () => void;
  onSelectByok: () => void;
}) {
  const managed = mode === 'managed';
  const byok = mode === 'byok';
  const planLabel = managed ? 'Paid Chotu + Sankhya Key' : byok ? 'Bring your own key' : 'No model plan selected';
  const periodLabel = managed ? 'Current period ends' : 'Updates through';
  const periodValue = managed ? subscription.currentPeriodEnd : subscription.updateUntil;

  return (
    <section>
      <SectionHeading title="Plan & billing" detail="Choose model access and review the entitlement stored for this account." />
      <div className="grid gap-3 md:grid-cols-2">
        <PlanCard active={managed} name="Paid Chotu" description="Includes managed Sankhya Key" price={`₹${CHOTU_MANAGED_PRICE_INR.toLocaleString('en-IN')} / month`}>
          <ul className="mt-5 space-y-1.5 border-t border-[#e1e6ea] pt-4">
            <Feature>Managed monthly model credits</Feature>
            <Feature>Plank and Chotu Desktop, updates, and support</Feature>
            <Feature>Sankhya Key usage, limits, and top-ups</Feature>
          </ul>
          <Button type="button" onClick={onOpenManagedCheckout} className={`mt-auto w-full justify-center ${managed ? SECONDARY_BUTTON : PRIMARY_BUTTON}`}>
            {managed ? 'Open Razorpay plan' : 'Choose paid Chotu'}<ArrowUpRight className="size-4" />
          </Button>
        </PlanCard>

        <PlanCard active={byok} name="Bring your own key" description="Model billing stays with your provider" price="Free">
          <ul className="mt-5 space-y-1.5 border-t border-[#e1e6ea] pt-4">
            <Feature>Add your OpenRouter key inside the desktop app</Feature>
            <Feature>Plank and Chotu Desktop, updates, and support</Feature>
            <Feature>No managed usage or Sankhya Key credits</Feature>
          </ul>
          <Button type="button" variant="outline" onClick={onSelectByok} disabled={planBusy || byok} className={`mt-auto w-full justify-center ${SECONDARY_BUTTON}`}>
            {byok ? 'Own-key plan active' : planBusy ? 'Activating' : 'Use my own key'}
          </Button>
        </PlanCard>
      </div>

      <article className={`${CARD_CLASS} mt-3`}>
        <h3 className="text-[15px] font-semibold text-[#111820]">Account access</h3>
        <dl className="mt-4 divide-y divide-[#e1e6ea] overflow-hidden rounded-lg border border-[#e1e6ea]">
          {[
            ['Plan', planLabel],
            ['Account status', subscription.status],
            ['Billing mode', subscription.billingMode],
            [periodLabel, formatDate(periodValue)],
          ].map(([label, value]) => (
            <div key={label} className="grid min-h-[54px] gap-1 bg-[#f7f8f9] px-3 py-2.5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:gap-[18px]">
              <dt className="text-[12px] font-medium text-[#6b7782]">{label}</dt>
              <dd className="break-words text-[13px] font-medium text-[#1f2933] sm:text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}
