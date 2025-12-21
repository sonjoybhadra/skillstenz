'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

// Pages that should show sidebar when logged in
const sidebarPages = ['/dashboard', '/ai-assistant', '/my-courses', '/progress', '/bookmarks', '/certificates', '/resume-builder', '/membership', '/notes', '/my-profile'];

export default function Layout({ children, showSidebar: showSidebarProp }: LayoutProps) {
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
    <div className="layout-wrapper">
      <Header />
      {isMounted && shouldShowSidebar && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <main className={`main-content ${isMounted && shouldShowSidebar && sidebarOpen ? 'with-sidebar' : ''}`}>
        {children}
      </main>
    </div>
  );
}
