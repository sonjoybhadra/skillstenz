'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const coursesData: Record<string, { title: string; description: string; instructor: string; duration: string; lessons: number; level: string; topics: { title: string; lessons: { title: string; duration: string }[] }[] }> = {
  'dsa': {
    title: 'Data Structures & Algorithms',
    description: 'Master DSA for coding interviews and competitive programming',
    instructor: 'Tech Expert',
    duration: '40 hours',
    lessons: 120,
    level: 'Intermediate',
    topics: [
      { title: 'Arrays & Strings', lessons: [{ title: 'Introduction to Arrays', duration: '15 min' }, { title: 'Array Operations', duration: '20 min' }, { title: 'String Manipulation', duration: '25 min' }] },
      { title: 'Linked Lists', lessons: [{ title: 'Singly Linked List', duration: '20 min' }, { title: 'Doubly Linked List', duration: '20 min' }, { title: 'Circular Linked List', duration: '15 min' }] },
      { title: 'Trees & Graphs', lessons: [{ title: 'Binary Trees', duration: '25 min' }, { title: 'BST Operations', duration: '30 min' }, { title: 'Graph Traversal', duration: '35 min' }] },
      { title: 'Dynamic Programming', lessons: [{ title: 'DP Fundamentals', duration: '30 min' }, { title: 'Classic DP Problems', duration: '45 min' }, { title: 'Advanced DP', duration: '40 min' }] },
    ]
  },
  'javascript': {
    title: 'Complete JavaScript Course',
    description: 'From zero to hero in JavaScript programming',
    instructor: 'JS Master',
    duration: '35 hours',
    lessons: 100,
    level: 'Beginner',
    topics: [
      { title: 'JavaScript Basics', lessons: [{ title: 'Variables & Types', duration: '20 min' }, { title: 'Operators', duration: '15 min' }, { title: 'Control Flow', duration: '25 min' }] },
      { title: 'Functions', lessons: [{ title: 'Function Basics', duration: '20 min' }, { title: 'Arrow Functions', duration: '15 min' }, { title: 'Closures', duration: '25 min' }] },
      { title: 'DOM Manipulation', lessons: [{ title: 'Selecting Elements', duration: '15 min' }, { title: 'Event Handling', duration: '25 min' }, { title: 'DOM Projects', duration: '45 min' }] },
      { title: 'Async JavaScript', lessons: [{ title: 'Promises', duration: '25 min' }, { title: 'Async/Await', duration: '20 min' }, { title: 'Fetch API', duration: '30 min' }] },
    ]
  },
  'python': {
    title: 'Python Programming Masterclass',
    description: 'Learn Python from scratch to advanced level',
    instructor: 'Python Pro',
    duration: '45 hours',
    lessons: 150,
    level: 'Beginner',
    topics: [
      { title: 'Python Basics', lessons: [{ title: 'Installation & Setup', duration: '10 min' }, { title: 'Variables & Data Types', duration: '20 min' }, { title: 'Operators', duration: '15 min' }] },
      { title: 'Control Flow', lessons: [{ title: 'If Statements', duration: '15 min' }, { title: 'Loops', duration: '25 min' }, { title: 'Exception Handling', duration: '20 min' }] },
      { title: 'Functions & OOP', lessons: [{ title: 'Functions', duration: '25 min' }, { title: 'Classes & Objects', duration: '30 min' }, { title: 'Inheritance', duration: '25 min' }] },
      { title: 'Advanced Python', lessons: [{ title: 'Decorators', duration: '20 min' }, { title: 'Generators', duration: '20 min' }, { title: 'File Handling', duration: '25 min' }] },
    ]
  },
  'react': {
    title: 'React - The Complete Guide',
    description: 'Build modern web applications with React',
    instructor: 'React Expert',
    duration: '50 hours',
    lessons: 180,
    level: 'Intermediate',
    topics: [
      { title: 'React Fundamentals', lessons: [{ title: 'JSX & Components', duration: '25 min' }, { title: 'Props & State', duration: '30 min' }, { title: 'Event Handling', duration: '20 min' }] },
      { title: 'Hooks', lessons: [{ title: 'useState & useEffect', duration: '30 min' }, { title: 'useContext', duration: '25 min' }, { title: 'Custom Hooks', duration: '30 min' }] },
      { title: 'State Management', lessons: [{ title: 'Context API', duration: '25 min' }, { title: 'Redux Basics', duration: '35 min' }, { title: 'Redux Toolkit', duration: '30 min' }] },
      { title: 'Advanced Topics', lessons: [{ title: 'Performance', duration: '25 min' }, { title: 'Testing', duration: '35 min' }, { title: 'Next.js Intro', duration: '40 min' }] },
    ]
  },
  'machine-learning': {
    title: 'Machine Learning A-Z',
    description: 'Complete machine learning with Python',
    instructor: 'ML Expert',
    duration: '60 hours',
    lessons: 200,
    level: 'Advanced',
    topics: [
      { title: 'ML Foundations', lessons: [{ title: 'Introduction to ML', duration: '20 min' }, { title: 'Python for ML', duration: '30 min' }, { title: 'NumPy & Pandas', duration: '35 min' }] },
      { title: 'Supervised Learning', lessons: [{ title: 'Linear Regression', duration: '30 min' }, { title: 'Classification', duration: '35 min' }, { title: 'Decision Trees', duration: '30 min' }] },
      { title: 'Unsupervised Learning', lessons: [{ title: 'Clustering', duration: '30 min' }, { title: 'Dimensionality Reduction', duration: '35 min' }, { title: 'Association Rules', duration: '25 min' }] },
      { title: 'Deep Learning', lessons: [{ title: 'Neural Networks', duration: '40 min' }, { title: 'CNN', duration: '45 min' }, { title: 'RNN', duration: '40 min' }] },
    ]
  },
};

