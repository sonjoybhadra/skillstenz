'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface LanguageConfig {
  name: string;
  extension: string;
  template: string;
  icon: string;
  color: string;
}

const languageConfig: Record<string, LanguageConfig> = {
  'python': {
    name: 'Python',
    extension: '.py',
    template: `# Python Code
print("Hello, World!")

# Variables
name = "TechTooTalk"
print(f"Welcome to {name}!")

# Simple loop
for i in range(3):
    print(f"Count: {i}")`,
    icon: '🐍',
    color: '#3776AB'
  },
  'javascript': {
    name: 'JavaScript',
    extension: '.js',
    template: `// JavaScript Code
console.log("Hello, World!");

// Variables
const name = "TechTooTalk";
console.log(\`Welcome to \${name}!\`);

// Array example
const numbers = [1, 2, 3];
numbers.forEach(n => console.log(\`Number: \${n}\`));`,
    icon: '🟨',
    color: '#F7DF1E'
  },
  'typescript': {
    name: 'TypeScript',
    extension: '.ts',
    template: `// TypeScript Code
const greeting: string = "Hello, World!";
console.log(greeting);

// Interface example
interface User {
  name: string;
  age: number;
}

const user: User = { name: "TechTooTalk", age: 2024 };
console.log(\`User: \${user.name}\`);`,
    icon: '🔷',
    color: '#3178C6'
  },
  'java': {
    name: 'Java',
    extension: '.java',
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        String name = "TechTooTalk";
        System.out.println("Welcome to " + name + "!");
        
        // Loop example
        for (int i = 0; i < 3; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,
    icon: '☕',
    color: '#ED8B00'
  },
  'cpp': {
    name: 'C++',
    extension: '.cpp',
    template: `#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    string name = "TechTooTalk";
    cout << "Welcome to " << name << "!" << endl;
    
    // Loop example
    for (int i = 0; i < 3; i++) {
        cout << "Count: " << i << endl;
    }
    
    return 0;
}`,
    icon: '⚡',
    color: '#00599C'
  },
  'c': {
    name: 'C',
    extension: '.c',
    template: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    char name[] = "TechTooTalk";
    printf("Welcome to %s!\\n", name);
    
    // Loop example
    for (int i = 0; i < 3; i++) {
        printf("Count: %d\\n", i);
    }
    
    return 0;
}`,
    icon: '©️',
    color: '#A8B9CC'
  },
  'go': {
    name: 'Go',
    extension: '.go',
    template: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    name := "TechTooTalk"
    fmt.Printf("Welcome to %s!\\n", name)
    
    // Loop example
    for i := 0; i < 3; i++ {
        fmt.Printf("Count: %d\\n", i)
    }
}`,
    icon: '🔵',
    color: '#00ADD8'
  },
  'rust': {
    name: 'Rust',
    extension: '.rs',
    template: `fn main() {
    println!("Hello, World!");
    
    let name = "TechTooTalk";
    println!("Welcome to {}!", name);
    
    // Loop example
    for i in 0..3 {
        println!("Count: {}", i);
    }
}`,
    icon: '🦀',
    color: '#DEA584'
  },
  'php': {
    name: 'PHP',
    extension: '.php',
    template: `<?php

echo "Hello, World!\\n";

$name = "TechTooTalk";
echo "Welcome to $name!\\n";

// Loop example
for ($i = 0; $i < 3; $i++) {
    echo "Count: $i\\n";
}

?>`,
    icon: '🐘',
    color: '#777BB4'
  },
  'ruby': {
    name: 'Ruby',
    extension: '.rb',
    template: `# Ruby Code
puts "Hello, World!"

name = "TechTooTalk"
puts "Welcome to #{name}!"

# Loop example
3.times do |i|
  puts "Count: #{i}"
end`,
    icon: '💎',
    color: '#CC342D'
  },
  'swift': {
    name: 'Swift',
    extension: '.swift',
    template: `// Swift Code
print("Hello, World!")

let name = "TechTooTalk"
print("Welcome to \\(name)!")

// Loop example
for i in 0..<3 {
    print("Count: \\(i)")
}`,
    icon: '🍎',
    color: '#FA7343'
  },
  'kotlin': {
    name: 'Kotlin',
    extension: '.kt',
    template: `fun main() {
    println("Hello, World!")
    
    val name = "TechTooTalk"
    println("Welcome to $name!")
    
    // Loop example
    for (i in 0..2) {
        println("Count: $i")
    }
}`,
    icon: '🟣',
    color: '#7F52FF'
  },
  'react': {
    name: 'React.js',
    extension: '.jsx',
    template: `const { useState } = React;

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ color: '#61dafb', marginBottom: '20px' }}>
        Hello from React! ⚛️
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>
        Count: {count}
      </p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          background: '#61dafb',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Increment
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
    icon: '⚛️',
    color: '#61DAFB'
  },
  'nextjs': {
    name: 'Next.js',
    extension: '.tsx',
    template: `'use client';

const { useState } = React;

function Home() {
  const [message, setMessage] = useState('Hello from Next.js! ▲');

  return (
    <main style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#000',
      color: '#fff',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px' }}>{message}</h1>
      <button 
        onClick={() => setMessage('You clicked the button! 🎉')}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Home />);`,
    icon: '▲',
    color: '#000000'
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        h1 { color: #333; margin-bottom: 12px; }
        p { color: #666; }
        button {
            margin-top: 20px;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
        button:hover { background: #764ba2; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello, World! 🎉</h1>
        <p>Edit the HTML and CSS above!</p>
        <button onclick="alert('Hello!')">Click Me</button>
    </div>
</body>
</html>`,
    icon: '📄',
    color: '#E34F26'
  },
  'sql': {
    name: 'SQL',
    extension: '.sql',
    template: `-- SQL Query Examples

-- Create table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO users (id, name, email)
VALUES 
    (1, 'John Doe', 'john@example.com'),
    (2, 'Jane Smith', 'jane@example.com');

-- Select query
SELECT * FROM users WHERE id = 1;

-- Update
UPDATE users SET name = 'John Updated' WHERE id = 1;`,
    icon: '🗃️',
    color: '#4479A1'
  },
  'nodejs': {
    name: 'Node.js',
    extension: '.js',
    template: `// Node.js Code
console.log("Hello from Node.js! 🟢");

// Using built-in modules
const os = require('os');
console.log(\`Platform: \${os.platform()}\`);
console.log(\`Architecture: \${os.arch()}\`);

// Simple function
function greet(name) {
    return \`Welcome, \${name}!\`;
}

console.log(greet("TechTooTalk"));`,
    icon: '🟢',
    color: '#339933'
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
    age: 25,
    createdAt: new Date()
});

// Update document
db.users.updateOne(
    { name: "John Doe" },
    { $set: { age: 26 } }
);

// Delete document
db.users.deleteOne({ name: "John Doe" });`,
    icon: '🍃',
    color: '#47A248'
  },
};

const previewableLanguages = ['html', 'react', 'nextjs'];
const popularLanguages = ['python', 'javascript', 'java', 'cpp', 'go', 'rust', 'react', 'html'];

const buildPreviewDocument = (language: string, source: string) => {
  if (language === 'html') {
    return source.includes('<html') ? source : `<!DOCTYPE html><html><body>${source}</body></html>`;
  }

  if (language === 'react' || language === 'nextjs') {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>body { margin: 0; font-family: system-ui, sans-serif; }</style>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">${source}</script>
  </body>
</html>`;
  }

  return `<!DOCTYPE html><html><body><pre style="padding:16px;">${source.replace(/</g, '&lt;')}</pre></body></html>`;
};

