'use client';

import { useState } from 'react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPages: { path: string; views: number; }[];
  trafficSources: { source: string; percentage: number; color: string; }[];
  dailyViews: { date: string; views: number; }[];
}

export default function AnalyticsPage() {
  const [analyticsId, setAnalyticsId] = useState('G-XXXXXXXXXX');
  const [dateRange, setDateRange] = useState('7d');
  const [saving, setSaving] = useState(false);

  // Mock analytics data
  const data: AnalyticsData = {
    pageViews: 125430,
    uniqueVisitors: 45280,
    avgSessionDuration: '4:32',
    bounceRate: 42.5,
    topPages: [
      { path: '/ai-agents', views: 15420 },
      { path: '/python/langchain', views: 12350 },
      { path: '/machine-learning', views: 9870 },
      { path: '/courses', views: 8540 },
      { path: '/node-js', views: 6720 }
    ],
    trafficSources: [
      { source: 'Organic Search', percentage: 45, color: '#3b82f6' },
      { source: 'Direct', percentage: 28, color: '#10b981' },
      { source: 'Social Media', percentage: 18, color: '#8b5cf6' },
      { source: 'Referral', percentage: 9, color: '#f59e0b' }
    ],
    dailyViews: [
      { date: 'Mon', views: 15200 },
      { date: 'Tue', views: 18400 },
      { date: 'Wed', views: 21200 },
      { date: 'Thu', views: 19800 },
      { date: 'Fri', views: 17600 },
      { date: 'Sat', views: 14300 },
      { date: 'Sun', views: 12800 }
    ]
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Analytics settings saved successfully!');
  };

  const maxViews = Math.max(...data.dailyViews.map(d => d.views));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Analytics Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Monitor your site performance and visitor insights
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            className="btn"
            style={{ border: '1px solid var(--border-primary)', background: 'transparent' }}
          >
            <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px', color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Page Views</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {data.pageViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: '#10b981', marginTop: '8px' }}>
            ↑ 12.5% from last period
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Unique Visitors</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {data.uniqueVisitors.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: '#10b981', marginTop: '8px' }}>
            ↑ 8.3% from last period
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px', color: '#8b5cf6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Avg. Session</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {data.avgSessionDuration}
          </div>
          <div style={{ fontSize: '13px', color: '#10b981', marginTop: '8px' }}>
            ↑ 5.2% from last period
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px', color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Bounce Rate</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {data.bounceRate}%
          </div>
          <div style={{ fontSize: '13px', color: '#ef4444', marginTop: '8px' }}>
            ↓ 2.1% from last period
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Daily Views Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
            Daily Page Views
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
            {data.dailyViews.map((day, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${(day.views / maxViews) * 160}px`,
                    background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                    borderRadius: '8px 8px 0 0',
                    minHeight: '20px',
                    transition: 'height 0.3s'
                  }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
            Traffic Sources
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.trafficSources.map((source, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{source.source}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{source.percentage}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${source.percentage}%`,
                      height: '100%',
                      background: source.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages & Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Top Pages */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Top Pages
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.topPages.map((page, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '14px' }}>{page.path}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>
                  {page.views.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Settings */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Analytics Settings
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Google Analytics ID
            </label>
            <input
              type="text"
              value={analyticsId}
              onChange={(e) => setAnalyticsId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontFamily: 'monospace'
              }}
            />
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Get this from Google Analytics → Admin → Data Streams
            </p>
          </div>

          <div style={{
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '8px', fontWeight: 500 }}>
              💡 Pro Tip
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              For detailed analytics, visit the{' '}
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
              >
                Google Analytics Dashboard
              </a>
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {saving ? 'Saving...' : 'Save Analytics Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
