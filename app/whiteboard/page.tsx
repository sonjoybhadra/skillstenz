'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

interface DrawPoint {
  x: number;
  y: number;
}

interface DrawAction {
  type: 'draw' | 'erase' | 'text';
  points: DrawPoint[];
  color: string;
  size: number;
  text?: string;
}

export default function WhiteboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'text'>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [redoStack, setRedoStack] = useState<DrawAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<DrawPoint | null>(null);

  const colors = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#ffffff'];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/whiteboard');
    }
  }, [isAuthenticated, authLoading, router]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    actions.forEach(action => {
      if (action.type === 'draw' || action.type === 'erase') {
        ctx.strokeStyle = action.type === 'erase' ? '#ffffff' : action.color;
        ctx.lineWidth = action.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        action.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (action.type === 'text' && action.text && action.points[0]) {
        ctx.fillStyle = action.color;
        ctx.font = `${action.size * 3}px Arial`;
        ctx.fillText(action.text, action.points[0].x, action.points[0].y);
      }
    });
  }, [actions]);

  useEffect(() => {
    redrawCanvas();
  }, [actions, redrawCanvas]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent): DrawPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === 'text') {
      const pos = getPosition(e);
      setTextPosition(pos);
      return;
    }

    setIsDrawing(true);
    const pos = getPosition(e);
    setCurrentAction({
      type: tool === 'eraser' ? 'erase' : 'draw',
      points: [pos],
      color,
      size: brushSize
    });
    setRedoStack([]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentAction || tool === 'text') return;
    
    const pos = getPosition(e);
    const newAction = {
      ...currentAction,
      points: [...currentAction.points, pos]
    };
    setCurrentAction(newAction);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = currentAction.type === 'erase' ? '#ffffff' : currentAction.color;
    ctx.lineWidth = currentAction.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    const points = newAction.points;
    if (points.length >= 2) {
      ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && currentAction && currentAction.points.length > 1) {
      setActions(prev => [...prev, currentAction]);
    }
    setIsDrawing(false);
    setCurrentAction(null);
  };

  const handleAddText = () => {
    if (!textInput.trim() || !textPosition) return;
    
    setActions(prev => [...prev, {
      type: 'text',
      points: [textPosition],
      color,
      size: brushSize,
      text: textInput
    }]);
    setTextInput('');
    setTextPosition(null);
    setRedoStack([]);
  };

  const undo = () => {
    if (actions.length === 0) return;
    setRedoStack(prev => [...prev, actions[actions.length - 1]]);
    setActions(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    setActions(prev => [...prev, redoStack[redoStack.length - 1]]);
    setRedoStack(prev => prev.slice(0, -1));
  };

  const clearAll = () => {
    if (actions.length === 0) return;
    if (confirm('Clear the entire whiteboard?')) {
      setActions([]);
      setRedoStack([]);
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Whiteboard saved as image!');
  };

  if (authLoading) {
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
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--navbar-height))' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-primary)',
          background: 'var(--bg-card)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Tools */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'pen', icon: '✏️', label: 'Pen' },
                { id: 'eraser', icon: '🧹', label: 'Eraser' },
                { id: 'text', icon: '📝', label: 'Text' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id as typeof tool)}
                  title={t.label}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    background: tool === t.id ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                    color: tool === t.id ? 'white' : 'var(--text-primary)',
                    fontSize: '16px'
                  }}
                >
                  {t.icon}
                </button>
              ))}
            </div>

            {/* Colors */}
            <div style={{ display: 'flex', gap: '4px', paddingLeft: '16px', borderLeft: '1px solid var(--border-primary)' }}>
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: color === c ? '3px solid var(--bg-accent)' : '2px solid var(--border-primary)',
                    backgroundColor: c,
                    cursor: 'pointer'
                  }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: '28px', height: '28px', cursor: 'pointer', border: 'none' }}
              />
            </div>

            {/* Brush Size */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '16px', borderLeft: '1px solid var(--border-primary)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Size:</span>
              <input
                type="range"
                min="1"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{ width: '80px' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', width: '24px' }}>{brushSize}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={undo} className="btn btn-secondary btn-sm" disabled={actions.length === 0}>↩️ Undo</button>
            <button onClick={redo} className="btn btn-secondary btn-sm" disabled={redoStack.length === 0}>↪️ Redo</button>
            <button onClick={clearAll} className="btn btn-secondary btn-sm" disabled={actions.length === 0}>🗑️ Clear</button>
            <button onClick={saveImage} className="btn btn-primary btn-sm">💾 Save</button>
          </div>
        </div>

        {/* Text input modal */}
        {textPosition && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'var(--bg-card)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3 style={{ marginBottom: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Add Text</h3>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                autoFocus
                className="input"
                style={{ marginBottom: '16px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddText();
                  if (e.key === 'Escape') setTextPosition(null);
                }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setTextPosition(null)} className="btn btn-secondary">Cancel</button>
                <button onClick={handleAddText} className="btn btn-primary">Add Text</button>
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div ref={containerRef} style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#ffffff' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              position: 'absolute',
              inset: 0,
              cursor: tool === 'text' ? 'text' : 'crosshair',
              touchAction: 'none'
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
