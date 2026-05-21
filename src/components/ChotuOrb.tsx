type ChotuOrbProps = {
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function ChotuOrb({ className = '', label = 'Chotu desktop icon', size = 'md' }: ChotuOrbProps) {
  return (
    <span className={`chotu-orb chotu-orb--${size} ${className}`.trim()} role="img" aria-label={label}>
      <span className="chotu-orb__rim" />
      <span className="chotu-orb__visor" />
      <span className="chotu-orb__eye chotu-orb__eye--left" />
      <span className="chotu-orb__eye chotu-orb__eye--right" />
    </span>
  );
}
