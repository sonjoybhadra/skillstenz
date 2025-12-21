'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
    preferences: true,
  });

  const handleSave = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Cookie preferences saved!');
  };

  const cardStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '6px',
    padding: '24px'
  };

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '32px' }}>Cookie Policy</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>What Are Cookies?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit a website. They are widely used to make websites work more efficiently and provide 
              information to the owners of the site.
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>How We Use Cookies</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '12px' }}>We use cookies for the following purposes:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Authentication:</strong> To keep you signed in to your account</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how visitors use our website</li>
                <li><strong>Performance:</strong> To ensure our website loads quickly</li>
              </ul>
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>Cookie Preferences</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              You can manage your cookie preferences below. Note that disabling certain cookies may 
              affect your experience on our website.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <div>
                  <h3 style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '14px' }}>Necessary Cookies</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Required for the website to function properly</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  style={{ width: '18px', height: '18px', accentColor: 'var(--bg-accent)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <div>
                  <h3 style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '14px' }}>Analytics Cookies</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Help us understand how visitors use our site</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--bg-accent)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <div>
                  <h3 style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '14px' }}>Marketing Cookies</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Used to deliver relevant advertisements</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--bg-accent)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
                <div>
                  <h3 style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '14px' }}>Preference Cookies</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Remember your settings and preferences</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--bg-accent)', cursor: 'pointer' }}
                />
              </div>
            </div>

            <button onClick={handleSave} style={{ marginTop: '20px', padding: '12px 24px', background: 'var(--bg-accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
              Save Preferences
            </button>
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>Managing Cookies in Your Browser</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              Most web browsers allow you to control cookies through their settings. Here&apos;s how to manage 
              cookies in popular browsers:
            </p>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
              <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li>• <strong>Edge:</strong> Settings → Privacy, Search and Services → Cookies</li>
            </ul>
          </section>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Last updated: January 2025
          </p>
        </div>
      </div>
    </Layout>
  );
}
