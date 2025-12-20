'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAuth, ProtectedRoute } from '../../lib/auth';

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
    { label: 'Courses Enrolled', value: '5', icon: '📘', color: '#3b82f6' },
    { label: 'Lessons Completed', value: '47', icon: '✅', color: '#10b981' },
    { label: 'Hours Learned', value: '23', icon: '⏱️', color: '#f59e0b' },
    { label: 'Certificates', value: '2', icon: '🏆', color: '#8b5cf6' },
  ];

  return (
    <Layout>
      {/* Dashboard Header */}
      <section style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '48px 0',
        color: 'white'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋
              </h1>
              <p style={{ opacity: 0.9, fontSize: '16px' }}>
                Continue your learning journey. You&apos;re doing great!
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/courses" className="btn btn-dark">
                Browse Courses
              </Link>
              <button onClick={logout} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section style={{ marginTop: '-40px', paddingBottom: '32px' }}>
        <div className="container">
          <div className="grid grid-4" style={{ gap: '20px' }}>
            {stats.map((stat, idx) => (
              <div key={idx} className="card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="section" style={{ paddingTop: '16px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
            {/* Left Column - Main Content */}
            <div>
              {/* Tabs */}
              <div className="tabs" style={{ marginBottom: '24px' }}>
                <button
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  My Courses
                </button>
                <button
                  className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
                  onClick={() => setActiveTab('certificates')}
                >
                  Certificates
                </button>
                <button
                  className={`tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookmarks')}
                >
                  Bookmarks
                </button>
              </div>

              {/* Continue Learning */}
              <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Continue Learning
                  </h3>
                </div>
                <div className="card-body">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        🤖
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {course.title}
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          {course.technology} • {course.completed}/{course.lessons} lessons
                        </p>
                        <div style={{
                          height: '6px',
                          background: 'var(--border-primary)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${course.progress}%`,
                            height: '100%',
                            background: 'var(--text-accent)',
                            borderRadius: '3px'
                          }}></div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-accent)' }}>
                          {course.progress}%
                        </span>
                      </div>
                      <Link href={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                        Continue
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Courses */}
              <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Recommended For You
                  </h3>
                  <Link href="/courses" style={{ color: 'var(--text-accent)', fontSize: '14px' }}>
                    View All →
                  </Link>
                </div>
                <div className="card-body">
                  <div className="grid grid-3" style={{ gap: '16px' }}>
                    {['RAG Systems', 'Prompt Engineering', 'Computer Vision'].map((title, idx) => (
                      <div key={idx} className="card" style={{ overflow: 'hidden' }}>
                        <div style={{
                          height: '100px',
                          background: `linear-gradient(135deg, ${['#3b82f6', '#8b5cf6', '#ec4899'][idx]}, ${['#1d4ed8', '#7c3aed', '#db2777'][idx]})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px'
                        }}>
                          {['📚', '💬', '👁️'][idx]}
                        </div>
                        <div style={{ padding: '16px' }}>
                          <h4 style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                            {title}
                          </h4>
                          <Link href={`/technologies/${title.toLowerCase().replace(' ', '-')}`} style={{
                            color: 'var(--text-accent)',
                            fontSize: '13px',
                            fontWeight: 500
                          }}>
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
            <div>
              {/* Profile Card */}
              <div className="card" style={{ marginBottom: '24px', textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px',
                  color: 'white',
                  fontWeight: 700
                }}>
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {user?.name || 'User'}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {user?.email}
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                  <span className="badge badge-primary">{user?.userType}</span>
                  <span className="badge badge-success">{user?.role}</span>
                </div>
                <Link href="/profile" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  Edit Profile
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Recent Activity
                  </h3>
                </div>
                <div className="card-body" style={{ padding: '0' }}>
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        borderBottom: idx < recentActivity.length - 1 ? '1px solid var(--border-primary)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{activity.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {activity.title}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {activity.time}
                        </p>
                      </div>
                      {activity.score && (
                        <span className="badge badge-success">{activity.score}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Quick Links
                  </h3>
                </div>
                <div className="card-body" style={{ padding: '8px 16px' }}>
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
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 0',
                        borderBottom: idx < 4 ? '1px solid var(--border-primary)' : 'none',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
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
