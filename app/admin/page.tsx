'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI, type User } from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  activeMemberships: number;
  revenue: number;
  aiStats: { totalQueries: number; totalTokens: number };
  recentUsers: User[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      const { data, error } = await adminAPI.getDashboardStats();
      if (!isMounted) return;
      if (error) {
        setError(error);
      } else if (data) {
        setStats(data);
      }
      setIsLoading(false);
    };
    
    fetchData();
    
    return () => { isMounted = false; };
  }, []);

  const loadDashboardStats = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await adminAPI.getDashboardStats();
    if (error) {
      setError(error);
    } else if (data) {
      setStats(data);
    }
    setIsLoading(false);
  };

  // Paginated users
  const paginatedUsers = stats?.recentUsers?.slice(
    (userPage - 1) * usersPerPage,
    userPage * usersPerPage
  ) || [];
  const totalUserPages = Math.ceil((stats?.recentUsers?.length || 0) / usersPerPage);

  if (isLoading) {
    return (
      <div className="admin-loading">
        <style jsx>{`
          .admin-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 300px;
          }
          .admin-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--border, #e2e8f0);
            border-top-color: #0968c6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="admin-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <style jsx>{`
          .admin-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
          }
          .admin-error-text {
            color: #ef4444;
            margin-bottom: 12px;
          }
          .admin-error-btn {
            color: #ef4444;
            text-decoration: underline;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
          }
        `}</style>
        <p className="admin-error-text">{error}</p>
        <button onClick={loadDashboardStats} className="admin-error-btn">
          Try again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: '👥',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      link: '/admin/users'
    },
    {
      title: 'Active Memberships',
      value: stats?.activeMemberships || 0,
      icon: '⭐',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      link: '/admin/memberships'
    },
    {
      title: 'Revenue',
      value: `$${(stats?.revenue || 0).toLocaleString()}`,
      icon: '💰',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      link: '/admin/payments'
    },
    {
      title: 'AI Queries',
      value: stats?.aiStats?.totalQueries || 0,
      icon: '🤖',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      link: '/admin/ai-usage'
    },
  ];

  const quickActions = [
    { title: 'Add Technology', href: '/admin/technologies', icon: '💻', desc: 'Create new tech stack' },
    { title: 'Add Course', href: '/admin/courses', icon: '📚', desc: 'Create learning content' },
    { title: 'Manage MCQs', href: '/admin/mcqs', icon: '❓', desc: 'Quiz questions' },
    { title: 'View Analytics', href: '/admin/analytics', icon: '📊', desc: 'Traffic & stats' },
    { title: 'Certificates', href: '/admin/certificates', icon: '🎓', desc: 'User certificates' },
    { title: 'Careers', href: '/admin/careers', icon: '💼', desc: 'Job positions' },
  ];

  return (
    <div className="admin-dashboard">
      <style jsx>{`
        .admin-dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }
        .admin-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .admin-page-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--foreground, #1e293b);
        }
        .admin-page-subtitle {
          color: var(--muted-foreground, #64748b);
          margin-top: 4px;
          font-size: 14px;
        }
        .admin-refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #0968c6 0%, #0756a3 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-refresh-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(9, 104, 198, 0.3);
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .admin-stat-card {
          background: var(--card, #ffffff);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--border, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s;
          text-decoration: none;
        }
        .admin-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }
        .admin-stat-title {
          font-size: 13px;
          color: var(--muted-foreground, #64748b);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .admin-stat-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--foreground, #1e293b);
          margin-top: 8px;
        }
        .admin-stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }
        .admin-section {
          background: var(--card, #ffffff);
          border-radius: 16px;
          border: 1px solid var(--border, #e2e8f0);
          margin-bottom: 24px;
          overflow: hidden;
        }
        .admin-section-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-section-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--foreground, #1e293b);
        }
        .admin-section-link {
          font-size: 14px;
          color: #0968c6;
          text-decoration: none;
          font-weight: 500;
        }
        .admin-section-link:hover {
          text-decoration: underline;
        }
        .admin-quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          padding: 24px;
        }
        .admin-quick-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          border-radius: 12px;
          background: var(--muted, #f8fafc);
          border: 1px solid transparent;
          text-decoration: none;
          transition: all 0.2s;
        }
        .admin-quick-action:hover {
          background: rgba(9, 104, 198, 0.05);
          border-color: rgba(9, 104, 198, 0.2);
          transform: translateY(-2px);
        }
        .admin-quick-action-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .admin-quick-action-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--foreground, #1e293b);
          margin-bottom: 4px;
        }
        .admin-quick-action-desc {
          font-size: 12px;
          color: var(--muted-foreground, #64748b);
        }
        .admin-user-list {
          divide-y: 1px solid var(--border, #e2e8f0);
        }
        .admin-user-item {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border, #e2e8f0);
        }
        .admin-user-item:last-child {
          border-bottom: none;
        }
        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .admin-user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0968c6 0%, #0756a3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
        }
        .admin-user-name {
          font-weight: 600;
          color: var(--foreground, #1e293b);
          font-size: 14px;
        }
        .admin-user-type {
          font-size: 12px;
          color: var(--muted-foreground, #64748b);
          margin-top: 2px;
        }
        .admin-user-role {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .admin-user-role.admin {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }
        .admin-user-role.user {
          background: var(--muted, #f1f5f9);
          color: var(--muted-foreground, #64748b);
        }
        .admin-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          border-top: 1px solid var(--border, #e2e8f0);
        }
        .admin-page-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border, #e2e8f0);
          background: var(--card, #ffffff);
          color: var(--foreground, #1e293b);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-page-btn:hover:not(:disabled) {
          background: var(--muted, #f1f5f9);
          border-color: var(--muted-foreground, #94a3b8);
        }
        .admin-page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .admin-page-btn.active {
          background: #0968c6;
          color: white;
          border-color: #0968c6;
        }
        .admin-page-info {
          font-size: 13px;
          color: var(--muted-foreground, #64748b);
          padding: 0 12px;
        }
        .admin-two-col {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }
        .admin-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid var(--border, #e2e8f0);
        }
        .admin-info-row:last-child {
          border-bottom: none;
        }
        .admin-info-label {
          color: var(--muted-foreground, #64748b);
          font-size: 14px;
        }
        .admin-info-value {
          font-weight: 600;
          color: var(--foreground, #1e293b);
          font-size: 14px;
        }
        .admin-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }
        .admin-status-dot.online {
          background: #10b981;
        }
        .admin-empty-state {
          padding: 48px 24px;
          text-align: center;
          color: var(--muted-foreground, #64748b);
        }
      `}</style>

      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome to SkillStenz Admin Panel</p>
        </div>
        <button onClick={loadDashboardStats} className="admin-refresh-btn">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link} className="admin-stat-card">
            <div>
              <p className="admin-stat-title">{stat.title}</p>
              <p className="admin-stat-value">{stat.value}</p>
            </div>
            <div className="admin-stat-icon" style={{ background: stat.gradient }}>
              {stat.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Quick Actions</h2>
        </div>
        <div className="admin-quick-actions">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href} className="admin-quick-action">
              <span className="admin-quick-action-icon">{action.icon}</span>
              <span className="admin-quick-action-title">{action.title}</span>
              <span className="admin-quick-action-desc">{action.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Users with Pagination */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Recent Users</h2>
          <Link href="/admin/users" className="admin-section-link">
            View all →
          </Link>
        </div>
        <div className="admin-user-list">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <div key={index} className="admin-user-item">
                <div className="admin-user-info">
                  <div className="admin-user-avatar">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="admin-user-name">{user.email}</p>
                    <p className="admin-user-type">{user.userType || 'Free'}</p>
                  </div>
                </div>
                <span className={`admin-user-role ${user.role === 'admin' ? 'admin' : 'user'}`}>
                  {user.role}
                </span>
              </div>
            ))
          ) : (
            <div className="admin-empty-state">No users yet</div>
          )}
        </div>
        {totalUserPages > 1 && (
          <div className="admin-pagination">
            <button 
              className="admin-page-btn"
              onClick={() => setUserPage(p => Math.max(1, p - 1))}
              disabled={userPage === 1}
            >
              ← Prev
            </button>
            <span className="admin-page-info">
              Page {userPage} of {totalUserPages}
            </span>
            <button 
              className="admin-page-btn"
              onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
              disabled={userPage === totalUserPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Two Column Section */}
      <div className="admin-two-col">
        {/* AI Usage */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">AI Usage</h2>
          </div>
          <div style={{ padding: '20px 24px' }}>
            <div className="admin-info-row">
              <span className="admin-info-label">Total Queries</span>
              <span className="admin-info-value">{stats?.aiStats?.totalQueries || 0}</span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Total Tokens Used</span>
              <span className="admin-info-value">{(stats?.aiStats?.totalTokens || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">System Status</h2>
          </div>
          <div style={{ padding: '20px 24px' }}>
            <div className="admin-info-row">
              <span className="admin-info-label">API Status</span>
              <span className="admin-info-value">
                <span className="admin-status-dot online"></span>
                Online
              </span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Database</span>
              <span className="admin-info-value">
                <span className="admin-status-dot online"></span>
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
