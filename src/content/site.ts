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
    // Named, not described: people arrive from a post that says "Model Kitchen"
    // and need to see that exact phrase to know they are in the right place.
    // "Sankhya Models" rides alongside as the family, so both names resolve.
    name: 'Model Kitchen',
    role: 'Sankhya Models',
    systemAction: 'Reason',
    status: 'early-access',
    qualifier: 'Build your own',
    summary:
      'Open-model APIs plus a stronger agent harness — reasoning, routing, and verification — so they punch above their weight.',
    href: ROUTES.models,
    external: false,
    actionLabel: 'Open the kitchen',
    tickerLabel: 'Model Kitchen · Build your own',
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

// Scenes are cut from the finished Chotu launch film (ChotuAI repo,
// `videos/chotu-premium-demo`, delivery render), one clip per beat — not raw screen
// captures. Timings come from that project's scene-manifest.json, so re-cutting after
// a re-render means reading the manifest, never eyeballing the timeline.
const filmAsset = (name: string, extension: 'mp4' | 'jpg') =>
  `/assets/chotu-demo/film/${name}.${extension}`;

export const CHOTU_DEMO_FILM = {
  status: 'in-production',
  title: 'Chotu in action',
  scenes: [
    {
      id: 'ask',
      labels: { home: 'Ask', product: 'Ask' },
      eyebrow: 'The request',
      title: 'Ask from the work in front of you.',
      description: 'One line in the composer — improve this homepage, make it feel like Chotu, run it locally.',
      videoSrc: filmAsset('ask', 'mp4'),
      posterSrc: filmAsset('ask', 'jpg'),
    },
    {
      id: 'build',
      labels: { home: 'Build', product: 'Build' },
      eyebrow: 'Workspace-bound coding',
      title: 'Build inside a workspace you choose.',
      description: 'Chotu maps what the local project is made of before it touches a single file.',
      videoSrc: filmAsset('workspace', 'mp4'),
      posterSrc: filmAsset('workspace', 'jpg'),
    },
    {
      id: 'act',
      labels: { home: 'Use the screen', product: 'Act' },
      eyebrow: 'Current-screen actions',
      title: 'Work with the interface already open.',
      description: 'Chotu takes its turn on the canvas you had open, in the app you were already using.',
      videoSrc: filmAsset('act', 'mp4'),
      posterSrc: filmAsset('act', 'jpg'),
    },
    {
      id: 'remember',
      labels: { home: 'Remember', product: 'Remember' },
      eyebrow: 'Dhee memory',
      title: 'Bring the right context forward.',
      description: 'Preferences, decisions, and proof stay available for the next task, held on your own Mac.',
      videoSrc: filmAsset('remember', 'mp4'),
      posterSrc: filmAsset('remember', 'jpg'),
    },
    {
      id: 'control',
      labels: { home: 'Stay in control', product: 'Stay in control' },
      eyebrow: 'Permission gates',
      title: 'Keep consequential actions visible.',
      description: 'Chotu asks before it points and draws on your screen, and stays inside the window you allow.',
      videoSrc: filmAsset('control', 'mp4'),
      posterSrc: filmAsset('control', 'jpg'),
    },
    {
      id: 'result',
      labels: { home: 'Result', product: 'Result' },
      eyebrow: 'Completed work',
      title: 'End with an inspectable result.',
      description: 'The page before and after, from one request — a real result you can open and check.',
      videoSrc: filmAsset('result', 'mp4'),
      posterSrc: filmAsset('result', 'jpg'),
    },
  ],
} as const satisfies DemoFilm;

export const HOME_DEMO_SCENE_IDS = ['build', 'act', 'remember'] as const satisfies readonly DemoScene['id'][];

// What a Sankhya model is made of. These four shapes, the powers, and the budget
// presets mirror the builder inside Chotu exactly — if the app gains a shape, it
// belongs here too, because this page is the promise the app has to keep.
export type ModelArchitecture = {
  id: 'think' | 'verify' | 'council' | 'adaptive';
  name: string;
  tagline: string;
  brains: string;
  bestFor: string;
  /** Rendered as a badge next to the name; null keeps the card clean. */
  badge: 'Default' | 'Sankhya edge' | null;
};

