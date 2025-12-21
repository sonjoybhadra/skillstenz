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
      const response = await fetch(`${API_URL}/careers`);
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
      const response = await fetch(`${API_URL}/careers/benefits`);
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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>Join Our Team</h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Help us shape the future of tech education. We&apos;re looking for passionate individuals to join our mission.
          </p>
        </div>

        {/* Benefits */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' }}>Why Join Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {(benefits.length > 0 ? benefits : defaultBenefits).map((benefit, index) => (
              <div key={index} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{benefit.icon}</div>
                <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px', fontSize: '14px' }}>{benefit.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Open Positions</h2>
            
            {/* Department Filter */}
            {departments.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      border: 'none',
                      cursor: 'pointer',
                      background: selectedDepartment === dept ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                      color: selectedDepartment === dept ? 'white' : 'var(--text-secondary)'
                    }}
                  >
                    {dept === 'all' ? 'All Departments' : dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-primary)', borderTop: '3px solid var(--bg-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>No positions available</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Check back later or subscribe to get notified about new openings.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredJobs.map((job) => (
                <div key={job._id} style={{ background: 'var(--bg-secondary)', border: job.isFeatured ? '2px solid var(--bg-accent)' : '1px solid var(--border-primary)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    {job.isFeatured && (
                      <span style={{ display: 'inline-block', padding: '4px 8px', fontSize: '11px', fontWeight: '600', background: 'var(--bg-accent)', color: 'white', borderRadius: '4px', marginBottom: '8px' }}>
                        Featured
                      </span>
                    )}
                    <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '15px' }}>{job.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{formatJobType(job.jobType)}</span>
                      {formatSalary(job.salary) && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#22c55e' }}>{formatSalary(job.salary)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link href={`/careers/${job.slug}`} style={{ display: 'inline-block', padding: '10px 20px', background: 'var(--bg-accent)', color: 'white', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', fontSize: '13px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '48px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', padding: '32px 24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Don&apos;t see a perfect fit?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll keep you in mind.</p>
          <Link href="/contact" style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--bg-accent)', color: 'white', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
            Get in Touch
          </Link>
        </div>
      </div>
    </Layout>
  );
}
