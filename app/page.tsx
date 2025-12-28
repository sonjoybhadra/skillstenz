'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { technologiesAPI, homepageAPI, tutorialsAPI, cheatsheetsAPI, roadmapsAPI, Technology, HomeSectionsMap, LatestUpdate, Cheatsheet, Roadmap } from '../lib/api';

export default function Home() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [sections, setSections] = useState<HomeSectionsMap>({});
  const [latestUpdates, setLatestUpdates] = useState<LatestUpdate[]>([]);
  const [latestMonthYear, setLatestMonthYear] = useState<string>('December, 2025');
  const [dbCheatsheets, setDbCheatsheets] = useState<Cheatsheet[]>([]);
  const [dbRoadmaps, setDbRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [techResponse, sectionsResponse, latestResponse, cheatsheetsResponse, roadmapsResponse] = await Promise.all([
          technologiesAPI.getAll(),
          homepageAPI.getAllSections(),
          tutorialsAPI.getLatestUpdates(6),
          cheatsheetsAPI.getAll({ limit: 8 }),
          roadmapsAPI.getAll()
        ]);
        
        if (techResponse.data) {
          setTechnologies(techResponse.data);
        }
        
        if (sectionsResponse.data && 'data' in sectionsResponse.data) {
          setSections(sectionsResponse.data.data);
        }
        
        if (latestResponse.data && 'latestUpdates' in latestResponse.data) {
          setLatestUpdates(latestResponse.data.latestUpdates);
          setLatestMonthYear(latestResponse.data.monthYear);
        }
        
        if (cheatsheetsResponse.data && 'cheatsheets' in cheatsheetsResponse.data) {
          setDbCheatsheets(cheatsheetsResponse.data.cheatsheets);
        }
        
        if (roadmapsResponse.data && 'roadmaps' in roadmapsResponse.data) {
          setDbRoadmaps(roadmapsResponse.data.roadmaps);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  // Get section data with fallbacks
  const heroSection = sections.hero;
  const ctaCardsSection = sections.cta_cards;
  const latestUpdatesSection = sections.latest_updates;
  const cheatsheetsSection = sections.cheatsheets;
  const roadmapsSection = sections.roadmaps;
  const careerSection = sections.career_categories;
  const compilerSection = sections.compiler;
  const toolsSection = sections.tools;

  // Fallback data for sections that don't exist yet
  const defaultCheatsheets = [
    { name: 'Python Cheatsheet', icon: '🐍', href: '/cheatsheets/python' },
    { name: 'JavaScript Cheatsheet', icon: '🟨', href: '/cheatsheets/javascript' },
    { name: 'React Cheatsheet', icon: '⚛️', href: '/cheatsheets/react' },
    { name: 'TypeScript Cheatsheet', icon: '🔷', href: '/cheatsheets/typescript' },
    { name: 'SQL Cheatsheet', icon: '🗃️', href: '/cheatsheets/sql' },
    { name: 'Git Cheatsheet', icon: '📚', href: '/cheatsheets/git' },
    { name: 'Docker Cheatsheet', icon: '🐳', href: '/cheatsheets/docker' },
    { name: 'AI/ML Cheatsheet', icon: '🤖', href: '/cheatsheets/ai' },
  ];

  const defaultRoadmaps = [
    { name: 'Full Stack Developer', icon: '🚀', href: '/roadmaps/fullstack' },
    { name: 'Frontend Developer', icon: '🎨', href: '/roadmaps/frontend' },
    { name: 'Backend Developer', icon: '⚙️', href: '/roadmaps/backend' },
    { name: 'AI/ML Engineer', icon: '🤖', href: '/roadmaps/ai-ml' },
    { name: 'DevOps Engineer', icon: '🔧', href: '/roadmaps/devops' },
    { name: 'Mobile Developer', icon: '📱', href: '/roadmaps/mobile' },
    { name: 'Data Scientist', icon: '📊', href: '/roadmaps/data-scientist' },
    { name: 'Cloud Architect', icon: '☁️', href: '/roadmaps/cloud' },
  ];

  const defaultTools = [
    { name: 'Code Formatter', icon: '✨', href: '/tools/formatter' },
    { name: 'JSON Viewer', icon: '📋', href: '/tools/json-viewer' },
    { name: 'Regex Tester', icon: '🔍', href: '/tools/regex' },
    { name: 'Color Picker', icon: '🎨', href: '/tools/color-picker' },
    { name: 'Base64 Encoder', icon: '🔐', href: '/tools/base64' },
    { name: 'Markdown Editor', icon: '📝', href: '/tools/markdown' },
    { name: 'API Tester', icon: '🌐', href: '/tools/api-tester' },
    { name: 'AI Code Generator', icon: '🤖', href: '/tools/ai-code' },
  ];

  const defaultLatestUpdates: LatestUpdate[] = [
    { _id: '1', name: 'AI Agents with LangGraph', title: 'AI Agents with LangGraph', slug: 'ai-agents-langgraph', isNew: true, technologySlug: 'ai', icon: '🤖', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { _id: '2', name: 'GPT-4 Vision Tutorial', title: 'GPT-4 Vision Tutorial', slug: 'gpt4-vision', isNew: true, technologySlug: 'ai', icon: '👁️', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { _id: '3', name: 'RAG with Pinecone', title: 'RAG with Pinecone', slug: 'rag-pinecone', isNew: true, technologySlug: 'ai', icon: '📚', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { _id: '4', name: 'LangChain v0.3 Guide', title: 'LangChain v0.3 Guide', slug: 'langchain-guide', isNew: false, technologySlug: 'langchain', icon: '🔗', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { _id: '5', name: 'Prompt Engineering Best Practices', title: 'Prompt Engineering Best Practices', slug: 'prompt-engineering', isNew: false, technologySlug: 'ai', icon: '💬', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { _id: '6', name: 'Building Multi-Agent Systems', title: 'Building Multi-Agent Systems', slug: 'multi-agent-systems', isNew: true, technologySlug: 'ai', icon: '🦾', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  ];

  const defaultCareerCategories = [
    { title: 'AI & AI Agents', colorClass: 'blue', tags: ['Artificial Intelligence', 'AI Agents', 'LangChain', 'Machine Learning', 'GenAI'] },
    { title: 'Full Stack Web Development', colorClass: 'red', tags: ['React.js', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB'] },
    { title: 'Backend & DevOps', colorClass: 'green', tags: ['Python', 'Java', 'Go', 'Docker', 'Kubernetes'] },
    { title: 'Mobile & Modern Languages', colorClass: 'purple', tags: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Rust'] },
  ];

  const defaultCtaCards = [
    { title: '🎓 Annual Membership', description: 'Become a SkillStenz Pro member and enjoy unlimited access to all courses, projects, and exclusive content.', buttonText: 'Subscribe Now', buttonHref: '/membership', gradient: 'from-blue-600 to-blue-700' },
    { title: '🏆 Online Certifications', description: 'Stand out with industry-recognized certifications and receive valuable certificates and knowledge.', buttonText: 'Get Certified', buttonHref: '/certifications', gradient: 'from-blue-500 to-indigo-700' },
  ];

  const defaultCompilerLanguages = {
    primary: [
      { name: 'Python', icon: '🐍', href: '/compiler/python' },
      { name: 'JavaScript', icon: '🟨', href: '/compiler/javascript' },
      { name: 'TypeScript', icon: '🔷', href: '/compiler/typescript' },
      { name: 'PHP', icon: '🐘', href: '/compiler/php' },
      { name: 'Java', icon: '☕', href: '/compiler/java' },
      { name: 'C', icon: '©️', href: '/compiler/c' },
      { name: 'C++', icon: '⚡', href: '/compiler/cpp' },
      { name: 'Go', icon: '🔵', href: '/compiler/go' },
      { name: 'Rust', icon: '🦀', href: '/compiler/rust' },
      { name: 'Ruby', icon: '💎', href: '/compiler/ruby' },
    ],
    secondary: [
      { name: 'React.js', icon: '⚛️', href: '/compiler/react' },
      { name: 'Next.js', icon: '▲', href: '/compiler/nextjs' },
      { name: 'Node.js', icon: '🟢', href: '/compiler/nodejs' },
      { name: 'Bun.js', icon: '🥟', href: '/compiler/bunjs' },
      { name: 'HTML/CSS', icon: '📄', href: '/compiler/html' },
      { name: 'SQL', icon: '🗃️', href: '/compiler/sql' },
      { name: 'MongoDB', icon: '🍃', href: '/compiler/mongodb' },
      { name: 'Swift', icon: '🍎', href: '/compiler/swift' },
      { name: 'Kotlin', icon: '🟣', href: '/compiler/kotlin' },
      { name: 'Dart', icon: '🎯', href: '/compiler/dart' },
    ]
  };

  // Use real data from API, fall back to section data, then defaults
  // Cheatsheets: use db data if available
  // Cheatsheets type for display
  interface DisplayCheatsheet {
    name: string;
    icon?: string;
    href: string;
    slug?: string;
    technology?: string;
  }

  // Roadmaps type for display
  interface DisplayRoadmap {
    name: string;
    icon?: string;
    href: string;
    slug?: string;
    duration?: string;
    difficulty?: string;
  }

  const displayCheatsheets: DisplayCheatsheet[] = dbCheatsheets.length > 0 
    ? dbCheatsheets.map(cs => ({
        name: cs.title,
        icon: cs.icon || cs.technology?.icon || '📋',
        href: `/cheatsheets/${cs.slug}`,
        slug: cs.slug,
        technology: cs.technology?.name
      }))
    : (cheatsheetsSection?.items || defaultCheatsheets).map(item => ({
        name: item.name,
        icon: item.icon,
        href: item.href || '#',
        slug: 'slug' in item ? item.slug : undefined,
        technology: 'technology' in item ? item.technology : undefined
      }));
  
  // Roadmaps: use db data if available
  const displayRoadmaps: DisplayRoadmap[] = dbRoadmaps.length > 0
    ? dbRoadmaps.map(rm => ({
        name: rm.title || rm.name,
        icon: rm.icon || '🗺️',
        href: `/roadmaps/${rm.slug}`,
        slug: rm.slug,
        duration: rm.duration,
        difficulty: rm.difficulty
      }))
    : (roadmapsSection?.items || defaultRoadmaps).map(item => ({
        name: item.name,
        icon: item.icon,
        href: item.href || '#',
        slug: 'slug' in item ? item.slug : undefined,
        duration: 'duration' in item ? item.duration : undefined,
        difficulty: 'difficulty' in item ? item.difficulty : undefined
      }));

  const tools = toolsSection?.items || defaultTools;
  // Use real latestUpdates from API, fall back to default
  const displayLatestUpdates: LatestUpdate[] = latestUpdates.length > 0 ? latestUpdates : defaultLatestUpdates;
  const displayMonthYear = latestUpdates.length > 0 ? latestMonthYear : 'December, 2025';
  const careerCategories = careerSection?.careerCategories || defaultCareerCategories;
  const ctaCards = ctaCardsSection?.ctaCards || defaultCtaCards;
  
  const compilerPrimaryLangs = compilerSection?.compilerData?.languages?.filter(l => l.isPrimary) || defaultCompilerLanguages.primary.map(l => ({ ...l, isPrimary: true }));
  const compilerSecondaryLangs = compilerSection?.compilerData?.languages?.filter(l => !l.isPrimary) || defaultCompilerLanguages.secondary.map(l => ({ ...l, isPrimary: false }));

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600' },
      red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-500' },
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600' },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <Layout>
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden bg-slate-950 py-12 md:py-16 lg:py-24">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-cyan-600/30 animate-gradient-slow" />
          
          {/* Floating orbs */}
          <div className="absolute top-10 left-10 w-48 md:w-60 lg:w-72 h-48 md:h-60 lg:h-72 bg-blue-500/40 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-40 right-20 w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 bg-purple-500/30 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute bottom-10 left-1/3 w-56 md:w-68 lg:w-80 h-56 md:h-68 lg:h-80 bg-cyan-500/30 rounded-full blur-3xl animate-float-fast" />
          <div className="absolute bottom-20 right-10 w-44 md:w-56 lg:w-64 h-44 md:h-56 lg:h-64 bg-pink-500/20 rounded-full blur-3xl animate-float-slow" />
          
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2360a5fa' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          {/* Moving particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/30 backdrop-blur-sm animate-pulse-slow">
                {heroSection?.heroData?.badge || '🚀 THE FUTURE IS AI - START YOUR JOURNEY'}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                {heroSection?.heroData?.mainTitle || 'Master'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 animate-gradient-text">{heroSection?.heroData?.highlightTitle || 'AI & AI Agents'}</span>
                <br />Build Your Future
              </h1>
              <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-xl">
                {heroSection?.heroData?.description || 'Learn to build intelligent AI agents, LLM applications, and cutting-edge AI solutions. From LangChain to RAG systems, master the technologies that are reshaping the world.'}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8">
                {(heroSection?.heroData?.stats || [
                  { value: '10+', label: 'AI Technologies' },
                  { value: '50+', label: 'AI Projects' },
                  { value: '1:1', label: 'AI Mentorship' },
                  { value: '24/7', label: 'AI Support' },
                ]).map((stat, idx) => (
                  <div key={idx} className="text-center p-2 md:p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-[10px] md:text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                {(heroSection?.heroData?.ctaButtons || [
                  { text: 'Start Learning AI', href: '/technologies/ai', variant: 'primary' },
                  { text: 'Explore AI Agents', href: '/technologies/ai-agents', variant: 'secondary' },
                ]).map((btn, idx) => (
                  <Link 
                    key={idx}
                    href={btn.href} 
                    className={idx === 0 
                      ? "px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                      : "px-6 py-3 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm"
                    }
                  >
                    {btn.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - AI Human with Circuit */}
            <div className="relative hidden md:flex justify-center items-center">
              {/* Glowing background */}
              <div className="absolute w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-cyan-500/40 rounded-full blur-3xl animate-pulse-slow" />
              
              {/* Circuit lines decoration */}
              <svg className="absolute w-full h-full opacity-30" viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <path d="M50,200 L150,200 L150,100 L250,100" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" className="animate-draw-line" />
                <path d="M350,150 L300,150 L300,250 L200,250" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: '0.5s' }} />
                <path d="M100,300 L200,300 L200,350" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: '1s' }} />
                <circle cx="150" cy="200" r="4" fill="#60a5fa" className="animate-pulse" />
                <circle cx="250" cy="100" r="4" fill="#a78bfa" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                <circle cx="200" cy="250" r="4" fill="#22d3ee" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
              </svg>
              
              {/* AI Human Image Container */}
              <div className="relative z-10 w-56 md:w-64 lg:w-80 h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                <Image
                  src={heroSection?.heroData?.backgroundImage || "/ai-human-circuit.png"}
                  alt="AI and Human with Circuit"
                  fill
                  priority
                  className="object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {/* Fallback AI Avatar */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                  <div className="text-center">
                    <div className="w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 mx-auto mb-3 md:mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-4xl md:text-5xl lg:text-6xl">🤖</span>
                    </div>
                    <div className="text-white/80 text-sm">AI-Powered Learning</div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute top-10 right-0 px-3 py-2 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/30 animate-float-slow">
                <span className="text-blue-300 text-sm font-medium">🧠 AI Powered</span>
              </div>
              <div className="absolute bottom-20 left-0 px-3 py-2 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30 animate-float-medium">
                <span className="text-purple-300 text-sm font-medium">⚡ Smart Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      {ctaCardsSection?.isActive !== false && (
        <section className="py-12 bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ctaCards.map((card, idx) => (
                <div key={idx} className={`p-8 rounded-xl bg-gradient-to-br ${card.gradient || 'from-blue-600 to-blue-700'} text-white`}>
                  <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                  <p className="text-blue-100 mb-6">{card.description}</p>
                  <Link href={card.buttonHref || '#'} className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors">
                    {card.buttonText || 'Learn More'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Updates */}
      {latestUpdatesSection?.isActive !== false && (
        <section className="py-12 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {latestUpdatesSection?.title || 'Latest'} <span className="text-blue-600">{latestUpdatesSection?.highlightText || 'Updates'}</span> - {displayMonthYear}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{latestUpdatesSection?.subtitle || 'Newly Added and Updated Tutorials'}</p>
                </div>
                <Link href="/tutorials" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayLatestUpdates.map((item, idx) => (
                  <Link 
                    key={idx} 
                    href={item.href || `/tutorials/${item.technologySlug || ''}/${item.slug || ''}`}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                  >
                    <span className="text-xl">{item.icon || '📚'}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white block truncate">{item.name || item.title}</span>
                      {item.technology && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.technology}</span>
                      )}
                    </div>
                    {item.isNew && (
                      <span className="flex-shrink-0 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                        NEW
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Start Learning AI */}
      <section className="py-8 md:py-10 lg:py-12 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Start <span className="text-blue-600">Learning AI</span>
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Master AI technologies from fundamentals to advanced</p>
            </div>
            <Link href="/technologies" className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs md:text-sm font-medium transition-colors">
              See all
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="text-gray-500 dark:text-gray-400">Loading technologies...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {(featuredTech.length > 0 ? featuredTech : technologies.slice(0, 8)).map((tech) => (
                <Link
                  key={tech._id}
                  href={`/technologies/${tech.slug}`}
                  className="flex flex-col items-center p-4 md:p-5 lg:p-6 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-800 transition-colors text-center"
                >
                  <span className="text-2xl md:text-3xl mb-2 md:mb-3">{getTechIcon(tech.slug || '')}</span>
                  <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{tech.name}</span>
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
      {cheatsheetsSection?.isActive !== false && (
        <section className="py-8 md:py-10 lg:py-12 bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {cheatsheetsSection?.title || 'Cheatsheets'} <span className="text-blue-600">{cheatsheetsSection?.highlightText || 'Instant Learning'}</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1">Quick reference guides for developers</p>
              </div>
              <Link href={cheatsheetsSection?.seeAllLink || "/cheatsheets"} className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs md:text-sm font-medium transition-colors">
                {cheatsheetsSection?.seeAllText || 'See all'}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {displayCheatsheets.map((sheet, idx) => (
                <Link
                  key={idx}
                  href={sheet.href || `/cheatsheets/${sheet.slug || ''}`}
                  className="flex flex-col items-center p-4 md:p-5 lg:p-6 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-center group"
                >
                  <span className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">{sheet.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">{sheet.name}</span>
                  {sheet.technology && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sheet.technology}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Roadmaps */}
      {roadmapsSection?.isActive !== false && (
        <section className="py-8 md:py-10 lg:py-12 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {roadmapsSection?.title || 'Roadmaps'} <span className="text-blue-600">{roadmapsSection?.highlightText || 'Mastery Blueprint'}</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1">Step-by-step learning paths for developers</p>
              </div>
              <Link href={roadmapsSection?.seeAllLink || "/roadmaps"} className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs md:text-sm font-medium transition-colors">
                {roadmapsSection?.seeAllText || 'See all'}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {displayRoadmaps.map((roadmap, idx) => (
                <Link
                  key={idx}
                  href={roadmap.href || `/roadmaps/${roadmap.slug || ''}`}
                  className="flex flex-col items-center p-4 md:p-5 lg:p-6 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-center group"
                >
                  <span className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">{roadmap.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">{roadmap.name}</span>
                  {roadmap.duration && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{roadmap.duration}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Build Your Career */}
      {careerSection?.isActive !== false && (
        <section className="py-8 md:py-10 lg:py-12 bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mb-6 md:mb-8">
              {careerSection?.title || 'Build Your'} <span className="text-blue-600">{careerSection?.highlightText || 'Career'}</span> With Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {careerCategories.map((category, idx) => {
                const colors = getColorClasses(category.colorClass || 'blue');
                const titleParts = category.title.split(' & ');
                return (
                  <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className={`px-6 py-4 ${colors.bg} border-b border-gray-200 dark:border-slate-700`}>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {titleParts[0]} {titleParts[1] && <span className={colors.text}>& {titleParts[1]}</span>}
                      </h4>
                    </div>
                    <div className="p-6 flex flex-wrap gap-2">
                      {(category.tags || []).map((tag) => (
                        <Link 
                          key={tag} 
                          href={`/technologies/${tag.toLowerCase().replace(/ /g, '-').replace(/\./g, '')}`} 
                          className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Start Coding in Seconds */}
      {compilerSection?.isActive !== false && (
        <section className="py-8 md:py-10 lg:py-12 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-6 md:p-8 lg:p-12 text-center border border-gray-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {compilerSection?.compilerData?.title || 'Start Coding'} <span className="text-blue-600">in Seconds</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {compilerSection?.compilerData?.subtitle || 'Coding Ground For Developers - An interactive online platform for hands-on learning'}
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {compilerPrimaryLangs.map((lang) => (
                  <Link key={lang.name} href={lang.href} className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                    {lang.icon ? `${lang.icon} ${lang.name}` : lang.name}
                  </Link>
                ))}
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {compilerSecondaryLangs.map((lang) => (
                  <Link key={lang.name} href={lang.href} className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium">
                    {lang.icon ? `${lang.icon} ${lang.name}` : lang.name}
                  </Link>
                ))}
              </div>
              
              <Link href={compilerSection?.compilerData?.ctaButton?.href || "/compiler"} className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                {compilerSection?.compilerData?.ctaButton?.text || 'View All Compilers'} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Most Popular Tools */}
      {toolsSection?.isActive !== false && (
        <section className="py-8 md:py-10 lg:py-12 bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {toolsSection?.title || 'Most Popular'} <span className="text-blue-600">{toolsSection?.highlightText || 'Tools'}</span>
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{toolsSection?.subtitle || 'Utilize the frequently used tools for your needs'}</p>
              </div>
              <Link href={toolsSection?.seeAllLink || "/tools"} className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs md:text-sm font-medium transition-colors">
                {toolsSection?.seeAllText || 'See all'}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {tools.map((tool, idx) => (
                <Link
                  key={idx}
                  href={tool.href || '#'}
                  className="flex flex-col items-center p-4 md:p-5 lg:p-6 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-700 transition-colors text-center"
                >
                  <span className="text-2xl md:text-3xl mb-2 md:mb-3">{tool.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Online AI & Coding Classes for Kids */}
      {sections.kids_courses?.isActive !== false && (
        <section className="py-10 md:py-12 lg:py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-10 lg:mb-12">
              <span className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
                👨‍👩‍👧‍👦 For Kids & Teens
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                {sections.kids_courses?.title || 'Best Online'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">{sections.kids_courses?.highlightText || 'AI & Coding Classes'}</span> for Kids
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {sections.kids_courses?.kidsCoursesData?.tagline || sections.kids_courses?.subtitle || 'Make your child a future innovator'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {(sections.kids_courses?.kidsCoursesData?.courses || [
                { title: 'AI Explorer', gradeRange: 'Grade 1-3', icon: '🤖', description: 'Introduction to AI concepts through fun activities', features: ['Interactive games', 'Visual programming', 'AI art creation'] },
                { title: 'Code Ninja', gradeRange: 'Grade 4-6', icon: '🥷', description: 'Build games and animations with block-based coding', features: ['Scratch programming', 'Game development', 'Logic puzzles'] },
                { title: 'Python Prodigy', gradeRange: 'Grade 7-9', icon: '🐍', description: 'Learn Python programming with real projects', features: ['Python basics', 'Web scraping', 'Data visualization'] },
                { title: 'AI Developer', gradeRange: 'Grade 10-12', icon: '🧠', description: 'Advanced AI & Machine Learning concepts', features: ['Machine learning', 'Neural networks', 'AI projects'] },
              ]).map((course, idx) => (
                <div key={idx} className="group bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-slate-700 hover:-translate-y-1">
                  <div className="w-12 md:w-14 lg:w-16 h-12 md:h-14 lg:h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    {course.icon}
                  </div>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium mb-3">
                    {course.gradeRange}
                  </span>
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-4">{course.description}</p>
                  <ul className="space-y-2">
                    {course.features?.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center mt-6 md:mt-8 lg:mt-10">
              <Link href={sections.kids_courses?.seeAllLink || "/courses/kids"} className="inline-flex items-center px-6 md:px-7 lg:px-8 py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm md:text-base font-semibold rounded-lg md:rounded-xl transition-all shadow-lg hover:shadow-xl">
                Explore All Kids Courses
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Should Your Child Learn AI & Coding */}
      {sections.why_learn_ai?.isActive !== false && (
        <section className="py-10 md:py-12 lg:py-16 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                {sections.why_learn_ai?.title || 'Why Should Your Child Learn'} <span className="text-blue-600">{sections.why_learn_ai?.highlightText || 'AI & Coding?'}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {sections.why_learn_ai?.subtitle || 'Prepare your child for the future with essential 21st-century skills'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {(sections.why_learn_ai?.whyLearnPoints || [
                { icon: '🧠', title: 'Develops Critical Thinking', description: 'Coding teaches kids to break down complex problems into smaller, manageable steps.' },
                { icon: '🚀', title: 'Future-Proof Career', description: 'AI and coding skills will be essential in nearly every industry by 2030.' },
                { icon: '💡', title: 'Boosts Creativity', description: 'Building apps and AI projects encourages creative expression and innovation.' },
                { icon: '🎯', title: 'Improves Math Skills', description: 'Programming reinforces mathematical concepts through practical application.' },
                { icon: '🤝', title: 'Builds Confidence', description: 'Completing coding projects gives kids a sense of achievement and self-confidence.' },
                { icon: '🌍', title: 'Global Opportunities', description: 'Coding is a universal language that opens doors worldwide.' },
              ]).map((point, idx) => (
                <div key={idx} className="flex gap-3 md:gap-4 p-4 md:p-5 lg:p-6 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                  <div className="flex-shrink-0 w-10 md:w-11 lg:w-12 h-10 md:h-11 lg:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl md:text-2xl">
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-1 md:mb-2">{point.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Student Testimonials */}
      {sections.testimonials?.isActive !== false && (
        <section className="py-10 md:py-12 lg:py-16 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                {sections.testimonials?.title || 'What Our'} <span className="text-yellow-300">{sections.testimonials?.highlightText || 'Students Say'}</span>
              </h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                {sections.testimonials?.subtitle || 'Hear from our young innovators and their parents'}
              </p>
            </div>

            <div className="relative">
              {/* Testimonials Slider */}
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {(sections.testimonials?.testimonials || [
                  { name: 'Arjun S.', role: 'Grade 8 Student', avatar: '👦', rating: 5, content: 'I built my first AI chatbot! The courses are super fun and the teachers explain everything so well.', course: 'Python Prodigy' },
                  { name: 'Priya M.', role: 'Parent', avatar: '👩', rating: 5, content: 'My daughter loves the weekend classes. She went from playing games to creating them!', course: 'Code Ninja' },
                  { name: 'Rahul K.', role: 'Grade 10 Student', avatar: '👨‍🎓', rating: 5, content: 'The AI projects are amazing. I&apos;m now preparing for national-level coding competitions.', course: 'AI Developer' },
                  { name: 'Sneha P.', role: 'Grade 5 Student', avatar: '👧', rating: 5, content: 'I made my own game with Scratch! My friends think I&apos;m a coding genius now.', course: 'Code Ninja' },
                  { name: 'Dr. Sharma', role: 'Parent', avatar: '👨‍⚕️', rating: 5, content: 'Excellent curriculum and patient instructors. Worth every penny invested in my child&apos;s future.', course: 'AI Explorer' },
                ]).map((testimonial, idx) => (
                  <div key={idx} className="flex-shrink-0 w-64 md:w-72 lg:w-80 snap-center bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 shadow-xl">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-10 md:w-11 lg:w-12 h-10 md:h-11 lg:h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-xl md:text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm mb-3 md:mb-4">&quot;{testimonial.content}&quot;</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                      {testimonial.course}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Partners Section */}
      {sections.partners?.isActive !== false && (
        <section className="py-12 bg-gray-50 dark:bg-slate-900 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {sections.partners?.title || 'Trusted By'} <span className="text-blue-600">{sections.partners?.highlightText || 'Leading Organizations'}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {sections.partners?.subtitle || 'Our partners and collaborators in education'}
              </p>
            </div>

            {/* Auto-scrolling partners logos */}
            <div className="relative">
              <div className="flex animate-slide-left">
                {[...(sections.partners?.partners || [
                  { name: 'Google', logo: '🔵' },
                  { name: 'Microsoft', logo: '🟦' },
                  { name: 'Amazon', logo: '🟠' },
                  { name: 'Meta', logo: '🔷' },
                  { name: 'OpenAI', logo: '⚪' },
                  { name: 'NVIDIA', logo: '🟩' },
                  { name: 'IBM', logo: '🔹' },
                  { name: 'Intel', logo: '🔷' },
                ]), ...(sections.partners?.partners || [
                  { name: 'Google', logo: '🔵' },
                  { name: 'Microsoft', logo: '🟦' },
                  { name: 'Amazon', logo: '🟠' },
                  { name: 'Meta', logo: '🔷' },
                  { name: 'OpenAI', logo: '⚪' },
                  { name: 'NVIDIA', logo: '🟩' },
                  { name: 'IBM', logo: '🔹' },
                  { name: 'Intel', logo: '🔷' },
                ])].map((partner, idx) => (
                  <div key={idx} className="flex-shrink-0 mx-4 md:mx-6 lg:mx-8 flex items-center justify-center">
                    <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 lg:px-6 py-3 md:py-4 bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                      <span className="text-2xl md:text-3xl">{partner.logo}</span>
                      <span className="font-semibold text-sm md:text-base text-gray-700 dark:text-gray-300">{partner.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
