'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const RichContentEditor = dynamic(() => import('@/components/UI/RichContentEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading Editor...</div>
});

interface LessonContent {
  type: 'text' | 'video' | 'pdf' | 'link' | 'code';
  title: string;
  content?: string;
  url?: string;
  duration?: number;
  language?: string;
  approved: boolean;
}

interface Subtopic {
  _id?: string;
  name: string;
  description: string;
  content: LessonContent[];
}

interface Topic {
  _id: string;
  name: string;
  description: string;
  subtopics: Subtopic[];
  technologyId: string | { _id: string; name: string; slug: string; icon: string };
}

interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminLessonsPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContentIndex, setEditingContentIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [contentForm, setContentForm] = useState<LessonContent>({
    type: 'text',
    title: '',
    content: '',
    url: '',
    duration: 0,
    language: 'javascript',
    approved: true
  });

  useEffect(() => {
    fetchTechnologies();
  }, []);

  useEffect(() => {
    if (selectedTech) {
      fetchTopics();
    } else {
      setTopics([]);
      setSelectedTopic(null);
      setSelectedSubtopic(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTech]);

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

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/topics/technology/${selectedTech}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddContent = () => {
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
    setShowContentModal(true);
  };

  const openEditContent = (index: number, content: LessonContent) => {
    setEditingContentIndex(index);
    setContentForm({ ...content });
    setShowContentModal(true);
  };

  const saveContent = async () => {
    if (!contentForm.title || !selectedTopic || selectedSubtopic === null) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const updatedSubtopics = [...selectedTopic.subtopics];
      const subtopic = updatedSubtopics[selectedSubtopic];
      
      if (!subtopic.content) subtopic.content = [];

      if (typeof editingContentIndex === 'number') {
        subtopic.content[editingContentIndex] = contentForm;
      } else {
        subtopic.content.push(contentForm);
      }

      const response = await fetch(`${API_URL}/topics/${selectedTopic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtopics: updatedSubtopics })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Content ${editingContentIndex !== null ? 'updated' : 'added'}!` });
        setShowContentModal(false);
        fetchTopics();
        // Refresh selected topic
        const newTopics = await response.json();
        setSelectedTopic(prev => {
          const updated = topics.find(t => t._id === prev?._id);
          return updated || prev;
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to save content' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async (contentIndex: number) => {
    if (!selectedTopic || selectedSubtopic === null) return;
    if (!confirm('Delete this content?')) return;

    try {
      const token = getToken();
      const updatedSubtopics = [...selectedTopic.subtopics];
      updatedSubtopics[selectedSubtopic].content = 
        updatedSubtopics[selectedSubtopic].content.filter((_, i) => i !== contentIndex);

      const response = await fetch(`${API_URL}/topics/${selectedTopic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtopics: updatedSubtopics })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Content deleted!' });
        fetchTopics();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const currentSubtopic = selectedTopic && selectedSubtopic !== null 
    ? selectedTopic.subtopics[selectedSubtopic] 
    : null;

  const contentTypes = [
    { value: 'text', label: 'Text/Article', icon: '📝' },
    { value: 'video', label: 'Video', icon: '🎬' },
    { value: 'code', label: 'Code Example', icon: '💻' },
    { value: 'pdf', label: 'PDF Document', icon: '📄' },
    { value: 'link', label: 'External Link', icon: '🔗' }
  ];

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'sql', 'html', 'css'
  ];

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
        .layout { display: grid; grid-template-columns: 300px 1fr; gap: 24px; min-height: calc(100vh - 200px); }
        .sidebar { display: flex; flex-direction: column; gap: 16px; }
        .select-box { padding: 12px; border: 1px solid var(--border-primary); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary); width: 100%; font-size: 14px; }
        .tree { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; overflow: hidden; }
        .tree-header { padding: 16px; border-bottom: 1px solid var(--border-primary); font-weight: 600; color: var(--text-primary); }
        .tree-item { padding: 12px 16px; cursor: pointer; border-bottom: 1px solid var(--border-primary); transition: background 0.2s; }
        .tree-item:hover { background: var(--bg-hover, #f8fafc); }
        .tree-item.active { background: rgba(9, 104, 198, 0.1); border-left: 3px solid #0968c6; }
        .tree-item:last-child { border-bottom: none; }
        .tree-topic { font-weight: 500; color: var(--text-primary); }
        .tree-subtopic { padding-left: 20px; font-size: 13px; color: var(--text-muted); }
        .main-content { min-height: 400px; }
        .content-header { padding: 20px; border-bottom: 1px solid var(--border-primary); display: flex; justify-content: space-between; align-items: center; }
        .content-title { font-size: 18px; font-weight: 600; color: var(--text-primary); }
        .content-body { padding: 20px; }
        .content-list { display: flex; flex-direction: column; gap: 12px; }
        .content-item { display: flex; gap: 16px; padding: 16px; background: var(--bg-primary, #f8fafc); border-radius: 8px; align-items: flex-start; }
        .content-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .content-icon.text { background: rgba(59, 130, 246, 0.1); }
        .content-icon.video { background: rgba(239, 68, 68, 0.1); }
        .content-icon.code { background: rgba(16, 185, 129, 0.1); }
        .content-icon.pdf { background: rgba(245, 158, 11, 0.1); }
        .content-icon.link { background: rgba(139, 92, 246, 0.1); }
        .content-details { flex: 1; }
        .content-details h4 { font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .content-details p { font-size: 13px; color: var(--text-muted); }
        .content-actions { display: flex; gap: 8px; }
        .empty-state { padding: 60px 20px; text-align: center; color: var(--text-muted); }
        .message { padding: 12px 16px; margin-bottom: 24px; border-radius: 8px; }
        .message-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .message-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: var(--bg-secondary, #fff); border-radius: 16px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; }
        .modal-header { padding: 20px; border-bottom: 1px solid var(--border-primary); display: flex; justify-content: space-between; align-items: center; }
        .modal-title { font-size: 18px; font-weight: 600; color: var(--text-primary); }
        .modal-body { padding: 20px; }
        .modal-footer { padding: 20px; border-top: 1px solid var(--border-primary); display: flex; justify-content: flex-end; gap: 12px; }
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 13px; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; }
        .form-input, .form-select, .form-textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--border-primary); border-radius: 8px; background: var(--bg-primary); color: var(--text-primary); font-size: 14px; }
        .form-textarea { min-height: 150px; resize: vertical; font-family: 'Fira Code', monospace; }
        .type-selector { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .type-btn { padding: 12px; border: 1px solid var(--border-primary); border-radius: 8px; background: var(--bg-primary); cursor: pointer; text-align: center; transition: all 0.2s; }
        .type-btn:hover { border-color: #0968c6; }
        .type-btn.active { border-color: #0968c6; background: rgba(9, 104, 198, 0.1); }
        .type-btn-icon { font-size: 24px; margin-bottom: 4px; }
        .type-btn-label { font-size: 11px; color: var(--text-muted); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .badge-approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .badge-pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .spinner { width: 40px; height: 40px; border: 3px solid var(--border-primary); border-top-color: #0968c6; border-radius: 50%; animation: spin 1s linear infinite; margin: 40px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .layout { grid-template-columns: 1fr; }
          .type-selector { grid-template-columns: repeat(3, 1fr); }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">Lessons & Content</h1>
          <p className="page-subtitle">Add and manage lesson content for each subtopic</p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <select
            className="select-box"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
          >
            <option value="">Select Technology</option>
            {technologies.map(tech => (
              <option key={tech._id} value={tech._id}>{tech.icon} {tech.name}</option>
            ))}
          </select>

          <div className="tree">
            <div className="tree-header">Topics & Subtopics</div>
            {loading ? (
              <div className="spinner"></div>
            ) : topics.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                {selectedTech ? 'No topics found' : 'Select a technology'}
              </div>
            ) : (
              topics.map(topic => (
                <div key={topic._id}>
                  <div 
                    className={`tree-item tree-topic ${selectedTopic?._id === topic._id && selectedSubtopic === null ? 'active' : ''}`}
                    onClick={() => { setSelectedTopic(topic); setSelectedSubtopic(null); }}
                  >
                    📂 {topic.name}
                    <span style={{ float: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {topic.subtopics?.length || 0} subtopics
                    </span>
                  </div>
                  {topic.subtopics?.map((sub, idx) => (
                    <div
                      key={idx}
                      className={`tree-item tree-subtopic ${selectedTopic?._id === topic._id && selectedSubtopic === idx ? 'active' : ''}`}
                      onClick={() => { setSelectedTopic(topic); setSelectedSubtopic(idx); }}
                    >
                      📄 {sub.name}
                      <span style={{ float: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {sub.content?.length || 0}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="card main-content">
          {!currentSubtopic ? (
            <div className="empty-state">
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📚</p>
              <p>Select a subtopic to manage its lesson content</p>
            </div>
          ) : (
            <>
              <div className="content-header">
                <div>
                  <div className="content-title">{currentSubtopic.name}</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {currentSubtopic.description || 'No description'}
                  </p>
                </div>
                <button className="btn btn-primary" onClick={openAddContent}>
                  + Add Content
                </button>
              </div>

              <div className="content-body">
                {!currentSubtopic.content?.length ? (
                  <div className="empty-state">
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>📝</p>
                    <p>No content yet. Add your first lesson content!</p>
                    <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={openAddContent}>
                      + Add Content
                    </button>
                  </div>
                ) : (
                  <div className="content-list">
                    {currentSubtopic.content.map((item, idx) => (
                      <div key={idx} className="content-item">
                        <div className={`content-icon ${item.type}`}>
                          {contentTypes.find(t => t.value === item.type)?.icon || '📝'}
                        </div>
                        <div className="content-details">
                          <h4>{item.title}</h4>
                          <p>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            {item.duration ? ` • ${item.duration} min` : ''}
                            {item.language ? ` • ${item.language}` : ''}
                          </p>
                        </div>
                        <span className={`badge ${item.approved ? 'badge-approved' : 'badge-pending'}`}>
                          {item.approved ? 'Approved' : 'Pending'}
                        </span>
                        <div className="content-actions">
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditContent(idx, item)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteContent(idx)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Modal */}
      {showContentModal && (
        <div className="modal-overlay" onClick={() => setShowContentModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {editingContentIndex !== null ? 'Edit Content' : 'Add Content'}
              </span>
              <button 
                onClick={() => setShowContentModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Content Type</label>
                <div className="type-selector">
                  {contentTypes.map(type => (
                    <div
                      key={type.value}
                      className={`type-btn ${contentForm.type === type.value ? 'active' : ''}`}
                      onClick={() => setContentForm({ ...contentForm, type: type.value as LessonContent['type'] })}
                    >
                      <div className="type-btn-icon">{type.icon}</div>
                      <div className="type-btn-label">{type.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={contentForm.title}
                  onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                  placeholder="Enter content title"
                />
              </div>

              {(contentForm.type === 'text' || contentForm.type === 'code') && (
                <div className="form-group">
                  <label className="form-label">
                    {contentForm.type === 'code' ? 'Code' : 'Content'} *
                  </label>
                  <RichContentEditor
                    value={contentForm.content || ''}
                    onChange={(value) => setContentForm({ ...contentForm, content: value })}
                    mode={contentForm.type === 'code' ? 'code' : 'markdown'}
                    language={contentForm.type === 'code' ? (contentForm.language || 'javascript') : undefined}
                    height="300px"
                    showPreview={true}
                    showToolbar={true}
                  />
                </div>
              )}

              {contentForm.type === 'code' && (
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select
                    className="form-select"
                    value={contentForm.language || 'javascript'}
                    onChange={(e) => setContentForm({ ...contentForm, language: e.target.value })}
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              )}

              {(contentForm.type === 'video' || contentForm.type === 'pdf' || contentForm.type === 'link') && (
                <div className="form-group">
                  <label className="form-label">URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    value={contentForm.url || ''}
                    onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
                    placeholder="Enter URL"
                  />
                </div>
              )}

              {contentForm.type === 'video' && (
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={contentForm.duration || 0}
                    onChange={(e) => setContentForm({ ...contentForm, duration: parseInt(e.target.value) || 0 })}
                    placeholder="Video duration in minutes"
                  />
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={contentForm.approved}
                    onChange={(e) => setContentForm({ ...contentForm, approved: e.target.checked })}
                  />
                  <span className="form-label" style={{ margin: 0 }}>Approved (visible to users)</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowContentModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveContent} disabled={saving}>
                {saving ? 'Saving...' : (editingContentIndex !== null ? 'Update' : 'Add')} Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
