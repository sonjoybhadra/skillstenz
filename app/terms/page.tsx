'use client';

import Layout from '@/components/Layout';
import { useSettings } from '@/lib/settings';

export default function TermsPage() {
  const { settings } = useSettings();
  const siteName = settings.siteName || 'SkillStenz';
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-400">
              By accessing and using {siteName}, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Use License</h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-3">
              <p>Permission is granted to temporarily access the materials on {siteName} for personal, non-commercial use only.</p>
              <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by {siteName} at any time.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Account</h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-3">
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Course Content</h2>
            <p className="text-gray-600 dark:text-gray-400">
              All course content is protected by copyright and other intellectual property laws. 
              You may not reproduce, distribute, or create derivative works from any content without 
              explicit permission from {siteName}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Payment Terms</h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-3">
              <p>For paid courses and subscriptions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All fees are quoted in INR/USD</li>
                <li>Payments are processed securely through our payment partners</li>
                <li>Refunds are available within 30 days of purchase</li>
                <li>Subscription fees are billed on a recurring basis</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Prohibited Activities</h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-3">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Share your account credentials with others</li>
                <li>Copy or redistribute course materials</li>
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to bypass any security measures</li>
                <li>Harass other users or instructors</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Disclaimer</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The materials on {siteName} are provided on an &apos;as is&apos; basis. {siteName} makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other warranties 
              including, without limitation, implied warranties or conditions of merchantability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Modifications</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {siteName} may revise these terms of service at any time without notice. By using this 
              website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </Layout>
  );
}
