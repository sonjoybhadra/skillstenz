'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface MCQ {
  _id: string;
  question: string;
  category: string;
  difficulty: string;
  skill: string;
  points: number;
  isActive: boolean;
  course?: { _id: string; title: string };
  topic?: { _id: string; name: string };
  technology?: { _id: string; name: string; icon: string };
  options: { text: string; isCorrect: boolean }[];
  correctAnswer: number;
  explanation: string;
  createdAt: string;
}

interface Technology {
  _id: string;
  name: string;
  icon: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
}

interface Topic {
  _id: string;
  name: string;
}

export default function AdminMCQsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [pagination, setPagination] = useState({ current: 1, total: 1, count: 0 });
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
    technology: '',
    page: 1,
    limit: 20
  });
  const [showModal, setShowModal] = useState(false);
  const [editingMcq, setEditingMcq] = useState<MCQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    category: 'general',
    difficulty: 'medium',
    skill: '',
    points: 10,
    technology: '',
    course: '',
    topic: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    correctAnswer: 0,
    explanation: '',
    isActive: true
  });

  const fetchTechnologies = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/technologies?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setTechnologies(data.technologies || []);
      }
    } catch (error) {
      console.error('Failed to fetch technologies:', error);
    }
  }, []);

  const fetchCourses = useCallback(async (techId: string) => {
    if (!techId) { setCourses([]); return; }
    try {
      const response = await fetch(`${API_URL}/courses?technology=${techId}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  }, []);

  const fetchTopics = useCallback(async (techId: string) => {
    if (!techId) { setTopics([]); return; }
    try {
      const response = await fetch(`${API_URL}/topics/technology/${techId}`);
      if (response.ok) {
        const data = await response.json();
        setTopics(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  useEffect(() => {
    if (formData.technology) {
      fetchCourses(formData.technology);
      fetchTopics(formData.technology);
    } else {
      setCourses([]);
      setTopics([]);
    }
  }, [formData.technology, fetchCourses, fetchTopics]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchMCQs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, user, filters]);

  const fetchMCQs = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);
      if (filters.technology) params.append('technology', filters.technology);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_URL}/mcqs/admin/all?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMcqs(data.mcqs || []);
        setPagination(data.pagination || { current: 1, total: 1, count: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch MCQs:', error);
      toast.error('Failed to load MCQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('accessToken');
      const url = editingMcq 
        ? `${API_URL}/mcqs/${editingMcq._id}` 
        : `${API_URL}/mcqs`;
      
      const response = await fetch(url, {
        method: editingMcq ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingMcq ? 'MCQ updated' : 'MCQ created');
        setShowModal(false);
        resetForm();
        fetchMCQs();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to save MCQ');
      }
    } catch {
      toast.error('Failed to save MCQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this MCQ?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/mcqs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('MCQ deleted');
        fetchMCQs();
      }
    } catch {
      toast.error('Failed to delete MCQ');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      category: 'general',
      difficulty: 'medium',
      skill: '',
      points: 10,
      technology: '',
      course: '',
      topic: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      correctAnswer: 0,
      explanation: '',
      isActive: true
    });
    setEditingMcq(null);
    setCourses([]);
    setTopics([]);
  };

  const openEditModal = (mcq: MCQ) => {
    setEditingMcq(mcq);
    const techId = mcq.technology?._id || '';
    if (techId) {
      fetchCourses(techId);
      fetchTopics(techId);
    }
    setFormData({
      question: mcq.question,
      category: mcq.category,
      difficulty: mcq.difficulty,
      skill: mcq.skill,
      points: mcq.points,
      technology: techId,
      course: mcq.course?._id || '',
      topic: mcq.topic?._id || '',
      options: mcq.options.length >= 4 ? mcq.options : [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      correctAnswer: mcq.correctAnswer,
      explanation: mcq.explanation || '',
      isActive: mcq.isActive
    });
    setShowModal(true);
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text };
    setFormData({ ...formData, options: newOptions });
  };

  const setCorrectAnswer = (index: number) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setFormData({ ...formData, options: newOptions, correctAnswer: index });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#0968c6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <style jsx>{`
        .card { background: var(--bg-secondary, #fff); border: 1px solid var(--border-primary, #e2e8f0); border-radius: 12px; padding: 16px; }
      `}</style>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>MCQ Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage quiz questions and assessments ({pagination.count} total)</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #0968c6 0%, #0756a3 100%)' }}
        >
          <span>+</span> Add MCQ
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.technology}
            onChange={(e) => setFilters({ ...filters, technology: e.target.value, page: 1 })}
            className="px-4 py-2 border rounded-lg"
            style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          >
            <option value="">All Technologies</option>
            {technologies.map(tech => (
              <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            className="px-4 py-2 border rounded-lg"
            style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="interview">Interview</option>
              <option value="coding">Coding</option>
              <option value="aptitude">Aptitude</option>
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value, page: 1 })}
              className="px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              type="text"
              placeholder="Search questions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="flex-1 min-w-[200px] px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">{pagination.count}</div>
            <div className="text-sm text-[var(--text-muted)]">Total MCQs</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-500">
              {mcqs.filter(m => m.isActive).length}
            </div>
            <div className="text-sm text-[var(--text-muted)]">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {mcqs.filter(m => m.difficulty === 'medium').length}
            </div>
            <div className="text-sm text-[var(--text-muted)]">Medium</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-500">
              {mcqs.filter(m => m.difficulty === 'hard').length}
            </div>
            <div className="text-sm text-[var(--text-muted)]">Hard</div>
          </div>
        </div>

        {/* MCQ List */}
        <div className="space-y-4">
          {mcqs.map((mcq) => (
            <div key={mcq._id} className="card">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      mcq.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      mcq.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {mcq.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {mcq.category}
                    </span>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      {mcq.points} pts
                    </span>
                    {!mcq.isActive && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--text-primary)] font-medium">{mcq.question}</p>
                  {mcq.skill && (
                    <p className="text-sm text-[var(--text-muted)] mt-1">Skill: {mcq.skill}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(mcq)}
                    className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-muted)]"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(mcq._id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-4 py-2 border border-[var(--border-primary)] rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-[var(--text-muted)]">
              Page {filters.page} of {pagination.total}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === pagination.total}
              className="px-4 py-2 border border-[var(--border-primary)] rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-primary)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {editingMcq ? 'Edit MCQ' : 'Add New MCQ'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-2xl">×</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Technology, Course, Topic Selection */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Technology
                    </label>
                    <select
                      value={formData.technology}
                      onChange={(e) => setFormData({ ...formData, technology: e.target.value, course: '', topic: '' })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="">Select Technology</option>
                      {technologies.map(tech => (
                        <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Course
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      disabled={!formData.technology}
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Topic
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      disabled={!formData.technology}
                    >
                      <option value="">Select Topic</option>
                      {topics.map(topic => (
                        <option key={topic._id} value={topic._id}>{topic.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Question *
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="general">General</option>
                      <option value="interview">Interview</option>
                      <option value="coding">Coding</option>
                      <option value="aptitude">Aptitude</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Skill/Topic
                    </label>
                    <input
                      type="text"
                      value={formData.skill}
                      onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      placeholder="e.g., JavaScript, React"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Points
                    </label>
                    <input
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Options (select correct answer)
                  </label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === index}
                          onChange={() => setCorrectAnswer(index)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Explanation
                  </label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    placeholder="Explain why this answer is correct"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm text-[var(--text-primary)]">
                    Active (visible to users)
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
                    className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #0968c6 0%, #0756a3 100%)' }}
                  >
                    {editingMcq ? 'Update MCQ' : 'Create MCQ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
