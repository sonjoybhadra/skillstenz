'use client';

import { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { aiToolsAPI, AITool, AIToolCategory } from '@/lib/api';
import { useSettings } from '@/lib/settings';

// Category info with icons and colors
const categoryInfo: Record<string, { name: string; icon: string; color: string }> = {
  'chatbots': { name: 'Chatbots & Assistants', icon: '💬', color: '#3B82F6' },
  'image-generation': { name: 'Image Generation', icon: '🎨', color: '#8B5CF6' },
  'video-generation': { name: 'Video Generation', icon: '🎬', color: '#EC4899' },
  'audio-generation': { name: 'Audio & Music', icon: '🎵', color: '#F59E0B' },
  'writing-assistant': { name: 'Writing & Content', icon: '✍️', color: '#10B981' },
  'code-assistant': { name: 'Code & Development', icon: '💻', color: '#6366F1' },
  'data-analysis': { name: 'Data & Analytics', icon: '📊', color: '#14B8A6' },
  'automation': { name: 'Automation', icon: '⚡', color: '#F97316' },
  'research': { name: 'Research & Knowledge', icon: '🔬', color: '#8B5CF6' },
  'design': { name: 'Design & Creative', icon: '🎯', color: '#EC4899' },
  'marketing': { name: 'Marketing & Sales', icon: '📈', color: '#EF4444' },
  'productivity': { name: 'Productivity', icon: '⏱️', color: '#22C55E' },
  'education': { name: 'Education & Learning', icon: '📚', color: '#3B82F6' },
  'healthcare': { name: 'Healthcare', icon: '🏥', color: '#06B6D4' },
  'finance': { name: 'Finance', icon: '💰', color: '#84CC16' },
  'other': { name: 'Other Tools', icon: '🔧', color: '#6B7280' }
};

const pricingLabels: Record<string, { name: string; color: string }> = {
  'free': { name: 'Free', color: '#22C55E' },
  'freemium': { name: 'Freemium', color: '#3B82F6' },
  'paid': { name: 'Paid', color: '#F59E0B' },
  'enterprise': { name: 'Enterprise', color: '#8B5CF6' },
  'open-source': { name: 'Open Source', color: '#10B981' }
};

export default function AIToolsPage() {
  const { settings } = useSettings();
  const [tools, setTools] = useState<AITool[]>([]);
  const [categories, setCategories] = useState<AIToolCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('-featured,-trending,name');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const fetchTools = async () => {
    setLoading(true);
    const { data, error } = await aiToolsAPI.getAll({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      pricing: selectedPricing !== 'all' ? selectedPricing : undefined,
      sort: sortBy,
      page: pagination.page,
      limit: 24
    });
    if (data && !error) {
      setTools(data.tools);
      setPagination(prev => ({ ...prev, total: data.pagination.total, pages: data.pagination.pages }));
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await aiToolsAPI.getCategories();
    if (data && !error) {
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchTools();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedPricing, sortBy, pagination.page]);

  // Client-side search filtering
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.shortDescription?.toLowerCase().includes(query) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      tool.parentCompany?.name?.toLowerCase().includes(query)
    );
  }, [tools, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled client-side through filteredTools
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSortBy('-featured,-trending,name');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <Layout>
      {/* SEO Meta */}
      <head>
        <title>AI Tools Directory - Discover the Best AI Tools | {settings.siteName}</title>
        <meta name="description" content="Explore our comprehensive directory of AI tools. Find the best AI chatbots, image generators, code assistants, and more. Compare features, pricing, and reviews." />
        <meta name="keywords" content="AI tools, artificial intelligence, ChatGPT, DALL-E, Midjourney, AI assistant, machine learning tools" />
      </head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <span className="text-2xl mr-2">🤖</span>
                <span className="text-sm font-medium">AI Tools Directory</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover the Best AI Tools
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                Explore {pagination.total}+ AI tools across {categories.length} categories. 
                Find the perfect tool for your needs.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search AI tools by name, category, or feature..."
                    className="w-full px-6 py-4 pl-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => { setSelectedCategory('all'); setPagination(p => ({ ...p, page: 1 })); }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setSelectedCategory(cat.slug); setPagination(p => ({ ...p, page: 1 })); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                    selectedCategory === cat.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Filters and View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Pricing Filter */}
              <select
                value={selectedPricing}
                onChange={(e) => { setSelectedPricing(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Pricing</option>
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="enterprise">Enterprise</option>
                <option value="open-source">Open Source</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="-featured,-trending,name">Featured First</option>
                <option value="-trending,-views">Trending</option>
                <option value="name">Name (A-Z)</option>
                <option value="-name">Name (Z-A)</option>
                <option value="-views">Most Viewed</option>
                <option value="-createdAt">Newest</option>
              </select>

              {/* Reset Filters */}
              {(selectedCategory !== 'all' || selectedPricing !== 'all' || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>

              <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                {filteredTools.length} tools found
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No tools found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters or search query</p>
              <button onClick={resetFilters} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool._id}
                      href={`/ai-tools/${tool.slug}`}
                      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-6">
                        {/* Logo/Icon */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                            {tool.logo ? (
                              <Image src={tool.logo} alt={tool.name} width={48} height={48} className="object-contain" />
                            ) : (
                              <span className="text-3xl">{tool.icon || categoryInfo[tool.category]?.icon || '🤖'}</span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {tool.featured && (
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                                ⭐ Featured
                              </span>
                            )}
                            {tool.trending && (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                                🔥 Trending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                          {tool.name}
                        </h3>

                        {/* Parent Company */}
                        {tool.parentCompany?.name && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            by {tool.parentCompany.name}
                          </p>
                        )}

                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {tool.shortDescription}
                        </p>

                        {/* Category & Pricing */}
                        <div className="flex items-center justify-between">
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: `${categoryInfo[tool.category]?.color}20`,
                              color: categoryInfo[tool.category]?.color 
                            }}
                          >
                            {categoryInfo[tool.category]?.icon} {categoryInfo[tool.category]?.name || tool.category}
                          </span>
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: `${pricingLabels[tool.pricing.type]?.color}20`,
                              color: pricingLabels[tool.pricing.type]?.color 
                            }}
                          >
                            {pricingLabels[tool.pricing.type]?.name || tool.pricing.type}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool._id}
                      href={`/ai-tools/${tool.slug}`}
                      className="group flex items-center gap-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700"
                    >
                      {/* Logo */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                        {tool.logo ? (
                          <Image src={tool.logo} alt={tool.name} width={56} height={56} className="object-contain" />
                        ) : (
                          <span className="text-4xl">{tool.icon || categoryInfo[tool.category]?.icon || '🤖'}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {tool.name}
                          </h3>
                          {tool.featured && <span className="text-yellow-500">⭐</span>}
                          {tool.trending && <span className="text-red-500">🔥</span>}
                        </div>
                        {tool.parentCompany?.name && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            by {tool.parentCompany.name}
                          </p>
                        )}
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {tool.shortDescription}
                        </p>
                        <div className="flex items-center gap-3">
                          <span 
                            className="px-3 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: `${categoryInfo[tool.category]?.color}20`,
                              color: categoryInfo[tool.category]?.color 
                            }}
                          >
                            {categoryInfo[tool.category]?.icon} {categoryInfo[tool.category]?.name}
                          </span>
                          <span 
                            className="px-3 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: `${pricingLabels[tool.pricing.type]?.color}20`,
                              color: pricingLabels[tool.pricing.type]?.color 
                            }}
                          >
                            {pricingLabels[tool.pricing.type]?.name}
                          </span>
                          {tool.apiAvailable && (
                            <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                              API Available
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
