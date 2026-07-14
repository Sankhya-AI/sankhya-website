import type { PixelDitherProps } from '@/components/PixelDither';

export const ROUTES = {
  home: '/',
  chotu: '/chotu',
  models: '/models',
  pricing: '/pricing',
  research: '/blog',
  account: '/account',
  privacy: '/privacy',
  company: '/#company',
  systems: '/#systems',
} as const;

export const EXTERNAL_ROUTES = {
  dhee: 'https://dhee.sankhyaailabs.com',
  dheeGithub: 'https://github.com/Sankhya-AI/dhee',
  email: 'mailto:hello@sankhyaailabs.com',
} as const;

export type ProductStatus = 'available' | 'early-access' | 'coming-soon';

export const PRODUCT_STATUS_LABELS = {
  available: 'Available',
  'early-access': 'Early access',
  'coming-soon': 'Coming soon',
} as const satisfies Record<ProductStatus, string>;

export type ProductDefinition = {
  id: 'dhee' | 'chotu' | 'models';
  name: string;
  role: string;
  systemAction: 'Remember' | 'Act' | 'Reason';
  status: ProductStatus;
  qualifier: string;
  summary: string;
  href: string;
  external: boolean;
  actionLabel: string;
  tickerLabel: string;
};

export const PRODUCTS = [
  {
    id: 'dhee',
    name: 'Dhee',
    role: 'Memory layer',
    systemAction: 'Remember',
    status: 'available',
    qualifier: 'Open source',
    summary:
      'The memory runtime that gives agents the right context before, during, and after work.',
    href: EXTERNAL_ROUTES.dhee,
    external: true,
    actionLabel: 'Explore Dhee',
    tickerLabel: 'Dhee · Open source',
  },
  {
    id: 'chotu',
    name: 'Chotu',
    role: 'Personal agent',
    systemAction: 'Act',
    status: 'early-access',
    qualifier: 'Mac (Apple silicon)',
    summary: 'A local-first personal AI for the work already on your screen.',
    href: ROUTES.chotu,
    external: false,
    actionLabel: 'Meet Chotu',
    tickerLabel: 'Chotu · Early access for Mac',
  },
  {
    id: 'models',
    name: 'Sankhya Models',
    role: 'Mixture of agents',
    systemAction: 'Reason',
    status: 'coming-soon',
    qualifier: 'Thinking + Deep',
    summary: 'Collective intelligence behind one model API.',
    href: ROUTES.models,
    external: false,
    actionLabel: 'See the methodology',
    tickerLabel: 'Sankhya Models · Coming soon',
  },
] as const satisfies readonly ProductDefinition[];

export type DemoScene = {
  id: 'ask' | 'build' | 'act' | 'remember' | 'control' | 'result';
  labels: {
    home: string;
    product: string;
  };
  eyebrow: string;
  title: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
};

type DemoFilmBase = {
  title: string;
  scenes: readonly DemoScene[];
};

export type DemoFilm =
  | (DemoFilmBase & {
      status: 'in-production';
      fullVideo?: never;
    })
  | (DemoFilmBase & {
      status: 'published';
      fullVideo: {
        src: string;
        poster: string;
        label: string;
      };
    });

const demoAsset = (name: string, extension: 'mp4' | 'webp') =>
  `/assets/chotu-demo/${name}.${extension}`;

