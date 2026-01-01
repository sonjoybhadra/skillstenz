'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { aiToolsAPI, AITool } from '@/lib/api';
import { useSettings } from '@/lib/settings';
import { useAuth } from '@/lib/auth';

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

const pricingLabels: Record<string, { name: string; color: string }> = {
  'free': { name: 'Free', color: '#22C55E' },
  'freemium': { name: 'Freemium', color: '#3B82F6' },
  'paid': { name: 'Paid', color: '#F59E0B' },
  'enterprise': { name: 'Enterprise', color: '#8B5CF6' },
  'open-source': { name: 'Open Source', color: '#10B981' }
};

export default function AIToolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  
  const [tool, setTool] = useState<AITool | null>(null);
  const [relatedTools, setRelatedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'how-to-use' | 'features' | 'pricing'>('overview');
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [voteScore, setVoteScore] = useState({ upvotes: 0, downvotes: 0 });

  const fetchTool = async () => {
    setLoading(true);
    const { data, error } = await aiToolsAPI.getBySlug(slug);
    if (data && !error) {
      setTool(data.tool);
      setRelatedTools(data.relatedTools || []);
      setVoteScore({
        upvotes: data.tool.votes?.upvotes || 0,
        downvotes: data.tool.votes?.downvotes || 0
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (slug) {
      fetchTool();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleVote = async (vote: 'up' | 'down') => {
    if (!isAuthenticated || !tool) return;
    
    const { data, error } = await aiToolsAPI.vote(tool._id, vote);
    if (data && !error) {
      setVoteScore({ upvotes: data.upvotes, downvotes: data.downvotes });
      setUserVote(userVote === vote ? null : vote);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!tool) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tool Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The AI tool you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/ai-tools" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse All AI Tools
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{tool.metaTitle || `${tool.name} - AI Tool`} | {settings.siteName}</title>
        <meta name="description" content={tool.metaDescription || tool.shortDescription} />
        <meta name="keywords" content={tool.metaKeywords?.join(', ') || tool.tags?.join(', ')} />
        <meta property="og:title" content={`${tool.name} - AI Tool | ${settings.siteName}`} />
        <meta property="og:description" content={tool.shortDescription} />
        {tool.logo && <meta property="og:image" content={tool.logo} />}
      </Head>
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/ai-tools" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                AI Tools
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">{tool.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Tool Info */}
              <div className="flex-grow">
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden shadow-lg">
                    {tool.logo ? (
                      <Image src={tool.logo} alt={tool.name} width={72} height={72} className="object-contain" />
                    ) : (
                      <span className="text-5xl">{tool.icon || categoryInfo[tool.category]?.icon || '🤖'}</span>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tool.name}</h1>
                      {tool.featured && <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">⭐ Featured</span>}
                      {tool.trending && <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">🔥 Trending</span>}
                      {tool.isNew && <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">✨ New</span>}
                    </div>

                    {tool.tagline && (
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">{tool.tagline}</p>
                    )}

                    <p className="text-gray-700 dark:text-gray-300 mb-4">{tool.shortDescription}</p>

                    <div className="flex flex-wrap items-center gap-3">
                      <span 
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{ backgroundColor: `${categoryInfo[tool.category]?.color}20`, color: categoryInfo[tool.category]?.color }}
                      >
                        {categoryInfo[tool.category]?.icon} {categoryInfo[tool.category]?.name}
                      </span>
                      <span 
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{ backgroundColor: `${pricingLabels[tool.pricing.type]?.color}20`, color: pricingLabels[tool.pricing.type]?.color }}
                      >
                        {pricingLabels[tool.pricing.type]?.name}
                      </span>
                      {tool.apiAvailable && (
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                          🔌 API Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="flex-shrink-0 w-full lg:w-80">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  {/* Voting */}
                  <div className="flex items-center justify-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => handleVote('up')}
                      disabled={!isAuthenticated}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        userVote === 'up' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/50'
                      }`}
                      title={!isAuthenticated ? 'Login to vote' : 'Upvote'}
                    >
                      <span>👍</span>
                      <span>{voteScore.upvotes}</span>
                    </button>
                    <button
                      onClick={() => handleVote('down')}
                      disabled={!isAuthenticated}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        userVote === 'down' 
                          ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/50'
                      }`}
                      title={!isAuthenticated ? 'Login to vote' : 'Downvote'}
                    >
                      <span>👎</span>
                      <span>{voteScore.downvotes}</span>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  {tool.website && (
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3"
                    >
                      <span>🌐</span>
                      Visit Website
                    </a>
                  )}
                  
                  {tool.documentation && (
                    <a
                      href={tool.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mb-3"
                    >
                      <span>📚</span>
                      Documentation
                    </a>
                  )}

                  {tool.github && (
                    <a
                      href={tool.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span>💻</span>
                      GitHub
                    </a>
                  )}

                  {/* Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Views</span>
                      <span className="font-medium">{tool.views?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Company Section */}
        {tool.parentCompany?.name && (
          <div className="bg-gray-100 dark:bg-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Parent Company</h2>
                <div className="flex items-start gap-6">
                  {tool.parentCompany.logo && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      <Image src={tool.parentCompany.logo} alt={tool.parentCompany.name} width={48} height={48} className="object-contain" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{tool.parentCompany.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {tool.parentCompany.founded && <span>📅 Founded: {tool.parentCompany.founded}</span>}
                      {tool.parentCompany.headquarters && <span>📍 {tool.parentCompany.headquarters}</span>}
                    </div>
                    {tool.parentCompany.description && (
                      <p className="mt-3 text-gray-700 dark:text-gray-300">{tool.parentCompany.description}</p>
                    )}
                    {tool.parentCompany.website && (
                      <a href={tool.parentCompany.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-blue-600 dark:text-blue-400 hover:underline">
                        Visit Company Website →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex gap-8 -mb-px">
              {[
                { id: 'overview', label: 'Overview', icon: '📋' },
                { id: 'how-to-use', label: 'How to Use', icon: '🚀' },
                { id: 'features', label: 'Features', icon: '✨' },
                { id: 'pricing', label: 'Pricing', icon: '💰' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Purpose */}
                  {tool.purpose && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">🎯 Purpose</h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tool.purpose}</p>
                    </div>
                  )}

                  {/* Overview */}
                  {tool.overview && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">📖 Overview</h2>
                      <div 
                        className="prose prose-gray dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: tool.overview }}
                      />
                    </div>
                  )}

                  {/* Use Cases */}
                  {tool.useCases && tool.useCases.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">💡 Use Cases</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tool.useCases.map((useCase, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-2xl flex-shrink-0">{useCase.icon || '✨'}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{useCase.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{useCase.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pros & Cons */}
                  {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tool.pros && tool.pros.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">✅ Pros</h3>
                          <ul className="space-y-2">
                            {tool.pros.map((pro, index) => (
                              <li key={index} className="flex items-start gap-2 text-green-700 dark:text-green-400">
                                <span>•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {tool.cons && tool.cons.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4">❌ Cons</h3>
                          <ul className="space-y-2">
                            {tool.cons.map((con, index) => (
                              <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-400">
                                <span>•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* How to Use Tab */}
              {activeTab === 'how-to-use' && (
                <div className="space-y-8">
                  {/* Getting Started Steps */}
                  {tool.gettingStarted && tool.gettingStarted.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">🚀 Getting Started</h2>
                      <div className="space-y-6">
                        {tool.gettingStarted.map((step, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              {step.step || index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{step.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* How to Use (Rich Text) */}
                  {tool.howToUse && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">📝 Detailed Guide</h2>
                      <div 
                        className="prose prose-gray dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: tool.howToUse }}
                      />
                    </div>
                  )}

                  {!tool.gettingStarted?.length && !tool.howToUse && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                      <span className="text-4xl">📝</span>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">No usage guide available yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-8">
                  {tool.features && tool.features.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">✨ Key Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tool.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-2xl flex-shrink-0">{feature.icon || '⚡'}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                      <span className="text-4xl">✨</span>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">No features listed yet.</p>
                    </div>
                  )}

                  {/* Platforms & Integrations */}
                  {(tool.platforms?.length || tool.integrations?.length) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tool.platforms && tool.platforms.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">📱 Platforms</h3>
                          <div className="flex flex-wrap gap-2">
                            {tool.platforms.map((platform, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {tool.integrations && tool.integrations.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">🔗 Integrations</h3>
                          <div className="flex flex-wrap gap-2">
                            {tool.integrations.map((integration, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                                {integration}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">💰 Pricing</h2>
                    
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                      <span 
                        className="px-4 py-2 text-lg font-medium rounded-full"
                        style={{ backgroundColor: `${pricingLabels[tool.pricing.type]?.color}20`, color: pricingLabels[tool.pricing.type]?.color }}
                      >
                        {pricingLabels[tool.pricing.type]?.name}
                      </span>
                      {tool.pricing.hasFreeTier && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                          ✓ Free tier available
                        </span>
                      )}
                    </div>

                    {tool.pricing.startingPrice && (
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        Starting from: <span className="font-semibold">{tool.pricing.startingPrice}</span>
                      </p>
                    )}

                    {tool.pricing.plans && tool.pricing.plans.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tool.pricing.plans.map((plan, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h4>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{plan.price}</p>
                            <ul className="space-y-2">
                              {plan.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="text-green-500">✓</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {tool.pricing.pricingUrl && (
                      <a
                        href={tool.pricing.pricingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View full pricing details →
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Info</h3>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">
                      {categoryInfo[tool.category]?.icon} {categoryInfo[tool.category]?.name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Pricing</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">
                      {pricingLabels[tool.pricing.type]?.name}
                    </dd>
                  </div>
                  {tool.apiAvailable && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">API</dt>
                      <dd className="font-medium text-green-600 dark:text-green-400">Available</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/ai-tools?search=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {tool.alternatives && tool.alternatives.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Alternatives</h3>
                  <ul className="space-y-3">
                    {tool.alternatives.map((alt) => (
                      <li key={alt._id}>
                        <Link
                          href={`/ai-tools/${alt.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {alt.logo ? (
                            <Image src={alt.logo} alt={alt.name} width={32} height={32} className="rounded" />
                          ) : (
                            <span className="text-2xl">{alt.icon || '🤖'}</span>
                          )}
                          <span className="font-medium text-gray-900 dark:text-gray-100">{alt.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related AI Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.map((relatedTool) => (
                  <Link
                    key={relatedTool._id}
                    href={`/ai-tools/${relatedTool.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {relatedTool.logo ? (
                          <Image src={relatedTool.logo} alt={relatedTool.name} width={36} height={36} className="object-contain" />
                        ) : (
                          <span className="text-2xl">{relatedTool.icon || categoryInfo[relatedTool.category]?.icon || '🤖'}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {relatedTool.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {relatedTool.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </Layout>
    </>
  );
}
