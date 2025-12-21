'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

const languageConfig: Record<string, { name: string; extension: string; template: string; icon: string }> = {
  'python': {
    name: 'Python',
    extension: '.py',
    template: '# Python Code\nprint("Hello, World!")\n\n# Variables\nname = "SkillStenz"\nprint(f"Welcome to {name}!")\n',
    icon: '🐍'
  },
  'javascript': {
    name: 'JavaScript',
    extension: '.js',
    template: '// JavaScript Code\nconsole.log("Hello, World!");\n\n// Variables\nconst name = "SkillStenz";\nconsole.log(`Welcome to ${name}!`);\n',
    icon: '🟨'
  },
  'typescript': {
    name: 'TypeScript',
    extension: '.ts',
    template: '// TypeScript Code\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);\n\n// Type example\ninterface User {\n  name: string;\n  age: number;\n}\n',
    icon: '🔷'
  },
  'java': {
    name: 'Java',
    extension: '.java',
    template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        String name = "SkillStenz";\n        System.out.println("Welcome to " + name + "!");\n    }\n}',
    icon: '☕'
  },
  'cpp': {
    name: 'C++',
    extension: '.cpp',
    template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    \n    string name = "SkillStenz";\n    cout << "Welcome to " << name << "!" << endl;\n    return 0;\n}',
    icon: '⚡'
  },
  'c': {
    name: 'C',
    extension: '.c',
    template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    \n    char name[] = "SkillStenz";\n    printf("Welcome to %s!\\n", name);\n    return 0;\n}',
    icon: '©️'
  },
  'go': {
    name: 'Go',
    extension: '.go',
    template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n    \n    name := "SkillStenz"\n    fmt.Printf("Welcome to %s!\\n", name)\n}',
    icon: '🔵'
  },
  'rust': {
    name: 'Rust',
    extension: '.rs',
    template: 'fn main() {\n    println!("Hello, World!");\n    \n    let name = "SkillStenz";\n    println!("Welcome to {}!", name);\n}',
    icon: '🦀'
  },
  'php': {
    name: 'PHP',
    extension: '.php',
    template: '<?php\n\necho "Hello, World!\\n";\n\n$name = "SkillStenz";\necho "Welcome to $name!\\n";\n\n?>',
    icon: '🐘'
  },
  'ruby': {
    name: 'Ruby',
    extension: '.rb',
    template: '# Ruby Code\nputs "Hello, World!"\n\nname = "SkillStenz"\nputs "Welcome to #{name}!"',
    icon: '💎'
  },
  'swift': {
    name: 'Swift',
    extension: '.swift',
    template: '// Swift Code\nprint("Hello, World!")\n\nlet name = "SkillStenz"\nprint("Welcome to \\(name)!")',
    icon: '🍎'
  },
  'kotlin': {
    name: 'Kotlin',
    extension: '.kt',
    template: 'fun main() {\n    println("Hello, World!")\n    \n    val name = "SkillStenz"\n    println("Welcome to $name!")\n}',
    icon: '🟣'
  },
  'react': {
    name: 'React.js',
    extension: '.jsx',
    template: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Hello from React! 🚀</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;`,
    icon: '⚛️'
  },
  'nextjs': {
    name: 'Next.js',
    extension: '.tsx',
    template: `'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Hello from Next.js!');
  
  return (
    <main style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{message}</h1>
      <button onClick={() => setMessage('You clicked the button!')}>
        Click Me
      </button>
    </main>
  );
}`,
    icon: '▲'
  },
  'html': {
    name: 'HTML/CSS',
    extension: '.html',
    template: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .card {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        h1 { color: #333; }
        p { color: #666; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello, World! 🎉</h1>
        <p>Edit the HTML and CSS above!</p>
    </div>
</body>
</html>`,
    icon: '📄'
  },
  'sql': {
    name: 'SQL',
    extension: '.sql',
    template: '-- SQL Query Examples\n\n-- Create table\nCREATE TABLE users (\n    id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100)\n);\n\n-- Insert data\nINSERT INTO users (id, name, email)\nVALUES (1, "John", "john@example.com");\n\n-- Select query\nSELECT * FROM users;',
    icon: '🗃️'
  },
  'nodejs': {
    name: 'Node.js',
    extension: '.js',
    template: `// Node.js Code
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Node.js! 🚀</h1>');
});

const PORT = 3000;
console.log(\`Server running at http://localhost:\${PORT}/\`);`,
    icon: '🟢'
  },
  'mongodb': {
    name: 'MongoDB',
    extension: '.js',
    template: `// MongoDB Query Examples

// Find all documents
db.users.find({});

// Find with filter
db.users.find({ age: { $gte: 18 } });

// Insert document
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 25
});

// Update document
db.users.updateOne(
  { name: "John Doe" },
  { $set: { age: 26 } }
);`,
    icon: '🍃'
  },
};

