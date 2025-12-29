'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../lib/auth';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ContentImporter = dynamic(() => import('@/components/UI/ContentImporter'), {
  ssr: false,
  loading: () => <div className="p-5 text-center text-[var(--text-muted)]">Loading Importer...</div>
});

interface RoadmapStep {
  _id?: string;
  title: string;
  topics: string[];
  duration: string;
  order: number;
}

interface Roadmap {
  _id: string;
  slug: string;
  title: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  duration: string;
  difficulty: string;
  steps: RoadmapStep[];
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

const categories = ['frontend', 'backend', 'mobile', 'devops', 'data', 'other'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    slug: '',
    description: '',
    icon: '🗺️',
    category: 'other',
    duration: '',
    difficulty: 'beginner',
    isActive: true,
    isFeatured: false
  });
  const [steps, setSteps] = useState<RoadmapStep[]>([]);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const getToken = () => localStorage.getItem('accessToken');

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/roadmaps?limit=100`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setRoadmaps(data.roadmaps || data || []);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      toast.error('Failed to fetch roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingRoadmap(null);
    setFormData({
      title: '',
      name: '',
      slug: '',
      description: '',
      icon: '🗺️',
      category: 'other',
      duration: '',
      difficulty: 'beginner',
      isActive: true,
      isFeatured: false
    });
    setSteps([]);
  };

  const openEditModal = (roadmap: Roadmap) => {
    setEditingRoadmap(roadmap);
    setFormData({
      title: roadmap.title,
      name: roadmap.name,
      slug: roadmap.slug,
      description: roadmap.description || '',
      icon: roadmap.icon || '🗺️',
      category: roadmap.category || 'other',
      duration: roadmap.duration || '',
      difficulty: roadmap.difficulty || 'beginner',
      isActive: roadmap.isActive !== false,
      isFeatured: roadmap.isFeatured || false
    });
    // Ensure each step has proper defaults for topics and duration
    const normalizedSteps = (roadmap.steps || []).map((step, idx) => ({
      ...step,
      topics: Array.isArray(step.topics) ? step.topics : [],
      duration: step.duration || '',
      order: step.order ?? idx
    }));
    setSteps(normalizedSteps);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.name) {
      toast.error('Title and name are required');
      return;
    }

    try {
      const url = editingRoadmap
        ? `${API_URL}/roadmaps/${editingRoadmap._id}`
        : `${API_URL}/roadmaps`;
      const method = editingRoadmap ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        steps: steps.map((step, index) => ({ ...step, order: index }))
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save roadmap');
      }

      toast.success(editingRoadmap ? 'Roadmap updated!' : 'Roadmap created!');
      setShowModal(false);
      resetForm();
      fetchRoadmaps();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save roadmap');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_URL}/roadmaps/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Roadmap deleted!');
      fetchRoadmaps();
    } catch {
      toast.error('Failed to delete roadmap');
    }
  };

  const toggleActive = async (roadmap: Roadmap) => {
    try {
      await fetch(`${API_URL}/roadmaps/${roadmap._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ isActive: !roadmap.isActive })
      });
      fetchRoadmaps();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const addStep = () => {
    setSteps([...steps, { title: '', topics: [], duration: '', order: steps.length }]);
  };

  const updateStep = (index: number, field: string, value: string | string[]) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const filteredRoadmaps = roadmaps.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Roadmaps</h1>
            <p className="text-[var(--text-muted)] mt-1">Create and manage learning paths ({roadmaps.length} total)</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowImporter(true)} className="btn btn-ghost">
              <span>📥</span> Import
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">
              <span>+</span> Add Roadmap
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="stat-value">{roadmaps.length}</div>
            <div className="stat-label">Total Roadmaps</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{roadmaps.filter(r => r.isActive).length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{roadmaps.filter(r => r.isFeatured).length}</div>
            <div className="stat-label">Featured</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{roadmaps.reduce((sum, r) => sum + (r.steps?.length || 0), 0)}</div>
            <div className="stat-label">Total Steps</div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-card p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search roadmaps..."
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
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Roadmaps List */}
        <div className="space-y-4">
          {filteredRoadmaps.length === 0 ? (
            <div className="admin-card empty-state">
              <div className="empty-state-icon">🗺️</div>
              <h3 className="empty-state-title">No roadmaps found</h3>
              <p className="empty-state-text">Create your first learning roadmap or import from JSON</p>
              <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">
                <span>+</span> Create Roadmap
              </button>
            </div>
          ) : (
            filteredRoadmaps.map((roadmap) => (
              <div key={roadmap._id} className="admin-card">
                {/* Roadmap Header */}
                <div className="p-5 flex flex-col lg:flex-row gap-4">
                  <span className="text-4xl">{roadmap.icon}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        {roadmap.title}
                      </h3>
                      {roadmap.isFeatured && (
                        <span className="badge badge-warning flex-shrink-0">⭐ Featured</span>
                      )}
                    </div>

                    <p className="text-sm text-[var(--text-muted)] mb-3 line-clamp-2">
                      {roadmap.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <span>📂</span> {roadmap.category}
                      </span>
                      <span className="flex items-center gap-1.5 capitalize">
                        <span>📊</span> {roadmap.difficulty}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span>⏱️</span> {roadmap.duration || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span>📋</span> {roadmap.steps?.length || 0} steps
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span>👁️</span> {roadmap.views || 0} views
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap lg:flex-col gap-2 lg:items-end flex-shrink-0">
                    <button
                      onClick={() => toggleActive(roadmap)}
                      className="btn btn-xs"
                      style={{
                        background: roadmap.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: roadmap.isActive ? '#10b981' : '#ef4444',
                        border: 'none'
                      }}
                    >
                      {roadmap.isActive ? '● Active' : '○ Inactive'}
                    </button>
                    <button
                      onClick={() => setExpandedRoadmap(expandedRoadmap === roadmap._id ? null : roadmap._id)}
                      className="btn btn-ghost btn-xs"
                    >
                      {expandedRoadmap === roadmap._id ? '▲ Hide Steps' : '▼ Show Steps'}
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(roadmap)} className="btn btn-ghost btn-xs">
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(roadmap._id, roadmap.title)}
                        className="btn btn-xs"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Steps */}
                {expandedRoadmap === roadmap._id && roadmap.steps && roadmap.steps.length > 0 && (
                  <div className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <span>📋</span> Learning Path Steps
                    </h4>
                    <div className="space-y-3">
                      {roadmap.steps.map((step, index) => (
                        <div
                          key={step._id || index}
                          className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-7 h-7 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-medium text-[var(--text-primary)]">{step.title}</span>
                            {step.duration && (
                              <span className="text-xs text-[var(--text-muted)]">• {step.duration}</span>
                            )}
                          </div>
                          {step.topics && step.topics.length > 0 && (
                            <div className="ml-10 flex flex-wrap gap-2">
                              {step.topics.map((topic, i) => (
                                <span key={i} className="badge badge-info">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="modal-overlay open">
            <div className="modal modal-lg">
              <div className="modal-header">
                <h2>{editingRoadmap ? 'Edit Roadmap' : 'Create Roadmap'}</h2>
                <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Basic Info Section */}
                <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)]">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <span>📋</span> Basic Information
                  </h3>
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input-modern"
                        placeholder="Frontend Developer Roadmap"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-modern"
                        placeholder="Frontend Developer"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-grid form-grid-3 mt-4">
                    <div className="form-group">
                      <label className="form-label">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="input-modern"
                        placeholder="frontend-developer"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Icon</label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="input-modern"
                        placeholder="🗺️"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="input-modern"
                        placeholder="6-12 months"
                      />
                    </div>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)]">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <span>⚙️</span> Settings
                  </h3>
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="select-modern"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Difficulty</label>
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
                  <div className="form-group mt-4">
                    <label className="form-label">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="textarea-modern"
                      placeholder="A comprehensive roadmap for becoming a frontend developer..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-6 mt-4">
                    <label className="checkbox-modern">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Active</span>
                    </label>
                    <label className="checkbox-modern">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Featured</span>
                    </label>
                  </div>
                </div>

                {/* Steps Section */}
                <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <span>📚</span> Learning Steps
                    </h3>
                    <button type="button" onClick={addStep} className="btn btn-sm btn-ghost">
                      <span>+</span> Add Step
                    </button>
                  </div>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl"
                      >
                        <div className="flex gap-3 items-start mb-3">
                          <span className="flex-shrink-0 w-7 h-7 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg flex items-center justify-center">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                            placeholder="Step title"
                            className="input-modern flex-1"
                          />
                          <input
                            type="text"
                            value={step.duration || ''}
                            onChange={(e) => updateStep(index, 'duration', e.target.value)}
                            placeholder="Duration"
                            className="input-modern w-28"
                          />
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        <input
                          type="text"
                          value={(step.topics || []).join(', ')}
                          onChange={(e) => updateStep(index, 'topics', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                          placeholder="Topics (comma separated): HTML, CSS, JavaScript"
                          className="input-modern"
                        />
                      </div>
                    ))}
                    {steps.length === 0 && (
                      <div className="empty-state py-8">
                        <div className="empty-state-icon text-3xl">📝</div>
                        <p className="empty-state-text">No steps added yet. Click &quot;Add Step&quot; to create the learning path.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingRoadmap ? 'Update' : 'Create'} Roadmap
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content Importer Modal */}
        {showImporter && (
          <ContentImporter
            type="roadmap"
            onImportComplete={(result) => {
              toast[result.success ? 'success' : 'error'](`Imported ${result.imported} roadmap(s)${result.failed > 0 ? `, ${result.failed} failed` : ''}`);
              if (result.success) fetchRoadmaps();
            }}
            onClose={() => setShowImporter(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
