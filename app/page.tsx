'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  const getTechIcon = (slug: string): string => {
    const icons: Record<string, string> = {
      'ai': '🤖', 'ai-agents': '🦾', 'machine-learning': '🧠', 'langchain': '🔗',
      'prompt-engineering': '💬', 'rag-systems': '📚', 'nlp': '💭', 'computer-vision': '👁️',
      'python-for-ai': '🐍', 'genai-applications': '✨', 'python': '🐍', 'javascript': '🟨',
      'react': '⚛️', 'nextjs': '▲', 'nodejs': '🟢', 'typescript': '🔷', 'default': '📘'
    };
    return icons[slug] || icons['default'];
  };

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-16 md:py-24">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/30">
                🚀 THE FUTURE IS AI - START YOUR JOURNEY
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI & AI Agents</span>
                <br />Build Your Future
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-xl">
                Learn to build intelligent AI agents, LLM applications, and cutting-edge AI solutions.
                From LangChain to RAG systems, master the technologies that are reshaping the world.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { value: '10+', label: 'AI Technologies' },
                  { value: '50+', label: 'AI Projects' },
                  { value: '1:1', label: 'AI Mentorship' },
                  { value: '24/7', label: 'AI Support' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/technologies/ai" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  Start Learning AI
                </Link>
                <Link href="/technologies/ai-agents" className="px-6 py-3 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors">
                  Explore AI Agents
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="absolute w-80 h-80 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-full blur-2xl" />
              <div className="relative w-80 h-56 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl bg-slate-900">
                <Image
                  src="/ai-resume-banner.png"
                  alt="AI learning and resume building"
                  fill
                  priority
                  className="object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <h3 className="text-2xl font-bold mb-3">🎓 Annual Membership</h3>
              <p className="text-blue-100 mb-6">
                Become a SkillStenz Pro member and enjoy unlimited access to all courses, projects, and exclusive content.
              </p>
              <Link href="/membership" className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors">
                Subscribe Now
              </Link>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
              <h3 className="text-2xl font-bold mb-3">🏆 Online Certifications</h3>
              <p className="text-blue-100 mb-6">
                Stand out with industry-recognized certifications and receive valuable certificates and knowledge.
              </p>
              <Link href="/certifications" className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors">
                Get Certified
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Latest <span className="text-blue-600">Updates</span> - December, 2025
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Newly Added and Updated Tutorials</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {latestUpdates.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                  <span className="text-xl">📚</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</span>
                  {item.isNew && (
                    <span className="ml-auto px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                      NEW
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Start Learning AI */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Start <span className="text-blue-600">Learning AI</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Master AI technologies from fundamentals to advanced</p>
            </div>
            <Link href="/technologies" className="px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
              See all
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="text-gray-500 dark:text-gray-400">Loading technologies...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(featuredTech.length > 0 ? featuredTech : technologies.slice(0, 8)).map((tech) => (
                <Link
                  key={tech._id}
                  href={`/technologies/${tech.slug}`}
                  className="flex flex-col items-center p-6 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-800 transition-colors text-center"
                >
                  <span className="text-3xl mb-3">{getTechIcon(tech.slug || '')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{tech.name}</span>
                  {tech.courses && tech.courses.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {tech.courses.length} course{tech.courses.length > 1 ? 's' : ''}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cheatsheets */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Cheatsheets <span className="text-blue-600">Instant Learning</span>
              </h2>
            </div>
            <Link href="/cheatsheets" className="px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cheatsheets.map((sheet, idx) => (
              <Link
                key={idx}
                href={sheet.href}
                className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors text-center"
              >
                <span className="text-3xl mb-3">{sheet.icon}</span>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{sheet.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmaps */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Roadmaps <span className="text-blue-600">Mastery Blueprint</span>
              </h2>
            </div>
            <Link href="/roadmaps" className="px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roadmaps.map((roadmap, idx) => (
              <Link
                key={idx}
                href={roadmap.href}
                className="flex flex-col items-center p-6 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-800 transition-colors text-center"
              >
                <span className="text-3xl mb-3">{roadmap.icon}</span>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{roadmap.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Build Your Career */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Build Your <span className="text-blue-600">Career</span> With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI & AI Agents */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  AI & <span className="text-blue-600">AI Agents</span>
                </h4>
              </div>
              <div className="p-6 flex flex-wrap gap-2">
                {['Artificial Intelligence', 'AI Agents', 'LangChain', 'Machine Learning', 'GenAI'].map((tag) => (
                  <Link key={tag} href={`/technologies/${tag.toLowerCase().replace(/ /g, '-')}`} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Full Stack Web Development */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  Full Stack <span className="text-red-500">Web Development</span>
                </h4>
              </div>
              <div className="p-6 flex flex-wrap gap-2">
                {['React.js', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB'].map((tag) => (
                  <Link key={tag} href={`/technologies/${tag.toLowerCase().replace(/\./g, '')}`} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Backend & DevOps */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  Backend & <span className="text-green-600">DevOps</span>
                </h4>
              </div>
              <div className="p-6 flex flex-wrap gap-2">
                {['Python', 'Java', 'Go', 'Docker', 'Kubernetes'].map((tag) => (
                  <Link key={tag} href={`/technologies/${tag.toLowerCase()}`} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile & Modern Languages */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  Mobile & <span className="text-purple-600">Modern Languages</span>
                </h4>
              </div>
              <div className="p-6 flex flex-wrap gap-2">
                {['Flutter', 'React Native', 'Swift', 'Kotlin', 'Rust'].map((tag) => (
                  <Link key={tag} href={`/technologies/${tag.toLowerCase().replace(/ /g, '-')}`} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Coding in Seconds */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-8 md:p-12 text-center border border-gray-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Start Coding <span className="text-blue-600">in Seconds</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Coding Ground For Developers - An interactive online platform for hands-on learning
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {[
                { name: '🐍 Python', href: '/compiler/python' },
                { name: '🟨 JavaScript', href: '/compiler/javascript' },
                { name: '🔷 TypeScript', href: '/compiler/typescript' },
                { name: '🐘 PHP', href: '/compiler/php' },
                { name: '☕ Java', href: '/compiler/java' },
                { name: '©️ C', href: '/compiler/c' },
                { name: '⚡ C++', href: '/compiler/cpp' },
                { name: '🔵 Go', href: '/compiler/go' },
                { name: '🦀 Rust', href: '/compiler/rust' },
                { name: '💎 Ruby', href: '/compiler/ruby' },
              ].map((lang) => (
                <Link key={lang.name} href={lang.href} className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                  {lang.name}
                </Link>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                { name: '⚛️ React.js', href: '/compiler/react' },
                { name: '▲ Next.js', href: '/compiler/nextjs' },
                { name: '🟢 Node.js', href: '/compiler/nodejs' },
                { name: '🥟 Bun.js', href: '/compiler/bunjs' },
                { name: '📄 HTML/CSS', href: '/compiler/html' },
                { name: '🗃️ SQL', href: '/compiler/sql' },
                { name: '🍃 MongoDB', href: '/compiler/mongodb' },
                { name: '🍎 Swift', href: '/compiler/swift' },
                { name: '🟣 Kotlin', href: '/compiler/kotlin' },
                { name: '🎯 Dart', href: '/compiler/dart' },
              ].map((lang) => (
                <Link key={lang.name} href={lang.href} className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium">
                  {lang.name}
                </Link>
              ))}
            </div>
            
            <Link href="/compiler" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              View All Compilers →
            </Link>
          </div>
        </div>
      </section>

      {/* Most Popular Tools */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Most Popular <span className="text-blue-600">Tools</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Utilize the frequently used tools for your needs</p>
            </div>
            <Link href="/tools" className="px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors text-center"
              >
                <span className="text-3xl mb-3">{tool.icon}</span>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
