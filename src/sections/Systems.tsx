import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import {
  PRODUCTS,
  PRODUCT_STATUS_LABELS,
  type ProductDefinition,
  type ProductStatus,
} from '@/content/site';

const STATUS_STYLES = {
  available: 'border-[#39714b]/25 bg-[#dce9df] text-[#285a39]',
  'early-access': 'border-[#cf5a32]/30 bg-[#f5dfd5] text-[#9b3e21]',
  'coming-soon': 'border-[#6c675f]/20 bg-[#e5e0d7] text-[#5f5952]',
} as const satisfies Record<ProductStatus, string>;

function ProductLink({ product }: { product: ProductDefinition }) {
  const className =
    'group mt-8 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#26211d] transition-colors hover:text-[#b94827]';

  if (product.external) {
    return (
      <a href={product.href} target="_blank" rel="noopener noreferrer" className={className}>
        {product.actionLabel}
        <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <Link to={product.href} className={className}>
      {product.actionLabel}
      <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Systems() {
  return (
    <section id="systems" className="scroll-mt-24 border-b border-[#c9c2b8] bg-cream text-[#171411]">
      <div className="mx-auto max-w-[1540px] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="grid gap-8 border-b border-[#bcb5aa] pb-10 md:grid-cols-[220px_minmax(0,840px)] md:items-end md:justify-between">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a4a32]">
            01 / Systems by Sankhya
          </p>
          <h2 className="text-balance font-bit text-[clamp(2.7rem,5vw,5.5rem)] leading-[0.94] tracking-[-0.02em]">
            Three layers. One compounding system.
          </h2>
        </div>

        <div className="grid border-x border-b border-[#c9c2b8] lg:grid-cols-3">
          {PRODUCTS.map((product, index) => (
            <article
              key={product.id}
              className="relative flex min-h-[370px] flex-col border-t border-[#c9c2b8] p-6 lg:border-t-0 lg:border-r lg:p-8 lg:last:border-r-0"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[11px] text-[#898178]">0{index + 1}</span>
                <span className={`border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.08em] ${STATUS_STYLES[product.status]}`}>
                  {PRODUCT_STATUS_LABELS[product.status]}
                </span>
              </div>

              <div className="mt-12">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.11em] text-[#8a837b]">
                  {product.role} · {product.qualifier}
                </p>
                <h3 className="mt-4 font-bit text-[42px] leading-none tracking-[-0.02em] md:text-[48px]">
                  {product.name}
                </h3>
                <p className="mt-5 max-w-sm text-[15px] leading-7 text-[#6e675f]">
                  {product.summary}
                </p>
              </div>

              <div className="mt-auto">
                <ProductLink product={product} />
              </div>
            </article>
          ))}
        </div>

        <div className="system-rail relative grid overflow-hidden bg-[#11100f] text-[#f6eadc] sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          {PRODUCTS.map((product, index) => (
            <div key={product.id} className="contents">
              <div className="flex min-h-28 items-center justify-between gap-4 border-b border-white/10 px-6 sm:border-b-0 sm:px-8">
                <span className="font-bit text-2xl md:text-3xl">{product.systemAction}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/36">{product.name}</span>
              </div>
              {index < PRODUCTS.length - 1 ? (
                <div className="hidden font-mono text-xl text-[#e4673e] sm:block">↔</div>
              ) : null}
            </div>
          ))}
          <span aria-hidden="true" className="system-signal absolute bottom-0 h-0.5 w-24 bg-[#f06a3d]" />
        </div>
      </div>
    </section>
  );
}
