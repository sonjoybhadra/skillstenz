'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const roadmapsData: Record<string, { title: string; description: string; duration: string; steps: { title: string; topics: string[]; duration: string }[] }> = {
  'jquery': {
    title: 'jQuery Learning Roadmap',
    description: 'Master jQuery from basics to advanced DOM manipulation',
    duration: '4 weeks',
    steps: [
      { title: 'jQuery Basics', topics: ['Selectors', 'Events', 'Effects', 'DOM Manipulation'], duration: '1 week' },
      { title: 'Advanced jQuery', topics: ['AJAX', 'Plugins', 'Animations', 'Utilities'], duration: '1 week' },
      { title: 'jQuery UI', topics: ['Widgets', 'Interactions', 'Effects', 'Themes'], duration: '1 week' },
      { title: 'Projects', topics: ['Image Slider', 'Form Validation', 'To-Do App', 'Quiz App'], duration: '1 week' },
    ]
  },
  'react': {
    title: 'React Learning Roadmap',
    description: 'Complete path to becoming a React developer',
    duration: '12 weeks',
    steps: [
      { title: 'JavaScript Fundamentals', topics: ['ES6+', 'Async/Await', 'Modules', 'DOM'], duration: '2 weeks' },
      { title: 'React Basics', topics: ['JSX', 'Components', 'Props', 'State', 'Events'], duration: '2 weeks' },
      { title: 'React Hooks', topics: ['useState', 'useEffect', 'useContext', 'useReducer', 'Custom Hooks'], duration: '2 weeks' },
      { title: 'State Management', topics: ['Context API', 'Redux', 'Zustand', 'React Query'], duration: '2 weeks' },
      { title: 'Routing & Forms', topics: ['React Router', 'Form Libraries', 'Validation'], duration: '2 weeks' },
      { title: 'Advanced & Testing', topics: ['Performance', 'Testing', 'SSR/SSG', 'Deployment'], duration: '2 weeks' },
    ]
  },
  'tailwind': {
    title: 'Tailwind CSS Roadmap',
    description: 'Master utility-first CSS framework',
    duration: '4 weeks',
    steps: [
      { title: 'Basics', topics: ['Utility Classes', 'Responsive Design', 'Flexbox', 'Grid'], duration: '1 week' },
      { title: 'Styling', topics: ['Colors', 'Typography', 'Spacing', 'Borders', 'Shadows'], duration: '1 week' },
      { title: 'Advanced', topics: ['Custom Config', 'Plugins', 'Dark Mode', 'Animations'], duration: '1 week' },
      { title: 'Projects', topics: ['Landing Page', 'Dashboard', 'E-commerce UI', 'Portfolio'], duration: '1 week' },
    ]
  },
  'javascript': {
    title: 'JavaScript Roadmap',
    description: 'Complete JavaScript developer journey',
    duration: '16 weeks',
    steps: [
      { title: 'Fundamentals', topics: ['Variables', 'Data Types', 'Operators', 'Control Flow'], duration: '2 weeks' },
      { title: 'Functions & Scope', topics: ['Functions', 'Closures', 'Hoisting', 'Scope Chain'], duration: '2 weeks' },
      { title: 'Objects & Arrays', topics: ['Objects', 'Arrays', 'Destructuring', 'Spread/Rest'], duration: '2 weeks' },
      { title: 'DOM Manipulation', topics: ['Selectors', 'Events', 'DOM Methods', 'Forms'], duration: '2 weeks' },
      { title: 'Async JavaScript', topics: ['Callbacks', 'Promises', 'Async/Await', 'Fetch API'], duration: '2 weeks' },
      { title: 'ES6+ Features', topics: ['Classes', 'Modules', 'Iterators', 'Generators'], duration: '2 weeks' },
      { title: 'Advanced Topics', topics: ['Design Patterns', 'Memory Management', 'Web APIs'], duration: '2 weeks' },
      { title: 'Projects', topics: ['Todo App', 'Weather App', 'Chat App', 'E-commerce'], duration: '2 weeks' },
    ]
  },
  'css': {
    title: 'CSS Roadmap',
    description: 'Master CSS from basics to advanced',
    duration: '8 weeks',
    steps: [
      { title: 'Basics', topics: ['Selectors', 'Box Model', 'Colors', 'Typography'], duration: '1 week' },
      { title: 'Layout', topics: ['Display', 'Position', 'Float', 'Flexbox', 'Grid'], duration: '2 weeks' },
      { title: 'Responsive Design', topics: ['Media Queries', 'Mobile First', 'Viewport', 'Units'], duration: '1 week' },
      { title: 'Advanced CSS', topics: ['Animations', 'Transforms', 'Transitions', 'Variables'], duration: '2 weeks' },
      { title: 'CSS Architecture', topics: ['BEM', 'SMACSS', 'CSS Modules', 'Preprocessors'], duration: '1 week' },
      { title: 'Projects', topics: ['Portfolio', 'Landing Page', 'Dashboard', 'Clone Project'], duration: '1 week' },
    ]
  },
  'html': {
    title: 'HTML Roadmap',
    description: 'Learn HTML5 and web fundamentals',
    duration: '4 weeks',
    steps: [
      { title: 'Basics', topics: ['Document Structure', 'Elements', 'Attributes', 'Text Formatting'], duration: '1 week' },
      { title: 'Forms & Tables', topics: ['Input Types', 'Form Validation', 'Tables', 'Accessibility'], duration: '1 week' },
      { title: 'Multimedia', topics: ['Images', 'Audio', 'Video', 'Canvas', 'SVG'], duration: '1 week' },
      { title: 'Semantic HTML', topics: ['Semantic Elements', 'SEO', 'Microdata', 'Best Practices'], duration: '1 week' },
    ]
  },
  'typescript': {
    title: 'TypeScript Roadmap',
    description: 'Master TypeScript for scalable applications',
    duration: '8 weeks',
    steps: [
      { title: 'Basics', topics: ['Types', 'Interfaces', 'Type Inference', 'Type Assertions'], duration: '2 weeks' },
      { title: 'Advanced Types', topics: ['Generics', 'Union Types', 'Intersection Types', 'Utility Types'], duration: '2 weeks' },
      { title: 'OOP in TS', topics: ['Classes', 'Inheritance', 'Modifiers', 'Abstract Classes'], duration: '1 week' },
      { title: 'Modules', topics: ['Namespaces', 'Modules', 'Declaration Files', 'Type Definitions'], duration: '1 week' },
      { title: 'React + TS', topics: ['React with TypeScript', 'Props Typing', 'Hooks Typing', 'Context'], duration: '1 week' },
      { title: 'Projects', topics: ['API Client', 'Full-Stack App', 'Library', 'CLI Tool'], duration: '1 week' },
    ]
  },
  'php': {
    title: 'PHP Roadmap',
    description: 'Backend development with PHP',
    duration: '12 weeks',
    steps: [
      { title: 'Basics', topics: ['Syntax', 'Variables', 'Operators', 'Control Structures'], duration: '2 weeks' },
      { title: 'Functions & Arrays', topics: ['Functions', 'Arrays', 'Strings', 'File Handling'], duration: '2 weeks' },
      { title: 'OOP', topics: ['Classes', 'Inheritance', 'Interfaces', 'Traits', 'Namespaces'], duration: '2 weeks' },
      { title: 'Database', topics: ['MySQL', 'PDO', 'CRUD Operations', 'Security'], duration: '2 weeks' },
      { title: 'Frameworks', topics: ['Laravel', 'Routing', 'MVC', 'Eloquent ORM'], duration: '2 weeks' },
      { title: 'Projects', topics: ['Blog', 'E-commerce', 'API', 'CMS'], duration: '2 weeks' },
    ]
  },
};

