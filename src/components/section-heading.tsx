type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-4xl space-y-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent)] sm:text-[0.72rem] sm:tracking-[0.34em]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  );
}
