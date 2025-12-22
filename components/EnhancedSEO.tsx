'use client';

import { useEffect } from 'react';

interface EnhancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonical?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: object;
}

export default function EnhancedSEO({
  title = 'TechTooTalk - Learn AI, Web Development & Programming',
  description = 'Master AI, AI Agents, Web Development, and Programming with expert-led courses, hands-on projects, and industry certifications.',
  keywords = 'AI courses, web development, programming, online learning, AI agents, machine learning',
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical,
  author = 'TechTooTalk',
  publishedTime,
  modifiedTime,
  schema
}: EnhancedSEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techtootalk.com';
  const fullTitle = title.includes('TechTooTalk') ? title : `${title} | TechTooTalk`;
  const canonicalUrl = canonical || siteUrl;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateOrCreateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Primary Meta Tags
    updateOrCreateMeta('title', fullTitle);
    updateOrCreateMeta('description', description);
    updateOrCreateMeta('keywords', keywords);
    updateOrCreateMeta('author', author);

    // Open Graph
    updateOrCreateMeta('og:type', ogType, true);
    updateOrCreateMeta('og:url', canonicalUrl, true);
    updateOrCreateMeta('og:title', fullTitle, true);
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:image', imageUrl, true);
    updateOrCreateMeta('og:site_name', 'TechTooTalk', true);

    // Twitter
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:url', canonicalUrl);
    updateOrCreateMeta('twitter:title', fullTitle);
    updateOrCreateMeta('twitter:description', description);
    updateOrCreateMeta('twitter:image', imageUrl);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    // JSON-LD Schema
    const jsonLd = schema || {
      '@context': 'https://schema.org',
      '@type': ogType === 'article' ? 'Article' : 'WebSite',
      'name': fullTitle,
      'description': description,
      'url': canonicalUrl,
      'image': imageUrl,
      ...(publishedTime && { 'datePublished': publishedTime }),
      ...(modifiedTime && { 'dateModified': modifiedTime }),
      ...(author && { 'author': { '@type': 'Person', 'name': author } })
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [fullTitle, description, keywords, canonicalUrl, imageUrl, ogType, author, publishedTime, modifiedTime, schema]);

  return null;
}
