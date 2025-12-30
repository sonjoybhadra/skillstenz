'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { useSettings } from '@/lib/settings';

export default function CookiesPage() {
  const { settings } = useSettings();
  const contactEmail = settings.contactEmail || settings.supportEmail || 'support@skillstenz.com';
  
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Cookie Policy</h1>
        
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What Are Cookies?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit a website. They are widely used to make websites work more efficiently and provide 
              information to the owners of the site.
            </p>
          </section>

          <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How We Use Cookies</h2>
            <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <p className="mb-3">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-900 dark:text-white">Authentication:</strong> To keep you signed in to your account</li>
                <li><strong className="text-gray-900 dark:text-white">Preferences:</strong> To remember your settings and preferences</li>
                <li><strong className="text-gray-900 dark:text-white">Analytics:</strong> To understand how visitors use our website</li>
                <li><strong className="text-gray-900 dark:text-white">Performance:</strong> To ensure our website loads quickly</li>
              </ul>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cookie Preferences</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
              You can manage your cookie preferences below. Note that disabling certain cookies may 
              affect your experience on our website.
            </p>
            
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">Necessary Cookies</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Required for the website to function properly</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="w-5 h-5 rounded accent-blue-500 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">Analytics Cookies</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Help us understand how visitors use our site</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">Marketing Cookies</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Used to deliver relevant advertisements</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">Preference Cookies</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Remember your settings and preferences</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
            
            <button
              onClick={handleSave}
              className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Save Preferences
            </button>
          </section>

          <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Managing Cookies</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for 
              doing so vary from browser to browser. You can find information on how to manage cookies for 
              your browser through its help function.
            </p>
          </section>

          <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              If you have questions about our cookie policy, please contact us at {contactEmail}.
            </p>
          </section>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </Layout>
  );
}
