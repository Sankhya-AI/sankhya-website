type ChotuOrbProps = {
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
};

export function ChotuOrb({ className = '', label = 'Chotu desktop icon', size = 'md', variant = 'light' }: ChotuOrbProps) {
  const src = variant === 'dark' ? '/assets/chotu-icon-dark.png' : '/assets/chotu-icon.png';

  return (
    <span className={`chotu-orb chotu-orb--${size} chotu-orb--${variant} ${className}`.trim()} role="img" aria-label={label}>
      <img className="chotu-orb__image" src={src} alt="" aria-hidden="true" />
    </span>
  );
}
