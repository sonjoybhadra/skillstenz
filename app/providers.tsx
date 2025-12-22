'use client';

import { AuthProvider } from '../lib/auth';
import { SettingsProvider } from '../lib/settings';
import DynamicSEO from '../components/DynamicSEO';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const GlobalLoader = dynamic(() => import('../components/GlobalLoader'), { ssr: false });

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Suspense fallback={null}>
          <GlobalLoader />
        </Suspense>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
            }}
        />
        <DynamicSEO />
        {children}
      </AuthProvider>
    </SettingsProvider>
  );
}
