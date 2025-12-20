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

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentCount = displayedCourses.length;
    const nextCourses = allCourses.slice(currentCount, currentCount + 6);

    setDisplayedCourses(prev => [...prev, ...nextCourses]);
    setLoading(false);
  };

  const courses = displayedCourses;
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (technology: string) => {
    const icons: { [key: string]: string } = {
      python: 'fa-python',
      javascript: 'fa-js',
      react: 'fa-react',
      nodejs: 'fa-node-js',
      ai: 'fa-brain',
      database: 'fa-database',
      default: 'fa-code'
    };
    return icons[technology] || icons.default;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
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
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/${course.technology}/${course.slug}`}
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
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
                  <i className={`fab ${getCategoryIcon(course.technology)} text-4xl text-white/80`}></i>
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
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {course.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-clock"></i>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-list"></i>
                    <span>{course.topics} topics</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className={`fab ${getCategoryIcon(course.technology)} text-blue-500`}></i>      
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {course.technology}
                  </span>
                </div>

                <div className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
                  Learn More →
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
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading...
              </>
            ) : (
              <>
                Load More Courses
                <i className="fas fa-arrow-down ml-2"></i>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}