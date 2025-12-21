'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface Bookmark {
  _id: string;
  itemType: 'course' | 'topic' | 'article' | 'mcq';
  itemId: {
    _id: string;
    title?: string;
    name?: string;
    slug?: string;
    description?: string;
    technology?: string;
  };
  notes?: string;
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'course' | 'topic' | 'article' | 'mcq'>('all');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?redirect=/bookmarks');
      return;
    }
    fetchBookmarks();
  }, [router]);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/bookmarks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBookmarks(data.bookmarks || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/bookmarks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setBookmarks(bookmarks.filter(b => b._id !== id));
      }
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  const filteredBookmarks = activeTab === 'all' 
    ? bookmarks 
    : bookmarks.filter(b => b.itemType === activeTab);

  const getItemLink = (bookmark: Bookmark) => {
    const item = bookmark.itemId;
    switch (bookmark.itemType) {
      case 'course':
        return item.technology ? `/${item.technology}/${item.slug}` : '#';
      case 'topic':
        return item.technology ? `/${item.technology}/${item.slug}` : '#';
      case 'article':
        return `/articles/${item.slug}`;
      case 'mcq':
        return `/mcq/${item._id}`;
      default:
        return '#';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'topic': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'article': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mcq': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">My Bookmarks</h1>
          <p className="text-[var(--muted-foreground)]">
            Save courses, topics, and articles for quick access later.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(['all', 'course', 'topic', 'article', 'mcq'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}s
              {tab === 'all' ? '' : ` (${bookmarks.filter(b => b.itemType === tab).length})`}
            </button>
          ))}
        </div>

        {/* Bookmarks List */}
        {filteredBookmarks.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">📑</div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              No bookmarks yet
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Start exploring courses and save items you want to revisit later.
            </p>
            <Link href="/" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="card flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(bookmark.itemType)}`}>
                      {bookmark.itemType}
                    </span>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {new Date(bookmark.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link 
                    href={getItemLink(bookmark)}
                    className="text-lg font-semibold text-[var(--foreground)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {bookmark.itemId?.title || bookmark.itemId?.name || 'Untitled'}
                  </Link>
                  {bookmark.itemId?.description && (
                    <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
                      {bookmark.itemId.description}
                    </p>
                  )}
                  {bookmark.notes && (
                    <p className="text-sm text-[var(--color-primary)] mt-2 italic">
                      Note: {bookmark.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={getItemLink(bookmark)}
                    className="btn-primary"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => removeBookmark(bookmark._id)}
                    className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {bookmarks.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--color-primary)]">{bookmarks.length}</div>
              <div className="text-sm text-[var(--muted-foreground)]">Total Bookmarks</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-500">{bookmarks.filter(b => b.itemType === 'course').length}</div>
              <div className="text-sm text-[var(--muted-foreground)]">Courses</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-500">{bookmarks.filter(b => b.itemType === 'topic').length}</div>
              <div className="text-sm text-[var(--muted-foreground)]">Topics</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-500">{bookmarks.filter(b => b.itemType === 'article').length}</div>
              <div className="text-sm text-[var(--muted-foreground)]">Articles</div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
