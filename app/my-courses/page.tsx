'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface EnrolledCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    slug: string;
    technology?: {
      slug: string;
    };
  };
  progress: number;
  lastAccessedAt: string;
  completedTopics: string[];
}

export default function MyCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login?redirect=/my-courses');
        return;
      }

      const response = await fetch(`${API_URL}/enrollments/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.enrollments || []);
      }
    } catch {
      console.error('Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  const inProgressCourses = enrolledCourses.filter(c => c.progress < 100);
  const completedCourses = enrolledCourses.filter(c => c.progress >= 100);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Courses</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Continue learning from where you left off</p>
          </div>
          <Link href="/technologies" className="btn btn-primary">
            Browse More Courses
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--bg-accent)' }}></div>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              No Enrolled Courses Yet
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Start your learning journey by enrolling in a course!
            </p>
            <Link href="/technologies" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            {/* In Progress */}
            {inProgressCourses.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                  In Progress ({inProgressCourses.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressCourses.map((enrollment) => (
                    <div key={enrollment._id} className="card group">
                      <div className="h-32 rounded-lg mb-4 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                        <span className="text-4xl">📚</span>
                      </div>
                      
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {enrollment.courseId?.title || 'Untitled Course'}
                      </h3>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                          <span style={{ color: 'var(--text-primary)' }}>{Math.round(enrollment.progress || 0)}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${enrollment.progress || 0}%`, background: 'var(--bg-accent)' }}
                          />
                        </div>
                      </div>
                      
                      <Link 
                        href={enrollment.courseId?.technology?.slug 
                          ? `/${enrollment.courseId.technology.slug}/${enrollment.courseId.slug}` 
                          : `/courses/${enrollment.courseId?.slug}`} 
                        className="btn btn-primary w-full text-center"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Completed */}
            {completedCourses.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                  Completed ({completedCourses.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {completedCourses.map((enrollment) => (
                    <div key={enrollment._id} className="card flex items-center gap-4">
                      <div className="text-3xl">✅</div>
                      <div>
                        <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {enrollment.courseId?.title || 'Untitled'}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
