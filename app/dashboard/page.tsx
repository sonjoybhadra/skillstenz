'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth, ProtectedRoute } from '@/lib/auth';

function DashboardContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const enrolledCourses = [
    { id: 1, title: 'AI Fundamentals', progress: 65, technology: 'AI', lessons: 24, completed: 16 },
    { id: 2, title: 'Building AI Agents', progress: 30, technology: 'AI Agents', lessons: 18, completed: 5 },
    { id: 3, title: 'LangChain Mastery', progress: 10, technology: 'LangChain', lessons: 32, completed: 3 },
  ];

  const recentActivity = [
    { type: 'lesson', title: 'Introduction to Neural Networks', time: '2 hours ago', icon: '📚' },
    { type: 'quiz', title: 'AI Basics Quiz', time: '1 day ago', icon: '✅', score: '85%' },
    { type: 'certificate', title: 'Python for AI Certificate', time: '3 days ago', icon: '🏆' },
  ];

  const stats = [
    { label: 'Courses Enrolled', value: '5', icon: '📘', color: 'text-blue-500' },
    { label: 'Lessons Completed', value: '47', icon: '✅', color: 'text-green-500' },
    { label: 'Hours Learned', value: '23', icon: '⏱️', color: 'text-amber-500' },
    { label: 'Certificates', value: '2', icon: '🏆', color: 'text-purple-500' },
  ];

  const tabs = ['overview', 'courses', 'certificates', 'bookmarks'];

  return (
    <Layout>
      {/* Dashboard Header */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-600 py-12 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-emerald-100">
                Continue your learning journey. You&apos;re doing great!
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/courses" 
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Browse Courses
              </Link>
              <button 
                onClick={logout} 
                className="px-5 py-2.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="-mt-10 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-4 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_350px] gap-8">
            {/* Left Column */}
            <div>
              {/* Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Continue Learning */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl mb-6">
                <div className="p-5 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Continue Learning</h3>
                </div>
                <div className="p-5 space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        🤖
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{course.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {course.technology} • {course.completed}/{course.lessons} lessons
                        </p>
                        <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-emerald-500">{course.progress}%</span>
                      </div>
                      <Link 
                        href={`/courses/${course.id}`} 
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Continue
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Courses */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
                <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recommended For You</h3>
                  <Link href="/courses" className="text-emerald-500 text-sm hover:underline">View All →</Link>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'RAG Systems', icon: '📚', gradient: 'from-blue-500 to-blue-600' },
                      { title: 'Prompt Engineering', icon: '💬', gradient: 'from-purple-500 to-purple-600' },
                      { title: 'Computer Vision', icon: '👁️', gradient: 'from-pink-500 to-pink-600' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-slate-900 rounded-xl overflow-hidden">
                        <div className={`h-24 bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl`}>
                          {item.icon}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{item.title}</h4>
                          <Link 
                            href={`/technologies/${item.title.toLowerCase().replace(' ', '-')}`} 
                            className="text-emerald-500 text-sm font-medium hover:underline"
                          >
                            Start Learning →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{user?.name || 'User'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user?.email}</p>
                <div className="flex gap-2 justify-center mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    {user?.userType}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                    {user?.role}
                  </span>
                </div>
                <Link 
                  href="/profile" 
                  className="block w-full py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
                <div className="p-5 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                <div>
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-4 ${
                        idx < recentActivity.length - 1 ? 'border-b border-gray-200 dark:border-slate-700' : ''
                      }`}
                    >
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                      {activity.score && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                          {activity.score}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
                <div className="p-5 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-bold text-gray-900 dark:text-white">Quick Links</h3>
                </div>
                <div className="p-2">
                  {[
                    { icon: '📚', label: 'My Courses', href: '/my-courses' },
                    { icon: '🔖', label: 'Bookmarks', href: '/bookmarks' },
                    { icon: '📝', label: 'Notes', href: '/notes' },
                    { icon: '📊', label: 'Progress', href: '/progress' },
                    { icon: '⚙️', label: 'Settings', href: '/settings' },
                  ].map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
