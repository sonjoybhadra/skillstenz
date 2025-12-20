'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { coursesAPI, technologiesAPI, Course, Technology } from '../../../lib/api';

export default function CoursePage() {
  const params = useParams();
  const technology = params.technology as string;
  const courseSlug = params['course-slug'] as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [technologyData, setTechnologyData] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [techResponse, courseResponse] = await Promise.all([
          technologiesAPI.getBySlug(technology),
          coursesAPI.getBySlug(courseSlug)
        ]);
        
        if (techResponse.error || !techResponse.data) {
          setError('Technology not found');
          return;
        }
        
        if (courseResponse.error || !courseResponse.data) {
          setError('Course not found');
          return;
        }
        
        setTechnologyData(techResponse.data);
        setCourse(courseResponse.data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (technology && courseSlug) {
      fetchData();
    }
  }, [technology, courseSlug]);

  if (loading) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid var(--border-primary)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading course...</p>
          </div>
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </Layout>
    );
  }

  if (error || !course || !technologyData) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '64px', opacity: 0.5 }}>📚</div>
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>{error || 'Course Not Found'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>The course you&apos;re looking for doesn&apos;t exist.</p>
          <Link href={`/${technology}`} className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Courses</Link>
        </div>
      </Layout>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      case 'Intermediate': return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'Advanced': return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
      default: return { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' };
    }
  };

  const levelColors = getLevelColor(course.level);

  return (
    <Layout>
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <Link href={`/${technology}`} style={{ color: 'var(--text-muted)' }}>{technologyData.name}</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{course.title}</span>
          </nav>
        </div>
      </section>

      <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-primary)', padding: '48px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--bg-accent), var(--bg-accent-hover))', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '16/10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {course.image ? <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: '64px', color: 'white' }}>📘</div>}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500, background: levelColors.bg, color: levelColors.text, border: `1px solid ${levelColors.border}` }}>{course.level}</span>
                <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600, color: course.price === 'free' ? '#15803d' : '#2563eb' }}>{course.price === 'free' ? '✓ FREE' : '💎 PREMIUM'}</span>
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.2 }}>{course.title}</h1>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>{course.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-accent)' }}>{course.duration || 'N/A'}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Duration</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-accent)' }}>{course.lessons || course.topics || 0}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lessons</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-accent)' }}>{course.studentsCount || 0}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Students</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-accent)' }}>⭐ {course.rating || 0}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Rating</div>
                </div>
              </div>
              {course.tags && course.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {course.tags.map((tag, index) => (<span key={index} style={{ padding: '4px 12px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-full)', fontSize: '13px' }}>{tag}</span>))}
                </div>
              )}
              <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px', fontWeight: 600 }}>Start Learning →</button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
            <div>
              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>What You&apos;ll Learn</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {course.learningObjectives.map((objective, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ color: 'var(--success)', fontSize: '16px' }}>✓</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Course Content</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[{ title: `Introduction to ${course.title}`, desc: 'Course overview', time: '15 min' }, { title: 'Core Concepts', desc: 'Fundamental concepts', time: '45 min' }, { title: 'Practical Examples', desc: 'Hands-on coding', time: '1h 30min' }].map((item, idx) => (
                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: 'var(--text-accent)' }}>▶</span>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.desc}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="card" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Prerequisites</h2>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        <span style={{ color: 'var(--info)' }}>ℹ</span>{prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Course Instructor</h3>
                {course.instructor && typeof course.instructor === 'object' ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '18px', overflow: 'hidden' }}>
                        {course.instructor.avatar ? <img src={course.instructor.avatar} alt={course.instructor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (course.instructor.name?.charAt(0) || 'T')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.instructor.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{course.instructor.title || 'Instructor'}</div>
                      </div>
                    </div>
                    {course.instructor.bio && <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>{course.instructor.bio}</p>}
                    <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Rating</span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>⭐ {course.instructor.rating || 'N/A'}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Students</span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{course.instructor.students?.toLocaleString() || 'N/A'}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span style={{ color: 'var(--text-muted)' }}>Courses</span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{course.instructor.courses || 'N/A'}</span></div>
                    </div>
                  </>
                ) : <div style={{ color: 'var(--text-secondary)' }}>{typeof course.instructor === 'string' ? course.instructor : 'TechTooTalk Academy'}</div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
