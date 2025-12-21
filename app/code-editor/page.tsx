'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

interface FileItem {
  id: string;
  name: string;
  language: string;
  content: string;
}

const defaultFiles: FileItem[] = [
  { 
    id: '1',
    name: 'index.html', 
    language: 'html', 
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Hello World! 🚀</h1>
    <p>Edit this HTML to see live changes</p>
    <button onclick="greet()">Click Me</button>
  </div>
  <script src="script.js"></script>
</body>
</html>` 
  },
  { 
    id: '2',
    name: 'style.css', 
    language: 'css', 
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
  color: #333;
  margin-bottom: 16px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

button {
  padding: 12px 24px;
  font-size: 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}` 
  },
  { 
    id: '3',
    name: 'script.js', 
    language: 'javascript', 
    content: `// JavaScript Code
console.log("Hello from JavaScript!");

function greet() {
  const name = prompt("What's your name?");
  if (name) {
    alert(\`Hello, \${name}! Welcome to the code editor! 🎉\`);
  }
}

// Add more interactive code here
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
});` 
  },
];

export default function CodeEditorPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>(defaultFiles);
  const [activeFileId, setActiveFileId] = useState(files[0].id);
  const [showPreview, setShowPreview] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/code-editor');
    }
  }, [isAuthenticated, authLoading, router]);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const updateFileContent = useCallback((content: string) => {
    setFiles(prev => prev.map(f => 
      f.id === activeFileId ? { ...f, content } : f
    ));
  }, [activeFileId]);

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const getPreviewHtml = useCallback(() => {
    const htmlFile = files.find(f => f.language === 'html');
    const cssFile = files.find(f => f.language === 'css');
    const jsFile = files.find(f => f.language === 'javascript');

    if (!htmlFile) return '';

    let html = htmlFile.content;
    
    // Inject CSS
    if (cssFile) {
      html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
    }
    
    // Inject JS
    if (jsFile) {
      html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
    }

    return html;
  }, [files]);

  const addNewFile = () => {
    const name = prompt('Enter file name (e.g., app.js):');
    if (!name) return;
    
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const language = ext === 'html' ? 'html' : ext === 'css' ? 'css' : ext === 'js' ? 'javascript' : 'text';
    
    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      language,
      content: ''
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    toast.success(`Created ${name}`);
  };

  const deleteFile = (id: string) => {
    if (files.length <= 1) {
      toast.error('Cannot delete the last file');
      return;
    }
    
    if (confirm('Delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== id));
      if (activeFileId === id) {
        setActiveFileId(files[0].id);
      }
      toast.success('File deleted');
    }
  };

  const downloadProject = () => {
    const zip = files.map(f => `=== ${f.name} ===\n${f.content}`).join('\n\n');
    const blob = new Blob([zip], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-files.txt';
    a.click();
    toast.success('Project downloaded!');
  };

  const getFileIcon = (lang: string) => {
    switch (lang) {
      case 'html': return '📄';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      default: return '📝';
    }
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
      <div style={{ display: 'flex', height: 'calc(100vh - var(--navbar-height))' }}>
        {/* File Explorer */}
        <div style={{
          width: '200px',
          borderRight: '1px solid var(--border-primary)',
          background: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Explorer
            </span>
            <button 
              onClick={addNewFile}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'var(--text-muted)'
              }}
              title="New File"
            >
              +
            </button>
          </div>
          <div style={{ padding: '8px', flex: 1, overflow: 'auto' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '8px' }}>
              PROJECT FILES
            </div>
            {files.map(file => (
              <div
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: activeFileId === file.id ? 'var(--bg-hover)' : 'transparent',
                  color: activeFileId === file.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{getFileIcon(file.language)}</span>
                  <span style={{ fontSize: '13px' }}>{file.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.5,
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px', borderTop: '1px solid var(--border-primary)' }}>
            <button onClick={downloadProject} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              📥 Download
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)'
          }}>
            {files.map(file => (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                style={{
                  padding: '10px 16px',
                  fontSize: '13px',
                  border: 'none',
                  borderRight: '1px solid var(--border-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeFileId === file.id ? 'var(--bg-card)' : 'transparent',
                  color: activeFileId === file.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderTop: activeFileId === file.id ? '2px solid var(--bg-accent)' : '2px solid transparent'
                }}
              >
                {getFileIcon(file.language)}
                {file.name}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              {showPreview ? '◀ Hide Preview' : '▶ Show Preview'}
            </button>
          </div>

          {/* Editor + Preview */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Code Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, display: 'flex' }}>
                {/* Line Numbers */}
                <div style={{
                  width: '50px',
                  background: 'var(--bg-secondary)',
                  padding: '16px 8px',
                  textAlign: 'right',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: 'var(--text-muted)',
                  userSelect: 'none',
                  overflow: 'hidden'
                }}>
                  {activeFile.content.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                
                {/* Editor */}
                <textarea
                  value={activeFile.content}
                  onChange={(e) => updateFileContent(e.target.value)}
                  spellCheck={false}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    border: 'none',
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Status Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 16px',
                background: 'var(--bg-accent)',
                color: 'white',
                fontSize: '11px'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>{activeFile.language.toUpperCase()}</span>
                  <span>UTF-8</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>Lines: {activeFile.content.split('\n').length}</span>
                  <span>Chars: {activeFile.content.length}</span>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div style={{
                width: '45%',
                borderLeft: '1px solid var(--border-primary)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--border-primary)',
                  background: 'var(--bg-secondary)'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    🖥️ Live Preview
                  </span>
                  <button
                    onClick={refreshPreview}
                    className="btn btn-ghost btn-sm"
                    title="Refresh"
                  >
                    🔄
                  </button>
                </div>
                <div style={{ flex: 1, background: '#fff' }}>
                  <iframe
                    key={previewKey}
                    title="Preview"
                    srcDoc={getPreviewHtml()}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    sandbox="allow-scripts allow-modals"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
