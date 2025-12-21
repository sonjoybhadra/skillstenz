'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { technologiesAPI, Technology } from '../lib/api';

export default function Home() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const { data, error } = await technologiesAPI.getAll();
        if (data && !error) {
          setTechnologies(data);
        }
      } catch (err) {
        console.error('Failed to fetch technologies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnologies();
  }, []);

  // Get icon for technology based on slug
  const getTechIcon = (slug: string): string => {
    const icons: Record<string, string> = {
      'ai': '🤖',
      'ai-agents': '🦾',
      'machine-learning': '🧠',
      'langchain': '🔗',
      'prompt-engineering': '💬',
      'rag-systems': '📚',
      'nlp': '💭',
      'computer-vision': '👁️',
      'python-for-ai': '🐍',
      'genai-applications': '✨',
      'default': '📘'
    };
    return icons[slug] || icons['default'];
  };

  // Featured technologies from database
  const featuredTech = technologies.filter(t => t.featured).slice(0, 8);

  const cheatsheets = [
    { name: 'Python Cheatsheet', icon: '🐍', href: '/cheatsheets/python' },
    { name: 'JavaScript Cheatsheet', icon: '🟨', href: '/cheatsheets/javascript' },
    { name: 'React Cheatsheet', icon: '⚛️', href: '/cheatsheets/react' },
    { name: 'TypeScript Cheatsheet', icon: '🔷', href: '/cheatsheets/typescript' },
    { name: 'SQL Cheatsheet', icon: '🗃️', href: '/cheatsheets/sql' },
    { name: 'Git Cheatsheet', icon: '📚', href: '/cheatsheets/git' },
    { name: 'Docker Cheatsheet', icon: '🐳', href: '/cheatsheets/docker' },
    { name: 'AI/ML Cheatsheet', icon: '🤖', href: '/cheatsheets/ai' },
  ];

  const roadmaps = [
    { name: 'Full Stack Developer', icon: '🚀', href: '/roadmaps/fullstack' },
    { name: 'Frontend Developer', icon: '🎨', href: '/roadmaps/frontend' },
    { name: 'Backend Developer', icon: '⚙️', href: '/roadmaps/backend' },
    { name: 'AI/ML Engineer', icon: '🤖', href: '/roadmaps/ai-ml' },
    { name: 'DevOps Engineer', icon: '🔧', href: '/roadmaps/devops' },
    { name: 'Mobile Developer', icon: '📱', href: '/roadmaps/mobile' },
    { name: 'Data Scientist', icon: '📊', href: '/roadmaps/data-scientist' },
    { name: 'Cloud Architect', icon: '☁️', href: '/roadmaps/cloud' },
  ];

  const tools = [
    { name: 'Code Formatter', icon: '✨', href: '/tools/formatter' },
    { name: 'JSON Viewer', icon: '📋', href: '/tools/json-viewer' },
    { name: 'Regex Tester', icon: '🔍', href: '/tools/regex' },
    { name: 'Color Picker', icon: '🎨', href: '/tools/color-picker' },
    { name: 'Base64 Encoder', icon: '🔐', href: '/tools/base64' },
    { name: 'Markdown Editor', icon: '📝', href: '/tools/markdown' },
    { name: 'API Tester', icon: '🌐', href: '/tools/api-tester' },
    { name: 'AI Code Generator', icon: '🤖', href: '/tools/ai-code' },
  ];

  const latestUpdates = [
    { title: 'AI Agents with LangGraph', isNew: true },
    { title: 'GPT-4 Vision Tutorial', isNew: true },
    { title: 'RAG with Pinecone', isNew: true },
    { title: 'LangChain v0.3 Guide', isNew: false },
    { title: 'Prompt Engineering Best Practices', isNew: false },
    { title: 'Building Multi-Agent Systems', isNew: true },
  ];

  return (
    <Layout>
      {/* Hero Section - AI Focused */}
      <section className="hero hero-gradient" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div className="hero-content">
              <div className="hero-badge">
                🚀 THE FUTURE IS AI - START YOUR JOURNEY
              </div>
              <h1 className="hero-title" style={{ color: 'white' }}>
                Master <span className="hero-title-accent">AI & AI Agents</span>
                <br />
                Build Your Future
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', marginTop: '16px', lineHeight: 1.6 }}>
                Learn to build intelligent AI Agents, LLM applications, and cutting-edge AI solutions. 
                From LangChain to RAG systems, master the technologies that are reshaping the world.
              </p>
              <div className="hero-stats" style={{ marginTop: '32px' }}>
                <div className="hero-stat">
                  <div className="hero-stat-value">10+</div>
                  <div className="hero-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>AI Technologies</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">50+</div>
                  <div className="hero-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>AI Projects</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">1:1</div>
                  <div className="hero-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>AI Mentorship</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">24/7</div>
                  <div className="hero-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>AI Support</div>
                </div>
              </div>
              <div className="hero-actions" style={{ marginTop: '32px' }}>
                <Link href="/technologies/ai" className="btn btn-primary btn-lg">
                  Start Learning AI
                </Link>
                <Link href="/technologies/ai-agents" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white', marginLeft: '16px' }}>
                  Explore AI Agents
                </Link>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                width: '320px', 
                height: '320px', 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '140px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '2px solid rgba(59, 130, 246, 0.2)'
              }}>
                🤖
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Membership & Certifications */}
      <section className="section" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '24px' }}>
            <div className="card" style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>🎓 Annual Membership</h3>
              <p style={{ opacity: 0.9, marginBottom: '24px' }}>
                Become a SkillStenz Pro member and enjoy unlimited access to all courses, projects, and exclusive content.
              </p>
              <Link href="/membership" className="btn btn-dark">
                Subscribe Now
              </Link>
            </div>
            <div className="card" style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>🏆 Online Certifications</h3>
              <p style={{ opacity: 0.9, marginBottom: '24px' }}>
                Stand out with industry-recognized certifications and receive valuable certificates and knowledge.
              </p>
              <Link href="/certifications" className="btn btn-dark">
                Get Certified
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="section" style={{ paddingTop: '48px', paddingBottom: '32px' }}>
        <div className="container">
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Latest <span style={{ color: 'var(--text-accent)' }}>Updates</span> - December, 2025
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Newly Added and Updated Tutorials</p>
              </div>
            </div>
            <div className="grid grid-3" style={{ gap: '12px' }}>
              {latestUpdates.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📚</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</span>
                  {item.isNew && <span className="badge badge-success" style={{ marginLeft: 'auto' }}>NEW</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Start Learning - Dynamic from Backend */}
      <section className="section" style={{ paddingTop: '32px' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Start <span className="section-title-accent">Learning AI</span>
              </h2>
              <p className="section-subtitle">Master AI technologies from fundamentals to advanced</p>
            </div>
            <div className="section-actions">
              <Link href="/technologies" className="btn btn-outline btn-sm">
                See all
              </Link>
            </div>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <div style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Loading technologies...</div>
            </div>
          ) : (
            <div className="grid grid-4">
              {(featuredTech.length > 0 ? featuredTech : technologies.slice(0, 8)).map((tech) => (
                <Link key={tech._id} href={`/technologies/${tech.slug}`} className="category-card">
                  <div className="category-card-icon">{getTechIcon(tech.slug || '')}</div>
                  <div className="category-card-title">{tech.name}</div>
                  {tech.courses && tech.courses.length > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {tech.courses.length} course{tech.courses.length > 1 ? 's' : ''}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cheatsheets */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Cheatsheets <span className="section-title-accent">Instant Learning</span>
              </h2>
            </div>
            <div className="section-actions">
              <Link href="/cheatsheets" className="btn btn-outline btn-sm">
                See all
              </Link>
            </div>
          </div>
          <div className="grid grid-4">
            {cheatsheets.map((sheet, idx) => (
              <Link key={idx} href={sheet.href} className="category-card">
                <div className="category-card-icon">{sheet.icon}</div>
                <div className="category-card-title">{sheet.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmaps */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Roadmaps <span className="section-title-accent">Mastery Blueprint</span>
              </h2>
            </div>
            <div className="section-actions">
              <Link href="/roadmaps" className="btn btn-outline btn-sm">
                See all
              </Link>
            </div>
          </div>
          <div className="grid grid-4">
            {roadmaps.map((roadmap, idx) => (
              <Link key={idx} href={roadmap.href} className="category-card">
                <div className="category-card-icon">{roadmap.icon}</div>
                <div className="category-card-title">{roadmap.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Build Your Career */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Build Your <span className="section-title-accent">Career</span> With Us
            </h2>
          </div>
          <div className="grid grid-2" style={{ gap: '24px' }}>
            {/* AI & AI Agents */}
            <div className="card">
              <div className="card-header" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  AI & <span style={{ color: '#3b82f6' }}>AI Agents</span>
                </h4>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Link href="/technologies/ai" className="tag">Artificial Intelligence</Link>
                  <Link href="/technologies/ai-agents" className="tag">AI Agents</Link>
                  <Link href="/technologies/langchain" className="tag">LangChain</Link>
                  <Link href="/technologies/machine-learning" className="tag">Machine Learning</Link>
                  <Link href="/technologies/genai" className="tag">GenAI</Link>
                </div>
              </div>
            </div>

            {/* Full Stack Web Development */}
            <div className="card">
              <div className="card-header" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Full Stack <span style={{ color: '#ef4444' }}>Web Development</span>
                </h4>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Link href="/technologies/react" className="tag">React.js</Link>
                  <Link href="/technologies/nextjs" className="tag">Next.js</Link>
                  <Link href="/technologies/nodejs" className="tag">Node.js</Link>
                  <Link href="/technologies/typescript" className="tag">TypeScript</Link>
                  <Link href="/technologies/mongodb" className="tag">MongoDB</Link>
                </div>
              </div>
            </div>

            {/* Backend & DevOps */}
            <div className="card">
              <div className="card-header" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Backend & <span style={{ color: 'var(--text-accent)' }}>DevOps</span>
                </h4>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Link href="/technologies/python" className="tag">Python</Link>
                  <Link href="/technologies/java" className="tag">Java</Link>
                  <Link href="/technologies/go" className="tag">Go</Link>
                  <Link href="/technologies/docker" className="tag">Docker</Link>
                  <Link href="/technologies/kubernetes" className="tag">Kubernetes</Link>
                </div>
              </div>
            </div>

            {/* Mobile & Modern Languages */}
            <div className="card">
              <div className="card-header" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Mobile & <span style={{ color: '#a855f7' }}>Modern Languages</span>
                </h4>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Link href="/technologies/flutter" className="tag">Flutter</Link>
                  <Link href="/technologies/react-native" className="tag">React Native</Link>
                  <Link href="/technologies/swift" className="tag">Swift</Link>
                  <Link href="/technologies/kotlin" className="tag">Kotlin</Link>
                  <Link href="/technologies/rust" className="tag">Rust</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Coding in Seconds */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: '48px', textAlign: 'center', background: 'var(--bg-tertiary)' }}>
            <h2 className="section-title" style={{ marginBottom: '8px' }}>
              Start Coding <span className="section-title-accent">in Seconds</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Coding Ground For Developers - An interactive online platform for hands-on learning
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              <Link href="/compiler/python" className="btn btn-secondary">🐍 Python</Link>
              <Link href="/compiler/javascript" className="btn btn-secondary">🟨 JavaScript</Link>
              <Link href="/compiler/typescript" className="btn btn-secondary">🔷 TypeScript</Link>
              <Link href="/compiler/php" className="btn btn-secondary">🐘 PHP</Link>
              <Link href="/compiler/java" className="btn btn-secondary">☕ Java</Link>
              <Link href="/compiler/c" className="btn btn-secondary">©️ C</Link>
              <Link href="/compiler/cpp" className="btn btn-secondary">⚡ C++</Link>
              <Link href="/compiler/go" className="btn btn-secondary">🔵 Go</Link>
              <Link href="/compiler/rust" className="btn btn-secondary">🦀 Rust</Link>
              <Link href="/compiler/ruby" className="btn btn-secondary">💎 Ruby</Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <Link href="/compiler/react" className="btn btn-outline btn-sm">⚛️ React.js</Link>
              <Link href="/compiler/nextjs" className="btn btn-outline btn-sm">▲ Next.js</Link>
              <Link href="/compiler/nodejs" className="btn btn-outline btn-sm">🟢 Node.js</Link>
              <Link href="/compiler/bunjs" className="btn btn-outline btn-sm">🥟 Bun.js</Link>
              <Link href="/compiler/html" className="btn btn-outline btn-sm">📄 HTML/CSS</Link>
              <Link href="/compiler/sql" className="btn btn-outline btn-sm">🗃️ SQL</Link>
              <Link href="/compiler/mongodb" className="btn btn-outline btn-sm">🍃 MongoDB</Link>
              <Link href="/compiler/swift" className="btn btn-outline btn-sm">🍎 Swift</Link>
              <Link href="/compiler/kotlin" className="btn btn-outline btn-sm">🟣 Kotlin</Link>
              <Link href="/compiler/dart" className="btn btn-outline btn-sm">🎯 Dart</Link>
            </div>
            <div style={{ marginTop: '24px' }}>
              <Link href="/compiler" className="btn btn-primary">View All Compilers →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Most Popular Tools */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Most Popular <span className="section-title-accent">Tools</span>
              </h2>
              <p className="section-subtitle">Utilize the frequently used tools for your needs</p>
            </div>
            <div className="section-actions">
              <Link href="/tools" className="btn btn-outline btn-sm">
                See all
              </Link>
            </div>
          </div>
          <div className="grid grid-4">
            {tools.map((tool, idx) => (
              <Link key={idx} href={tool.href} className="tool-card">
                <div className="tool-card-icon">{tool.icon}</div>
                <div className="tool-card-title">{tool.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
