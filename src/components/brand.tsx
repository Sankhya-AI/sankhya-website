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
        <div className="text-lg font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-xl">
          Sankhya AI Labs
        </div>
      ) : null}
    </Link>
  );
}
