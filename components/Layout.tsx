'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isLoggedIn = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  }, []);

  useEffect(() => {
    const handleToggle = () => {
      setSidebarOpen((prev) => !prev);
    };
    window.addEventListener('toggleSidebar', handleToggle);

    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
    };
  }, []);

  // Pages that should show sidebar when logged in
  const sidebarPages = ['/dashboard', '/ai-assistant', '/my-courses', '/progress', '/bookmarks'];
  const shouldShowSidebar = isLoggedIn && sidebarPages.some(page => pathname?.startsWith(page));

  return (
    <>
      <Header />
      {shouldShowSidebar && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <main className={`main-content ${shouldShowSidebar && sidebarOpen ? 'with-sidebar' : ''}`}>
        {children}
      </main>
    </>
  );
}
