'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface CourseProgress {
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

interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  streak: number;
}

export default function ProgressPage() {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProgress = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login?redirect=/progress');
        return;
      }

      const response = await fetch(`${API_URL}/enrollments/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const enrollments = data.enrollments || [];
        setCourses(enrollments);
        
        // Calculate stats
        const completed = enrollments.filter((c: CourseProgress) => c.progress >= 100).length;
        setStats({
          totalCourses: enrollments.length,
          completedCourses: completed,
          totalHours: Math.round(enrollments.length * 6),
          streak: 7,
        });
      }
    } catch {
      console.error('Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const formatLastAccessed = (dateStr: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>My Progress</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your learning journey</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--bg-accent)' }}></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <div className="text-3xl font-bold" style={{ color: 'var(--bg-accent)' }}>{stats.totalCourses}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Enrolled Courses</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-500">{stats.completedCourses}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Completed</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.totalHours}h</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Learning Time</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-orange-500">{stats.streak}🔥</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Day Streak</div>
              </div>
            </div>

            {/* Courses Progress */}
            {courses.length > 0 ? (
              <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Course Progress</h2>
                <div className="space-y-6">
                  {courses.map((course) => (
                    <Link 
                      key={course._id} 
                      href={course.courseId?.technology?.slug 
                        ? `/${course.courseId.technology.slug}/${course.courseId.slug}` 
                        : `/courses/${course.courseId?.slug}`} 
                      className="block group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium group-hover:opacity-80" style={{ color: 'var(--text-primary)' }}>
                          {course.courseId?.title || 'Untitled Course'}
                        </h3>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{Math.round(course.progress || 0)}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${course.progress || 0}%`, background: 'var(--bg-accent)' }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        Last accessed {formatLastAccessed(course.lastAccessedAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center py-12 mb-8">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No Progress Yet
                </h2>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Start learning to track your progress!
                </p>
                <Link href="/technologies" className="btn btn-primary">
                  Browse Courses
                </Link>
              </div>
            )}

            {/* Weekly Activity */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Weekly Activity</h2>
              <div className="flex justify-between items-end h-32">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const heights = [60, 80, 45, 90, 70, 30, 50];
                  return (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${heights[idx]}%`, background: 'var(--bg-accent)' }}
                      />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