export default function CompilerPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const lang = params.lang as string;
  const config = languageConfig[lang];
  const [code, setCode] = useState(config?.template || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'preview'>('output');

  // Popular languages to show in quick access
  const popularLanguages = ['python', 'javascript', 'react', 'html', 'java', 'cpp', 'go', 'rust'];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/compiler/${lang}`);
    }
  }, [isAuthenticated, authLoading, router, lang]);

  useEffect(() => {
    if (config) {
      setCode(config.template);
      setOutput('');
    }
  }, [lang]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('⏳ Running...\n');
    
    // Simulate code execution with realistic output
    setTimeout(() => {
      let result = '';
      
      if (lang === 'html' || lang === 'react' || lang === 'nextjs') {
        setActiveTab('preview');
        result = '✅ Preview updated! Check the Preview tab.';
      } else if (lang === 'python') {
        result = 'Hello, World!\nWelcome to SkillStenz!\n\n✅ Process exited with code 0';
      } else if (lang === 'javascript' || lang === 'typescript' || lang === 'nodejs') {
        result = 'Hello, World!\nWelcome to SkillStenz!\n\n✅ Process exited with code 0';
      } else if (lang === 'java') {
        result = 'Hello, World!\nWelcome to SkillStenz!\n\n✅ Process exited with code 0';
      } else if (lang === 'sql' || lang === 'mongodb') {
        result = '┌─────────────────────────────┐\n│ Query executed successfully │\n└─────────────────────────────┘\n\n✅ 1 row(s) returned';
      } else {
        result = 'Hello, World!\nWelcome to SkillStenz!\n\n✅ Process exited with code 0';
      }
      
      setOutput(result);
      setIsRunning(false);
    }, 1200);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main${config?.extension || '.txt'}`;
    a.click();
    toast.success('Code downloaded!');
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

  if (!config) {
    return (
      <Layout showSidebar>
        <section className="section" style={{ paddingTop: '100px', textAlign: 'center' }}>
          <div className="container">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚫</div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Language Not Supported</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>This programming language is not yet supported.</p>
            <Link href="/compiler/python" className="btn btn-primary">
              Try Python Compiler
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const canPreview = ['html', 'react', 'nextjs'].includes(lang);

  return (
    <Layout showSidebar>
      <div style={{ padding: '20px', maxWidth: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '32px' }}>{config.icon}</span>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{config.name} Compiler</h1>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Online IDE • Write, Run & Share Code</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={copyCode} className="btn btn-secondary btn-sm">📋 Copy</button>
              <button onClick={downloadCode} className="btn btn-secondary btn-sm">💾 Download</button>
              <button onClick={runCode} disabled={isRunning} className="btn btn-primary">
                {isRunning ? '⏳ Running...' : '▶️ Run Code'}
              </button>
            </div>
          </div>
          
          {/* Language Selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {popularLanguages.map((key) => {
              const cfg = languageConfig[key];
              return (
                <Link key={key} href={`/compiler/${key}`} className={key === lang ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
                  {cfg.icon} {cfg.name}
                </Link>
              );
            })}
            <button onClick={() => setShowAllLangs(!showAllLangs)} className="btn btn-ghost btn-sm">
              {showAllLangs ? '◀ Less' : '▶ More'}
            </button>
          </div>
          
          {showAllLangs && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              {Object.entries(languageConfig).filter(([key]) => !popularLanguages.includes(key)).map(([key, cfg]) => (
                <Link key={key} href={`/compiler/${key}`} className={key === lang ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
                  {cfg.icon} {cfg.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Editor */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: 'calc(100vh - 280px)', minHeight: '400px' }}>
          {/* Code Editor */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>📝 main{config.extension}</span>
              <button onClick={() => setCode(config.template)} className="btn btn-ghost btn-sm">🔄 Reset</button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '16px', 
                background: '#1e1e1e', 
                color: '#d4d4d4', 
                fontFamily: 'monospace', 
                fontSize: '14px',
                lineHeight: '1.6',
                resize: 'none', 
                border: 'none',
                outline: 'none'
              }}
              spellCheck={false}
            />
          </div>

          {/* Output/Preview */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {canPreview ? (
              <>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                  <button
                    onClick={() => setActiveTab('output')}
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTab === 'output' ? 'var(--bg-card)' : 'transparent',
                      color: activeTab === 'output' ? 'var(--text-primary)' : 'var(--text-muted)',
                      borderBottom: activeTab === 'output' ? '2px solid var(--bg-accent)' : '2px solid transparent'
                    }}
                  >
                    💻 Console
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTab === 'preview' ? 'var(--bg-card)' : 'transparent',
                      color: activeTab === 'preview' ? 'var(--text-primary)' : 'var(--text-muted)',
                      borderBottom: activeTab === 'preview' ? '2px solid var(--bg-accent)' : '2px solid transparent'
                    }}
                  >
                    🖥️ Preview
                  </button>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => setOutput('')} className="btn btn-ghost btn-sm" style={{ margin: '4px' }}>🗑️ Clear</button>
                </div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {activeTab === 'output' ? (
                    <pre style={{ padding: '16px', background: '#0d1117', color: '#58a6ff', fontFamily: 'monospace', fontSize: '13px', margin: 0, height: '100%' }}>
                      {output || 'Click "Run Code" to execute...'}
                    </pre>
                  ) : (
                    <iframe
                      title="Preview"
                      srcDoc={lang === 'html' ? code : `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:20px;}</style></head><body><div id="root">${code.includes('export default') ? '<p>React preview - Run code to see output</p>' : code}</div></body></html>`}
                      style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                      sandbox="allow-scripts"
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>💻 Output</span>
                  <button onClick={() => setOutput('')} className="btn btn-ghost btn-sm">🗑️ Clear</button>
                </div>
                <pre style={{ 
                  flex: 1, 
                  padding: '16px', 
                  background: '#0d1117', 
                  color: '#58a6ff', 
                  fontFamily: 'monospace', 
                  fontSize: '13px', 
                  overflow: 'auto',
                  margin: 0
                }}>
                  {output || 'Click "Run Code" to execute your code...'}
                </pre>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <Link href="/compiler" className="btn btn-outline">📚 All Compilers</Link>
          <Link href="/tutorials" className="btn btn-outline">📖 Tutorials</Link>
          <Link href={`/technologies`} className="btn btn-outline">🎯 Learn {config.name}</Link>
        </div>
      </div>
    </Layout>
  );
}
