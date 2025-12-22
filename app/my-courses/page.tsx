'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Continue learning from where you left off</p>
          </div>
          <Link 
            href="/technologies" 
            className="inline-block px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Browse More Courses
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-center py-16 px-6">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              No Enrolled Courses Yet
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Start your learning journey by enrolling in a course!
            </p>
            <Link 
              href="/technologies" 
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            {/* In Progress */}
            {inProgressCourses.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                  In Progress ({inProgressCourses.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressCourses.map((enrollment) => (
                    <div 
                      key={enrollment._id} 
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 group"
                    >
                      <div className="h-32 bg-gray-100 dark:bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-4xl">📚</span>
                      </div>
                      
                      <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">
                        {enrollment.courseId?.title || 'Untitled Course'}
                      </h3>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="text-gray-900 dark:text-white">{Math.round(enrollment.progress || 0)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      
                      <Link 
                        href={enrollment.courseId?.technology?.slug 
                          ? `/${enrollment.courseId.technology.slug}/${enrollment.courseId.slug}` 
                          : `/courses/${enrollment.courseId?.slug}`} 
                        className="block w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-center font-medium rounded-lg transition-colors"
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
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                  Completed ({completedCourses.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {completedCourses.map((enrollment) => (
                    <div 
                      key={enrollment._id} 
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="text-3xl">✅</div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {enrollment.courseId?.title || 'Untitled'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
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
