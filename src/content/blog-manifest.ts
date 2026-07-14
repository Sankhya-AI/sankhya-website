export type BlogLink = {
  label: string;
  url: string;
};

export type BlogPostPreview = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  publishedOn: string;
  readTime: string;
  author: string;
  tags: readonly string[];
  xUrl?: string;
  links?: readonly BlogLink[];
  heroLabel: string;
};

export const BLOG_PREVIEWS = {
  thinHarness: {
    slug: 'thin-harness-fat-skills-context-hell',
    category: 'Agent Infrastructure',
    title: 'Thin Harness, Fat Skills, and the Coming Context Hell',
    excerpt:
      'Fat skills compound, but unmanaged context becomes baggage. Dhee turns repo memory into a portable cognition layer that routes, compresses, forgets, and learns from use.',
    date: 'April 20, 2026',
    publishedOn: '2026-04-20',
    readTime: '14 min read',
    author: 'Ashish Dwivedi',
    tags: ['Dhee', 'DheeFS', 'context routing', 'agent memory'],
    xUrl: 'https://x.com/ashish_dwi/status/2046213227898687678',
    heroLabel: 'DHEEFS',
  },
  hyperAgent: {
    slug: 'cognition-layer-turns-any-ai-agent-into-hyperagent',
    category: 'Agent Cognition',
    title: "I Built a Cognition Layer That Turns Any AI Agent Into a HyperAgent. Here's How",
    excerpt:
      'Memory is not enough if every session still feels new. Dhee adds Buddhi: insights, intentions, performance trends, warnings, and four simple API calls for continuity.',
    date: 'March 27, 2026',
    publishedOn: '2026-03-27',
    readTime: '12 min read',
    author: 'Ashish Dwivedi',
    tags: ['Buddhi', 'HyperAgent', 'Dhee', 'agent cognition'],
    xUrl: 'https://x.com/ashish_dwi/status/2037460448405336147',
    heroLabel: 'BUDDHI',
  },
  amnesia: {
    slug: 'every-ai-agent-has-amnesia-i-fixed-it',
    category: 'Memory Systems',
    title: 'Every AI Agent You Use Has Amnesia. I Have Fixed It.',
    excerpt:
      'The origin story of Engram: shared handoffs, decay, staged memory writes, episodic scenes, EchoMem, and local-first memory for agents that stop starting from zero.',
    date: 'February 10, 2026',
    publishedOn: '2026-02-10',
    readTime: '13 min read',
    author: 'Ashish Dwivedi',
    tags: ['Engram', 'agent memory', 'handoffs', 'episodic memory'],
    heroLabel: 'ENGRAM',
    links: [
      { label: 'Engram GitHub', url: 'https://github.com/Ashish-dwi99/Engram' },
      { label: 'Engram website', url: 'https://engram.sensai.co.in/' },
    ],
  },
} as const satisfies Record<string, BlogPostPreview>;

export const blogPreviews = Object.values(BLOG_PREVIEWS);
