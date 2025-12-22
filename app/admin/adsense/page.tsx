'use client';

import { useState, useEffect } from 'react';

interface AdUnit {
  id: string;
  name: string;
  type: 'display' | 'infeed' | 'inArticle' | 'multiplex';
  placement: string;
  code: string;
  enabled: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdSenseManagementPage() {
  const [publisherId, setPublisherId] = useState('');
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [autoAds, setAutoAds] = useState(false);
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnit, setNewUnit] = useState<{
    name: string;
    type: 'display' | 'infeed' | 'inArticle' | 'multiplex';
    placement: string;
    code: string;
  }>({
    name: '',
    type: 'display',
    placement: 'header',
    code: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/settings/adsense`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPublisherId(data.adsensePublisherId || '');
        setAdsEnabled(data.adsEnabled || false);
        setAutoAds(data.autoAds || false);
        setAdUnits(data.adUnits?.map((unit: AdUnit, index: number) => ({
          ...unit,
          id: unit.id || String(index)
        })) || []);
      }
    } catch (error) {
      console.error('Failed to fetch AdSense settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/settings/adsense`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          adsensePublisherId: publisherId,
          adsEnabled,
          autoAds,
          adUnits
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'AdSense settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleAddUnit = () => {
    if (!newUnit.name || !newUnit.code) {
      alert('Please fill in all fields');
      return;
    }
    setAdUnits([...adUnits, {
      ...newUnit,
      id: Date.now().toString(),
      enabled: true
    }]);
    setNewUnit({ name: '', type: 'display', placement: 'header', code: '' });
    setShowAddModal(false);
  };

  const toggleAdUnit = (id: string) => {
    setAdUnits(adUnits.map(unit =>
      unit.id === id ? { ...unit, enabled: !unit.enabled } : unit
    ));
  };

  const deleteAdUnit = (id: string) => {
    if (confirm('Are you sure you want to delete this ad unit?')) {
      setAdUnits(adUnits.filter(unit => unit.id !== id));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            AdSense Management
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Configure Google AdSense and manage ad placements
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Ad Unit
        </button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '24px',
          borderRadius: 'var(--radius-md)',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Publisher Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Publisher Settings
          </h3>

          <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                AdSense Publisher ID
              </label>
              <input
                type="text"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '15px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  background: adsEnabled ? '#10b981' : 'var(--border-primary)',
                  position: 'relative',
                  transition: 'background 0.3s',
                  cursor: 'pointer'
                }} onClick={() => setAdsEnabled(!adsEnabled)}>
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: adsEnabled ? '22px' : '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '12px',
                    background: 'white',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Enable Ads</span>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Show ads on your site</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  background: autoAds ? '#10b981' : 'var(--border-primary)',
                  position: 'relative',
                  transition: 'background 0.3s',
                  cursor: 'pointer'
                }} onClick={() => setAutoAds(!autoAds)}>
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: autoAds ? '22px' : '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '12px',
                    background: 'white',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Auto Ads</span>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Let Google place ads automatically</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Units */}
      <div className="card">
        <div className="card-body" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Ad Units ({adUnits.length})
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Placement</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Ad Code</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adUnits.map((unit) => (
                  <tr key={unit.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 500 }}>{unit.name}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: unit.type === 'display' ? 'rgba(59, 130, 246, 0.1)' : 
                                   unit.type === 'inArticle' ? 'rgba(16, 185, 129, 0.1)' : 
                                   'rgba(245, 158, 11, 0.1)',
                        color: unit.type === 'display' ? '#3b82f6' : 
                               unit.type === 'inArticle' ? '#10b981' : '#f59e0b'
                      }}>
                        {unit.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{unit.placement}</td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '13px' }}>{unit.code}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: unit.enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: unit.enabled ? '#10b981' : '#ef4444'
                      }}>
                        {unit.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => toggleAdUnit(unit.id)}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid var(--border-primary)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {unit.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => deleteAdUnit(unit.id)}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'transparent',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ minWidth: '120px' }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Add Ad Unit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Add Ad Unit</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Ad Unit Name
                </label>
                <input
                  type="text"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                  placeholder="e.g., Homepage Banner"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Ad Type
                </label>
                <select
                  value={newUnit.type}
                  onChange={(e) => setNewUnit({ ...newUnit, type: e.target.value as 'display' | 'infeed' | 'inArticle' | 'multiplex' })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="display">Display Ad</option>
                  <option value="infeed">In-Feed Ad</option>
                  <option value="inArticle">In-Article Ad</option>
                  <option value="multiplex">Multiplex Ad</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Placement
                </label>
                <select
                  value={newUnit.placement}
                  onChange={(e) => setNewUnit({ ...newUnit, placement: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="header">Header</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="content">In Content</option>
                  <option value="footer">Footer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Ad Unit Code (data-ad-slot)
                </label>
                <input
                  type="text"
                  value={newUnit.code}
                  onChange={(e) => setNewUnit({ ...newUnit, code: e.target.value })}
                  placeholder="1234567890"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn"
                style={{ background: 'transparent', border: '1px solid var(--border-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUnit}
                className="btn btn-primary"
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
