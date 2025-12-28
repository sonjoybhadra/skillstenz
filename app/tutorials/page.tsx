'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { technologiesAPI, technologyCategoriesAPI, Technology, TechnologyCategory } from '@/lib/api';

export default function TutorialsPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [categories, setCategories] = useState<TechnologyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grouped');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techResult, catResult] = await Promise.all([
          technologiesAPI.getAll({ limit: 100 }),
          technologyCategoriesAPI.getAll()
        ]);
        
        if (techResult.data && !techResult.error) {
          setTechnologies(techResult.data);
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
    fetchData();
  }, []);

  const getTechIcon = (tech: Technology): string => {
    if (tech.icon) return tech.icon;
    const icons: Record<string, string> = {
      'python': '🐍', 'javascript': '🟨', 'react': '⚛️', 'nodejs': '🟢',
      'java': '☕', 'typescript': '🔷', 'ai': '🤖', 'langchain': '🔗', 'default': '📘'
    };
    return icons[tech.slug || ''] || icons['default'];
  };

  const filteredTechnologies = useMemo(() => {
    return technologies.filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (selectedCategory === 'all') return matchesSearch;
      
      const techCategoryId = tech.category?._id;
      const techCategorySlug = tech.category?.slug;
      
      return matchesSearch && (techCategoryId === selectedCategory || techCategorySlug === selectedCategory);
    });
  }, [technologies, searchQuery, selectedCategory]);

  const groupedTechnologies = useMemo(() => {
    const groups: Record<string, { category: TechnologyCategory | null; technologies: Technology[] }> = {};
    
    categories.forEach(cat => {
      groups[cat._id] = { category: cat, technologies: [] };
    });
    groups['uncategorized'] = { category: null, technologies: [] };
    
    filteredTechnologies.forEach(tech => {
      const categoryId = tech.category?._id;
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

  const categoryTabs = useMemo(() => {
    return [
      { _id: 'all', name: 'All Tutorials', icon: '📚', slug: 'all' },
      ...categories.filter(cat => cat.isPublished)
    ];
  }, [categories]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 py-16 md:py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <span className="text-green-400">●</span>
            <span>100% Free Tutorials</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learn to <span className="text-green-400">Code</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Master programming with step-by-step tutorials, hands-on examples, and interactive exercises
          </p>
          
          <div className="max-w-lg mx-auto relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* Category Filter & View Toggle */}
      <section className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Category Dropdown Filter */}
            <div className="flex items-center gap-3 flex-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Filter by Category:
              </label>
              <div className="relative w-full max-w-xs">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
                >
                  {categoryTabs.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon || '📘'} {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-slate-700' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                title="Grid View"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grouped' ? 'bg-gray-200 dark:bg-slate-700' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                title="Grouped View"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50 dark:bg-slate-950 min-h-screen">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredTechnologies.map((tech) => (
                <Link
                  key={tech._id}
                  href={`/tutorials/${tech.slug}`}
                  className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-700 transition-all hover:shadow-lg text-center group"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{getTechIcon(tech)}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{tech.name}</span>
                  {(tech.chapterCount > 0 || tech.courseCount > 0) && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {tech.chapterCount || tech.courseCount} chapters
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            // Grouped View
            <div className="space-y-10">
              {groupedTechnologies.map((group, idx) => (
                <div key={group.category?._id || `group-${idx}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{group.category?.icon || '📂'}</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {group.category?.name || 'Other Tutorials'}
                    </h2>
                    <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {group.technologies.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {group.technologies.map((tech) => (
                      <Link
                        key={tech._id}
                        href={`/tutorials/${tech.slug}`}
                        className="flex flex-col items-center p-5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-700 transition-all hover:shadow-lg text-center group"
                      >
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{getTechIcon(tech)}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{tech.name}</span>
                        {(tech.chapterCount > 0 || tech.courseCount > 0) && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {tech.chapterCount || tech.courseCount} chapters
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredTechnologies.length === 0 && (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No tutorials found matching your search</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
