'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function WhiteboardPage() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'text'>('pen');

  const colors = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-4">
            {/* Tools */}
            <div className="flex gap-1">
              <button
                onClick={() => setTool('pen')}
                className={`p-2 rounded-lg ${tool === 'pen' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--foreground)]'}`}
                title="Pen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--foreground)]'}`}
                title="Eraser"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setTool('text')}
                className={`p-2 rounded-lg ${tool === 'text' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--foreground)]'}`}
                title="Text"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            {/* Colors */}
            <div className="flex gap-1 pl-4 border-l border-[var(--border)]">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-[var(--primary)]' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-2 pl-4 border-l border-[var(--border)]">
              <span className="text-sm text-[var(--muted-foreground)]">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-[var(--foreground)] w-6">{brushSize}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Undo
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
              Redo
            </button>
            <button className="btn-secondary">Clear All</button>
            <button className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Save
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-white overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg">Start drawing on the whiteboard</p>
              <p className="text-sm">Use the tools above to draw, write, or erase</p>
            </div>
          </div>
          {/* Canvas would be rendered here with actual drawing functionality */}
          <canvas className="absolute inset-0 w-full h-full cursor-crosshair" />
        </div>
      </div>
    </Layout>
  );
}
