'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RoadmapStep {
  title: string;
  topics: string[];
  duration: string;
  order?: number;
}

interface Roadmap {
  _id: string;
  slug: string;
  title: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
  difficulty: string;
  category: string;
  steps: RoadmapStep[];
}

// Fallback data for when API is not available
const fallbackRoadmaps: Record<string, Roadmap> = {
  'frontend': {
    _id: '1',
    slug: 'frontend',
    title: 'Frontend Developer Roadmap',
    name: 'Frontend Developer',
    description: 'Complete path to becoming a professional frontend developer',
    duration: '6 months',
    icon: '🎨',
    difficulty: 'beginner',
    category: 'frontend',
    steps: [
      { title: 'Internet & Web Basics', topics: ['How the Internet Works', 'HTTP/HTTPS', 'Browsers', 'DNS', 'Hosting'], duration: '1 week' },
      { title: 'HTML Fundamentals', topics: ['Semantic HTML', 'Forms', 'Accessibility', 'SEO Basics', 'Best Practices'], duration: '2 weeks' },
      { title: 'CSS Fundamentals', topics: ['Box Model', 'Flexbox', 'Grid', 'Responsive Design', 'Animations'], duration: '3 weeks' },
      { title: 'JavaScript Basics', topics: ['Variables', 'Data Types', 'Functions', 'DOM Manipulation', 'Events'], duration: '4 weeks' },
      { title: 'React Fundamentals', topics: ['Components', 'Props', 'State', 'Hooks', 'Context API'], duration: '4 weeks' },
    ]
  },
  'backend': {
    _id: '2',
    slug: 'backend',
    title: 'Backend Developer Roadmap',
    name: 'Backend Developer',
    description: 'Master server-side development and APIs',
    duration: '8 months',
    icon: '⚙️',
    difficulty: 'intermediate',
    category: 'backend',
    steps: [
      { title: 'Programming Language', topics: ['Node.js', 'Python', 'Java', 'Go'], duration: '4 weeks' },
      { title: 'Databases', topics: ['SQL', 'PostgreSQL', 'MongoDB', 'Redis'], duration: '4 weeks' },
      { title: 'APIs', topics: ['REST', 'GraphQL', 'Authentication'], duration: '3 weeks' },
      { title: 'Testing', topics: ['Unit Testing', 'Integration Testing', 'TDD'], duration: '2 weeks' },
    ]
  }
};

export default function RoadmapPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmap();
  }, [slug]);

  const fetchRoadmap = async () => {
    try {
      const response = await fetch(`${API_URL}/roadmaps/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setRoadmap(data.roadmap);
      } else if (fallbackRoadmaps[slug]) {
        setRoadmap(fallbackRoadmaps[slug]);
      } else {
        setError('Roadmap not found');
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
      if (fallbackRoadmaps[slug]) {
        setRoadmap(fallbackRoadmaps[slug]);
      } else {
        setError('Failed to load roadmap');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (error || !roadmap) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Roadmap Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The roadmap you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/roadmaps" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              Browse All Roadmaps
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/roadmaps" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Roadmaps</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white">{roadmap.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-4xl">{roadmap.icon || '📚'}</span>
            <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full">{roadmap.duration}</span>
            {roadmap.difficulty && (
              <span className={`px-3 py-1 text-sm rounded-full capitalize ${
                roadmap.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                roadmap.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {roadmap.difficulty}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{roadmap.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{roadmap.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Learning
          </button>
          <button className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* Progress Overview */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Progress</h2>
            <span className="text-sm text-gray-500">0 / {roadmap.steps.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>

        {/* Roadmap Steps */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" />

          <div className="space-y-8">
            {roadmap.steps.map((step, index) => (
              <div key={index} className="relative pl-16">
                {/* Step number */}
                <div className="absolute left-0 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">{step.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {step.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-purple-100 mb-6">Join thousands of developers learning with TechTooTalk</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Create Free Account
          </Link>
        </div>
      </div>
    </Layout>
  );
}
