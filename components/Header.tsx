'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import SearchModal from './SearchModal';
import TechnologyBar from './TechnologyBar';
import { useSettings } from '../lib/settings';

// Quick technology links shown in header (pointing to free tutorials)
const quickTechLinks = [
  { name: 'HTML', href: '/tutorials/html', icon: '📄' },
  { name: 'CSS', href: '/tutorials/css', icon: '🎨' },
  { name: 'JavaScript', href: '/tutorials/javascript', icon: '🟨' },
  { name: 'Python', href: '/tutorials/python', icon: '🐍' },
  { name: 'React', href: '/tutorials/react', icon: '⚛️' },
];

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();

  const isLoggedIn = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
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

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/tutorials', label: 'Tutorials', badge: 'FREE' },
    { href: '/courses', label: 'Courses' },
    { href: '/roadmaps', label: 'Roadmaps' },
    { href: '/tools', label: 'Tools' },
  ];

  return (
    <>
      <header className="navbar navbar-full-width">
        <div className="navbar-inner">
          {/* Left Section: Toggle + Logo + Quick Links */}
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

            {/* Quick Tech Links (Desktop) */}
            <div className="quick-tech-links desktop-only">
              {quickTechLinks.map((item) => (
                <Link key={item.href} href={item.href} className="quick-tech-link">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Navigation */}
          <nav className="navbar-nav desktop-only">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`navbar-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section: Search + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="navbar-search desktop-only" onClick={() => setSearchModalOpen(true)} style={{ cursor: 'pointer' }}>
              <svg className="navbar-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search..." value={searchQuery} readOnly style={{ cursor: 'pointer' }} />
            </div>

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
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={`navbar-nav-item ${pathname === item.href ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border-primary)', margin: '8px 0', paddingTop: '8px' }}>
                {quickTechLinks.map((item) => (
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

      {/* Technology Bar - Below Header */}
      <TechnologyBar />

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
        
        .quick-tech-links {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 16px;
          padding-left: 16px;
          border-left: 1px solid var(--border-primary);
        }
        
        .quick-tech-link {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: all 0.2s;
        }
        
        .quick-tech-link:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
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
        
        @media (min-width: 1200px) {
          .quick-tech-links {
            display: flex;
          }
        }
        
        @media (max-width: 1199px) {
          .quick-tech-links {
            display: none !important;
          }
        }
      `}</style>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authModalMode} />
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
