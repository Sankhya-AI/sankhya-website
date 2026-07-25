export const CARD_CLASS = 'rounded-lg border border-[#e1e6ea] bg-white p-5 shadow-none';
export const PRIMARY_BUTTON =
  'min-h-10 rounded-[7px] border border-[#111820] bg-[#111820] px-4 text-[13px] font-medium text-white hover:bg-[#2b333c]';
export const SECONDARY_BUTTON =
  'min-h-10 rounded-[7px] border border-[#d6dee4] bg-white px-4 text-[13px] font-medium text-[#1f2933] hover:bg-[#eef1f3]';

export const INTEGER_FORMATTER = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
export const COMPACT_FORMATTER = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });

export function formatDate(value: string | null | undefined) {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}
