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
  description: string;
  order: number;
  icon: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keyPoints: string[];
}

interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

export default function TutorialDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (slug) {
      fetchTechnology();
      fetchChapters();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchTechnology = async () => {
    try {
      const response = await fetch(`${API_URL}/technologies/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setTechnology(data.technology);
      }
    } catch (error) {
      console.error('Failed to fetch technology:', error);
    }
  };

  const fetchChapters = async () => {
    try {
      // Use the new tutorials API for chapters
      const response = await fetch(`${API_URL}/tutorials/technology/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data.chapters || []);
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  // Calculate total estimated time
  const totalTime = chapters.reduce((sum, ch) => sum + (ch.estimatedTime || 10), 0);
  const hours = Math.floor(totalTime / 60);
  const mins = totalTime % 60;
  const timeDisplay = hours > 0 ? `~${hours}h ${mins}m` : `~${mins}m`;

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* Header */}
        <section 
          className="py-12"
          style={{ background: `linear-gradient(135deg, ${technology?.color || '#4f46e5'}20, ${technology?.color || '#4f46e5'}05)` }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
              <Link href="/tutorials" className="hover:text-[var(--text-accent)]">Tutorials</Link>
              <span>/</span>
              <span className="text-[var(--text-primary)]">{technology?.name || slug}</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl"
                style={{ backgroundColor: technology?.color + '30' }}
              >
                {technology?.icon || '📚'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                    {technology?.name || slug} Tutorial
                  </h1>
                  <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded">FREE</span>
                </div>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
                  {technology?.description || `Learn ${slug} from beginner to advanced with hands-on examples and exercises.`}
                </p>
              </div>
              <div className="flex gap-3">
                {chapters.length > 0 && (
                  <Link
                    href={`/tutorials/${slug}/${chapters[0]?.slug || 'introduction'}`}
                    className="px-6 py-3 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Start Learning
                  </Link>
                )}
                <button className="px-6 py-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-5 sticky top-24">
                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Chapters</span>
                    <span className="text-[var(--text-primary)] font-medium">{chapters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Duration</span>
                    <span className="text-[var(--text-primary)] font-medium">{timeDisplay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Level</span>
                    <span className="text-[var(--text-primary)] font-medium">All Levels</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Price</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <hr className="my-5 border-[var(--border-primary)]" />

                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Resources</h3>
                <div className="space-y-2">
                  <Link href={`/cheatsheets/${slug}`} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-accent)]">
                    <span>📝</span> Cheat Sheet
                  </Link>
                  <Link href={`/compiler/${slug}`} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-accent)]">
                    <span>💻</span> Try it Online
                  </Link>
                  <Link href={`/roadmaps/${slug}`} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-accent)]">
                    <span>🗺️</span> Learning Roadmap
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content - Chapters List */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border-primary)] border-t-[var(--bg-accent)]"></div>
                </div>
              ) : chapters.length === 0 ? (
                <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)]">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Coming Soon</h3>
                  <p className="text-[var(--text-secondary)]">Tutorial chapters for {technology?.name || slug} are being created.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                    Chapters ({chapters.length})
                  </h2>

                  {chapters.sort((a, b) => a.order - b.order).map((chapter, index) => (
                    <div 
                      key={chapter._id}
                      className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden"
                    >
                      <button
                        onClick={() => toggleChapter(chapter._id)}
                        className="w-full flex items-center gap-4 p-5 hover:bg-[var(--bg-hover)] transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-accent)]/10 text-[var(--text-accent)] flex items-center justify-center text-xl">
                          {chapter.icon || '📖'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-[var(--text-muted)]">Chapter {index + 1}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              chapter.difficulty === 'beginner' ? 'bg-green-500/10 text-green-600' :
                              chapter.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-600' :
                              'bg-red-500/10 text-red-600'
                            }`}>
                              {chapter.difficulty}
                            </span>
                          </div>
                          <h3 className="font-medium text-[var(--text-primary)]">{chapter.title}</h3>
                          <p className="text-sm text-[var(--text-secondary)]">{chapter.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[var(--text-muted)]">{chapter.estimatedTime || 10} min</div>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${expandedChapters.has(chapter._id) ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedChapters.has(chapter._id) && (
                        <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5">
                          {chapter.keyPoints?.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Key Points:</h4>
                              <ul className="space-y-1">
                                {chapter.keyPoints.map((point, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                    <span className="text-green-500">✓</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <Link
                            href={`/tutorials/${slug}/${chapter.slug}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 text-sm font-medium"
                          >
                            Start Chapter
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
