'use client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { technologiesAPI, Technology } from '../../lib/api';

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const { data, error } = await technologiesAPI.getAll();
        if (data && !error) {
          setTechnologies(data);
        }
      } catch (err) {
        console.error('Failed to fetch technologies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnologies();
  }, []);

  // Get icon for technology based on slug
  const getTechIcon = (slug: string): string => {
    const icons: Record<string, string> = {
      'ai': '🤖',
      'ai-agents': '🦾',
      'machine-learning': '🧠',
      'langchain': '🔗',
      'prompt-engineering': '💬',
      'rag-systems': '📚',
      'nlp': '💭',
      'computer-vision': '👁️',
      'python-for-ai': '🐍',
      'genai-applications': '✨',
      'default': '📘'
    };
    return icons[slug] || icons['default'];
  };

  const categories = [
    { id: 'all', name: 'All Technologies', icon: '🔥' },
    { id: 'ai', name: 'AI & Agents', icon: '🤖' },
    { id: 'ml', name: 'Machine Learning', icon: '🧠' },
    { id: 'llm', name: 'LLM & GenAI', icon: '💬' },
    { id: 'nlp', name: 'NLP & Vision', icon: '👁️' },
  ];

  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'ai') return matchesSearch && ['ai', 'ai-agents'].includes(tech.slug || '');
    if (selectedCategory === 'ml') return matchesSearch && ['machine-learning', 'python-for-ai'].includes(tech.slug || '');
    if (selectedCategory === 'llm') return matchesSearch && ['langchain', 'prompt-engineering', 'rag-systems', 'genai-applications'].includes(tech.slug || '');
    if (selectedCategory === 'nlp') return matchesSearch && ['nlp', 'computer-vision'].includes(tech.slug || '');
    return matchesSearch;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section hero-gradient" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            Explore <span style={{ color: 'rgba(255,255,255,0.8)' }}>AI Technologies</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Master AI, AI Agents, LangChain, RAG Systems, and cutting-edge AI technologies
          </p>
          
          {/* Search Bar */}
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="navbar-search" style={{ background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <svg
                className="navbar-search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: 'var(--text-muted)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search technologies..."
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
          <div className="tabs" style={{ justifyContent: 'center', padding: '16px 0' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span style={{ marginRight: '8px' }}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Grid */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          {/* Stats Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {filteredTechnologies.length} Technologies
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Start learning with our curated collection
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <path d="M3 6h18M6 12h12M9 18h6" />
                </svg>
                Filter
              </button>
              <button className="btn btn-outline btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />
                </svg>
                Sort
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
              <div style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Loading technologies...</div>
            </div>
          ) : (
            <div className="grid grid-4" style={{ gap: '24px' }}>
              {filteredTechnologies.map((technology) => (
                <Link
                  key={technology._id}
                  href={`/technologies/${technology.slug}`}
                  className="card"
                  style={{ 
                    overflow: 'hidden', 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  {/* Icon Header */}
                  <div style={{ 
                    height: '120px', 
                    background: technology.color || 'linear-gradient(135deg, var(--bg-accent) 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    <span style={{ filter: 'grayscale(0)' }}>
                      {getTechIcon(technology.slug || '')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="card-body">
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {technology.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                      {technology.description ? technology.description.slice(0, 80) + '...' : 'Learn this AI technology'}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {technology.courses?.length || 0} Courses
                        </span>
                      </div>
                      <span style={{ color: 'var(--text-accent)', fontSize: '14px', fontWeight: 600 }}>
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredTechnologies.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No technologies found
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="card" style={{ 
            padding: '48px', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--bg-accent) 0%, #059669 100%)',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Request a new technology or course and we&apos;ll consider adding it to our platform
            </p>
            <button className="btn btn-dark btn-lg">
              Request a Technology
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
