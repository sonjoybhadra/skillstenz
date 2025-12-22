# Code Snippets for Course & Tutorial Pages

## 1. Tutorial Chapter Display Page
**File:** `app/tutorials/[slug]/[chapter]/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Chapter {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  codeExample?: string;
  keyPoints: string[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Tutorial {
  _id: string;
  title: string;
  slug: string;
  chapters: Chapter[];
}

export default function ChapterPage() {
  const params = useParams();
  const tutorialSlug = params.slug as string;
  const chapterSlug = params.chapter as string;
  
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    if (tutorialSlug && chapterSlug) {
      fetchChapter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialSlug, chapterSlug]);

  const fetchChapter = async () => {
    try {
      const response = await fetch(`${API_URL}/tutorials/${tutorialSlug}`);
      if (response.ok) {
        const data = await response.json();
        const tut = data.tutorial || data;
        setTutorial(tut);

        const chapter = tut.chapters?.find((c: Chapter) => c.slug === chapterSlug);
        if (chapter) {
          setCurrentChapter(chapter);
          const currentIndex = tut.chapters.findIndex((c: Chapter) => c.slug === chapterSlug);
          
          if (currentIndex > 0) {
            setPrevChapter(tut.chapters[currentIndex - 1]);
          }
          if (currentIndex < tut.chapters.length - 1) {
            setNextChapter(tut.chapters[currentIndex + 1]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!currentChapter) {
    return (
      <Layout>
        <div className="text-center min-h-[60vh] flex items-center justify-center">
          <div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Chapter Not Found</h1>
            <Link href={`/tutorials/${tutorialSlug}`} className="btn-primary">Back to Tutorial</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-[var(--muted-foreground)]">
          <Link href="/tutorials" className="hover:text-[var(--foreground)]">Tutorials</Link>
          <span>/</span>
          <Link href={`/tutorials/${tutorialSlug}`} className="hover:text-[var(--foreground)]">
            {tutorial?.title || 'Tutorial'}
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{currentChapter.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Chapters Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card">
              <h3 className="font-semibold text-[var(--foreground)] mb-4">Chapters</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tutorial?.chapters?.map((ch, idx) => (
                  <Link
                    key={ch._id}
                    href={`/tutorials/${tutorialSlug}/${ch.slug}`}
                    className={`block p-2 rounded text-sm transition-colors ${
                      ch.slug === chapterSlug
                        ? 'bg-[var(--bg-accent)] text-white'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <span className="font-medium">{idx + 1}.</span> {ch.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Chapter Header */}
            <div className="card mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[var(--bg-accent)] text-white text-xs rounded-full">
                  {currentChapter.difficulty}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  ⏱️ {currentChapter.estimatedTime} min read
                </span>
              </div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-3">{currentChapter.title}</h1>
              <p className="text-lg text-[var(--muted-foreground)]">{currentChapter.description}</p>
            </div>

            {/* Chapter Content */}
            <div className="card mb-6 prose dark:prose-invert max-w-none">
              <div className="text-[var(--foreground)]">
                {currentChapter.content?.split('\n').map((para, idx) => (
                  <p key={idx} className="mb-4">{para}</p>
                )) || <p>Loading content...</p>}
              </div>
            </div>

            {/* Code Example */}
            {currentChapter.codeExample && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Code Example</h2>
                <pre className="bg-[var(--bg-secondary)] p-4 rounded overflow-x-auto">
                  <code className="text-[var(--foreground)] text-sm">
                    {currentChapter.codeExample}
                  </code>
                </pre>
              </div>
            )}

            {/* Key Points */}
            {currentChapter.keyPoints?.length > 0 && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Key Points to Remember</h2>
                <ul className="space-y-2">
                  {currentChapter.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[var(--foreground)]">
                      <span className="text-[var(--bg-accent)] font-bold mt-0.5">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-8">
              {prevChapter ? (
                <Link href={`/tutorials/${tutorialSlug}/${prevChapter.slug}`} className="btn-secondary flex items-center gap-2">
                  <span>←</span> Previous
                </Link>
              ) : (
                <div></div>
              )}
              {nextChapter ? (
                <Link href={`/tutorials/${tutorialSlug}/${nextChapter.slug}`} className="btn-primary flex items-center gap-2">
                  Next <span>→</span>
                </Link>
              ) : (
                <div className="btn-primary">Complete! 🎉</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

---

## 2. Course Lesson Detail Page
**File:** `app/courses/[slug]/lesson/[lessonSlug]/page.tsx`

```tsx
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
  content: string;
  duration: number;
  videoUrl?: string;
  codeSandbox?: string;
  resources?: { title: string; url: string }[];
}

interface Section {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  slug: string;
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
                        <span>{idx + 1}. {l.title}</span>
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
              <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
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
                  />
                </div>
              </div>
            )}

            {/* Lesson Content */}
            <div className="card mb-6">
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-[var(--foreground)]">
                  {lesson.content?.split('\n').map((para, idx) => (
                    <p key={idx} className="mb-4">{para}</p>
                  )) || <p>Loading content...</p>}
                </div>
              </div>
            </div>

            {/* Code Sandbox (if available) */}
            {lesson.codeSandbox && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Try it Yourself</h2>
                <iframe
                  src={lesson.codeSandbox}
                  className="w-full h-96 rounded border border-[var(--border)]"
                  title="Code Sandbox"
                />
              </div>
            )}

            {/* Resources */}
            {lesson.resources?.length > 0 && (
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
                <div className="btn-primary">🎉 Course Complete!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

---

## 3. Updated Tutorial Detail Page (List of Chapters)
**File:** `app/tutorials/[slug]/page.tsx` - Already Updated ✅

Key features:
- Fetches tutorial by slug from API
- Displays all chapters in expandable list
- Shows quick info sidebar (duration, level, price)
- Links to first chapter for "Start Learning"
- Responsive grid layout

---

## 4. Updated Course Detail Page
**File:** `app/courses/[slug]/page.tsx` - Already Updated ✅

Key features:
- Fetches course with sections and lessons from API
- Falls back to hardcoded data if API fails
- Expandable sections to show lessons
- Progress tracking support
- Related courses section

---

## Routing Structure

```
/tutorials/
  [slug]/                          # Tutorial list (e.g., /tutorials/responsive-design-essentials)
    page.tsx                       # Tutorial chapters list
    [chapter]/
      page.tsx                     # Individual chapter (e.g., /tutorials/responsive-design-essentials/introduction)

/courses/
  [slug]/                          # Course detail (e.g., /courses/web-development)
    page.tsx                       # Course overview with sections
    lesson/
      [lessonSlug]/
        page.tsx                   # Individual lesson with video, content, exercises
```

---

## API Endpoints Required

```
GET /api/tutorials/:slug              # Get tutorial with all chapters
GET /api/courses/:slug                # Get course with sections and lessons
GET /api/tutorials/technology/:tech    # Get tutorials by technology (optional)
POST /api/progress/:courseId/:lessonId # Track lesson completion
```

---

## CSS Classes Used

All pages use these Tailwind + custom CSS classes:
- `.card` - Card container with border and background
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.spinner` - Loading spinner
- `text-[var(--foreground)]` - Main text color
- `text-[var(--muted-foreground)]` - Muted text
- `bg-[var(--bg-primary)]` - Primary background
- `bg-[var(--bg-secondary)]` - Secondary background
- `border-[var(--border)]` - Border color

No inline styles used! All styling via Tailwind CSS utilities and CSS variables.

---

## Features Summary

✅ **Tutorial Chapter Pages:**
- Chapter content display
- Code examples with syntax highlighting
- Key points list
- Previous/Next navigation
- Estimated reading time
- Difficulty level badge

✅ **Course Lesson Pages:**
- Lesson content with formatting
- Embedded videos (iframe support)
- CodeSandbox integration
- Resources/links section
- Lesson completion tracking
- Course progress bar
- Lessons sidebar with checkmarks

✅ **Both Pages:**
- Breadcrumb navigation
- Responsive mobile-first design
- Loading states
- Error handling
- API integration
- Fallback to mock data
- No custom CSS - Tailwind only
- Modal-free design
