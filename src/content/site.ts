import type {
  AudienceCard,
  BrandToken,
  FeatureCard,
  HeroContent,
  ModelCard,
  ProductDirectoryItem,
  ProductShowcase,
  SiteNavItem,
} from "@/types/site";

export const siteMeta = {
  name: "Sankhya AI Labs",
  shortName: "Sankhya",
  title: "Sankhya AI Labs",
  description:
    "Sankhya AI Labs builds Dhee, a portable memory OS for coding agents.",
  url: "https://www.sankhyaailabs.com",
  locale: "en_IN",
  keywords: [
    "Sankhya AI Labs",
    "Dhee",
    "Memory OS for AGI cognition",
    "agent memory",
    "context routing",
    "self evolving agents",
    "multi agent collaboration",
    "coding agent memory",
    "portable agent memory",
    "AGI infrastructure",
    "cognitive infrastructure",
    "agent continuity",
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
  { label: "Dhee", href: "/products/dhee" },
  { label: "Systems", href: "/models" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const homeHero: HeroContent = {
  eyebrow: "Memory OS for coding agents",
  title: "Dhee gives coding agents memory that actually sticks.",
  description:
    "Portable memory, context routing, and shared state so agents stop replaying bloated history, resume real work, and collaborate without an orchestrator agent.",
  primaryCta: { label: "Explore Dhee", href: "/products/dhee" },
  secondaryCta: {
    label: "See the systems",
    href: "/models",
    external: false,
  },
};

export const homeStats = [
  {
    value: "Less junk in context",
    label:
      "Load what matters now, not the full transcript every time.",
  },
  {
    value: "Gets sharper with use",
    label:
      "Retrieval improves as agents expand, reuse, and hand off work.",
  },
  {
    value: "No boss agent needed",
    label:
      "Shared memory lets multiple agents coordinate directly.",
  },
];

export const labPhilosophy = [
  {
    title: "Models need cognitive infrastructure",
    description:
      "Better agents need more than a model. They need memory and state around the model.",
    icon: "◇",
  },
  {
    title: "Memory has to be owned",
    description:
      "If memory lives inside one provider session, it gets messy fast. Dhee keeps it portable.",
    icon: "◈",
  },
  {
    title: "Agents should evolve through use",
    description:
      "Dhee does not just store memory. It learns how to serve it better over time.",
    icon: "◉",
  },
];

export const stackLayers = [
  {
    label: "Memory substrate",
    tagline: "Durable state outside the model",
    description:
      "Tasks, artifacts, and decisions survive past a single run.",
    state: "Active",
    highlight: false,
  },
  {
    label: "Context router",
    tagline: "The right slice at the right time",
    description:
      "Dhee decides what the active agent should see now and what should stay compressed.",
    state: "Active",
    highlight: true,
  },
  {
    label: "Shared agent fabric",
    tagline: "Collaboration without an orchestrator",
    description:
      "Agents can hand off work through shared memory instead of a separate orchestrator.",
    state: "Active",
    highlight: false,
  },
];

export const productShowcases: ProductShowcase[] = [];

export const problemCards: FeatureCard[] = [
  {
    title: "Session memory is not ownership",
    description:
      "Most agent memory disappears the moment the session or provider changes.",
  },
  {
    title: "Raw history is not useful context",
    description:
      "Full transcript replay is noisy, expensive, and usually unnecessary.",
  },
  {
    title: "Orchestrator agents become bottlenecks",
    description:
      "A central planner adds overhead. Shared state scales better.",
  },
];

export const audienceCards: AudienceCard[] = [
  {
    label: "Coding agents",
    title: "Agents that need continuity",
    description:
      "For coding agents that need to resume work without rebuilding context.",
    points: [
      "Project facts, decisions, and artifacts stay recoverable",
      "Better resumes after interruptions or provider switches",
      "Long tasks stay coherent without giant transcripts",
    ],
  },
  {
    label: "Agent platforms",
    title: "Teams building runtimes",
    description:
      "For teams that want memory and context routing without a new framework.",
    points: [
      "Works through MCP, Python, CLI, and native integrations",
      "Lets you keep your existing agent surface",
      "Portable cognition layer across toolchains",
    ],
  },
  {
    label: "Multi-agent teams",
    title: "Workflows that outgrow central planning",
    description:
      "For multi-agent workflows that need shared memory instead of a boss agent.",
    points: [
      "Any agent can resume from shared context",
      "Artifacts and digests become coordination primitives",
      "Collaboration scales without one controller agent",
    ],
  },
];

export const modelCards: ModelCard[] = [
  {
    name: "Memory Graph",
    role: "Persistent cognition substrate",
    description:
      "Stores what matters across sessions: tasks, artifacts, preferences, digests, checkpoints, and evolving state that should survive beyond one model run.",
    status: "Active",
  },
  {
    name: "Context Router",
    role: "Selective context delivery",
    description:
      "Chooses the right slice of memory for the current task so agents work with useful state instead of drowning in transcript replay.",
    status: "Active",
  },
  {
    name: "Collaboration Fabric",
    role: "Shared continuity for multiple agents",
    description:
      "Lets coding agents coordinate through common memory and artifacts directly, removing the need for a separate orchestrator agent to control every step.",
    status: "Active",
  },
];

export const indiaFirstPoints = [
  {
    label: "Portability",
    title: "Built so the memory survives model churn",
    description:
      "Memory stays stable even when providers and shells keep changing.",
  },
  {
    label: "Efficiency",
    title: "Efficiency without gimmicks",
    description:
      "Better routing naturally means less wasted context.",
  },
  {
    label: "Evolution",
    title: "Use should sharpen the system",
    description:
      "Usage teaches Dhee what to retrieve next time.",
  },
];

export const productDirectory: ProductDirectoryItem[] = [
  {
    label: "Main product",
    name: "Dhee",
    description:
      "Portable memory, context routing, and shared state for coding agents.",
    href: "/products/dhee",
    ctaLabel: "See Dhee",
    status: "Active",
    points: [
      "Portable memory",
      "Smart context routing",
      "Direct agent collaboration",
    ],
  },
  {
    label: "Secondary product",
    name: "SensAI",
    description:
      "Our secondary edtech product for structured learning workflows.",
    href: "/products/sensai",
    ctaLabel: "See SensAI",
    status: "Secondary",
    points: [
      "Structured learning",
      "Guided study",
      "Secondary product",
    ],
  },
];

export const productCapabilities: FeatureCard[] = [
  {
    title: "Portable memory you actually own",
    description:
      "Memory stays outside the provider so it remains reusable.",
  },
  {
    title: "Live context routing",
    description:
      "The active agent gets the right slice of context, not the whole history.",
  },
  {
    title: "Self-evolving retrieval",
    description:
      "Retrieval improves as the system sees what gets used.",
  },
];

export const productUseCases: FeatureCard[] = [
  {
    label: "Resume",
    title: "Restart long tasks without restarting the agent",
    description:
      "Pick back up from prior state, decisions, and artifacts instead of spending each new session reconstructing what already happened.",
  },
  {
    label: "Collaborate",
    title: "Let multiple agents work through shared memory",
    description:
      "Artifacts, digests, and checkpoints become the handoff layer so agents can coordinate directly without a central orchestrator agent.",
  },
  {
    label: "Port",
    title: "Keep cognition stable while the model layer changes",
    description:
      "Move across providers, tools, and shells while the memory layer stays durable, portable, and reusable.",
  },
];

export const dheeCapabilities: FeatureCard[] = [
  {
    title: "Portable memory outside provider sessions",
    description:
      "Tasks, artifacts, and context live in a layer you own.",
  },
  {
    title: "Context routing instead of transcript replay",
    description:
      "Route only what matters instead of replaying the whole transcript.",
  },
  {
    title: "Self-evolving behavior through use",
    description:
      "Dhee adapts based on what agents actually expand, reuse, and trust.",
  },
];

export const dheeUseCases: FeatureCard[] = [
  {
    label: "Coding agents",
    title: "Give software agents durable working memory",
    description:
      "Keep project context alive across sessions, interruptions, and provider switches.",
  },
  {
    label: "Multi-agent execution",
    title: "Collaborate directly through shared state",
    description:
      "Agents can reuse digests, pass artifacts, and continue work through shared memory.",
  },
  {
    label: "AGI infrastructure",
    title: "Build the cognitive layer around the model",
    description:
      "Memory is the first layer of the cognitive infrastructure around the model.",
  },
];

export const stackNotes: FeatureCard[] = [
  {
    label: "Why now",
    title: "Model-native memory is not enough",
    description:
      "Closed session memory breaks as soon as the work gets long or the provider changes.",
  },
  {
    label: "What we build",
    title: "Infrastructure around the model, not another wrapper",
    description:
      "We focus on memory, routing, and shared continuity around the model.",
  },
  {
    label: "Where it leads",
    title: "Self-evolving agents with stable context",
    description:
      "As the substrate improves, agents get better at resuming, coordinating, and adapting.",
  },
];

export const modelApproach: FeatureCard[] = [
  {
    label: "Principle",
    title: "Own the cognitive layer",
    description:
      "The differentiator is the memory and routing layer around the model.",
  },
  {
    label: "Strategy",
    title: "Route context instead of replaying everything",
    description:
      "Useful cognition comes from selecting the right memory for the task.",
  },
  {
    label: "Direction",
    title: "Remove the orchestrator bottleneck",
    description:
      "Any coding agent should be able to collaborate through shared memory.",
  },
];

export const companyStory: FeatureCard[] = [
  {
    label: "Who we are",
    title: "A product lab focused on agent cognition",
    description:
      "Sankhya AI Labs builds Dhee as the main product. SensAI is secondary.",
  },
  {
    label: "What we believe",
    title: "AGI needs memory, routing, and continuity",
    description:
      "Stronger models alone are not enough. The real jump comes from owned cognitive infrastructure.",
  },
  {
    label: "Where we are going",
    title: "Toward self-evolving agents without central orchestration",
    description:
      "We are building toward agents that remember, collaborate, and improve through shared memory.",
  },
];

export const aboutPrinciples: FeatureCard[] = [
  {
    label: "Principle 1",
    title: "Memory first",
    description:
      "If an agent cannot hold state across time, it cannot be reliable.",
  },
  {
    label: "Principle 2",
    title: "Context should be routed, not dumped",
    description:
      "Better agents need the right slice of state, not the biggest transcript.",
  },
  {
    label: "Principle 3",
    title: "Use should improve the substrate",
    description:
      "The substrate should learn from retrievals, expansions, and handoffs.",
  },
  {
    label: "Principle 4",
    title: "Collaboration should emerge from shared state",
    description:
      "Agents should coordinate through shared state, not a central orchestrator.",
  },
];

export const contactCards: FeatureCard[] = [
  {
    label: "Deploy",
    title: "Put Dhee under your agent stack",
    description:
      "For teams that want portable memory and context routing under their agents.",
  },
  {
    label: "Partner",
    title: "Build on the substrate with us",
    description:
      "For runtime builders and infra teams exploring agent memory and collaboration.",
  },
  {
    label: "Secondary",
    title: "Ask about SensAI",
    description:
      "For teams interested in our secondary edtech product.",
  },
];
