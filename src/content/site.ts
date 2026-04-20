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
    "Sankhya AI Labs is building Dhee, a portable memory OS that turns any coding agent into a personalized, self-evolving collaborator.",
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
  eyebrow: "Main product: Dhee",
  title:
    "Building Dhee, a portable memory OS that turns any coding agent into a personalized, self-evolving collaborator.",
  description:
    "We believe AGI will not come from one god model. It will come from models plus cognitive infrastructure around them. Dhee is that memory layer: it routes the right context at the right moment, improves through use, and lets multiple agents collaborate through shared memory instead of a central orchestrator.",
  primaryCta: { label: "Explore Dhee", href: "/products/dhee" },
  secondaryCta: {
    label: "See the systems",
    href: "/models",
    external: false,
  },
};

export const homeStats = [
  {
    value: "Stop replaying everything",
    label:
      "Dhee makes agents more efficient by routing only the relevant context instead of restuffing full history, rules, and tool output into every turn.",
  },
  {
    value: "Get better through use",
    label:
      "As agents expand, reuse, reject, or rely on memory, Dhee adapts its routing and retrieval behavior so the system becomes more useful over time.",
  },
  {
    value: "Collaborate without orchestration tax",
    label:
      "Shared memory, artifacts, and task state let multiple agents coordinate directly without needing another agent whose only job is orchestration.",
  },
];

export const labPhilosophy = [
  {
    title: "Models need cognitive infrastructure",
    description:
      "AGI will not come from a single god model. It will come from models combined with cognitive infrastructure around them, and memory is the first layer.",
    icon: "◇",
  },
  {
    title: "Memory has to be owned",
    description:
      "If memory lives inside one session or one provider, you do not really own it. Dhee keeps memory portable as models, tools, and context windows keep changing.",
    icon: "◈",
  },
  {
    title: "Agents should evolve through use",
    description:
      "Dhee does not just store memory. It learns how to serve memory better over time. That is the difference between replaying context and building cognition.",
    icon: "◉",
  },
];

export const stackLayers = [
  {
    label: "Memory substrate",
    tagline: "Durable state outside the model",
    description:
      "Dhee preserves tasks, artifacts, preferences, decisions, and resumable state so agents do not have to rebuild working context every time a session restarts.",
    state: "Active",
    highlight: false,
  },
  {
    label: "Context router",
    tagline: "The right slice at the right time",
    description:
      "Instead of flooding the model with bloated history, Dhee decides what matters now, what should stay compressed, and what can remain in the background until it becomes useful.",
    state: "Active",
    highlight: true,
  },
  {
    label: "Shared agent fabric",
    tagline: "Collaboration without an orchestrator",
    description:
      "Multiple coding agents can hand off artifacts, reuse digests, and continue work through shared memory directly. Coordination becomes a property of the substrate, not a separate orchestrator agent.",
    state: "Active",
    highlight: false,
  },
];

export const productShowcases: ProductShowcase[] = [];

export const problemCards: FeatureCard[] = [
  {
    title: "Session memory is not ownership",
    description:
      "Most agent products remember only inside their own session boundaries. The moment the provider, toolchain, or window changes, your history and skills start getting messy or lost.",
  },
  {
    title: "Raw history is not useful context",
    description:
      "Developers are burning tokens on repeated history, rules, and noisy tool output that should never have been replayed in full. Context needs routing, compression, and selective expansion.",
  },
  {
    title: "Orchestrator agents become bottlenecks",
    description:
      "Most multi-agent systems add another agent whose job is orchestration. We think that is the wrong abstraction. Real coordination should emerge from shared state.",
  },
];

export const audienceCards: AudienceCard[] = [
  {
    label: "Coding agents",
    title: "Agents that need continuity",
    description:
      "Use Dhee under coding agents that need to resume long tasks, retain project state, and stop wasting context on repeated setup and full-history replay.",
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
      "Embed Dhee when you want memory, context routing, and collaboration primitives without rebuilding your stack around a separate orchestrator framework.",
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
      "Use shared memory, artifacts, and handoffs so multiple agents can coordinate directly while still keeping durable state and accountability.",
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
      "Providers, context windows, and agent shells change fast. Dhee is designed so the cognitive layer remains stable while the model layer keeps moving.",
  },
  {
    label: "Efficiency",
    title: "Efficiency without gimmicks",
    description:
      "Token efficiency shows up naturally when the right context is loaded at the right time. The goal is not forced saving tricks. The goal is better cognition.",
  },
  {
    label: "Evolution",
    title: "Use should sharpen the system",
    description:
      "Every retrieval pattern teaches Dhee something about what future agents will need. That makes the substrate better the more real work it sees.",
  },
];

export const productDirectory: ProductDirectoryItem[] = [
  {
    label: "Main product",
    name: "Dhee",
    description:
      "Dhee is a portable memory OS for AI agents. It gives coding agents a persistent, portable cognition layer that routes the right context, adapts from usage, and enables collaboration through shared memory instead of a separate orchestrator.",
    href: "/products/dhee",
    ctaLabel: "See Dhee",
    status: "Active",
    points: [
      "Portable memory outside provider sessions",
      "Context routing instead of full-history replay",
      "Shared memory for direct multi-agent collaboration",
    ],
  },
  {
    label: "Secondary product",
    name: "SensAI",
    description:
      "SensAI is our edtech product. It applies Sankhya's workflow thinking to structured learning and guided study, but it is secondary to our main product focus on Dhee.",
    href: "/products/sensai",
    ctaLabel: "See SensAI",
    status: "Secondary",
    points: [
      "Structured learning workflows",
      "Guided study and revision support",
      "Secondary product line inside Sankhya AI Labs",
    ],
  },
];

