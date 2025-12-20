'use client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'generator', name: 'Generators' },
    { id: 'formatter', name: 'Formatters' },
    { id: 'converter', name: 'Converters' },
    { id: 'editor', name: 'Editors' },
  ];

  const tools = [
    { slug: 'qr-generator', name: 'QR Code Generator', icon: '📱', category: 'generator', description: 'Generate QR codes for URLs, text, and more' },
    { slug: 'image-optimizer', name: 'Image Optimizer', icon: '🖼️', category: 'converter', description: 'Compress and optimize images for the web' },
    { slug: 'image-editor', name: 'Image Editor', icon: '✏️', category: 'editor', description: 'Edit images with filters, crop, and resize' },
    { slug: 'document-viewer', name: 'Document Viewer', icon: '📄', category: 'editor', description: 'View PDFs and documents online' },
    { slug: 'java-formatter', name: 'Java Formatter', icon: '☕', category: 'formatter', description: 'Format and beautify Java code' },
    { slug: 'whiteboard', name: 'Whiteboard', icon: '📝', category: 'editor', description: 'Interactive whiteboard for diagrams and notes' },
    { slug: 'js-minifier', name: 'JavaScript Minifier', icon: '📦', category: 'formatter', description: 'Minify JavaScript code for production' },
    { slug: 'python-formatter', name: 'Python Formatter', icon: '🐍', category: 'formatter', description: 'Format Python code with PEP8 compliance' },
    { slug: 'json-formatter', name: 'JSON Formatter', icon: '📋', category: 'formatter', description: 'Format and validate JSON data' },
    { slug: 'html-formatter', name: 'HTML Formatter', icon: '🌐', category: 'formatter', description: 'Beautify and format HTML code' },
    { slug: 'css-formatter', name: 'CSS Formatter', icon: '🎨', category: 'formatter', description: 'Format and organize CSS styles' },
    { slug: 'base64-encoder', name: 'Base64 Encoder', icon: '🔐', category: 'converter', description: 'Encode and decode Base64 strings' },
    { slug: 'color-picker', name: 'Color Picker', icon: '🎯', category: 'generator', description: 'Pick colors and get hex/rgb values' },
    { slug: 'password-generator', name: 'Password Generator', icon: '🔑', category: 'generator', description: 'Generate secure random passwords' },
    { slug: 'markdown-editor', name: 'Markdown Editor', icon: '📝', category: 'editor', description: 'Write and preview Markdown' },
    { slug: 'regex-tester', name: 'Regex Tester', icon: '🔍', category: 'editor', description: 'Test and debug regular expressions' },
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section hero-gradient" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            Developer <span style={{ color: 'rgba(255,255,255,0.8)' }}>Tools</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Free online tools to help you code faster and more efficiently
          </p>
          
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="navbar-search" style={{ background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <svg className="navbar-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="tabs" style={{ justifyContent: 'center', padding: '16px 0' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {filteredTools.length} Tools Available
            </h2>
          </div>

          <div className="grid grid-4" style={{ gap: '24px' }}>
            {filteredTools.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card">
                <div className="tool-card-icon">{tool.icon}</div>
                <div className="tool-card-title">{tool.name}</div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="card" style={{ 
            padding: '48px', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
              Missing a Tool?
            </h2>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '24px' }}>
              Let us know what tools you need and we&apos;ll add them to the collection
            </p>
            <button className="btn btn-dark btn-lg">
              Request a Tool
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
