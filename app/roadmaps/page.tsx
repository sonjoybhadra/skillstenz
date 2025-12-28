'use client';

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Roadmap {
  _id: string;
  slug: string;
  name: string;
  title: string;
  icon: string;
  category: string;
  duration: string;
  description: string;
  difficulty: string;
  steps?: { title: string }[];
  isFeatured: boolean;
}

// Fallback data in case API is not ready
const fallbackRoadmaps = [
  { slug: 'frontend', name: 'Frontend Developer', icon: '🎨', category: 'frontend', duration: '6 months', description: 'Master HTML, CSS, JavaScript, React, and modern frontend tools', difficulty: 'beginner', steps: Array(12).fill({}) },
  { slug: 'backend', name: 'Backend Developer', icon: '⚙️', category: 'backend', duration: '8 months', description: 'Learn Node.js, databases, APIs, and server architecture', difficulty: 'intermediate', steps: Array(14).fill({}) },
  { slug: 'fullstack', name: 'Full Stack Developer', icon: '🚀', category: 'other', duration: '12 months', description: 'Comprehensive path covering both frontend and backend technologies', difficulty: 'advanced', steps: Array(20).fill({}) },
  { slug: 'devops', name: 'DevOps Engineer', icon: '🔧', category: 'devops', duration: '8 months', description: 'CI/CD, Docker, Kubernetes, and cloud infrastructure', difficulty: 'advanced', steps: Array(15).fill({}) },
];

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Roadmaps' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'devops', name: 'DevOps' },
    { id: 'data', name: 'Data' },
    { id: 'other', name: 'Other' },
  ];

  useEffect(() => {
    fetchRoadmaps();
  }, [selectedCategory]);

  const fetchRoadmaps = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`${API_URL}/roadmaps?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRoadmaps(data.roadmaps || []);
      } else {
        setRoadmaps(fallbackRoadmaps as unknown as Roadmap[]);
      }
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error);
      setRoadmaps(fallbackRoadmaps as unknown as Roadmap[]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Learning <span className="text-purple-200">Roadmaps</span>
          </h1>
          <p className="text-lg text-purple-100 mb-8 max-w-xl mx-auto">
            Step-by-step guides to master your chosen technology stack
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center gap-2 py-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmaps Grid */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? 'Loading...' : `${filteredRoadmaps.length} Roadmaps Available`}
            </h2>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-28 bg-gray-200 dark:bg-slate-700"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoadmaps.map((roadmap) => (
                <Link 
                  key={roadmap._id || roadmap.slug} 
                  href={`/roadmaps/${roadmap.slug}`} 
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-28 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-5xl">
                    {roadmap.icon || '📚'}
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded">
                        {roadmap.steps?.length || 0} Steps
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded">
                        {roadmap.duration}
                      </span>
                      {roadmap.difficulty && (
                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${getDifficultyColor(roadmap.difficulty)}`}>
                          {roadmap.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
                      {roadmap.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {roadmap.description}
                    </p>
                    <span className="text-purple-500 text-sm font-medium">
                      Start Learning →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredRoadmaps.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No roadmaps found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
