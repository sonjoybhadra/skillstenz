'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useState } from 'react';

const languageConfig: Record<string, { name: string; extension: string; template: string; icon: string }> = {
  'python': {
    name: 'Python',
    extension: '.py',
    template: '# Python Code\nprint("Hello, World!")\n',
    icon: '🐍'
  },
  'javascript': {
    name: 'JavaScript',
    extension: '.js',
    template: '// JavaScript Code\nconsole.log("Hello, World!");\n',
    icon: '🟨'
  },
  'typescript': {
    name: 'TypeScript',
    extension: '.ts',
    template: '// TypeScript Code\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);\n',
    icon: '🔷'
  },
  'java': {
    name: 'Java',
    extension: '.java',
    template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    icon: '☕'
  },
  'cpp': {
    name: 'C++',
    extension: '.cpp',
    template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    icon: '⚡'
  },
  'c': {
    name: 'C',
    extension: '.c',
    template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    icon: '©️'
  },
  'go': {
    name: 'Go',
    extension: '.go',
    template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    icon: '🔵'
  },
  'rust': {
    name: 'Rust',
    extension: '.rs',
    template: 'fn main() {\n    println!("Hello, World!");\n}',
    icon: '🦀'
  },
  'php': {
    name: 'PHP',
    extension: '.php',
    template: '<?php\n\necho "Hello, World!";\n\n?>',
    icon: '🐘'
  },
  'ruby': {
    name: 'Ruby',
    extension: '.rb',
    template: '# Ruby Code\nputs "Hello, World!"',
    icon: '💎'
  },
  'swift': {
    name: 'Swift',
    extension: '.swift',
    template: '// Swift Code\nprint("Hello, World!")',
    icon: '🍎'
  },
  'kotlin': {
    name: 'Kotlin',
    extension: '.kt',
    template: 'fun main() {\n    println("Hello, World!")\n}',
    icon: '🟣'
  },
  'dart': {
    name: 'Dart',
    extension: '.dart',
    template: 'void main() {\n  print("Hello, World!");\n}',
    icon: '🎯'
  },
  'html': {
    name: 'HTML/CSS',
    extension: '.html',
    template: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>Document</title>\n    <style>\n        body { font-family: Arial; text-align: center; padding: 50px; }\n        h1 { color: #10b981; }\n    </style>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
    icon: '📄'
  },
  'sql': {
    name: 'SQL',
    extension: '.sql',
    template: '-- SQL Query\nSELECT "Hello, World!" AS greeting;',
    icon: '🗃️'
  },
  'react': {
    name: 'React.js',
    extension: '.jsx',
    template: 'import React from "react";\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello, World!</h1>\n    </div>\n  );\n}\n\nexport default App;',
    icon: '⚛️'
  },
  'nextjs': {
    name: 'Next.js',
    extension: '.tsx',
    template: 'export default function Home() {\n  return (\n    <main>\n      <h1>Hello, World!</h1>\n    </main>\n  );\n}',
    icon: '▲'
  },
  'nodejs': {
    name: 'Node.js',
    extension: '.js',
    template: '// Node.js Code\nconst http = require("http");\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { "Content-Type": "text/plain" });\n  res.end("Hello, World!");\n});\n\nconsole.log("Server running at http://localhost:3000/");',
    icon: '🟢'
  },
  'bunjs': {
    name: 'Bun.js',
    extension: '.ts',
    template: '// Bun.js Code\nconst server = Bun.serve({\n  port: 3000,\n  fetch(req) {\n    return new Response("Hello, World!");\n  },\n});\n\nconsole.log(`Server running at http://localhost:${server.port}/`);',
    icon: '🥟'
  },
  'mongodb': {
    name: 'MongoDB',
    extension: '.js',
    template: '// MongoDB Query\ndb.collection.find({ message: "Hello, World!" });',
    icon: '🍃'
  },
};

export default function CompilerPage() {
  const params = useParams();
  const lang = params.lang as string;
  const config = languageConfig[lang];
  const [code, setCode] = useState(config?.template || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showAllLangs, setShowAllLangs] = useState(false);

  // Popular languages to show in quick access
  const popularLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'rust', 'php'];

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput('Hello, World!\n\n--- Execution completed ---');
      setIsRunning(false);
    }, 1000);
  };

  if (!config) {
    return (
      <Layout>
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

  return (
    <Layout>
      <div className="container" style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '32px' }}>{config.icon}</span>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{config.name} Compiler</h1>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Online IDE • Write, Run & Share Code</span>
              </div>
            </div>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isRunning ? (
                <>⏳ Running...</>
              ) : (
                <>▶️ Run Code</>
              )}
            </button>
          </div>
          
          {/* Language Selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {popularLanguages.map((key) => {
              const cfg = languageConfig[key];
              return (
                <Link
                  key={key}
                  href={`/compiler/${key}`}
                  className={key === lang ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                >
                  {cfg.icon} {cfg.name}
                </Link>
              );
            })}
            <button 
              onClick={() => setShowAllLangs(!showAllLangs)}
              className="btn btn-outline btn-sm"
            >
              {showAllLangs ? '◀ Less' : '▶ More Languages'}
            </button>
          </div>
          
          {/* More Languages */}
          {showAllLangs && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              {Object.entries(languageConfig)
                .filter(([key]) => !popularLanguages.includes(key))
                .map(([key, cfg]) => (
                  <Link
                    key={key}
                    href={`/compiler/${key}`}
                    className={key === lang ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                  >
                    {cfg.icon} {cfg.name}
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Editor */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Code Editor */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>📝 main{config.extension}</span>
              <button onClick={() => setCode(config.template)} className="btn btn-outline btn-sm">
                🔄 Reset
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ 
                width: '100%', 
                height: '400px', 
                padding: '16px', 
                background: '#1e1e1e', 
                color: '#d4d4d4', 
                fontFamily: 'monospace', 
                fontSize: '14px', 
                resize: 'none', 
                border: 'none',
                outline: 'none'
              }}
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>💻 Output</span>
              <button onClick={() => setOutput('')} className="btn btn-outline btn-sm">
                🗑️ Clear
              </button>
            </div>
            <pre style={{ 
              width: '100%', 
              height: '400px', 
              padding: '16px', 
              background: '#0d1117', 
              color: '#58a6ff', 
              fontFamily: 'monospace', 
              fontSize: '14px', 
              overflow: 'auto',
              margin: 0
            }}>
              {output || 'Click "Run Code" to execute your code...'}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            💾 Save
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            📤 Share
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            📥 Download
          </button>
          <Link href="/compiler" className="btn btn-outline" style={{ marginLeft: 'auto' }}>
            View All Compilers
          </Link>
        </div>
      </div>
    </Layout>
  );
}
