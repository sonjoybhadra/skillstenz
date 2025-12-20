'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useState } from 'react';

const toolsConfig: Record<string, { title: string; description: string; category: string }> = {
  'qr-generator': { title: 'QR Code Generator', description: 'Generate QR codes for URLs, text, and more', category: 'Utility' },
  'image-optimizer': { title: 'Image Optimizer', description: 'Compress and optimize images', category: 'Image' },
  'image-editor': { title: 'Image Editor', description: 'Edit and enhance images online', category: 'Image' },
  'document-viewer': { title: 'Document Viewer', description: 'View PDF, DOC, and other documents', category: 'Document' },
  'java-formatter': { title: 'Java Formatter', description: 'Format and beautify Java code', category: 'Code' },
  'whiteboard': { title: 'White Board', description: 'Digital whiteboard for sketching and notes', category: 'Utility' },
  'js-minifier': { title: 'JS Minifier', description: 'Minify JavaScript code', category: 'Code' },
  'python-formatter': { title: 'Python Formatter', description: 'Format and beautify Python code', category: 'Code' },
  'json-formatter': { title: 'JSON Formatter', description: 'Format and validate JSON data', category: 'Code' },
  'base64': { title: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings', category: 'Utility' },
  'color-picker': { title: 'Color Picker', description: 'Pick and convert colors', category: 'Design' },
  'markdown-preview': { title: 'Markdown Preview', description: 'Preview and edit Markdown', category: 'Document' },
};

// QR Generator Component
function QRGenerator() {
  const [text, setText] = useState('');
  
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text or URL"
        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
      />
      <button className="btn-primary">Generate QR Code</button>
      {text && (
        <div className="p-8 bg-white rounded-lg flex items-center justify-center">
          <div className="w-48 h-48 bg-[var(--muted)] flex items-center justify-center">
            <span className="text-[var(--muted-foreground)]">QR Code Preview</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Code Formatter Component
function CodeFormatter({ language }: { language: string }) {
  const [code, setCode] = useState('');
  
  return (
    <div className="space-y-4">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`Enter ${language} code`}
        rows={10}
        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono"
      />
      <div className="flex gap-2">
        <button className="btn-primary">Format Code</button>
        <button className="btn-secondary">Copy</button>
      </div>
    </div>
  );
}

// Whiteboard Component
function Whiteboard() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button className="btn-secondary">Pen</button>
        <button className="btn-secondary">Eraser</button>
        <button className="btn-secondary">Clear</button>
        <button className="btn-secondary">Save</button>
      </div>
      <div className="w-full h-96 bg-white border border-[var(--border)] rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Whiteboard Canvas</span>
      </div>
    </div>
  );
}

// Base64 Tool
function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const encode = () => setOutput(btoa(input));
  const decode = () => {
    try {
      setOutput(atob(input));
    } catch {
      setOutput('Invalid Base64 string');
    }
  };
  
  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text"
        rows={5}
        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
      />
      <div className="flex gap-2">
        <button onClick={encode} className="btn-primary">Encode</button>
        <button onClick={decode} className="btn-secondary">Decode</button>
      </div>
      {output && (
        <div className="p-4 bg-[var(--muted)] rounded-lg">
          <code className="text-sm break-all">{output}</code>
        </div>
      )}
    </div>
  );
}

// Image Tool Placeholder
function ImageTool({ type }: { type: string }) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-12 text-center">
        <svg className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-[var(--muted-foreground)]">Drag and drop images here or</p>
        <button className="btn-primary mt-4">Upload Image</button>
      </div>
      <p className="text-sm text-[var(--muted-foreground)]">{type === 'optimizer' ? 'Upload images to compress and optimize' : 'Upload images to edit'}</p>
    </div>
  );
}

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tool = toolsConfig[slug];

  if (!tool) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Tool Not Found</h1>
            <p className="text-[var(--muted-foreground)] mb-6">The tool you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/tools" className="btn-primary">
              Browse All Tools
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const renderTool = () => {
    switch (slug) {
      case 'qr-generator':
        return <QRGenerator />;
      case 'java-formatter':
        return <CodeFormatter language="Java" />;
      case 'python-formatter':
        return <CodeFormatter language="Python" />;
      case 'js-minifier':
        return <CodeFormatter language="JavaScript" />;
      case 'json-formatter':
        return <CodeFormatter language="JSON" />;
      case 'whiteboard':
        return <Whiteboard />;
      case 'base64':
        return <Base64Tool />;
      case 'image-optimizer':
        return <ImageTool type="optimizer" />;
      case 'image-editor':
        return <ImageTool type="editor" />;
      default:
        return (
          <div className="p-8 bg-[var(--muted)] rounded-lg text-center">
            <p className="text-[var(--muted-foreground)]">This tool is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Home</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <Link href="/tools" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Tools</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <span className="text-[var(--foreground)]">{tool.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <span className="px-3 py-1 bg-[var(--primary)] text-white text-sm rounded-full mb-4 inline-block">{tool.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">{tool.title}</h1>
          <p className="text-lg text-[var(--muted-foreground)]">{tool.description}</p>
        </div>

        {/* Tool Content */}
        <div className="card">
          {renderTool()}
        </div>

        {/* Other Tools */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">More Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(toolsConfig)
              .filter(([key]) => key !== slug)
              .slice(0, 4)
              .map(([key, t]) => (
                <Link key={key} href={`/tools/${key}`} className="card hover:border-[var(--primary)] transition-colors">
                  <h3 className="font-medium text-[var(--foreground)]">{t.title}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{t.category}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