export default function CoursePage() {
  const params = useParams();
  const slug = params.slug as string;
  const course = coursesData[slug];

  if (!course) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Course Not Found</h1>
            <p className="text-[var(--muted-foreground)] mb-6">The course you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/courses" className="btn-primary">
              Browse All Courses
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Home</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <Link href="/courses" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Courses</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <span className="text-[var(--foreground)]">{course.title}</span>
        </nav>

        {/* Header */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 bg-[var(--primary)] text-white text-sm rounded-full">{course.level}</span>
            <span className="px-3 py-1 bg-[var(--muted)] text-[var(--foreground)] text-sm rounded-full">{course.duration}</span>
            <span className="px-3 py-1 bg-[var(--muted)] text-[var(--foreground)] text-sm rounded-full">{course.lessons} Lessons</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">{course.title}</h1>
          <p className="text-lg text-[var(--muted-foreground)] mb-4">{course.description}</p>
          <p className="text-sm text-[var(--muted-foreground)]">Instructor: <span className="text-[var(--foreground)] font-medium">{course.instructor}</span></p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Course
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save for Later
          </button>
        </div>

        {/* Course Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Course Content</h2>
          <div className="space-y-4">
            {course.topics.map((topic, index) => (
              <div key={index} className="card">
                <button className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{topic.title}</h3>
                  </div>
                  <span className="text-sm text-[var(--muted-foreground)]">{topic.lessons.length} lessons</span>
                </button>
                <div className="mt-4 pl-11 space-y-2">
                  {topic.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                        <span className="text-[var(--foreground)]">{lesson.title}</span>
                      </div>
                      <span className="text-sm text-[var(--muted-foreground)]">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Related Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(coursesData)
              .filter(([key]) => key !== slug)
              .slice(0, 4)
              .map(([key, c]) => (
                <Link key={key} href={`/courses/${key}`} className="card hover:border-[var(--primary)] transition-colors">
                  <h3 className="font-medium text-[var(--foreground)]">{c.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{c.level} • {c.duration}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