export default function CompilerPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const lang = params.lang as string;
  const config = languageConfig[lang];
  const [code, setCode] = useState(config?.template || '');
  const [previewCode, setPreviewCode] = useState(config?.template || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'preview'>('output');
  const [previewVersion, setPreviewVersion] = useState(0);
  const [stdinValue, setStdinValue] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [executionStats, setExecutionStats] = useState<{ time?: string; memory?: string } | null>(null);

  const canPreview = previewableLanguages.includes(lang);
  const previewDocument = useMemo(() => buildPreviewDocument(lang, previewCode), [lang, previewCode]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/compiler/${lang}`);
    }
  }, [isAuthenticated, authLoading, router, lang]);

  useEffect(() => {
    if (config) {
      setCode(config.template);
      setPreviewCode(config.template);
      setOutput('');
      setPreviewVersion(0);
      setActiveTab(previewableLanguages.includes(lang) ? 'preview' : 'output');
      setStdinValue('');
      setExecutionStats(null);
    }
  }, [lang, config]);

  const runCode = async () => {
    if (canPreview) {
      setIsRunning(true);
      setPreviewCode(code);
      setPreviewVersion((prev) => prev + 1);
      setActiveTab('preview');
      setOutput('✅ Preview updated! Check the Preview tab.');
      setIsRunning(false);
      return;
    }

    try {
      setIsRunning(true);
      setOutput('⏳ Running your code...\n');
      setExecutionStats(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/compiler/run`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: lang,
          code,
          stdin: stdinValue || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to execute code.');
      }

      const stdout = data.stdout || '';
      const stderrSection = data.stderr ? `\n⚠️ Stderr:\n${data.stderr}` : '';
      
      setOutput(`${stdout}${stderrSection}`.trimStart() || '(No output)');
      setExecutionStats({
        time: data.executionTime ? `${data.executionTime}s` : undefined,
        memory: data.memory ? `${data.memory} KB` : undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Execution failed.';
      setOutput(`❌ Error: ${message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main${config?.extension || '.txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const resetCode = () => {
    if (confirm('Reset to default code?')) {
      setCode(config?.template || '');
      setOutput('');
      setExecutionStats(null);
      toast.success('Code reset!');
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

  if (!config) {
    return (
      <Layout showSidebar>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="text-7xl mb-6">🚫</div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Language Not Supported</h1>
          <p className="text-[var(--text-muted)] mb-6">The language &quot;{lang}&quot; is not available yet.</p>
          <Link href="/compiler" className="btn btn-primary">
            Browse All Languages
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0d1117]">
        {/* Professional Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#161b22] to-[#0d1117] border-b border-[#30363d]">
          <div className="flex items-center gap-4">
            {/* Language Badge */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: `${config.color}20` }}
            >
              <span className="text-xl">{config.icon}</span>
              <span className="font-bold text-white">{config.name}</span>
            </div>
            
            {/* Quick Language Switcher */}
            <div className="hidden md:flex items-center gap-1">
              {popularLanguages.filter(l => l !== lang).slice(0, 5).map(l => {
                const cfg = languageConfig[l];
                return (
                  <Link
                    key={l}
                    href={`/compiler/${l}`}
                    className="px-2 py-1 rounded-md text-xs text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
                  >
                    {cfg.icon}
                  </Link>
                );
              })}
              <Link
                href="/compiler"
                className="px-2 py-1 rounded-md text-xs text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
              >
                +more
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button onClick={resetCode} className="px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors">
              🔄 Reset
            </button>
            <button onClick={copyCode} className="px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors">
              📋 Copy
            </button>
            <button onClick={downloadCode} className="px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors">
              💾 Save
            </button>
            <div className="w-px h-4 bg-[#30363d] mx-1" />
            <button 
              onClick={runCode} 
              disabled={isRunning}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>▶ Run Code</>
              )}
            </button>
          </div>
        </div>

        {/* Main IDE Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-[#30363d]">
            {/* File Tab */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <span className="text-sm">{config.icon}</span>
                <span className="text-sm font-medium text-[#c9d1d9]">main{config.extension}</span>
              </div>
              {!canPreview && (
                <button 
                  onClick={() => setShowStdin(!showStdin)}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${showStdin ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}
                >
                  📥 Input
                </button>
              )}
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Line Numbers */}
              <div className="w-12 flex-shrink-0 bg-[#0d1117] py-3 text-right pr-3 font-mono text-[13px] text-[#484f58] select-none overflow-hidden border-r border-[#21262d]">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="leading-6 h-6">{i + 1}</div>
                ))}
              </div>
              
              {/* Code */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-[#0d1117] text-[#c9d1d9] font-mono text-[14px] leading-6 py-3 px-4 resize-none outline-none border-none"
                style={{ tabSize: 2, caretColor: '#58a6ff' }}
              />
            </div>

            {/* Stdin Panel */}
            {showStdin && !canPreview && (
              <div className="border-t border-[#30363d] bg-[#161b22]">
                <div className="px-4 py-2 border-b border-[#21262d]">
                  <span className="text-xs font-semibold text-[#8b949e]">Standard Input (stdin)</span>
                </div>
                <textarea
                  value={stdinValue}
                  onChange={(e) => setStdinValue(e.target.value)}
                  placeholder="Enter input values here (one per line)..."
                  className="w-full h-24 bg-[#0d1117] text-[#c9d1d9] font-mono text-[13px] p-3 resize-none outline-none border-none"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1 bg-[#1f6feb] text-white text-[11px]">
              <div className="flex items-center gap-4">
                <span className="font-semibold">{config.name}</span>
                <span>UTF-8</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Ln {code.split('\n').length}</span>
                <span>{code.length} chars</span>
                {executionStats && (
                  <>
                    {executionStats.time && <span>⏱️ {executionStats.time}</span>}
                    {executionStats.memory && <span>💾 {executionStats.memory}</span>}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Output/Preview Panel */}
          <div className="w-1/2 flex flex-col min-w-0">
            {/* Tabs */}
            {canPreview ? (
              <div className="flex bg-[#161b22] border-b border-[#30363d]">
                <button
                  onClick={() => setActiveTab('output')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'output' 
                      ? 'text-white bg-[#0d1117] border-b-2 border-b-[#1f6feb]' 
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  💻 Console
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'preview' 
                      ? 'text-white bg-[#0d1117] border-b-2 border-b-[#1f6feb]' 
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  🖥️ Preview
                </button>
                <div className="flex-1" />
                <button 
                  onClick={() => setOutput('')} 
                  className="px-3 text-xs text-[#8b949e] hover:text-white transition-colors"
                >
                  🗑️ Clear
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                <span className="text-sm font-medium text-[#c9d1d9]">💻 Output</span>
                <button 
                  onClick={() => setOutput('')} 
                  className="text-xs text-[#8b949e] hover:text-white transition-colors"
                >
                  🗑️ Clear
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {canPreview && activeTab === 'preview' ? (
                <iframe
                  key={`preview-${previewVersion}`}
                  title="Preview"
                  srcDoc={previewDocument}
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <pre className="p-4 bg-[#0d1117] text-[#c9d1d9] font-mono text-[13px] min-h-full whitespace-pre-wrap">
                  {output || (
                    <span className="text-[#484f58] italic">
                      Click &quot;Run Code&quot; to execute your code...
                    </span>
                  )}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-t border-[#30363d]">
          <div className="flex items-center gap-3">
            <Link href="/compiler" className="text-xs text-[#58a6ff] hover:underline">
              ← All Compilers
            </Link>
            <span className="text-[#30363d]">|</span>
            <Link href="/code-editor" className="text-xs text-[#58a6ff] hover:underline">
              Web Editor
            </Link>
            <span className="text-[#30363d]">|</span>
            <Link href="/tutorials" className="text-xs text-[#58a6ff] hover:underline">
              Tutorials
            </Link>
          </div>
          <div className="text-xs text-[#484f58]">
            Powered by Piston API
          </div>
        </div>
      </div>
    </Layout>
  );
}
