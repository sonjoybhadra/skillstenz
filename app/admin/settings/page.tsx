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
    siteName: 'TechTooTalk Learn',
    siteTagline: 'AI-Powered Learning Platform',
    logo: '',
    logoDark: '',
    logoIcon: 'T',
    logoText: 'TechTooTalk',
    logoAccentText: 'Talk',
    loaderType: 'spinner',
    loaderColor: '#0968c6',
    loaderImage: '',
    loaderText: 'Loading...',
    favicon: '/favicon.ico',
    contactEmail: 'contact@techtootalk.com',
    supportEmail: 'support@techtootalk.com',
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
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'loader' | 'general' | 'security' | 'social'>('branding');
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your platform settings and configurations
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {settingsCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg`}>
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {card.description}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Settings Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px overflow-x-auto">
            {[
              { id: 'branding', label: 'Logo & Branding', icon: '🎨' },
              { id: 'loader', label: 'Loader', icon: '⏳' },
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'security', label: 'Security', icon: '🔒' },
              { id: 'social', label: 'Social Links', icon: '🔗' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                🎨 Logo & Branding
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo Text (Main)
                  </label>
                  <input
                    type="text"
                    value={settings.logoText}
                    onChange={(e) => handleInputChange('logoText', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="TechTooTalk"
                  />
                  <p className="text-xs text-gray-500 mt-1">The main text of your logo</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo Accent Text
                  </label>
                  <input
                    type="text"
                    value={settings.logoAccentText}
                    onChange={(e) => handleInputChange('logoAccentText', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="Talk"
                  />
                  <p className="text-xs text-gray-500 mt-1">Part of logo text that&apos;s highlighted</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo Icon (Single Character)
                </label>
                <input
                  type="text"
                  value={settings.logoIcon}
                  onChange={(e) => handleInputChange('logoIcon', e.target.value.slice(0, 2))}
                  className="w-24 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-center text-xl font-bold"
                  maxLength={2}
                  placeholder="T"
                />
                <p className="text-xs text-gray-500 mt-1">Displayed when no logo image is uploaded (max 2 characters)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo Image (Light Theme)
                  </label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                    className="hidden"
                  />
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-violet-500 transition-colors"
                  >
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="max-h-20 mx-auto mb-2 object-contain" />
                    ) : (
                      <div className="text-4xl mb-2">📷</div>
                    )}
                    <p className="text-sm text-gray-500"><strong className="text-violet-600">Click to upload</strong> or drag and drop</p>
                  </div>
                  {settings.logo && (
                    <button
                      onClick={() => handleInputChange('logo', '')}
                      className="mt-2 text-sm text-red-500 hover:text-red-600"
                    >
                      🗑️ Remove Logo
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo Image (Dark Theme)
                  </label>
                  <input
                    type="file"
                    ref={logoDarkInputRef}
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logoDark')}
                    className="hidden"
                  />
                  <div 
                    onClick={() => logoDarkInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-violet-500 transition-colors"
                  >
                    {settings.logoDark ? (
                      <img src={settings.logoDark} alt="Logo Dark" className="max-h-20 mx-auto mb-2 object-contain" />
                    ) : (
                      <div className="text-4xl mb-2">🌙</div>
                    )}
                    <p className="text-sm text-gray-500"><strong className="text-violet-600">Click to upload</strong> for dark theme</p>
                  </div>
                  {settings.logoDark && (
                    <button
                      onClick={() => handleInputChange('logoDark', '')}
                      className="mt-2 text-sm text-red-500 hover:text-red-600"
                    >
                      🗑️ Remove Dark Logo
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon
                </label>
                <input
                  type="file"
                  ref={faviconInputRef}
                  accept="image/*,.ico"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'favicon')}
                  className="hidden"
                />
                <div 
                  onClick={() => faviconInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-violet-500 transition-colors inline-block"
                >
                  {settings.favicon && settings.favicon !== '/favicon.ico' ? (
                    <img src={settings.favicon} alt="Favicon" className="w-8 h-8 mx-auto" />
                  ) : (
                    <div className="text-2xl">🔖</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Upload favicon</p>
                </div>
              </div>

              {/* Logo Preview */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Preview:</p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 inline-flex items-center gap-3 border border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      settings.logoIcon || 'T'
                    )}
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {settings.logoText?.replace(settings.logoAccentText, '') || 'TechToo'}
                    <span className="text-violet-600">{settings.logoAccentText || 'Talk'}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loader Tab */}
          {activeTab === 'loader' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                ⏳ Loader Settings
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Loader Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {['spinner', 'dots', 'pulse', 'bars', 'custom'].map((type) => (
                    <div
                      key={type}
                      onClick={() => handleInputChange('loaderType', type)}
                      className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all ${
                        settings.loaderType === type
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-violet-400'
                      }`}
                    >
                      <div className="h-10 flex items-center justify-center mb-2" style={{ '--loader-color': settings.loaderColor } as React.CSSProperties}>
                        {type === 'spinner' && (
                          <div className="w-8 h-8 border-3 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: settings.loaderColor, borderWidth: '3px' }}></div>
                        )}
                        {type === 'dots' && (
                          <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                              <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: settings.loaderColor, animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                          </div>
                        )}
                        {type === 'pulse' && (
                          <div className="w-8 h-8 rounded-full animate-pulse" style={{ backgroundColor: settings.loaderColor }}></div>
                        )}
                        {type === 'bars' && (
                          <div className="flex gap-1 items-end h-8">
                            {[12, 20, 28, 20, 12].map((h, i) => (
                              <div key={i} className="w-1.5 rounded animate-pulse" style={{ height: `${h}px`, backgroundColor: settings.loaderColor, animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                          </div>
                        )}
                        {type === 'custom' && (
                          settings.loaderImage ? (
                            <img src={settings.loaderImage} alt="Custom" className="w-8 h-8" />
                          ) : (
                            <span className="text-2xl">🖼️</span>
                          )
                        )}
                      </div>
                      <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loader Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.loaderColor}
                      onChange={(e) => handleInputChange('loaderColor', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                    />
                    <input
                      type="text"
                      value={settings.loaderColor}
                      onChange={(e) => handleInputChange('loaderColor', e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      placeholder="#0968c6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loader Text
                  </label>
                  <input
                    type="text"
                    value={settings.loaderText}
                    onChange={(e) => handleInputChange('loaderText', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="Loading..."
                  />
                </div>
              </div>

              {settings.loaderType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Loader Image/GIF
                  </label>
                  <input
                    type="file"
                    ref={loaderImageInputRef}
                    accept="image/*,.gif"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'loaderImage')}
                    className="hidden"
                  />
                  <div 
                    onClick={() => loaderImageInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-violet-500 transition-colors"
                  >
                    {settings.loaderImage ? (
                      <img src={settings.loaderImage} alt="Loader" className="max-h-16 mx-auto mb-2" />
                    ) : (
                      <div className="text-4xl mb-2">🎬</div>
                    )}
                    <p className="text-sm text-gray-500"><strong className="text-violet-600">Upload</strong> a custom loader image or GIF</p>
                  </div>
                </div>
              )}

              {/* Loader Preview */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-8 flex flex-col items-center gap-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Preview:</p>
                <div className="h-12 flex items-center justify-center">
                  {settings.loaderType === 'spinner' && (
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: settings.loaderColor }}></div>
                  )}
                  {settings.loaderType === 'dots' && (
                    <div className="flex gap-2">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: settings.loaderColor, animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                  )}
                  {settings.loaderType === 'pulse' && (
                    <div className="w-12 h-12 rounded-full animate-pulse" style={{ backgroundColor: settings.loaderColor }}></div>
                  )}
                  {settings.loaderType === 'bars' && (
                    <div className="flex gap-1 items-end h-12">
                      {[16, 28, 40, 28, 16].map((h, i) => (
                        <div key={i} className="w-2 rounded animate-pulse" style={{ height: `${h}px`, backgroundColor: settings.loaderColor, animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                  )}
                  {settings.loaderType === 'custom' && settings.loaderImage && (
                    <img src={settings.loaderImage} alt="Custom Loader" className="w-12 h-12" />
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400">{settings.loaderText}</p>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.siteTagline}
                    onChange={(e) => handleInputChange('siteTagline', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default User Type
                  </label>
                  <select
                    value={settings.defaultUserType}
                    onChange={(e) => handleInputChange('defaultUserType', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  >
                    <option value="fresher">Fresher</option>
                    <option value="experienced">Experienced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    min="1"
                    max="168"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Temporarily disable the site for maintenance</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                      settings.maintenanceMode ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">User Registration</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow new users to register</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('registrationEnabled', !settings.registrationEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                      settings.registrationEnabled ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.registrationEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Verification Required</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Require email verification for new accounts</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('emailVerificationRequired', !settings.emailVerificationRequired)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                      settings.emailVerificationRequired ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.emailVerificationRequired ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Number of failed attempts before lockout</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    min="1"
                    max="168"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Auto logout after inactivity</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Changes to security settings will affect all users. Make sure to test these settings before applying them to production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span>𝕏</span> Twitter / X
                    </span>
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/your-handle"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span>💼</span> LinkedIn
                    </span>
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.linkedin}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/your-company"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span>🐱</span> GitHub
                    </span>
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.github}
                    onChange={(e) => handleSocialChange('github', e.target.value)}
                    placeholder="https://github.com/your-org"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span>📺</span> YouTube
                    </span>
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.youtube}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    placeholder="https://youtube.com/@your-channel"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span>💬</span> Discord
                    </span>
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.discord}
                    onChange={(e) => handleSocialChange('discord', e.target.value)}
                    placeholder="https://discord.gg/your-invite"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
