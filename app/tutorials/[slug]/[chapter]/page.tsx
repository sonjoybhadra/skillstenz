'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Chapter {
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  order: number;
  icon: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keyPoints: string[];
  codeExamples: { title: string; language: string; code: string; output: string }[];
  technology: {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
}

interface SidebarChapter {
  _id: string;
  title: string;
  slug: string;
  order: number;
  icon: string;
}

export default function TutorialChapterPage() {
  const params = useParams();
  const techSlug = params.slug as string;
  const chapterSlug = params.chapter as string;
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<SidebarChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(`${API_URL}/tutorials/technology/${techSlug}/chapter/${chapterSlug}`);
        if (response.ok) {
          const data = await response.json();
          setChapter(data.chapter);
        }
      } catch (error) {
        console.error('Failed to fetch chapter:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllChapters = async () => {
      try {
        const response = await fetch(`${API_URL}/tutorials/technology/${techSlug}`);
        if (response.ok) {
          const data = await response.json();
          setAllChapters(data.chapters || []);
        }
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    };

    if (techSlug && chapterSlug) {
      fetchChapter();
      fetchAllChapters();
    }
  }, [techSlug, chapterSlug]);

  // Find current chapter index for prev/next navigation
  const sortedChapters = allChapters.sort((a, b) => a.order - b.order);
  const currentIndex = sortedChapters.findIndex(c => c.slug === chapterSlug);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

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
        {/* Sidebar - Chapters List */}
        <aside className="w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] hidden lg:block overflow-y-auto" style={{ height: 'calc(100vh - 112px)', position: 'sticky', top: '112px' }}>
          <div className="p-4">
            <Link 
              href={`/tutorials/${techSlug}`}
              className="flex items-center gap-2 text-[var(--text-accent)] hover:underline mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {chapter?.technology?.name || techSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
            
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Chapters</h3>
            <nav className="space-y-1">
              {sortedChapters.map((ch, index) => (
                <Link
                  key={ch._id}
                  href={`/tutorials/${techSlug}/${ch.slug}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    ch.slug === chapterSlug
                      ? 'bg-[var(--bg-accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs">
                    {ch.icon || (index + 1)}
                  </span>
                  <span className="truncate">{ch.title}</span>
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
                {chapter?.technology?.name || techSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
              <span className="text-[var(--text-muted)]">/</span>
              <span className="text-[var(--text-primary)]">{chapter?.title || chapterSlug?.replace(/-/g, ' ')}</span>
            </nav>
          </div>

          {/* Content Area */}
          <article className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                  FREE
                </span>
                {chapter?.difficulty && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    chapter.difficulty === 'beginner' ? 'bg-green-500/10 text-green-600' :
                    chapter.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-red-500/10 text-red-600'
                  }`}>
                    {chapter.difficulty.charAt(0).toUpperCase() + chapter.difficulty.slice(1)}
                  </span>
                )}
                {chapter?.estimatedTime && (
                  <span className="text-sm text-[var(--text-muted)]">
                    ⏱️ {chapter.estimatedTime} min read
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
                <span className="text-4xl">{chapter?.icon || '📖'}</span>
                {chapter?.title || chapterSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
              <p className="text-lg text-[var(--text-secondary)]">
                {chapter?.description || 'Learn the fundamentals of this chapter with practical examples.'}
              </p>
            </div>

            {/* Key Points */}
            {chapter?.keyPoints && chapter.keyPoints.length > 0 && (
              <div className="mb-8 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  🎯 What You&apos;ll Learn
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chapter.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[var(--text-secondary)]">
                      <span className="text-green-500 mt-1">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tutorial Content */}
            {chapter?.content ? (
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            ) : (
              <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)]">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Content Coming Soon</h3>
                <p className="text-[var(--text-secondary)]">This chapter is being written. Check back soon!</p>
              </div>
            )}

            {/* Code Examples */}
            {chapter?.codeExamples && chapter.codeExamples.length > 0 && (
              <div className="mt-8 space-y-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  💻 Code Examples
                </h3>
                {chapter.codeExamples.map((example, idx) => (
                  <div key={idx} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
                    <div className="px-4 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)] flex items-center justify-between">
                      <span className="font-medium text-sm">{example.title}</span>
                      <span className="text-xs text-[var(--text-muted)]">{example.language}</span>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm">{example.code}</code>
                    </pre>
                    {example.output && (
                      <div className="px-4 py-3 bg-green-500/5 border-t border-[var(--border-primary)]">
                        <span className="text-xs text-[var(--text-muted)]">Output:</span>
                        <div className="font-mono text-sm text-green-600 mt-1">{example.output}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Try It Yourself */}
            <div className="mt-12 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                🚀 Try It Yourself
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Practice what you&apos;ve learned with our online code editor.
              </p>
              <Link
                href={`/compiler/${techSlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Open Code Editor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-between border-t border-[var(--border-primary)] pt-8">
              {prevChapter ? (
                <Link
                  href={`/tutorials/${techSlug}/${prevChapter.slug}`}
                  className="flex items-center gap-2 text-[var(--text-accent)] hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-[var(--text-muted)]">Previous Chapter</div>
                    <div className="font-medium">{prevChapter.title}</div>
                  </div>
                </Link>
              ) : <div />}

              {nextChapter ? (
                <Link
                  href={`/tutorials/${techSlug}/${nextChapter.slug}`}
                  className="flex items-center gap-2 text-[var(--text-accent)] hover:underline"
                >
                  <div className="text-right">
                    <div className="text-xs text-[var(--text-muted)]">Next Chapter</div>
                    <div className="font-medium">{nextChapter.title}</div>
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
                    <div className="text-xs text-[var(--text-muted)]">🎉 Completed!</div>
                    <div className="font-medium">Back to All Chapters</div>
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
