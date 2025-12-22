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

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
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
        setArticles(data.articles);
        setTotalPages(data.totalPages);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data);
      }

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredArticles = articles.filter(a => a.isFeatured).slice(0, 3);
  const regularArticles = articles.filter(a => !a.isFeatured);

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
        title="Blog - Latest Articles & Tutorials | TechTooTalk"
        description="Stay updated with the latest articles, tutorials, and insights on AI, web development, programming, and technology trends."
        keywords="tech blog, programming articles, AI tutorials, web development blog"
      />
      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-4">Tech Blog</h1>
              <p className="text-xl text-blue-100 mb-8">
                Insights, tutorials, and stories about AI, web development, and programming
              </p>
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="absolute right-4 top-4 text-gray-400 text-xl">🔍</span>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Categories */}
              <div className="card mb-6">
                <h3 className="text-lg font-bold mb-4">Categories</h3>
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
              <div className="card">
                <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => setSelectedTag(tag._id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTag === tag._id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'
                      }`}
                      style={selectedTag !== tag._id ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
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
                      <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        {featuredArticles.map((article) => (
                          <Link key={article._id} href={`/blog/${article.slug}`} className="group">
                            <div className="card overflow-hidden hover:shadow-xl transition-shadow">
                              {article.featuredImage && (
                                <div className="h-48 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                                  <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded">
                                    Featured
                                  </div>
                                </div>
                              )}
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: article.category.color + '20', color: article.category.color }}>
                                    {article.category.icon} {article.category.name}
                                  </span>
                                  <span className="text-xs text-gray-500">{article.readTime} min read</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {article.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{article.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{formatDate(article.publishedAt)}</span>
                                  <span>{article.views} views</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular Articles */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {regularArticles.map((article) => (
                      <Link key={article._id} href={`/blog/${article.slug}`} className="group">
                        <div className="card overflow-hidden hover:shadow-xl transition-shadow h-full">
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
                              <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: article.category.color + '20', color: article.category.color }}>
                                {article.category.icon} {article.category.name}
                              </span>
                              <span className="text-xs text-gray-500">{article.readTime} min read</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{article.excerpt}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span key={tag._id} className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-slate-700">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                {article.author.avatar && (
                                  <img src={article.author.avatar} alt={article.author.name} className="w-6 h-6 rounded-full" />
                                )}
                                <span>{article.author.name}</span>
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
                        className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}

                  {articles.length === 0 && !loading && (
                    <div className="text-center py-20">
                      <p className="text-xl text-gray-500">No articles found</p>
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
