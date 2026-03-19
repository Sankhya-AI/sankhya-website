import type { AudienceCard, BrandToken, FeatureCard, HeroContent, ModelCard, ProductShowcase, SiteNavItem } from "@/types/site";

export const siteMeta = {
  name: "Sankhya AI Labs",
  shortName: "Sankhya",
  title: "Sankhya AI Labs",
  description:
    "Sankhya AI Labs builds memory, speech, and learning systems for Indian education. SensAI is our adaptive AI teacher for schools, coaching institutes, and learners.",
  url: "https://www.sankhyaailabs.com",
  locale: "en_IN",
  keywords: [
    "Sankhya AI Labs",
    "small AI models",
    "compact models",
    "India-first AI lab",
    "Dhee memory layer",
    "Akshar speech recognition",
    "Shlok speech generation",
    "SensAI",
    "AI research lab India",
    "task-specific AI",
    "offline AI models",
    "educational AI",
    "Indian language AI",
    "open source AI India",
  ],
};

export const brandTokens: BrandToken[] = [
  { name: "Accent", value: "#FF6B35" },
  { name: "Accent dark", value: "#D94F1F" },
  { name: "Paper", value: "#F8F1E7" },
  { name: "Ink", value: "#141827" },
  { name: "Stone", value: "#E8D9C4" },
];

export const contactMeta = {
  email: "hello@sensai.co.in",
};

export const navItems: SiteNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Models", href: "/models" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const homeHero: HeroContent = {
  eyebrow: "AI Teaching Stack for India",
  title: "We build the AI teaching stack for India.",
  description:
    "Sankhya builds memory, speech, and learning systems for Indian education. SensAI turns that stack into an adaptive AI teacher for schools, coaching institutes, and serious learners.",
  primaryCta: { label: "See SensAI", href: "/products" },
  secondaryCta: {
    label: "Explore the stack",
    href: "/models",
    external: false,
  },
};

export const homeStats = [
  { value: "1 live product", label: "SensAI is our adaptive AI teacher for schools, coaching institutes, and learners." },
  { value: "3 core systems", label: "Dhee memory, Akshar speech recognition, and Shlok voice generation shape the stack behind it." },
  { value: "India-first", label: "Designed for multilingual classrooms, mixed devices, weak connectivity, and real teaching workflows." },
];

export const labPhilosophy = [
  {
    title: "Small over large",
    description:
      "We build models under a few billion parameters. Small enough to run on constrained hardware, focused enough to do one thing exceptionally well.",
    icon: "◇",
  },
  {
    title: "Task-specific over general",
    description:
      "Every model we build solves a defined problem — remembering a learner, recognising Indian speech, generating instructional voice. Not everything at once.",
    icon: "◈",
  },
  {
    title: "Independent over dependent",
    description:
      "Our models are designed to run on their own — on-device, offline, or with minimal cloud. No vendor lock-in. No API dependency for core functions.",
    icon: "◉",
  },
];

export const stackLayers = [
  {
    label: "Dhee",
    tagline: "Learner memory layer",
    description:
      "An in-house memory system that lets teaching agents carry context, preferences, and understanding across sessions. Dhee makes real personalization possible — not just prompt-level memory, but structured recall over time.",
    state: "Live",
    highlight: true,
  },
  {
    label: "Akshar",
    tagline: "Speech recognition for India",
    description:
      "A speech-to-text stack being built for Indian accents, classroom noise, code-switching, and multilingual student interaction. Not a wrapper — a model trained on how India actually speaks.",
    state: "Coming Soon",
    highlight: false,
  },
  {
    label: "Shlok",
    tagline: "Instructional voice generation",
    description:
      "A text-to-speech model for natural, warm, Indian-language teaching voice. Built for the tone, cadence, and clarity that instructional speech demands — not generic assistant voice.",
    state: "Coming Soon",
    highlight: false,
  },
  {
    label: "Compact Runtime",
    tagline: "Edge deployment architecture",
    description:
      "A lightweight model architecture designed for low-end devices and poor-connectivity schools. The goal: the full Sankhya stack running independently, beyond cloud dependence.",
    state: "Coming Soon",
    highlight: false,
  },
];

