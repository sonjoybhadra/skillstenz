'use client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  const courses = [
    { slug: 'python-basics', title: 'Python Programming Fundamentals', technology: 'Python', level: 'Beginner', duration: '8 hours', icon: '🐍', students: 15420 },
    { slug: 'javascript-essentials', title: 'JavaScript Essentials', technology: 'JavaScript', level: 'Beginner', duration: '10 hours', icon: '🟨', students: 12350 },
    { slug: 'react-complete', title: 'Complete React Course', technology: 'React', level: 'Intermediate', duration: '15 hours', icon: '⚛️', students: 8920 },
    { slug: 'nodejs-backend', title: 'Node.js Backend Development', technology: 'Node.js', level: 'Intermediate', duration: '12 hours', icon: '🟢', students: 7650 },
    { slug: 'java-programming', title: 'Java Programming Masterclass', technology: 'Java', level: 'Beginner', duration: '20 hours', icon: '☕', students: 11200 },
    { slug: 'typescript-advanced', title: 'Advanced TypeScript', technology: 'TypeScript', level: 'Advanced', duration: '8 hours', icon: '🔷', students: 5430 },
    { slug: 'sql-database', title: 'SQL & Database Design', technology: 'SQL', level: 'Beginner', duration: '6 hours', icon: '🗃️', students: 9870 },
    { slug: 'machine-learning', title: 'Machine Learning with Python', technology: 'Python', level: 'Advanced', duration: '25 hours', icon: '🤖', students: 6540 },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.technology.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section hero-gradient" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            Browse <span style={{ color: 'rgba(255,255,255,0.8)' }}>Courses</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Learn from our comprehensive collection of courses designed for all skill levels
          </p>
          
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="navbar-search" style={{ background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <svg className="navbar-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Level Tabs */}
      <section style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="tabs" style={{ justifyContent: 'center', padding: '16px 0' }}>
            {levels.map((level) => (
              <button
                key={level.id}
                className={`tab ${selectedLevel === level.id ? 'active' : ''}`}
                onClick={() => setSelectedLevel(level.id)}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {filteredCourses.length} Courses Available
            </h2>
          </div>

          <div className="grid grid-3" style={{ gap: '24px' }}>
            {filteredCourses.map((course) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ 
                  height: '140px', 
                  background: 'linear-gradient(135deg, var(--bg-accent) 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '56px'
                }}>
                  {course.icon}
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <span className="badge badge-primary">{course.technology}</span>
                    <span className="badge badge-secondary">{course.level}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                    {course.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
                    <span>⏱️ {course.duration}</span>
                    <span>👥 {course.students.toLocaleString()} students</span>
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
