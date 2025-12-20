'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface CertificateViewerProps {
  certificateId: string;
  showDownload?: boolean;
}

export default function CertificateViewer({ certificateId, showDownload = true }: CertificateViewerProps) {
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]);

  const fetchCertificate = async () => {
    try {
      const response = await fetch(`${API_URL}/certificates/verify/${certificateId}`);
      if (response.ok) {
        const data = await response.json();
        setVerified(data.valid);
        if (data.certificate) {
          setCertificate(data.certificate);
        }
      }
    } catch (error) {
      console.error('Failed to fetch certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareOnLinkedIn = () => {
    const url = `${window.location.origin}/verify-certificate/${certificateId}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');

    // Track share
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetch(`${API_URL}/certificates/${certificateId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ platform: 'linkedin' })
      });
    }
  };

  const downloadCertificate = () => {
    // This would trigger a PDF generation on the backend
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!verified || !certificate) {
    return (
      <div className="card text-center p-12">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Certificate Not Found or Invalid
        </h3>
        <p className="text-[var(--text-muted)]">
          This certificate ID does not exist or has been revoked.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Certificate Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 border-4 border-violet-200 dark:border-violet-800">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full mb-6">
              <span className="text-5xl">🏆</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Certificate of Achievement
            </h1>
            <p className="text-[var(--text-muted)] text-lg">This certifies that</p>
          </div>

          {/* Recipient */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4">
              {certificate.user?.name}
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              has successfully completed <span className="font-semibold text-violet-600">{certificate.title}</span>
            </p>
            {certificate.description && (
              <p className="text-[var(--text-muted)] mt-2">{certificate.description}</p>
            )}
          </div>

          {/* Score & Grade */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {certificate.score}%
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Score</div>
            </div>
            <div className="w-px h-16 bg-[var(--border-primary)]"></div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {certificate.grade}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Grade</div>
            </div>
            {certificate.totalQuestions && (
              <>
                <div className="w-px h-16 bg-[var(--border-primary)]"></div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[var(--text-primary)]">
                    {certificate.correctAnswers}/{certificate.totalQuestions}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] mt-1">Questions</div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-8 border-t-2 border-violet-200 dark:border-violet-800">
            <div>
              <div className="text-sm text-[var(--text-muted)]">Issue Date</div>
              <div className="font-semibold text-[var(--text-primary)]">
                {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 h-px bg-[var(--text-primary)] mb-2"></div>
              <div className="font-semibold text-[var(--text-primary)]">
                {certificate.issuedBy?.name || 'TechTooTalk'}
              </div>
              <div className="text-sm text-[var(--text-muted)]">Platform</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--text-muted)]">Certificate ID</div>
              <div className="font-mono text-sm text-[var(--text-primary)]">{certificate.certificateId}</div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center justify-center mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
              <span className="text-lg">✓</span>
              <span className="font-medium">Verified Certificate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showDownload && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={shareOnLinkedIn}
            className="px-6 py-3 bg-[#0077B5] text-white rounded-lg font-medium hover:bg-[#006399] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            Share on LinkedIn
          </button>
          <button
            onClick={downloadCertificate}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center gap-2"
          >
            <span>📥</span>
            Download PDF
          </button>
          <Link
            href={`/verify-certificate/${certificateId}`}
            target="_blank"
            className="px-6 py-3 border-2 border-violet-600 text-violet-600 rounded-lg font-medium hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors flex items-center gap-2"
          >
            <span>🔗</span>
            Public Link
          </Link>
        </div>
      )}

      {/* Verification Link */}
      <div className="text-center text-sm text-[var(--text-muted)]">
        Verify this certificate at:{' '}
        <code className="px-2 py-1 bg-[var(--bg-secondary)] rounded">
          {window.location.origin}/verify-certificate/{certificateId}
        </code>
      </div>
    </div>
  );
}
