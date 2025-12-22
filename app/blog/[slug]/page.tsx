'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import DynamicSEO from '../../../components/DynamicSEO';

interface Category {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface Tag {
  name: string;
  slug: string;
  color: string;
}

interface Author {
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
}

interface Comment {
  _id: string;
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  createdAt: string;
  isEdited: boolean;
  replies?: Comment[];
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  readTime: number;
  views: number;
  likes: number;
  publishedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  comments?: Comment[];
}

interface RelatedArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: Category;
  readTime: number;
}

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/articles/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
        setRelatedArticles(data.relatedArticles || []);
      } else {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeArticle = async () => {
    if (!article) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/articles/${article._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArticle({ ...article, likes: data.likes });
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          article: article._id,
          content: commentText
        })
      });

      if (response.ok) {
        setCommentText('');
        fetchArticle(); // Refresh to get new comment
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <DynamicSEO
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        keywords={article.tags.map(t => t.name).join(', ')}
        ogImage={article.ogImage || article.featuredImage}
        ogType="article"
      />
      <Layout>
        {/* Article Header */}
        <article className="bg-white dark:bg-slate-900">
          <div className="container py-12">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-6 text-gray-600 dark:text-gray-400">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-blue-600">Blog</Link>
                <span>/</span>
                <Link href={`/blog?category=${article.category.slug}`} className="hover:text-blue-600">
                  {article.category.name}
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white">{article.title}</span>
              </nav>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: article.category.color + '20', color: article.category.color }}>
                  {article.category.icon} {article.category.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-3">
                  {article.author.avatar && (
                    <img src={article.author.avatar} alt={article.author.name} className="w-12 h-12 rounded-full" />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{article.author.name}</div>
                    <div className="text-sm">@{article.author.username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>•</span>
                  <span>{article.readTime} min read</span>
                  <span>•</span>
                  <span>{article.views} views</span>
                </div>
              </div>

              {/* Featured Image */}
              {article.featuredImage && (
                <div className="mb-12 rounded-2xl overflow-hidden">
                  <img src={article.featuredImage} alt={article.title} className="w-full h-auto" />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: article.content }} />

              {/* Tags */}
              <div className="mb-12">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/blog?tag=${tag.slug}`}
                      className="px-3 py-1 rounded-full text-sm hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Like & Share */}
              <div className="flex items-center gap-4 pb-12 border-b">
                <button
                  onClick={handleLikeArticle}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  ❤️ Like ({article.likes})
                </button>
                <button className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-semibold transition-colors">
                  🔗 Share
                </button>
              </div>

              {/* Author Bio */}
              {article.author.bio && (
                <div className="my-12 p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">About the Author</h3>
                  <div className="flex items-start gap-4">
                    {article.author.avatar && (
                      <img src={article.author.avatar} alt={article.author.name} className="w-16 h-16 rounded-full" />
                    )}
                    <div>
                      <div className="font-bold text-lg">{article.author.name}</div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">{article.author.bio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Comments ({article.comments?.length || 0})</h3>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 min-h-[100px]"
                    required
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {article.comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-4">
                      {comment.user.avatar && (
                        <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold">{comment.user.name}</span>
                              <span className="text-sm text-gray-500 ml-2">@{comment.user.username}</span>
                            </div>
                            <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                          {comment.isEdited && (
                            <span className="text-xs text-gray-500 italic">Edited</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                            ❤️ {comment.likes}
                          </button>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                            Reply
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-8 mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply._id} className="flex gap-3">
                                {reply.user.avatar && (
                                  <img src={reply.user.avatar} alt={reply.user.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                                )}
                                <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-sm">{reply.user.name}</span>
                                    <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 dark:bg-slate-800 py-16">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {relatedArticles.map((related) => (
                  <Link key={related._id} href={`/blog/${related.slug}`} className="group">
                    <div className="card overflow-hidden hover:shadow-xl transition-shadow h-full">
                      {related.featuredImage && (
                        <div className="h-40 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                          <img
                            src={related.featuredImage}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: related.category.color + '20', color: related.category.color }}>
                          {related.category.icon} {related.category.name}
                        </span>
                        <h3 className="font-bold mt-2 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{related.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </Layout>
    </>
  );
}
