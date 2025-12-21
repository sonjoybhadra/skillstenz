'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Topic {
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  order: number;
  technology: {
    name: string;
    slug: string;
    icon: string;
  };
}

interface SidebarTopic {
  _id: string;
  title: string;
  slug: string;
  order: number;
}

export default function TutorialTopicPage() {
  const params = useParams();
  const techSlug = params.slug as string;
  const topicSlug = params.topic as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [allTopics, setAllTopics] = useState<SidebarTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`${API_URL}/topics/${topicSlug}?technology=${techSlug}`);
        if (response.ok) {
          const data = await response.json();
          setTopic(data.topic);
        }
      } catch (error) {
        console.error('Failed to fetch topic:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllTopics = async () => {
      try {
        const response = await fetch(`${API_URL}/topics?technology=${techSlug}&limit=100`);
        if (response.ok) {
          const data = await response.json();
          setAllTopics(data.topics || []);
        }
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      }
    };

    if (techSlug && topicSlug) {
      fetchTopic();
      fetchAllTopics();
    }
  }, [techSlug, topicSlug]);

  // Find current topic index for prev/next navigation
  const currentIndex = allTopics.findIndex(t => t.slug === topicSlug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  // Default content
  const defaultContent = `
# ${topicSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

Welcome to this tutorial! This content will be loaded from the database.

## Getting Started

This tutorial covers everything you need to know about this topic.

## Examples

\`\`\`javascript
// Code examples will appear here
console.log("Hello, World!");
\`\`\`

## Summary

- Point 1: Key concept explained
- Point 2: Important feature
- Point 3: Best practices
`;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border-primary)] border-t-[var(--bg-accent)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex min-h-screen">
        {/* Sidebar - Topics List */}
        <aside className="w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] hidden lg:block overflow-y-auto" style={{ height: 'calc(100vh - 112px)', position: 'sticky', top: '112px' }}>
          <div className="p-4">
            <Link 
              href={`/tutorials/${techSlug}`}
              className="flex items-center gap-2 text-[var(--text-accent)] hover:underline mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {techSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
            
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Topics</h3>
            <nav className="space-y-1">
              {allTopics.map((t, index) => (
                <Link
                  key={t._id}
                  href={`/tutorials/${techSlug}/${t.slug}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    t.slug === topicSlug
                      ? 'bg-[var(--bg-accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="truncate">{t.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] px-6 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/tutorials" className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Tutorials
              </Link>
              <span className="text-[var(--text-muted)]">/</span>
              <Link href={`/tutorials/${techSlug}`} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                {topic?.technology?.name || techSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
              <span className="text-[var(--text-muted)]">/</span>
              <span className="text-[var(--text-primary)]">{topic?.title || topicSlug?.replace(/-/g, ' ')}</span>
            </nav>
          </div>

          {/* Content Area */}
          <article className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium mb-4">
                FREE Tutorial
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                {topic?.title || topicSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
              <p className="text-lg text-[var(--text-secondary)]">
                {topic?.description || 'Learn the fundamentals of this topic with practical examples.'}
              </p>
            </div>

            {/* Tutorial Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: topic?.content || defaultContent.replace(/\n/g, '<br>') }}
            />

            {/* Try It Yourself */}
            <div className="mt-12 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                💻 Try It Yourself
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Practice what you&apos;ve learned with our online code editor.
              </p>
              <Link
                href="/compiler/html"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors"
              >
                Open Code Editor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-between border-t border-[var(--border-primary)] pt-8">
              {prevTopic ? (
                <Link
                  href={`/tutorials/${techSlug}/${prevTopic.slug}`}
                  className="flex items-center gap-2 text-[var(--text-accent)] hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-[var(--text-muted)]">Previous</div>
                    <div className="font-medium">{prevTopic.title}</div>
                  </div>
                </Link>
              ) : <div />}

              {nextTopic ? (
                <Link
                  href={`/tutorials/${techSlug}/${nextTopic.slug}`}
                  className="flex items-center gap-2 text-[var(--text-accent)] hover:underline"
                >
                  <div className="text-right">
                    <div className="text-xs text-[var(--text-muted)]">Next</div>
                    <div className="font-medium">{nextTopic.title}</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/tutorials/${techSlug}`}
                  className="flex items-center gap-2 text-[var(--text-accent)] hover:underline"
                >
                  <div className="text-right">
                    <div className="text-xs text-[var(--text-muted)]">Completed!</div>
                    <div className="font-medium">Back to Topics</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </article>
        </main>
      </div>
    </Layout>
  );
}
