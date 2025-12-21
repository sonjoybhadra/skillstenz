'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logo: string;
  logoDark: string;
  logoIcon: string;
  logoText: string;
  logoAccentText: string;
  loaderType: string;
  loaderColor: string;
  loaderImage: string;
  loaderText: string;
  favicon: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  defaultUserType: 'fresher' | 'experienced';
  maxLoginAttempts: number;
  sessionTimeout: number;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
    youtube: string;
    discord: string;
  };
  // Menu Settings
  headerMenu: Array<{
    label: string;
    href: string;
    icon: string;
    isActive: boolean;
    order: number;
  }>;
  showTechBar: boolean;
  techBarTitle: string;
  featuredTechnologies: string[];
}

interface SettingsCard {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'SkillStenz',
    siteTagline: 'AI-Powered Learning Platform',
    logo: '',
    logoDark: '',
    logoIcon: 'T',
    logoText: 'SkillStenz',
    logoAccentText: 'Talk',
    loaderType: 'spinner',
    loaderColor: '#0968c6',
    loaderImage: '',
    loaderText: 'Loading...',
    favicon: '/favicon.ico',
    contactEmail: 'contact@skillstenz.com',
    supportEmail: 'support@skillstenz.com',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: false,
    defaultUserType: 'fresher',
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      youtube: '',
      discord: ''
    },
    headerMenu: [
      { label: 'Home', href: '/', icon: '🏠', isActive: true, order: 1 },
      { label: 'Technologies', href: '/technologies', icon: '🚀', isActive: true, order: 2 },
      { label: 'Courses', href: '/courses', icon: '📚', isActive: true, order: 3 },
      { label: 'Roadmaps', href: '/roadmaps', icon: '🗺️', isActive: true, order: 4 },
      { label: 'Tools', href: '/tools', icon: '🔧', isActive: true, order: 5 },
    ],
    showTechBar: true,
    techBarTitle: 'Explore Technologies',
    featuredTechnologies: ['python', 'javascript', 'react', 'nodejs', 'typescript', 'mongodb']
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'loader' | 'general' | 'security' | 'social' | 'menus'>('branding');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoDarkInputRef = useRef<HTMLInputElement>(null);
  const loaderImageInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const settingsCards: SettingsCard[] = [
    {
      title: 'SEO Settings',
      description: 'Manage meta tags, site title, descriptions, and search engine optimization',
      icon: '🔍',
      href: '/admin/seo',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'AdSense Settings',
      description: 'Configure Google AdSense publisher ID and ad placements',
      icon: '💰',
      href: '/admin/adsense',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Analytics',
      description: 'View site analytics, user behavior, and traffic statistics',
      icon: '📊',
      href: '/admin/analytics',
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: '👥',
      href: '/admin/users',
      color: 'from-orange-500 to-amber-500'
    },
    {
      title: 'Technologies',
      description: 'Manage learning technologies and categories',
      icon: '🚀',
      href: '/admin/technologies',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Courses',
      description: 'Manage courses, content, and curriculum',
      icon: '📚',
      href: '/admin/courses',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Cheatsheets',
      description: 'Manage cheatsheets and quick reference guides',
      icon: '📝',
      href: '/admin/cheatsheets',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/settings/site`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/settings/site`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save settings');
      }
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const handleImageUpload = async (file: File, field: 'logo' | 'logoDark' | 'loaderImage' | 'favicon') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'settings');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, [field]: data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Inline Styles for Admin Theme */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .settings-page { 
          color: var(--text-primary); 
        }
        .settings-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: 12px;
        }
        .settings-input {
          width: 100%;
          padding: 10px 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border-primary);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          transition: all 0.2s;
        }
        .settings-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(9, 104, 198, 0.1);
        }
        .settings-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }
        .settings-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          color: var(--text-muted);
        }
        .settings-tab:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }
        .settings-tab.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }
        .settings-toggle {
          position: relative;
          width: 44px;
          height: 24px;
          background: var(--border-primary);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .settings-toggle.active {
          background: var(--accent-primary);
        }
        .settings-toggle::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .settings-toggle.active::after {
          left: 22px;
        }
        .quick-link {
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .quick-link:hover {
          border-color: var(--accent-primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .save-btn {
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: linear-gradient(135deg, #0968c6 0%, #0756a3 100%);
          color: white !important;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(9, 104, 198, 0.3);
        }
        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .upload-zone {
          border: 2px dashed var(--border-primary);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .upload-zone:hover {
          border-color: var(--accent-primary);
          background: var(--bg-hover);
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>⚙️ Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage your platform settings and configurations
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="save-btn"
        >
          {saving ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              Saving...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {settingsCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="quick-link"
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              {card.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {card.description}
              </p>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>→</span>
          </Link>
        ))}
      </div>

      {/* Settings Form */}
      <div className="settings-card" style={{ overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--border-primary)', overflowX: 'auto', display: 'flex' }}>
          {[
            { id: 'branding', label: 'Logo & Branding', icon: '🎨' },
            { id: 'loader', label: 'Loader', icon: '⏳' },
            { id: 'general', label: 'General', icon: '⚙️' },
            { id: 'security', label: 'Security', icon: '🔒' },
            { id: 'social', label: 'Social Links', icon: '🔗' },
            { id: 'menus', label: 'Header & Menus', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎨 Logo & Branding
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="settings-label">Logo Text (Main)</label>
                  <input
                    type="text"
                    value={settings.logoText}
                    onChange={(e) => handleInputChange('logoText', e.target.value)}
                    className="settings-input"
                    placeholder="SkillStenz"
                  />
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>The main text of your logo</p>
                </div>
                <div>
                  <label className="settings-label">Logo Accent Text</label>
                  <input
                    type="text"
                    value={settings.logoAccentText}
                    onChange={(e) => handleInputChange('logoAccentText', e.target.value)}
                    className="settings-input"
                    placeholder="Talk"
                  />
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Part of logo text that&apos;s highlighted</p>
                </div>
              </div>

              <div>
                <label className="settings-label">Logo Icon (Single Character)</label>
                <input
                  type="text"
                  value={settings.logoIcon}
                  onChange={(e) => handleInputChange('logoIcon', e.target.value.slice(0, 2))}
                  className="settings-input"
                  style={{ width: '80px', textAlign: 'center', fontSize: '20px', fontWeight: 700 }}
                  maxLength={2}
                  placeholder="T"
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Displayed when no logo image is uploaded (max 2 characters)</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="settings-label">Logo Image (Light Theme)</label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                    style={{ display: 'none' }}
                  />
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="upload-zone"
                  >
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" style={{ maxHeight: '60px', margin: '0 auto 8px', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>📷</div>
                    )}
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}><strong style={{ color: 'var(--accent-primary)' }}>Click to upload</strong> or drag and drop</p>
                  </div>
                  {settings.logo && (
                    <button
                      onClick={() => handleInputChange('logo', '')}
                      style={{ marginTop: '8px', fontSize: '13px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      🗑️ Remove Logo
                    </button>
                  )}
                </div>

                <div>
                  <label className="settings-label">Logo Image (Dark Theme)</label>
                  <input
                    type="file"
                    ref={logoDarkInputRef}
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logoDark')}
                    style={{ display: 'none' }}
                  />
                  <div 
                    onClick={() => logoDarkInputRef.current?.click()}
                    className="upload-zone"
                  >
                    {settings.logoDark ? (
                      <img src={settings.logoDark} alt="Logo Dark" style={{ maxHeight: '60px', margin: '0 auto 8px', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌙</div>
                    )}
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}><strong style={{ color: 'var(--accent-primary)' }}>Click to upload</strong> for dark theme</p>
                  </div>
                  {settings.logoDark && (
                    <button
                      onClick={() => handleInputChange('logoDark', '')}
                      style={{ marginTop: '8px', fontSize: '13px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      🗑️ Remove Dark Logo
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="settings-label">Favicon</label>
                <input
                  type="file"
                  ref={faviconInputRef}
                  accept="image/*,.ico"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'favicon')}
                  style={{ display: 'none' }}
                />
                <div 
                  onClick={() => faviconInputRef.current?.click()}
                  className="upload-zone"
                  style={{ display: 'inline-block', padding: '16px 24px' }}
                >
                  {settings.favicon && settings.favicon !== '/favicon.ico' ? (
                    <img src={settings.favicon} alt="Favicon" style={{ width: '32px', height: '32px', margin: '0 auto' }} />
                  ) : (
                    <div style={{ fontSize: '24px' }}>🔖</div>
                  )}
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Upload favicon</p>
                </div>
              </div>

              {/* Logo Preview */}
              <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '24px' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '16px' }}>Preview:</p>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '16px', display: 'inline-flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border-primary)' }}>
                  <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0756a3 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, overflow: 'hidden' }}>
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      settings.logoIcon || 'T'
                    )}
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {settings.logoText?.replace(settings.logoAccentText, '') || 'TechToo'}
                    <span style={{ color: 'var(--accent-primary)' }}>{settings.logoAccentText || 'Talk'}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loader Tab */}
          {activeTab === 'loader' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⏳ Loader Settings
              </h3>
              
              <div>
                <label className="settings-label">Loader Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginTop: '8px' }}>
                  {['spinner', 'dots', 'pulse', 'bars', 'custom'].map((type) => (
                    <div
                      key={type}
                      onClick={() => handleInputChange('loaderType', type)}
                      style={{
                        padding: '16px',
                        border: `2px solid ${settings.loaderType === type ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: settings.loaderType === type ? 'rgba(9, 104, 198, 0.1)' : 'var(--bg-primary)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        {type === 'spinner' && (
                          <div style={{ width: '32px', height: '32px', border: '3px solid var(--border-primary)', borderTopColor: settings.loaderColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        )}
                        {type === 'dots' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[0, 1, 2].map(i => (
                              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: settings.loaderColor, animation: `bounce 0.6s ease-in-out ${i * 0.1}s infinite alternate` }}></div>
                            ))}
                          </div>
                        )}
                        {type === 'pulse' && (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: settings.loaderColor, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                        )}
                        {type === 'bars' && (
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '32px' }}>
                            {[12, 20, 28, 20, 12].map((h, i) => (
                              <div key={i} style={{ width: '6px', height: `${h}px`, borderRadius: '2px', backgroundColor: settings.loaderColor, animation: `pulse 1s ease-in-out ${i * 0.1}s infinite` }}></div>
                            ))}
                          </div>
                        )}
                        {type === 'custom' && (
                          settings.loaderImage ? (
                            <img src={settings.loaderImage} alt="Custom" style={{ width: '32px', height: '32px' }} />
                          ) : (
                            <span style={{ fontSize: '24px' }}>🖼️</span>
                          )
                        )}
                      </div>
                      <span style={{ fontSize: '13px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="settings-label">Loader Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="color"
                      value={settings.loaderColor}
                      onChange={(e) => handleInputChange('loaderColor', e.target.value)}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', cursor: 'pointer', border: '2px solid var(--border-primary)' }}
                    />
                    <input
                      type="text"
                      value={settings.loaderColor}
                      onChange={(e) => handleInputChange('loaderColor', e.target.value)}
                      className="settings-input"
                      style={{ flex: 1 }}
                      placeholder="#0968c6"
                    />
                  </div>
                </div>

                <div>
                  <label className="settings-label">Loader Text</label>
                  <input
                    type="text"
                    value={settings.loaderText}
                    onChange={(e) => handleInputChange('loaderText', e.target.value)}
                    className="settings-input"
                    placeholder="Loading..."
                  />
                </div>
              </div>

              {settings.loaderType === 'custom' && (
                <div>
                  <label className="settings-label">Custom Loader Image/GIF</label>
                  <input
                    type="file"
                    ref={loaderImageInputRef}
                    accept="image/*,.gif"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'loaderImage')}
                    style={{ display: 'none' }}
                  />
                  <div 
                    onClick={() => loaderImageInputRef.current?.click()}
                    className="upload-zone"
                  >
                    {settings.loaderImage ? (
                      <img src={settings.loaderImage} alt="Loader" style={{ maxHeight: '64px', margin: '0 auto 8px' }} />
                    ) : (
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎬</div>
                    )}
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}><strong style={{ color: 'var(--accent-primary)' }}>Upload</strong> a custom loader image or GIF</p>
                  </div>
                </div>
              )}

              {/* Loader Preview */}
              <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Preview:</p>
                <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {settings.loaderType === 'spinner' && (
                    <div style={{ width: '48px', height: '48px', border: '4px solid var(--border-primary)', borderTopColor: settings.loaderColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  )}
                  {settings.loaderType === 'dots' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: settings.loaderColor, animation: `bounce 0.6s ease-in-out ${i * 0.1}s infinite alternate` }}></div>
                      ))}
                    </div>
                  )}
                  {settings.loaderType === 'pulse' && (
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: settings.loaderColor, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                  )}
                  {settings.loaderType === 'bars' && (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '48px' }}>
                      {[16, 28, 40, 28, 16].map((h, i) => (
                        <div key={i} style={{ width: '8px', height: `${h}px`, borderRadius: '3px', backgroundColor: settings.loaderColor, animation: `pulse 1s ease-in-out ${i * 0.1}s infinite` }}></div>
                      ))}
                    </div>
                  )}
                  {settings.loaderType === 'custom' && settings.loaderImage && (
                    <img src={settings.loaderImage} alt="Custom Loader" style={{ width: '48px', height: '48px' }} />
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)' }}>{settings.loaderText}</p>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚙️ General Settings
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="settings-label">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label">Site Tagline</label>
                  <input
                    type="text"
                    value={settings.siteTagline}
                    onChange={(e) => handleInputChange('siteTagline', e.target.value)}
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label">Support Email</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                    className="settings-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="settings-label">Default User Type</label>
                  <select
                    value={settings.defaultUserType}
                    onChange={(e) => handleInputChange('defaultUserType', e.target.value)}
                    className="settings-input"
                  >
                    <option value="fresher">Fresher</option>
                    <option value="experienced">Experienced</option>
                  </select>
                </div>
                <div>
                  <label className="settings-label">Session Timeout (hours)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    min="1"
                    max="168"
                    className="settings-input"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Maintenance Mode</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Temporarily disable the site for maintenance</p>
                  </div>
                  <div
                    onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                    className={`settings-toggle ${settings.maintenanceMode ? 'active' : ''}`}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>User Registration</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Allow new users to register</p>
                  </div>
                  <div
                    onClick={() => handleInputChange('registrationEnabled', !settings.registrationEnabled)}
                    className={`settings-toggle ${settings.registrationEnabled ? 'active' : ''}`}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Email Verification Required</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Require email verification for new accounts</p>
                  </div>
                  <div
                    onClick={() => handleInputChange('emailVerificationRequired', !settings.emailVerificationRequired)}
                    className={`settings-toggle ${settings.emailVerificationRequired ? 'active' : ''}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔒 Security Settings
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="settings-label">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                    className="settings-input"
                  />
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Number of failed attempts before lockout</p>
                </div>
                <div>
                  <label className="settings-label">Session Timeout (hours)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    min="1"
                    max="168"
                    className="settings-input"
                  />
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Auto logout after inactivity</p>
                </div>
              </div>

              <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <div>
                    <h4 style={{ fontWeight: 500, color: '#f59e0b' }}>Security Notice</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Changes to security settings will affect all users. Make sure to test these settings before applying them to production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔗 Social Links
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="settings-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>𝕏</span> Twitter / X
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/your-handle"
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💼</span> LinkedIn
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.linkedin}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/your-company"
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🐱</span> GitHub
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.github}
                    onChange={(e) => handleSocialChange('github', e.target.value)}
                    placeholder="https://github.com/your-org"
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📺</span> YouTube
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.youtube}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    placeholder="https://youtube.com/@your-channel"
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💬</span> Discord
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.discord}
                    onChange={(e) => handleSocialChange('discord', e.target.value)}
                    placeholder="https://discord.gg/your-invite"
                    className="settings-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Header & Menus Tab */}
          {activeTab === 'menus' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Technology Bar Settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🚀 Technology Bar Settings
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Show Technology Bar</span>
                  <div
                    onClick={() => handleInputChange('showTechBar', !settings.showTechBar)}
                    className={`settings-toggle ${settings.showTechBar ? 'active' : ''}`}
                  />
                </div>

                <div>
                  <label className="settings-label">Technology Bar Title</label>
                  <input
                    type="text"
                    value={settings.techBarTitle}
                    onChange={(e) => handleInputChange('techBarTitle', e.target.value)}
                    className="settings-input"
                    placeholder="Explore Technologies"
                  />
                </div>

                <div>
                  <label className="settings-label">Featured Technologies (comma-separated slugs)</label>
                  <input
                    type="text"
                    value={settings.featuredTechnologies?.join(', ') || ''}
                    onChange={(e) => handleInputChange('featuredTechnologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className="settings-input"
                    placeholder="python, javascript, react, nodejs"
                  />
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Enter technology slugs separated by commas. Leave empty to show all technologies.</p>
                </div>
              </div>

              {/* Header Menu Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📋 Header Navigation Menu
                  </h3>
                  <button
                    onClick={() => {
                      const newItem = {
                        label: 'New Link',
                        href: '/',
                        icon: '📄',
                        isActive: true,
                        order: (settings.headerMenu?.length || 0) + 1
                      };
                      setSettings(prev => ({
                        ...prev,
                        headerMenu: [...(prev.headerMenu || []), newItem]
                      }));
                    }}
                    style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                  >
                    + Add Menu Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(settings.headerMenu || []).map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', cursor: 'move' }}>⠿</span>
                      <input
                        type="text"
                        value={item.icon}
                        onChange={(e) => {
                          const updated = [...settings.headerMenu];
                          updated[index] = { ...updated[index], icon: e.target.value };
                          setSettings(prev => ({ ...prev, headerMenu: updated }));
                        }}
                        className="settings-input"
                        style={{ width: '60px', textAlign: 'center' }}
                        placeholder="🏠"
                      />
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...settings.headerMenu];
                          updated[index] = { ...updated[index], label: e.target.value };
                          setSettings(prev => ({ ...prev, headerMenu: updated }));
                        }}
                        className="settings-input"
                        style={{ flex: 1 }}
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => {
                          const updated = [...settings.headerMenu];
                          updated[index] = { ...updated[index], href: e.target.value };
                          setSettings(prev => ({ ...prev, headerMenu: updated }));
                        }}
                        className="settings-input"
                        style={{ flex: 1 }}
                        placeholder="/path"
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) => {
                            const updated = [...settings.headerMenu];
                            updated[index] = { ...updated[index], isActive: e.target.checked };
                            setSettings(prev => ({ ...prev, headerMenu: updated }));
                          }}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active</span>
                      </label>
                      <button
                        onClick={() => {
                          const updated = settings.headerMenu.filter((_, i) => i !== index);
                          setSettings(prev => ({ ...prev, headerMenu: updated }));
                        }}
                        style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  
                  {(!settings.headerMenu || settings.headerMenu.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No menu items. Click &quot;Add Menu Item&quot; to create one.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div style={{ position: 'sticky', bottom: 0, marginTop: '16px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', padding: '12px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="save-btn"
        >
          {saving ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              Saving...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
