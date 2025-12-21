'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { technologyCategoriesAPI, TechnologyCategory } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  category?: TechnologyCategory;
  categoryId?: string;
  topicsCount?: number;
  chaptersCount?: number;
}

export default function TutorialsPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [categories, setCategories] = useState<TechnologyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grouped');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [techResponse, catResult] = await Promise.all([
        fetch(`${API_URL}/technologies?limit=100`),
        technologyCategoriesAPI.getAll()
      ]);
      
      if (techResponse.ok) {
        const data = await techResponse.json();
        if (data.technologies?.length) {
          setTechnologies(data.technologies);
        }
      }
      
      if (catResult.data && !catResult.error) {
        setCategories(catResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter technologies based on search and category
  const filteredTechnologies = useMemo(() => {
    return technologies.filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (selectedCategory === 'all') return matchesSearch;
      
      const techCategoryId = tech.category?._id || tech.categoryId;
      const techCategorySlug = tech.category?.slug;
      
      return matchesSearch && (techCategoryId === selectedCategory || techCategorySlug === selectedCategory);
    });
  }, [technologies, searchQuery, selectedCategory]);

  // Group technologies by category
  const groupedTechnologies = useMemo(() => {
    const groups: Record<string, { category: TechnologyCategory | null; technologies: Technology[] }> = {};
    
    categories.forEach(cat => {
      groups[cat._id] = { category: cat, technologies: [] };
    });
    
    groups['uncategorized'] = { category: null, technologies: [] };
    
    filteredTechnologies.forEach(tech => {
      const categoryId = tech.category?._id || tech.categoryId;
      if (categoryId && groups[categoryId]) {
        groups[categoryId].technologies.push(tech);
      } else {
        groups['uncategorized'].technologies.push(tech);
      }
    });
    
    return Object.values(groups)
      .filter(group => group.technologies.length > 0)
      .sort((a, b) => {
        if (!a.category) return 1;
        if (!b.category) return -1;
        return (a.category.order || 0) - (b.category.order || 0);
      });
  }, [filteredTechnologies, categories]);

  // Category tabs
  const categoryTabs = useMemo(() => {
    return [
      { _id: 'all', name: 'All Tutorials', icon: '📚', slug: 'all', color: '#10b981' },
      ...categories.filter(cat => cat.isPublished)
    ];
  }, [categories]);

  return (
    <Layout>
      <div style={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="hero-gradient" style={{ padding: '60px 0 70px', color: 'white', position: 'relative' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '50px', 
              fontSize: '14px', 
              marginBottom: '24px' 
            }}>
              <span style={{ color: '#22c55e' }}>●</span>
              <span>100% Free Tutorials</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginBottom: '16px' }}>
              Learn to <span style={{ color: '#22c55e' }}>Code</span>
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              Master programming with step-by-step tutorials, hands-on examples, and interactive exercises
            </p>
            
            {/* Search */}
            <div style={{ maxWidth: '560px', margin: '0 auto' }}>
              <div style={{ position: 'relative' }}>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#9ca3af" 
                  strokeWidth="2"
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tutorials (HTML, CSS, JavaScript, Python...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    color: '#1f2937',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '40px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '700' }}>{technologies.length}+</div>
                <div style={{ opacity: 0.7, fontSize: '14px' }}>Technologies</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '700' }}>500+</div>
                <div style={{ opacity: 0.7, fontSize: '14px' }}>Chapters</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '700' }}>FREE</div>
                <div style={{ opacity: 0.7, fontSize: '14px' }}>Forever</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section style={{ 
          background: 'var(--bg-primary)', 
          borderBottom: '1px solid var(--border-primary)', 
          position: 'sticky', 
          top: 'calc(var(--navbar-height) + var(--secondary-menu-height))', 
          zIndex: 10 
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flex: 1, paddingRight: '16px', scrollbarWidth: 'none' }}>
                {categoryTabs.map(cat => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '50px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      background: selectedCategory === cat._id 
                        ? (cat.color || 'var(--bg-accent)') 
                        : 'var(--bg-secondary)',
                      color: selectedCategory === cat._id ? 'white' : 'var(--text-secondary)',
                      border: selectedCategory === cat._id ? 'none' : '1px solid var(--border-primary)'
                    }}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
              
              {/* View Toggle */}
              <div style={{ display: 'flex', border: '1px solid var(--border-primary)', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px',
                    background: viewMode === 'grid' ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                    color: viewMode === 'grid' ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Grid View"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('grouped')}
                  style={{
                    padding: '8px',
                    background: viewMode === 'grouped' ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                    color: viewMode === 'grouped' ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Grouped View"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tutorials Grid */}
        <section style={{ padding: '48px 0', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
            {/* Results Count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {filteredTechnologies.length} Tutorials
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                  Free tutorials with hands-on examples
                </p>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                <div className="spinner"></div>
              </div>
            ) : viewMode === 'grouped' && selectedCategory === 'all' ? (
              /* Grouped View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {groupedTechnologies.map((group) => (
                  <div key={group.category?._id || 'uncategorized'}>
                    {/* Category Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--border-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span 
                          style={{ 
                            fontSize: '28px', 
                            padding: '12px', 
                            borderRadius: '12px',
                            background: (group.category?.color || '#6366f1') + '20' 
                          }}
                        >
                          {group.category?.icon || '📂'}
                        </span>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {group.category?.name || 'Other Tutorials'}
                          </h3>
                          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                            {group.category?.description || 'Additional tutorials'}
                          </p>
                        </div>
                      </div>
                      <span 
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '50px', 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: 'white',
                          background: group.category?.color || '#6366f1' 
                        }}
                      >
                        {group.technologies.length} tutorials
                      </span>
                    </div>

                    {/* Technologies Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                      {group.technologies.map(tech => (
                        <TutorialCard key={tech._id} technology={tech} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Grid View */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredTechnologies.map(tech => (
                  <TutorialCard key={tech._id} technology={tech} />
                ))}
              </div>
            )}

            {filteredTechnologies.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>No tutorials found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filter</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-4 px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Why Learn Section */}
        <section className="py-16 bg-[var(--bg-primary)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-4">
              Why Learn With Us?
            </h2>
            <p className="text-center text-[var(--text-muted)] mb-12 max-w-2xl mx-auto">
              Our tutorials are designed to help you learn faster and retain knowledge better
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: '📖', title: 'Easy to Learn', desc: 'Step-by-step tutorials for beginners', color: '#3b82f6' },
                { icon: '💻', title: 'Try It Yourself', desc: 'Practice with online code editor', color: '#10b981' },
                { icon: '🎯', title: 'Real Examples', desc: 'Learn from practical projects', color: '#f59e0b' },
                { icon: '🎓', title: 'Get Certified', desc: 'Earn certificates to showcase', color: '#8b5cf6' }
              ].map((item, i) => (
                <div key={i} className="bg-[var(--bg-card)] rounded-xl p-6 text-center border border-[var(--border-primary)] hover:shadow-lg transition-shadow">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                    style={{ background: item.color + '20' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-[var(--bg-secondary)]">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-[var(--bg-accent)] to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Pick any tutorial and start coding today. No signup required for free tutorials!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/tutorials/html" className="px-6 py-3 bg-white text-[var(--bg-accent)] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start with HTML
                </Link>
                <Link href="/roadmaps" className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
                  View Roadmaps
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function TutorialCard({ technology }: { technology: Technology }) {
  return (
    <Link
      href={`/tutorials/${technology.slug}`}
      className="group bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden hover:shadow-xl hover:border-[var(--bg-accent)] transition-all hover:-translate-y-1"
    >
      <div 
        className="h-28 flex items-center justify-center text-5xl relative"
        style={{ backgroundColor: (technology.color || '#6366f1') + '20' }}
      >
        {technology.icon || '📘'}
        {/* Category Badge */}
        {technology.category && (
          <span 
            className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium text-white"
            style={{ background: technology.category.color || '#6366f1' }}
          >
            {technology.category.name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
          {technology.name}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
          {technology.description || `Learn ${technology.name} from scratch`}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-primary)]">
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {technology.chaptersCount || technology.topicsCount || '10+'} Chapters
          </span>
          <span className="text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-600 rounded">
            FREE
          </span>
        </div>
      </div>
    </Link>
  );
}
