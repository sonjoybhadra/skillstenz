'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../lib/auth';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const RichContentEditor = dynamic(() => import('@/components/UI/RichContentEditor'), {
  ssr: false,
  loading: () => <div className="p-5 text-center text-[var(--text-muted)]">Loading Editor...</div>
});

const ContentImporter = dynamic(() => import('@/components/UI/ContentImporter'), {
  ssr: false,
  loading: () => <div className="p-5 text-center text-[var(--text-muted)]">Loading Importer...</div>
});

interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface Cheatsheet {
  _id: string;
  title: string;
  slug: string;
  description: string;
  technology: Technology;
  category: string;
  content: string;
  sections: { title: string; items: { command: string; description: string; example: string }[] }[];
  tags: string[];
  difficulty: string;
  icon: string;
  color: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  downloads: number;
  votes: { upvotes: number; downvotes: number };
  createdAt: string;
}

const categories = ['commands', 'syntax', 'shortcuts', 'reference', 'quick-guide', 'other'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

export default function AdminCheatsheets() {
  const [cheatsheets, setCheatsheets] = useState<Cheatsheet[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [editingCheatsheet, setEditingCheatsheet] = useState<Cheatsheet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    technology: '',
    category: 'reference',
    content: '',
    tags: '',
    difficulty: 'beginner',
    icon: '📋',
    color: '#3b82f6',
    isPublished: false,
    isFeatured: false
  });

  useEffect(() => {
    fetchCheatsheets();
    fetchTechnologies();
  }, []);

  const fetchCheatsheets = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/cheatsheets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCheatsheets(data.cheatsheets || []);
    } catch (error) {
      console.error('Error fetching cheatsheets:', error);
      toast.error('Failed to load cheatsheets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/technologies');
      const data = await response.json();
      setTechnologies(data.technologies || []);
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    try {
      const url = editingCheatsheet
        ? `http://localhost:5000/api/cheatsheets/${editingCheatsheet._id}`
        : 'http://localhost:5000/api/cheatsheets';
      
      const response = await fetch(url, {
        method: editingCheatsheet ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingCheatsheet ? 'Cheatsheet updated!' : 'Cheatsheet created!');
        setShowModal(false);
        resetForm();
        fetchCheatsheets();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving cheatsheet:', error);
      toast.error('Failed to save cheatsheet');
    }
  };

  const handleEdit = (cheatsheet: Cheatsheet) => {
    setEditingCheatsheet(cheatsheet);
    setFormData({
      title: cheatsheet.title,
      slug: cheatsheet.slug,
      description: cheatsheet.description,
      technology: cheatsheet.technology?._id || '',
      category: cheatsheet.category,
      content: cheatsheet.content,
      tags: cheatsheet.tags.join(', '),
      difficulty: cheatsheet.difficulty,
      icon: cheatsheet.icon,
      color: cheatsheet.color,
      isPublished: cheatsheet.isPublished,
      isFeatured: cheatsheet.isFeatured
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cheatsheet?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/cheatsheets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Cheatsheet deleted!');
        fetchCheatsheets();
      } else {
        toast.error('Failed to delete cheatsheet');
      }
    } catch (error) {
      console.error('Error deleting cheatsheet:', error);
      toast.error('Failed to delete cheatsheet');
    }
  };

  const togglePublish = async (cheatsheet: Cheatsheet) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/cheatsheets/${cheatsheet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !cheatsheet.isPublished })
      });

      if (response.ok) {
        toast.success(cheatsheet.isPublished ? 'Unpublished!' : 'Published!');
        fetchCheatsheets();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const resetForm = () => {
    setEditingCheatsheet(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      technology: '',
      category: 'reference',
      content: '',
      tags: '',
      difficulty: 'beginner',
      icon: '📋',
      color: '#3b82f6',
      isPublished: false,
      isFeatured: false
    });
  };

  const filteredCheatsheets = cheatsheets.filter(cs => {
    const matchesSearch = cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cs.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || cs.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute adminOnly>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Cheatsheets</h1>
            <p className="text-[var(--text-muted)] mt-1">Create and manage quick reference guides</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowImporter(true)} className="btn btn-ghost">
              <span>📥</span> Import
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">
              <span>+</span> Add Cheatsheet
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="stat-value">{cheatsheets.length}</div>
            <div className="stat-label">Total Cheatsheets</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{cheatsheets.filter(c => c.isPublished).length}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{cheatsheets.filter(c => c.isFeatured).length}</div>
            <div className="stat-label">Featured</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{cheatsheets.reduce((sum, c) => sum + c.views, 0)}</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-card p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search cheatsheets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select-modern sm:w-auto"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cheatsheets Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="spinner" />
          </div>
        ) : filteredCheatsheets.length === 0 ? (
          <div className="admin-card empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No cheatsheets found</h3>
            <p className="empty-state-text">Create your first cheatsheet to get started</p>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">
              <span>+</span> Create Cheatsheet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCheatsheets.map((cheatsheet) => (
              <div key={cheatsheet._id} className="admin-card p-5">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cheatsheet.icon}</span>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 line-clamp-1">
                        {cheatsheet.title}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded text-white"
                        style={{ background: cheatsheet.technology?.color || '#3b82f6' }}
                      >
                        {cheatsheet.technology?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {cheatsheet.isPublished && <span title="Published" className="text-sm">✅</span>}
                    {cheatsheet.isFeatured && <span title="Featured" className="text-sm">⭐</span>}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-muted)] mb-3 line-clamp-2">
                  {cheatsheet.description}
                </p>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="badge badge-info">{cheatsheet.category}</span>
                  <span className={`badge ${
                    cheatsheet.difficulty === 'beginner' ? 'badge-success' :
                    cheatsheet.difficulty === 'intermediate' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {cheatsheet.difficulty}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-xs text-[var(--text-muted)] mb-4">
                  <span className="flex items-center gap-1">👁️ {cheatsheet.views}</span>
                  <span className="flex items-center gap-1">⬇️ {cheatsheet.downloads}</span>
                  <span className="flex items-center gap-1">👍 {cheatsheet.votes?.upvotes || 0}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(cheatsheet)}
                    className={`btn btn-sm flex-1 ${cheatsheet.isPublished ? 'btn-ghost' : 'btn-primary'}`}
                  >
                    {cheatsheet.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleEdit(cheatsheet)} className="btn btn-ghost btn-sm">
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cheatsheet._id)}
                    className="btn btn-sm"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay open" onClick={() => setShowModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editingCheatsheet ? '✏️ Edit Cheatsheet' : '➕ Create Cheatsheet'}</h3>
                <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <span>📝</span> Basic Information
                  </h4>
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label className="input-label">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input-modern"
                        placeholder="Python Cheatsheet"
                      />
                    </div>
                    <div className="form-group">
                      <label className="input-label">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="input-modern"
                        placeholder="auto-generated"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea-modern"
                    placeholder="A quick reference guide for..."
                  />
                </div>

                {/* Settings */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <span>⚙️</span> Settings
                  </h4>
                  <div className="form-grid form-grid-3">
                    <div className="form-group">
                      <label className="input-label">Technology *</label>
                      <select
                        required
                        value={formData.technology}
                        onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                        className="select-modern"
                      >
                        <option value="">Select Technology</option>
                        {technologies.map(tech => (
                          <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="input-label">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="select-modern"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="input-label">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="select-modern"
                      >
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="form-group">
                  <label className="input-label">Content (Markdown) *</label>
                  <RichContentEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    mode="markdown"
                    height="300px"
                    showPreview={true}
                    showToolbar={true}
                  />
                </div>

                {/* Appearance */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <span>🎨</span> Appearance
                  </h4>
                  <div className="form-grid form-grid-3">
                    <div className="form-group form-group-full">
                      <label className="input-label">Tags</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="input-modern"
                        placeholder="python, basics, quick-reference"
                      />
                    </div>
                    <div className="form-group">
                      <label className="input-label">Icon</label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="input-modern text-center text-xl"
                      />
                    </div>
                    <div className="form-group">
                      <label className="input-label">Color</label>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="input-modern h-[42px] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Publish Options */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="checkbox-modern"
                    />
                    <span className="text-[var(--text-primary)]">🌐 Published</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="checkbox-modern"
                    />
                    <span className="text-[var(--text-primary)]">⭐ Featured</span>
                  </label>
                </div>
              </form>

              <div className="flex items-center justify-end gap-3 border-t border-[var(--border-primary)] px-6 py-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                  {editingCheatsheet ? '💾 Update Cheatsheet' : '✨ Create Cheatsheet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Importer Modal */}
        {showImporter && (
          <ContentImporter
            type="cheatsheet"
            technologyId={filterCategory || undefined}
            onImportComplete={(result) => {
              toast[result.success ? 'success' : 'error'](`Imported ${result.imported} cheatsheet(s)${result.failed > 0 ? `, ${result.failed} failed` : ''}`);
              if (result.success) fetchCheatsheets();
            }}
            onClose={() => setShowImporter(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
