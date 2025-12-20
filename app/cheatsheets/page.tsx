'use client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function CheatsheetsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const cheatsheets = [
    { slug: 'python', name: 'Python Cheatsheet', icon: '🐍', description: 'Quick reference for Python syntax, data types, and common patterns', downloads: 12500 },
    { slug: 'javascript', name: 'JavaScript Cheatsheet', icon: '🟨', description: 'Essential JavaScript concepts, ES6+ features, and DOM manipulation', downloads: 11200 },
    { slug: 'html', name: 'HTML Cheatsheet', icon: '📄', description: 'Complete HTML5 tags reference with semantic elements', downloads: 9800 },
    { slug: 'css', name: 'CSS Cheatsheet', icon: '🎨', description: 'CSS properties, flexbox, grid, and responsive design patterns', downloads: 8900 },
    { slug: 'react', name: 'React Cheatsheet', icon: '⚛️', description: 'React hooks, components, state management, and best practices', downloads: 7600 },
    { slug: 'git', name: 'Git Cheatsheet', icon: '📦', description: 'Git commands, branching, merging, and workflow patterns', downloads: 10300 },
    { slug: 'sql', name: 'SQL Cheatsheet', icon: '🗃️', description: 'SQL queries, joins, aggregations, and database design', downloads: 8400 },
    { slug: 'java', name: 'Java Cheatsheet', icon: '☕', description: 'Java syntax, OOP concepts, collections, and streams', downloads: 7200 },
    { slug: 'cpp', name: 'C++ Cheatsheet', icon: '⚡', description: 'C++ syntax, STL, pointers, and memory management', downloads: 6800 },
    { slug: 'typescript', name: 'TypeScript Cheatsheet', icon: '🔷', description: 'TypeScript types, interfaces, generics, and decorators', downloads: 5900 },
    { slug: 'ml', name: 'Machine Learning Cheatsheet', icon: '🧠', description: 'ML algorithms, sklearn, neural networks, and evaluation metrics', downloads: 5400 },
    { slug: 'docker', name: 'Docker Cheatsheet', icon: '🐳', description: 'Docker commands, Dockerfile, compose, and networking', downloads: 4800 },
  ];

  const filteredSheets = cheatsheets.filter(sheet =>
    sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section hero-gradient" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            Cheatsheets <span style={{ color: 'rgba(255,255,255,0.8)' }}>Library</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Quick reference guides for all your programming needs. Download and keep them handy!
          </p>
          
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="navbar-search" style={{ background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <svg className="navbar-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search cheatsheets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cheatsheets Grid */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {filteredSheets.length} Cheatsheets Available
            </h2>
          </div>

          <div className="grid grid-4" style={{ gap: '24px' }}>
            {filteredSheets.map((sheet) => (
              <Link key={sheet.slug} href={`/cheatsheets/${sheet.slug}`} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ 
                  height: '100px', 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  {sheet.icon}
                </div>
                <div className="card-body">
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {sheet.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                    {sheet.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      📥 {sheet.downloads.toLocaleString()} downloads
                    </span>
                    <span style={{ color: 'var(--text-accent)', fontSize: '14px', fontWeight: 600 }}>
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
