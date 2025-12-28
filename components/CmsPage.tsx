'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface CmsSection {
  title: string;
  content: string;
  order: number;
}

interface CmsPageData {
  _id: string;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  content?: string;
  sections?: CmsSection[];
  updatedAt?: string;
}

interface CmsPageProps {
  slug: string;
  fallbackTitle: string;
  fallbackContent: React.ReactNode;
  showHero?: boolean;
}

export default function CmsPage({ slug, fallbackTitle, fallbackContent, showHero = false }: CmsPageProps) {
  const [page, setPage] = useState<CmsPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`${API_URL}/cms/${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.page) {
          setPage(data.page);
        }
      }
    } catch (err) {
      console.error('Failed to fetch CMS page:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  // Use fallback if no CMS content
  if (!page) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{fallbackTitle}</h1>
          {fallbackContent}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      {showHero && page.heroTitle && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.heroTitle}</h1>
            {page.heroSubtitle && (
              <p className="text-xl text-white/80">{page.heroSubtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title (if no hero) */}
        {!showHero && (
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {page.heroTitle || page.title}
          </h1>
        )}

        {/* Main Content */}
        {page.content && (
          <div 
            className="prose dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}

        {/* Sections */}
        {page.sections && page.sections.length > 0 && (
          <div className="space-y-8">
            {page.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <section key={index} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <div 
                    className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </section>
              ))}
          </div>
        )}

        {/* Last Updated */}
        {page.updatedAt && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-8 text-right">
            Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link href="/" className="text-blue-500 hover:text-blue-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
