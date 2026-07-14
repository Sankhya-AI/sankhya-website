import { useEffect } from 'react';
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_ALT,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
  type JsonLd,
} from '../lib/seo';

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: readonly string[] | string;
  robots?: string;
  type?: 'website' | 'article';
  jsonLd?: JsonLd | JsonLd[];
};

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.href = href;
}

function normalizeJsonLd(jsonLd: JsonLd | JsonLd[]) {
  const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  if (entries.length === 1) {
    return entries[0];
  }

  return {
    '@context': 'https://schema.org',
    '@graph': entries.map((entry) => {
      const graphEntry = { ...entry };
      delete graphEntry['@context'];
      return graphEntry;
    }),
  };
}

function upsertJsonLd(jsonLd?: JsonLd | JsonLd[]) {
  const scriptId = 'sankhya-route-jsonld';
  const existing = document.getElementById(scriptId);

  if (!jsonLd) {
    existing?.remove();
    return;
  }

  const script =
    existing instanceof HTMLScriptElement ? existing : document.createElement('script');

  script.id = scriptId;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(normalizeJsonLd(jsonLd));

  if (!existing) {
    document.head.appendChild(script);
  }
}

export function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  keywords = DEFAULT_KEYWORDS,
  robots = 'index, follow, max-image-preview:large',
  type = 'website',
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const canonical = absoluteUrl(path);
    const imageUrl = absoluteUrl(image);
    const keywordContent = typeof keywords === 'string' ? keywords : keywords.join(', ');

    document.title = title;
    upsertCanonical(canonical);
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywordContent);
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'author', SITE_NAME);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:image:alt', imageAlt);
    upsertMeta('property', 'og:locale', 'en_US');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
    upsertMeta('name', 'twitter:image:alt', imageAlt);
    upsertJsonLd(jsonLd);
  }, [description, image, imageAlt, jsonLd, keywords, path, robots, title, type]);

  return null;
}
