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
      price: '₹3,999',
    },
    {
      id: 'python-programmer',
      title: 'Python Programmer',
      description: 'Complete Python programming certification',
      duration: '50 hours',
      modules: 15,
      level: 'Beginner',
      price: '₹2,999',
    },
    {
      id: 'data-science',
      title: 'Data Science Professional',
      description: 'Machine learning and data analysis',
      duration: '80 hours',
      modules: 25,
      level: 'Advanced',
      price: '₹7,999',
    },
    {
      id: 'full-stack',
      title: 'Full Stack Developer',
      description: 'Frontend to backend development',
      duration: '120 hours',
      modules: 40,
      level: 'Advanced',
      price: '₹11,999',
    },
    {
      id: 'cloud-engineer',
      title: 'Cloud Engineering',
      description: 'AWS, Azure, and GCP fundamentals',
      duration: '70 hours',
      modules: 22,
      level: 'Intermediate',
      price: '₹5,999',
    },
  ];

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Professional Certifications</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Earn industry-recognized certifications to boost your career. Our certifications are verified and shareable.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {certifications.map((cert) => (
            <div 
              key={cert.id} 
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelStyle(cert.level)}`}>
                  {cert.level}
                </span>
                <span className="font-bold text-blue-500">{cert.price}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                {cert.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{cert.description}</p>
              
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cert.duration}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  {cert.modules} modules
                </span>
              </div>
              
              <Link 
                href={`/certifications/${cert.id}`}
                className="block w-full py-2.5 text-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded-lg transition-colors"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Why Get Certified?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Industry Recognition</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Validate your skills with industry-recognized certificates</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Career Growth</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stand out to employers and advance your career</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shareable Badge</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add to LinkedIn and share with potential employers</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Not sure which certification is right for you?
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Talk to Our Counselor
          </Link>
        </div>
      </div>
    </Layout>
  );
}
