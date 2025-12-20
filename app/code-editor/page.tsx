'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function CodeEditorPage() {
  const [files] = useState([
    { name: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
    { name: 'style.css', language: 'css', content: 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}' },
    { name: 'script.js', language: 'javascript', content: '// JavaScript Code\nconsole.log("Hello, World!");\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}' },
  ]);
  
  const [activeFile, setActiveFile] = useState(0);
  const [code, setCode] = useState(files[0].content);

  const handleFileChange = (index: number) => {
    setActiveFile(index);
    setCode(files[index].content);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-80px)]">
        {/* File Explorer */}
        <div className="w-56 border-r border-[var(--border)] bg-[var(--card)]">
          <div className="p-3 border-b border-[var(--border)]">
            <h2 className="font-semibold text-sm text-[var(--foreground)]">EXPLORER</h2>
          </div>
          <div className="p-2">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 px-2">PROJECT</div>
            {files.map((file, index) => (
              <button
                key={file.name}
                onClick={() => handleFileChange(index)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-2 ${
                  activeFile === index ? 'bg-[var(--muted)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                }`}
              >
                <span>{file.language === 'html' ? '📄' : file.language === 'css' ? '🎨' : '⚡'}</span>
                {file.name}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] bg-[var(--muted)]">
            {files.map((file, index) => (
              <button
                key={file.name}
                onClick={() => handleFileChange(index)}
                className={`px-4 py-2 text-sm border-r border-[var(--border)] flex items-center gap-2 ${
                  activeFile === index
                    ? 'bg-[var(--background)] text-[var(--foreground)] border-t-2 border-t-[var(--primary)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--background)]'
                }`}
              >
                {file.name}
                <span className="text-xs opacity-50 hover:opacity-100">×</span>
              </button>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex">
            {/* Line Numbers */}
            <div className="w-12 bg-[var(--muted)] text-right pr-2 py-4 text-sm text-[var(--muted-foreground)] font-mono select-none">
              {code.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            
            {/* Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-1 border-t border-[var(--border)] bg-[var(--primary)] text-white text-xs">
            <div className="flex items-center gap-4">
              <span>{files[activeFile].language.toUpperCase()}</span>
              <span>UTF-8</span>
              <span>LF</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Ln {code.split('\n').length}, Col 1</span>
              <span>Spaces: 2</span>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-96 border-l border-[var(--border)] flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-[var(--border)] bg-[var(--muted)]">
            <span className="text-sm font-medium text-[var(--foreground)]">Preview</span>
            <button className="p-1 hover:bg-[var(--border)] rounded">
              <svg className="w-4 h-4 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="flex-1 bg-white">
            <iframe
              title="Preview"
              className="w-full h-full border-0"
              srcDoc={files[0].content}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
