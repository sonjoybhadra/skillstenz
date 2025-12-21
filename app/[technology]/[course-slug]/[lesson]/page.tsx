'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface LessonContent {
  type: 'text' | 'video' | 'pdf' | 'link' | 'code';
  title: string;
  content?: string;
  url?: string;
  duration?: number;
  language?: string;
  approved: boolean;
}

interface Subtopic {
  _id?: string;
  name: string;
  slug?: string;
  description: string;
  content: LessonContent[];
}

interface Topic {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  subtopics: Subtopic[];
  order: number;
}

interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export default function LessonPage() {
  const params = useParams();
  const { user } = useAuth();
  
  const techSlug = params.technology as string;
  const topicSlug = params['course-slug'] as string;
  const lessonSlug = params.lesson as string;

  const [technology, setTechnology] = useState<Technology | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [currentSubtopic, setCurrentSubtopic] = useState<Subtopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (techSlug) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techSlug, topicSlug, lessonSlug]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch technology
      const techRes = await fetch(`${API_URL}/technologies/slug/${techSlug}`);
      if (techRes.ok) {
        const techData = await techRes.json();
        const tech = techData.technology || techData;
        setTechnology(tech);

        // Fetch topics
        const topicsRes = await fetch(`${API_URL}/topics/technology/${tech._id}`);
        if (topicsRes.ok) {
          const topicsData = await topicsRes.json();
          const sortedTopics = (topicsData || []).sort((a: Topic, b: Topic) => a.order - b.order);
          setTopics(sortedTopics);

          // Find current topic and subtopic
          if (topicSlug) {
            const topic = sortedTopics.find((t: Topic) => 
              t.slug === topicSlug || t.name.toLowerCase().replace(/\s+/g, '-') === topicSlug
            );
            if (topic) {
              setCurrentTopic(topic);
              
              if (lessonSlug && topic.subtopics) {
                const subtopic = topic.subtopics.find((s: Subtopic) =>
                  s.slug === lessonSlug || s.name.toLowerCase().replace(/\s+/g, '-') === lessonSlug
                );
                setCurrentSubtopic(subtopic || topic.subtopics[0] || null);
              } else if (topic.subtopics?.length) {
                setCurrentSubtopic(topic.subtopics[0]);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = (id: string) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
  };

  const getNavigation = () => {
    if (!currentTopic || !topics.length) return { prev: null, next: null };

    const flatList: { topic: Topic; subtopic?: Subtopic }[] = [];
    topics.forEach(topic => {
      if (topic.subtopics?.length) {
        topic.subtopics.forEach(sub => flatList.push({ topic, subtopic: sub }));
      } else {
        flatList.push({ topic });
      }
    });

    const currentIndex = flatList.findIndex(item => 
      item.topic._id === currentTopic._id && 
      (!currentSubtopic || item.subtopic?.name === currentSubtopic.name)
    );

    return {
      prev: currentIndex > 0 ? flatList[currentIndex - 1] : null,
      next: currentIndex < flatList.length - 1 ? flatList[currentIndex + 1] : null
    };
  };

  const navigation = getNavigation();

  const renderContent = (content: LessonContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div 
            className="prose prose-lg max-w-none"
            style={{ color: 'var(--text-primary)', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: content.content || '' }}
          />
        );
      
      case 'video':
        return (
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            {content.url?.includes('youtube') || content.url?.includes('youtu.be') ? (
              <iframe
                src={content.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={content.url} controls className="w-full h-full" />
            )}
          </div>
        );
      
      case 'code':
        return (
          <div className="relative">
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                {content.language || 'code'}
              </span>
              <button 
                onClick={() => navigator.clipboard.writeText(content.content || '')}
                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                Copy
              </button>
            </div>
            <pre 
              className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto"
              style={{ fontFamily: "'Fira Code', 'Monaco', monospace" }}
            >
              <code>{content.content}</code>
            </pre>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="border border-[var(--border-primary)] rounded-xl overflow-hidden">
            <iframe 
              src={content.url} 
              className="w-full" 
              style={{ height: '600px' }}
            />
          </div>
        );
      
      case 'link':
        return (
          <a 
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--bg-accent)] transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-accent)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--text-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-[var(--text-primary)]">{content.title}</h4>
              <p className="text-sm text-[var(--text-secondary)]">{content.url}</p>
            </div>
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        );
      
      default:
        return <p className="text-[var(--text-secondary)]">Unknown content type</p>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border-primary)] border-t-[var(--bg-accent)]"></div>
        </div>
      </Layout>
    );
  }

  // Check if user has access (membership required for course lessons)
  const hasMembership = user && (user.role === 'admin' || (user as { subscription?: { plan?: string } }).subscription?.plan);
  
  if (!user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Login Required</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Please login to access course lessons. Free tutorials are available without login.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/login?redirect=/${techSlug}/${topicSlug}/${lessonSlug}`}
                className="px-6 py-3 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
              <Link
                href="/tutorials"
                className="px-6 py-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              >
                Free Tutorials
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasMembership) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Membership Required</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Course lessons require a membership plan. Upgrade to access all courses, lessons, and premium content.
            </p>
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Membership Benefits:</h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">✅ Access all course lessons</li>
                <li className="flex items-center gap-2">✅ Download resources</li>
                <li className="flex items-center gap-2">✅ Get certificates</li>
                <li className="flex items-center gap-2">✅ Priority support</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                href="/membership"
                className="px-6 py-3 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                View Plans
              </Link>
              <Link
                href="/tutorials"
                className="px-6 py-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              >
                Free Tutorials
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={false}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside 
          className={`fixed lg:static top-0 left-0 h-full bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] z-40 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ width: '280px', paddingTop: '64px' }}
        >
          <div className="p-4 border-b border-[var(--border-primary)]">
            <Link href={`/${techSlug}`} className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: technology?.color + '20' }}
              >
                {technology?.icon || '📚'}
              </div>
              <div>
                <h2 className="font-semibold text-[var(--text-primary)]">{technology?.name}</h2>
                <p className="text-xs text-[var(--text-secondary)]">{topics.length} Topics</p>
              </div>
            </Link>
          </div>

          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
            {topics.map((topic, topicIdx) => (
              <div key={topic._id}>
                <button
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-[var(--bg-hover)] transition-colors ${
                    currentTopic?._id === topic._id ? 'bg-[var(--bg-hover)]' : ''
                  }`}
                  onClick={() => {
                    setCurrentTopic(topic);
                    if (topic.subtopics?.length) {
                      setCurrentSubtopic(topic.subtopics[0]);
                    } else {
                      setCurrentSubtopic(null);
                    }
                  }}
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--bg-accent)]/10 text-[var(--text-accent)] text-xs flex items-center justify-center">
                    {topicIdx + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-[var(--text-primary)] truncate">
                    {topic.name}
                  </span>
                </button>

                {topic.subtopics?.map((sub, subIdx) => (
                  <button
                    key={subIdx}
                    className={`w-full flex items-center gap-2 pl-10 pr-4 py-2 text-left hover:bg-[var(--bg-hover)] transition-colors ${
                      currentSubtopic?.name === sub.name && currentTopic?._id === topic._id
                        ? 'bg-[var(--bg-accent)]/10 border-l-2 border-[var(--bg-accent)]'
                        : ''
                    }`}
                    onClick={() => {
                      setCurrentTopic(topic);
                      setCurrentSubtopic(sub);
                    }}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 ${
                      completed.includes(`${topic._id}-${subIdx}`)
                        ? 'bg-green-500 border-green-500'
                        : 'border-[var(--border-primary)]'
                    }`}></span>
                    <span className="flex-1 text-sm text-[var(--text-secondary)] truncate">
                      {sub.name}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="sticky top-[64px] z-30 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] px-6 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-[var(--bg-hover)] rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <nav className="hidden md:flex items-center gap-2 text-sm">
                <Link href="/tutorials" className="text-[var(--text-secondary)] hover:text-[var(--text-accent)]">
                  Tutorials
                </Link>
                <span className="text-[var(--text-muted)]">/</span>
                <Link href={`/${techSlug}`} className="text-[var(--text-secondary)] hover:text-[var(--text-accent)]">
                  {technology?.name}
                </Link>
                {currentTopic && (
                  <>
                    <span className="text-[var(--text-muted)]">/</span>
                    <span className="text-[var(--text-primary)]">{currentTopic.name}</span>
                  </>
                )}
              </nav>

              <div className="flex items-center gap-2">
                {user && (
                  <button className="p-2 hover:bg-[var(--bg-hover)] rounded-lg" title="Bookmark">
                    <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-6 py-8">
            {currentSubtopic ? (
              <>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                  {currentSubtopic.name}
                </h1>
                {currentSubtopic.description && (
                  <p className="text-lg text-[var(--text-secondary)] mb-8">
                    {currentSubtopic.description}
                  </p>
                )}

                {/* Content Sections */}
                <div className="space-y-8">
                  {currentSubtopic.content?.filter(c => c.approved).map((item, idx) => (
                    <div key={idx}>
                      {item.type !== 'text' && (
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                          {item.title}
                        </h3>
                      )}
                      {renderContent(item)}
                    </div>
                  ))}

                  {(!currentSubtopic.content?.length || !currentSubtopic.content.some(c => c.approved)) && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🚧</div>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        Content Coming Soon
                      </h3>
                      <p className="text-[var(--text-secondary)]">
                        We&apos;re working on this lesson. Check back soon!
                      </p>
                    </div>
                  )}
                </div>

                {/* Complete Button */}
                <div className="mt-12 pt-8 border-t border-[var(--border-primary)]">
                  <button
                    onClick={() => markComplete(`${currentTopic?._id}-${currentTopic?.subtopics?.indexOf(currentSubtopic)}`)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      completed.includes(`${currentTopic?._id}-${currentTopic?.subtopics?.indexOf(currentSubtopic)}`)
                        ? 'bg-green-500 text-white'
                        : 'bg-[var(--bg-accent)] text-white hover:opacity-90'
                    }`}
                  >
                    {completed.includes(`${currentTopic?._id}-${currentTopic?.subtopics?.indexOf(currentSubtopic)}`)
                      ? '✓ Completed'
                      : 'Mark as Complete'
                    }
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-8 border-t border-[var(--border-primary)]">
                  {navigation.prev ? (
                    <button
                      onClick={() => {
                        setCurrentTopic(navigation.prev!.topic);
                        setCurrentSubtopic(navigation.prev!.subtopic || null);
                      }}
                      className="flex items-center gap-2 text-[var(--text-accent)] hover:underline"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>{navigation.prev.subtopic?.name || navigation.prev.topic.name}</span>
                    </button>
                  ) : <div />}
                  
                  {navigation.next && (
                    <button
                      onClick={() => {
                        setCurrentTopic(navigation.next!.topic);
                        setCurrentSubtopic(navigation.next!.subtopic || null);
                      }}
                      className="flex items-center gap-2 text-[var(--text-accent)] hover:underline"
                    >
                      <span>{navigation.next.subtopic?.name || navigation.next.topic.name}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </>
            ) : currentTopic ? (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                  {currentTopic.name}
                </h1>
                <p className="text-[var(--text-secondary)] mb-8">{currentTopic.description}</p>
                {currentTopic.subtopics?.length ? (
                  <div className="grid gap-4 max-w-xl mx-auto">
                    {currentTopic.subtopics.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSubtopic(sub)}
                        className="flex items-center gap-4 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--bg-accent)] transition-colors text-left"
                      >
                        <span className="w-8 h-8 rounded-full bg-[var(--bg-accent)]/10 text-[var(--text-accent)] flex items-center justify-center font-medium">
                          {idx + 1}
                        </span>
                        <span className="flex-1 font-medium text-[var(--text-primary)]">{sub.name}</span>
                        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)]">No lessons available yet.</p>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Select a Topic
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Choose a topic from the sidebar to start learning
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </Layout>
  );
}
