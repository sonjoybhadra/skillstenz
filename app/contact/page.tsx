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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>Contact Us</h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {/* Contact Form */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' }}>Send us a message</h2>
            {submitted ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '6px' }}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '6px' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '6px' }}>Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '6px' }}>Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px', resize: 'vertical' }}
                    required
                  />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Send Message</button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' }}>Contact Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contactInfo.map((info, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{info.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{info.label}</div>
                      <div style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>Follow Us</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['🐦', '💼', '📘', '📺'].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', textDecoration: 'none' }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-accent)', borderRadius: '6px', padding: '24px', color: 'white' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Need Quick Help?</h2>
              <p style={{ opacity: 0.9, marginBottom: '16px', fontSize: '14px' }}>Check out our FAQ or documentation for instant answers.</p>
              <a href="/faq" style={{ display: 'inline-block', padding: '10px 20px', background: 'white', color: 'var(--bg-accent)', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
