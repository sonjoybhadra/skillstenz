'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import { useSettings } from '../../lib/settings';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuGroup {
  name: string;
  icon: string;
  items: { name: string; href: string; icon: string }[];
}

const menuGroups: MenuGroup[] = [
  {
    name: 'Overview',
    icon: '📊',
    items: [
      { name: 'Dashboard', href: '/admin', icon: '🏠' },
      { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
      { name: 'Homepage', href: '/admin/homepage', icon: '🏡' },
    ]
  },
  {
    name: 'Content',
    icon: '📚',
    items: [
      { name: 'Categories', href: '/admin/categories', icon: '📂' },
      { name: 'Technologies', href: '/admin/technologies', icon: '💻' },
      { name: 'Tutorials', href: '/admin/tutorials', icon: '📚' },
      { name: 'Courses', href: '/admin/courses', icon: '📖' },
      { name: 'Topics', href: '/admin/topics', icon: '📑' },
      { name: 'Lessons', href: '/admin/lessons', icon: '📄' },
      { name: 'Roadmaps', href: '/admin/roadmaps', icon: '🗺️' },
      { name: 'Cheatsheets', href: '/admin/cheatsheets', icon: '📝' },
      { name: 'MCQs', href: '/admin/mcqs', icon: '❓' },
    ]
  },
  {
    name: 'Users & Access',
    icon: '👥',
    items: [
      { name: 'Users', href: '/admin/users', icon: '👤' },
      { name: 'Plans', href: '/admin/plans', icon: '💎' },
      { name: 'Certificates', href: '/admin/certificates', icon: '🎓' },
    ]
  },
  {
    name: 'Jobs & Careers',
    icon: '💼',
    items: [
      { name: 'Careers', href: '/admin/careers', icon: '📋' },
    ]
  },
  {
    name: 'Settings',
    icon: '⚙️',
    items: [
      { name: 'SEO Settings', href: '/admin/seo', icon: '🔍' },
      { name: 'AdSense', href: '/admin/adsense', icon: '💰' },
      { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ]
  },
];

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Overview', 'Content']);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-expand group containing active item
  useEffect(() => {
    menuGroups.forEach(group => {
      const hasActiveItem = group.items.some(item => 
        pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
      );
      if (hasActiveItem && !expandedGroups.includes(group.name)) {
        setExpandedGroups(prev => [...prev, group.name]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <div className="admin-layout">
      <style jsx global>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--background, #f8fafc);
        }
        .admin-sidebar {
          width: ${sidebarOpen ? '280px' : '70px'};
          background: var(--card, #ffffff);
          border-right: 1px solid var(--border, #e2e8f0);
          transition: width 0.3s ease;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
          overflow: hidden;
        }
        .admin-sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: ${sidebarOpen ? 'space-between' : 'center'};
        }
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .admin-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0968c6 0%, #0756a3 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 18px;
        }
        .admin-logo-text {
          font-weight: 700;
          font-size: 18px;
          color: var(--foreground, #1e293b);
        }
        .admin-toggle-btn {
          background: var(--muted, #f1f5f9);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: var(--muted-foreground, #64748b);
          transition: all 0.2s;
        }
        .admin-toggle-btn:hover {
          background: var(--border, #e2e8f0);
        }
        .admin-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }
        .admin-menu-group {
          margin-bottom: 8px;
        }
        .admin-menu-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          color: var(--muted-foreground, #64748b);
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          user-select: none;
        }
        .admin-menu-group-header:hover {
          background: var(--muted, #f1f5f9);
          color: var(--foreground, #1e293b);
        }
        .admin-menu-group-icon {
          font-size: 16px;
        }
        .admin-menu-group-arrow {
          transition: transform 0.2s;
        }
        .admin-menu-group-arrow.expanded {
          transform: rotate(180deg);
        }
        .admin-menu-items {
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.2s ease;
        }
        .admin-menu-items.collapsed {
          max-height: 0;
          opacity: 0;
        }
        .admin-menu-items.expanded {
          max-height: 500px;
          opacity: 1;
        }
        .admin-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px 10px 28px;
          border-radius: 8px;
          margin: 2px 0;
          color: var(--muted-foreground, #64748b);
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .admin-menu-item:hover {
          background: var(--muted, #f1f5f9);
          color: var(--foreground, #1e293b);
        }
        .admin-menu-item.active {
          background: rgba(9, 104, 198, 0.1);
          color: #0968c6;
          font-weight: 600;
        }
        .admin-menu-item-icon {
          font-size: 16px;
        }
        .admin-user-section {
          padding: 16px;
          border-top: 1px solid var(--border, #e2e8f0);
        }
        .admin-profile-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-profile-btn:hover {
          background: var(--muted, #f1f5f9);
        }
        .admin-profile-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0968c6 0%, #0756a3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }
        .admin-profile-info {
          flex: 1;
          text-align: left;
          overflow: hidden;
        }
        .admin-profile-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--foreground, #1e293b);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .admin-profile-email {
          font-size: 12px;
          color: var(--muted-foreground, #64748b);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .admin-dropdown {
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          margin-bottom: 8px;
          background: var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          z-index: 1000;
          min-width: ${sidebarOpen ? 'auto' : '200px'};
        }
        .admin-dropdown-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border, #e2e8f0);
          background: var(--muted, #f1f5f9);
        }
        .admin-dropdown-badge {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .admin-dropdown-menu {
          padding: 8px;
        }
        .admin-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          color: var(--foreground, #1e293b);
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s;
          width: 100%;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .admin-dropdown-item:hover {
          background: var(--muted, #f1f5f9);
        }
        .admin-dropdown-item.danger {
          color: #ef4444;
        }
        .admin-dropdown-divider {
          height: 1px;
          background: var(--border, #e2e8f0);
          margin: 8px 0;
        }
        .admin-main {
          flex: 1;
          margin-left: ${sidebarOpen ? '280px' : '70px'};
          transition: margin-left 0.3s ease;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .admin-header {
          background: var(--card, #ffffff);
          border-bottom: 1px solid var(--border, #e2e8f0);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .admin-header-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--foreground, #1e293b);
        }
        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-view-site-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 8px;
          color: var(--foreground, #1e293b);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        .admin-view-site-btn:hover {
          background: var(--muted, #f1f5f9);
          border-color: var(--muted-foreground, #64748b);
        }
        .admin-role-badge {
          padding: 6px 12px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .admin-content {
          flex: 1;
          padding: 24px;
        }
        @media (max-width: 1024px) {
          .admin-sidebar {
            width: ${sidebarOpen ? '280px' : '0'};
            transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
          .admin-main {
            margin-left: 0;
          }
        }
      `}</style>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar-header">
          {sidebarOpen && (
            <Link href="/admin" className="admin-logo">
              <div className="admin-logo-icon">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                ) : (
                  settings.logoIcon || 'T'
                )}
              </div>
              <span className="admin-logo-text">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-toggle-btn"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation with Groups */}
        <nav className="admin-nav">
          {menuGroups.map((group) => (
            <div key={group.name} className="admin-menu-group">
              {sidebarOpen ? (
                <>
                  <div 
                    className="admin-menu-group-header"
                    onClick={() => toggleGroup(group.name)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="admin-menu-group-icon">{group.icon}</span>
                      <span>{group.name}</span>
                    </div>
                    <span className={`admin-menu-group-arrow ${expandedGroups.includes(group.name) ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>
                  <div className={`admin-menu-items ${expandedGroups.includes(group.name) ? 'expanded' : 'collapsed'}`}>
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`admin-menu-item ${isActive ? 'active' : ''}`}
                        >
                          <span className="admin-menu-item-icon">{item.icon}</span>
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`admin-menu-item ${isActive ? 'active' : ''}`}
                      style={{ padding: '12px', justifyContent: 'center' }}
                      title={item.name}
                    >
                      <span className="admin-menu-item-icon">{item.icon}</span>
                    </Link>
                  );
                })
              )}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="admin-user-section">
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="admin-profile-btn"
              style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
            >
              <div className="admin-profile-avatar">
                {user?.profileImage || user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profileImage || user.avatar}
                    alt={user.name || user.email}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  user?.email?.charAt(0).toUpperCase()
                )}
              </div>
              {sidebarOpen && (
                <>
                  <div className="admin-profile-info">
                    <p className="admin-profile-name">{user?.name || 'Admin'}</p>
                    <p className="admin-profile-email">{user?.email}</p>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      color: 'var(--muted-foreground)',
                      transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="admin-dropdown">
                <div className="admin-dropdown-header">
                  <span className="admin-dropdown-badge">👑 Admin</span>
                </div>
                <div className="admin-dropdown-menu">
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="admin-dropdown-item"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </Link>
                  <div className="admin-dropdown-divider" />
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                    }}
                    className="admin-dropdown-item danger"
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <h1 className="admin-header-title">
            {(() => {
              for (const group of menuGroups) {
                const found = group.items.find(item => 
                  pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                );
                if (found) return found.name;
              }
              return 'Admin Panel';
            })()}
          </h1>
          <div className="admin-header-actions">
            <Link href="/" target="_blank" className="admin-view-site-btn">
              View Site →
            </Link>
            <span className="admin-role-badge">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ProtectedRoute>
  );
}
