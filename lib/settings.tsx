'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logo: string;
  logoDark: string;
  logoIcon: string;
  logoText: string;
  logoAccentText: string;
  loaderType: 'spinner' | 'dots' | 'pulse' | 'bars' | 'custom';
  loaderColor: string;
  loaderImage: string;
  loaderText: string;
  favicon: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
    youtube: string;
    discord: string;
  };
  // Menu settings
  headerMenu?: Array<{
    label: string;
    href: string;
    icon: string;
    isActive: boolean;
    order: number;
  }>;
  showTechBar?: boolean;
  techBarTitle?: string;
  featuredTechnologies?: string[];
}

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
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
  socialLinks: {
    twitter: '',
    linkedin: '',
    github: '',
    youtube: '',
    discord: ''
  },
  showTechBar: true,
  techBarTitle: 'Explore',
  featuredTechnologies: []
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {}
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/public/site');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    setLoading(true);
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Dynamic Loader Component
export function DynamicLoader({ size = 'medium', showText = true }: { size?: 'small' | 'medium' | 'large'; showText?: boolean }) {
  const { settings, loading: settingsLoading } = useSettings();
  
  const sizeMap = {
    small: { loader: 24, text: 12 },
    medium: { loader: 40, text: 14 },
    large: { loader: 56, text: 16 }
  };

  const s = sizeMap[size];

  if (settingsLoading) {
    // Default spinner while settings load
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: s.loader,
            height: s.loader,
            border: '3px solid #e2e8f0',
            borderTopColor: '#0968c6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <style jsx global>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.7; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.7; } }
      `}</style>

      {settings.loaderType === 'spinner' && (
        <div
          style={{
            width: s.loader,
            height: s.loader,
            border: '3px solid #e2e8f0',
            borderTopColor: settings.loaderColor,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
      )}

      {settings.loaderType === 'dots' && (
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: s.loader / 4,
                height: s.loader / 4,
                backgroundColor: settings.loaderColor,
                borderRadius: '50%',
                animation: `bounce 1s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {settings.loaderType === 'pulse' && (
        <div
          style={{
            width: s.loader,
            height: s.loader,
            backgroundColor: settings.loaderColor,
            borderRadius: '50%',
            animation: 'pulse 1s ease-in-out infinite'
          }}
        />
      )}

      {settings.loaderType === 'bars' && (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: s.loader }}>
          {[0.5, 0.75, 1, 0.75, 0.5].map((h, i) => (
            <div
              key={i}
              style={{
                width: s.loader / 6,
                height: `${h * s.loader}px`,
                backgroundColor: settings.loaderColor,
                borderRadius: '2px',
                animation: 'pulse 1s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {settings.loaderType === 'custom' && settings.loaderImage && (
        <img
          src={settings.loaderImage}
          alt="Loading"
          style={{ width: s.loader, height: s.loader, objectFit: 'contain' }}
        />
      )}

      {showText && settings.loaderText && (
        <span style={{ color: '#64748b', fontSize: s.text }}>{settings.loaderText}</span>
      )}
    </div>
  );
}

// Dynamic Logo Component
export function DynamicLogo({ 
  size = 'medium', 
  showText = true,
  isDark = false 
}: { 
  size?: 'small' | 'medium' | 'large'; 
  showText?: boolean;
  isDark?: boolean;
}) {
  const { settings } = useSettings();
  
  const sizeMap = {
    small: { icon: 32, text: 16 },
    medium: { icon: 40, text: 20 },
    large: { icon: 48, text: 24 }
  };

  const s = sizeMap[size];
  const logoUrl = isDark && settings.logoDark ? settings.logoDark : settings.logo;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: s.icon,
          height: s.icon,
          background: logoUrl ? 'transparent' : 'linear-gradient(135deg, #0968c6 0%, #0756a3 100%)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: s.icon * 0.45,
          overflow: 'hidden'
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={settings.siteName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          settings.logoIcon || 'T'
        )}
      </div>
      {showText && (
        <span style={{ fontWeight: 700, fontSize: s.text, color: 'inherit' }}>
          {settings.logoText?.replace(settings.logoAccentText, '') || 'TechToo'}
          <span style={{ color: 'var(--text-accent, #0968c6)' }}>
            {settings.logoAccentText || 'Talk'}
          </span>
        </span>
      )}
    </div>
  );
}

export default SettingsContext;
