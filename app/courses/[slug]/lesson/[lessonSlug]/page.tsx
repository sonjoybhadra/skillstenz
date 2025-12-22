'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Lesson {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  duration: number;
  videoUrl?: string;
  codeSandbox?: string;
  resources?: { title: string; url: string }[];
  order: number;
}

interface Section {
  _id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  sections: Section[];
}

export default function LessonPage() {
  const params = useParams();
  const courseSlug = params.slug as string;
  const lessonSlug = params.lessonSlug as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [allLessons, setAllLessons] = useState<Array<Lesson & { sectionId: string }>>([]);

  useEffect(() => {
    if (courseSlug && lessonSlug) {
      fetchLesson();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, lessonSlug]);

  const fetchLesson = async () => {
    try {
      const response = await fetch(`${API_URL}/courses/${courseSlug}`);
      if (response.ok) {
        const data = await response.json();
        const course = data.course || data;
        setCourse(course);

        // Find lesson and all lessons
        let foundLesson = null;
        const lessons: Array<Lesson & { sectionId: string }> = [];
        
        course.sections?.forEach((section: Section) => {
          section.lessons?.forEach((les: Lesson) => {
            lessons.push({ ...les, sectionId: section._id });
            if (les.slug === lessonSlug) {
              foundLesson = les;
            }
          });
        });

        setAllLessons(lessons);
        setLesson(foundLesson);

        // Load completed lessons from localStorage
        const completed = JSON.parse(localStorage.getItem(`${courseSlug}_completed`) || '[]');
        setCompletedLessons(new Set(completed));
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = () => {
    if (lesson) {
      const newCompleted = new Set(completedLessons);
      newCompleted.add(lesson._id);
      setCompletedLessons(newCompleted);
      localStorage.setItem(`${courseSlug}_completed`, JSON.stringify([...newCompleted]));
    }
  };

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l.slug === lessonSlug);
  };

  const currentIndex = getCurrentLessonIndex();
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!lesson) {
    return (
      <Layout>
        <div className="text-center min-h-[60vh] flex items-center justify-center">
          <div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Lesson Not Found</h1>
            <Link href={`/courses/${courseSlug}`} className="btn-primary">Back to Course</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const progress = Math.round((completedLessons.size / allLessons.length) * 100);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Course Progress */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Course Info */}
              <div className="card">
                <Link href={`/courses/${courseSlug}`} className="text-sm text-[var(--bg-accent)] hover:underline mb-3 inline-block">
                  ← Back to Course
                </Link>
                <h3 className="font-semibold text-[var(--foreground)] mb-3">{course?.title}</h3>
                <div className="mb-3">
                  <div className="text-xs text-[var(--muted-foreground)] mb-1">{completedLessons.size} / {allLessons.length} Complete</div>
                  <div className="w-full bg-[var(--bg-secondary)] rounded h-2">
                    <div 
                      className="bg-[var(--bg-accent)] h-2 rounded transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">{progress}% progress</div>
              </div>

              {/* Lessons List */}
              <div className="card">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">Lessons</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allLessons.map((l, idx) => (
                    <Link
                      key={l._id}
                      href={`/courses/${courseSlug}/lesson/${l.slug}`}
                      className={`block p-2 rounded text-sm transition-colors ${
                        l.slug === lessonSlug
                          ? 'bg-[var(--bg-accent)] text-white'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {completedLessons.has(l._id) && <span className="text-green-500">✓</span>}
                        <span className="text-xs">{idx + 1}. {l.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="card mb-6">
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-3">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] flex-wrap">
                <span>⏱️ {lesson.duration} minutes</span>
                {completedLessons.has(lesson._id) && (
                  <span className="text-green-500 font-semibold">✓ Completed</span>
                )}
              </div>
            </div>

            {/* Video (if available) */}
            {lesson.videoUrl && (
              <div className="card mb-6">
                <div className="aspect-video bg-[var(--bg-secondary)] rounded overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div className="card mb-6">
                <div className="text-[var(--foreground)] leading-relaxed">
                  {lesson.content.split('\n\n').map((para, idx) => (
                    <p key={idx} className="mb-4 text-base">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Code Sandbox (if available) */}
            {lesson.codeSandbox && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Try it Yourself</h2>
                <iframe
                  src={lesson.codeSandbox}
                  className="w-full h-96 rounded border border-[var(--border)]"
                  title="Code Sandbox"
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; payment; usb"
                />
              </div>
            )}

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Resources</h2>
                <ul className="space-y-2">
                  {lesson.resources.map((res, idx) => (
                    <li key={idx}>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--bg-accent)] hover:underline flex items-center gap-2"
                      >
                        📎 {res.title}
                        <span className="text-xs">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mark Complete Button */}
            {!completedLessons.has(lesson._id) && (
              <button
                onClick={markComplete}
                className="btn-primary w-full mb-6 flex items-center justify-center gap-2"
              >
                ✓ Mark as Complete
              </button>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              {prevLesson ? (
                <Link 
                  href={`/courses/${courseSlug}/lesson/${prevLesson.slug}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  ← Previous Lesson
                </Link>
              ) : (
                <div></div>
              )}
              {nextLesson ? (
                <Link 
                  href={`/courses/${courseSlug}/lesson/${nextLesson.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Next Lesson →
                </Link>
              ) : (
                <div className="btn-primary text-center w-full">🎉 Course Complete!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
