'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const defaultBenefits: Benefit[] = [
    { icon: '🏠', title: 'Remote Work', description: 'Work from anywhere in the world' },
    { icon: '📚', title: 'Learning Budget', description: '$2,000/year for courses and conferences' },
    { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive health coverage' },
    { icon: '🎯', title: 'Equity', description: 'Stock options for all employees' },
    { icon: '🌴', title: 'Unlimited PTO', description: 'Take time off when you need it' },
    { icon: '💻', title: 'Equipment', description: 'Top-of-the-line setup' },
  ];

  useEffect(() => {
    fetchJobs();
    fetchBenefits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/careers`);
      const data = await response.json();
      if (response.ok) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBenefits = async () => {
    try {
      const response = await fetch(`${API_URL}/careers/benefits`);
      const data = await response.json();
      if (response.ok && data.benefits) {
        setBenefits(data.benefits);
      } else {
        setBenefits(defaultBenefits);
      }
    } catch {
      setBenefits(defaultBenefits);
    }
  };

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
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Join Our Team</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Help us shape the future of tech education. We&apos;re looking for passionate individuals to join our mission.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Why Join Us?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(benefits.length > 0 ? benefits : defaultBenefits).map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 text-center"
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{benefit.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Open Positions</h2>
            
            {/* Department Filter */}
            {departments.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedDepartment === dept
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
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
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-12 px-6 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No positions available</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Check back later or subscribe to get notified about new openings.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div 
                  key={job._id} 
                  className={`bg-white dark:bg-slate-800 border rounded-xl p-5 flex flex-col gap-3 ${
                    job.isFeatured 
                      ? 'border-2 border-blue-500' 
                      : 'border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <div>
                    {job.isFeatured && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded mb-2">
                        Featured
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{formatJobType(job.jobType)}</span>
                      {formatSalary(job.salary) && (
                        <>
                          <span>•</span>
                          <span className="text-green-500">{formatSalary(job.salary)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={`/careers/${job.slug}`} 
                    className="inline-block self-start px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm rounded-lg transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Don&apos;t see a perfect fit?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm">
            We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll keep you in mind.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </Layout>
  );
}
