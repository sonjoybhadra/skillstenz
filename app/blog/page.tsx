'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import DynamicSEO from '../../components/DynamicSEO';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface Tag {
  _id: string;
  name: string;
  slug: string;
  color: string;
}

interface Author {
  name: string;
  username: string;
  avatar?: string;
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  readTime: number;
  views: number;
  publishedAt: string;
  isFeatured: boolean;
}

// Default technical categories
const defaultCategories: Category[] = [
  { _id: 'ai-ml', name: 'AI & Machine Learning', slug: 'ai-ml', icon: '🤖', color: '#8B5CF6' },
  { _id: 'web-dev', name: 'Web Development', slug: 'web-dev', icon: '🌐', color: '#3B82F6' },
  { _id: 'cloud', name: 'Cloud & DevOps', slug: 'cloud-devops', icon: '☁️', color: '#06B6D4' },
  { _id: 'mobile', name: 'Mobile Development', slug: 'mobile', icon: '📱', color: '#10B981' },
  { _id: 'security', name: 'Cybersecurity', slug: 'security', icon: '🔒', color: '#EF4444' },
  { _id: 'data', name: 'Data Science', slug: 'data-science', icon: '📊', color: '#F59E0B' },
  { _id: 'backend', name: 'Backend & APIs', slug: 'backend', icon: '⚙️', color: '#6366F1' },
  { _id: 'career', name: 'Career & Growth', slug: 'career', icon: '🚀', color: '#EC4899' },
];

