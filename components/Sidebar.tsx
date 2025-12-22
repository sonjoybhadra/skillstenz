'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const { user, logout, isAuthenticated } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleToggle = () => setSidebarOpen((prev) => !prev);
    window.addEventListener('toggleSidebar', handleToggle);

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
      home: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>),
      ai: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /><path d="M8.5 8.5v.01" /><path d="M16 15.5v.01" /><path d="M12 12v.01" /><path d="M11 17v.01" /><path d="M7 14v.01" /></svg>),
      book: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>),
      chart: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>),
      bookmark: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>),
      certificate: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>),
      file: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14,2 14,8 20,8" /></svg>),
      code: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" /></svg>),
      pen: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>),
      note: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" /><path d="M15 3v4a2 2 0 0 0 2 2h4" /></svg>),
      grid: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>),
      courses: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>),
      map: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>),
      sheet: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>),
    };
    return icons[icon] || icons.home;
  };

  return (
    <>
      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-16 lg:top-26 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 z-50 flex flex-col overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex-1 p-4 space-y-6">
          {/* AI Assistant Promo */}
          <Link
            href="/ai-assistant"
            onClick={isMobile ? closeSidebar : undefined}
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              {getIcon('ai')}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">AI Assistant</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Ask anything about coding</div>
            </div>
          </Link>

          {/* Main Navigation */}
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">Main</div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-gray-400">{getIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Tools */}
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">Tools</div>
            <nav className="space-y-1">
              {toolsNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-gray-400">{getIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Explore */}
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">Explore</div>
            <nav className="space-y-1">
              {exploreNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-gray-400">{getIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Pro Badge */}
          {(!isAuthenticated || user?.role === 'student') && (
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl text-center">
              <div className="text-2xl mb-2">🎓</div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Upgrade to Pro</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Get unlimited access to all features</div>
              <Link href="/membership" className="block w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">
                Learn More
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          {isAuthenticated && user ? (
            <div ref={profileMenuRef} className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${profileMenuOpen ? 'bg-gray-100 dark:bg-slate-800' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user.profileImage || user.avatar ? (
                    <img src={user.profileImage || user.avatar} alt={user.name || user.email} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold">{(user.name || user.email).charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user.name || 'User'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                    <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                      user.role === 'admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 
                      user.role === 'instructor' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 
                      'bg-green-100 dark:bg-green-900/30 text-green-600'
                    }`}>
                      {user.role === 'admin' ? '👑 Admin' : user.role === 'instructor' ? '🎓 Instructor' : '📚 Student'}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link href="/profile" onClick={() => { setProfileMenuOpen(false); isMobile && closeSidebar(); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      Profile
                    </Link>

                    {(user.role === 'student' || user.role === 'instructor') && (
                      <>
                        <Link href="/settings" onClick={() => { setProfileMenuOpen(false); isMobile && closeSidebar(); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-.33-2.82H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 2.82-.33V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51c.64.26 1.37.1 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0 .33 2.82h.09a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z" /></svg>
                          Settings
                        </Link>
                        <Link href="/membership" onClick={() => { setProfileMenuOpen(false); isMobile && closeSidebar(); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          Upgrade
                        </Link>
                      </>
                    )}

                    {user.role === 'instructor' && (
                      <Link href="/earnings" onClick={() => { setProfileMenuOpen(false); isMobile && closeSidebar(); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        Your Earnings
                      </Link>
                    )}

                    <div className="h-px bg-gray-200 dark:bg-slate-700 my-2" />

                    <button onClick={() => { setProfileMenuOpen(false); logout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="flex-1 py-2.5 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                Login
              </Link>
              <Link href="/register" className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
