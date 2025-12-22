'use client';

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function RoadmapsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Roadmaps' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'devops', name: 'DevOps' },
  ];

  const roadmaps = [
    { slug: 'frontend', name: 'Frontend Developer', icon: '🎨', category: 'frontend', steps: 12, duration: '6 months', description: 'Master HTML, CSS, JavaScript, React, and modern frontend tools' },
    { slug: 'backend', name: 'Backend Developer', icon: '⚙️', category: 'backend', steps: 14, duration: '8 months', description: 'Learn Node.js, databases, APIs, and server architecture' },
    { slug: 'fullstack', name: 'Full Stack Developer', icon: '🚀', category: 'fullstack', steps: 20, duration: '12 months', description: 'Comprehensive path covering both frontend and backend technologies' },
    { slug: 'react', name: 'React Developer', icon: '⚛️', category: 'frontend', steps: 10, duration: '4 months', description: 'Deep dive into React ecosystem, Redux, and Next.js' },
    { slug: 'nodejs', name: 'Node.js Developer', icon: '🟢', category: 'backend', steps: 11, duration: '5 months', description: 'Master Node.js, Express, and backend JavaScript' },
    { slug: 'python', name: 'Python Developer', icon: '🐍', category: 'backend', steps: 13, duration: '6 months', description: 'Python programming, Django/Flask, and data processing' },
    { slug: 'android', name: 'Android Developer', icon: '🤖', category: 'mobile', steps: 12, duration: '6 months', description: 'Kotlin, Android SDK, and mobile app development' },
    { slug: 'ios', name: 'iOS Developer', icon: '🍎', category: 'mobile', steps: 11, duration: '6 months', description: 'Swift, UIKit, SwiftUI, and Apple ecosystem' },
    { slug: 'devops', name: 'DevOps Engineer', icon: '🔧', category: 'devops', steps: 15, duration: '8 months', description: 'CI/CD, Docker, Kubernetes, and cloud infrastructure' },
    { slug: 'javascript', name: 'JavaScript Developer', icon: '🟨', category: 'frontend', steps: 10, duration: '4 months', description: 'Complete JavaScript from basics to advanced concepts' },
    { slug: 'typescript', name: 'TypeScript Developer', icon: '🔷', category: 'frontend', steps: 8, duration: '3 months', description: 'Type-safe JavaScript development with TypeScript' },
    { slug: 'java', name: 'Java Developer', icon: '☕', category: 'backend', steps: 14, duration: '7 months', description: 'Java programming, Spring Boot, and enterprise development' },
  ];

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || roadmap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              {filteredRoadmaps.length} Roadmaps Available
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <Link 
                key={roadmap.slug} 
                href={`/roadmaps/${roadmap.slug}`} 
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-28 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-5xl">
                  {roadmap.icon}
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded">
                      {roadmap.steps} Steps
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded">
                      {roadmap.duration}
                    </span>
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
        </div>
      </section>
    </Layout>
  );
}
