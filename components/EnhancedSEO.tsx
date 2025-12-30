'use client';

import { useEffect } from 'react';
import { useSettings } from '../lib/settings';

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
  title,
  description = 'Master AI, AI Agents, Web Development, and Programming with expert-led courses, hands-on projects, and industry certifications.',
  keywords = 'AI courses, web development, programming, online learning, AI agents, machine learning',
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical,
  author,
  publishedTime,
  modifiedTime,
  schema
}: EnhancedSEOProps) {
  const { settings } = useSettings();
  const siteName = settings.siteName || 'SkillStenz';
  const siteTagline = settings.siteTagline || 'Learn AI, Web Development & Programming';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillstenz.com';
  const defaultTitle = `${siteName} - ${siteTagline}`;
  const pageTitle = title || defaultTitle;
  const fullTitle = pageTitle.includes(siteName) ? pageTitle : `${pageTitle} | ${siteName}`;
  const pageAuthor = author || siteName;
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
    updateOrCreateMeta('author', pageAuthor);

    // Open Graph
    updateOrCreateMeta('og:type', ogType, true);
    updateOrCreateMeta('og:url', canonicalUrl, true);
    updateOrCreateMeta('og:title', fullTitle, true);
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:image', imageUrl, true);
    updateOrCreateMeta('og:site_name', siteName, true);

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
      ...(pageAuthor && { 'author': { '@type': 'Organization', 'name': pageAuthor } })
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [fullTitle, description, keywords, canonicalUrl, imageUrl, ogType, pageAuthor, publishedTime, modifiedTime, schema, siteName]);

  return null;
}
