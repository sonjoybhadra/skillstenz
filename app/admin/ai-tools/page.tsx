'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { aiToolsAPI, AITool } from '@/lib/api';

// Category info
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

const pricingLabels: Record<string, string> = {
  'free': 'Free',
  'freemium': 'Freemium',
  'paid': 'Paid',
  'enterprise': 'Enterprise',
  'open-source': 'Open Source'
};

interface Stats {
  stats: {
    total: number;
    published: number;
    featured: number;
    trending: number;
    draft: number;
  };
  byCategory: { _id: string; count: number }[];
  byPricing: { _id: string; count: number }[];
  topViewed: AITool[];
  recentlyAdded: AITool[];
}

export default function AdminAIToolsPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [showPublished, setShowPublished] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTools = async () => {
    setLoading(true);
    const { data, error } = await aiToolsAPI.getAll({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      pricing: selectedPricing !== 'all' ? selectedPricing : undefined,
      page: pagination.page,
      limit: 20
    });
    if (data && !error) {
      let filteredTools = data.tools;
      if (showPublished === 'published') {
        filteredTools = filteredTools.filter(t => t.isPublished);
      } else if (showPublished === 'draft') {
        filteredTools = filteredTools.filter(t => !t.isPublished);
      }
      setTools(filteredTools);
      setPagination(prev => ({ ...prev, total: data.pagination.total, pages: data.pagination.pages }));
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const { data, error } = await aiToolsAPI.getStats();
    if (data && !error) {
      setStats(data);
    }
  };

  useEffect(() => {
    fetchTools();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedPricing, showPublished, pagination.page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this AI tool?')) return;
    
    setActionLoading(true);
    const { error } = await aiToolsAPI.delete(id);
    if (!error) {
      fetchTools();
      fetchStats();
    } else {
      alert('Failed to delete tool');
    }
    setActionLoading(false);
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'feature' | 'unfeature' | 'delete') => {
    if (selectedTools.length === 0) return;
    
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedTools.length} tools?`)) return;
    }

    setActionLoading(true);
    
    if (action === 'delete') {
      for (const id of selectedTools) {
        await aiToolsAPI.delete(id);
      }
    } else {
      const updates: Partial<AITool> = {};
      if (action === 'publish') updates.isPublished = true;
      if (action === 'unpublish') updates.isPublished = false;
      if (action === 'feature') updates.featured = true;
      if (action === 'unfeature') updates.featured = false;
      
      await aiToolsAPI.bulkUpdate(selectedTools, updates);
    }
    
    setSelectedTools([]);
    fetchTools();
    fetchStats();
    setActionLoading(false);
  };

  const toggleSelectAll = () => {
    if (selectedTools.length === tools.length) {
      setSelectedTools([]);
    } else {
      setSelectedTools(tools.map(t => t._id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedTools.includes(id)) {
      setSelectedTools(prev => prev.filter(i => i !== id));
    } else {
      setSelectedTools(prev => [...prev, id]);
    }
  };

  const filteredTools = tools.filter(tool => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.shortDescription?.toLowerCase().includes(query) ||
      tool.parentCompany?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Tools Management</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your AI tools directory</p>
            </div>
            <Link
              href="/admin/ai-tools/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <span>+</span>
              Add AI Tool
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.stats.total}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Tools</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600">{stats.stats.published}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Published</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-gray-600">{stats.stats.draft}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Drafts</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-yellow-600">{stats.stats.featured}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Featured</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-red-600">{stats.stats.trending}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Trending</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-grow max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryInfo).map(([key, val]) => (
                <option key={key} value={key}>{val.icon} {val.name}</option>
              ))}
            </select>

            {/* Pricing Filter */}
            <select
              value={selectedPricing}
              onChange={(e) => { setSelectedPricing(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Pricing</option>
              {Object.entries(pricingLabels).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={showPublished}
              onChange={(e) => setShowPublished(e.target.value as 'all' | 'published' | 'draft')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedTools.length > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedTools.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('publish')}
                disabled={actionLoading}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                disabled={actionLoading}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Unpublish
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                disabled={actionLoading}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('unfeature')}
                disabled={actionLoading}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Unfeature
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Tools Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No AI tools found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTools.length === tools.length && tools.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tool
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTools.map((tool) => (
                  <tr key={tool._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTools.includes(tool._id)}
                        onChange={() => toggleSelect(tool._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                          {tool.logo ? (
                            <Image src={tool.logo} alt={tool.name} width={32} height={32} className="object-contain" />
                          ) : (
                            <span className="text-xl">{tool.icon || categoryInfo[tool.category]?.icon || '🤖'}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{tool.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{tool.parentCompany?.name || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ backgroundColor: `${categoryInfo[tool.category]?.color}20`, color: categoryInfo[tool.category]?.color }}
                      >
                        {categoryInfo[tool.category]?.icon} {categoryInfo[tool.category]?.name || tool.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {pricingLabels[tool.pricing.type] || tool.pricing.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${tool.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'}`}>
                          {tool.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {tool.featured && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">⭐</span>
                        )}
                        {tool.trending && (
                          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">🔥</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tool.views?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/ai-tools/${tool.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/ai-tools/${tool._id}/edit`}
                          className="p-2 text-gray-400 hover:text-green-600"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(tool._id)}
                          disabled={actionLoading}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Distribution */}
        {stats && stats.byCategory.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Category Distribution</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.byCategory.map((cat) => (
                <div key={cat._id} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="text-2xl mb-1">{categoryInfo[cat._id]?.icon || '🔧'}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{cat.count}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{categoryInfo[cat._id]?.name || cat._id}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
