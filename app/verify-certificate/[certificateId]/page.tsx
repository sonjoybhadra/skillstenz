'use client';

import { use } from 'react';
import Layout from '@/components/Layout';
import CertificateViewer from '@/components/CertificateViewer';

export default function VerifyCertificatePage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = use(params);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Certificate Verification</h1>
          <p className="text-[var(--text-muted)]">Verify the authenticity of this certificate</p>
        </div>

        <CertificateViewer certificateId={certificateId} showDownload={false} />
      </div>
    </Layout>
  );
}
