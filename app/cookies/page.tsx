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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-8">Cookie Policy</h1>
        
        <div className="space-y-8">
          <section className="card">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">What Are Cookies?</h2>
            <p className="text-[var(--muted-foreground)]">
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit a website. They are widely used to make websites work more efficiently and provide 
              information to the owners of the site.
            </p>
          </section>

          <section className="card">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">How We Use Cookies</h2>
            <div className="text-[var(--muted-foreground)] space-y-3">
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Authentication:</strong> To keep you signed in to your account</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how visitors use our website</li>
                <li><strong>Performance:</strong> To ensure our website loads quickly</li>
              </ul>
            </div>
          </section>

          <section className="card">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Cookie Preferences</h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              You can manage your cookie preferences below. Note that disabling certain cookies may 
              affect your experience on our website.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Necessary Cookies</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Required for the website to function properly</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="w-5 h-5 rounded border-[var(--border)]"
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Analytics Cookies</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Help us understand how visitors use our site</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border)]"
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Marketing Cookies</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Used to deliver relevant advertisements</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border)]"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Preference Cookies</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Remember your settings and preferences</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border)]"
                />
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary mt-6">
              Save Preferences
            </button>
          </section>

          <section className="card">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Managing Cookies in Your Browser</h2>
            <p className="text-[var(--muted-foreground)] mb-4">
              Most web browsers allow you to control cookies through their settings. Here&apos;s how to manage 
              cookies in popular browsers:
            </p>
            <ul className="space-y-2 text-[var(--muted-foreground)]">
              <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
              <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li>• <strong>Edge:</strong> Settings → Privacy, Search and Services → Cookies</li>
            </ul>
          </section>

          <p className="text-sm text-[var(--muted-foreground)]">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </Layout>
  );
}
