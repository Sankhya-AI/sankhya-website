import { Download, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CHOTU_SUPPORTED_PLATFORM } from '@/config/chotu';
import { SectionHeading, StatusPill } from '../shared/primitives';
import { CARD_CLASS, PRIMARY_BUTTON } from '../shared/styles';

export function DesktopSection({ downloadBusy, onDownload }: { downloadBusy: boolean; onDownload: () => void }) {
  return (
    <section>
      <SectionHeading title="Chotu Desktop" detail="Published builds and account-verified downloads." />
      <article className={CARD_CLASS}>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eef6f2] text-[#2f7b60]"><Laptop className="size-5" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-semibold text-[#111820]">Chotu for Mac</h2>
                <StatusPill tone="ready">Published</StatusPill>
              </div>
              <p className="mt-1 text-[12px] text-[#6b7782]">{CHOTU_SUPPORTED_PLATFORM.detail} · DMG · private one-use link</p>
            </div>
          </div>
          <Button type="button" onClick={onDownload} disabled={downloadBusy} className={`${PRIMARY_BUTTON} shrink-0`}>
            <Download className="size-4" />{downloadBusy ? 'Preparing link' : 'Download for Mac'}
          </Button>
        </div>

        <div className="mt-5 grid gap-0 overflow-hidden rounded-lg border border-[#e1e6ea] bg-[#f7f8f9] sm:grid-cols-3">
          {['Open the DMG', 'Drag Chotu to Applications', 'Launch Chotu'].map((step, index) => (
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
