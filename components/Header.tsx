'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import SearchModal from './SearchModal';
import { useSettings } from '../lib/settings';
import { useAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get full image URL
const getImageUrl = (imagePath: string | undefined): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL.replace('/api', '')}${imagePath}`;
};

// Navigation items
const primaryNav = [
  { name: 'Technologies', href: '/technologies', icon: '🔧' },
  { name: 'Tutorials', href: '/tutorials', icon: '📖', badge: 'FREE' },
  { name: 'Insights', href: '/blog', icon: '💡' },
];

const secondaryNav = [
  { name: 'Courses', href: '/courses', icon: '🎓' },
  { name: 'Tools', href: '/tools', icon: '🛠️' },
];

const bottomMenuItems = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Roadmaps', href: '/roadmaps', icon: '🗺️' },
  { name: 'Cheatsheets', href: '/cheatsheets', icon: '📋' },
  { name: 'Careers', href: '/careers', icon: '💼' },
  { name: 'Compiler', href: '/compiler', icon: '⚡' },
  { name: 'Code Editor', href: '/code-editor', icon: '💻' },
  { name: 'Certificates', href: '/certificates', icon: '🏆' },
  { name: 'AI Tools', href: '/ai-tools', icon: '🤖' },
];

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = saved || 'light';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  return (
    <>
      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 z-50">
        <div className="h-full max-w-full mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Left: Toggle + Logo + Primary Nav */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
            )}

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {settings.logo ? (
                  <img src={theme === 'dark' && settings.logoDark ? settings.logoDark : settings.logo} alt={settings.siteName} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  settings.logoIcon || 'T'
                )}
              </div>
              <span className="hidden md:inline text-lg font-bold text-gray-900 dark:text-white">
                {settings.logoText?.replace(settings.logoAccentText, '') || 'TechToo'}
                <span className="text-blue-500">{settings.logoAccentText || 'Talk'}</span>
              </span>
            </Link>

            {/* Primary Nav - Desktop */}
            <nav className="hidden lg:flex items-center gap-1 ml-6 pl-6 border-l border-gray-200 dark:border-slate-700">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    pathname === item.href || pathname?.startsWith(item.href + '/')
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Search - Desktop */}
          <div
            onClick={() => setSearchModalOpen(true)}
            className="hidden md:flex items-center gap-2 flex-1 max-w-md px-4 py-2.5 bg-gray-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">Search courses, tutorials...</span>
          </div>

          {/* Right: Secondary Nav + Actions */}
          <div className="flex items-center gap-4">
            {/* Secondary Nav - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'text-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
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

              {/* Auth Buttons */}
              {isAuthenticated && user ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-9 h-9 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center hover:bg-blue-600 transition-colors overflow-hidden"
                >
                  {getImageUrl(user.profileImage) || getImageUrl(user.avatar) ? (
                    <img src={getImageUrl(user.profileImage) || getImageUrl(user.avatar) || ''} alt={user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    (user.name || user.email || 'U').charAt(0).toUpperCase()
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setAuthModalMode('login'); setAuthModalOpen(true); }}
                    className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setAuthModalMode('register'); setAuthModalOpen(true); }}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 shadow-lg max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                    pathname === item.href ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 dark:border-slate-700 my-2 pt-2">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-slate-700 my-2 pt-2">
                {bottomMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </nav>
            
            <div
              onClick={() => { setSearchModalOpen(true); setIsMenuOpen(false); }}
              className="mt-4 flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-400">Search...</span>
            </div>
          </div>
        )}
      </header>

      {/* Secondary Menu Bar - Desktop */}
      <div className="hidden lg:block fixed top-16 left-0 right-0 h-10 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 z-40">
        <div className="h-full max-w-full mx-auto px-6 flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                pathname === item.href
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer for fixed headers */}
      <div className="h-16 lg:h-26" />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authModalMode} />
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
