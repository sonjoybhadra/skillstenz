'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import { useSettings } from '../lib/settings';

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();

  const isLoggedIn = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  }, []);

  // Apply theme to document on mount
  useEffect(() => {
    // Always default to light theme unless explicitly set to dark
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = saved || 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/technologies', label: 'Technologies' },
    { href: '/courses', label: 'Courses' },
    { href: '/roadmaps', label: 'Roadmaps' },
    { href: '/tools', label: 'Tools' },
  ];

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isLoggedIn && (
              <button
                onClick={toggleSidebar}
                style={{
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
                aria-label="Toggle menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
            )}

            <Link href="/" className="navbar-logo">
              <div className="navbar-logo-icon">
                {settings.logo ? (
                  <img src={theme === 'dark' && settings.logoDark ? settings.logoDark : settings.logo} alt={settings.siteName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  settings.logoIcon || 'T'
                )}
              </div>
              <span>
                {settings.logoText?.replace(settings.logoAccentText, '') || 'TechToo'}
                <span style={{ color: 'var(--text-accent)' }}>{settings.logoAccentText || 'Talk'}</span>
              </span>
            </Link>
          </div>

          <nav className="navbar-nav desktop-only">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`navbar-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="navbar-search desktop-only">
            <svg
              className="navbar-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search tutorials, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="navbar-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>

            {isLoggedIn ? (
              <div style={{ position: 'relative' }}>
                <button 
                  className="avatar"
                  onClick={() => router.push('/dashboard')}
                >
                  U
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => { setAuthModalMode('login'); setAuthModalOpen(true); }}
                  className="btn btn-ghost btn-sm desktop-only"
                >
                  Login
                </button>
                <button 
                  onClick={() => { setAuthModalMode('register'); setAuthModalOpen(true); }}
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </button>
              </>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-only"
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
              aria-label="Toggle mobile menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-primary)',
              padding: '16px',
              zIndex: 999,
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navbar-nav-item ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div style={{ marginTop: '16px' }}>
              <input
                type="text"
                placeholder="Search..."
                className="input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </header>

      <style jsx global>{`
        .desktop-only {
          display: none !important;
        }
        .mobile-only {
          display: flex !important;
        }
        @media (min-width: 768px) {
          .desktop-only {
            display: flex !important;
          }
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authModalMode}
      />
    </>
  );
}
