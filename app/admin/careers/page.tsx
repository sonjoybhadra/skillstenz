'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  skills: string[];
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  applications: number;
  createdAt: string;
}

const DEPARTMENTS = ['Engineering', 'Design', 'Content', 'Education', 'Marketing', 'Operations', 'Sales', 'HR'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export default function AdminCareersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState({ current: 1, total: 1, count: 0 });
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    page: 1,
    limit: 20
  });
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '2+ years',
    description: '',
    responsibilities: [''],
    requirements: [''],
    niceToHave: [''],
    skills: [''],
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchJobs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, user, filters]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_URL}/careers/admin/all?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        setPagination(data.pagination || { current: 1, total: 1, count: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(r => r.trim()),
      requirements: formData.requirements.filter(r => r.trim()),
      niceToHave: formData.niceToHave.filter(r => r.trim()),
      skills: formData.skills.filter(s => s.trim())
    };

    try {
      const token = localStorage.getItem('accessToken');
      const url = editingJob 
        ? `${API_URL}/careers/${editingJob._id}` 
        : `${API_URL}/careers`;
      
      const response = await fetch(url, {
        method: editingJob ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        toast.success(editingJob ? 'Job updated' : 'Job created');
        setShowModal(false);
        resetForm();
        fetchJobs();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to save job');
      }
    } catch {
      toast.error('Failed to save job');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/careers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Job deleted');
        fetchJobs();
      }
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/careers/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Status updated');
        fetchJobs();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      description: '',
      responsibilities: [''],
      requirements: [''],
      niceToHave: [''],
      skills: [''],
      isActive: true,
      isFeatured: false
    });
    setEditingJob(null);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      description: job.description,
      responsibilities: job.responsibilities.length ? job.responsibilities : [''],
      requirements: job.requirements.length ? job.requirements : [''],
      niceToHave: job.niceToHave.length ? job.niceToHave : [''],
      skills: job.skills.length ? job.skills : [''],
      isActive: job.isActive,
      isFeatured: job.isFeatured
    });
    setShowModal(true);
  };

  const updateArrayField = (field: 'responsibilities' | 'requirements' | 'niceToHave' | 'skills', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'responsibilities' | 'requirements' | 'niceToHave' | 'skills') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'responsibilities' | 'requirements' | 'niceToHave' | 'skills', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-[var(--bg-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Career Management</h1>
            <p className="text-[var(--text-muted)]">Manage job positions and openings</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <span>+</span> Add Job
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value, page: 1 })}
              className="px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">{pagination.count}</div>
            <div className="text-sm text-[var(--text-muted)]">Total Jobs</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-500">
              {jobs.filter(j => j.isActive).length}
            </div>
            <div className="text-sm text-[var(--text-muted)]">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {jobs.filter(j => j.isFeatured).length}
            </div>
            <div className="text-sm text-[var(--text-muted)]">Featured</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-500">
              {jobs.reduce((acc, j) => acc + j.views, 0)}
            </div>
            <div className="text-sm text-[var(--text-muted)]">Total Views</div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">💼</div>
              <p className="text-[var(--text-muted)]">No job positions yet</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="card">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--text-primary)]">{job.title}</h3>
                      {job.isFeatured && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>{job.views} views</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(job._id)}
                      className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-muted)]"
                      title={job.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {job.isActive ? '🔒' : '🔓'}
                    </button>
                    <button
                      onClick={() => openEditModal(job)}
                      className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-muted)]"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-primary)] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {editingJob ? 'Edit Job' : 'Add New Job'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-2xl">×</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Job Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      {JOB_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Experience Required
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      placeholder="e.g., 2+ years"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Responsibilities
                  </label>
                  {formData.responsibilities.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayField('responsibilities', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('responsibilities', index)}
                        className="p-2 text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('responsibilities')}
                    className="text-sm text-[var(--bg-accent)]"
                  >
                    + Add Responsibility
                  </button>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Requirements
                  </label>
                  {formData.requirements.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="p-2 text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="text-sm text-[var(--bg-accent)]"
                  >
                    + Add Requirement
                  </button>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[var(--text-primary)]">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[var(--text-primary)]">Featured</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[var(--bg-accent)] text-white rounded-lg hover:opacity-90"
                  >
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
