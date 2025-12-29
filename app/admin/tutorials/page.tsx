'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichContentEditor = dynamic(() => import('@/components/UI/RichContentEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading Editor...</div>
});

const ContentImporter = dynamic(() => import('@/components/UI/ContentImporter'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading Importer...</div>
});

interface TutorialChapter {
  _id: string;
  technology: { _id: string; name: string; slug: string; icon: string; color: string };
  title: string;
  slug: string;
  description: string;
  content: string;
  order: number;
  icon: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  codeExamples: { title: string; language: string; code: string; output: string }[];
  keyPoints: string[];
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminTutorialsPage() {
  const [chapters, setChapters] = useState<TutorialChapter[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [editingChapter, setEditingChapter] = useState<TutorialChapter | null>(null);
  const [filterTech, setFilterTech] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    technologyId: '',
    title: '',
    slug: '',
    description: '',
    content: '',
    order: 0,
    icon: '📖',
    estimatedTime: 10,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    keyPoints: [''],
    isPublished: true
  });

  useEffect(() => {
    fetchTechnologies();
  }, []);

  useEffect(() => {
    fetchChapters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTech, searchQuery]);

  const getToken = () => localStorage.getItem('accessToken');

  const fetchTechnologies = async () => {
    try {
      const response = await fetch(`${API_URL}/technologies?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setTechnologies(data.technologies || []);
      }
    } catch (error) {
      console.error('Failed to fetch technologies:', error);
    }
  };

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const token = getToken();
      let url = `${API_URL}/tutorials/admin/chapters?limit=100`;
      if (filterTech) url += `&technology=${filterTech}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setChapters(data.chapters || []);
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = getToken();
      const url = editingChapter 
        ? `${API_URL}/tutorials/admin/chapters/${editingChapter._id}`
        : `${API_URL}/tutorials/admin/chapters`;
      
      const response = await fetch(url, {
        method: editingChapter ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          keyPoints: formData.keyPoints.filter(k => k.trim())
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: editingChapter ? 'Chapter updated!' : 'Chapter created!' });
        setShowModal(false);
        resetForm();
        fetchChapters();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to save chapter' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this chapter?')) return;
    
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/tutorials/admin/chapters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Chapter deleted!' });
        fetchChapters();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const openEditModal = (chapter: TutorialChapter) => {
    setEditingChapter(chapter);
    setFormData({
      technologyId: chapter.technology._id,
      title: chapter.title,
      slug: chapter.slug,
      description: chapter.description,
      content: chapter.content || '',
      order: chapter.order,
      icon: chapter.icon,
      estimatedTime: chapter.estimatedTime,
      difficulty: chapter.difficulty,
      keyPoints: chapter.keyPoints?.length ? chapter.keyPoints : [''],
      isPublished: chapter.isPublished
    });
    setShowModal(true);
  };

  const resetForm = () => {
    const selectedTech = filterTech ? technologies.find(t => t.slug === filterTech) : undefined;
    setEditingChapter(null);
    setFormData({
      technologyId: selectedTech?._id || '',
      title: '',
      slug: '',
      description: '',
      content: '',
      order: chapters.length + 1,
      icon: '📖',
      estimatedTime: 10,
      difficulty: 'beginner',
      keyPoints: [''],
      isPublished: true
    });
  };

  const addKeyPoint = () => {
    setFormData({ ...formData, keyPoints: [...formData.keyPoints, ''] });
  };

  const updateKeyPoint = (index: number, value: string) => {
    const updated = [...formData.keyPoints];
    updated[index] = value;
    setFormData({ ...formData, keyPoints: updated });
  };

  const removeKeyPoint = (index: number) => {
    setFormData({ ...formData, keyPoints: formData.keyPoints.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tutorial Chapters</h1>
          <p className="text-[var(--text-secondary)]">Manage free tutorial content (Technology → Chapters)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImporter(true)}
            className="px-4 py-2 border border-purple-500/30 text-purple-500 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 flex items-center gap-2"
          >
            <span>📥</span> Import
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <span>+</span> Add Chapter
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <h3 className="font-semibold text-green-600">Tutorial Structure (FREE)</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Tutorials are free for all users. Structure: <strong>Technology → Chapters</strong><br/>
              Each chapter is a standalone lesson within a technology (e.g., HTML → Introduction, HTML → Elements, HTML → Forms)
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterTech}
          onChange={(e) => { setFilterTech(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
        >
          <option value="">All Technologies</option>
          {technologies.map(tech => (
            <option key={tech._id} value={tech.slug}>{tech.icon} {tech.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search chapters..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="flex-1 max-w-xs px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
        />
      </div>

      {/* Chapters Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--bg-accent)] border-t-transparent"></div>
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">No chapters yet</h3>
          <p className="text-[var(--text-secondary)]">Create your first tutorial chapter</p>
        </div>
      ) : (
        <>
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Chapter</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Technology</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Difficulty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const sortedChapters = chapters.sort((a, b) => a.order - b.order);
                  const paginatedChapters = sortedChapters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                  return paginatedChapters.map((chapter, index) => (
                    <tr key={chapter._id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)]">
                      <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{chapter.icon}</span>
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{chapter.title}</p>
                            <p className="text-xs text-[var(--text-muted)]">{chapter.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm">
                          {chapter.technology?.icon} {chapter.technology?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          chapter.difficulty === 'beginner' ? 'bg-green-500/10 text-green-600' :
                          chapter.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {chapter.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{chapter.estimatedTime}m</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-muted)]">👁 {chapter.viewCount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          chapter.isPublished ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {chapter.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tutorials/${chapter.technology?.slug}/${chapter.slug}`}
                            target="_blank"
                            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)]"
                            title="View"
                          >
                            👁
                          </Link>
                          <button
                            onClick={() => openEditModal(chapter)}
                            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)]"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(chapter._id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-red-500"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(() => {
            const totalPages = Math.ceil(chapters.length / itemsPerPage);
            if (totalPages <= 1) return null;
            return (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-[var(--text-muted)]">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, chapters.length)} of {chapters.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-[var(--border-primary)] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-secondary)]"
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
                      className={`px-3 py-1 rounded-lg text-sm ${
                        page === currentPage
                          ? 'bg-[var(--bg-accent)] text-white'
                          : 'border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-[var(--border-primary)] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-secondary)]"
                  >
                    Next →
                  </button>
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border-primary)] flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingChapter ? 'Edit Chapter' : 'New Chapter'}</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Technology *</label>
                  <select
                    value={formData.technologyId}
                    onChange={(e) => setFormData({ ...formData, technologyId: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                  >
                    <option value="">Select Technology</option>
                    {technologies.map(tech => (
                      <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    })}
                    required
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                    placeholder="e.g., Introduction to HTML"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-center text-xl"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                  placeholder="introduction-to-html"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                  placeholder="Brief description of this chapter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content (HTML/Markdown)</label>
                <RichContentEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  mode="markdown"
                  height="350px"
                  showPreview={true}
                  showToolbar={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Key Points</label>
                {formData.keyPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => updateKeyPoint(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                      placeholder="Key point..."
                    />
                    {formData.keyPoints.length > 1 && (
                      <button type="button" onClick={() => removeKeyPoint(index)} className="px-3 text-red-500">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addKeyPoint} className="text-sm text-[var(--text-accent)]">+ Add Key Point</button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPublished" className="text-sm">Published</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingChapter ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Importer Modal */}
      {showImporter && (
        <ContentImporter
          type="tutorial"
          technologyId={filterTech || undefined}
          onImportComplete={(result) => {
            setMessage({ type: result.success ? 'success' : 'error', text: `Imported ${result.imported} chapter(s)${result.failed > 0 ? `, ${result.failed} failed` : ''}` });
            if (result.success) fetchChapters();
          }}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
}
