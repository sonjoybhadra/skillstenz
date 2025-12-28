'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../../components/Layout';
import { coursesAPI, technologiesAPI, Course, Technology } from '../../../../lib/api';
import Spinner from '../../../../components/UI/Spinner';

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
        const [courseResult, techResult] = await Promise.all([
          coursesAPI.getBySlug(courseSlug),
          technologiesAPI.getBySlug(technology)
        ]);

        if (courseResult.error || !courseResult.data) {
          setError('Course not found');
          return;
        }
        if (techResult.error || !techResult.data) {
          setError('Technology not found');
          return;
        }

        setCourse(courseResult.data);
        setTechnologyData(techResult.data);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug && technology) {
      fetchData();
    }
  }, [courseSlug, technology]);

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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !course || !technologyData) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Course not found'}
          </h1>
          <Link href={`/${technology}/courses`} className="text-blue-600 hover:underline">
            Back to Courses
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
              <i className="fas fa-home mr-1"></i>
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${technology}`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
              {technologyData.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">{course.title}</span>
          </nav>
        </div>
      </section>

      {/* Course Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Image */}
            <div className="lg:w-1/3">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.image || '/placeholder-course.jpg'}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.price === 'free' ? 'text-green-600' : 'text-blue-600'}`}>
                  {course.price === 'free' ? 'FREE' : 'PAID'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{course.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{course.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{course.duration || 'N/A'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{course.lessons || course.topics || 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{course.studentsCount || 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{course.rating || 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags?.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <Link 
                href={`/${technology}/${courseSlug}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What You&apos;ll Learn</h2>
                {course.learningObjectives && course.learningObjectives.length > 0 ? (
                  <ul className="space-y-3">
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">Learning objectives will be available soon.</p>
                )}
              </div>

              {/* Course Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Content</h2>
                <div className="space-y-4">
                  <div className="text-gray-600 dark:text-gray-400 mb-4">
                    {course.lessons || course.topics || 0} lessons • {course.duration || 'Duration TBA'}
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-play-circle text-blue-500 mr-3"></i>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Introduction to {course.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Course overview and prerequisites</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">15 min</div>
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-play-circle text-blue-500 mr-3"></i>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Core Concepts</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Fundamental concepts and theory</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">45 min</div>
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-play-circle text-blue-500 mr-3"></i>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Practical Examples</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Hands-on coding examples</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">1h 30min</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Prerequisites</h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fas fa-info-circle text-blue-500 mt-1 mr-3"></i>
                        <span className="text-gray-700 dark:text-gray-300">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Course Instructor</h3>
                {course.instructor && typeof course.instructor === 'object' && 'name' in course.instructor ? (
                  <>
                    <div className="flex items-center mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(course.instructor as { avatar?: string }).avatar || '/placeholder-avatar.jpg'}
                        alt={(course.instructor as { name: string }).name}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{(course.instructor as { name: string }).name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{(course.instructor as { title?: string }).title}</div>
                      </div>
                    </div>
                    {(course.instructor as { bio?: string }).bio && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{(course.instructor as { bio: string }).bio}</p>
                    )}
                  </>
                ) : (
                  <div className="text-gray-700 dark:text-gray-300">
                    {typeof course.instructor === 'string' ? course.instructor : 'TechToTalk Academy'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}