'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get full image URL
const getImageUrl = (imagePath: string | undefined): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL.replace('/api', '')}${imagePath}`;
};

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
    { href: '/my-courses', label: 'My Courses', icon: 'book' },
    { href: '/progress', label: 'Progress', icon: 'chart' },
  ];

  const learningNavItems = [
    { href: '/ai-assistant', label: 'AI Assistant', icon: 'ai', badge: 'New' },
    { href: '/bookmarks', label: 'Bookmarks', icon: 'bookmark' },
    { href: '/certificates', label: 'Certificates', icon: 'certificate' },
    { href: '/notes', label: 'Notes', icon: 'note' },
  ];

  const toolsNavItems = [
    { href: '/resume-builder', label: 'Resume Builder', icon: 'file' },
    { href: '/code-editor', label: 'Code Editor', icon: 'code' },
    { href: '/whiteboard', label: 'Whiteboard', icon: 'pen' },
    { href: '/compiler', label: 'Compiler', icon: 'terminal' },
  ];

  const exploreNavItems = [
    { href: '/technologies', label: 'Technologies', icon: 'grid' },
    { href: '/ai-tools', label: 'AI Tools', icon: 'robot' },
    { href: '/courses', label: 'All Courses', icon: 'courses' },
    { href: '/roadmaps', label: 'Roadmaps', icon: 'map' },
    { href: '/tutorials', label: 'Tutorials', icon: 'play' },
    { href: '/cheatsheets', label: 'Cheatsheets', icon: 'sheet' },
    { href: '/blog', label: 'Insights', icon: 'article' },
  ];

  const careerNavItems = [
    { href: '/careers', label: 'Jobs', icon: 'briefcase' },
    { href: '/profile', label: 'Career Hub', icon: 'target' },
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
      article: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg>),
      terminal: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>),
      play: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>),
      briefcase: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>),
      target: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>),
      robot: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>),
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
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* AI Assistant Promo */}
          <Link
            href="/ai-assistant"
            onClick={isMobile ? closeSidebar : undefined}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              {getIcon('ai')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">AI Assistant</span>
                <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">NEW</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Ask anything about coding</div>
            </div>
          </Link>

          {/* Main Navigation */}
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">Dashboard</div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={pathname === item.href ? 'text-emerald-500' : 'text-gray-400'}>{getIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Learning */}
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">Learning</div>
            <nav className="space-y-1">
              {learningNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={pathname === item.href ? 'text-emerald-500' : 'text-gray-400'}>{getIcon(item.icon)}</span>
                  <span className="flex-1">{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">{item.badge}</span>
                  )}
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
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={pathname === item.href ? 'text-emerald-500' : 'text-gray-400'}>{getIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Explore - Two Column Grid */}
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">Explore</div>
            <nav className="grid grid-cols-2 gap-1.5 px-1">
              {exploreNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`${pathname === item.href ? 'text-emerald-500' : 'text-gray-400'}`}>{getIcon(item.icon)}</span>
                  <span className="text-center">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Career */}
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">Career</div>
            <nav className="space-y-1">
              {careerNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={pathname === item.href ? 'text-emerald-500' : 'text-gray-400'}>{getIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Pro Badge */}
          {(!isAuthenticated || user?.role === 'student') && (
            <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Upgrade to Pro</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Get unlimited access to all features</div>
              <Link href="/membership" className="block w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md">
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
                  {getImageUrl(user.profileImage) || getImageUrl(user.avatar) ? (
                    <img src={getImageUrl(user.profileImage) || getImageUrl(user.avatar) || ''} alt={user.name || user.email} className="w-full h-full object-cover" />
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
