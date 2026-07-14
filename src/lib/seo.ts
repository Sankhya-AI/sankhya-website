import type { BlogPost } from '../content/blog';
import { ROUTE_SEO, ROUTES } from '../content/site';

export type JsonLd = Record<string, unknown>;

export const SITE_URL = 'https://www.sankhyaailabs.com';
export const SITE_NAME = 'Sankhya AI Labs';
export const DEFAULT_TITLE = ROUTE_SEO.home.title;
export const DEFAULT_DESCRIPTION = ROUTE_SEO.home.description;
export const DEFAULT_IMAGE = ROUTE_SEO.home.image;
export const DEFAULT_IMAGE_ALT = ROUTE_SEO.home.imageAlt;
export const DEFAULT_KEYWORDS = ROUTE_SEO.home.keywords;

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
  return post.publishedOn;
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
    sameAs: ['https://github.com/Sankhya-AI'],
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

export function chotuSoftwareApplicationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Chotu',
    alternateName: 'Chotu AI Assistant',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'macOS (Apple silicon)',
    url: absoluteUrl(ROUTES.chotu),
    image: absoluteUrl(ROUTE_SEO.chotu.image),
    description: ROUTE_SEO.chotu.description,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      description: 'Early access for Apple silicon Macs.',
      availability: 'https://schema.org/LimitedAvailability',
      url: absoluteUrl('/pricing'),
    },
    featureList: [
      'Research',
      'Workspace-bound coding',
      'Current-screen actions',
      'Dhee memory',
      'Proactive notifications',
      'Permission gates for sensitive actions',
    ],
  };
}

export function blogIndexJsonLd(posts: BlogPost[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sankhya AI Labs Research & Notes',
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
