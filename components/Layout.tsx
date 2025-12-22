'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

// Pages that should show sidebar when logged in
const sidebarPages = ['/dashboard', '/ai-assistant', '/my-courses', '/progress', '/bookmarks', '/certificates', '/resume-builder', '/membership', '/notes', '/my-profile'];

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-transparent to-purple-500" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">T</div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TechToo<span className="text-blue-500">Talk</span></span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              A leading AI EdTech company focused on AI, Machine Learning, and cutting-edge technologies.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors text-sm font-semibold">𝕏</a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors text-sm">▶</a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors text-sm font-semibold">in</a>
            </div>
          </div>

          {/* Top Tutorials */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Top Tutorials</h4>
            <ul className="space-y-2.5">
              <li><Link href="/technologies/python" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">Python Tutorial</Link></li>
              <li><Link href="/technologies/javascript" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">JavaScript Tutorial</Link></li>
              <li><Link href="/technologies/react" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">React.js Tutorial</Link></li>
              <li><Link href="/technologies/ai" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">AI Tutorial</Link></li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Technologies</h4>
            <ul className="space-y-2.5">
              <li><Link href="/technologies/nextjs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">Next.js</Link></li>
              <li><Link href="/technologies/nodejs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">Node.js</Link></li>
              <li><Link href="/technologies/typescript" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">TypeScript</Link></li>
              <li><Link href="/technologies/ai-agents" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">AI Agents</Link></li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Certifications</h4>
            <ul className="space-y-2.5">
              <li><Link href="/certifications/python" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">Python Certificate</Link></li>
              <li><Link href="/certifications/javascript" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">JavaScript Certificate</Link></li>
              <li><Link href="/certifications/react" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">React Certificate</Link></li>
              <li><Link href="/certifications/ai" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">AI Certificate</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">Copyright © 2025 TechTooTalk. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-500 hover:text-blue-500 transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-500 hover:text-blue-500 transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-xs text-gray-500 dark:text-gray-500 hover:text-blue-500 transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children, showSidebar: showSidebarProp, showFooter = true }: LayoutProps) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check login status after mount
  useEffect(() => {
    const checkAuth = () => {
      const hasToken = !!localStorage.getItem('accessToken');
      setIsLoggedIn(hasToken);
      setIsMounted(true);
    };
    checkAuth();
  }, []);

  // Determine if sidebar should show based on path and auth
  const shouldShowSidebar = showSidebarProp !== false && isLoggedIn && sidebarPages.some(page => pathname?.startsWith(page));

  const handleToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    window.addEventListener('toggleSidebar', handleToggle);
    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
    };
  }, [handleToggle]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      {isMounted && shouldShowSidebar && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <main className={`flex-1 ${isMounted && shouldShowSidebar && sidebarOpen ? 'ml-64' : ''}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
