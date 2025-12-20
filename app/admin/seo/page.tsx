'use client';

import { useState, useEffect } from 'react';

interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  ogImage: string;
  twitterHandle: string;
  googleVerification: string;
  bingVerification: string;
  googleAnalyticsId: string;
  robotsTxt: string;
  structuredData: boolean;
}

const API_URL = 'http://localhost:5000/api';

export default function SEOSettingsPage() {
  const [settings, setSettings] = useState<SEOSettings>({
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
    ogImage: '',
    twitterHandle: '',
    googleVerification: '',
    bingVerification: '',
    googleAnalyticsId: '',
    robotsTxt: '',
    structuredData: true
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/settings/seo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings({
          siteTitle: data.siteTitle || '',
          siteDescription: data.siteDescription || '',
          siteKeywords: data.siteKeywords || '',
          ogImage: data.ogImage || '',
          twitterHandle: data.twitterHandle || '',
          googleVerification: data.googleVerification || '',
          bingVerification: data.bingVerification || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
          robotsTxt: data.robotsTxt || '',
          structuredData: data.structuredData ?? true
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/settings/seo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'SEO settings saved successfully!' });
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
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          SEO Settings
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage search engine optimization and meta tags for your site
        </p>
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

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '24px' }}>
        {['general', 'social', 'verification', 'advanced'].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: '24px' }}>
          {/* General Tab */}
          {activeTab === 'general' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Site Title
                </label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
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
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Recommended: 50-60 characters. Current: {settings.siteTitle.length}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Meta Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Recommended: 150-160 characters. Current: {settings.siteDescription.length}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Keywords (comma separated)
                </label>
                <textarea
                  value={settings.siteKeywords}
                  onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.structuredData}
                    onChange={(e) => setSettings({ ...settings, structuredData: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Enable Structured Data (JSON-LD)</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Adds rich snippets for better search appearance
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Open Graph Image URL
                </label>
                <input
                  type="text"
                  value={settings.ogImage}
                  onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                  placeholder="/og-image.jpg"
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
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Recommended size: 1200x630 pixels
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={settings.twitterHandle}
                  onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                  placeholder="@yourusername"
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

              {/* Preview */}
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
                  📱 Social Preview
                </h4>
                <div style={{
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  maxWidth: '400px'
                }}>
                  <div style={{ height: '200px', background: 'var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>OG Image Preview</span>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>techtootalk.com</p>
                    <h5 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {settings.siteTitle.slice(0, 60)}
                    </h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {settings.siteDescription.slice(0, 100)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div>
              <div style={{
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px'
              }}>
                <p style={{ fontSize: '14px', color: '#3b82f6' }}>
                  🔍 Add verification codes from Google Search Console and Bing Webmaster Tools to verify your site ownership.
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Google Search Console Verification Code
                </label>
                <input
                  type="text"
                  value={settings.googleVerification}
                  onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })}
                  placeholder="Enter verification code from Google Search Console"
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
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Get this from: Google Search Console → Settings → Ownership verification → HTML tag
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Bing Webmaster Verification Code
                </label>
                <input
                  type="text"
                  value={settings.bingVerification}
                  onChange={(e) => setSettings({ ...settings, bingVerification: e.target.value })}
                  placeholder="Enter verification code from Bing Webmaster"
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

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
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
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  robots.txt Content
                </label>
                <textarea
                  value={settings.robotsTxt}
                  onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  This content will be served at /robots.txt
                </p>
              </div>
            </div>
          )}
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
    </div>
  );
}
