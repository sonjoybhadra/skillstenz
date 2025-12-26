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
    { slug: 'xml-formatter', name: 'XML Formatter', icon: '📑', category: 'formatter', description: 'Format and validate XML data' },
    { slug: 'svg-editor', name: 'SVG Editor', icon: '🎭', category: 'editor', description: 'Create and edit SVG graphics' },
    { slug: 'url-encoder', name: 'URL Encoder', icon: '🔗', category: 'converter', description: 'Encode and decode URLs' },
    { slug: 'uuid-generator', name: 'UUID Generator', icon: '🆔', category: 'generator', description: 'Generate unique UUIDs' },
    { slug: 'hash-generator', name: 'Hash Generator', icon: '#️⃣', category: 'generator', description: 'Generate MD5, SHA hashes' },
    { slug: 'lorem-ipsum', name: 'Lorem Ipsum', icon: '📄', category: 'generator', description: 'Generate placeholder text' },
    { slug: 'yaml-formatter', name: 'YAML Formatter', icon: '⚙️', category: 'formatter', description: 'Format and validate YAML' },
    { slug: 'sql-formatter', name: 'SQL Formatter', icon: '🗄️', category: 'formatter', description: 'Format and beautify SQL queries' },
    { slug: 'diff-checker', name: 'Diff Checker', icon: '🔄', category: 'editor', description: 'Compare text differences' },
    { slug: 'unit-converter', name: 'Unit Converter', icon: '📐', category: 'converter', description: 'Convert between units' },
    { slug: 'json-to-csv', name: 'JSON to CSV', icon: '📊', category: 'converter', description: 'Convert JSON to CSV format' },
    { slug: 'timestamp-converter', name: 'Timestamp Converter', icon: '⏱️', category: 'converter', description: 'Convert Unix timestamps' },
    { slug: 'color-converter', name: 'Color Converter', icon: '🎨', category: 'converter', description: 'Convert between color formats' },
    { slug: 'ascii-art', name: 'ASCII Art Generator', icon: '🖌️', category: 'generator', description: 'Create ASCII art from text' },
    { slug: 'text-diff', name: 'Text Diff', icon: '📝', category: 'editor', description: 'Compare and highlight differences' },
    { slug: 'encryption-tool', name: 'Encryption Tool', icon: '🔒', category: 'converter', description: 'Encrypt and decrypt text' },
    { slug: 'qr-decoder', name: 'QR Code Decoder', icon: '📸', category: 'converter', description: 'Decode QR codes from images' },
    { slug: 'cron-parser', name: 'Cron Expression Parser', icon: '⏰', category: 'editor', description: 'Parse and explain cron syntax' },
    { slug: 'jwt-decoder', name: 'JWT Decoder', icon: '🔑', category: 'converter', description: 'Decode JWT tokens' },
    { slug: 'regex-generator', name: 'Regex Generator', icon: '🔍', category: 'generator', description: 'Generate regex patterns' },
    { slug: 'carbon-snippet', name: 'Code Snippet Formatter', icon: '💻', category: 'formatter', description: 'Format code for presentations' },
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
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">
            Developer <span className="opacity-80">Tools</span>
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Free online tools to help you code faster and more efficiently
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg flex items-center px-4 py-2 gap-3">
              <span className="text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none py-2 text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-2 py-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white border-2 border-purple-600'
                    : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-purple-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid - 6 Columns */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredTools.length} Tools Available
            </h2>
          </div>

          <div className="grid grid-cols-6 gap-5">
            {filteredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="bg-white rounded-lg p-5 text-center shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  {tool.name}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="p-12 text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg">
            <h2 className="text-3xl font-bold mb-3">
              Missing a Tool?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Let us know what tools you need and we'll add them to the collection
            </p>
            <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors">
              Request a Tool
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}