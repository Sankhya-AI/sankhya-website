export type LinkTarget = {
  label: string;
  href: string;
  external?: boolean;
};

export type SiteNavItem = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: LinkTarget;
  secondaryCta?: LinkTarget;
};

export type FeatureCard = {
  label?: string;
  title: string;
  description: string;
};

export type ProductShowcase = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  points: string[];
};

export type ModelCard = {
  name: string;
  role: string;
  description: string;
  status: string;
};

export type AudienceCard = {
  label: string;
  title: string;
  description: string;
  points: string[];
};

export type BrandToken = {
  name: string;
  value: string;
};
