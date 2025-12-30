'use client';

import CmsPage from '@/components/CmsPage';
import { useSettings } from '@/lib/settings';

function FallbackPrivacyContent() {
  const { settings } = useSettings();
  const contactEmail = settings.contactEmail || settings.supportEmail || 'support@skillstenz.com';
  
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
        <div className="text-gray-600 dark:text-gray-400 space-y-3">
          <p>We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us for support.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal information (name, email, profile picture)</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>Course progress and preferences</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
        <div className="text-gray-600 dark:text-gray-400 space-y-3">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Personalize your learning experience</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Information Sharing</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We do not sell, trade, or otherwise transfer your personal information to outside parties. 
          This does not include trusted third parties who assist us in operating our website, 
          conducting our business, or servicing you.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Security</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We implement a variety of security measures to maintain the safety of your personal information. 
          Your personal information is contained behind secured networks and is only accessible by a 
          limited number of persons who have special access rights.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Cookies</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We use cookies to understand and save your preferences for future visits, 
          keep track of advertisements, and compile aggregate data about site traffic and site interaction.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Your Rights</h2>
        <div className="text-gray-600 dark:text-gray-400 space-y-3">
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Contact Us</h2>
        <p className="text-gray-600 dark:text-gray-400">
          If you have questions about this Privacy Policy, please contact us at {contactEmail}.
        </p>
      </section>

      <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
        Last updated: January 2025
      </p>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <CmsPage 
      slug="privacy" 
      fallbackTitle="Privacy Policy" 
      fallbackContent={<FallbackPrivacyContent />}
    />
  );
}