export const CHOTU_DEMO_FILM = {
  status: 'in-production',
  title: 'Chotu in action',
  scenes: [
    {
      id: 'ask',
      labels: { home: 'Ask', product: 'Ask' },
      eyebrow: 'Research',
      title: 'Ask from the work in front of you.',
      description: 'Chotu can investigate a question and return a useful answer inside the same desktop flow.',
      videoSrc: demoAsset('ask', 'mp4'),
      posterSrc: demoAsset('ask', 'webp'),
    },
    {
      id: 'build',
      labels: { home: 'Build', product: 'Build' },
      eyebrow: 'Workspace-bound coding',
      title: 'Build inside a workspace you choose.',
      description: 'Scope Chotu to a repo, ask for a change, and keep the run attached to the files that matter.',
      videoSrc: demoAsset('build', 'mp4'),
      posterSrc: demoAsset('build', 'webp'),
    },
    {
      id: 'act',
      labels: { home: 'Use the screen', product: 'Act' },
      eyebrow: 'Current-screen actions',
      title: 'Work with the interface already open.',
      description: 'Chotu can understand the current screen and operate visible tools for the task you requested.',
      videoSrc: demoAsset('screen', 'mp4'),
      posterSrc: demoAsset('screen', 'webp'),
    },
    {
      id: 'remember',
      labels: { home: 'Remember', product: 'Remember' },
      eyebrow: 'Dhee memory',
      title: 'Bring the right context forward.',
      description: 'Dhee keeps durable decisions and preferences available without replaying every old conversation.',
      videoSrc: demoAsset('remember', 'mp4'),
      posterSrc: demoAsset('remember', 'webp'),
    },
    {
      id: 'control',
      labels: { home: 'Stay in control', product: 'Stay in control' },
      eyebrow: 'Permission gates',
      title: 'Keep consequential actions visible.',
      description: 'Notifications and approval gates keep you present when a task reaches a sensitive boundary.',
      videoSrc: demoAsset('control', 'mp4'),
      posterSrc: demoAsset('control', 'webp'),
    },
    {
      id: 'result',
      labels: { home: 'Result', product: 'Result' },
      eyebrow: 'Completed work',
      title: 'End with an inspectable result.',
      description: 'The completed task returns to the same workspace so you can review what happened.',
      videoSrc: demoAsset('result', 'mp4'),
      posterSrc: demoAsset('result', 'webp'),
    },
  ],
} as const satisfies DemoFilm;

export const HOME_DEMO_SCENE_IDS = ['build', 'act', 'remember'] as const satisfies readonly DemoScene['id'][];

type ModelProofContract = {
  competitors: readonly ['Fugu', 'Fable'];
  taskPolicy: 'Identical frozen tasks';
  minimumSampleSize: 50;
  primaryMetric: 'Cost per solved task';
  publicationPolicy: 'Publish wins and losses';
};

export type ModelProof =
  | (ModelProofContract & {
      status: 'benchmarking';
      performanceHeadline?: never;
      reportUrl?: never;
      evaluationDate?: never;
      sampleSize?: never;
      qualityResult?: never;
      costPerSolvedResult?: never;
    })
  | (ModelProofContract & {
      status: 'verified';
      performanceHeadline: string;
      reportUrl: string;
      evaluationDate: string;
      sampleSize: number;
      qualityResult: string;
      costPerSolvedResult: string;
    });

export const SANKHYA_MODEL_PROOF = {
  status: 'benchmarking',
  competitors: ['Fugu', 'Fable'],
  taskPolicy: 'Identical frozen tasks',
  minimumSampleSize: 50,
  primaryMetric: 'Cost per solved task',
  publicationPolicy: 'Publish wins and losses',
} as const satisfies ModelProof;

export type RouteSeo = {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
  keywords: readonly string[];
  robots?: string;
};

