'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { technologiesAPI, Technology } from '../../../lib/api';

interface TechnologyPageProps {
  params: Promise<{
    technology: string;
  }>;
}

// Get icon for technology based on slug
const getTechIcon = (slug: string): string => {
  const icons: Record<string, string> = {
    'ai': '🤖',
    'ai-agents': '🦾',
    'machine-learning': '🧠',
    'langchain': '🔗',
    'prompt-engineering': '💬',
    'rag-systems': '📚',
    'nlp': '💭',
    'computer-vision': '👁️',
    'python-for-ai': '🐍',
    'genai-applications': '✨',
    'default': '📘'
  };
  return icons[slug] || icons['default'];
};

export default function TechnologyPage({ params }: TechnologyPageProps) {
  const { technology } = use(params);
  const router = useRouter();
  const [tech, setTech] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        const { data, error: apiError } = await technologiesAPI.getBySlug(technology);
        if (apiError || !data) {
          setError('Technology not found');
          return;
        }
        setTech(data);
      } catch (err) {
        console.error('Failed to fetch technology:', err);
        setError('Failed to load technology');
      } finally {
        setLoading(false);
      }
    };
    fetchTechnology();
  }, [technology]);

  if (loading) {
    return (
      <Layout>
        <section className="section" style={{ paddingTop: '100px', textAlign: 'center' }}>
          <div className="container">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Loading...</h2>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !tech) {
    return (
      <Layout>
        <section className="section" style={{ paddingTop: '100px', textAlign: 'center' }}>
          <div className="container">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '16px' }}>Technology Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>The technology you&apos;re looking for doesn&apos;t exist.</p>
            <button onClick={() => router.push('/technologies')} className="btn btn-primary">
              Browse Technologies
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  const courses = tech.courses || [];

  return (
    <Layout>
      {/* Technology Header */}
      <section className="hero hero-gradient" style={{ paddingTop: '64px', paddingBottom: '48px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: tech.color || 'linear-gradient(135deg, var(--bg-accent) 0%, #059669 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '48px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            {getTechIcon(tech.slug || '')}
          </div>

          <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            {tech.name}
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            {tech.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div className="badge badge-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
              📚 {courses.length} Courses
            </div>
            <div className="badge badge-success" style={{ padding: '10px 20px', fontSize: '14px' }}>
              {tech.accessType === 'free' ? '✨ Free Access' : '⭐ Premium'}
            </div>
            {tech.featured && (
              <div className="badge badge-warning" style={{ padding: '10px 20px', fontSize: '14px' }}>
                🔥 Featured
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Available <span className="section-title-accent">Courses</span>
            </h2>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-3" style={{ gap: '24px' }}>
              {courses.map((course, idx) => (
                <Link
                  key={course._id || idx}
                  href={`/technologies/${tech.slug}/${course.slug}`}
                  className="card"
                  style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}
                >
                  <div style={{
                    height: '140px',
                    background: tech.color || 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    {getTechIcon(tech.slug || '')}
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span className={`badge ${course.level === 'beginner' ? 'badge-success' : course.level === 'intermediate' ? 'badge-warning' : 'badge-error'}`}>
                        {course.level}
                      </span>
                      {course.price === 0 && <span className="badge badge-primary">Free</span>}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                      {course.description?.slice(0, 100)}...
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {course.rating && (
                          <span style={{ color: '#f59e0b', fontSize: '14px' }}>⭐ {course.rating}</span>
                        )}
                        {course.duration && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>⏱️ {course.duration}</span>
                        )}
                      </div>
                      <span style={{ color: 'var(--text-accent)', fontWeight: 600, fontSize: '14px' }}>
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No courses available yet
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                We&apos;re working on adding courses for this technology. Check back soon!
              </p>
              <Link href="/technologies" className="btn btn-primary">
                Explore Other Technologies
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Technologies */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Related <span className="section-title-accent">Technologies</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {['ai', 'ai-agents', 'machine-learning', 'langchain', 'prompt-engineering', 'rag-systems'].filter(s => s !== tech.slug).map((slug) => (
              <Link key={slug} href={`/technologies/${slug}`} className="tag" style={{ padding: '10px 20px', fontSize: '14px' }}>
                {getTechIcon(slug)} {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}