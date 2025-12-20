'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSettings } from '../lib/settings';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { settings } = useSettings();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  const loaderColor = settings.loaderColor || '#0968c6';

  return (
    <div className="global-loader">
      <div className="loader-content">
        {/* Dynamic Logo */}
        <div className="loader-logo">
          {settings.logo ? (
            <img src={settings.logo} alt={settings.siteName} className="loader-logo-img" />
          ) : (
            <div className="loader-logo-icon">{settings.logoIcon || 'T'}</div>
          )}
        </div>
        
        {/* Brand Name */}
        <div className="loader-brand">
          <span className="loader-brand-main">
            {settings.logoText?.replace(settings.logoAccentText, '') || 'TechToo'}
          </span>
          <span className="loader-brand-accent" style={{ color: loaderColor }}>
            {settings.logoAccentText || 'Talk'}
          </span>
        </div>
        
        {/* Dynamic Loader */}
        <div className="loader-animation">
          {settings.loaderType === 'spinner' && (
            <div className="spinner" style={{ borderTopColor: loaderColor }}></div>
          )}
          {settings.loaderType === 'dots' && (
            <div className="dots">
              <span style={{ backgroundColor: loaderColor }}></span>
              <span style={{ backgroundColor: loaderColor }}></span>
              <span style={{ backgroundColor: loaderColor }}></span>
            </div>
          )}
          {settings.loaderType === 'pulse' && (
            <div className="pulse" style={{ backgroundColor: loaderColor }}></div>
          )}
          {settings.loaderType === 'bars' && (
            <div className="bars">
              {[0, 1, 2, 3, 4].map(i => (
                <span key={i} style={{ backgroundColor: loaderColor, animationDelay: `${i * 0.1}s` }}></span>
              ))}
            </div>
          )}
          {settings.loaderType === 'custom' && settings.loaderImage && (
            <img src={settings.loaderImage} alt="Loading" className="custom-loader" />
          )}
          {(!settings.loaderType || (settings.loaderType === 'custom' && !settings.loaderImage)) && (
            <div className="spinner" style={{ borderTopColor: loaderColor }}></div>
          )}
        </div>
        
        {/* Loading text */}
        {settings.loaderText && (
          <div className="loader-text">{settings.loaderText}</div>
        )}
      </div>
      
      <style jsx>{`
        .global-loader {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }
        
        :global(.dark) .global-loader,
        :global([data-theme="dark"]) .global-loader {
          background: rgba(17, 24, 39, 0.95);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .loader-logo {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .loader-logo-img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        
        .loader-logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, ${loaderColor} 0%, ${loaderColor}dd 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 28px;
          font-weight: 700;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .loader-brand {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .loader-brand-main {
          color: var(--text-primary, #1e293b);
        }
        
        :global(.dark) .loader-brand-main,
        :global([data-theme="dark"]) .loader-brand-main {
          color: #f8fafc;
        }
        
        .loader-brand-accent {
          color: ${loaderColor};
        }
        
        .loader-animation {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: ${loaderColor};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .dots {
          display: flex;
          gap: 8px;
        }
        
        .dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        
        .dots span:nth-child(1) { animation-delay: -0.32s; }
        .dots span:nth-child(2) { animation-delay: -0.16s; }
        .dots span:nth-child(3) { animation-delay: 0; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        .pulse {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          animation: pulseAnim 1s ease-in-out infinite;
        }
        
        @keyframes pulseAnim {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        
        .bars {
          display: flex;
          gap: 4px;
          align-items: flex-end;
          height: 36px;
        }
        
        .bars span {
          width: 6px;
          border-radius: 3px;
          animation: barBounce 1s ease-in-out infinite;
        }
        
        .bars span:nth-child(1) { height: 12px; }
        .bars span:nth-child(2) { height: 20px; }
        .bars span:nth-child(3) { height: 28px; }
        .bars span:nth-child(4) { height: 20px; }
        .bars span:nth-child(5) { height: 12px; }
        
        @keyframes barBounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }
        
        .custom-loader {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
        
        .loader-text {
          font-size: 14px;
          color: var(--text-secondary, #64748b);
        }
      `}</style>
    </div>
  );
}
