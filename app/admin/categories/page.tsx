'use client';

import { useState, useEffect } from 'react';

interface TechnologyCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
  order: number;
  isPublished: boolean;
  featured: boolean;
  technologiesCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const defaultCategories = [
  { name: 'Web Development', icon: '🌐', color: '#3B82F6', description: 'Frontend and backend web technologies' },
  { name: 'Full Stack', icon: '🚀', color: '#8B5CF6', description: 'Complete full-stack development' },
  { name: 'MERN Stack', icon: '⚛️', color: '#61DAFB', description: 'MongoDB, Express, React, Node.js' },
  { name: 'MEAN Stack', icon: '🅰️', color: '#DD0031', description: 'MongoDB, Express, Angular, Node.js' },
  { name: 'DevOps', icon: '⚙️', color: '#FF6B6B', description: 'CI/CD, Cloud, Infrastructure' },
  { name: 'Mobile Development', icon: '📱', color: '#10B981', description: 'iOS, Android, Cross-platform' },
  { name: 'Data Science', icon: '📊', color: '#F59E0B', description: 'Data analysis and visualization' },
  { name: 'AI & Machine Learning', icon: '🤖', color: '#EC4899', description: 'Artificial Intelligence technologies' },
  { name: 'Database', icon: '🗄️', color: '#6366F1', description: 'SQL, NoSQL, Database management' },
  { name: 'Cloud Computing', icon: '☁️', color: '#0EA5E9', description: 'AWS, Azure, GCP' },
  { name: 'Cybersecurity', icon: '🔐', color: '#EF4444', description: 'Security and penetration testing' },
  { name: 'Programming Languages', icon: '💻', color: '#22C55E', description: 'Core programming languages' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<TechnologyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TechnologyCategory | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📂',
    color: '#3B82F6',
    image: '',
    order: 0,
    isPublished: true,
    featured: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const getToken = () => localStorage.getItem('accessToken');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/technology-categories/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = getToken();
      const url = editingCategory 
        ? `${API_URL}/technology-categories/${editingCategory._id}`
        : `${API_URL}/technology-categories`;
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: editingCategory ? 'Category updated!' : 'Category created!' });
        setShowModal(false);
        resetForm();
        fetchCategories();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to save category' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Technologies using it will need to be reassigned.')) return;
    
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/technology-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Category deleted!' });
        fetchCategories();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to delete' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const seedDefaultCategories = async () => {
    if (!confirm('This will add default categories. Continue?')) return;
    
    setSaving(true);
    try {
      const token = getToken();
      
      for (const cat of defaultCategories) {
        await fetch(`${API_URL}/technology-categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...cat,
            slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            order: defaultCategories.indexOf(cat),
            isPublished: true,
            featured: false
          })
        });
      }
      
      setMessage({ type: 'success', text: 'Default categories added!' });
      fetchCategories();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to seed categories' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const openEditModal = (category: TechnologyCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon,
      color: category.color,
      image: category.image || '',
      order: category.order,
      isPublished: category.isPublished,
      featured: category.featured
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '📂',
      color: '#3B82F6',
      image: '',
      order: categories.length,
      isPublished: true,
      featured: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Technology Categories</h1>
          <p className="text-[var(--text-secondary)]">Organize technologies into categories (Web Dev, Full Stack, DevOps, etc.)</p>
        </div>
        <div className="flex gap-3">
          {categories.length === 0 && (
            <button
              onClick={seedDefaultCategories}
              disabled={saving}
              className="px-4 py-2 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)] flex items-center gap-2"
            >
              <span>🌱</span> Seed Defaults
            </button>
          )}
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <span>+</span> Add Category
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--bg-accent)] border-t-transparent"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">No categories yet</h3>
          <p className="text-[var(--text-secondary)] mb-4">Create categories to organize your technologies</p>
          <button
            onClick={seedDefaultCategories}
            disabled={saving}
            className="px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90"
          >
            🌱 Add Default Categories
          </button>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', maxWidth: '300px', padding: '10px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Table View */}
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Slug</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Technologies</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Order</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = categories
                      .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || cat.slug.toLowerCase().includes(searchQuery.toLowerCase()))
                      .sort((a, b) => a.order - b.order);
                    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                    
                    return paginated.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No categories found</td></tr>
                    ) : paginated.map((category) => (
                      <tr key={category._id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '28px', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: category.color + '20' }}>{category.icon}</span>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{category.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category.description}</div>
                            </div>
                            {category.featured && <span style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '4px' }}>⭐</span>}
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>/{category.slug}</td>
                        <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-primary)' }}>{category.technologiesCount || 0}</td>
                        <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>{category.order}</td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 500, border: 'none', borderRadius: '12px', background: category.isPublished ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: category.isPublished ? '#10b981' : '#ef4444' }}>{category.isPublished ? 'Published' : 'Draft'}</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => openEditModal(category)} style={{ padding: '6px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                            <button onClick={() => handleDelete(category._id)} style={{ padding: '6px 12px', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
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
              const filtered = categories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || cat.slug.toLowerCase().includes(searchQuery.toLowerCase()));
              const totalPages = Math.ceil(filtered.length / itemsPerPage);
              if (totalPages <= 1) return null;
              return (
                <div style={{ padding: '16px', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: currentPage === page ? 'var(--bg-accent)' : 'transparent', color: currentPage === page ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}>{page}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-primary)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next →</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border-primary)] flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })}
                    required
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                    placeholder="e.g., Web Development"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-center text-2xl"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                    placeholder="web-development"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                  placeholder="Brief description of this category"
                />
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

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Published</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Featured</span>
                </label>
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
                  {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
