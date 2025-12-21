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
    <footer style={{ 
      background: 'var(--bg-secondary)', 
      borderTop: '1px solid var(--border-primary)',
      padding: '48px 0 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Tech Abstract Background - Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 15% 20%, var(--bg-accent) 0%, transparent 40%),
          radial-gradient(circle at 85% 80%, var(--text-accent) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, var(--bg-accent) 0%, transparent 50%)
        `
      }} />
      {/* Grid Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(var(--text-primary) 1px, transparent 1px),
          linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
      {/* Circuit Lines SVG */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
        <defs>
          <pattern id="footerCircuit" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M0 60 L40 60 L40 30 L80 30 L80 60 L120 60" stroke="currentColor" fill="none" strokeWidth="1"/>
            <path d="M60 0 L60 40 L90 40 L90 90 L60 90 L60 120" stroke="currentColor" fill="none" strokeWidth="1"/>
            <circle cx="40" cy="60" r="4" fill="var(--bg-accent)" opacity="0.6"/>
            <circle cx="80" cy="30" r="4" fill="var(--bg-accent)" opacity="0.6"/>
            <circle cx="60" cy="90" r="4" fill="var(--text-accent)" opacity="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footerCircuit)" style={{ color: 'var(--text-primary)' }}/>
      </svg>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--bg-accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>T</div>
              <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>TechToo<span style={{ color: 'var(--text-accent)' }}>Talk</span></span>
            </Link>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              SkillStenz is a leading AI EdTech company focused on AI, AI Agents, Machine Learning, and cutting-edge AI technologies for the future.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>𝕏</a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>▶</a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>in</a>
            </div>
          </div>

          {/* Top Tutorials */}
          <div>
            <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px', fontSize: '14px' }}>Top Tutorials</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/technologies/python" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Python Tutorial</Link></li>
              <li><Link href="/technologies/javascript" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>JavaScript Tutorial</Link></li>
              <li><Link href="/technologies/react" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>React.js Tutorial</Link></li>
              <li><Link href="/technologies/ai" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>AI Tutorial</Link></li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px', fontSize: '14px' }}>Technologies</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/technologies/nextjs" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Next.js</Link></li>
              <li><Link href="/technologies/nodejs" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Node.js</Link></li>
              <li><Link href="/technologies/typescript" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>TypeScript</Link></li>
              <li><Link href="/technologies/ai-agents" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>AI Agents</Link></li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px', fontSize: '14px' }}>Certifications</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/certifications/python" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Python Certificate</Link></li>
              <li><Link href="/certifications/javascript" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>JavaScript Certificate</Link></li>
              <li><Link href="/certifications/react" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>React Certificate</Link></li>
              <li><Link href="/certifications/ai" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>AI Certificate</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px', fontSize: '14px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>About Us</Link></li>
              <li><Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Contact</Link></li>
              <li><Link href="/careers" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Careers</Link></li>
              <li><Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Copyright © 2025 SkillStenz. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>Terms of Use</Link>
            <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>Privacy Policy</Link>
            <Link href="/cookies" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>Cookies Policy</Link>
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
    <div className="layout-wrapper">
      <Header />
      {isMounted && shouldShowSidebar && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <main className={`main-content ${isMounted && shouldShowSidebar && sidebarOpen ? 'with-sidebar' : ''}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
