'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface JobPosition {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  jobType: string;
  description: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  isFeatured: boolean;
  createdAt: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchBenefits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/careers');
      const data = await response.json();
      if (response.ok) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      // Fallback to static data if API fails
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBenefits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/careers/benefits');
      const data = await response.json();
      if (response.ok && data.benefits) {
        setBenefits(data.benefits);
      } else {
        // Fallback to default benefits
        setBenefits(defaultBenefits);
      }
    } catch {
      // Fallback to default benefits
      setBenefits(defaultBenefits);
    }
  };

  const defaultBenefits: Benefit[] = [
    { icon: '🏠', title: 'Remote Work', description: 'Work from anywhere in the world' },
    { icon: '📚', title: 'Learning Budget', description: '$2,000/year for courses and conferences' },
    { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive health coverage' },
    { icon: '🎯', title: 'Equity', description: 'Stock options for all employees' },
    { icon: '🌴', title: 'Unlimited PTO', description: 'Take time off when you need it' },
    { icon: '💻', title: 'Equipment', description: 'Top-of-the-line setup' },
  ];

  const departments = ['all', ...new Set(jobs.map(job => job.department))];
  
  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment);

  const formatJobType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatSalary = (salary?: { min?: number; max?: number; currency?: string }) => {
    if (!salary || (!salary.min && !salary.max)) return null;
    const currency = salary.currency || 'USD';
    if (salary.min && salary.max) {
      return `${currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
    }
    if (salary.min) return `${currency} ${salary.min.toLocaleString()}+`;
    if (salary.max) return `Up to ${currency} ${salary.max.toLocaleString()}`;
    return null;
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">Join Our Team</h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            Help us shape the future of tech education. We&apos;re looking for passionate individuals to join our mission.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">Why Join Us?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {(benefits.length > 0 ? benefits : defaultBenefits).map((benefit, index) => (
              <div key={index} className="card text-center">
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">{benefit.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Open Positions</h2>
            
            {/* Department Filter */}
            {departments.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedDepartment === dept
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                    }`}
                  >
                    {dept === 'all' ? 'All Departments' : dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">No positions available</h3>
              <p className="text-[var(--muted-foreground)]">
                Check back later or subscribe to get notified about new openings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job._id} className={`card flex flex-col md:flex-row md:items-center justify-between gap-4 ${job.isFeatured ? 'border-[var(--color-primary)] border-2' : ''}`}>
                  <div>
                    {job.isFeatured && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded mb-2">
                        Featured
                      </span>
                    )}
                    <h3 className="font-semibold text-[var(--foreground)]">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-[var(--muted-foreground)] mt-1">
                      <span>{job.department}</span>
                      <span className="hidden md:inline">•</span>
                      <span>{job.location}</span>
                      <span className="hidden md:inline">•</span>
                      <span>{formatJobType(job.jobType)}</span>
                      {formatSalary(job.salary) && (
                        <>
                          <span className="hidden md:inline">•</span>
                          <span className="text-green-600 dark:text-green-400">{formatSalary(job.salary)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link href={`/careers/${job.slug}`} className="btn-primary whitespace-nowrap">
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center card bg-[var(--muted)]">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Don&apos;t see a perfect fit?</h2>
          <p className="text-[var(--muted-foreground)] mb-6">We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll keep you in mind.</p>
          <Link href="/contact" className="btn-primary">
            Get in Touch
          </Link>
        </div>
      </div>
    </Layout>
  );
}
