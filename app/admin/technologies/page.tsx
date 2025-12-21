'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Technology {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon: string;
  image?: string;
  color: string;
  category: string | { _id: string; name: string; slug: string; icon: string; color: string };
  difficulty: string;
  accessType: string;
  featured: boolean;
  isPublished: boolean;
  views: number;
  courseCount: number;
  votes: { upvotes: number; downvotes: number; };
  createdAt: string;
}

interface TechnologyCategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export default function AdminTechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [categories, setCategories] = useState<TechnologyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '', icon: '💻',
    image: '', color: '#3b82f6', category: '', difficulty: 'beginner',
    accessType: 'free', featured: false, isPublished: true, tags: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/technology-categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) { console.error('Failed to fetch categories:', error); }
  };

  const fetchTechnologies = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      let url = `${API_URL}/technologies?limit=100`;
      if (searchQuery) url += `&search=${searchQuery}`;
      if (filterCategory) url += `&category=${filterCategory}`;
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setTechnologies(data.technologies || []);
      }
    } catch (error) { console.error('Failed to fetch:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchCategories();
    fetchTechnologies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => { 
    fetchTechnologies(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterCategory]);

  const getCategoryName = (cat: string | { _id: string; name: string; slug: string; icon: string; color: string } | undefined) => {
    if (!cat) return 'Uncategorized';
    if (typeof cat === 'object') return `${cat.icon} ${cat.name}`;
    const found = categories.find(c => c._id === cat || c.slug === cat);
    return found ? `${found.icon} ${found.name}` : cat;
  };

  const getCategoryId = (cat: string | { _id: string; name: string; slug: string; icon: string; color: string } | undefined) => {
    if (!cat) return '';
    if (typeof cat === 'object') return cat._id;
    return cat;
  };

  const openAddModal = () => {
    setEditingTech(null);
    setFormData({ name: '', slug: '', description: '', shortDescription: '', icon: '💻', image: '', color: '#3b82f6', category: categories[0]?._id || '', difficulty: 'beginner', accessType: 'free', featured: false, isPublished: true, tags: '' });
    setShowModal(true);
  };

  const openEditModal = (tech: Technology) => {
    setEditingTech(tech);
    setFormData({ name: tech.name, slug: tech.slug, description: tech.description || '', shortDescription: tech.shortDescription || '', icon: tech.icon || '💻', image: tech.image || '', color: tech.color || '#3b82f6', category: getCategoryId(tech.category), difficulty: tech.difficulty || 'beginner', accessType: tech.accessType || 'free', featured: tech.featured || false, isPublished: tech.isPublished !== false, tags: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name) { setMessage({ type: 'error', text: 'Name is required' }); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const method = editingTech ? 'PUT' : 'POST';
      const url = editingTech ? `${API_URL}/technologies/${editingTech._id}` : `${API_URL}/technologies`;
      const response = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) })
      });
      if (response.ok) { setMessage({ type: 'success', text: `Technology ${editingTech ? 'updated' : 'created'}!` }); setShowModal(false); fetchTechnologies(); }
      else { const error = await response.json(); setMessage({ type: 'error', text: error.message }); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/technologies/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) { setMessage({ type: 'success', text: 'Deleted!' }); fetchTechnologies(); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
  };

  const togglePublish = async (tech: Technology) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${API_URL}/technologies/${tech._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ isPublished: !tech.isPublished }) });
    fetchTechnologies();
  };

  const toggleFeatured = async (tech: Technology) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${API_URL}/technologies/${tech._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ featured: !tech.featured }) });
    fetchTechnologies();
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Technologies Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage learning technologies ({technologies.length} total)</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">+ Add Technology</button>
      </div>

      {message.text && <div style={{ padding: '12px 16px', marginBottom: '24px', borderRadius: 'var(--radius-md)', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444' }}>{message.text}</div>}

      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ flex: 1, minWidth: '200px', padding: '10px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Technology</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Views</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Votes</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const paginated = technologies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                return paginated.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No technologies found. Add your first!</td></tr>
                ) : paginated.map((tech) => (
                <tr key={tech._id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>{tech.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tech.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/{tech.slug}</div>
                      </div>
                      {tech.featured && <span style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '4px' }}>⭐</span>}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}><span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 500, background: 'var(--bg-secondary)', borderRadius: '6px', textTransform: 'capitalize' }}>{getCategoryName(tech.category)}</span></td>
                  <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>{tech.views || 0}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}><span style={{ color: '#10b981' }}>↑{tech.votes?.upvotes || 0}</span> / <span style={{ color: '#ef4444' }}>↓{tech.votes?.downvotes || 0}</span></td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button onClick={() => togglePublish(tech)} style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 500, border: 'none', borderRadius: '12px', cursor: 'pointer', background: tech.isPublished ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: tech.isPublished ? '#10b981' : '#ef4444' }}>{tech.isPublished ? 'Published' : 'Draft'}</button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link href={`/${tech.slug}`} target="_blank" style={{ padding: '6px 10px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'none' }}>View</Link>
                      <button onClick={() => toggleFeatured(tech)} style={{ padding: '6px 10px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: tech.featured ? 'rgba(245, 158, 11, 0.1)' : 'transparent', color: tech.featured ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>⭐</button>
                      <button onClick={() => openEditModal(tech)} style={{ padding: '6px 10px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDelete(tech._id, tech.name)} style={{ padding: '6px 10px', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
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
          const totalPages = Math.ceil(technologies.length / itemsPerPage);
          if (totalPages <= 1) return null;
          return (
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, technologies.length)} of {technologies.length}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>← Prev</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) page = currentPage - 2 + i;
                    if (currentPage > totalPages - 2) page = totalPages - 4 + i;
                  }
                  return (
                    <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: currentPage === page ? 'var(--bg-accent)' : 'transparent', color: currentPage === page ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}>{page}</button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-primary)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next →</button>
              </div>
            </div>
          );
        })()}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>{editingTech ? 'Edit Technology' : 'Add Technology'}</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} placeholder="Python" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Slug</label><input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="python" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Icon</label><input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="🐍" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Color</label><div style={{ display: 'flex', gap: '8px' }}><input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} style={{ width: '50px', height: '42px', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} /><input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}><option value="">Select Category</option>{categories.map(cat => <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>)}</select></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Difficulty</label><select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Access</label><select value={formData.accessType} onChange={(e) => setFormData({ ...formData, accessType: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}><option value="free">Free</option><option value="paid">Paid</option><option value="mixed">Mixed</option></select></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Image URL</label><input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              </div>
              <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Short Description</label><input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Brief description" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }} /></div>
              <div style={{ marginTop: '20px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Tags (comma)</label><input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="programming, backend" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} style={{ width: '18px', height: '18px' }} /><span style={{ color: 'var(--text-primary)' }}>Featured</span></label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} style={{ width: '18px', height: '18px' }} /><span style={{ color: 'var(--text-primary)' }}>Published</span></label>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-primary)' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : (editingTech ? 'Update' : 'Create')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
