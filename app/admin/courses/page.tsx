'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichContentEditor = dynamic(() => import('@/components/UI/RichContentEditor'), {
  ssr: false,
  loading: () => <div className="p-5 text-center text-[var(--text-muted)]">Loading Editor...</div>
});

const ContentImporter = dynamic(() => import('@/components/UI/ContentImporter'), {
  ssr: false,
  loading: () => <div className="p-5 text-center text-[var(--text-muted)]">Loading Importer...</div>
});

interface Lesson {
  _id?: string;
  title: string;
  contentType: 'video' | 'article' | 'quiz' | 'code';
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo' | 'custom';
  videoDuration?: number;
  content?: string;
  isFree?: boolean;
  order: number;
}

interface Section {
  _id?: string;
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
  shortDescription?: string;
  thumbnail?: string;
  previewVideo?: string;
  technology?: { _id: string; name: string; icon: string; slug: string; };
  instructor?: { _id: string; name: string; profileImage?: string; };
  level: string;
  duration?: number;
  language?: string;
  pricing: { type: string; price?: number; };
  sections: Section[];
  views: number;
  votes: { upvotes: number; downvotes: number; };
  rating: { average: number; count: number; };
  isPublished: boolean;
  featured: boolean;
  createdAt: string;
}

interface Technology {
  _id: string;
  name: string;
  icon: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const LEVELS = ['beginner', 'intermediate', 'advanced', 'all-levels'];
const CONTENT_TYPES = [
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'article', label: 'Article', icon: '📝' },
  { value: 'quiz', label: 'Quiz', icon: '❓' },
  { value: 'code', label: 'Code', icon: '💻' }
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSection, setEditingSection] = useState<{courseId: string; sectionIndex: number} | null>(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', shortDescription: '', thumbnail: '',
    previewVideo: '', technology: '', level: 'beginner', language: 'English',
    pricingType: 'free', price: 0, isPublished: true, featured: false,
    learningObjectives: '', requirements: '', targetAudience: ''
  });
  const [sectionData, setSectionData] = useState({ title: '', description: '' });
  const [lessonData, setLessonData] = useState<{ title: string; contentType: 'video' | 'article' | 'quiz' | 'code'; videoUrl: string; videoProvider: string; videoDuration: number; content: string; isFree: boolean }>({ title: '', contentType: 'video', videoUrl: '', videoProvider: 'youtube', videoDuration: 0, content: '', isFree: false });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTech, setFilterTech] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchCourses(); fetchTechnologies(); }, [searchQuery, filterTech]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      let url = `${API_URL}/courses?limit=100`;
      if (searchQuery) url += `&search=${searchQuery}`;
      if (filterTech) url += `&technology=${filterTech}`;
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) { const data = await response.json(); setCourses(data.courses || []); }
    } catch (error) { console.error('Failed to fetch:', error); }
    finally { setLoading(false); }
  };

  const fetchTechnologies = async () => {
    try {
      const response = await fetch(`${API_URL}/technologies?limit=100`);
      if (response.ok) { const data = await response.json(); setTechnologies(data.technologies || []); }
    } catch (error) { console.error('Failed to fetch:', error); }
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({ title: '', slug: '', description: '', shortDescription: '', thumbnail: '', previewVideo: '', technology: '', level: 'beginner', language: 'English', pricingType: 'free', price: 0, isPublished: true, featured: false, learningObjectives: '', requirements: '', targetAudience: '' });
    setShowModal(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title, slug: course.slug, description: course.description || '',
      shortDescription: course.shortDescription || '', thumbnail: course.thumbnail || '',
      previewVideo: course.previewVideo || '', technology: course.technology?._id || '',
      level: course.level || 'beginner', language: course.language || 'English',
      pricingType: course.pricing?.type || 'free', price: course.pricing?.price || 0,
      isPublished: course.isPublished !== false, featured: course.featured || false,
      learningObjectives: '', requirements: '', targetAudience: ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title) { setMessage({ type: 'error', text: 'Title is required' }); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const method = editingCourse ? 'PUT' : 'POST';
      const url = editingCourse ? `${API_URL}/courses/${editingCourse._id}` : `${API_URL}/courses`;
      const payload = {
        ...formData,
        pricing: { type: formData.pricingType, price: formData.price },
        learningObjectives: formData.learningObjectives.split('\n').filter(Boolean),
        requirements: formData.requirements.split('\n').filter(Boolean),
        targetAudience: formData.targetAudience.split('\n').filter(Boolean)
      };
      const response = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) { setMessage({ type: 'success', text: `Course ${editingCourse ? 'updated' : 'created'}!` }); setShowModal(false); fetchCourses(); }
      else { const error = await response.json(); setMessage({ type: 'error', text: error.message }); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) { setMessage({ type: 'success', text: 'Deleted!' }); fetchCourses(); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
  };

  const addSection = async (courseId: string) => {
    if (!sectionData.title) { setMessage({ type: 'error', text: 'Section title is required' }); return; }
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/courses/${courseId}/sections`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(sectionData)
      });
      if (response.ok) { setSectionData({ title: '', description: '' }); fetchCourses(); setMessage({ type: 'success', text: 'Section added!' }); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
  };

  const addLesson = async (courseId: string, sectionIndex: number) => {
    if (!lessonData.title) { setMessage({ type: 'error', text: 'Lesson title is required' }); return; }
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/courses/${courseId}/sections/${sectionIndex}/lessons`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(lessonData)
      });
      if (response.ok) { setLessonData({ title: '', contentType: 'video', videoUrl: '', videoProvider: 'youtube', videoDuration: 0, content: '', isFree: false }); setShowContentModal(false); fetchCourses(); setMessage({ type: 'success', text: 'Lesson added!' }); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
  };

  const togglePublish = async (course: Course) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${API_URL}/courses/${course._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ isPublished: !course.isPublished }) });
    fetchCourses();
  };

  const getLessonCount = (course: Course) => course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
  const formatDuration = (mins: number) => mins > 0 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : '--';

  const paginatedCourses = courses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Courses</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage your courses, sections & lessons</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowImporter(true)} className="btn btn-ghost">
            <span>📥</span> Import
          </button>
          <button onClick={openAddModal} className="btn btn-primary">
            <span>+</span> Add Course
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <span>{message.type === 'success' ? '✓' : '!'}</span>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto text-lg leading-none">&times;</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="stat-value">{courses.length}</div>
          <div className="stat-label">Total Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courses.filter(c => c.isPublished).length}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courses.reduce((acc, c) => acc + getLessonCount(c), 0)}</div>
          <div className="stat-label">Total Lessons</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courses.filter(c => c.featured).length}</div>
          <div className="stat-label">Featured</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="input-modern"
            />
          </div>
          <select
            value={filterTech}
            onChange={(e) => { setFilterTech(e.target.value); setCurrentPage(1); }}
            className="select-modern sm:w-auto"
          >
            <option value="">All Technologies</option>
            {technologies.map(tech => (
              <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="admin-card empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">No courses yet</h3>
            <p className="empty-state-text">Create your first course to get started</p>
            <button onClick={openAddModal} className="btn btn-primary">
              <span>+</span> Create Course
            </button>
          </div>
        ) : (
          paginatedCourses.map((course) => (
            <div key={course._id} className="admin-card">
              {/* Course Header */}
              <div className="p-5 flex flex-col lg:flex-row gap-4">
                {/* Thumbnail */}
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full lg:w-36 h-24 object-cover rounded-xl flex-shrink-0"
                  />
                )}

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate">
                      {course.title}
                    </h3>
                    {course.technology && (
                      <span className="text-lg flex-shrink-0">{course.technology.icon}</span>
                    )}
                    {course.featured && (
                      <span className="badge badge-warning flex-shrink-0">⭐ Featured</span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--text-muted)] mb-3 line-clamp-2">
                    {course.shortDescription || course.description?.substring(0, 120)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <span>📚</span> {course.sections?.length || 0} sections
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>📖</span> {getLessonCount(course)} lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>⏱️</span> {formatDuration(course.duration || 0)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>👁️</span> {course.views || 0} views
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>⭐</span> {course.rating?.average?.toFixed(1) || '0.0'} ({course.rating?.count || 0})
                    </span>
                    <span className="flex items-center gap-1.5 capitalize">
                      <span>📊</span> {course.level}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {course.pricing?.type === 'paid' ? `💵 $${course.pricing.price}` : '🆓 Free'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap lg:flex-col gap-2 lg:items-end flex-shrink-0">
                  <button
                    onClick={() => togglePublish(course)}
                    className={`btn btn-xs ${course.isPublished ? 'badge-success' : 'badge-danger'}`}
                    style={{ background: course.isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: course.isPublished ? '#10b981' : '#ef4444', border: 'none' }}
                  >
                    {course.isPublished ? '● Published' : '○ Draft'}
                  </button>
                  <button
                    onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
                    className="btn btn-ghost btn-xs"
                  >
                    {expandedCourse === course._id ? '▲ Hide' : '▼ Content'}
                  </button>
                  <div className="flex gap-2">
                    <Link
                      href={`/${course.technology?.slug || 'course'}/${course.slug}`}
                      target="_blank"
                      className="btn btn-ghost btn-xs"
                    >
                      👁️
                    </Link>
                    <button onClick={() => openEditModal(course)} className="btn btn-ghost btn-xs">
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(course._id, course.title)}
                      className="btn btn-xs"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content Section */}
              {expandedCourse === course._id && (
                <div className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                  {/* Add Section */}
                  <div className="flex gap-3 mb-5">
                    <input
                      type="text"
                      placeholder="New section title..."
                      value={sectionData.title}
                      onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
                      className="input-modern flex-1"
                    />
                    <button onClick={() => addSection(course._id)} className="btn btn-primary btn-sm">
                      + Add Section
                    </button>
                  </div>

                  {/* Sections List */}
                  {(!course.sections || course.sections.length === 0) ? (
                    <p className="text-center text-[var(--text-muted)] py-8">
                      No sections yet. Add your first section above.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {course.sections.map((section, sIdx) => (
                        <div key={section._id || sIdx} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
                          {/* Section Header */}
                          <div className="px-4 py-3 border-b border-[var(--border-primary)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg flex items-center justify-center">
                                {sIdx + 1}
                              </span>
                              <span className="font-medium text-[var(--text-primary)]">{section.title}</span>
                              <span className="text-xs text-[var(--text-muted)]">
                                ({section.lessons?.length || 0} lessons)
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingSection({ courseId: course._id, sectionIndex: sIdx });
                                setLessonData({ title: '', contentType: 'video', videoUrl: '', videoProvider: 'youtube', videoDuration: 0, content: '', isFree: false });
                                setShowContentModal(true);
                              }}
                              className="btn btn-primary btn-xs"
                            >
                              + Add Lesson
                            </button>
                          </div>

                          {/* Lessons List */}
                          <div>
                            {(!section.lessons || section.lessons.length === 0) ? (
                              <p className="text-center text-[var(--text-muted)] py-6 text-sm">
                                No lessons in this section yet
                              </p>
                            ) : (
                              section.lessons.map((lesson, lIdx) => (
                                <div
                                  key={lesson._id || lIdx}
                                  className={`px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors ${lIdx < section.lessons.length - 1 ? 'border-b border-[var(--border-primary)]' : ''}`}
                                >
                                  <span className="text-[var(--text-muted)] text-sm w-6">{lIdx + 1}.</span>
                                  <span className="text-lg">
                                    {CONTENT_TYPES.find(ct => ct.value === lesson.contentType)?.icon || '📄'}
                                  </span>
                                  <span className="flex-1 text-[var(--text-primary)] text-sm">{lesson.title}</span>
                                  {lesson.isFree && (
                                    <span className="badge badge-success">Free</span>
                                  )}
                                  {lesson.videoDuration && lesson.videoDuration > 0 && (
                                    <span className="text-xs text-[var(--text-muted)]">
                                      {Math.floor(lesson.videoDuration / 60)}:{(lesson.videoDuration % 60).toString().padStart(2, '0')}
                                    </span>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-[var(--text-muted)]">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, courses.length)} of {courses.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-ghost btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
              .map((page, idx, arr) => (
                <span key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-[var(--text-muted)]">...</span>}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {page}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-ghost btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showModal && (
        <div className="modal-overlay open" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingCourse ? '✏️ Edit Course' : '➕ Create New Course'}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Basic Info Section */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <span>📝</span> Basic Information
                </h4>
                <div className="form-grid form-grid-2">
                  <div className="form-group form-group-full">
                    <label className="input-label">Course Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                      placeholder="e.g., Python for Beginners"
                      className="input-modern"
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="python-for-beginners"
                      className="input-modern"
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Technology</label>
                    <select
                      value={formData.technology}
                      onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                      className="select-modern"
                    >
                      <option value="">Select Technology...</option>
                      {technologies.map(t => (
                        <option key={t._id} value={t._id}>{t.icon} {t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group form-group-full">
                    <label className="input-label">Short Description</label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Brief course summary"
                      className="input-modern"
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <label className="input-label">Full Description</label>
                    <RichContentEditor
                      value={formData.description}
                      onChange={(value) => setFormData({ ...formData, description: value })}
                      mode="markdown"
                      height="200px"
                      showPreview={true}
                      showToolbar={true}
                    />
                  </div>
                </div>
              </div>

              {/* Course Settings Section */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <span>⚙️</span> Course Settings
                </h4>
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label className="input-label">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="select-modern"
                    >
                      {LEVELS.map(l => (
                        <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1).replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Language</label>
                    <input
                      type="text"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="input-modern"
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Pricing</label>
                    <select
                      value={formData.pricingType}
                      onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                      className="select-modern"
                    >
                      <option value="free">🆓 Free</option>
                      <option value="paid">💵 Paid</option>
                      <option value="subscription">🔄 Subscription</option>
                    </select>
                  </div>
                  {formData.pricingType === 'paid' && (
                    <div className="form-group">
                      <label className="input-label">Price ($)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="input-modern"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Media Section */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <span>🖼️</span> Media
                </h4>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="input-label">Thumbnail URL</label>
                    <input
                      type="text"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://..."
                      className="input-modern"
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Preview Video URL</label>
                    <input
                      type="text"
                      value={formData.previewVideo}
                      onChange={(e) => setFormData({ ...formData, previewVideo: e.target.value })}
                      placeholder="YouTube or Vimeo URL"
                      className="input-modern"
                    />
                  </div>
                </div>
              </div>

              {/* Learning Objectives Section */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <span>🎯</span> Learning Objectives
                </h4>
                <textarea
                  value={formData.learningObjectives}
                  onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                  rows={3}
                  placeholder="One objective per line..."
                  className="textarea-modern"
                />
              </div>

              {/* Publish Options */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="checkbox-modern"
                  />
                  <span className="text-[var(--text-primary)]">⭐ Featured Course</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="checkbox-modern"
                  />
                  <span className="text-[var(--text-primary)]">🌐 Published</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[var(--border-primary)] px-6 py-4">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                {saving ? '⏳ Saving...' : editingCourse ? '💾 Update Course' : '✨ Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showContentModal && editingSection && (
        <div className="modal-overlay open" onClick={() => setShowContentModal(false)}>
          <div className="modal modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">➕ Add New Lesson</h3>
              <button onClick={() => setShowContentModal(false)} className="modal-close">✕</button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
              <div className="form-group">
                <label className="input-label">Lesson Title *</label>
                <input
                  type="text"
                  value={lessonData.title}
                  onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                  placeholder="e.g., Introduction to Variables"
                  className="input-modern"
                />
              </div>

              <div className="form-group">
                <label className="input-label">Content Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {CONTENT_TYPES.map(ct => (
                    <button
                      key={ct.value}
                      onClick={() => setLessonData({ ...lessonData, contentType: ct.value as 'video' | 'article' | 'quiz' | 'code' })}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        lessonData.contentType === ct.value
                          ? 'border-[var(--accent-primary)] bg-[var(--bg-accent-soft)]'
                          : 'border-[var(--border-primary)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      <span className="text-2xl">{ct.icon}</span>
                      <span className="text-xs font-medium text-[var(--text-primary)]">{ct.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {lessonData.contentType === 'video' && (
                <>
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label className="input-label">Video Provider</label>
                      <select
                        value={lessonData.videoProvider}
                        onChange={(e) => setLessonData({ ...lessonData, videoProvider: e.target.value as 'youtube' | 'vimeo' | 'custom' })}
                        className="select-modern"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="custom">Custom URL</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="input-label">Duration (seconds)</label>
                      <input
                        type="number"
                        value={lessonData.videoDuration}
                        onChange={(e) => setLessonData({ ...lessonData, videoDuration: parseInt(e.target.value) || 0 })}
                        className="input-modern"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Video URL</label>
                    <input
                      type="text"
                      value={lessonData.videoUrl}
                      onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="input-modern"
                    />
                  </div>
                </>
              )}

              {(lessonData.contentType === 'article' || lessonData.contentType === 'code') && (
                <div className="form-group">
                  <label className="input-label">
                    Content {lessonData.contentType === 'article' && '(Markdown supported)'}
                  </label>
                  <RichContentEditor
                    value={lessonData.content}
                    onChange={(value) => setLessonData({ ...lessonData, content: value })}
                    mode={lessonData.contentType === 'code' ? 'code' : 'markdown'}
                    language={lessonData.contentType === 'code' ? 'javascript' : undefined}
                    height="300px"
                    showPreview={true}
                    showToolbar={true}
                  />
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={lessonData.isFree}
                  onChange={(e) => setLessonData({ ...lessonData, isFree: e.target.checked })}
                  className="checkbox-modern"
                />
                <span className="text-[var(--text-primary)]">🆓 Free Preview (available without enrollment)</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[var(--border-primary)] px-6 py-4">
              <button onClick={() => setShowContentModal(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={() => addLesson(editingSection.courseId, editingSection.sectionIndex)}
                className="btn btn-primary"
              >
                ✨ Add Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Importer Modal */}
      {showImporter && (
        <ContentImporter
          type="course"
          technologyId={filterTech || undefined}
          onImportComplete={(result) => {
            setMessage({ type: result.success ? 'success' : 'error', text: `Imported ${result.imported} course(s)${result.failed > 0 ? `, ${result.failed} failed` : ''}` });
            if (result.success) fetchCourses();
          }}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
}

