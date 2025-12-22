'use client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function CheatsheetsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const cheatsheets = [
    { slug: 'python', name: 'Python Cheatsheet', icon: '🐍', description: 'Quick reference for Python syntax, data types, and common patterns', downloads: 12500 },
    { slug: 'javascript', name: 'JavaScript Cheatsheet', icon: '🟨', description: 'Essential JavaScript concepts, ES6+ features, and DOM manipulation', downloads: 11200 },
    { slug: 'html', name: 'HTML Cheatsheet', icon: '📄', description: 'Complete HTML5 tags reference with semantic elements', downloads: 9800 },
    { slug: 'css', name: 'CSS Cheatsheet', icon: '🎨', description: 'CSS properties, flexbox, grid, and responsive design patterns', downloads: 8900 },
    { slug: 'react', name: 'React Cheatsheet', icon: '⚛️', description: 'React hooks, components, state management, and best practices', downloads: 7600 },
    { slug: 'git', name: 'Git Cheatsheet', icon: '📦', description: 'Git commands, branching, merging, and workflow patterns', downloads: 10300 },
    { slug: 'sql', name: 'SQL Cheatsheet', icon: '🗃️', description: 'SQL queries, joins, aggregations, and database design', downloads: 8400 },
    { slug: 'java', name: 'Java Cheatsheet', icon: '☕', description: 'Java syntax, OOP concepts, collections, and streams', downloads: 7200 },
    { slug: 'cpp', name: 'C++ Cheatsheet', icon: '⚡', description: 'C++ syntax, STL, pointers, and memory management', downloads: 6800 },
    { slug: 'typescript', name: 'TypeScript Cheatsheet', icon: '🔷', description: 'TypeScript types, interfaces, generics, and decorators', downloads: 5900 },
    { slug: 'ml', name: 'Machine Learning Cheatsheet', icon: '🧠', description: 'ML algorithms, sklearn, neural networks, and evaluation metrics', downloads: 5400 },
    { slug: 'docker', name: 'Docker Cheatsheet', icon: '🐳', description: 'Docker commands, Dockerfile, compose, and networking', downloads: 4800 },
  ];

  const filteredSheets = cheatsheets.filter(sheet =>
    sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cheatsheets <span className="text-blue-400">Library</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Quick reference guides for all your programming needs. Download and keep them handy!
          </p>
          
          <div className="max-w-md mx-auto relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search cheatsheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Cheatsheets Grid */}
      <section className="py-12 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredSheets.length} Cheatsheets Available
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSheets.map((sheet) => (
              <Link 
                key={sheet.slug} 
                href={`/cheatsheets/${sheet.slug}`} 
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-24 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-5xl">
                  {sheet.icon}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {sheet.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {sheet.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      📥 {sheet.downloads.toLocaleString()}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
