'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';

export default function CertificationsPage() {
  const certifications = [
    {
      id: 'web-dev-fundamentals',
      title: 'Web Development Fundamentals',
      description: 'Master HTML, CSS, and JavaScript basics',
      duration: '40 hours',
      modules: 12,
      level: 'Beginner',
      price: 'Free',
    },
    {
      id: 'react-developer',
      title: 'React Developer Certification',
      description: 'Build modern web applications with React',
      duration: '60 hours',
      modules: 20,
      level: 'Intermediate',
      price: '$49',
    },
    {
      id: 'python-programmer',
      title: 'Python Programmer',
      description: 'Complete Python programming certification',
      duration: '50 hours',
      modules: 15,
      level: 'Beginner',
      price: '$39',
    },
    {
      id: 'data-science',
      title: 'Data Science Professional',
      description: 'Machine learning and data analysis',
      duration: '80 hours',
      modules: 25,
      level: 'Advanced',
      price: '$99',
    },
    {
      id: 'full-stack',
      title: 'Full Stack Developer',
      description: 'Frontend to backend development',
      duration: '120 hours',
      modules: 40,
      level: 'Advanced',
      price: '$149',
    },
    {
      id: 'cloud-engineer',
      title: 'Cloud Engineering',
      description: 'AWS, Azure, and GCP fundamentals',
      duration: '70 hours',
      modules: 22,
      level: 'Intermediate',
      price: '$79',
    },
  ];

  return (
    <Layout showSidebar>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Professional Certifications</h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Earn industry-recognized certifications to boost your career. Our certifications are verified and shareable.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {certifications.map((cert) => (
            <div key={cert.id} className="card hover:border-[var(--primary)] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  cert.level === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  cert.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {cert.level}
                </span>
                <span className="font-bold text-[var(--primary)]">{cert.price}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                {cert.title}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">{cert.description}</p>
              
              <div className="flex gap-4 text-sm text-[var(--muted-foreground)] mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cert.duration}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {cert.modules} modules
                </span>
              </div>
              
              <Link href={`/certifications/${cert.id}`} className="btn-primary w-full text-center">
                Start Certification
              </Link>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="card bg-[var(--muted)]">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">Why Get Certified?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Verified Skills', desc: 'Prove your expertise' },
              { icon: '💼', title: 'Career Boost', desc: 'Stand out to employers' },
              { icon: '🔗', title: 'Shareable', desc: 'Add to LinkedIn' },
              { icon: '📈', title: 'Track Progress', desc: 'Monitor your growth' },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl mb-2">{benefit.icon}</div>
                <h3 className="font-semibold text-[var(--foreground)]">{benefit.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
