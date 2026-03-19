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
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
