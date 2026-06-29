import type { Metadata } from 'next';
import { SITE } from './site';

interface PageSeo {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
}

/** Build consistent metadata (title, canonical, OpenGraph, Twitter) for a page. */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = 'website',
  publishedTime,
}: PageSeo): Metadata {
  const url = `${SITE.url}${path}`;
  const isHome = path === '/';
  // Home gets an absolute title; other pages use a plain title and let the root
  // layout's title template append "| SITE.name" exactly once.
  const fullTitle = isHome ? `${SITE.name} — ${SITE.tagline}` : `${title} | ${SITE.name}`;
  const ogImage = `${SITE.url}/og?title=${encodeURIComponent(title)}`;
  return {
    title: isHome ? { absolute: fullTitle } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: SITE.twitter,
      images: [ogImage],
    },
  };
}

/** WebApplication schema for a tool page. */
export function softwareAppSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `${SITE.url}${path}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleSchema(title: string, description: string, path: string, published: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: published,
    dateModified: published,
    author: { '@type': 'Person', name: SITE.author },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}${path}` },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/world-clock?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Organization (brand) entity. Gives search engines a stable, linkable identity
 * for the site — feeds Google's Knowledge Graph and strengthens every other
 * schema that references it via @id. sameAs lists the brand's official profiles.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    description: SITE.description,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/icon.svg`,
      contentUrl: `${SITE.url}/icon.svg`,
    },
    image: `${SITE.url}/og`,
    founder: { '@type': 'Person', name: SITE.author },
    sameAs: SITE.sameAs,
  };
}

/**
 * ItemList of all tools — the collection's "list" representation. Helps Google
 * understand the full toolset on the homepage and tools index, improving the
 * odds of rich sitelinks and a richer SERP presence for the brand.
 */
export function itemListSchema(items: { name: string; path: string; description?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE.name} — Tools`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${SITE.url}${it.path}`,
      ...(it.description ? { description: it.description } : {}),
    })),
  };
}

/** CollectionPage wrapper for index pages that list many tools/articles. */
export function collectionPageSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${SITE.url}${path}`,
    isPartOf: { '@id': `${SITE.url}/#website` },
    inLanguage: 'en',
  };
}
