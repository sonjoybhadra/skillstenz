'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

const compilers = [
  // Programming Languages
  { slug: 'python', name: 'Python', icon: '🐍', description: 'General-purpose programming language', category: 'Programming', color: '#3776AB' },
  { slug: 'javascript', name: 'JavaScript', icon: '🟨', description: 'Web scripting language', category: 'Programming', color: '#F7DF1E' },
  { slug: 'typescript', name: 'TypeScript', icon: '🔷', description: 'Typed JavaScript superset', category: 'Programming', color: '#3178C6' },
  { slug: 'java', name: 'Java', icon: '☕', description: 'Object-oriented programming', category: 'Programming', color: '#ED8B00' },
  { slug: 'cpp', name: 'C++', icon: '⚡', description: 'Systems programming language', category: 'Programming', color: '#00599C' },
  { slug: 'c', name: 'C', icon: '©️', description: 'Low-level programming', category: 'Programming', color: '#A8B9CC' },
  { slug: 'go', name: 'Go', icon: '🔵', description: 'Google\'s systems language', category: 'Programming', color: '#00ADD8' },
  { slug: 'rust', name: 'Rust', icon: '🦀', description: 'Memory-safe systems language', category: 'Programming', color: '#DEA584' },
  { slug: 'php', name: 'PHP', icon: '🐘', description: 'Server-side scripting', category: 'Programming', color: '#777BB4' },
  { slug: 'ruby', name: 'Ruby', icon: '💎', description: 'Dynamic programming language', category: 'Programming', color: '#CC342D' },
  { slug: 'swift', name: 'Swift', icon: '🍎', description: 'Apple\'s programming language', category: 'Mobile', color: '#FA7343' },
  { slug: 'kotlin', name: 'Kotlin', icon: '🟣', description: 'Modern JVM language', category: 'Mobile', color: '#7F52FF' },
  { slug: 'dart', name: 'Dart', icon: '🎯', description: 'Flutter\'s language', category: 'Mobile', color: '#0175C2' },
  
  // Web Technologies
  { slug: 'html', name: 'HTML/CSS', icon: '📄', description: 'Web markup & styling', category: 'Web', color: '#E34F26' },
  { slug: 'react', name: 'React.js', icon: '⚛️', description: 'UI component library', category: 'Web', color: '#61DAFB' },
  { slug: 'nextjs', name: 'Next.js', icon: '▲', description: 'React framework', category: 'Web', color: '#000000' },
  { slug: 'nodejs', name: 'Node.js', icon: '🟢', description: 'JavaScript runtime', category: 'Web', color: '#339933' },
  { slug: 'bunjs', name: 'Bun.js', icon: '🥟', description: 'Fast JavaScript runtime', category: 'Web', color: '#FBF0DF' },
  
  // Database
  { slug: 'sql', name: 'SQL', icon: '🗃️', description: 'Database query language', category: 'Database', color: '#4479A1' },
  { slug: 'mongodb', name: 'MongoDB', icon: '🍃', description: 'NoSQL database', category: 'Database', color: '#47A248' },
];

const categories = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'Programming', name: 'Programming', icon: '💻' },
  { id: 'Web', name: 'Web Development', icon: '🌐' },
  { id: 'Mobile', name: 'Mobile', icon: '📱' },
  { id: 'Database', name: 'Database', icon: '🗄️' },
];

export default function CompilersPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filteredCompilers = activeCategory === 'all' 
    ? compilers 
    : compilers.filter(c => c.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Online <span className="opacity-80">Code Compilers</span>
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Write, compile, and run code in 20+ programming languages directly in your browser
        </p>
      </section>

       <section className="bg-gray-50 min-h-screen py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* View Toggle and Categories */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    activeCategory === cat.id 
                      ? 'bg-indigo-600 text-white border-2 border-indigo-600' 
                      : 'bg-white text-gray-600 border-2 border-transparent hover:border-indigo-200'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                List
              </button>
            </div>
          </div>

          {/* Grid View - 4 columns */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredCompilers.map((compiler) => (
                <div
                  key={compiler.slug}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-gray-200 hover:-translate-y-1 hover:shadow-xl relative group"
                >
                  {/* Colored Top Border */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: compiler.color }}
                  />
                  
                  {/* Icon Section */}
                  <div 
                    className="h-24 flex items-center justify-center text-5xl relative"
                    style={{ 
                      background: `linear-gradient(135deg, ${compiler.color}20 0%, ${compiler.color}10 100%)` 
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                      {compiler.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-800 mb-1.5 text-center">
                      {compiler.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 text-center leading-relaxed">
                      {compiler.description}
                    </p>
                    <div className="flex justify-center pt-3 border-t border-gray-200">
                      <span 
                        className="text-xs font-semibold px-3 py-1 rounded-xl"
                        style={{ 
                          background: `${compiler.color}20`,
                          color: compiler.color 
                        }}
                      >
                        {compiler.category}
                      </span>
                    </div>
                     <Link key={compiler.slug}
                href={`/compiler/${compiler.slug}`}
                className="card"
                style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}
              >
                        Run Code
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View - 2 columns */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCompilers.map((compiler) => (
                <div
                  key={compiler.slug}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-gray-200 hover:translate-x-1 hover:shadow-xl relative flex items-center"
                >
                  {/* Colored Left Border */}
                  <div 
                    className="absolute top-0 left-0 bottom-0 w-1"
                    style={{ background: compiler.color }}
                  />
                  
                  {/* Icon Section */}
                  <div 
                    className="w-28 h-28 flex items-center justify-center text-5xl flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${compiler.color}20 0%, ${compiler.color}10 100%)` 
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                      {compiler.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {compiler.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {compiler.description}
                        </p>
                        <span 
                          className="text-xs font-semibold px-3.5 py-1.5 rounded-xl inline-block"
                          style={{ 
                            background: `${compiler.color}20`,
                            color: compiler.color 
                          }}
                        >
                          {compiler.category}
                        </span>
                      </div>
                      <Link key={compiler.slug}
                href={`/compiler/${compiler.slug}`}
                className="card"
                style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}
              >
                        Run Code
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2 className="section-title">
              Why Use Our <span className="section-title-accent">Online Compilers?</span>
            </h2>
          </div>
          <div className="grid grid-4" style={{ gap: '24px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Instant Execution</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Run code instantly without any setup</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💾</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Save & Share</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Save your code and share with others</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌐</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Browser-Based</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No installation required</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Syntax Highlighting</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Beautiful code editor with themes</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