export const MODEL_ARCHITECTURES = [
  {
    id: 'think',
    name: 'Think',
    tagline: 'One strong brain, with lookup when the question needs it.',
    brains: 'Main',
    bestFor: 'Chat, teaching, everyday reasoning',
    badge: null,
  },
  {
    id: 'verify',
    name: 'Verify',
    tagline: 'Draft, then check and refine — only when checking earns it.',
    brains: 'Main + verifier',
    bestFor: 'Coding, math, fact-sensitive work',
    badge: 'Default',
  },
  {
    id: 'council',
    name: 'Council',
    tagline: 'Independent candidates, judged, then synthesised into one answer.',
    brains: 'Main + second opinion + final',
    bestFor: 'Hard reasoning and ideation',
    badge: null,
  },
  {
    id: 'adaptive',
    name: 'Adaptive',
    tagline: 'Propose, refine the best, select a winner — inside your budget.',
    brains: 'Main + challengers + critic + final',
    bestFor: 'Long-horizon and demanding work',
    badge: 'Sankhya edge',
  },
] as const satisfies readonly ModelArchitecture[];

export const MODEL_KITCHEN_STEPS = [
  ['01', 'Pick the brains', 'Choose models from the live catalogue for each role, or leave a role on auto and let the resolver fill it.'],
  ['02', 'Hand them powers', 'Attach the capabilities the work needs. Each one is a typed contract, not a prompt.'],
  ['03', 'Set the budget', 'Fast, Balanced, or Best. The policy caps calls, parallelism, spend, and deadline per turn.'],
  ['04', 'Get one model', 'Sankhya compiles a plan and gives you a single model id, versioned every time you change it.'],
] as const;

export const MODEL_POWERS = [
  ['Web', 'Search the live web mid-answer'],
  ['Web read', 'Fetch and read a specific page'],
  ['Documentation', 'Look up official docs before answering'],
  ['GitHub', 'Read repositories, issues, and code'],
  ['Stack Overflow', 'Pull known-good answers and caveats'],
  ['Run code', 'Execute code to check the claim'],
  ['Browser', 'Drive a page when reading is not enough'],
  ['Memory', 'Carry durable context in with Dhee'],
  ['Custom API', 'Bring an endpoint of your own'],
] as const;

export const MODEL_BUDGETS = [
  ['Fast', 'Tight caps. Answer first.'],
  ['Balanced', 'The default trade.'],
  ['Best', 'Spend where it pays.'],
] as const;

export const MODEL_RUNTIME = {
  baseUrl: 'http://127.0.0.1:8000/v1',
  idPrefix: 'mom/',
  exampleId: 'mom/deep-review',
  exampleVersionedId: 'mom/deep-review@7',
} as const;

type ModelProofContract = {
  comparison: 'The strongest single model on the same tasks';
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
  comparison: 'The strongest single model on the same tasks',
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
      'Sankhya AI Labs builds Dhee memory, the Chotu personal agent, and Model Kitchen — open-model APIs with a stronger agent harness, so they punch above their weight.',
    path: ROUTES.home,
    image: '/assets/sankhya-ghats-hero.png',
    imageAlt: 'Sankhya AI Labs building connected memory, agent, and model systems',
    keywords: ['Sankhya AI Labs', 'Dhee memory', 'Chotu AI', 'build your own AI model', 'model orchestration'],
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
    title: 'Model Kitchen — Open-model APIs with a stronger agent harness',
    description:
      'Model Kitchen combines open-model APIs with reasoning, routing, and verification so they punch above their weight. Your recipe compiles into one model id on an OpenAI-compatible endpoint that runs on your own machine — testable inside Chotu.',
    path: ROUTES.models,
    image: '/assets/sankhya-memory-fabric-hero.png',
    imageAlt: 'Sankhya Models — building a custom model from chosen models and capabilities',
    keywords: [
      'Sankhya Models',
      'build your own AI model',
      'custom model API',
      'model orchestration',
      'OpenAI-compatible endpoint',
      'local AI runtime',
    ],
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
      'Research and first-party notes from Sankhya AI Labs on memory, agents, model orchestration, and the systems behind our products.',
    path: ROUTES.research,
    image: '/assets/sankhya-memory-fabric-hero.png',
    imageAlt: 'Research and technical notes from Sankhya AI Labs',
    keywords: ['Sankhya AI Labs research', 'Dhee memory', 'agent memory', 'model orchestration'],
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
      { label: 'Model Kitchen', href: ROUTES.models },
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
