'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: string;
  title: string;
  description: string;
  technology: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  topics: number;
  thumbnail?: string;
  image?: string;
  featured?: boolean;
  slug: string;
}

interface CourseGridProps {
  courses: Course[];
  showLoadMore?: boolean;
  allCourses?: Course[];
}

export default function CourseGrid({ courses: initialCourses, showLoadMore = false, allCourses }: CourseGridProps) {
  const [displayedCourses, setDisplayedCourses] = useState(initialCourses);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDisplayedCourses(initialCourses);
  }, [initialCourses]);

  const handleLoadMore = async () => {
    if (!allCourses) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const currentCount = displayedCourses.length;
    const nextCourses = allCourses.slice(currentCount, currentCount + 6);
    setDisplayedCourses(prev => [...prev, ...nextCourses]);
    setLoading(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'Intermediate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'Advanced': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  if (loading && displayedCourses.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-slate-700" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16" />
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCourses.map((course) => (
          <Link
            key={course.id}
            href={`/${course.technology}/${course.slug}`}
            className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700"
          >
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl text-white/80">📚</span>
                </div>
              )}

              {course.featured && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                  FEATURED
                </div>
              )}

              <div className="absolute bottom-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {course.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📖</span>
                    <span>{course.topics} lessons</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showLoadMore && allCourses && displayedCourses.length < allCourses.length && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More Courses'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
