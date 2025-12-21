'use client';

import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  profileImage?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  socialLinks?: { github?: string; linkedin?: string; twitter?: string; youtube?: string; };
  instructorTitle?: string;
  instructorBio?: string;
  expertise?: string[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ROLES = [
  { value: 'student', label: '🎓 Student', color: '#3b82f6' },
  { value: 'instructor', label: '👨‍🏫 Instructor', color: '#10b981' },
  { value: 'admin', label: '👑 Admin', color: '#f59e0b' }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', role: 'student', profileImage: '', bio: '', phone: '',
    location: '', website: '', github: '', linkedin: '', twitter: '', youtube: '',
    instructorTitle: '', instructorBio: '', expertise: '', isActive: true, isVerified: false
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => { fetchUsers(); }, [searchQuery, filterRole]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      let url = `${API_URL}/auth/users?limit=100`;
      if (searchQuery) url += `&search=${searchQuery}`;
      if (filterRole) url += `&role=${filterRole}`;
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) { const data = await response.json(); setUsers(data.users || []); }
    } catch (error) { console.error('Failed to fetch:', error); }
    finally { setLoading(false); }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '', email: user.email || '', role: user.role || 'student',
      profileImage: user.profileImage || '', bio: user.bio || '', phone: user.phone || '',
      location: user.location || '', website: user.website || '',
      github: user.socialLinks?.github || '', linkedin: user.socialLinks?.linkedin || '',
      twitter: user.socialLinks?.twitter || '', youtube: user.socialLinks?.youtube || '',
      instructorTitle: user.instructorTitle || '', instructorBio: user.instructorBio || '',
      expertise: user.expertise?.join(', ') || '', isActive: user.isActive !== false, isVerified: user.isVerified || false
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) { setMessage({ type: 'error', text: 'Name and email are required' }); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        ...formData,
        socialLinks: { github: formData.github, linkedin: formData.linkedin, twitter: formData.twitter, youtube: formData.youtube },
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean)
      };
      const response = await fetch(`${API_URL}/auth/users/${editingUser?._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) { setMessage({ type: 'success', text: 'User updated!' }); setShowModal(false); fetchUsers(); }
      else { const error = await response.json(); setMessage({ type: 'error', text: error.message }); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  };

  const toggleActive = async (user: User) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${API_URL}/auth/users/${user._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ isActive: !user.isActive })
    });
    fetchUsers();
  };

  const changeRole = async (user: User, newRole: string) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${API_URL}/auth/users/${user._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: newRole })
    });
    fetchUsers();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/auth/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) { setMessage({ type: 'success', text: 'User deleted!' }); fetchUsers(); }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
  };

  const getRoleStyle = (role: string) => {
    const r = ROLES.find(r => r.value === role);
    return { background: `${r?.color}15`, color: r?.color || '#6b7280' };
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Users Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage users, roles, and profiles ({users.length} total)</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>🎓 {users.filter(u => u.role === 'student').length} Students</span>
          <span style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>👨‍🏫 {users.filter(u => u.role === 'instructor').length} Instructors</span>
          <span style={{ padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>👑 {users.filter(u => u.role === 'admin').length} Admins</span>
        </div>
      </div>

      {message.text && <div style={{ padding: '12px 16px', marginBottom: '24px', borderRadius: 'var(--radius-md)', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444' }}>{message.text}</div>}

      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '10px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ padding: '10px 16px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <option value="">All Roles</option>
            {ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>User</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Email</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Role</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Joined</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
              ) : users.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-primary)' }}>
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>{user.name?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {user.name}
                          {user.isVerified && <span title="Verified" style={{ fontSize: '14px' }}>✅</span>}
                        </div>
                        {user.instructorTitle && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.instructorTitle}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>{user.email}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <select value={user.role} onChange={(e) => changeRole(user, e.target.value)} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 500, border: 'none', borderRadius: '8px', cursor: 'pointer', ...getRoleStyle(user.role) }}>
                      {ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button onClick={() => toggleActive(user)} style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 500, border: 'none', borderRadius: '12px', cursor: 'pointer', background: user.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: user.isActive ? '#10b981' : '#ef4444' }}>{user.isActive ? 'Active' : 'Blocked'}</button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => openEditModal(user)} style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>Edit Profile</button>
                      <button onClick={() => handleDelete(user._id, user.name)} style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {showModal && editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Edit User Profile</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-muted)' }}>{formData.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Basic Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Role</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Profile Image URL</label><input type="text" value={formData.profileImage} onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City, Country" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Bio</label><textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }} /></div>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '16px' }}>Social Links</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>🔗 Website</label><input type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://yoursite.com" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>🐙 GitHub</label><input type="text" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="username" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>💼 LinkedIn</label><input type="text" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="username" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>🐦 Twitter</label><input type="text" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} placeholder="@username" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              </div>

              {(formData.role === 'instructor' || formData.role === 'admin') && (
                <>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '16px' }}>Instructor Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Title</label><input type="text" value={formData.instructorTitle} onChange={(e) => setFormData({ ...formData, instructorTitle: e.target.value })} placeholder="Senior Developer" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                    <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Expertise (comma)</label><input type="text" value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} placeholder="Python, JavaScript, ML" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Instructor Bio</label><textarea value={formData.instructorBio} onChange={(e) => setFormData({ ...formData, instructorBio: e.target.value })} rows={3} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }} /></div>
                  </div>
                </>
              )}

              <div style={{ marginTop: '24px', display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ width: '18px', height: '18px' }} /><span style={{ color: 'var(--text-primary)' }}>Active Account</span></label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={formData.isVerified} onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })} style={{ width: '18px', height: '18px' }} /><span style={{ color: 'var(--text-primary)' }}>Verified</span></label>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-primary)' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Update User'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