export const productShowcases: ProductShowcase[] = [
  {
    eyebrow: "Create structured learning",
    title: "Turn a topic or resource into a course workflow",
    description:
      "SensAI can start from a topic prompt or uploaded material and shape it into a usable learning path instead of leaving the learner with a blank chat box.",
    image: "/showcase/app-create.png",
    alt: "SensAI course creation surface showing topic-based course generation.",
    points: [
      "Topic-led or resource-led course creation",
      "Better first step for teachers, coaching teams, and self-learners",
      "Transforms raw material into structured learning",
    ],
  },
  {
    eyebrow: "Organize the journey",
    title: "Convert subjects into guided sections and modules",
    description:
      "Course structure matters in both curriculum learning and exam preparation. SensAI helps package content into a format that feels teachable and revisable.",
    image: "/showcase/app-course.png",
    alt: "SensAI course view with modules for a UPSC history journey.",
    points: [
      "Curriculum or exam-prep friendly module breakdown",
      "Clean hierarchy for long-form subjects",
      "Lets learners return to structured progress instead of scattered files",
    ],
  },
  {
    eyebrow: "Study with support",
    title: "Blend notes, context, and AI help inside the same workspace",
    description:
      "SensAI keeps the learner close to the material while still enabling guided explanation, clarification, and teacher-style assistance.",
    image: "/showcase/app-learn.png",
    alt: "SensAI notes and chat workspace helping a learner understand highlighted content.",
    points: [
      "Notes and AI guidance stay connected",
      "Good for self-learning, revision, and doubt support",
      "Designed to feel like a study workflow, not just a chatbot",
    ],
  },
];

export const problemCards: FeatureCard[] = [
  {
    title: "Most AI products chase scale, not specificity",
    description:
      "The industry defaults to ever-larger models for ever-broader tasks. But most real-world problems — especially in education — need focused, reliable execution, not general intelligence.",
  },
  {
    title: "Generic models fail at Indian realities",
    description:
      "Indian accents, code-switching, regional languages, mixed devices, and weak connectivity are not edge cases. They are the baseline. Most global AI products treat them as afterthoughts.",
  },
  {
    title: "Cloud dependency limits who you can serve",
    description:
      "Always-on cloud assumptions break quickly in the environments that need AI the most — under-resourced classrooms, rural coaching centers, and low-bandwidth regions.",
  },
];

export const audienceCards: AudienceCard[] = [
  {
    label: "Institutions",
    title: "Schools and colleges",
    description:
      "Use SensAI as a self-learning and teacher-support layer that helps students continue beyond the classroom without replacing the teacher.",
    points: [
      "Curriculum-aligned modules and guided study",
      "Support for mixed learner pace and revision",
      "Useful where student strength varies across sections",
    ],
  },
  {
    label: "High-frequency prep",
    title: "Coaching institutes",
    description:
      "Use SensAI for competitive exam workflows like UPSC, JEE, and NEET, where learners need structure, repetition, and clearer explanations.",
    points: [
      "Structured exam-prep modules",
      "Doubt support and guided revision",
      "Scales teaching support across larger learner cohorts",
    ],
  },
  {
    label: "Direct learning",
    title: "Individual learners",
    description:
      "Use SensAI as a self-learning companion that can structure material, assist with notes, and help carry continuity across sessions.",
    points: [
      "Good for focused self-study and revision",
      "Works across subject learning and prep journeys",
      "More guided than a generic chat interface",
    ],
  },
];

export const modelCards: ModelCard[] = [
  {
    name: "Dhee",
    role: "Learner memory layer",
    description:
      "Dhee helps the teaching system remember how a learner has been taught, where they struggled, and what style worked better over time. Open-source on GitHub.",
    status: "Live",
  },
  {
    name: "Akshar",
    role: "Speech recognition",
    description:
      "Being built for Indian accents, classroom noise, code-switching, and the realities of spoken educational interaction. Not a wrapper around existing STT.",
    status: "Coming Soon",
  },
  {
    name: "Shlok",
    role: "Speech generation",
    description:
      "The voice layer being built for clear, natural instructional speech across Indian-language teaching scenarios. Warm, not robotic.",
    status: "Coming Soon",
  },
  {
    name: "Compact Runtime",
    role: "Edge deployment",
    description:
      "A lightweight model architecture so the Sankhya stack can eventually run on lower-end devices and in weak-connectivity environments — independently.",
    status: "Coming Soon",
  },
];

export const indiaFirstPoints = [
  {
    label: "Language",
    title: "Built for how India actually speaks",
    description:
      "Not just English-first with Indian language support bolted on. Our models are trained on Indian language patterns, accents, and code-switching from the ground up.",
  },
  {
    label: "Infrastructure",
    title: "Designed for low-connectivity",
    description:
      "Always-on cloud assumptions break quickly outside major cities. Our compact model direction accounts for weak bandwidth, intermittent connectivity, and low-end devices.",
  },
  {
    label: "Privacy",
    title: "Models that run where the data lives",
    description:
      "On-device and edge deployment isn't just a feature — it's a privacy architecture. Student data stays with the institution, not on someone else's cloud.",
  },
  {
    label: "Cost",
    title: "Lower inference cost by design",
    description:
      "Small, task-specific models cost less to run. That's not a tradeoff — smaller models that are good at one thing often outperform large, general-purpose models at that specific task.",
  },
];

/* ─── PRODUCTS PAGE ──────────────────────────────── */

