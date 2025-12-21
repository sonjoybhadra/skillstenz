'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  { value: 'video', label: '🎥 Video' },
  { value: 'article', label: '📝 Article' },
  { value: 'quiz', label: '❓ Quiz' },
  { value: 'code', label: '💻 Code' }
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSection, setEditingSection] = useState<{courseId: string; sectionIndex: number} | null>(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', shortDescription: '', thumbnail: '',
    previewVideo: '', technology: '', level: 'beginner', language: 'English',
    pricingType: 'free', price: 0, isPublished: true, featured: false,
    learningObjectives: '', requirements: '', targetAudience: ''
  });
  const [sectionData, setSectionData] = useState({ title: '', description: '' });
  const [lessonData, setLessonData] = useState({ title: '', contentType: 'video' as const, videoUrl: '', videoProvider: 'youtube' as const, videoDuration: 0, content: '', isFree: false });
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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) { setMessage({ type: 'success', text: 'Deleted!' }); fetchCourses(); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
  };

  const addSection = async (courseId: string) => {
    if (!sectionData.title) { setMessage({ type: 'error', text: 'Section title is required' }); return; }
    try {
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/courses/${courseId}/sections/${sectionIndex}/lessons`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(lessonData)
      });
      if (response.ok) { setLessonData({ title: '', contentType: 'video', videoUrl: '', videoProvider: 'youtube', videoDuration: 0, content: '', isFree: false }); setShowContentModal(false); fetchCourses(); setMessage({ type: 'success', text: 'Lesson added!' }); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
  };

  const togglePublish = async (course: Course) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/courses/${course._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ isPublished: !course.isPublished }) });
    fetchCourses();
  };

  const getLessonCount = (course: Course) => course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
  const formatDuration = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Courses Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage courses with sections & lessons ({courses.length} total)</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">+ Add Course</button>
      </div>

      {message.text && <div style={{ padding: '12px 16px', marginBottom: '24px', borderRadius: 'var(--radius-md)', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444' }}>{message.text}</div>}

      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ flex: 1, minWidth: '200px', padding: '10px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          <select value={filterTech} onChange={(e) => { setFilterTech(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <option value="">All Technologies</option>
            {technologies.map(tech => <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {courses.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No courses found. Add your first!</div>
        ) : (() => {
          const paginatedCourses = courses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
          return paginatedCourses.map((course) => (
          <div key={course._id} className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {course.thumbnail && <img src={course.thumbnail} alt={course.title} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{course.title}</h3>
                  {course.technology && <span style={{ fontSize: '14px' }}>{course.technology.icon}</span>}
                  {course.featured && <span style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '4px' }}>⭐ Featured</span>}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>{course.shortDescription || course.description?.substring(0, 100)}</p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>📚 {course.sections?.length || 0} sections</span>
                  <span>📖 {getLessonCount(course)} lessons</span>
                  <span>⏱️ {formatDuration(course.duration || 0)}</span>
                  <span>👁️ {course.views || 0} views</span>
                  <span>⬆️ {course.votes?.upvotes || 0} / ⬇️ {course.votes?.downvotes || 0}</span>
                  <span>⭐ {course.rating?.average?.toFixed(1) || '0.0'} ({course.rating?.count || 0})</span>
                  <span style={{ textTransform: 'capitalize' }}>📊 {course.level}</span>
                  <span>{course.pricing?.type === 'paid' ? `💵 $${course.pricing.price}` : '🆓 Free'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => togglePublish(course)} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 500, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: course.isPublished ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: course.isPublished ? '#10b981' : '#ef4444' }}>{course.isPublished ? 'Published' : 'Draft'}</button>
                <button onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)} style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>{expandedCourse === course._id ? '▲ Content' : '▼ Content'}</button>
                <Link href={`/${course.technology?.slug || 'course'}/${course.slug}`} target="_blank" style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-muted)', textDecoration: 'none' }}>View</Link>
                <button onClick={() => openEditModal(course)} style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(course._id, course.title)} style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
            
            {expandedCourse === course._id && (
              <div style={{ borderTop: '1px solid var(--border-primary)', padding: '20px', background: 'var(--bg-secondary)' }}>
                <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input type="text" placeholder="New section title..." value={sectionData.title} onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })} style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                  <button onClick={() => addSection(course._id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>+ Section</button>
                </div>
                
                {course.sections?.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No sections yet. Add the first section above.</p>
                ) : course.sections?.map((section, sIdx) => (
                  <div key={section._id || sIdx} style={{ marginBottom: '16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Section {sIdx + 1}: {section.title}</span><span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>({section.lessons?.length || 0} lessons)</span></div>
                      <button onClick={() => { setEditingSection({ courseId: course._id, sectionIndex: sIdx }); setLessonData({ title: '', contentType: 'video', videoUrl: '', videoProvider: 'youtube', videoDuration: 0, content: '', isFree: false }); setShowContentModal(true); }} className="btn" style={{ padding: '4px 12px', fontSize: '12px', background: 'var(--accent-primary)', color: 'white' }}>+ Lesson</button>
                    </div>
                    <div>
                      {section.lessons?.length === 0 ? (
                        <p style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No lessons yet</p>
                      ) : section.lessons?.map((lesson, lIdx) => (
                        <div key={lesson._id || lIdx} style={{ padding: '12px 16px', borderBottom: lIdx < section.lessons.length - 1 ? '1px solid var(--border-primary)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{lIdx + 1}.</span>
                          <span>{lesson.contentType === 'video' ? '🎥' : lesson.contentType === 'article' ? '📝' : lesson.contentType === 'quiz' ? '❓' : '💻'}</span>
                          <span style={{ flex: 1, color: 'var(--text-primary)' }}>{lesson.title}</span>
                          {lesson.isFree && <span style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px' }}>Free Preview</span>}
                          {lesson.videoDuration && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{Math.floor(lesson.videoDuration / 60)}:{(lesson.videoDuration % 60).toString().padStart(2, '0')}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ));
        })()}
      </div>

      {/* Pagination */}
      {courses.length > 0 && (() => {
        const totalPages = Math.ceil(courses.length / itemsPerPage);
        if (totalPages <= 1) return null;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, courses.length)} of {courses.length}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '13px', background: 'transparent', color: 'var(--text-muted)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              ).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: page === currentPage ? 'none' : '1px solid var(--border-primary)', background: page === currentPage ? 'var(--accent-primary)' : 'transparent', color: page === currentPage ? 'white' : 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px 12px', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '13px', background: 'transparent', color: 'var(--text-muted)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next →
              </button>
            </div>
          </div>
        );
      })()}

      {/* Course Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} placeholder="Python for Beginners" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Slug</label><input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Technology</label><select value={formData.technology} onChange={(e) => setFormData({ ...formData, technology: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}><option value="">Select...</option>{technologies.map(t => <option key={t._id} value={t._id}>{t.icon} {t.name}</option>)}</select></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Level</label><select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1).replace('-', ' ')}</option>)}</select></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Language</label><input type="text" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Pricing</label><select value={formData.pricingType} onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}><option value="free">Free</option><option value="paid">Paid</option><option value="subscription">Subscription</option></select></div>
                {formData.pricingType === 'paid' && <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Price ($)</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>}
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Thumbnail URL</label><input type="text" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Preview Video URL</label><input type="text" value={formData.previewVideo} onChange={(e) => setFormData({ ...formData, previewVideo: e.target.value })} placeholder="YouTube/Vimeo URL" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              </div>
              <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Short Description</label><input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Full Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }} /></div>
              <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Learning Objectives (one per line)</label><textarea value={formData.learningObjectives} onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })} rows={3} placeholder="Master Python basics&#10;Build real projects" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }} /></div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} style={{ width: '18px', height: '18px' }} /><span style={{ color: 'var(--text-primary)' }}>Featured</span></label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} style={{ width: '18px', height: '18px' }} /><span style={{ color: 'var(--text-primary)' }}>Published</span></label>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-primary)' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : (editingCourse ? 'Update' : 'Create')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showContentModal && editingSection && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Add Lesson</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Lesson Title *</label><input type="text" value={lessonData.title} onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })} placeholder="Introduction to Variables" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Content Type</label><div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>{CONTENT_TYPES.map(ct => (<button key={ct.value} onClick={() => setLessonData({ ...lessonData, contentType: ct.value as 'video' | 'article' | 'quiz' | 'code' })} style={{ padding: '10px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: lessonData.contentType === ct.value ? 'var(--accent-primary)' : 'transparent', color: lessonData.contentType === ct.value ? 'white' : 'var(--text-muted)', cursor: 'pointer' }}>{ct.label}</button>))}</div></div>
              {lessonData.contentType === 'video' && (
                <>
                  <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Video Provider</label><select value={lessonData.videoProvider} onChange={(e) => setLessonData({ ...lessonData, videoProvider: e.target.value as 'youtube' | 'vimeo' | 'custom' })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}><option value="youtube">YouTube</option><option value="vimeo">Vimeo</option><option value="custom">Custom URL</option></select></div>
                    <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Duration (seconds)</label><input type="number" value={lessonData.videoDuration} onChange={(e) => setLessonData({ ...lessonData, videoDuration: parseInt(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                  </div>
                  <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Video URL</label><input type="text" value={lessonData.videoUrl} onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                </>
              )}
              {(lessonData.contentType === 'article' || lessonData.contentType === 'code') && (
                <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Content</label><textarea value={lessonData.content} onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })} rows={8} placeholder={lessonData.contentType === 'code' ? '// Your code here...' : 'Lesson content (supports Markdown)'} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical', fontFamily: lessonData.contentType === 'code' ? 'monospace' : 'inherit' }} /></div>
              )}
              <div style={{ marginTop: '20px' }}><label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={lessonData.isFree} onChange={(e) => setLessonData({ ...lessonData, isFree: e.target.checked })} style={{ width: '18px', height: '18px' }} /><span style={{ color: 'var(--text-primary)' }}>Free Preview (available without enrollment)</span></label></div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowContentModal(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-primary)' }}>Cancel</button>
              <button onClick={() => addLesson(editingSection.courseId, editingSection.sectionIndex)} className="btn btn-primary">Add Lesson</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
