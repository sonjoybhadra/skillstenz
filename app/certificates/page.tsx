'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface Certificate {
  _id: string;
  title: string;
  courseName: string;
  technologyName: string;
  issuedAt: string;
  certificateId: string;
  publicUrl?: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCertificates = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login?redirect=/certificates');
        return;
      }

      const response = await fetch('http://localhost:5000/api/certificates/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      }
    } catch {
      console.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            My Certificates
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            View and download your earned certificates
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--bg-accent)' }}></div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              No Certificates Yet
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Complete courses and pass assessments to earn certificates!
            </p>
            <Link href="/technologies" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert._id} className="card">
                <div 
                  className="h-40 rounded-lg mb-4 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--bg-accent) 0%, #1d4ed8 100%)' }}
                >
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🎓</div>
                    <div className="text-sm font-medium">Certificate of Completion</div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  {cert.title || cert.courseName}
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {cert.technologyName}
                </p>
                
                <div className="flex items-center justify-between text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  <span>Issued: {formatDate(cert.issuedAt)}</span>
                  <span>ID: {cert.certificateId}</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="btn btn-primary flex-1"
                    onClick={() => window.open(`/certificates/${cert.certificateId}`, '_blank')}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-secondary flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/verify/${cert.certificateId}`);
                      alert('Certificate link copied!');
                    }}
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