export const productCapabilities: FeatureCard[] = [
  {
    title: "Portable memory you actually own",
    description:
      "Dhee keeps long-term memory outside the provider so context, artifacts, and learned behavior remain reusable as models and tools change.",
  },
  {
    title: "Live context routing",
    description:
      "Instead of replaying everything, Dhee decides what the active agent should see now, what should stay compressed, and what can stay dormant.",
  },
  {
    title: "Self-evolving retrieval",
    description:
      "The system watches what gets expanded, reused, and handed off, then sharpens future retrieval so the cognitive layer improves through real work.",
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
      "Dhee preserves tasks, artifacts, skills, and context in a layer you own, so the memory remains clean even as models and tools keep evolving.",
  },
  {
    title: "Context routing instead of transcript replay",
    description:
      "Dhee makes agents more efficient by routing the right context at the right moment instead of repeatedly stuffing full history, rules, and tool outputs into every turn.",
  },
  {
    title: "Self-evolving behavior through use",
    description:
      "As agents expand, reuse, reject, or rely on certain context, Dhee adapts its routing and retrieval behavior so the system improves with use.",
  },
];

export const dheeUseCases: FeatureCard[] = [
  {
    label: "Coding agents",
    title: "Give software agents durable working memory",
    description:
      "Use Dhee under Codex, Claude Code, Cursor, or custom runtimes so project context survives across sessions, interruptions, and provider switches.",
  },
  {
    label: "Multi-agent execution",
    title: "Collaborate directly through shared state",
    description:
      "Most multi-agent systems add another agent whose job is orchestration. With Dhee, agents can reuse digests, pass artifacts, and continue shared tasks directly through shared memory.",
  },
  {
    label: "AGI infrastructure",
    title: "Build the cognitive layer around the model",
    description:
      "Dhee is designed for the belief that the future is not one giant model doing everything. The future is models plus cognitive infrastructure, and memory is the foundation.",
  },
];

export const stackNotes: FeatureCard[] = [
  {
    label: "Why now",
    title: "Model-native memory is not enough",
    description:
      "Closed session memory feels useful until the provider changes, the task gets long, or the same developer has to restuff context yet again. The missing layer is owned cognition that survives those shifts.",
  },
  {
    label: "What we build",
    title: "Infrastructure around the model, not another wrapper",
    description:
      "We focus on memory, routing, and shared continuity because those are the systems that let strong models behave like durable agents instead of short-lived chats.",
  },
  {
    label: "Where it leads",
    title: "Self-evolving agents with stable context",
    description:
      "As the substrate improves through use, agents become better at resuming, coordinating, and adapting over time. That is the path we care about.",
  },
];

export const modelApproach: FeatureCard[] = [
  {
    label: "Principle",
    title: "Own the cognitive layer",
    description:
      "We assume model providers will keep improving. The differentiator is the state and routing layer around them, which should not belong to any one provider.",
  },
  {
    label: "Strategy",
    title: "Route context instead of replaying everything",
    description:
      "Useful cognition comes from selecting the right memory for the current task, not from stuffing the model with as much history as possible.",
  },
  {
    label: "Direction",
    title: "Remove the orchestrator bottleneck",
    description:
      "We want any coding agent touching Dhee to become a self-evolving agent, able to collaborate through shared memory without a central controller agent.",
  },
];

export const companyStory: FeatureCard[] = [
  {
    label: "Who we are",
    title: "A product lab focused on agent cognition",
    description:
      "Sankhya AI Labs is building Dhee as the main product and using real software workflows to shape what a memory system for agents should actually do. SensAI remains a secondary edtech product.",
  },
  {
    label: "What we believe",
    title: "AGI needs memory, routing, and continuity",
    description:
      "Our core bet is simple: stronger models alone will not be enough. The real jump comes when models sit on top of owned cognitive infrastructure.",
  },
  {
    label: "Where we are going",
    title: "Toward self-evolving agents without central orchestration",
    description:
      "We are building for a future where agents remember, collaborate, and get sharper over time through shared memory instead of relying on one planner agent to hold everything together.",
  },
];

export const aboutPrinciples: FeatureCard[] = [
  {
    label: "Principle 1",
    title: "Memory first",
    description:
      "If an agent cannot hold durable state across time, it cannot become reliable on real work. Memory is the first system we care about.",
  },
  {
    label: "Principle 2",
    title: "Context should be routed, not dumped",
    description:
      "Better agents need the right slice of state, not the biggest transcript. Routing matters more than brute-force replay.",
  },
  {
    label: "Principle 3",
    title: "Use should improve the substrate",
    description:
      "A cognitive layer should learn from retrievals, expansions, and handoffs so future work gets cleaner without constant manual tuning.",
  },
  {
    label: "Principle 4",
    title: "Collaboration should emerge from shared state",
    description:
      "We want agents to coordinate through the memory layer itself. That keeps multi-agent work flexible and removes the central orchestrator bottleneck.",
  },
];

export const contactCards: FeatureCard[] = [
  {
    label: "Deploy",
    title: "Put Dhee under your agent stack",
    description:
      "For teams that want portable memory, context routing, and shared continuity under coding agents or internal runtimes.",
  },
  {
    label: "Partner",
    title: "Build on the substrate with us",
    description:
      "For runtime builders, infra teams, and product teams exploring agent collaboration, provider portability, or long-task continuity.",
  },
  {
    label: "Secondary",
    title: "Ask about SensAI",
    description:
      "For schools, educators, or product teams interested in our secondary edtech product while Dhee remains the main company focus.",
  },
];
