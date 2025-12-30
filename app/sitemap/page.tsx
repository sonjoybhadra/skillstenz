'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import { useSettings } from '@/lib/settings';

export default function SitemapPage() {
  const { settings } = useSettings();
  const siteName = settings.siteName || 'SkillStenz';
  
  const siteStructure = [
    {
      category: 'Main Pages',
      pages: [
        { path: '/', name: 'Home', description: `${siteName} homepage` },
        { path: '/about', name: 'About Us', description: `Learn about ${siteName}` },
        { path: '/contact', name: 'Contact', description: 'Get in touch with us' },
        { path: '/careers', name: 'Careers', description: 'Join our team' },
        { path: '/faq', name: 'FAQ', description: 'Frequently asked questions' },
      ]
    },
    {
      category: 'Learning Resources',
      pages: [
        { path: '/courses', name: 'Courses', description: 'Browse all courses' },
        { path: '/tutorials', name: 'Tutorials', description: 'Step-by-step guides' },
        { path: '/cheatsheets', name: 'Cheatsheets', description: 'Quick reference guides' },
        { path: '/roadmaps', name: 'Roadmaps', description: 'Learning paths' },
        { path: '/technologies', name: 'Technologies', description: 'Browse by technology' },
        { path: '/certifications', name: 'Certifications', description: 'Get certified' },
      ]
    },
    {
      category: 'Developer Tools',
      pages: [
        { path: '/tools', name: 'All Tools', description: 'Browse developer tools' },
        { path: '/compiler/python', name: 'Python Compiler', description: 'Online Python IDE' },
        { path: '/compiler/javascript', name: 'JavaScript Compiler', description: 'Online JavaScript IDE' },
        { path: '/compiler/java', name: 'Java Compiler', description: 'Online Java IDE' },
        { path: '/code-editor', name: 'Code Editor', description: 'Multi-file code editor' },
        { path: '/whiteboard', name: 'Whiteboard', description: 'Digital whiteboard' },
      ]
    },
    {
      category: 'User Dashboard',
      pages: [
        { path: '/dashboard', name: 'Dashboard', description: 'Your learning dashboard' },
        { path: '/my-courses', name: 'My Courses', description: 'Enrolled courses' },
        { path: '/progress', name: 'Progress', description: 'Track your progress' },
        { path: '/bookmarks', name: 'Bookmarks', description: 'Saved resources' },
        { path: '/notes', name: 'Notes', description: 'Your notes' },
        { path: '/certificates', name: 'Certificates', description: 'Your earned certificates' },
      ]
    },
    {
      category: 'AI & Tools',
      pages: [
        { path: '/ai-assistant', name: 'AI Assistant', description: 'Get AI-powered help' },
        { path: '/resume-builder', name: 'Resume Builder', description: 'Build your resume' },
      ]
    },
    {
      category: 'Account',
      pages: [
        { path: '/login', name: 'Login', description: 'Sign in to your account' },
        { path: '/register', name: 'Register', description: 'Create a new account' },
        { path: '/membership', name: 'Membership', description: 'Upgrade your account' },
        { path: '/profile', name: 'Profile', description: 'Manage your profile' },
      ]
    },
    {
      category: 'Legal',
      pages: [
        { path: '/privacy', name: 'Privacy Policy', description: 'Our privacy practices' },
        { path: '/terms', name: 'Terms of Service', description: 'Terms and conditions' },
        { path: '/cookies', name: 'Cookie Policy', description: 'Cookie usage policy' },
      ]
    },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Sitemap</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find all the pages and resources available on {siteName}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {siteStructure.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {section.category}
              </h2>
              <ul className="space-y-3">
                {section.pages.map((page, pageIdx) => (
                  <li key={pageIdx}>
                    <Link 
                      href={page.path} 
                      className="flex items-start gap-2 group"
                    >
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div>
                        <span className="text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors font-medium text-sm">
                          {page.name}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {page.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" className="text-blue-500 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