export const ROUTE_SEO = {
  home: {
    title: 'Sankhya AI Labs — AI systems that remember, act, and reason',
    description:
      'Sankhya AI Labs builds Dhee memory, the Chotu personal agent, and upcoming mixture-of-agents models that make intelligence compound.',
    path: ROUTES.home,
    image: '/assets/sankhya-ghats-hero.png',
    imageAlt: 'Sankhya AI Labs building connected memory, agent, and model systems',
    keywords: ['Sankhya AI Labs', 'Dhee memory', 'Chotu AI', 'mixture of agents', 'collective intelligence'],
  },
  chotu: {
    title: 'Chotu — Your computer, finally personal',
    description:
      'Chotu is a local-first personal AI for Mac that can research, code inside chosen workspaces, use the current screen, remember with Dhee, and ask before sensitive actions.',
    path: ROUTES.chotu,
    image: '/assets/chotu-demo/chotu-og.jpg',
    imageAlt: 'Chotu working inside a desktop coding workspace',
    keywords: ['Chotu', 'personal AI for Mac', 'local-first AI assistant', 'Dhee memory', 'desktop agent'],
  },
  models: {
    title: 'Sankhya Models — Collective intelligence, exposed as a model',
    description:
      'Sankhya Thinking and Deep are upcoming mixture-of-agents models, evaluated on frozen paired tasks with cost per solved task.',
    path: ROUTES.models,
    image: '/assets/sankhya-memory-fabric-hero.png',
    imageAlt: 'Sankhya Models collective intelligence system',
    keywords: ['Sankhya Models', 'mixture of agents', 'collective intelligence', 'AI model API'],
  },
  pricing: {
    title: 'Chotu Early Access for Mac — Sankhya AI Labs',
    description:
      'Get Chotu early access for Apple silicon Macs. Choose managed OpenRouter access or bring your own model key, then download from your account.',
    path: ROUTES.pricing,
    image: '/assets/chotu-demo/chotu-og.jpg',
    imageAlt: 'Chotu early access for Apple silicon Macs',
    keywords: ['Chotu early access', 'Chotu pricing', 'personal AI for Mac', 'desktop AI assistant'],
  },
  research: {
    title: 'Research & Notes — Sankhya AI Labs',
    description:
      'Research and first-party notes from Sankhya AI Labs on memory, agents, collective intelligence, and the systems behind our products.',
    path: ROUTES.research,
    image: '/assets/sankhya-memory-fabric-hero.png',
    imageAlt: 'Research and technical notes from Sankhya AI Labs',
    keywords: ['Sankhya AI Labs research', 'Dhee memory', 'agent memory', 'collective intelligence'],
  },
  privacy: {
    title: 'Privacy Policy — Sankhya AI Labs',
    description:
      'How Sankhya AI Labs and Chotu handle account, desktop, voice, memory, and Browser Hands data.',
    path: ROUTES.privacy,
    image: '/assets/sankhya-memory-fabric-hero.png',
    imageAlt: 'Sankhya AI Labs privacy policy',
    keywords: ['Sankhya AI Labs privacy', 'Chotu privacy', 'Chotu Browser Hands privacy'],
  },
  account: {
    title: 'Account — Sankhya AI Labs',
    description:
      'Private Sankhya AI Labs account dashboard for Chotu downloads, plan state, and billing access.',
    path: ROUTES.account,
    image: '/assets/chotu-demo/chotu-og.jpg',
    imageAlt: 'Sankhya AI Labs account',
    keywords: ['Sankhya AI Labs account', 'Chotu account'],
    robots: 'noindex, nofollow',
  },
} as const satisfies Record<'home' | 'chotu' | 'models' | 'pricing' | 'research' | 'privacy' | 'account', RouteSeo>;

export const PRIMARY_NAV = [
  { label: 'Products', kind: 'products' },
  { label: 'Research', kind: 'link', href: ROUTES.research },
  { label: 'Company', kind: 'link', href: ROUTES.company },
  { label: 'Account', kind: 'link', href: ROUTES.account },
] as const;

export const FOOTER_GROUPS = [
  {
    label: 'Products',
    links: [
      { label: 'Dhee', href: EXTERNAL_ROUTES.dhee },
      { label: 'Chotu', href: ROUTES.chotu },
      { label: 'Sankhya Models', href: ROUTES.models },
    ],
  },
  {
    label: 'Research',
    links: [
      { label: 'Research & Notes', href: ROUTES.research },
      { label: 'Dhee on GitHub', href: EXTERNAL_ROUTES.dheeGithub },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'About Sankhya', href: ROUTES.company },
      { label: 'Contact', href: EXTERNAL_ROUTES.email },
    ],
  },
  {
    label: 'Legal',
    links: [{ label: 'Privacy Policy', href: ROUTES.privacy }],
  },
] as const;

export type DitherPreset = Omit<PixelDitherProps, 'className'>;

export const DITHER_PRESETS = {
  hero: {
    fillColor: 'var(--bg-cream)',
    pattern: 'noise',
    seed: 11,
    direction: 'bottom-up',
    startWeight: 0.02,
    erosionWeight: 0.62,
    pixelSize: 18,
  },
  section: {
    fillColor: 'var(--bg-dark)',
    pattern: 'bayer',
    seed: 7,
    direction: 'bottom-right',
    startWeight: -0.1,
    erosionWeight: 0.7,
    pixelSize: 16,
  },
  footer: {
    fillColor: 'var(--bg-dark)',
    pattern: 'noise',
    seed: 11,
    direction: 'bottom-up',
    startWeight: 0.05,
    erosionWeight: 0.62,
    pixelSize: 18,
  },
} as const satisfies Record<'hero' | 'section' | 'footer', DitherPreset>;
