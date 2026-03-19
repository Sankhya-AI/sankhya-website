import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  compact?: boolean;
  iconOnly?: boolean;
};

export function Brand({ compact = false, iconOnly = false }: BrandProps) {
  return (
    <Link href="/" className={`inline-flex items-center rounded-full ${iconOnly ? "gap-0" : "gap-3"}`}>
      <Image
        src="/brand/sankhya-logo.png"
        alt="Sankhya AI Labs"
        width={compact ? 34 : 46}
        height={compact ? 34 : 46}
        className="h-auto w-auto"
        priority
      />
      {!iconOnly ? (
        <div className="leading-tight">
          <div className="text-lg font-semibold tracking-tight text-[var(--ink)] md:text-xl">
            Sankhya AI Labs
          </div>
          {!compact ? (
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Building systems for how India learns
            </div>
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}