export const productCapabilities: FeatureCard[] = [
  {
    title: "Structured course creation",
    description:
      "Start with a topic or resource and move toward a usable learning flow instead of isolated documents and disconnected chats.",
  },
  {
    title: "Module-based study journeys",
    description:
      "Organize subjects and exam-prep topics into sections and modules that feel closer to how teaching and revision actually happen.",
  },
  {
    title: "Notes with AI support",
    description:
      "Keep the learner inside the material while giving them ways to ask for help, clarification, and teacher-style explanation.",
  },
];

export const productUseCases: FeatureCard[] = [
  {
    label: "Institution layer",
    title: "Schools and colleges",
    description:
      "A self-learning layer that supports classroom teaching, revision, and continuity outside the lecture hour.",
  },
  {
    label: "Exam-prep layer",
    title: "Coaching institutes",
    description:
      "A structured support system for UPSC, JEE, and NEET journeys where high-frequency doubt handling and revision matter.",
  },
  {
    label: "Direct learner layer",
    title: "Self-learning product",
    description:
      "A product experience for serious learners who want structure, notes, and AI support without needing institution deployment.",
  },
];

/* ─── MODELS PAGE ──────────────────────────────── */

export const stackNotes: FeatureCard[] = [
  {
    label: "Today",
    title: "Ship with the right mix of in-house and external",
    description:
      "We use strong external APIs where they help us ship faster today — and replace the parts that matter most for quality, cost, privacy, and offline use with our own models over time.",
  },
  {
    label: "What we own",
    title: "Own the layers that define quality",
    description:
      "Memory, voice quality, multilingual robustness, and edge deployment are the layers most worth controlling in-house. These are what differentiate the product.",
  },
  {
    label: "What this unlocks",
    title: "Better AI at lower cost",
    description:
      "Small, focused models that we control means lower inference costs, better privacy, and the ability to deploy where connectivity is poor — the environments that need AI most.",
  },
];

export const modelApproach: FeatureCard[] = [
  {
    label: "Principle",
    title: "Build small. Build focused.",
    description:
      "Each model in the Sankhya stack is designed for a specific task and optimized to be as compact as possible. We believe small models that do one thing well are more useful than large models that do everything adequately.",
  },
  {
    label: "Strategy",
    title: "Replace external dependencies with owned models",
    description:
      "We take a pragmatic path: use strong third-party APIs where they help us ship today, and replace the parts that matter most for cost, privacy, control, multilingual quality, and offline deployment with our own stack over time.",
  },
  {
    label: "Direction",
    title: "Toward independent, on-device AI",
    description:
      "The end state is a stack of small models that can run independently — on-device, edge, or minimal cloud — serving learners and institutions without dependency on expensive GPU infrastructure or unreliable connectivity.",
  },
];

/* ─── ABOUT PAGE ──────────────────────────────── */

export const companyStory: FeatureCard[] = [
  {
    label: "Who we are",
    title: "An AI lab that builds and ships",
    description:
      "Sankhya is both a research lab and a product company. We build models, and we prove them through SensAI — our live teaching platform serving real learners and institutions.",
  },
  {
    label: "What we believe",
    title: "Small models can outperform large ones at specific tasks",
    description:
      "The industry's obsession with scale is not the only path. Task-specific, compact models — trained well, deployed efficiently — can deliver better results where it matters.",
  },
  {
    label: "Where we're going",
    title: "Independent AI for India's learning systems",
    description:
      "Our long-term direction is a full stack of small, owned models that can run independently — powering personalized teaching in every classroom, regardless of connectivity or infrastructure.",
  },
];

export const aboutPrinciples: FeatureCard[] = [
  {
    label: "Principle 1",
    title: "Build small, build focused",
    description:
      "We don't build models to be big. We build them to be good at a specific task — memory, speech recognition, voice generation, edge deployment.",
  },
  {
    label: "Principle 2",
    title: "India is the design constraint, not an afterthought",
    description:
      "Language diversity, classroom density, device variability, and connectivity gaps are core product inputs — not edge cases we'll handle later.",
  },
  {
    label: "Principle 3",
    title: "Prove it through product",
    description:
      "Every model we build is tested in SensAI with real learners. We don't publish benchmarks in isolation. We ship and measure in production.",
  },
  {
    label: "Principle 4",
    title: "Own what matters. Use what helps.",
    description:
      "We use external APIs where they help us move faster. We build our own models where quality, privacy, cost, and offline capability demand it.",
  },
];

/* ─── CONTACT PAGE ──────────────────────────────── */

export const contactCards: FeatureCard[] = [
  {
    label: "Deploy",
    title: "Institution pilots",
    description:
      "For schools, colleges, and coaching institutes exploring adaptive learning, guided revision, or AI teaching support through SensAI.",
  },
  {
    label: "Collaborate",
    title: "Research and model partnerships",
    description:
      "For teams interested in small model research, Indian-language AI, educational speech systems, or edge deployment approaches.",
  },
  {
    label: "Build with us",
    title: "Join the lab",
    description:
      "We're looking for people who care about building useful AI — small models, practical systems, and products that work in the real world.",
  },
];
