'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Note {
  _id: string;
  title: string;
  content: string;
  course?: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const noteColors = [
  { id: 'default', color: 'var(--bg-card)', border: 'var(--border-primary)' },
  { id: 'yellow', color: '#fef9c3', border: '#fde047' },
  { id: 'green', color: '#dcfce7', border: '#86efac' },
  { id: 'blue', color: '#dbeafe', border: '#93c5fd' },
  { id: 'purple', color: '#f3e8ff', border: '#c4b5fd' },
  { id: 'pink', color: '#fce7f3', border: '#f9a8d4' },
  { id: 'orange', color: '#ffedd5', border: '#fdba74' }
];

export default function NotesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '', color: 'default', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewNote, setShowNewNote] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/notes');
        return;
      }
      fetchNotes();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/notes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || data || []);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      // Use sample data for demo
      setNotes([
        {
          _id: '1',
          title: 'React Hooks Summary',
          content: 'useState - State management\nuseEffect - Side effects\nuseContext - Context consumption\nuseReducer - Complex state logic\nuseCallback - Memoize callbacks\nuseMemo - Memoize values',
          course: 'React - The Complete Guide',
          tags: ['react', 'hooks'],
          color: 'blue',
          isPinned: true,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        },
        {
          _id: '2',
          title: 'JavaScript Async Patterns',
          content: '1. Callbacks\n2. Promises\n3. Async/Await\n4. Generators\n5. Observables',
          course: 'Complete JavaScript Course',
          tags: ['javascript', 'async'],
          color: 'yellow',
          isPinned: false,
          createdAt: '2025-01-14T10:00:00Z',
          updatedAt: '2025-01-14T10:00:00Z'
        },
        {
          _id: '3',
          title: 'Python OOP Concepts',
          content: '- Classes and Objects\n- Inheritance\n- Encapsulation\n- Polymorphism\n- Abstraction',
          course: 'Python Programming Masterclass',
          tags: ['python', 'oop'],
          color: 'green',
          isPinned: false,
          createdAt: '2025-01-12T10:00:00Z',
          updatedAt: '2025-01-13T10:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setEditForm({
      title: note.title,
      content: note.content,
      color: note.color,
      tags: note.tags.join(', ')
    });
    setIsEditing(false);
    setShowNewNote(false);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setEditForm({ title: '', content: '', color: 'default', tags: '' });
    setShowNewNote(true);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editForm.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const noteData = {
        title: editForm.title,
        content: editForm.content,
        color: editForm.color,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (showNewNote) {
        const response = await fetch(`${API_URL}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(noteData)
        });
        if (response.ok) {
          const newNote = await response.json();
          setNotes([newNote, ...notes]);
          setSelectedNote(newNote);
          setShowNewNote(false);
          toast.success('Note created');
        }
      } else if (selectedNote) {
        const response = await fetch(`${API_URL}/notes/${selectedNote._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(noteData)
        });
        if (response.ok) {
          const updatedNote = await response.json();
          setNotes(notes.map(n => n._id === selectedNote._id ? updatedNote : n));
          setSelectedNote(updatedNote);
          toast.success('Note updated');
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      // Demo mode - update locally
      if (showNewNote) {
        const newNote: Note = {
          _id: Date.now().toString(),
          title: editForm.title,
          content: editForm.content,
          color: editForm.color,
          tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);
        setShowNewNote(false);
        toast.success('Note created');
      } else if (selectedNote) {
        const updatedNote = {
          ...selectedNote,
          title: editForm.title,
          content: editForm.content,
          color: editForm.color,
          tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          updatedAt: new Date().toISOString()
        };
        setNotes(notes.map(n => n._id === selectedNote._id ? updatedNote : n));
        setSelectedNote(updatedNote);
        toast.success('Note updated');
      }
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Delete error:', error);
    }
    
    setNotes(notes.filter(n => n._id !== id));
    if (selectedNote?._id === id) {
      setSelectedNote(null);
    }
    toast.success('Note deleted');
  };

  const handlePin = async (note: Note) => {
    const updatedNote = { ...note, isPinned: !note.isPinned };
    setNotes(notes.map(n => n._id === note._id ? updatedNote : n));
    if (selectedNote?._id === note._id) {
      setSelectedNote(updatedNote);
    }
  };

  const getColorStyle = (colorId: string) => {
    const colorObj = noteColors.find(c => c.id === colorId) || noteColors[0];
    return colorObj;
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  if (authLoading || loading) {
    return (
      <Layout showSidebar>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border-primary)] border-t-[var(--bg-accent)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Notes List */}
        <div className="w-80 flex-shrink-0 border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border-primary)]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">My Notes</h1>
              <button
                onClick={handleNewNote}
                className="w-9 h-9 rounded-lg bg-[var(--bg-accent)] text-white flex items-center justify-center hover:bg-[var(--bg-accent-hover)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto">
            {pinnedNotes.length > 0 && (
              <div className="px-4 pt-4">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Pinned</p>
                <div className="space-y-2">
                  {pinnedNotes.map((note) => {
                    const colorStyle = getColorStyle(note.color);
                    return (
                      <div
                        key={note._id}
                        onClick={() => handleSelectNote(note)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedNote?._id === note._id ? 'ring-2 ring-[var(--bg-accent)]' : ''
                        }`}
                        style={{ 
                          backgroundColor: colorStyle.color,
                          borderLeft: `4px solid ${colorStyle.border}`
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-[var(--text-primary)] text-sm line-clamp-1">{note.title}</h3>
                          <span className="text-yellow-500 text-sm">📌</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{note.content}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {otherNotes.length > 0 && (
              <div className="px-4 pt-4 pb-4">
                {pinnedNotes.length > 0 && (
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Others</p>
                )}
                <div className="space-y-2">
                  {otherNotes.map((note) => {
                    const colorStyle = getColorStyle(note.color);
                    return (
                      <div
                        key={note._id}
                        onClick={() => handleSelectNote(note)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedNote?._id === note._id ? 'ring-2 ring-[var(--bg-accent)]' : ''
                        }`}
                        style={{ 
                          backgroundColor: colorStyle.color,
                          borderLeft: `4px solid ${colorStyle.border}`
                        }}
                      >
                        <h3 className="font-medium text-[var(--text-primary)] text-sm line-clamp-1">{note.title}</h3>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{note.content}</p>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {note.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-black/10 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredNotes.length === 0 && (
              <div className="p-4 text-center">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-[var(--text-secondary)] text-sm">
                  {searchQuery ? 'No notes found' : 'No notes yet'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Note Editor */}
        <div className="flex-1 flex flex-col bg-[var(--bg-primary)]">
          {selectedNote || showNewNote ? (
            <>
              {/* Editor Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex gap-1">
                      {noteColors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setEditForm({ ...editForm, color: c.id })}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            editForm.color === c.id ? 'scale-110' : ''
                          }`}
                          style={{ 
                            backgroundColor: c.color, 
                            borderColor: editForm.color === c.id ? 'var(--bg-accent)' : c.border 
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--text-muted)]">
                      {selectedNote ? new Date(selectedNote.updatedAt).toLocaleDateString() : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => { setIsEditing(false); setShowNewNote(false); }}
                        className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-[var(--bg-accent)] text-white text-sm rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : selectedNote && (
                    <>
                      <button
                        onClick={() => handlePin(selectedNote)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedNote.isPinned ? 'text-yellow-500' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        📌
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedNote._id)}
                        className="px-4 py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                {isEditing ? (
                  <div className="max-w-3xl mx-auto space-y-4">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Note title..."
                      className="w-full text-2xl font-bold bg-transparent text-[var(--text-primary)] focus:outline-none border-none"
                    />
                    <input
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                      placeholder="Tags (comma separated)..."
                      className="w-full text-sm bg-transparent text-[var(--text-secondary)] focus:outline-none border-none"
                    />
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      placeholder="Start writing your note..."
                      className="w-full h-[calc(100vh-350px)] bg-transparent text-[var(--text-primary)] focus:outline-none resize-none"
                    />
                  </div>
                ) : selectedNote && (
                  <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{selectedNote.title}</h1>
                    {selectedNote.course && (
                      <p className="text-sm text-[var(--text-accent)] mb-4">📚 {selectedNote.course}</p>
                    )}
                    {selectedNote.tags.length > 0 && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {selectedNote.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-[var(--text-primary)] leading-relaxed">
                      {selectedNote.content}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">📝</span>
                </div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Select a note</h2>
                <p className="text-[var(--text-secondary)] mb-6">Choose a note from the list or create a new one</p>
                <button onClick={handleNewNote} className="btn btn-primary">
                  Create New Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