// Default tags
const defaultTags: Tag[] = [
  { _id: 'python', name: 'Python', slug: 'python', color: '#3776AB' },
  { _id: 'javascript', name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
  { _id: 'react', name: 'React', slug: 'react', color: '#61DAFB' },
  { _id: 'nextjs', name: 'Next.js', slug: 'nextjs', color: '#000000' },
  { _id: 'nodejs', name: 'Node.js', slug: 'nodejs', color: '#339933' },
  { _id: 'typescript', name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
  { _id: 'aws', name: 'AWS', slug: 'aws', color: '#FF9900' },
  { _id: 'docker', name: 'Docker', slug: 'docker', color: '#2496ED' },
  { _id: 'kubernetes', name: 'Kubernetes', slug: 'kubernetes', color: '#326CE5' },
  { _id: 'chatgpt', name: 'ChatGPT', slug: 'chatgpt', color: '#10A37F' },
  { _id: 'llm', name: 'LLM', slug: 'llm', color: '#8B5CF6' },
  { _id: 'mongodb', name: 'MongoDB', slug: 'mongodb', color: '#47A248' },
];

// Sample articles for demo
const sampleArticles: Article[] = [
  {
    _id: '1',
    title: 'Building AI-Powered Applications with OpenAI GPT-4 and LangChain',
    slug: 'building-ai-applications-openai-gpt4-langchain',
    excerpt: 'Learn how to integrate GPT-4 into your applications using LangChain for advanced AI capabilities, including RAG, agents, and memory systems.',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    author: { name: 'Alex Chen', username: 'alexchen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
    category: defaultCategories[0],
    tags: [defaultTags[0], defaultTags[9], defaultTags[10]],
    readTime: 12,
    views: 15420,
    publishedAt: '2024-12-20',
    isFeatured: true
  },
  {
    _id: '2',
    title: 'Next.js 15 Server Components: Complete Guide to Modern React',
    slug: 'nextjs-15-server-components-complete-guide',
    excerpt: 'Master Next.js 15 Server Components, understand the new rendering patterns, and build lightning-fast web applications.',
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    author: { name: 'Sarah Kim', username: 'sarahkim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
    category: defaultCategories[1],
    tags: [defaultTags[2], defaultTags[3], defaultTags[5]],
    readTime: 15,
    views: 12350,
    publishedAt: '2024-12-18',
    isFeatured: true
  },
  {
    _id: '3',
    title: 'Kubernetes for Developers: From Zero to Production',
    slug: 'kubernetes-developers-zero-to-production',
    excerpt: 'A hands-on guide to deploying and managing containerized applications with Kubernetes, including best practices for scaling.',
    featuredImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
    author: { name: 'Mike Johnson', username: 'mikej', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
    category: defaultCategories[2],
    tags: [defaultTags[7], defaultTags[8], defaultTags[6]],
    readTime: 18,
    views: 9870,
    publishedAt: '2024-12-15',
    isFeatured: true
  },
  {
    _id: '4',
    title: 'Building Real-Time APIs with Node.js and WebSockets',
    slug: 'real-time-apis-nodejs-websockets',
    excerpt: 'Create powerful real-time applications using Node.js, WebSockets, and Socket.io for live updates and collaborative features.',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    author: { name: 'Emma Davis', username: 'emmad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
    category: defaultCategories[6],
    tags: [defaultTags[4], defaultTags[1], defaultTags[5]],
    readTime: 10,
    views: 7650,
    publishedAt: '2024-12-12',
    isFeatured: false
  },
  {
    _id: '5',
    title: 'Python Data Analysis: Pandas, NumPy, and Visualization',
    slug: 'python-data-analysis-pandas-numpy',
    excerpt: 'Master data analysis with Python using Pandas and NumPy. Learn to clean, transform, and visualize data effectively.',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    author: { name: 'David Lee', username: 'davidlee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
    category: defaultCategories[5],
    tags: [defaultTags[0]],
    readTime: 14,
    views: 11200,
    publishedAt: '2024-12-10',
    isFeatured: false
  },
  {
    _id: '6',
    title: 'Securing Your APIs: Best Practices for 2024',
    slug: 'securing-apis-best-practices-2024',
    excerpt: 'Comprehensive guide to API security including authentication, rate limiting, input validation, and protecting against common attacks.',
    featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    author: { name: 'Lisa Wang', username: 'lisaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa' },
    category: defaultCategories[4],
    tags: [defaultTags[4], defaultTags[6]],
    readTime: 11,
    views: 8430,
    publishedAt: '2024-12-08',
    isFeatured: false
  },
  {
    _id: '7',
    title: 'React Native vs Flutter: Which to Choose in 2024',
    slug: 'react-native-vs-flutter-2024',
    excerpt: 'An in-depth comparison of React Native and Flutter for cross-platform mobile development, with pros, cons, and use cases.',
    featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    author: { name: 'James Wilson', username: 'jamesw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' },
    category: defaultCategories[3],
    tags: [defaultTags[2], defaultTags[1]],
    readTime: 9,
    views: 6780,
    publishedAt: '2024-12-05',
    isFeatured: false
  },
  {
    _id: '8',
    title: 'From Junior to Senior Developer: A Roadmap',
    slug: 'junior-to-senior-developer-roadmap',
    excerpt: 'Essential skills, mindset shifts, and strategies to accelerate your growth from junior to senior software developer.',
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    author: { name: 'Rachel Green', username: 'rachelg', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel' },
    category: defaultCategories[7],
    tags: [],
    readTime: 8,
    views: 14560,
    publishedAt: '2024-12-03',
    isFeatured: false
  },
  {
    _id: '9',
    title: 'MongoDB Aggregation Pipeline: Advanced Techniques',
    slug: 'mongodb-aggregation-pipeline-advanced',
    excerpt: 'Deep dive into MongoDB aggregation framework with complex queries, performance optimization, and real-world examples.',
    featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    author: { name: 'Tom Brown', username: 'tomb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom' },
    category: defaultCategories[6],
    tags: [defaultTags[11], defaultTags[4]],
    readTime: 13,
    views: 5420,
    publishedAt: '2024-12-01',
    isFeatured: false
  },
  {
    _id: '10',
    title: 'AWS Lambda Best Practices for Production',
    slug: 'aws-lambda-best-practices-production',
    excerpt: 'Optimize your serverless applications with AWS Lambda best practices for performance, security, and cost efficiency.',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    author: { name: 'Chris Taylor', username: 'christ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris' },
    category: defaultCategories[2],
    tags: [defaultTags[6], defaultTags[4]],
    readTime: 11,
    views: 7890,
    publishedAt: '2024-11-28',
    isFeatured: false
  },
];

export default function InsightsPage() {
  const [articles, setArticles] = useState<Article[]>(sampleArticles);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedCategory, selectedTag, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTag) params.append('tag', selectedTag);
      if (searchQuery) params.append('search', searchQuery);

      const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/articles?${params}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/categories`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/tags`)
      ]);

      if (articlesRes.ok) {
        const data = await articlesRes.json();
        setArticles(data.articles?.length ? data.articles : sampleArticles);
        setTotalPages(data.totalPages || 1);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data?.length ? data : defaultCategories);
      }

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        setTags(data?.length ? data : defaultTags);
      }
    } catch (error) {
      console.error('Error fetching insights data:', error);
      // Use sample data on error
      setArticles(sampleArticles);
      setCategories(defaultCategories);
      setTags(defaultTags);
    } finally {
      setLoading(false);
    }
  };

  // Filter articles based on selection
  const filteredArticles = articles.filter(article => {
    if (selectedCategory && article.category._id !== selectedCategory) return false;
    if (selectedTag && !article.tags.some(t => t._id === selectedTag)) return false;
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featuredArticles = filteredArticles.filter(a => a.isFeatured).slice(0, 3);
  const regularArticles = filteredArticles.filter(a => !a.isFeatured);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <DynamicSEO
        title="Tech Insights - Latest Articles & Tutorials | TechTooTalk"
        description="Stay updated with the latest insights, tutorials, and deep dives on AI, web development, cloud computing, and emerging technologies."
        keywords="tech insights, programming articles, AI tutorials, web development, cloud computing, software engineering"
      />
      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4">
                💡 Stay Ahead in Tech
              </span>
              <h1 className="text-5xl font-bold mb-4">Tech Insights</h1>
              <p className="text-xl text-white/90 mb-8">
                Deep dives, tutorials, and expert perspectives on AI, web development, cloud computing, and beyond
              </p>
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
                />
                <span className="absolute right-4 top-4 text-gray-400 text-xl">🔍</span>
              </div>
              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory 
                      ? 'bg-white text-purple-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  All Topics
                </button>
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat._id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                      selectedCategory === cat._id 
                        ? 'bg-white text-purple-600' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Categories */}
              <div className="card mb-6 p-5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📂</span> Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Articles
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedCategory === cat._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="card p-5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🏷️</span> Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => setSelectedTag(selectedTag === tag._id ? null : tag._id)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTag === tag._id
                          ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                          : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                      style={selectedTag !== tag._id ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="card mt-6 p-5 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <h3 className="text-lg font-bold mb-2">📬 Stay Updated</h3>
                <p className="text-sm text-white/90 mb-4">Get weekly insights delivered to your inbox</p>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 mb-3"
                />
                <button className="w-full py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {/* Featured Articles */}
                  {featuredArticles.length > 0 && currentPage === 1 && !selectedCategory && !selectedTag && !searchQuery && (
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>⭐</span> Featured Insights
                      </h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        {featuredArticles.map((article) => (
                          <Link key={article._id} href={`/blog/${article.slug}`} className="group">
                            <div className="card overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                              {article.featuredImage && (
                                <div className="h-48 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                                  <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full">
                                    ⭐ Featured
                                  </div>
                                </div>
                              )}
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: article.category.color + '20', color: article.category.color }}>
                                    {article.category.icon} {article.category.name}
                                  </span>
                                  <span className="text-xs text-gray-500">⏱️ {article.readTime} min</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                                  {article.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{article.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{formatDate(article.publishedAt)}</span>
                                  <span>👁️ {article.views.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Insights Header */}
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span>📚</span> {selectedCategory ? categories.find(c => c._id === selectedCategory)?.name : 'Latest Insights'}
                    {selectedTag && <span className="text-sm font-normal text-gray-500 ml-2">tagged with "{tags.find(t => t._id === selectedTag)?.name}"</span>}
                  </h2>

                  {/* Regular Articles */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {regularArticles.map((article) => (
                      <Link key={article._id} href={`/blog/${article.slug}`} className="group">
                        <div className="card overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                          {article.featuredImage && (
                            <div className="h-48 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                              <img
                                src={article.featuredImage}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: article.category.color + '20', color: article.category.color }}>
                                {article.category.icon} {article.category.name}
                              </span>
                              <span className="text-xs text-gray-500">⏱️ {article.readTime} min</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{article.excerpt}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span key={tag._id} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: tag.color + '15', color: tag.color }}>
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-slate-700">
                              <div className="flex items-center gap-2">
                                {article.author.avatar && (
                                  <img src={article.author.avatar} alt={article.author.name} className="w-6 h-6 rounded-full" />
                                )}
                                <span className="font-medium">{article.author.name}</span>
                              </div>
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-12">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        ← Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-purple-600 text-white'
                              : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  )}

                  {filteredArticles.length === 0 && !loading && (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-xl text-gray-500 mb-2">No insights found</p>
                      <p className="text-gray-400">Try adjusting your filters or search query</p>
                      <button 
                        onClick={() => { setSelectedCategory(null); setSelectedTag(null); setSearchQuery(''); }}
                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </Layout>
    </>
  );
}