export default function RoadmapPage() {
  const params = useParams();
  const slug = params.slug as string;
  const roadmap = roadmapsData[slug];

  if (!roadmap) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Roadmap Not Found</h1>
            <p className="text-[var(--muted-foreground)] mb-6">The roadmap you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/roadmaps" className="btn-primary">
              Browse All Roadmaps
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Home</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <Link href="/roadmaps" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Roadmaps</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <span className="text-[var(--foreground)]">{roadmap.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[var(--primary)] text-white text-sm rounded-full">{roadmap.duration}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">{roadmap.title}</h1>
          <p className="text-lg text-[var(--muted-foreground)]">{roadmap.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Learning
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* Roadmap Steps */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border)]" />

          <div className="space-y-8">
            {roadmap.steps.map((step, index) => (
              <div key={index} className="relative pl-16">
                {/* Step number */}
                <div className="absolute left-0 w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>

                <div className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-[var(--foreground)]">{step.title}</h2>
                    <span className="text-sm text-[var(--muted-foreground)]">{step.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {step.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="px-3 py-1 bg-[var(--muted)] text-[var(--foreground)] text-sm rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Roadmaps */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Related Roadmaps</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(roadmapsData)
              .filter(([key]) => key !== slug)
              .slice(0, 4)
              .map(([key, rm]) => (
                <Link key={key} href={`/roadmaps/${key}`} className="card hover:border-[var(--primary)] transition-colors">
                  <h3 className="font-medium text-[var(--foreground)]">{rm.title.replace(' Roadmap', '').replace(' Learning', '')}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{rm.duration}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
