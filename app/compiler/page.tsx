'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';

const compilers = [
  // Programming Languages
  { slug: 'python', name: 'Python', icon: '🐍', description: 'General-purpose programming language', category: 'Programming' },
  { slug: 'javascript', name: 'JavaScript', icon: '🟨', description: 'Web scripting language', category: 'Programming' },
  { slug: 'typescript', name: 'TypeScript', icon: '🔷', description: 'Typed JavaScript superset', category: 'Programming' },
  { slug: 'java', name: 'Java', icon: '☕', description: 'Object-oriented programming', category: 'Programming' },
  { slug: 'cpp', name: 'C++', icon: '⚡', description: 'Systems programming language', category: 'Programming' },
  { slug: 'c', name: 'C', icon: '©️', description: 'Low-level programming', category: 'Programming' },
  { slug: 'go', name: 'Go', icon: '🔵', description: 'Google\'s systems language', category: 'Programming' },
  { slug: 'rust', name: 'Rust', icon: '🦀', description: 'Memory-safe systems language', category: 'Programming' },
  { slug: 'php', name: 'PHP', icon: '🐘', description: 'Server-side scripting', category: 'Programming' },
  { slug: 'ruby', name: 'Ruby', icon: '💎', description: 'Dynamic programming language', category: 'Programming' },
  { slug: 'swift', name: 'Swift', icon: '🍎', description: 'Apple\'s programming language', category: 'Mobile' },
  { slug: 'kotlin', name: 'Kotlin', icon: '🟣', description: 'Modern JVM language', category: 'Mobile' },
  { slug: 'dart', name: 'Dart', icon: '🎯', description: 'Flutter\'s language', category: 'Mobile' },
  
  // Web Technologies
  { slug: 'html', name: 'HTML/CSS', icon: '📄', description: 'Web markup & styling', category: 'Web' },
  { slug: 'react', name: 'React.js', icon: '⚛️', description: 'UI component library', category: 'Web' },
  { slug: 'nextjs', name: 'Next.js', icon: '▲', description: 'React framework', category: 'Web' },
  { slug: 'nodejs', name: 'Node.js', icon: '🟢', description: 'JavaScript runtime', category: 'Web' },
  { slug: 'bunjs', name: 'Bun.js', icon: '🥟', description: 'Fast JavaScript runtime', category: 'Web' },
  
  // Database
  { slug: 'sql', name: 'SQL', icon: '🗃️', description: 'Database query language', category: 'Database' },
  { slug: 'mongodb', name: 'MongoDB', icon: '🍃', description: 'NoSQL database', category: 'Database' },
];

const categories = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'Programming', name: 'Programming', icon: '💻' },
  { id: 'Web', name: 'Web Development', icon: '🌐' },
  { id: 'Mobile', name: 'Mobile', icon: '📱' },
  { id: 'Database', name: 'Database', icon: '🗄️' },
];

export default function CompilersPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero hero-gradient" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            Online <span style={{ color: 'rgba(255,255,255,0.8)' }}>Code Compilers</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto' }}>
            Write, compile, and run code in 20+ programming languages directly in your browser
          </p>
        </div>
      </section>

      {/* Compilers Grid */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          {/* Categories */}
          <div className="tabs" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            {categories.map((cat) => (
              <button key={cat.id} className="tab">
                <span style={{ marginRight: '8px' }}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-4" style={{ gap: '24px' }}>
            {compilers.map((compiler) => (
              <Link
                key={compiler.slug}
                href={`/compiler/${compiler.slug}`}
                className="card"
                style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}
              >
                <div style={{
                  height: '100px',
                  background: 'linear-gradient(135deg, var(--bg-accent) 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  {compiler.icon}
                </div>
                <div className="card-body">
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {compiler.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {compiler.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="badge badge-primary">{compiler.category}</span>
                    <span style={{ color: 'var(--text-accent)', fontSize: '14px', fontWeight: 600 }}>
                      Try it →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
