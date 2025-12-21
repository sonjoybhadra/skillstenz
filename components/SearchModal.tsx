'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      if (e.key === 'Escape') {
        onClose();
      }
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
        // Fallback to local search
        const localResults: SearchResult[] = [];
        
        // Sample technologies
        const technologies = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'SQL'];
        technologies.forEach(tech => {
          if (tech.toLowerCase().includes(searchQuery.toLowerCase())) {
            localResults.push({
              type: 'technology',
              id: tech.toLowerCase(),
              title: tech,
              description: `Learn ${tech} from scratch`,
              url: `/technologies/${tech.toLowerCase()}`
            });
          }
        });

        // Sample courses
        const courses = [
          { title: 'Complete Web Development', slug: 'web-development' },
          { title: 'React Masterclass', slug: 'react-masterclass' },
          { title: 'Python for Beginners', slug: 'python-beginners' },
          { title: 'Full Stack JavaScript', slug: 'fullstack-js' }
        ];
        courses.forEach(course => {
          if (course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            localResults.push({
              type: 'course',
              id: course.slug,
              title: course.title,
              url: `/courses/${course.slug}`
            });
          }
        });

        setResults(localResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    router.push(result.url);
    onClose();
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technology': return '💻';
      case 'course': return '📚';
      case 'topic': return '📖';
      case 'tutorial': return '📝';
      case 'tool': return '🔧';
      default: return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'technology': return 'Technology';
      case 'course': return 'Course';
      case 'topic': return 'Topic';
      case 'tutorial': return 'Tutorial';
      case 'tool': return 'Tool';
      default: return 'Result';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-[var(--bg-primary)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-4 p-4 border-b border-[var(--border-primary)]">
          <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tutorials, courses, technologies..."
            className="flex-1 text-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--border-primary)] border-t-[var(--bg-accent)] mx-auto"></div>
              <p className="text-[var(--text-muted)] mt-3">Searching...</p>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-[var(--text-secondary)]">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Try different keywords</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-xl">
                    {result.icon || getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{result.title}</p>
                    {result.description && (
                      <p className="text-sm text-[var(--text-muted)] truncate">{result.description}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded">
                    {getTypeLabel(result.type)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-[var(--text-muted)]">Recent Searches</p>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-[var(--text-accent)] hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecentSearch(search)}
                        className="px-3 py-1.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full text-sm hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-[var(--text-muted)] mb-3">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Technologies', icon: '💻', url: '/technologies' },
                    { label: 'Courses', icon: '📚', url: '/courses' },
                    { label: 'Tutorials', icon: '📝', url: '/tutorials' },
                    { label: 'Roadmaps', icon: '🗺️', url: '/roadmaps' },
                    { label: 'Tools', icon: '🔧', url: '/tools' },
                    { label: 'Compiler', icon: '⚡', url: '/compiler' }
                  ].map((link) => (
                    <Link
                      key={link.url}
                      href={link.url}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span className="text-[var(--text-primary)]">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded">↵</kbd> Select
            </span>
          </div>
          <span>Powered by TechTooTalk</span>
        </div>
      </div>
    </div>
  );
}
