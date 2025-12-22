'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

      const response = await fetch(`${API_URL}/certificates/my`, {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and download your earned certificates
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-center py-16 px-6">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              No Certificates Yet
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Complete courses and pass assessments to earn certificates!
            </p>
            <Link 
              href="/technologies" 
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div 
                  className="h-40 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
                >
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🎓</div>
                    <div className="text-sm font-medium">Certificate of Completion</div>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
                    {cert.title || cert.courseName}
                  </h3>
                  <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">
                    {cert.technologyName}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm mb-4 text-gray-500 dark:text-gray-500">
                    <span>Issued: {formatDate(cert.issuedAt)}</span>
                    <span>ID: {cert.certificateId}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                      onClick={() => window.open(`/certificates/${cert.certificateId}`, '_blank')}
                    >
                      View
                    </button>
                    <button 
                      className="flex-1 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/verify/${cert.certificateId}`);
                        alert('Certificate link copied!');
                      }}
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
