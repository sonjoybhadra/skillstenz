'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);
  const [isMobile, setIsMobile] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleToggle = () => {
      setSidebarOpen((prev) => !prev);
    };
    window.addEventListener('toggleSidebar', handleToggle);

    // Close profile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('toggleSidebar', handleToggle);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen]);

  const closeSidebar = () => {
    setSidebarOpen(false);
    onClose?.();
  };

  const mainNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'home' },
    { href: '/ai-assistant', label: 'AI Assistant', icon: 'ai' },
    { href: '/my-courses', label: 'My Courses', icon: 'book' },
    { href: '/progress', label: 'Progress', icon: 'chart' },
    { href: '/bookmarks', label: 'Bookmarks', icon: 'bookmark' },
    { href: '/certificates', label: 'Certificates', icon: 'certificate' },
  ];

  const toolsNavItems = [
    { href: '/resume-builder', label: 'Resume Builder', icon: 'file' },
    { href: '/code-editor', label: 'Code Editor', icon: 'code' },
    { href: '/whiteboard', label: 'Whiteboard', icon: 'pen' },
    { href: '/notes', label: 'Notes', icon: 'note' },
  ];

  const exploreNavItems = [
    { href: '/technologies', label: 'Technologies', icon: 'grid' },
    { href: '/courses', label: 'All Courses', icon: 'courses' },
    { href: '/roadmaps', label: 'Roadmaps', icon: 'map' },
    { href: '/cheatsheets', label: 'Cheatsheets', icon: 'sheet' },
  ];

  const getIcon = (icon: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      home: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      ),
      ai: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
          <path d="M8.5 8.5v.01" />
          <path d="M16 15.5v.01" />
          <path d="M12 12v.01" />
          <path d="M11 17v.01" />
          <path d="M7 14v.01" />
        </svg>
      ),
      book: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      chart: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
      bookmark: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      ),
      certificate: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
      file: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      ),
      code: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16,18 22,12 16,6" />
          <polyline points="8,6 2,12 8,18" />
        </svg>
      ),
      pen: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      ),
      note: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
          <path d="M15 3v4a2 2 0 0 0 2 2h4" />
        </svg>
      ),
      grid: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      courses: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      map: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      ),
      sheet: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    };
    return icons[icon] || icons.home;
  };

  return (
    <>
      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay visible" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* AI Assistant Promo */}
        <div className="sidebar-section">
          <Link
            href="/ai-assistant"
            onClick={isMobile ? closeSidebar : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'var(--bg-accent)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              {getIcon('ai')}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                AI Assistant
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Ask anything about coding
              </div>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Main</div>
          <nav className="sidebar-nav">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? closeSidebar : undefined}
                className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="sidebar-nav-item-icon">{getIcon(item.icon)}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Tools */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Tools</div>
          <nav className="sidebar-nav">
            {toolsNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? closeSidebar : undefined}
                className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="sidebar-nav-item-icon">{getIcon(item.icon)}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Explore */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Explore</div>
          <nav className="sidebar-nav">
            {exploreNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? closeSidebar : undefined}
                className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="sidebar-nav-item-icon">{getIcon(item.icon)}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Pro Badge */}
        <div className="sidebar-section" style={{ marginTop: 'auto' }}>
          {!isAuthenticated || user?.role === 'student' ? (
            <div
              style={{
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎓</div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Upgrade to Pro
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Get unlimited access to all features
              </div>
              <Link href="/membership" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Learn More
              </Link>
            </div>
          ) : null}
        </div>

        {/* User Profile Section */}
        <div className="sidebar-section" style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
          {isAuthenticated && user ? (
            <div ref={profileMenuRef} style={{ position: 'relative' }}>
              {/* Profile Button */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: profileMenuOpen ? 'var(--bg-secondary)' : 'transparent',
                  border: '1px solid transparent',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="profile-button"
              >
                {/* Profile Image */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'var(--bg-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {user.profileImage || user.avatar ? (
                    <img
                      src={user.profileImage || user.avatar}
                      alt={user.name || user.email}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name || 'User'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.email}
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    color: 'var(--text-muted)',
                    transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    right: 0,
                    marginBottom: '8px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    zIndex: 1000,
                  }}
                >
                  {/* Role Badge */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'instructor' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: user.role === 'admin' ? '#ef4444' : user.role === 'instructor' ? '#8b5cf6' : '#10b981',
                      }}
                    >
                      {user.role === 'admin' ? '👑 Admin' : user.role === 'instructor' ? '🎓 Instructor' : '📚 Student'}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '8px' }}>
                    {/* Profile - All Users */}
                    <Link
                      href="/profile"
                      onClick={() => { setProfileMenuOpen(false); isMobile && closeSidebar(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        transition: 'background 0.2s ease',
                      }}
                      className="dropdown-item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profile
                    </Link>

                    {/* Settings - Students and Instructors */}
                    {(user.role === 'student' || user.role === 'instructor') && (
                      <Link
                        href="/settings"
                        onClick={() => { setProfileMenuOpen(false); isMobile && closeSidebar(); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          transition: 'background 0.2s ease',
                        }}
                        className="dropdown-item"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                      </Link>
                    )}

                    {/* Your Earnings - Instructors Only */}
                    {user.role === 'instructor' && (
                      <Link
                        href="/earnings"
                        onClick={() => { setProfileMenuOpen(false); isMobile && closeSidebar(); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          transition: 'background 0.2s ease',
                        }}
                        className="dropdown-item"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Your Earnings
                      </Link>
                    )}

                    {/* Upgrade - Students and Instructors */}
                    {(user.role === 'student' || user.role === 'instructor') && (
                      <Link
                        href="/membership"
                        onClick={() => { setProfileMenuOpen(false); isMobile && closeSidebar(); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-accent)',
                          fontSize: '14px',
                          transition: 'background 0.2s ease',
                        }}
                        className="dropdown-item"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Upgrade
                      </Link>
                    )}

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'var(--border-primary)', margin: '8px 0' }} />

                    {/* Logout - All Users */}
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        color: '#ef4444',
                        fontSize: '14px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      className="dropdown-item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                href="/login"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
