'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { aiToolsAPI, AITool } from '@/lib/api';

const categories = [
  { value: 'chatbots', label: 'Chatbots & Assistants', icon: '💬' },
  { value: 'image-generation', label: 'Image Generation', icon: '🎨' },
  { value: 'video-generation', label: 'Video Generation', icon: '🎬' },
  { value: 'audio-generation', label: 'Audio & Music', icon: '🎵' },
  { value: 'writing-assistant', label: 'Writing & Content', icon: '✍️' },
  { value: 'code-assistant', label: 'Code & Development', icon: '💻' },
  { value: 'data-analysis', label: 'Data & Analytics', icon: '📊' },
  { value: 'automation', label: 'Automation', icon: '⚡' },
  { value: 'research', label: 'Research & Knowledge', icon: '🔬' },
  { value: 'design', label: 'Design & Creative', icon: '🎯' },
  { value: 'marketing', label: 'Marketing & Sales', icon: '📈' },
  { value: 'productivity', label: 'Productivity', icon: '⏱️' },
  { value: 'education', label: 'Education & Learning', icon: '📚' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'other', label: 'Other Tools', icon: '🔧' }
];

const pricingTypes = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'open-source', label: 'Open Source' }
];

type FormData = {
  name: string;
  slug: string;
  logo: string;
  icon: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  parentCompany: {
    name: string;
    logo: string;
    website: string;
    founded: string;
    headquarters: string;
    description: string;
  };
  howToUse: string;
  gettingStarted: { step: number; title: string; description: string }[];
  purpose: string;
  useCases: string[];
  features: string[];
  pricing: {
    type: string;
    startingPrice: string;
    hasFreeTier: boolean;
    pricingUrl: string;
    plans: { name: string; price: string; features: string[] }[];
  };
  category: string;
  tags: string[];
  apiAvailable: boolean;
  apiDocumentation: string;
  platforms: string[];
  integrations: string[];
  website: string;
  documentation: string;
  github: string;
  twitter: string;
  pros: string[];
  cons: string[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  isPublished: boolean;
  featured: boolean;
  trending: boolean;
  isNew: boolean;
};

const initialFormData: FormData = {
  name: '',
  slug: '',
  logo: '',
  icon: '',
  tagline: '',
  shortDescription: '',
  overview: '',
  parentCompany: {
    name: '',
    logo: '',
    website: '',
    founded: '',
    headquarters: '',
    description: ''
  },
  howToUse: '',
  gettingStarted: [{ step: 1, title: '', description: '' }],
  purpose: '',
  useCases: [''],
  features: [''],
  pricing: {
    type: 'freemium',
    startingPrice: '',
    hasFreeTier: true,
    pricingUrl: '',
    plans: []
  },
  category: 'chatbots',
  tags: [],
  apiAvailable: false,
  apiDocumentation: '',
  platforms: [],
  integrations: [],
  website: '',
  documentation: '',
  github: '',
  twitter: '',
  pros: [''],
  cons: [''],
  metaTitle: '',
  metaDescription: '',
  metaKeywords: [],
  isPublished: false,
  featured: false,
  trending: false,
  isNew: true
};

export default function NewAIToolPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'company' | 'pricing' | 'seo' | 'settings'>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [platformInput, setPlatformInput] = useState('');
  const [integrationInput, setIntegrationInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Clean up empty arrays
    const cleanedData = {
      ...formData,
      useCases: formData.useCases.filter(uc => uc.trim()),
      features: formData.features.filter(f => f.trim()),
      pros: formData.pros.filter(p => p.trim()),
      cons: formData.cons.filter(c => c.trim()),
      gettingStarted: formData.gettingStarted.filter(gs => gs.title.trim() || gs.description.trim())
    };

    const { error: apiError } = await aiToolsAPI.create(cleanedData as Partial<AITool>);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return;
    }

    router.push('/admin/ai-tools');
  };

  const addArrayItem = (field: 'useCases' | 'features' | 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field: 'useCases' | 'features' | 'pros' | 'cons', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: 'useCases' | 'features' | 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addGettingStartedStep = () => {
    setFormData(prev => ({
      ...prev,
      gettingStarted: [
        ...prev.gettingStarted,
        { step: prev.gettingStarted.length + 1, title: '', description: '' }
      ]
    }));
  };

  const updateGettingStartedStep = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      gettingStarted: prev.gettingStarted.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const removeGettingStartedStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gettingStarted: prev.gettingStarted.filter((_, i) => i !== index).map((step, i) => ({ ...step, step: i + 1 }))
    }));
  };

  const addTag = (type: 'tags' | 'platforms' | 'integrations' | 'metaKeywords', value: string, setValue: (v: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !formData[type].includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], trimmed]
      }));
    }
    setValue('');
  };

  const removeTag = (type: 'tags' | 'platforms' | 'integrations' | 'metaKeywords', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/ai-tools" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New AI Tool</h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.name}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save AI Tool'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'basic', label: 'Basic Info', icon: '📋' },
            { id: 'content', label: 'Content', icon: '📝' },
            { id: 'company', label: 'Parent Company', icon: '🏢' },
            { id: 'pricing', label: 'Pricing', icon: '💰' },
            { id: 'seo', label: 'SEO', icon: '🔍' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        name: e.target.value,
                        slug: generateSlug(e.target.value)
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🤖"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="A catchy tagline for the tool"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  rows={3}
                  placeholder="Brief description of the AI tool (shown in listings)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                      {tag}
                      <button type="button" onClick={() => removeTag('tags', index)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag('tags', tagInput, setTagInput); } }}
                    placeholder="Add tag and press Enter"
                    className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button type="button" onClick={() => addTag('tags', tagInput, setTagInput)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    Add
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Documentation URL
                  </label>
                  <input
                    type="url"
                    value={formData.documentation}
                    onChange={(e) => setFormData(prev => ({ ...prev, documentation: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* API & Platforms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="apiAvailable"
                      checked={formData.apiAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, apiAvailable: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="apiAvailable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      API Available
                    </label>
                  </div>
                  {formData.apiAvailable && (
                    <input
                      type="url"
                      value={formData.apiDocumentation}
                      onChange={(e) => setFormData(prev => ({ ...prev, apiDocumentation: e.target.value }))}
                      placeholder="API Documentation URL"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  )}
                </div>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.platforms.map((platform, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm flex items-center gap-2">
                      {platform}
                      <button type="button" onClick={() => removeTag('platforms', index)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={platformInput}
                    onChange={(e) => setPlatformInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag('platforms', platformInput, setPlatformInput); } }}
                    placeholder="Web, iOS, Android, macOS, Windows, Linux..."
                    className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button type="button" onClick={() => addTag('platforms', platformInput, setPlatformInput)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">Add</button>
                </div>
              </div>

              {/* Integrations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Integrations
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.integrations.map((integration, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-2">
                      {integration}
                      <button type="button" onClick={() => removeTag('integrations', index)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={integrationInput}
                    onChange={(e) => setIntegrationInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag('integrations', integrationInput, setIntegrationInput); } }}
                    placeholder="Slack, Discord, Zapier, VS Code..."
                    className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button type="button" onClick={() => addTag('integrations', integrationInput, setIntegrationInput)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">Add</button>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Content
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  rows={4}
                  placeholder="What is the main purpose of this AI tool?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Overview (HTML supported)
                </label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                  rows={8}
                  placeholder="Detailed overview of the AI tool..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How to Use (HTML supported)
                </label>
                <textarea
                  value={formData.howToUse}
                  onChange={(e) => setFormData(prev => ({ ...prev, howToUse: e.target.value }))}
                  rows={8}
                  placeholder="Detailed guide on how to use the tool..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
              </div>

              {/* Getting Started Steps */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Getting Started Steps
                  </label>
                  <button type="button" onClick={addGettingStartedStep} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    + Add Step
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.gettingStarted.map((step, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-grow space-y-2">
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateGettingStartedStep(index, 'title', e.target.value)}
                          placeholder="Step title"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                        />
                        <textarea
                          value={step.description}
                          onChange={(e) => updateGettingStartedStep(index, 'description', e.target.value)}
                          placeholder="Step description"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <button type="button" onClick={() => removeGettingStartedStep(index)} className="text-red-500 hover:text-red-700">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Use Cases</label>
                  <button type="button" onClick={() => addArrayItem('useCases')} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">+ Add</button>
                </div>
                <div className="space-y-2">
                  {formData.useCases.map((useCase, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={useCase}
                        onChange={(e) => updateArrayItem('useCases', index, e.target.value)}
                        placeholder="Use case..."
                        className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button type="button" onClick={() => removeArrayItem('useCases', index)} className="px-3 py-2 text-red-500 hover:text-red-700">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
                  <button type="button" onClick={() => addArrayItem('features')} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">+ Add</button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateArrayItem('features', index, e.target.value)}
                        placeholder="Feature..."
                        className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button type="button" onClick={() => removeArrayItem('features', index)} className="px-3 py-2 text-red-500 hover:text-red-700">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pros ✅</label>
                  <button type="button" onClick={() => addArrayItem('pros')} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">+ Add</button>
                </div>
                <div className="space-y-2">
                  {formData.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => updateArrayItem('pros', index, e.target.value)}
                        placeholder="Pro..."
                        className="flex-grow px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button type="button" onClick={() => removeArrayItem('pros', index)} className="px-3 py-2 text-red-500 hover:text-red-700">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cons ❌</label>
                  <button type="button" onClick={() => addArrayItem('cons')} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">+ Add</button>
                </div>
                <div className="space-y-2">
                  {formData.cons.map((con, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => updateArrayItem('cons', index, e.target.value)}
                        placeholder="Con..."
                        className="flex-grow px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button type="button" onClick={() => removeArrayItem('cons', index)} className="px-3 py-2 text-red-500 hover:text-red-700">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Parent Company Tab */}
          {activeTab === 'company' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Parent Company Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.parentCompany.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentCompany: { ...prev.parentCompany, name: e.target.value } }))}
                    placeholder="OpenAI, Google, Microsoft..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Logo URL</label>
                  <input
                    type="url"
                    value={formData.parentCompany.logo}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentCompany: { ...prev.parentCompany, logo: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Website</label>
                  <input
                    type="url"
                    value={formData.parentCompany.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentCompany: { ...prev.parentCompany, website: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Founded Year</label>
                  <input
                    type="text"
                    value={formData.parentCompany.founded}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentCompany: { ...prev.parentCompany, founded: e.target.value } }))}
                    placeholder="2015"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headquarters</label>
                  <input
                    type="text"
                    value={formData.parentCompany.headquarters}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentCompany: { ...prev.parentCompany, headquarters: e.target.value } }))}
                    placeholder="San Francisco, CA, USA"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Description</label>
                  <textarea
                    value={formData.parentCompany.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentCompany: { ...prev.parentCompany, description: e.target.value } }))}
                    rows={4}
                    placeholder="Brief description of the parent company..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Pricing Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricing Type *</label>
                  <select
                    value={formData.pricing.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricing: { ...prev.pricing, type: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    {pricingTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Starting Price</label>
                  <input
                    type="text"
                    value={formData.pricing.startingPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricing: { ...prev.pricing, startingPrice: e.target.value } }))}
                    placeholder="$20/month"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricing Page URL</label>
                  <input
                    type="url"
                    value={formData.pricing.pricingUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricing: { ...prev.pricing, pricingUrl: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hasFreeTier"
                    checked={formData.pricing.hasFreeTier}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricing: { ...prev.pricing, hasFreeTier: e.target.checked } }))}
                    className="rounded"
                  />
                  <label htmlFor="hasFreeTier" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Has Free Tier
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                SEO Settings
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Custom title for search engines"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">{formData.metaTitle.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  placeholder="Description for search engines"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">{formData.metaDescription.length}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meta Keywords</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.metaKeywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center gap-2">
                      {keyword}
                      <button type="button" onClick={() => removeTag('metaKeywords', index)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag('metaKeywords', keywordInput, setKeywordInput); } }}
                    placeholder="Add keyword and press Enter"
                    className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button type="button" onClick={() => addTag('metaKeywords', keywordInput, setKeywordInput)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">Add</button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                Publication Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Published (visible to public)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ⭐ Featured (show in featured section)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="trending"
                    checked={formData.trending}
                    onChange={(e) => setFormData(prev => ({ ...prev, trending: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="trending" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🔥 Trending (show in trending section)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="isNew" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ✨ New (show new badge)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/ai-tools" className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.shortDescription}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create AI Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
