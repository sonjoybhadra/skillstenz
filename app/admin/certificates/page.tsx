'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminCertificatesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState<{ 
    stats: { total: number; active: number; expired: number; revoked: number; byType: Array<{ _id: string; count: number }> };
    topPerformers?: Array<{ name: string; email: string; count: number }>;
    recentCertificates?: Array<{ _id: string; userId: { name: string }; certificateType: string; createdAt: string }>;
  } | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [activeTab, setActiveTab] = useState<'all' | 'stats'>('all');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchCertificates();
      fetchStats();
    }
  }, [isAuthenticated, authLoading, user, filters]);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_URL}/certificates/admin/all?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates);
        setPagination({ total: data.total, totalPages: data.totalPages });
      }
    } catch (error) {
      console.error('Failed to load certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/certificates/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const revokeCertificate = async (certificateId: string) => {
    if (!confirm('Are you sure you want to revoke this certificate?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const reason = prompt('Reason for revocation (optional):');
      
      const response = await fetch(`${API_URL}/certificates/admin/${certificateId}/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        toast.success('Certificate revoked successfully');
        fetchCertificates();
        fetchStats();
      } else {
        toast.error('Failed to revoke certificate');
      }
    } catch (error) {
      toast.error('Failed to revoke certificate');
    }
  };

  const deleteCertificate = async (certificateId: string) => {
    if (!confirm('Are you sure you want to delete this certificate? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/certificates/admin/${certificateId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Certificate deleted successfully');
        fetchCertificates();
        fetchStats();
      } else {
        toast.error('Failed to delete certificate');
      }
    } catch (error) {
      toast.error('Failed to delete certificate');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Certificate Management</h1>
        <p className="text-[var(--text-muted)]">Manage, verify, and track user certificates</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-primary)] mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            All Certificates ({pagination.total})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Statistics
          </button>
        </nav>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <div className="text-sm font-medium opacity-90">Total Certificates</div>
              <div className="text-3xl font-bold mt-1">{stats.stats.total}</div>
            </div>
            <div className="card bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
              <div className="text-sm font-medium opacity-90">Active</div>
              <div className="text-3xl font-bold mt-1">{stats.stats.active}</div>
            </div>
            <div className="card bg-gradient-to-br from-orange-500 to-red-600 text-white">
              <div className="text-sm font-medium opacity-90">Revoked</div>
              <div className="text-3xl font-bold mt-1">{stats.stats.revoked}</div>
            </div>
            <div className="card bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <div className="text-sm font-medium opacity-90">By Type</div>
              <div className="text-sm mt-2">
                {stats.stats.byType.map((item: any) => (
                  <div key={item._id} className="flex justify-between">
                    <span>{item._id}</span>
                    <span>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">🏆 Top Performers</h3>
            <div className="space-y-3">
              {stats.topPerformers?.map((performer: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">{performer.user?.name}</div>
                      <div className="text-sm text-[var(--text-muted)]">@{performer.user?.username}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-violet-600">{performer.averageScore}% Avg</div>
                    <div className="text-sm text-[var(--text-muted)]">{performer.certificateCount} certs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Certificates */}
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">📜 Recently Issued</h3>
            <div className="space-y-3">
              {stats.recentCertificates?.map((cert: any) => (
                <div key={cert._id} className="flex items-center justify-between p-3 border border-[var(--border-primary)] rounded-lg">
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">{cert.title}</div>
                    <div className="text-sm text-[var(--text-muted)]">
                      {cert.user?.name} • {new Date(cert.issueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full">
                    {cert.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'all' && (
        <>
          {/* Filters */}
          <div className="card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-violet-500"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="revoked">Revoked</option>
                <option value="expired">Expired</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                className="px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All Types</option>
                <option value="course">Course</option>
                <option value="test">Test</option>
                <option value="skill">Skill</option>
                <option value="technology">Technology</option>
                <option value="achievement">Achievement</option>
              </select>
              <button
                onClick={() => setFilters({ status: '', type: '', search: '', page: 1, limit: 20 })}
                className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)]"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Certificate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Issue Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)]">
                  {certificates.map((cert: any) => (
                    <tr key={cert._id} className="hover:bg-[var(--bg-hover)]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {cert.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-[var(--text-primary)]">{cert.user?.name}</div>
                            <div className="text-sm text-[var(--text-muted)]">@{cert.user?.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[var(--text-primary)]">{cert.title}</div>
                        <div className="text-xs text-[var(--text-muted)] font-mono">{cert.certificateId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {cert.certificateType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-[var(--text-primary)]">{cert.score}%</div>
                          <div className="ml-2 text-xs text-[var(--text-muted)]">{cert.grade}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          cert.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : cert.status === 'revoked'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link
                          href={`/verify-certificate/${cert.certificateId}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {cert.status === 'active' && (
                          <button
                            onClick={() => revokeCertificate(cert.certificateId)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => deleteCertificate(cert.certificateId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-primary)]">
                <div className="text-sm text-[var(--text-muted)]">
                  Showing {certificates.length} of {pagination.total} certificates
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-[var(--text-muted)]">
                    Page {filters.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page === pagination.totalPages}
                    className="px-3 py-1 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
