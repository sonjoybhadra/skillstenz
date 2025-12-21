'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  category: string;
  topicsCount?: number;
}

const categories = [
  { id: 'web', name: 'Web Development', icon: '🌐' },
  { id: 'programming', name: 'Programming', icon: '💻' },
  { id: 'database', name: 'Database', icon: '🗄️' },
  { id: 'devops', name: 'DevOps', icon: '⚙️' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
  { id: 'ai', name: 'AI & ML', icon: '🤖' }
];

const defaultTechnologies: Technology[] = [
  { _id: '1', name: 'HTML', slug: 'html', icon: '📄', description: 'The standard markup language for web pages', color: '#e34c26', category: 'web' },
  { _id: '2', name: 'CSS', slug: 'css', icon: '🎨', description: 'Style your web pages beautifully', color: '#264de4', category: 'web' },
  { _id: '3', name: 'JavaScript', slug: 'javascript', icon: '🟨', description: 'Make your websites interactive', color: '#f7df1e', category: 'web' },
  { _id: '4', name: 'Python', slug: 'python', icon: '🐍', description: 'Simple and powerful programming', color: '#3776ab', category: 'programming' },
  { _id: '5', name: 'React', slug: 'react', icon: '⚛️', description: 'Build user interfaces with components', color: '#61dafb', category: 'web' },
  { _id: '6', name: 'Node.js', slug: 'nodejs', icon: '🟢', description: 'JavaScript runtime for servers', color: '#339933', category: 'web' },
  { _id: '7', name: 'SQL', slug: 'sql', icon: '🗃️', description: 'Query and manage databases', color: '#f29111', category: 'database' },
  { _id: '8', name: 'TypeScript', slug: 'typescript', icon: '📘', description: 'JavaScript with types', color: '#3178c6', category: 'programming' },
  { _id: '9', name: 'Java', slug: 'java', icon: '☕', description: 'Write once, run anywhere', color: '#007396', category: 'programming' },
  { _id: '10', name: 'Git', slug: 'git', icon: '📌', description: 'Version control your code', color: '#f05032', category: 'devops' },
  { _id: '11', name: 'Docker', slug: 'docker', icon: '🐳', description: 'Containerize your applications', color: '#2496ed', category: 'devops' },
  { _id: '12', name: 'MongoDB', slug: 'mongodb', icon: '🍃', description: 'NoSQL document database', color: '#47a248', category: 'database' },
];

export default function TutorialsPage() {
  const [technologies, setTechnologies] = useState<Technology[]>(defaultTechnologies);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const response = await fetch(`${API_URL}/technologies?limit=50`);
      if (response.ok) {
        const data = await response.json();
        if (data.technologies?.length) {
          setTechnologies(data.technologies);
        }
      }
    } catch (error) {
      console.error('Failed to fetch technologies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tech.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedByCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = filteredTechnologies.filter(t => t.category === cat.id);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[var(--bg-accent)] to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn to Code</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Free tutorials with hands-on examples. Start learning today with our comprehensive guides.
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold">{technologies.length}+</div>
                <div className="text-white/70">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-white/70">Tutorials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Free</div>
                <div className="text-white/70">Forever</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] sticky top-[64px] z-10">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-4 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? 'bg-[var(--bg-accent)] text-white'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)]'
                }`}
              >
                All Tutorials
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--bg-accent)] text-white'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tutorials Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border-primary)] border-t-[var(--bg-accent)]"></div>
              </div>
            ) : selectedCategory ? (
              // Single category view
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTechnologies.map(tech => (
                  <TutorialCard key={tech._id} technology={tech} />
                ))}
              </div>
            ) : (
              // All categories view
              Object.entries(groupedByCategory).map(([catId, techs]) => {
                if (techs.length === 0) return null;
                const category = categories.find(c => c.id === catId);
                return (
                  <div key={catId} className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <span className="text-3xl">{category?.icon}</span>
                        {category?.name}
                      </h2>
                      <Link
                        href={`/tutorials?category=${catId}`}
                        className="text-[var(--text-accent)] hover:underline flex items-center gap-1"
                      >
                        View all
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {techs.slice(0, 4).map(tech => (
                        <TutorialCard key={tech._id} technology={tech} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}

            {filteredTechnologies.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No tutorials found</h3>
                <p className="text-[var(--text-secondary)]">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </section>

        {/* Why Learn Section */}
        <section className="py-16 bg-[var(--bg-secondary)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-12">
              Why Learn With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '📖', title: 'Easy to Learn', desc: 'Step-by-step tutorials designed for beginners' },
                { icon: '💻', title: 'Practice Online', desc: 'Try it yourself with our online code editor' },
                { icon: '🎓', title: 'Get Certified', desc: 'Earn certificates to showcase your skills' }
              ].map((item, i) => (
                <div key={i} className="bg-[var(--bg-card)] rounded-xl p-8 text-center border border-[var(--border-primary)]">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function TutorialCard({ technology }: { technology: Technology }) {
  return (
    <Link
      href={`/tutorials/${technology.slug}`}
      className="group bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden hover:shadow-lg hover:border-[var(--bg-accent)] transition-all"
    >
      <div 
        className="h-32 flex items-center justify-center text-6xl"
        style={{ backgroundColor: technology.color + '20' }}
      >
        {technology.icon}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
          {technology.name}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
          {technology.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[var(--text-muted)]">
            {technology.topicsCount || '10+'} Topics
          </span>
          <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-600 rounded">
            FREE
          </span>
        </div>
      </div>
    </Link>
  );
}
