'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSettings } from '../lib/settings';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface SearchResult {
  type: 'technology' | 'course' | 'topic' | 'tutorial' | 'tool';
  id: string;
  title: string;
  description?: string;
  slug?: string;
  icon?: string;
  url: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        const localResults: SearchResult[] = [];
        const technologies = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'SQL'];
        technologies.forEach(tech => {
          if (tech.toLowerCase().includes(searchQuery.toLowerCase())) {
            localResults.push({ type: 'technology', id: tech.toLowerCase(), title: tech, description: `Learn ${tech} from scratch`, url: `/technologies/${tech.toLowerCase()}` });
          }
        });
        const courses = [
          { title: 'Complete Web Development', slug: 'web-development' },
          { title: 'React Masterclass', slug: 'react-masterclass' },
          { title: 'Python for Beginners', slug: 'python-beginners' },
          { title: 'Full Stack JavaScript', slug: 'fullstack-js' }
        ];
        courses.forEach(course => {
          if (course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            localResults.push({ type: 'course', id: course.slug, title: course.title, url: `/courses/${course.slug}` });
          }
        });
        setResults(localResults);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    router.push(result.url);
    onClose();
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = { technology: '💻', course: '📚', topic: '📖', tutorial: '📝', tool: '🔧' };
    return icons[type] || '📄';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { technology: 'Technology', course: 'Course', topic: 'Topic', tutorial: 'Tutorial', tool: 'Tool' };
    return labels[type] || 'Result';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-slate-800">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tutorials, courses, technologies..."
            className="flex-1 text-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-slate-800 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-gray-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 dark:text-gray-400 mt-3">Searching...</p>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-600 dark:text-gray-300">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xl">{result.icon || getTypeIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{result.title}</p>
                    {result.description && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{result.description}</p>}
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 rounded">{getTypeLabel(result.type)}</span>
                </button>
              ))}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Searches</p>
                    <button onClick={() => { localStorage.removeItem('recentSearches'); setRecentSearches([]); }} className="text-xs text-blue-500 hover:underline">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, i) => (
                      <button key={i} onClick={() => setQuery(search)} className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">{search}</button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Technologies', icon: '💻', url: '/technologies' },
                    { label: 'Courses', icon: '📚', url: '/courses' },
                    { label: 'Tutorials', icon: '📝', url: '/tutorials' },
                    { label: 'Roadmaps', icon: '🗺️', url: '/roadmaps' },
                    { label: 'Tools', icon: '🔧', url: '/tools' },
                    { label: 'Compiler', icon: '⚡', url: '/compiler' }
                  ].map((link) => (
                    <Link key={link.url} href={link.url} onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                      <span className="text-xl">{link.icon}</span>
                      <span className="text-gray-900 dark:text-white">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-800 rounded">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-800 rounded">↵</kbd> Select</span>
          </div>
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}

function PoweredBy() {
  const { settings } = useSettings();
  return <span>Powered by {settings.siteName || 'SkillStenz'}</span>;
}
