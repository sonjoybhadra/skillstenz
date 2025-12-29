'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Rich Content Editor
const RichContentEditor = dynamic(() => import('@/components/UI/RichContentEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading Editor...</div>
});

interface ContentItem {
  type: 'text' | 'video' | 'pdf' | 'link' | 'code';
  title: string;
  content?: string;
  url?: string;
  duration?: number;
  language?: string;
  approved: boolean;
}

interface Subtopic {
  name: string;
  description: string;
  content: ContentItem[];
}

interface Topic {
  _id: string;
  technologyId: string | { _id: string; name: string; icon: string };
  name: string;
  description: string;
  subtopics: Subtopic[];
  accessType: 'free' | 'paid';
  order: number;
  createdAt: string;
}

interface Technology {
  _id: string;
  name: string;
  icon: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSubtopicModal, setShowSubtopicModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingSubtopicIndex, setEditingSubtopicIndex] = useState<number | null>(null);
  const [editingContentIndex, setEditingContentIndex] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  const [filterTech, setFilterTech] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologyId: '',
    accessType: 'free' as 'free' | 'paid',
    order: 0
  });

  const [contentForm, setContentForm] = useState<ContentItem>({
    type: 'text',
    title: '',
    content: '',
    url: '',
    duration: 0,
    language: 'javascript',
    approved: true
  });

  const [subtopicForm, setSubtopicForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchTechnologies();
  }, []);

  useEffect(() => {
    if (filterTech) {
      fetchTopics(filterTech);
    } else {
      setTopics([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTech, searchQuery]);

  const getToken = () => localStorage.getItem('accessToken');

  const fetchTechnologies = async () => {
    try {
      const response = await fetch(`${API_URL}/technologies?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setTechnologies(data.technologies || []);
      }
    } catch (error) {
      console.error('Failed to fetch technologies:', error);
    }
  };

  const fetchTopics = async (techId: string) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/topics/technology/${techId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        let data = await response.json();
        // Filter by search query if present
        if (searchQuery) {
          data = data.filter((t: Topic) => 
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setTopics(data);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTopic(null);
    setFormData({
      name: '',
      description: '',
      technologyId: filterTech || (technologies[0]?._id || ''),
      accessType: 'free',
      order: topics.length
    });
    setShowModal(true);
  };

  const openEditModal = (topic: Topic) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description || '',
      technologyId: typeof topic.technologyId === 'object' ? topic.technologyId._id : topic.technologyId,
      accessType: topic.accessType,
      order: topic.order
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.technologyId) {
      setMessage({ type: 'error', text: 'Name and Technology are required' });
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const method = editingTopic ? 'PUT' : 'POST';
      const url = editingTopic 
        ? `${API_URL}/topics/${editingTopic._id}`
        : `${API_URL}/topics`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Topic ${editingTopic ? 'updated' : 'created'} successfully!` });
        setShowModal(false);
        fetchTopics(filterTech || formData.technologyId);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to save topic' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete topic "${name}"? This action cannot be undone.`)) return;
    
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/topics/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Topic deleted successfully!' });
        fetchTopics(filterTech);
      } else {
        setMessage({ type: 'error', text: 'Failed to delete topic' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const openSubtopicModal = (topic: Topic, index?: number) => {
    setEditingTopic(topic);
    if (typeof index === 'number' && topic.subtopics[index]) {
      setEditingSubtopicIndex(index);
      setSubtopicForm({
        name: topic.subtopics[index].name,
        description: topic.subtopics[index].description || ''
      });
    } else {
      setEditingSubtopicIndex(null);
      setSubtopicForm({ name: '', description: '' });
    }
    setShowSubtopicModal(true);
  };

  const saveSubtopic = async () => {
    if (!subtopicForm.name || !editingTopic) {
      setMessage({ type: 'error', text: 'Subtopic name is required' });
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const updatedSubtopics = [...(editingTopic.subtopics || [])];
      
      if (typeof editingSubtopicIndex === 'number') {
        updatedSubtopics[editingSubtopicIndex] = {
          ...updatedSubtopics[editingSubtopicIndex],
          name: subtopicForm.name,
          description: subtopicForm.description
        };
      } else {
        updatedSubtopics.push({
          name: subtopicForm.name,
          description: subtopicForm.description,
          content: []
        });
      }

      const response = await fetch(`${API_URL}/topics/${editingTopic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtopics: updatedSubtopics })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Subtopic ${editingSubtopicIndex !== null ? 'updated' : 'added'} successfully!` });
        setShowSubtopicModal(false);
        fetchTopics(filterTech);
      } else {
        setMessage({ type: 'error', text: 'Failed to save subtopic' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteSubtopic = async (topic: Topic, subtopicIndex: number) => {
    if (!confirm('Delete this subtopic?')) return;
    
    try {
      const token = getToken();
      const updatedSubtopics = topic.subtopics.filter((_, i) => i !== subtopicIndex);
      
      const response = await fetch(`${API_URL}/topics/${topic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtopics: updatedSubtopics })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Subtopic deleted!' });
        fetchTopics(filterTech);
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  // Content Management Functions
  const openContentModal = (topic: Topic, subtopicIdx: number, contentIdx?: number) => {
    setEditingTopic(topic);
    setEditingSubtopicIndex(subtopicIdx);
    
    if (typeof contentIdx === 'number' && topic.subtopics[subtopicIdx]?.content[contentIdx]) {
      setEditingContentIndex(contentIdx);
      const content = topic.subtopics[subtopicIdx].content[contentIdx];
      setContentForm({
        type: content.type,
        title: content.title,
        content: content.content || '',
        url: content.url || '',
        duration: content.duration || 0,
        language: content.language || 'javascript',
        approved: content.approved
      });
    } else {
      setEditingContentIndex(null);
      setContentForm({
        type: 'text',
        title: '',
        content: '',
        url: '',
        duration: 0,
        language: 'javascript',
        approved: true
      });
    }
    setShowContentModal(true);
  };

  const saveContent = async () => {
    if (!contentForm.title || !editingTopic || editingSubtopicIndex === null) {
      setMessage({ type: 'error', text: 'Content title is required' });
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const updatedSubtopics = [...(editingTopic.subtopics || [])];
      const subtopic = { ...updatedSubtopics[editingSubtopicIndex] };
      const contentItems = [...(subtopic.content || [])];

      const newContent: ContentItem = {
        type: contentForm.type,
        title: contentForm.title,
        content: contentForm.content,
        url: contentForm.url,
        duration: contentForm.duration,
        language: contentForm.language,
        approved: contentForm.approved
      };

      if (typeof editingContentIndex === 'number') {
        contentItems[editingContentIndex] = newContent;
      } else {
        contentItems.push(newContent);
      }

      subtopic.content = contentItems;
      updatedSubtopics[editingSubtopicIndex] = subtopic;

      const response = await fetch(`${API_URL}/topics/${editingTopic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtopics: updatedSubtopics })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Content ${editingContentIndex !== null ? 'updated' : 'added'} successfully!` });
        setShowContentModal(false);
        fetchTopics(filterTech);
      } else {
        setMessage({ type: 'error', text: 'Failed to save content' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async (topic: Topic, subtopicIdx: number, contentIdx: number) => {
    if (!confirm('Delete this content?')) return;
    
    try {
      const token = getToken();
      const updatedSubtopics = [...topic.subtopics];
      updatedSubtopics[subtopicIdx] = {
        ...updatedSubtopics[subtopicIdx],
        content: updatedSubtopics[subtopicIdx].content.filter((_, i) => i !== contentIdx)
      };

      const response = await fetch(`${API_URL}/topics/${topic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtopics: updatedSubtopics })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Content deleted!' });
        fetchTopics(filterTech);
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  // Pagination
  const paginatedTopics = topics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(topics.length / itemsPerPage);

  return (
    <div>
      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .page-title { font-size: 24px; font-weight: 700; color: var(--text-primary); }
        .page-subtitle { color: var(--text-muted); margin-top: 4px; }
        .btn { padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; }
        .btn-primary { background: linear-gradient(135deg, #0968c6 0%, #0756a3 100%); color: white; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(9, 104, 198, 0.3); }
        .btn-secondary { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-primary); }
        .btn-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        .card { background: var(--bg-secondary, #fff); border: 1px solid var(--border-primary, #e2e8f0); border-radius: 12px; }
        .filters { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
        .input, .select { padding: 10px 16px; border: 1px solid var(--border-primary); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary); font-size: 14px; }
        .input:focus, .select:focus { outline: none; border-color: #0968c6; }
        .input { flex: 1; min-width: 200px; }
        .message { padding: 12px 16px; margin-bottom: 24px; border-radius: 8px; }
        .message-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .message-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .topic-card { padding: 20px; border-bottom: 1px solid var(--border-primary); }
        .topic-card:last-child { border-bottom: none; }
        .topic-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .topic-info h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .topic-info p { font-size: 13px; color: var(--text-muted); }
        .topic-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 12px; color: var(--text-muted); }
        .topic-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .badge-free { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .badge-paid { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .subtopics { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border-primary); }
        .subtopic-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-primary, #f8fafc); border-radius: 6px; margin-bottom: 8px; }
        .subtopic-name { font-size: 14px; color: var(--text-primary); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: var(--bg-secondary, #fff); border-radius: 16px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-header { padding: 20px; border-bottom: 1px solid var(--border-primary); display: flex; justify-content: space-between; align-items: center; }
        .modal-title { font-size: 18px; font-weight: 600; color: var(--text-primary); }
        .modal-body { padding: 20px; }
        .modal-footer { padding: 20px; border-top: 1px solid var(--border-primary); display: flex; justify-content: flex-end; gap: 12px; }
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 13px; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; }
        .form-input, .form-select, .form-textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--border-primary); border-radius: 8px; background: var(--bg-primary); color: var(--text-primary); font-size: 14px; }
        .form-textarea { min-height: 80px; resize: vertical; }
        .pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 24px; }
        .page-btn { padding: 8px 14px; border: 1px solid var(--border-primary); border-radius: 6px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; }
        .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .page-btn.active { background: #0968c6; color: white; border-color: #0968c6; }
        .empty-state { padding: 60px 20px; text-align: center; color: var(--text-muted); }
        .spinner { width: 40px; height: 40px; border: 3px solid var(--border-primary); border-top-color: #0968c6; border-radius: 50%; animation: spin 1s linear infinite; margin: 40px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">Topics Management</h1>
          <p className="page-subtitle">Manage topics and subtopics for each technology ({topics.length} total)</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" disabled={!filterTech}>
          + Add Topic
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div className="filters card" style={{ padding: '16px' }}>
        <select
          className="select"
          value={filterTech}
          onChange={(e) => { setFilterTech(e.target.value); setCurrentPage(1); }}
          style={{ minWidth: '200px' }}
        >
          <option value="">Select Technology *</option>
          {technologies.map(tech => (
            <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search topics..."
          className="input"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {!filterTech ? (
        <div className="card">
          <div className="empty-state">
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</p>
            <p>Select a technology to view and manage its topics</p>
          </div>
        </div>
      ) : loading ? (
        <div className="spinner"></div>
      ) : topics.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📚</p>
            <p>No topics found. Create your first topic!</p>
            <button onClick={openAddModal} className="btn btn-primary" style={{ marginTop: '16px' }}>
              + Add Topic
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            {paginatedTopics.map((topic) => (
              <div key={topic._id} className="topic-card">
                <div className="topic-header">
                  <div className="topic-info">
                    <h3>{topic.name}</h3>
                    <p>{topic.description || 'No description'}</p>
                    <div className="topic-meta">
                      <span className={`badge ${topic.accessType === 'paid' ? 'badge-paid' : 'badge-free'}`}>
                        {topic.accessType === 'paid' ? '💎 Paid' : '🆓 Free'}
                      </span>
                      <span>📑 {topic.subtopics?.length || 0} subtopics</span>
                      <span>📊 Order: {topic.order}</span>
                    </div>
                  </div>
                  <div className="topic-actions">
                    <button
                      onClick={() => setExpandedTopic(expandedTopic === topic._id ? null : topic._id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {expandedTopic === topic._id ? '▲ Hide' : '▼ Subtopics'}
                    </button>
                    <button onClick={() => openSubtopicModal(topic)} className="btn btn-secondary btn-sm">
                      + Subtopic
                    </button>
                    <button onClick={() => openEditModal(topic)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(topic._id, topic.name)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </div>

                {expandedTopic === topic._id && (
                  <div className="subtopics">
                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)' }}>
                      Subtopics ({topic.subtopics?.length || 0})
                    </h4>
                    {(!topic.subtopics || topic.subtopics.length === 0) ? (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No subtopics yet. Click &quot;+ Subtopic&quot; to add one.
                      </p>
                    ) : (
                      topic.subtopics.map((subtopic, idx) => (
                        <div key={idx} style={{ marginBottom: '16px', border: '1px solid var(--border-primary)', borderRadius: '8px', overflow: 'hidden' }}>
                          <div className="subtopic-item" style={{ borderRadius: 0, marginBottom: 0 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="subtopic-name" style={{ fontWeight: 600 }}>{subtopic.name}</span>
                                <span style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--bg-accent)', color: 'white', borderRadius: '4px' }}>
                                  {subtopic.content?.length || 0} items
                                </span>
                              </div>
                              {subtopic.description && (
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                  {subtopic.description}
                                </p>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <button 
                                onClick={() => setExpandedSubtopic(expandedSubtopic === `${topic._id}-${idx}` ? null : `${topic._id}-${idx}`)} 
                                className="btn btn-secondary btn-sm"
                              >
                                {expandedSubtopic === `${topic._id}-${idx}` ? '▲ Hide Content' : '▼ Show Content'}
                              </button>
                              <button onClick={() => openContentModal(topic, idx)} className="btn btn-primary btn-sm" style={{ background: '#10b981' }}>
                                + Content
                              </button>
                              <button onClick={() => openSubtopicModal(topic, idx)} className="btn btn-secondary btn-sm">
                                Edit
                              </button>
                              <button onClick={() => deleteSubtopic(topic, idx)} className="btn btn-danger btn-sm">
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          {/* Content Items */}
                          {expandedSubtopic === `${topic._id}-${idx}` && (
                            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-primary)' }}>
                              {(!subtopic.content || subtopic.content.length === 0) ? (
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '16px' }}>
                                  No content yet. Click &quot;+ Content&quot; to add lessons, videos, or code examples.
                                </p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {subtopic.content.map((content, cIdx) => (
                                    <div 
                                      key={cIdx} 
                                      style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '10px 14px',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border-primary)'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '18px' }}>
                                          {content.type === 'text' ? '📝' : 
                                           content.type === 'video' ? '🎬' : 
                                           content.type === 'code' ? '💻' : 
                                           content.type === 'pdf' ? '📄' : '🔗'}
                                        </span>
                                        <div>
                                          <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '14px' }}>
                                            {content.title}
                                          </div>
                                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{content.type}</span>
                                            {content.type === 'code' && content.language && (
                                              <span>• {content.language}</span>
                                            )}
                                            {content.duration && <span>• {content.duration} min</span>}
                                            <span style={{ color: content.approved ? '#10b981' : '#f59e0b' }}>
                                              {content.approved ? '✓ Approved' : '⏳ Pending'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', gap: '6px' }}>
                                        <button 
                                          onClick={() => openContentModal(topic, idx, cIdx)} 
                                          className="btn btn-secondary btn-sm"
                                          style={{ padding: '4px 10px' }}
                                        >
                                          Edit
                                        </button>
                                        <button 
                                          onClick={() => deleteContent(topic, idx, cIdx)} 
                                          className="btn btn-danger btn-sm"
                                          style={{ padding: '4px 10px' }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Topic Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Technology *</label>
                <select
                  className="form-select"
                  value={formData.technologyId}
                  onChange={(e) => setFormData({ ...formData, technologyId: e.target.value })}
                >
                  <option value="">Select Technology</option>
                  {technologies.map(tech => (
                    <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Topic Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Introduction to React Hooks"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the topic..."
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Access Type</label>
                  <select
                    className="form-select"
                    value={formData.accessType}
                    onChange={(e) => setFormData({ ...formData, accessType: e.target.value as 'free' | 'paid' })}
                  >
                    <option value="free">🆓 Free</option>
                    <option value="paid">💎 Paid</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : (editingTopic ? 'Update Topic' : 'Create Topic')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtopic Modal */}
      {showSubtopicModal && (
        <div className="modal-overlay" onClick={() => setShowSubtopicModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSubtopicIndex !== null ? 'Edit Subtopic' : 'Add Subtopic'}
              </h2>
              <button onClick={() => setShowSubtopicModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Subtopic Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={subtopicForm.name}
                  onChange={(e) => setSubtopicForm({ ...subtopicForm, name: e.target.value })}
                  placeholder="e.g., useState Hook"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={subtopicForm.description}
                  onChange={(e) => setSubtopicForm({ ...subtopicForm, description: e.target.value })}
                  placeholder="Brief description..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowSubtopicModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={saveSubtopic} className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : (editingSubtopicIndex !== null ? 'Update' : 'Add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Modal with Rich Editor */}
      {showContentModal && (
        <div className="modal-overlay" onClick={() => setShowContentModal(false)}>
          <div 
            className="modal" 
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '900px', width: '95%', maxHeight: '95vh' }}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {editingContentIndex !== null ? 'Edit Content' : 'Add New Content'}
              </h2>
              <button onClick={() => setShowContentModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-primary)' }}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: 'calc(95vh - 140px)', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Content Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={contentForm.title}
                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                    placeholder="e.g., Introduction to useState"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Content Type *</label>
                  <select
                    className="form-select"
                    value={contentForm.type}
                    onChange={(e) => setContentForm({ ...contentForm, type: e.target.value as ContentItem['type'] })}
                  >
                    <option value="text">📝 Text/Markdown</option>
                    <option value="code">💻 Code Example</option>
                    <option value="video">🎬 Video</option>
                    <option value="pdf">📄 PDF Document</option>
                    <option value="link">🔗 External Link</option>
                  </select>
                </div>
              </div>

              {/* Video/Link/PDF URL */}
              {(contentForm.type === 'video' || contentForm.type === 'pdf' || contentForm.type === 'link') && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">URL *</label>
                    <input
                      type="url"
                      className="form-input"
                      value={contentForm.url}
                      onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
                      placeholder={contentForm.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                    />
                  </div>
                  {contentForm.type === 'video' && (
                    <div className="form-group">
                      <label className="form-label">Duration (minutes)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={contentForm.duration}
                        onChange={(e) => setContentForm({ ...contentForm, duration: parseInt(e.target.value) || 0 })}
                        min={0}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Code Language Selector */}
              {contentForm.type === 'code' && (
                <div className="form-group">
                  <label className="form-label">Programming Language</label>
                  <select
                    className="form-select"
                    value={contentForm.language}
                    onChange={(e) => setContentForm({ ...contentForm, language: e.target.value })}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="swift">Swift</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="sql">SQL</option>
                    <option value="shell">Shell/Bash</option>
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                  </select>
                </div>
              )}

              {/* Rich Content Editor */}
              {(contentForm.type === 'text' || contentForm.type === 'code') && (
                <div className="form-group">
                  <RichContentEditor
                    label={contentForm.type === 'code' ? 'Code Content' : 'Content (Markdown supported)'}
                    value={contentForm.content || ''}
                    onChange={(val) => setContentForm({ ...contentForm, content: val })}
                    mode={contentForm.type === 'code' ? 'code' : 'markdown'}
                    language={contentForm.language}
                    height="400px"
                    showPreview={contentForm.type === 'text'}
                    showToolbar={contentForm.type === 'text'}
                    placeholder={contentForm.type === 'code' ? '// Write your code here...' : '# Start writing your content...\n\nUse **bold**, *italic*, and `code` formatting.'}
                  />
                </div>
              )}

              {/* Approval Toggle */}
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={contentForm.approved}
                    onChange={(e) => setContentForm({ ...contentForm, approved: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span className="form-label" style={{ margin: 0 }}>
                    Approved (visible to users)
                  </span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowContentModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={saveContent} className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : (editingContentIndex !== null ? 'Update Content' : 'Add Content')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
