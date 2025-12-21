'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import SearchModal from './SearchModal';
import { useSettings } from '../lib/settings';

// Primary navigation (after logo)
const primaryNav = [
  { name: 'Technologies', href: '/technologies', icon: '🔧' },
  { name: 'Tutorials', href: '/tutorials', icon: '📖', badge: 'FREE' },
];

// Secondary navigation (after search)
const secondaryNav = [
  { name: 'Courses', href: '/courses', icon: '🎓' },
  { name: 'Tools', href: '/tools', icon: '🛠️' },
];

// Bottom menu bar items with icons
const bottomMenuItems = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Roadmaps', href: '/roadmaps', icon: '🗺️' },
  { name: 'Cheatsheets', href: '/cheatsheets', icon: '📋' },
  { name: 'Careers', href: '/careers', icon: '💼' },
  { name: 'Compiler', href: '/compiler', icon: '⚡' },
  { name: 'Code Editor', href: '/code-editor', icon: '💻' },
  { name: 'Certificates', href: '/certificates', icon: '🏆' },
  { name: 'Articles', href: '/tutorials', icon: '📰' },
];

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();

  // Check login status on mount and listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  // Apply theme to document on mount
  useEffect(() => {
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

  return (
    <>
      <header className="navbar navbar-full-width">
        <div className="navbar-inner">
          {/* Left Section: Toggle + Logo + Primary Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isLoggedIn && (
              <button
                onClick={toggleSidebar}
                className="sidebar-toggle-btn"
                aria-label="Toggle menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <span className="desktop-only">
                {settings.logoText?.replace(settings.logoAccentText, '') || 'TechToo'}
                <span style={{ color: 'var(--text-accent)' }}>{settings.logoAccentText || 'Talk'}</span>
              </span>
            </Link>

            {/* Primary Nav Links (After Logo) */}
            <nav className="primary-nav desktop-only">
              {primaryNav.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`primary-nav-link ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Search */}
          <div className="navbar-search desktop-only" onClick={() => setSearchModalOpen(true)} style={{ cursor: 'pointer', flex: '0 1 400px' }}>
            <svg className="navbar-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search courses, tutorials..." value={searchQuery} readOnly style={{ cursor: 'pointer' }} />
          </div>

          {/* Right Section: Secondary Nav + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Secondary Nav Links (After Search) */}
            <nav className="secondary-nav desktop-only">
              {secondaryNav.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`secondary-nav-link ${pathname === item.href ? 'active' : ''}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="navbar-actions">
              <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
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
                <button className="avatar" onClick={() => router.push('/dashboard')}>U</button>
              ) : (
                <>
                  <button onClick={() => { setAuthModalMode('login'); setAuthModalOpen(true); }} className="btn btn-ghost btn-sm desktop-only">Login</button>
                  <button onClick={() => { setAuthModalMode('register'); setAuthModalOpen(true); }} className="btn btn-primary btn-sm">Sign Up</button>
                </>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mobile-only mobile-menu-btn"
                aria-label="Toggle mobile menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Primary Nav */}
              {primaryNav.map((item) => (
                <Link key={item.href} href={item.href} className={`navbar-nav-item ${pathname === item.href ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  {item.icon} {item.name}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border-primary)', margin: '8px 0', paddingTop: '8px' }}>
                {/* Secondary Nav */}
                {secondaryNav.map((item) => (
                  <Link key={item.href} href={item.href} className="navbar-nav-item" onClick={() => setIsMenuOpen(false)}>
                    {item.icon} {item.name}
                  </Link>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border-primary)', margin: '8px 0', paddingTop: '8px' }}>
                {/* Bottom Menu Items */}
                {bottomMenuItems.map((item) => (
                  <Link key={item.href} href={item.href} className="navbar-nav-item" onClick={() => setIsMenuOpen(false)}>
                    {item.icon} {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div style={{ marginTop: '16px' }}>
              <div className="navbar-search" onClick={() => { setSearchModalOpen(true); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>
                <svg className="navbar-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Search..." readOnly style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Secondary Menu Bar */}
      <div className="secondary-menu-bar desktop-only">
        <div className="secondary-menu-inner">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`secondary-menu-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .navbar-full-width {
          width: 100%;
          max-width: 100%;
        }
        
        .navbar-inner {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          gap: 16px;
        }
        
        .sidebar-toggle-btn {
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: all 0.2s;
        }
        
        .sidebar-toggle-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        
        /* Primary Nav (After Logo) */
        .primary-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 24px;
          padding-left: 24px;
          border-left: 1px solid var(--border-primary);
        }
        
        .primary-nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: all 0.2s;
        }
        
        .primary-nav-link:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        
        .primary-nav-link.active {
          background: var(--bg-accent);
          color: white;
        }
        
        /* Secondary Nav (After Search) */
        .secondary-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .secondary-nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: all 0.2s;
        }
        
        .secondary-nav-link:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        
        .secondary-nav-link.active {
          color: var(--text-accent);
        }
        
        /* Secondary Menu Bar */
        .secondary-menu-bar {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-primary);
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          right: 0;
          height: var(--secondary-menu-height);
          z-index: 99;
        }
        
        .secondary-menu-inner {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 4px;
          height: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .secondary-menu-inner::-webkit-scrollbar {
          display: none;
        }
        
        .secondary-menu-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: all 0.2s;
          border-radius: var(--radius-md);
        }
        
        .secondary-menu-item:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }
        
        .secondary-menu-item.active {
          color: var(--text-accent);
          background: rgba(var(--accent-rgb, 34, 197, 94), 0.1);
        }
        
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-primary);
          padding: 16px;
          z-index: 999;
          box-shadow: var(--shadow-lg);
          max-height: 70vh;
          overflow-y: auto;
        }
        
        .mobile-menu-btn {
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
        }
        
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
        
        @media (max-width: 1024px) {
          .primary-nav {
            display: none !important;
          }
          .secondary-nav {
            display: none !important;
          }
          .secondary-menu-bar {
            display: none !important;
          }
        }
      `}</style>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authModalMode} />
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
