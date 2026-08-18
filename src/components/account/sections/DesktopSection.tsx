import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DESKTOP_PRODUCTS, type DesktopProduct, type DesktopProductId } from '@/config/chotu';
import { SectionHeading, StatusPill } from '../shared/primitives';
import { CARD_CLASS, PRIMARY_BUTTON } from '../shared/styles';

type DesktopSectionProps = {
  downloadBusy: DesktopProductId | null;
  onDownload: (product: DesktopProduct) => void;
};

export function DesktopSection({ downloadBusy, onDownload }: DesktopSectionProps) {
  return (
    <section>
      <SectionHeading title="Desktop apps" detail="Choose the product you want. Each download is a private one-use link." />
      <div className="grid gap-4 xl:grid-cols-2">
        {DESKTOP_PRODUCTS.map((product) => {
          const isPreparing = downloadBusy === product.id;
          return (
            <article key={product.id} className={`${CARD_CLASS} flex min-h-[310px] flex-col overflow-hidden`}>
              <div className="flex items-start justify-between gap-4">
                <span
                  className="grid size-14 shrink-0 place-items-center rounded-[14px] border border-black/[0.06]"
                  style={{ backgroundColor: product.accent }}
                >
                  <img src={product.icon} alt="" className="size-12 object-contain" width="48" height="48" />
                </span>
                <StatusPill tone="ready">Published</StatusPill>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#9b5a34]">Product / {product.id === 'chotu' ? '01' : '02'}</p>
                <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#111820]">{product.name} for Mac</h2>
                <p className="mt-1.5 text-[13px] leading-5 text-[#5d6974]">{product.role}</p>
                <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-[#89939c]">{product.detail} · DMG</p>
              </div>

              <div className="mt-auto pt-6">
                <Button
                  type="button"
                  onClick={() => onDownload(product)}
                  disabled={downloadBusy !== null}
                  className={`${PRIMARY_BUTTON} w-full`}
                  aria-label={`Download ${product.name} for Mac`}
                >
                  <Download className="size-4" />
                  {isPreparing ? 'Preparing link' : `Download ${product.name}`}
                </Button>
                <p className="mt-2 text-center text-[11px] text-[#89939c]">Account verified · link expires after use</p>
              </div>
            </article>
          );
        })}
      </div>

      <article className={`${CARD_CLASS} mt-4`}>
        <div className="grid gap-0 overflow-hidden rounded-lg border border-[#e1e6ea] bg-[#f7f8f9] sm:grid-cols-3">
          {['Open the DMG', 'Drag the app to Applications', 'Launch the app'].map((step, index) => (
            <div key={step} className="flex min-h-14 items-center gap-2 border-b border-[#e1e6ea] px-3 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[10px] font-semibold text-[#c46a36]">{index + 1}</span>
              <span className="text-[12px] text-[#404b55]">{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#e1e6ea] pt-4">
          <span className="text-[12px] text-[#6b7782]">Windows x64</span>
          <span className="text-[11px] font-medium text-[#9b5a34]">Not published</span>
        </div>
      </article>
    </section>
  );
}
