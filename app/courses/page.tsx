'use client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coursesAPI, Course } from '../../lib/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await coursesAPI.getAll({ limit: 50 });
        if (data && !error && data.courses) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getCourseIcon = (slug: string): string => {
    const icons: Record<string, string> = {
      'python': '🐍', 'javascript': '🟨', 'react': '⚛️', 'nodejs': '🟢',
      'java': '☕', 'typescript': '🔷', 'sql': '🗃️', 'ai': '🤖', 'default': '📘'
    };
    return icons[slug?.split('-')[0]] || icons['default'];
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.technologyName && course.technologyName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || course.level?.toLowerCase() === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse <span className="text-blue-400">Courses</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Learn from our comprehensive collection of courses designed for all skill levels
          </p>
          
          <div className="max-w-md mx-auto relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Level Tabs */}
      <section className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2 py-4 overflow-x-auto">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedLevel === level.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? 'Loading...' : `${filteredCourses.length} Courses Available`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">No courses found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link 
                  key={course._id} 
                  href={`/courses/${course.slug}`} 
                  className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-36 bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-5xl">
                    {getCourseIcon(course.slug)}
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                        {course.technologyName || 'General'}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded">
                        {course.level || 'Beginner'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span>📚</span> {course.topicsCount || course.topics || course.lessonsCount || 0} topics
                      </span>
                      <span className="flex items-center gap-1">
                        <span>👥</span> {course.studentsCount?.toLocaleString() || 0} students
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
