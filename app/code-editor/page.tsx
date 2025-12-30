'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
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
    <div id="output"></div>
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
  transition: all 0.2s;
}

button:hover {
  transform: scale(1.05);
  background: #764ba2;
}

#output {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  min-height: 40px;
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
    const output = document.getElementById('output');
    output.innerHTML = \`<strong>Hello, \${name}! 🎉</strong>\`;
    console.log(\`Greeted: \${name}\`);
  }
}

// Add more interactive code here
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and ready!');
});` 
  },
];

const languageIcons: Record<string, string> = {
  html: '📄',
  css: '🎨',
  javascript: '⚡',
  json: '📦',
  text: '📝'
};

const languageColors: Record<string, string> = {
  html: '#e34f26',
  css: '#264de4',
  javascript: '#f7df1e',
  json: '#6b7280',
  text: '#9ca3af'
};

export default function CodeEditorPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>(defaultFiles);
  const [activeFileId, setActiveFileId] = useState(files[0].id);
  const [showPreview, setShowPreview] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(true);

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
    toast.success('Preview refreshed!');
  };

  const getPreviewHtml = useCallback(() => {
    const htmlFile = files.find(f => f.language === 'html');
    const cssFile = files.find(f => f.language === 'css');
    const jsFile = files.find(f => f.language === 'javascript');

    if (!htmlFile) return '<p style="padding:20px;color:#888;">No HTML file found</p>';

    let html = htmlFile.content;
    
    // Inject CSS
    if (cssFile) {
      html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
    }
    
    // Inject JS with console capture
    const jsContent = jsFile ? `
      (function() {
        const originalLog = console.log;
        console.log = function(...args) {
          originalLog.apply(console, args);
          window.parent.postMessage({ type: 'console', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
        };
      })();
      ${jsFile.content}
    ` : '';
    
    if (jsContent) {
      html = html.replace('</body>', `<script>${jsContent}</script></body>`);
    }

    return html;
  }, [files]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'console') {
        setConsoleLogs(prev => [...prev.slice(-50), e.data.message]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const addNewFile = () => {
    const name = prompt('Enter file name (e.g., app.js):');
    if (!name) return;
    
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const language = ext === 'html' ? 'html' : ext === 'css' ? 'css' : ext === 'js' ? 'javascript' : ext === 'json' ? 'json' : 'text';
    
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

  const renameFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    
    const newName = prompt('Enter new file name:', file.name);
    if (!newName || newName === file.name) return;
    
    const ext = newName.split('.').pop()?.toLowerCase() || '';
    const language = ext === 'html' ? 'html' : ext === 'css' ? 'css' : ext === 'js' ? 'javascript' : ext === 'json' ? 'json' : 'text';
    
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName, language } : f));
    toast.success(`Renamed to ${newName}`);
  };

  const deleteFile = (id: string) => {
    if (files.length <= 1) {
      toast.error('Cannot delete the last file');
      return;
    }
    
    const file = files.find(f => f.id === id);
    if (confirm(`Delete "${file?.name}"?`)) {
      setFiles(prev => prev.filter(f => f.id !== id));
      if (activeFileId === id) {
        setActiveFileId(files[0].id === id ? files[1].id : files[0].id);
      }
      toast.success('File deleted');
    }
  };

  const downloadProject = () => {
    files.forEach(f => {
      const blob = new Blob([f.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = f.name;
      a.click();
      URL.revokeObjectURL(url);
    });
    toast.success('Files downloaded!');
  };

  const resetProject = () => {
    if (confirm('Reset to default files? All changes will be lost.')) {
      setFiles(defaultFiles);
      setActiveFileId(defaultFiles[0].id);
      setConsoleLogs([]);
      toast.success('Project reset!');
    }
  };

  if (authLoading) {
    return (
      <Layout showSidebar>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar>
      <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0d1117]' : ''}`} style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 64px)' }}>
        {/* Professional Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#161b22] to-[#0d1117] border-b border-[#30363d]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                <span className="text-white text-sm">{'</>'}</span>
              </div>
              <div>
                <EditorTitle />
                <span className="text-[10px] text-[#8b949e]">HTML • CSS • JavaScript</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={resetProject} className="px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors">
              🔄 Reset
            </button>
            <button onClick={refreshPreview} className="px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors">
              ▶️ Run
            </button>
            <button onClick={downloadProject} className="px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors">
              📥 Download
            </button>
            <div className="w-px h-4 bg-[#30363d] mx-1" />
            <button 
              onClick={() => setShowPreview(!showPreview)} 
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${showPreview ? 'text-white bg-[#238636]' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}
            >
              {showPreview ? '🖥️ Preview On' : '🖥️ Preview Off'}
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors"
            >
              {isFullscreen ? '⬜' : '⬛'}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-52 flex-shrink-0 bg-[#161b22] border-r border-[#30363d] flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363d]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
                Explorer
              </span>
              <button 
                onClick={addNewFile}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors"
                title="New File"
              >
                <span className="text-lg font-light">+</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto py-2">
              <div className="px-3 mb-2">
                <div className="text-[10px] font-semibold uppercase text-[#8b949e] mb-2 flex items-center gap-1">
                  <span>📁</span> PROJECT
                </div>
              </div>
              {files.map(file => (
                <div
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`group flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all text-sm ${
                    activeFileId === file.id 
                      ? 'bg-[#1f6feb]/20 text-white border-l-2 border-l-[#1f6feb]' 
                      : 'hover:bg-[#21262d] text-[#c9d1d9] border-l-2 border-l-transparent'
                  }`}
                >
                  <span className="text-xs">{languageIcons[file.language] || '📄'}</span>
                  <span className="flex-1 truncate text-[13px]">{file.name}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); renameFile(file.id); }}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#30363d] text-[10px]"
                      title="Rename"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f85149]/20 text-[10px]"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-[#30363d]">
              <div className="text-[10px] text-[#8b949e] text-center">
                {files.length} files
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
            {/* File Tabs */}
            <div className="flex bg-[#161b22] border-b border-[#30363d] overflow-x-auto">
              {files.map(file => (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-[13px] border-r border-[#30363d] transition-colors whitespace-nowrap ${
                    activeFileId === file.id 
                      ? 'bg-[#0d1117] text-white border-t-2 border-t-[#1f6feb]' 
                      : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] border-t-2 border-t-transparent'
                  }`}
                >
                  <span className="text-xs">{languageIcons[file.language]}</span>
                  {file.name}
                  {activeFileId === file.id && (
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ background: languageColors[file.language] || '#888' }} 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Editor Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Code Editor Panel */}
              <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'flex-1'} min-w-0 border-r border-[#30363d]`}>
                <div className="flex-1 flex overflow-hidden">
                  {/* Line Numbers */}
                  <div className="w-12 flex-shrink-0 bg-[#0d1117] py-3 text-right pr-3 font-mono text-[13px] text-[#484f58] select-none overflow-hidden border-r border-[#21262d]">
                    {activeFile.content.split('\n').map((_, i) => (
                      <div key={i} className="leading-6 h-6">{i + 1}</div>
                    ))}
                  </div>
                  
                  {/* Code Textarea */}
                  <textarea
                    value={activeFile.content}
                    onChange={(e) => updateFileContent(e.target.value)}
                    spellCheck={false}
                    className="flex-1 bg-[#0d1117] text-[#c9d1d9] font-mono text-[13px] leading-6 py-3 px-4 resize-none outline-none border-none focus:ring-0"
                    style={{ tabSize: 2, caretColor: '#58a6ff' }}
                    placeholder="Start typing your code here..."
                  />
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between px-4 py-1 bg-[#1f6feb] text-white text-[11px]">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{activeFile.language.toUpperCase()}</span>
                    <span>UTF-8</span>
                    <span>Spaces: 2</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Ln {activeFile.content.split('\n').length}</span>
                    <span>Col 1</span>
                    <span>{activeFile.content.length} chars</span>
                  </div>
                </div>
              </div>

              {/* Preview Panel */}
              {showPreview && (
                <div className="w-1/2 flex flex-col">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#f85149]"></span>
                        <span className="w-3 h-3 rounded-full bg-[#f0883e]"></span>
                        <span className="w-3 h-3 rounded-full bg-[#3fb950]"></span>
                      </div>
                      <span className="text-[13px] font-medium text-[#c9d1d9] ml-2">Preview</span>
                    </div>
                    <button onClick={refreshPreview} className="text-[11px] text-[#58a6ff] hover:text-[#79c0ff] transition-colors">
                      ↻ Refresh
                    </button>
                  </div>

                  {/* Preview iframe */}
                  <div className="flex-1 bg-white">
                    <iframe
                      key={previewKey}
                      title="Preview"
                      srcDoc={getPreviewHtml()}
                      className="w-full h-full border-none"
                      sandbox="allow-scripts allow-modals allow-forms"
                    />
                  </div>

                  {/* Console Panel */}
                  {showConsole && (
                    <div className="h-36 border-t border-[#30363d] bg-[#0d1117] flex flex-col">
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#21262d] bg-[#161b22]">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-semibold text-[#c9d1d9]">Console</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e]">{consoleLogs.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setConsoleLogs([])} 
                            className="text-[10px] text-[#8b949e] hover:text-white transition-colors"
                          >
                            🗑️ Clear
                          </button>
                          <button 
                            onClick={() => setShowConsole(false)} 
                            className="text-[10px] text-[#8b949e] hover:text-white transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto p-2 font-mono text-[12px]">
                        {consoleLogs.length === 0 ? (
                          <div className="text-[#484f58] italic">Console output will appear here...</div>
                        ) : (
                          consoleLogs.map((log, i) => (
                            <div key={i} className="text-[#58a6ff] py-0.5 flex items-start gap-2">
                              <span className="text-[#3fb950]">{'>'}</span>
                              <span className="text-[#c9d1d9]">{log}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  
                  {!showConsole && (
                    <button 
                      onClick={() => setShowConsole(true)}
                      className="py-1 text-[11px] text-[#8b949e] hover:text-white bg-[#161b22] border-t border-[#30363d] transition-colors"
                    >
                      ▲ Show Console
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Helper component for dynamic siteName
function EditorTitle() {
  const { settings } = useSettings();
  const siteName = settings.siteName || 'SkillStenz';
  return <h1 className="text-sm font-bold text-white">{siteName} Editor</h1>;
}
