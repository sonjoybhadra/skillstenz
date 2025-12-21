'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../components/Layout';
import CourseGrid from '../../components/CourseGrid';

interface Technology {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  votes?: { upvotes: number; downvotes: number; };
  views?: number;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  level: string;
  duration?: number;
  pricing?: { type: string; price?: number; };
  views?: number;
  rating?: { average: number; count: number; };
  instructor?: { name: string; };
  technology?: Technology;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TechnologyPage() {
  const params = useParams();
  const technology = params?.technology as string;
  const [tech, setTech] = useState<Technology | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!technology) return;
      try {
        // Fetch technology by slug
        const techRes = await fetch(`${API_URL}/technologies/slug/${technology}`);
        if (techRes.ok) {
          const techData = await techRes.json();
          setTech(techData.technology || techData);
          
          // Fetch courses for this technology
          const courseRes = await fetch(`${API_URL}/courses?technology=${techData.technology?._id || techData._id}`);
          if (courseRes.ok) {
            const courseData = await courseRes.json();
            setCourses(courseData.courses || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [technology]);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!tech) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
          <p style={{ color: 'var(--text-muted)' }}>Technology not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Technology Header */}
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', padding: '48px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: tech.color || 'var(--accent-primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>
            {tech.icon || '📚'}
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            {tech.name} Courses
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px' }}>
            {tech.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            <span style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '20px', fontSize: '14px' }}>
              📚 {courses.length} Courses
            </span>
            <span style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '14px' }}>
              👁️ {tech.views || 0} Views
            </span>
            <span style={{ padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '20px', fontSize: '14px' }}>
              ⬆️ {tech.votes?.upvotes || 0} Votes
            </span>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          {courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '18px' }}>No courses available yet for {tech.name}.</p>
              <p style={{ marginTop: '8px' }}>Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {courses.map((course) => (
                <a key={course._id} href={`/${technology}/${course.slug}`} className="card" style={{ textDecoration: 'none', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  {course.thumbnail && (
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{course.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {course.shortDescription || course.description}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <span style={{ textTransform: 'capitalize' }}>📊 {course.level}</span>
                      <span>⭐ {course.rating?.average?.toFixed(1) || '0.0'}</span>
                      <span>{course.pricing?.type === 'paid' ? `💵 $${course.pricing.price}` : '🆓 Free'}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}