'use client';

import { useState, useEffect } from 'react';
import { adminAPI, HomeSection, HomeSectionItem, HomeSectionCtaCard, HomeSectionCareerCategory, HomeSectionCompilerLanguage } from '../../../lib/api';

const SECTION_TYPES = [
  { key: 'hero', label: 'Hero Section', icon: '🎯' },
  { key: 'cta_cards', label: 'CTA Cards', icon: '💳' },
  { key: 'latest_updates', label: 'Latest Updates', icon: '📰' },
  { key: 'cheatsheets', label: 'Cheatsheets', icon: '📋' },
  { key: 'roadmaps', label: 'Roadmaps', icon: '🗺️' },
  { key: 'career_categories', label: 'Career Categories', icon: '💼' },
  { key: 'compiler', label: 'Compiler Section', icon: '⚡' },
  { key: 'tools', label: 'Tools', icon: '🛠️' },
];

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'items' | 'hero' | 'cta' | 'compiler'>('general');

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data, error } = await adminAPI.getHomepageSections();
      if (data && !error) {
        setSections(Array.isArray(data) ? data : (data as { data: HomeSection[] }).data || []);
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggleStatus = async (section: HomeSection) => {
    try {
      const { error } = await adminAPI.toggleHomepageSectionStatus(section._id);
      if (!error) {
        setMessage({ type: 'success', text: `Section ${section.isActive ? 'deactivated' : 'activated'} successfully` });
        fetchSections();
      } else {
        setMessage({ type: 'error', text: error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to toggle section status' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEdit = (section: HomeSection) => {
    setEditingSection({ ...section });
    setActiveTab('general');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingSection) return;
    
    setSaving(true);
    try {
      const { error } = await adminAPI.updateHomepageSection(editingSection._id, editingSection);
      if (!error) {
        setMessage({ type: 'success', text: 'Section updated successfully' });
        setShowModal(false);
        setEditingSection(null);
        fetchSections();
      } else {
        setMessage({ type: 'error', text: error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save section' });
    } finally {
      setSaving(false);
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (section: HomeSection) => {
    if (!confirm(`Are you sure you want to delete "${section.title}"?`)) return;
    
    try {
      const { error } = await adminAPI.deleteHomepageSection(section._id);
      if (!error) {
        setMessage({ type: 'success', text: 'Section deleted successfully' });
        fetchSections();
      } else {
        setMessage({ type: 'error', text: error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete section' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const updateEditingSection = (field: string, value: unknown) => {
    if (!editingSection) return;
    setEditingSection({ ...editingSection, [field]: value });
  };

  const updateNestedField = (parent: string, field: string, value: unknown) => {
    if (!editingSection) return;
    const parentObj = editingSection[parent as keyof HomeSection] as Record<string, unknown> || {};
    setEditingSection({
      ...editingSection,
      [parent]: { ...parentObj, [field]: value }
    });
  };

  // Items management
  const addItem = (type: 'items' | 'ctaCards' | 'careerCategories') => {
    if (!editingSection) return;
    
    const newItem = type === 'items' 
      ? { name: 'New Item', icon: '📘', href: '/', order: (editingSection.items?.length || 0) }
      : type === 'ctaCards'
      ? { title: 'New Card', description: '', buttonText: 'Learn More', buttonHref: '/', gradient: 'from-blue-600 to-blue-700', order: (editingSection.ctaCards?.length || 0) }
      : { title: 'New Category', colorClass: 'blue', tags: [], order: (editingSection.careerCategories?.length || 0) };
    
    const currentItems = editingSection[type] || [];
    setEditingSection({
      ...editingSection,
      [type]: [...currentItems, newItem]
    });
  };

  const updateItem = (type: 'items' | 'ctaCards' | 'careerCategories', index: number, field: string, value: unknown) => {
    if (!editingSection) return;
    const items = [...(editingSection[type] || [])];
    items[index] = { ...items[index], [field]: value };
    setEditingSection({ ...editingSection, [type]: items });
  };

  const removeItem = (type: 'items' | 'ctaCards' | 'careerCategories', index: number) => {
    if (!editingSection) return;
    const items = [...(editingSection[type] || [])];
    items.splice(index, 1);
    setEditingSection({ ...editingSection, [type]: items });
  };

  // Compiler languages management
  const addCompilerLanguage = () => {
    if (!editingSection) return;
    const languages = editingSection.compilerData?.languages || [];
    const newLang = { name: 'New Language', icon: '📝', href: '/compiler/new', isPrimary: false, order: languages.length };
    setEditingSection({
      ...editingSection,
      compilerData: {
        ...editingSection.compilerData,
        languages: [...languages, newLang]
      }
    });
  };

  const updateCompilerLanguage = (index: number, field: string, value: unknown) => {
    if (!editingSection) return;
    const languages = [...(editingSection.compilerData?.languages || [])];
    languages[index] = { ...languages[index], [field]: value };
    setEditingSection({
      ...editingSection,
      compilerData: { ...editingSection.compilerData, languages }
    });
  };

  const removeCompilerLanguage = (index: number) => {
    if (!editingSection) return;
    const languages = [...(editingSection.compilerData?.languages || [])];
    languages.splice(index, 1);
    setEditingSection({
      ...editingSection,
      compilerData: { ...editingSection.compilerData, languages }
    });
  };

  // Latest updates management
  const addLatestUpdate = () => {
    if (!editingSection) return;
    const items = editingSection.latestUpdates?.items || [];
    const newItem = { name: 'New Update', title: 'New Update', icon: '📚', isNew: true, order: items.length };
    setEditingSection({
      ...editingSection,
      latestUpdates: {
        ...editingSection.latestUpdates,
        items: [...items, newItem]
      }
    });
  };

  const updateLatestUpdate = (index: number, field: string, value: unknown) => {
    if (!editingSection) return;
    const items = [...(editingSection.latestUpdates?.items || [])];
    items[index] = { ...items[index], [field]: value };
    setEditingSection({
      ...editingSection,
      latestUpdates: { ...editingSection.latestUpdates, items }
    });
  };

  const removeLatestUpdate = (index: number) => {
    if (!editingSection) return;
    const items = [...(editingSection.latestUpdates?.items || [])];
    items.splice(index, 1);
    setEditingSection({
      ...editingSection,
      latestUpdates: { ...editingSection.latestUpdates, items }
    });
  };

  const getSectionIcon = (key: string) => {
    return SECTION_TYPES.find(t => t.key === key)?.icon || '📄';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homepage Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage dynamic sections of the homepage</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Sections List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Homepage Sections</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {sections.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No sections found. Run the seed script to initialize homepage sections.
            </div>
          ) : (
            sections.map((section) => (
              <div key={section._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getSectionIcon(section.sectionKey)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{section.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Key: {section.sectionKey} • Order: {section.order}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${section.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'}`}>
                    {section.isActive ? 'Active' : 'Inactive'}
                  </span>
                  
                  <button
                    onClick={() => handleToggleStatus(section)}
                    className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    title={section.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {section.isActive ? '👁️' : '👁️‍🗨️'}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(section)}
                    className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  
                  <button
                    onClick={() => handleDelete(section)}
                    className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editingSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit: {editingSection.title}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-slate-700 px-4">
              <div className="flex gap-4">
                {['general', 'items', 'hero', 'cta', 'compiler'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingSection.title}
                        onChange={(e) => updateEditingSection('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highlight Text</label>
                      <input
                        type="text"
                        value={editingSection.highlightText || ''}
                        onChange={(e) => updateEditingSection('highlightText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={editingSection.subtitle || ''}
                      onChange={(e) => updateEditingSection('subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                      <input
                        type="number"
                        value={editingSection.order}
                        onChange={(e) => updateEditingSection('order', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">See All Link</label>
                      <input
                        type="text"
                        value={editingSection.seeAllLink || ''}
                        onChange={(e) => updateEditingSection('seeAllLink', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background</label>
                      <select
                        value={editingSection.backgroundColor || 'white'}
                        onChange={(e) => updateEditingSection('backgroundColor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      >
                        <option value="white">White</option>
                        <option value="gray">Gray</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingSection.isActive}
                      onChange={(e) => updateEditingSection('isActive', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
                  </div>
                </div>
              )}

              {/* Items Tab */}
              {activeTab === 'items' && (
                <div className="space-y-4">
                  {/* Regular Items (cheatsheets, roadmaps, tools) */}
                  {['cheatsheets', 'roadmaps', 'tools'].includes(editingSection.sectionKey) && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Items</h3>
                        <button
                          onClick={() => addItem('items')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          + Add Item
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(editingSection.items || []).map((item, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-center gap-3">
                            <input
                              type="text"
                              value={item.icon || ''}
                              onChange={(e) => updateItem('items', idx, 'icon', e.target.value)}
                              className="w-12 px-2 py-1 border rounded text-center"
                              placeholder="Icon"
                            />
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem('items', idx, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 border rounded dark:bg-slate-600 dark:border-slate-500"
                              placeholder="Name"
                            />
                            <input
                              type="text"
                              value={item.href || ''}
                              onChange={(e) => updateItem('items', idx, 'href', e.target.value)}
                              className="w-40 px-2 py-1 border rounded dark:bg-slate-600 dark:border-slate-500"
                              placeholder="Link"
                            />
                            <button
                              onClick={() => removeItem('items', idx)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Latest Updates */}
                  {editingSection.sectionKey === 'latest_updates' && (
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month/Year</label>
                        <input
                          type="text"
                          value={editingSection.latestUpdates?.monthYear || ''}
                          onChange={(e) => updateNestedField('latestUpdates', 'monthYear', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                          placeholder="December, 2025"
                        />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Updates</h3>
                        <button
                          onClick={addLatestUpdate}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          + Add Update
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(editingSection.latestUpdates?.items || []).map((item, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-center gap-3">
                            <input
                              type="text"
                              value={item.title || item.name}
                              onChange={(e) => updateLatestUpdate(idx, 'title', e.target.value)}
                              className="flex-1 px-2 py-1 border rounded dark:bg-slate-600 dark:border-slate-500"
                              placeholder="Title"
                            />
                            <label className="flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                checked={item.isNew || false}
                                onChange={(e) => updateLatestUpdate(idx, 'isNew', e.target.checked)}
                              />
                              New
                            </label>
                            <button
                              onClick={() => removeLatestUpdate(idx)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Career Categories */}
                  {editingSection.sectionKey === 'career_categories' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Career Categories</h3>
                        <button
                          onClick={() => addItem('careerCategories')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          + Add Category
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(editingSection.careerCategories || []).map((cat, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg space-y-2">
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={cat.title}
                                onChange={(e) => updateItem('careerCategories', idx, 'title', e.target.value)}
                                className="flex-1 px-2 py-1 border rounded dark:bg-slate-600 dark:border-slate-500"
                                placeholder="Category Title"
                              />
                              <select
                                value={cat.colorClass || 'blue'}
                                onChange={(e) => updateItem('careerCategories', idx, 'colorClass', e.target.value)}
                                className="px-2 py-1 border rounded dark:bg-slate-600 dark:border-slate-500"
                              >
                                <option value="blue">Blue</option>
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="purple">Purple</option>
                              </select>
                              <button
                                onClick={() => removeItem('careerCategories', idx)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                🗑️
                              </button>
                            </div>
                            <input
                              type="text"
                              value={(cat.tags || []).join(', ')}
                              onChange={(e) => updateItem('careerCategories', idx, 'tags', e.target.value.split(',').map(t => t.trim()))}
                              className="w-full px-2 py-1 border rounded dark:bg-slate-600 dark:border-slate-500 text-sm"
                              placeholder="Tags (comma separated)"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hero Tab */}
              {activeTab === 'hero' && editingSection.sectionKey === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={editingSection.heroData?.badge || ''}
                      onChange={(e) => updateNestedField('heroData', 'badge', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Title</label>
                      <input
                        type="text"
                        value={editingSection.heroData?.mainTitle || ''}
                        onChange={(e) => updateNestedField('heroData', 'mainTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highlight Title</label>
                      <input
                        type="text"
                        value={editingSection.heroData?.highlightTitle || ''}
                        onChange={(e) => updateNestedField('heroData', 'highlightTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={editingSection.heroData?.description || ''}
                      onChange={(e) => updateNestedField('heroData', 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                    />
                  </div>
                  
                  {/* Stats */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Stats</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {(editingSection.heroData?.stats || []).map((stat, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const stats = [...(editingSection.heroData?.stats || [])];
                              stats[idx] = { ...stats[idx], value: e.target.value };
                              updateNestedField('heroData', 'stats', stats);
                            }}
                            className="w-full px-2 py-1 border rounded text-center font-bold mb-1 dark:bg-slate-600"
                            placeholder="Value"
                          />
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const stats = [...(editingSection.heroData?.stats || [])];
                              stats[idx] = { ...stats[idx], label: e.target.value };
                              updateNestedField('heroData', 'stats', stats);
                            }}
                            className="w-full px-2 py-1 border rounded text-center text-xs dark:bg-slate-600"
                            placeholder="Label"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Cards Tab */}
              {activeTab === 'cta' && editingSection.sectionKey === 'cta_cards' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">CTA Cards</h3>
                    <button
                      onClick={() => addItem('ctaCards')}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      + Add Card
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(editingSection.ctaCards || []).map((card, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Card {idx + 1}</span>
                          <button
                            onClick={() => removeItem('ctaCards', idx)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => updateItem('ctaCards', idx, 'title', e.target.value)}
                            className="px-2 py-1 border rounded dark:bg-slate-600"
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={card.icon || ''}
                            onChange={(e) => updateItem('ctaCards', idx, 'icon', e.target.value)}
                            className="px-2 py-1 border rounded dark:bg-slate-600"
                            placeholder="Icon (emoji)"
                          />
                        </div>
                        <textarea
                          value={card.description || ''}
                          onChange={(e) => updateItem('ctaCards', idx, 'description', e.target.value)}
                          className="w-full px-2 py-1 border rounded dark:bg-slate-600"
                          placeholder="Description"
                          rows={2}
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={card.buttonText || ''}
                            onChange={(e) => updateItem('ctaCards', idx, 'buttonText', e.target.value)}
                            className="px-2 py-1 border rounded dark:bg-slate-600"
                            placeholder="Button Text"
                          />
                          <input
                            type="text"
                            value={card.buttonHref || ''}
                            onChange={(e) => updateItem('ctaCards', idx, 'buttonHref', e.target.value)}
                            className="px-2 py-1 border rounded dark:bg-slate-600"
                            placeholder="Button Link"
                          />
                          <input
                            type="text"
                            value={card.gradient || ''}
                            onChange={(e) => updateItem('ctaCards', idx, 'gradient', e.target.value)}
                            className="px-2 py-1 border rounded dark:bg-slate-600"
                            placeholder="Gradient"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compiler Tab */}
              {activeTab === 'compiler' && editingSection.sectionKey === 'compiler' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingSection.compilerData?.title || ''}
                        onChange={(e) => updateNestedField('compilerData', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={editingSection.compilerData?.subtitle || ''}
                        onChange={(e) => updateNestedField('compilerData', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Languages</h3>
                      <button
                        onClick={addCompilerLanguage}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        + Add Language
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editingSection.compilerData?.languages || []).map((lang, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-center gap-3">
                          <input
                            type="text"
                            value={lang.icon || ''}
                            onChange={(e) => updateCompilerLanguage(idx, 'icon', e.target.value)}
                            className="w-12 px-2 py-1 border rounded text-center"
                            placeholder="Icon"
                          />
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => updateCompilerLanguage(idx, 'name', e.target.value)}
                            className="flex-1 px-2 py-1 border rounded dark:bg-slate-600"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={lang.href}
                            onChange={(e) => updateCompilerLanguage(idx, 'href', e.target.value)}
                            className="w-40 px-2 py-1 border rounded dark:bg-slate-600"
                            placeholder="Link"
                          />
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={lang.isPrimary || false}
                              onChange={(e) => updateCompilerLanguage(idx, 'isPrimary', e.target.checked)}
                            />
                            Primary
                          </label>
                          <button
                            onClick={() => removeCompilerLanguage(idx)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
