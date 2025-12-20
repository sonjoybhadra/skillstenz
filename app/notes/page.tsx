'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

interface Note {
  id: number;
  title: string;
  content: string;
  course?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'React Hooks Summary',
      content: 'useState - State management\nuseEffect - Side effects\nuseContext - Context consumption\nuseReducer - Complex state logic',
      course: 'React - The Complete Guide',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
    },
    {
      id: 2,
      title: 'JavaScript Async Patterns',
      content: '1. Callbacks\n2. Promises\n3. Async/Await\n4. Generators',
      course: 'Complete JavaScript Course',
      createdAt: '2025-01-14',
      updatedAt: '2025-01-14',
    },
    {
      id: 3,
      title: 'Python OOP Concepts',
      content: '- Classes and Objects\n- Inheritance\n- Encapsulation\n- Polymorphism\n- Abstraction',
      course: 'Python Programming Masterclass',
      createdAt: '2025-01-12',
      updatedAt: '2025-01-13',
    },
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (selectedNote) {
      setNotes(notes.map(n =>
        n.id === selectedNote.id
          ? { ...n, content: editContent, updatedAt: new Date().toISOString().split('T')[0] }
          : n
      ));
      setSelectedNote({ ...selectedNote, content: editContent });
      setIsEditing(false);
    }
  };

  const handleDelete = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditContent('');
    setIsEditing(true);
  };

  return (
    <Layout showSidebar>
      <div className="flex h-[calc(100vh-80px)]">
        {/* Notes List */}
        <div className="w-80 border-r border-[var(--border)] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border)]">
            <button onClick={handleNewNote} className="btn-primary w-full flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
          </div>
          
          <div className="divide-y divide-[var(--border)]">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleSelectNote(note)}
                className={`p-4 cursor-pointer hover:bg-[var(--muted)] transition-colors ${
                  selectedNote?.id === note.id ? 'bg-[var(--muted)]' : ''
                }`}
              >
                <h3 className="font-medium text-[var(--foreground)] mb-1 truncate">{note.title}</h3>
                {note.course && (
                  <p className="text-xs text-[var(--primary)] mb-1">{note.course}</p>
                )}
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">{note.content}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-2">{note.updatedAt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              {/* Editor Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, title: newTitle } : n));
                    setSelectedNote({ ...selectedNote, title: newTitle });
                  }}
                  className="text-xl font-semibold text-[var(--foreground)] bg-transparent border-none focus:outline-none"
                />
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={handleSave} className="btn-primary">Save</button>
                      <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsEditing(true)} className="btn-secondary">Edit</button>
                      <button onClick={() => handleDelete(selectedNote.id)} className="btn-secondary text-red-500">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex-1 p-4 overflow-y-auto">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full p-4 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Start writing..."
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-[var(--foreground)]">
                    {selectedNote.content || 'Click Edit to start writing...'}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Select a note</h3>
                <p className="text-[var(--muted-foreground)]">Choose a note from the list or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
