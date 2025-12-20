'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../lib/auth';
import toast from 'react-hot-toast';

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
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Cheatsheets Management
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Create and manage quick reference guides</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>+</span> Add Cheatsheet
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search cheatsheets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)'
            }}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              minWidth: '160px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-accent)' }}>{cheatsheets.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Cheatsheets</div>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>
              {cheatsheets.filter(c => c.isPublished).length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Published</div>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>
              {cheatsheets.filter(c => c.isFeatured).length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Featured</div>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6' }}>
              {cheatsheets.reduce((sum, c) => sum + c.views, 0)}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Views</div>
          </div>
        </div>

        {/* Cheatsheets Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredCheatsheets.map((cheatsheet) => (
              <div key={cheatsheet._id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{cheatsheet.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {cheatsheet.title}
                      </h3>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        background: cheatsheet.technology?.color || '#3b82f6',
                        color: 'white',
                        borderRadius: '4px'
                      }}>
                        {cheatsheet.technology?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {cheatsheet.isPublished && <span title="Published" style={{ fontSize: '14px' }}>✅</span>}
                    {cheatsheet.isFeatured && <span title="Featured" style={{ fontSize: '14px' }}>⭐</span>}
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                  {cheatsheet.description.slice(0, 100)}...
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '4px',
                    color: 'var(--text-muted)'
                  }}>
                    {cheatsheet.category}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: cheatsheet.difficulty === 'beginner' ? '#dcfce7' : cheatsheet.difficulty === 'intermediate' ? '#fef3c7' : '#fee2e2',
                    color: cheatsheet.difficulty === 'beginner' ? '#15803d' : cheatsheet.difficulty === 'intermediate' ? '#b45309' : '#b91c1c',
                    borderRadius: '4px'
                  }}>
                    {cheatsheet.difficulty}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span>👁️ {cheatsheet.views}</span>
                    <span>⬇️ {cheatsheet.downloads}</span>
                    <span>👍 {cheatsheet.votes?.upvotes || 0}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => togglePublish(cheatsheet)}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                  >
                    {cheatsheet.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleEdit(cheatsheet)}
                    className="btn"
                    style={{ padding: '8px 12px', background: 'var(--bg-secondary)', fontSize: '13px' }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cheatsheet._id)}
                    className="btn"
                    style={{ padding: '8px 12px', background: '#fee2e2', color: '#b91c1c', fontSize: '13px' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCheatsheets.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <p>No cheatsheets found. Create your first one!</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {editingCheatsheet ? 'Edit Cheatsheet' : 'Add Cheatsheet'}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="auto-generated"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Technology *</label>
                    <select
                      required
                      value={formData.technology}
                      onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="">Select Technology</option>
                      {technologies.map(tech => (
                        <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Content (Markdown) *</label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="# Title\n\n## Section\n\n- Item 1\n- Item 2"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="python, basics, quick-reference"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Icon</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '20px', textAlign: 'center' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Color</label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      style={{ width: '100%', height: '42px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>Published</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>Featured</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                    {editingCheatsheet ? 'Update' : 'Create'} Cheatsheet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
