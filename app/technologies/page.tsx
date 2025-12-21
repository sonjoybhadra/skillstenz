'use client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { technologiesAPI, technologyCategoriesAPI, Technology, TechnologyCategory } from '../../lib/api';

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [categories, setCategories] = useState<TechnologyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grouped');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techResult, catResult] = await Promise.all([
          technologiesAPI.getAll(),
          technologyCategoriesAPI.getAll()
        ]);
        
        if (techResult.data && !techResult.error) {
          setTechnologies(techResult.data);
        }
        if (catResult.data && !catResult.error) {
          setCategories(catResult.data);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get icon for technology - use category icon or fallback
  const getTechIcon = (tech: Technology): string => {
    if (tech.icon) return tech.icon;
    if (tech.category?.icon) return tech.category.icon;
    
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
    return icons[tech.slug || ''] || icons['default'];
  };

  // Filter technologies based on search and category
  const filteredTechnologies = useMemo(() => {
    return technologies.filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (selectedCategory === 'all') return matchesSearch;
      
      // Match by category ID or slug
      const techCategoryId = tech.category?._id || (tech as { categoryId?: string }).categoryId;
      const techCategorySlug = tech.category?.slug;
      
      return matchesSearch && (techCategoryId === selectedCategory || techCategorySlug === selectedCategory);
    });
  }, [technologies, searchQuery, selectedCategory]);

  // Group technologies by category
  const groupedTechnologies = useMemo(() => {
    const groups: Record<string, { category: TechnologyCategory | null; technologies: Technology[] }> = {};
    
    // Initialize groups for all categories
    categories.forEach(cat => {
      groups[cat._id] = { category: cat, technologies: [] };
    });
    
    // Add uncategorized group
    groups['uncategorized'] = { category: null, technologies: [] };
    
    // Assign technologies to groups
    filteredTechnologies.forEach(tech => {
      const categoryId = tech.category?._id || (tech as { categoryId?: string }).categoryId;
      if (categoryId && groups[categoryId]) {
        groups[categoryId].technologies.push(tech);
      } else {
        groups['uncategorized'].technologies.push(tech);
      }
    });
    
    // Filter out empty groups and sort by category order
    return Object.values(groups)
      .filter(group => group.technologies.length > 0)
      .sort((a, b) => {
        if (!a.category) return 1;
        if (!b.category) return -1;
        return (a.category.order || 0) - (b.category.order || 0);
      });
  }, [filteredTechnologies, categories]);

  // Category tabs including "All"
  const categoryTabs = useMemo(() => {
    return [
      { _id: 'all', name: 'All Technologies', icon: '🔥', slug: 'all' },
      ...categories.filter(cat => cat.isPublished)
    ];
  }, [categories]);

  // Technology Card Component
  const TechnologyCard = ({ technology, getTechIcon }: { technology: Technology; getTechIcon: (tech: Technology) => string }) => (
    <Link
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
        background: technology.color || technology.category?.color || 'linear-gradient(135deg, var(--bg-accent) 0%, #059669 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        position: 'relative'
      }}>
        <span style={{ filter: 'grayscale(0)' }}>
          {getTechIcon(technology)}
        </span>
        {/* Category Badge */}
        {technology.category && (
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            color: 'white',
            fontWeight: 500,
            backdropFilter: 'blur(4px)'
          }}>
            {technology.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="card-body">
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {technology.name}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
          {technology.description ? technology.description.slice(0, 80) + '...' : 'Learn this technology'}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {technology.courseCount || technology.courses?.length || 0} Courses
            </span>
          </div>
          <span style={{ color: 'var(--text-accent)', fontSize: '14px', fontWeight: 600 }}>
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );

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
          <div className="tabs" style={{ justifyContent: 'flex-start', padding: '16px 0', overflowX: 'auto', gap: '8px' }}>
            {categoryTabs.map((cat) => (
              <button
                key={cat._id}
                className={`tab ${selectedCategory === cat._id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat._id)}
                style={{
                  whiteSpace: 'nowrap',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  border: selectedCategory === cat._id ? 'none' : '1px solid var(--border-primary)',
                  background: selectedCategory === cat._id 
                    ? ('color' in cat && cat.color ? cat.color : 'var(--bg-accent)') 
                    : 'transparent',
                  color: selectedCategory === cat._id ? 'white' : 'var(--text-secondary)'
                }}
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
              {/* View Mode Toggle */}
              <div style={{ display: 'flex', border: '1px solid var(--border-primary)', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setViewMode('grid')}
                  style={{ borderRadius: 0, border: 'none' }}
                  title="Grid View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button 
                  className={`btn btn-sm ${viewMode === 'grouped' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setViewMode('grouped')}
                  style={{ borderRadius: 0, border: 'none' }}
                  title="Grouped View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M3 12h18" />
                    <path d="M3 18h18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
              <div style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Loading technologies...</div>
            </div>
          ) : viewMode === 'grouped' && selectedCategory === 'all' ? (
            /* Grouped View - Show technologies organized by category */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {groupedTechnologies.map((group) => (
                <div key={group.category?._id || 'uncategorized'}>
                  {/* Category Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '2px solid var(--border-primary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '32px',
                        background: group.category?.color || 'var(--bg-accent)',
                        padding: '12px',
                        borderRadius: '12px'
                      }}>
                        {group.category?.icon || '📂'}
                      </span>
                      <div>
                        <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {group.category?.name || 'Other Technologies'}
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                          {group.category?.description || 'Additional technologies'}
                        </p>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '6px 12px', 
                      background: group.category?.color || 'var(--bg-accent)', 
                      color: 'white', 
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      {group.technologies.length} {group.technologies.length === 1 ? 'Technology' : 'Technologies'}
                    </div>
                  </div>

                  {/* Technologies Grid within Category */}
                  <div className="grid grid-4" style={{ gap: '24px' }}>
                    {group.technologies.map((technology) => (
                      <TechnologyCard key={technology._id} technology={technology} getTechIcon={getTechIcon} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid View - Flat list */
            <div className="grid grid-4" style={{ gap: '24px' }}>
              {filteredTechnologies.map((technology) => (
                <TechnologyCard key={technology._id} technology={technology} getTechIcon={getTechIcon} />
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
