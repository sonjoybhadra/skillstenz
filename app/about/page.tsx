'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useSettings } from '@/lib/settings';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface CmsPageData {
  heroTitle?: string;
  heroSubtitle?: string;
  content?: string;
  sections?: Array<{
    title: string;
    content: string;
    order: number;
  }>;
}

export default function AboutPage() {
  const [cmsContent, setCmsContent] = useState<CmsPageData | null>(null);
  const { settings } = useSettings();
  const siteName = settings.siteName || 'SkillStenz';

  useEffect(() => {
    fetchCmsContent();
  }, []);

  const fetchCmsContent = async () => {
    try {
      const response = await fetch(`${API_URL}/cms/about`);
      if (response.ok) {
        const data = await response.json();
        if (data.page) {
          setCmsContent(data.page);
        }
      }
    } catch (err) {
      console.error('Failed to fetch CMS content:', err);
    }
  };

  const team = [
    { name: 'John Doe', role: 'Founder & CEO' },
    { name: 'Jane Smith', role: 'CTO' },
    { name: 'Mike Johnson', role: 'Lead Developer' },
    { name: 'Sarah Williams', role: 'Content Lead' },
  ];

  const stats = [
    { label: 'Active Learners', value: '100K+', icon: '👥' },
    { label: 'Courses', value: '500+', icon: '📚' },
    { label: 'Countries', value: '150+', icon: '🌍' },
    { label: 'Instructors', value: '50+', icon: '👨‍🏫' },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5">
            {cmsContent?.heroTitle || `About ${siteName}`}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {cmsContent?.heroSubtitle || "We're on a mission to make quality tech education accessible to everyone, everywhere."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CMS Sections or Fallback Mission */}
        {cmsContent?.sections && cmsContent.sections.length > 0 ? (
          <div className="space-y-8 mb-12">
            {cmsContent.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div key={index} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
                  <div 
                    className="text-gray-600 dark:text-gray-400 leading-relaxed prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {siteName} was founded with a simple belief: that education should be accessible to everyone. 
              We provide high-quality programming courses, tutorials, and resources to help learners 
              at all levels achieve their goals.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Whether you&apos;re just starting your coding journey or looking to advance your career, 
              we have the resources to help you succeed. Our platform offers interactive learning 
              experiences, hands-on projects, and a supportive community of learners.
            </p>
          </div>
        )}

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-600 rounded-xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Start Learning?</h2>
          <p className="text-blue-100 mb-6">Join thousands of learners who are already building their future with {siteName}.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/courses" 
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Courses
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
