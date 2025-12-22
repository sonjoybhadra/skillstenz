'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Head from 'next/head';

interface SeoData {
  googleAnalyticsId: string;
  adsensePublisherId: string;
  adsEnabled: boolean;
  autoAds: boolean;
  googleVerification: string;
  bingVerification: string;
}

interface DynamicSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DynamicSEO({ title, description, keywords, ogImage, ogType, canonicalUrl }: DynamicSEOProps = {}) {
  const [seoData, setSeoData] = useState<SeoData | null>(null);

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const response = await fetch(`${API_URL}/settings/public/seo`);
        if (response.ok) {
          const data = await response.json();
          setSeoData(data);
        }
      } catch (error) {
        console.error('Failed to fetch SEO data:', error);
      }
    };

    fetchSeoData();
  }, []);

  if (!seoData) return null;

  return (
    <>
      {/* Google Analytics */}
      {seoData.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${seoData.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seoData.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Google AdSense */}
      {seoData.adsEnabled && seoData.adsensePublisherId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${seoData.adsensePublisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}

// AdSense Ad Component
interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
}

export function AdUnit({ slot, format = 'auto', style }: AdUnitProps) {
  const [adsenseId, setAdsenseId] = useState('');
  const [adsEnabled, setAdsEnabled] = useState(false);

  useEffect(() => {
    const fetchAdsenseData = async () => {
      try {
        const response = await fetch(`${API_URL}/settings/public/seo`);
        if (response.ok) {
          const data = await response.json();
          setAdsenseId(data.adsensePublisherId || '');
          setAdsEnabled(data.adsEnabled || false);
        }
      } catch (error) {
        console.error('Failed to fetch AdSense data:', error);
      }
    };

    fetchAdsenseData();
  }, []);

  useEffect(() => {
    if (adsEnabled && adsenseId) {
      try {
        // @ts-expect-error - AdSense global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense push error:', error);
      }
    }
  }, [adsEnabled, adsenseId]);

  if (!adsEnabled || !adsenseId) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client={adsenseId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
