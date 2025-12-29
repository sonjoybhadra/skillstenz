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
  
  // Database
  { slug: 'sql', name: 'SQL', icon: '🗃️', description: 'Database query language', category: 'Database', color: '#4479A1' },
  { slug: 'mongodb', name: 'MongoDB', icon: '🍃', description: 'NoSQL database', category: 'Database', color: '#47A248' },
];

const categories = [
  { id: 'all', name: 'All Languages', icon: '🔥', count: compilers.length },
  { id: 'Programming', name: 'Programming', icon: '💻', count: compilers.filter(c => c.category === 'Programming').length },
  { id: 'Web', name: 'Web Development', icon: '🌐', count: compilers.filter(c => c.category === 'Web').length },
  { id: 'Mobile', name: 'Mobile', icon: '📱', count: compilers.filter(c => c.category === 'Mobile').length },
  { id: 'Database', name: 'Database', icon: '🗄️', count: compilers.filter(c => c.category === 'Database').length },
];

const features = [
  { icon: '🚀', title: 'Instant Execution', description: 'Run code instantly with zero setup required' },
  { icon: '💾', title: 'Auto Save', description: 'Your code is automatically saved in browser' },
  { icon: '🌐', title: 'Browser Based', description: 'No installation or downloads needed' },
  { icon: '🎨', title: 'Syntax Highlighting', description: 'Beautiful code editor with smart highlighting' },
];

export default function CompilersPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompilers = compilers.filter(c => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm font-medium mb-6">
            <span>🔥</span> 20+ Programming Languages
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Online Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">Compilers</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-8">
            Write, compile, and run code in your browser. No setup required. Perfect for learning, testing, and quick prototyping.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search languages (Python, JavaScript, Java...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] transition-all text-base"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20' : 'bg-[var(--bg-hover)]'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Results Count */}
          {searchQuery && (
            <div className="text-center mb-6">
              <span className="text-sm text-[var(--text-muted)]">
                Found {filteredCompilers.length} language{filteredCompilers.length !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
              </span>
            </div>
          )}

          {/* Compiler Grid */}
          {filteredCompilers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No languages found</h3>
              <p className="text-[var(--text-muted)]">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredCompilers.map((compiler) => (
                <Link
                  key={compiler.slug}
                  href={`/compiler/${compiler.slug}`}
                  className="group relative bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent-primary)]/50"
                >
                  {/* Color Accent */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                    style={{ background: compiler.color }}
                  />
                  
                  {/* Icon Area */}
                  <div 
                    className="h-24 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${compiler.color}15 0%, ${compiler.color}05 100%)` }}
                  >
                    <div 
                      className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center shadow-lg text-3xl transition-transform duration-300 group-hover:scale-110"
                      style={{ boxShadow: `0 8px 24px ${compiler.color}30` }}
                    >
                      {compiler.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                      {compiler.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">
                      {compiler.description}
                    </p>
                    
                    {/* Category Badge */}
                    <span 
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${compiler.color}15`, color: compiler.color }}
                    >
                      {compiler.category}
                    </span>

                    {/* Hover CTA */}
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span 
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                        style={{ background: compiler.color }}
                      >
                        <span>▶</span> Run Code
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              Why Use Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">Online Compilers?</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">
              Built for developers, students, and learners who want to code without the hassle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] p-6 text-center hover:border-[var(--accent-primary)]/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#667eea] to-[#764ba2]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Coding?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Pick your favorite language and start writing code in seconds. No account required for basic usage.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/compiler/python" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#667eea] font-semibold rounded-xl hover:bg-gray-100 transition-colors">
              🐍 Try Python
            </Link>
            <Link href="/compiler/javascript" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
              🟨 Try JavaScript
            </Link>
            <Link href="/code-editor" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
              💻 Web Editor
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
