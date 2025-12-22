'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  adClient?: string;
  style?: React.CSSProperties;
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
  style = { display: 'block' }
}: AdSenseProps) {
  const pathname = usePathname();

  // Don't show ads on home page
  if (pathname === '/') {
    return null;
  }

  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Don't render if AdSense is disabled
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'true' || !adClient) {
    return null;
  }

  return (
    <div className="adsense-container my-4">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      ></ins>
    </div>
  );
}

// Pre-configured ad components for different positions
export function AdSenseHeader({ adSlot = '1234567890' }: { adSlot?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="horizontal"
      style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
    />
  );
}

export function AdSenseSidebar({ adSlot = '0987654321' }: { adSlot?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="vertical"
      style={{ display: 'block', minHeight: '250px' }}
    />
  );
}

export function AdSenseInArticle({ adSlot = '1122334455' }: { adSlot?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="fluid"
      style={{ display: 'block', textAlign: 'center', minHeight: '200px' }}
    />
  );
}

export function AdSenseFooter({ adSlot = '5544332211' }: { adSlot?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="horizontal"
      style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
    />
  );
}
