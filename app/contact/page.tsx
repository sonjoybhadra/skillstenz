'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'support@learnhub.com' },
    { icon: '📍', label: 'Address', value: '123 Tech Street, San Francisco, CA' },
    { icon: '📞', label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: '⏰', label: 'Hours', value: 'Mon-Fri: 9AM - 6PM PST' },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">Contact Us</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Send us a message</h2>
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--foreground)]">Message Sent!</h3>
                <p className="text-[var(--muted-foreground)]">We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <div className="text-sm text-[var(--muted-foreground)]">{info.label}</div>
                      <div className="text-[var(--foreground)]">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Follow Us</h2>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>

            <div className="card bg-[var(--primary)] text-white">
              <h2 className="text-xl font-semibold mb-2">Need Quick Help?</h2>
              <p className="opacity-90 mb-4">Check out our FAQ or documentation for instant answers.</p>
              <a href="/faq" className="inline-block px-4 py-2 bg-white text-[var(--primary)] rounded-lg font-medium hover:bg-gray-100 transition-colors">
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
