'use client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function RoadmapsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Roadmaps' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'devops', name: 'DevOps' },
  ];

  const roadmaps = [
    { slug: 'frontend', name: 'Frontend Developer', icon: '🎨', category: 'frontend', steps: 12, duration: '6 months', description: 'Master HTML, CSS, JavaScript, React, and modern frontend tools' },
    { slug: 'backend', name: 'Backend Developer', icon: '⚙️', category: 'backend', steps: 14, duration: '8 months', description: 'Learn Node.js, databases, APIs, and server architecture' },
    { slug: 'fullstack', name: 'Full Stack Developer', icon: '🚀', category: 'fullstack', steps: 20, duration: '12 months', description: 'Comprehensive path covering both frontend and backend technologies' },
    { slug: 'react', name: 'React Developer', icon: '⚛️', category: 'frontend', steps: 10, duration: '4 months', description: 'Deep dive into React ecosystem, Redux, and Next.js' },
    { slug: 'nodejs', name: 'Node.js Developer', icon: '🟢', category: 'backend', steps: 11, duration: '5 months', description: 'Master Node.js, Express, and backend JavaScript' },
    { slug: 'python', name: 'Python Developer', icon: '🐍', category: 'backend', steps: 13, duration: '6 months', description: 'Python programming, Django/Flask, and data processing' },
    { slug: 'android', name: 'Android Developer', icon: '🤖', category: 'mobile', steps: 12, duration: '6 months', description: 'Kotlin, Android SDK, and mobile app development' },
    { slug: 'ios', name: 'iOS Developer', icon: '🍎', category: 'mobile', steps: 11, duration: '6 months', description: 'Swift, UIKit, SwiftUI, and Apple ecosystem' },
    { slug: 'devops', name: 'DevOps Engineer', icon: '🔧', category: 'devops', steps: 15, duration: '8 months', description: 'CI/CD, Docker, Kubernetes, and cloud infrastructure' },
    { slug: 'javascript', name: 'JavaScript Developer', icon: '🟨', category: 'frontend', steps: 10, duration: '4 months', description: 'Complete JavaScript from basics to advanced concepts' },
    { slug: 'typescript', name: 'TypeScript Developer', icon: '🔷', category: 'frontend', steps: 8, duration: '3 months', description: 'Type-safe JavaScript development with TypeScript' },
    { slug: 'java', name: 'Java Developer', icon: '☕', category: 'backend', steps: 14, duration: '7 months', description: 'Java programming, Spring Boot, and enterprise development' },
  ];

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || roadmap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section hero-gradient" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            Learning <span style={{ color: 'rgba(255,255,255,0.8)' }}>Roadmaps</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Step-by-step guides to master your chosen technology stack
          </p>
          
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="navbar-search" style={{ background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <svg className="navbar-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="tabs" style={{ justifyContent: 'center', padding: '16px 0', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmaps Grid */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {filteredRoadmaps.length} Roadmaps Available
            </h2>
          </div>

          <div className="grid grid-3" style={{ gap: '24px' }}>
            {filteredRoadmaps.map((roadmap) => (
              <Link key={roadmap.slug} href={`/roadmaps/${roadmap.slug}`} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ 
                  height: '120px', 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '56px'
                }}>
                  {roadmap.icon}
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <span className="badge badge-primary">{roadmap.steps} Steps</span>
                    <span className="badge badge-secondary">{roadmap.duration}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {roadmap.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                    {roadmap.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ color: 'var(--text-accent)', fontSize: '14px', fontWeight: 600 }}>
                      Start Learning →
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
