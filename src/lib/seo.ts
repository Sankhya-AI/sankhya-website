import type { BlogPost } from '../content/blog';

export type JsonLd = Record<string, unknown>;

export const SITE_URL = 'https://www.sankhyaailabs.com';
export const SITE_NAME = 'Sankhya AI Labs';
export const DEFAULT_TITLE =
  'Sankhya AI Labs - Infrastructure for Autonomous AI Agents';
export const DEFAULT_DESCRIPTION =
  'Chotu is an autonomous personal AI assistant that sees your screen, uses your laptop tools, remembers what you ask it to keep, and proves what changed before risky work is accepted.';
export const DEFAULT_IMAGE = '/assets/sankhya-memory-fabric-hero.png';
export const DEFAULT_IMAGE_ALT =
  'Sankhya AI Labs autonomous agent infrastructure';
export const DEFAULT_KEYWORDS = [
  'Chotu AI',
  'Sankhya AI Labs',
  'autonomous AI assistant',
  'personal AI assistant',
  'AI agent for laptop',
  'AI coding assistant',
  'agent memory',
  'Dhee memory',
  'Claude Codex assistant',
];

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function postUrl(post: BlogPost) {
  return absoluteUrl(`/blog/${post.slug}`);
}

export function postDateIso(post: BlogPost) {
  const parsed = new Date(post.date);

  if (Number.isNaN(parsed.getTime())) {
    return post.date;
  }

  return parsed.toISOString().slice(0, 10);
}

export function articleBody(post: BlogPost) {
  return post.sections
    .flatMap((section) => [section.title, ...section.body])
    .join('\n\n');
}

export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/favicon.png'),
    sameAs: ['https://github.com/Sankhya-AI/Dhee', 'https://x.com/ashish_dwi'],
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

export function softwareApplicationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Chotu',
    alternateName: 'Chotu AI Assistant',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'macOS, Windows',
    url: SITE_URL,
    image: absoluteUrl(DEFAULT_IMAGE),
    description: DEFAULT_DESCRIPTION,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Launch access starts with a free first month.',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl('/pricing'),
    },
    featureList: [
      'Sees the active screen and app context',
      'Uses browser, terminal, Claude, Codex, and local tools',
      'Remembers preferences and decisions through Dhee memory',
      'Asks approval before risky actions',
      'Shows diffs, checks, screenshots, and proof',
    ],
  };
}

export function blogIndexJsonLd(posts: BlogPost[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sankhya AI Labs Blog',
    description:
      'Essays from Sankhya AI Labs on Dhee, agent memory, context routing, portable cognition, and self-evolving AI systems.',
    url: absoluteUrl('/blog'),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.png'),
      },
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: postUrl(post),
      datePublished: postDateIso(post),
      author: {
        '@type': 'Person',
        name: post.author,
      },
    })),
  };
}

export function blogPostingJsonLd(post: BlogPost): JsonLd {
  const articleUrl = postUrl(post);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(DEFAULT_IMAGE)],
    datePublished: postDateIso(post),
    dateModified: postDateIso(post),
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://x.com/ashish_dwi',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.png'),
      },
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    articleBody: articleBody(post),
    url: articleUrl,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
