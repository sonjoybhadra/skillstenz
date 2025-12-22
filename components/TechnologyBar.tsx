'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSettings } from '@/lib/settings';

interface Technology {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  category: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const defaultTechnologies: Technology[] = [
  { _id: '1', name: 'Python', slug: 'python', icon: '🐍', color: '#3776AB', category: 'programming' },
  { _id: '2', name: 'JavaScript', slug: 'javascript', icon: '🟨', color: '#F7DF1E', category: 'programming' },
  { _id: '3', name: 'React', slug: 'react', icon: '⚛️', color: '#61DAFB', category: 'web' },
  { _id: '4', name: 'Node.js', slug: 'nodejs', icon: '🟢', color: '#339933', category: 'web' },
  { _id: '5', name: 'TypeScript', slug: 'typescript', icon: '🔷', color: '#3178C6', category: 'programming' },
  { _id: '6', name: 'AI/ML', slug: 'artificial-intelligence', icon: '🤖', color: '#FF6F00', category: 'ai-ml' },
  { _id: '7', name: 'Next.js', slug: 'nextjs', icon: '▲', color: '#000000', category: 'web' },
  { _id: '8', name: 'MongoDB', slug: 'mongodb', icon: '🍃', color: '#47A248', category: 'database' },
  { _id: '9', name: 'SQL', slug: 'sql', icon: '🗃️', color: '#4479A1', category: 'database' },
  { _id: '10', name: 'Docker', slug: 'docker', icon: '🐳', color: '#2496ED', category: 'devops' },
  { _id: '11', name: 'AWS', slug: 'aws', icon: '☁️', color: '#FF9900', category: 'devops' },
  { _id: '12', name: 'Git', slug: 'git', icon: '📦', color: '#F05032', category: 'tools' },
];

export default function TechnologyBar() {
  const [technologies, setTechnologies] = useState<Technology[]>(defaultTechnologies);
  const [showAll, setShowAll] = useState(false);
  const { settings } = useSettings();

  const isVisible = settings.showTechBar !== false;
  const barTitle = settings.techBarTitle || 'Explore';

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch(`${API_URL}/technologies?limit=20&isPublished=true`);
        if (response.ok) {
          const data = await response.json();
          if (data.technologies && data.technologies.length > 0) {
            setTechnologies(data.technologies);
          }
        }
      } catch (error) {
        console.error('Failed to fetch technologies:', error);
      }
    };
    fetchTechnologies();
  }, []);

  const displayedTechs = showAll ? technologies : technologies.slice(0, 12);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 py-2 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
          {barTitle}:
        </span>
        
        <div className="flex items-center gap-1.5 flex-1 overflow-hidden flex-wrap">
          {displayedTechs.map((tech) => (
            <Link
              key={tech._id}
              href={`/${tech.slug}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 whitespace-nowrap"
              title={tech.name}
            >
              <span>{tech.icon}</span>
              <span>{tech.name}</span>
            </Link>
          ))}
          
          {technologies.length > 12 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="px-2.5 py-1 text-xs font-medium text-blue-500 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
            >
              {showAll ? '◀ Less' : `+${technologies.length - 12} More`}
            </button>
          )}
        </div>

        <Link 
          href="/technologies" 
          className="text-xs font-medium text-blue-500 hover:text-blue-600 whitespace-nowrap"
        >
          View All →
        </Link>
      </div>
    </div>
  );
}
