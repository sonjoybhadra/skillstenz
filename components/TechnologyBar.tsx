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

// Default technologies if API fails
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

  // Check if tech bar should be visible from settings
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
    <div className="technology-bar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap'
        }}>
          {barTitle}:
        </span>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          flex: 1,
          overflow: 'hidden',
          flexWrap: 'wrap'
        }}>
          {displayedTechs.map((tech) => (
            <Link
              key={tech._id}
              href={`/${tech.slug}`}
              className="tech-bar-item"
              title={tech.name}
            >
              <span style={{ fontSize: '14px' }}>{tech.icon}</span>
              <span>{tech.name}</span>
            </Link>
          ))}
          
          {technologies.length > 12 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="tech-bar-toggle"
            >
              {showAll ? '◀ Less' : `+${technologies.length - 12} More`}
            </button>
          )}
        </div>

        <Link href="/technologies" className="tech-bar-view-all">
          View All →
        </Link>
      </div>

      <style jsx>{`
        .technology-bar {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-primary);
          padding: 8px 0;
          position: sticky;
          top: var(--navbar-height);
          z-index: var(--z-sticky);
        }
        
        .tech-bar-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: 20px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        
        .tech-bar-item:hover {
          background: var(--bg-accent);
          color: white;
          border-color: var(--bg-accent);
          transform: translateY(-1px);
        }
        
        .tech-bar-toggle {
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-accent);
          background: transparent;
          border: 1px dashed var(--border-accent);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .tech-bar-toggle:hover {
          background: var(--bg-accent);
          color: white;
          border-style: solid;
        }
        
        .tech-bar-view-all {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-accent);
          white-space: nowrap;
        }
        
        .tech-bar-view-all:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .technology-bar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
