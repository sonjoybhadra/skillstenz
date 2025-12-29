'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor (it's heavy, so we load it on demand)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Editor...</div>
});

// Dynamically import Markdown renderer
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

interface RichContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  mode?: 'markdown' | 'html' | 'code';
  language?: string; // For code mode: javascript, python, html, css, etc.
  showPreview?: boolean;
  showToolbar?: boolean;
  label?: string;
  error?: string;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'sql', label: 'SQL' },
  { value: 'shell', label: 'Shell/Bash' },
  { value: 'markdown', label: 'Markdown' },
];

const CODE_TEMPLATES: Record<string, string> = {
  javascript: `// JavaScript Example
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');`,
  python: `# Python Example
def greet(name):
    print(f"Hello, {name}!")

greet("World")`,
  java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,
  css: `/* CSS Example */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`,
};

export default function RichContentEditor({
  value,
  onChange,
  placeholder = 'Start typing your content...',
  height = '400px',
  mode = 'markdown',
  language = 'javascript',
  showPreview = true,
  showToolbar = true,
  label,
  error,
}: RichContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  // Detect system theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
    setEditorTheme(isDark ? 'vs-dark' : 'light');
  }, []);

  const insertAtCursor = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('.monaco-editor textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
      onChange(newValue);
    } else {
      // Fallback: append to end
      onChange(value + before + after);
    }
  }, [value, onChange]);

  const insertCodeBlock = useCallback((lang: string = 'javascript') => {
    const template = CODE_TEMPLATES[lang] || `// ${lang} code here`;
    const codeBlock = `\n\`\`\`${lang}\n${template}\n\`\`\`\n`;
    onChange(value + codeBlock);
  }, [value, onChange]);

  const toolbarButtons = [
    { icon: '𝐁', title: 'Bold', action: () => insertAtCursor('**', '**') },
    { icon: '𝐼', title: 'Italic', action: () => insertAtCursor('*', '*') },
    { icon: '𝑆̶', title: 'Strikethrough', action: () => insertAtCursor('~~', '~~') },
    { icon: 'H1', title: 'Heading 1', action: () => insertAtCursor('\n# ') },
    { icon: 'H2', title: 'Heading 2', action: () => insertAtCursor('\n## ') },
    { icon: 'H3', title: 'Heading 3', action: () => insertAtCursor('\n### ') },
    { icon: '•', title: 'Bullet List', action: () => insertAtCursor('\n- ') },
    { icon: '1.', title: 'Numbered List', action: () => insertAtCursor('\n1. ') },
    { icon: '☑', title: 'Task List', action: () => insertAtCursor('\n- [ ] ') },
    { icon: '🔗', title: 'Link', action: () => insertAtCursor('[', '](url)') },
    { icon: '🖼️', title: 'Image', action: () => insertAtCursor('![alt](', ')') },
    { icon: '📊', title: 'Table', action: () => insertAtCursor('\n| Header | Header |\n|--------|--------|\n| Cell   | Cell   |\n') },
    { icon: '—', title: 'Horizontal Rule', action: () => insertAtCursor('\n---\n') },
    { icon: '💬', title: 'Quote', action: () => insertAtCursor('\n> ') },
    { icon: '`', title: 'Inline Code', action: () => insertAtCursor('`', '`') },
  ];

  const renderMarkdownPreview = () => {
    return (
      <div 
        className="markdown-preview"
        style={{ 
          padding: '16px', 
          height, 
          overflow: 'auto',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              return isInline ? (
                <code 
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em'
                  }} 
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-tertiary)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {match[1]}
                  </div>
                  <pre style={{ 
                    background: '#1e1e1e', 
                    color: '#d4d4d4',
                    padding: '16px', 
                    borderRadius: '8px',
                    overflow: 'auto',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            },
            h1: ({ children }) => <h1 style={{ fontSize: '2em', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ fontSize: '1.5em', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ fontSize: '1.25em', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{children}</h3>,
            p: ({ children }) => <p style={{ marginBottom: '12px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>{children}</p>,
            ul: ({ children }) => <ul style={{ marginLeft: '24px', marginBottom: '12px', listStyleType: 'disc' }}>{children}</ul>,
            ol: ({ children }) => <ol style={{ marginLeft: '24px', marginBottom: '12px', listStyleType: 'decimal' }}>{children}</ol>,
            li: ({ children }) => <li style={{ marginBottom: '4px', color: 'var(--text-secondary)' }}>{children}</li>,
            blockquote: ({ children }) => (
              <blockquote style={{ 
                borderLeft: '4px solid var(--text-accent)', 
                paddingLeft: '16px', 
                margin: '16px 0',
                color: 'var(--text-muted)',
                fontStyle: 'italic'
              }}>
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a href={href} style={{ color: 'var(--text-accent)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            table: ({ children }) => (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th style={{ border: '1px solid var(--border-primary)', padding: '8px 12px', background: 'var(--bg-secondary)', textAlign: 'left', fontWeight: 600 }}>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td style={{ border: '1px solid var(--border-primary)', padding: '8px 12px' }}>
                {children}
              </td>
            ),
            hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)', margin: '24px 0' }} />,
            img: ({ src, alt }) => (
              <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '12px' }} />
            ),
          }}
        >
          {value || '*No content to preview*'}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 500, 
          color: 'var(--text-primary)',
          fontSize: '14px'
        }}>
          {label}
        </label>
      )}

      {/* Toolbar */}
      {showToolbar && mode === 'markdown' && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '4px', 
          padding: '8px', 
          background: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          borderBottom: '1px solid var(--border-primary)',
          alignItems: 'center'
        }}>
          {toolbarButtons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              title={btn.title}
              style={{
                padding: '6px 10px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '14px',
                color: 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--bg-primary)';
              }}
            >
              {btn.icon}
            </button>
          ))}

          {/* Code Block Dropdown */}
          <div style={{ position: 'relative', marginLeft: '8px' }}>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  insertCodeBlock(e.target.value);
                  e.target.value = '';
                }
              }}
              style={{
                padding: '6px 12px',
                background: 'var(--bg-accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              <option value="">+ Code Block</option>
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Preview Toggle */}
          {showPreview && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                style={{
                  padding: '6px 12px',
                  background: activeTab === 'write' ? 'var(--bg-accent)' : 'var(--bg-primary)',
                  color: activeTab === 'write' ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                ✏️ Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                style={{
                  padding: '6px 12px',
                  background: activeTab === 'preview' ? 'var(--bg-accent)' : 'var(--bg-primary)',
                  color: activeTab === 'preview' ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                👁️ Preview
              </button>
            </div>
          )}
        </div>
      )}

      {/* Code Mode Language Selector */}
      {mode === 'code' && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '12px', 
          padding: '8px 12px', 
          background: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          borderBottom: '1px solid var(--border-primary)'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px'
            }}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const template = CODE_TEMPLATES[selectedLanguage] || '';
              if (template && !value) onChange(template);
            }}
            style={{
              padding: '6px 12px',
              background: 'var(--bg-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Load Template
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div style={{ 
        borderRadius: showToolbar || mode === 'code' ? '0 0 var(--radius-md) var(--radius-md)' : 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-primary)',
        borderTop: showToolbar || mode === 'code' ? 'none' : undefined
      }}>
        {activeTab === 'write' || !showPreview ? (
          <MonacoEditor
            height={height}
            language={mode === 'code' ? selectedLanguage : 'markdown'}
            theme={editorTheme}
            value={value}
            onChange={(val) => onChange(val || '')}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              lineNumbers: mode === 'code' ? 'on' : 'off',
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              fontSize: 14,
              fontFamily: mode === 'code' ? 'Consolas, Monaco, monospace' : 'inherit',
              automaticLayout: true,
              tabSize: 2,
              placeholder: placeholder,
              renderLineHighlight: mode === 'code' ? 'line' : 'none',
              folding: mode === 'code',
              lineDecorationsWidth: mode === 'code' ? 10 : 0,
            }}
          />
        ) : (
          renderMarkdownPreview()
        )}
      </div>

      {error && (
        <p style={{ color: 'var(--error)', fontSize: '13px', marginTop: '4px' }}>
          {error}
        </p>
      )}

      {/* Character Count */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '4px',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <span>{value.length} characters</span>
        <span>{value.split(/\s+/).filter(w => w).length} words</span>
      </div>
    </div>
  );
}
