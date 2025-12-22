'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Tutorial {
  _id: string;
  title: string;
  slug: string;
  description: string;
  technology: string;
  chapters: Chapter[];
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  keywords: string[];
  createdAt: string;
}

interface Chapter {
  _id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  icon?: string;
  estimatedTime?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  keyPoints?: string[];
  content?: string;
  codeExample?: string;
}

export default function TutorialDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (slug) {
      fetchTutorial();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchTutorial = async () => {
    try {
      // Fetch tutorial by slug
      const response = await fetch(`${API_URL}/tutorials/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setTutorial(data.tutorial || data);
        // Expand first chapter by default
        if (data.tutorial?.chapters?.length > 0) {
          setExpandedChapters(new Set([data.tutorial.chapters[0]._id]));
        }
      } else {
        console.error('Tutorial not found');
      }
    } catch (error) {
      console.error('Failed to fetch tutorial:', error);
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
  const chapters = tutorial?.chapters || [];
  const totalTime = chapters.reduce((sum, ch) => sum + (ch.estimatedTime || 10), 0);
  const hours = Math.floor(totalTime / 60);
  const mins = totalTime % 60;
  const timeDisplay = hours > 0 ? `~${hours}h ${mins}m` : `~${mins}m`;

  return (
    <Layout>
      <style jsx global>{`
        @media (min-width: 1024px) {
          .tutorial-grid {
            grid-template-columns: 260px 1fr !important;
          }
          .tutorial-sidebar {
            order: 1 !important;
          }
          .tutorial-content {
            order: 2 !important;
          }
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Header */}
        <section 
          style={{ 
            padding: '48px 0',
            background: `linear-gradient(135deg, #4f46e520, #4f46e505)` 
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <Link href="/tutorials" style={{ color: 'inherit', textDecoration: 'none' }}>Tutorials</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)' }}>{tutorial?.title || 'Tutorial'}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div 
                  style={{ 
                    width: '72px', 
                    height: '72px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '36px',
                    backgroundColor: '#4f46e530' 
                  }}
                >
                  📚
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {tutorial?.title || 'Tutorial'}
                    </h1>
                    <span style={{ padding: '4px 10px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', fontSize: '12px', fontWeight: '500', borderRadius: '4px' }}>FREE</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '700px' }}>
                    {tutorial?.description || 'Learn with hands-on examples and exercises.'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {chapters.length > 0 && (
                  <Link
                    href={`/tutorials/${slug}/${chapters[0]?.slug || 'introduction'}`}
                    style={{ 
                      padding: '12px 24px', 
                      background: 'var(--bg-accent)', 
                      color: 'white', 
                      borderRadius: '8px', 
                      fontWeight: '500', 
                      textDecoration: 'none' 
                    }}
                  >
                    Start Learning
                  </Link>
                )}
                <button style={{ 
                  padding: '12px 24px', 
                  border: '1px solid var(--border-primary)', 
                  borderRadius: '8px', 
                  background: 'transparent', 
                  color: 'var(--text-primary)', 
                  cursor: 'pointer' 
                }}>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          <div className="tutorial-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
            {/* Sidebar - shown at top on mobile/tablet */}
            <div className="tutorial-sidebar" style={{ order: 2 }}>
              <div style={{ 
                background: 'var(--bg-secondary)', 
                borderRadius: '6px', 
                border: '1px solid var(--border-primary)', 
                padding: '20px', 
                position: 'sticky', 
                top: '80px' 
              }}>
                <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>Quick Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Chapters</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{chapters.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Duration</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{timeDisplay}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Level</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>All Levels</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Price</span>
                    <span style={{ color: '#22c55e', fontWeight: '500' }}>Free</span>
                  </div>
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--border-primary)' }} />

                <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>Resources</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href={`/cheatsheets/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    <span>📝</span> Cheat Sheet
                  </Link>
                  <Link href={`/compiler/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    <span>💻</span> Try it Online
                  </Link>
                  <Link href={`/roadmaps/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    <span>🗺️</span> Learning Roadmap
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content - Chapters List */}
            <div className="tutorial-content" style={{ order: 1 }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                  <div className="spinner"></div>
                </div>
              ) : chapters.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border-primary)' 
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Coming Soon</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Tutorial chapters are being created.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px' }}>
                    Chapters ({chapters.length})
                  </h2>

                  {chapters.sort((a, b) => a.order - b.order).map((chapter, index) => (
                    <div 
                      key={chapter._id}
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border-primary)', 
                        overflow: 'hidden' 
                      }}
                    >
                      <button
                        onClick={() => toggleChapter(chapter._id)}
                        style={{ 
                          width: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '16px', 
                          padding: '20px', 
                          background: 'transparent', 
                          border: 'none', 
                          cursor: 'pointer', 
                          textAlign: 'left' 
                        }}
                      >
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '50%', 
                          background: 'rgba(var(--accent-rgb, 59, 130, 246), 0.1)', 
                          color: 'var(--text-accent)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '20px' 
                        }}>
                          {chapter.icon || '📖'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Chapter {index + 1}</span>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              fontSize: '12px',
                              background: chapter.difficulty === 'beginner' ? 'rgba(34, 197, 94, 0.1)' :
                                         chapter.difficulty === 'intermediate' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: chapter.difficulty === 'beginner' ? '#22c55e' :
                                    chapter.difficulty === 'intermediate' ? '#eab308' : '#ef4444'
                            }}>
                              {chapter.difficulty}
                            </span>
                          </div>
                          <h3 style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{chapter.title}</h3>
                          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{chapter.description}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{chapter.estimatedTime || 10} min</div>
                        </div>
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="var(--text-secondary)" 
                          strokeWidth="2"
                          style={{ transform: expandedChapters.has(chapter._id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedChapters.has(chapter._id) && (
                        <div style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', padding: '20px' }}>
                          {chapter.keyPoints && chapter.keyPoints.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                              <h4 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>Key Points:</h4>
                              <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {chapter.keyPoints.map((point, idx) => (
                                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    <span style={{ color: '#22c55e' }}>✓</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <Link
                            href={`/tutorials/${slug}/${chapter.slug}`}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              padding: '8px 16px', 
                              background: 'var(--bg-accent)', 
                              color: 'white', 
                              borderRadius: '8px', 
                              fontSize: '14px', 
                              fontWeight: '500', 
                              textDecoration: 'none' 
                            }}
                          >
                            Start Chapter
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
