'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is LearnHub?',
      answer: 'LearnHub is a comprehensive online learning platform that offers courses, tutorials, and resources for programming and technology. We provide free and premium content to help you learn at your own pace.'
    },
    {
      question: 'Are the courses free?',
      answer: 'We offer both free and premium courses. Many of our tutorials, cheatsheets, and roadmaps are completely free. Premium courses and certifications require a subscription or one-time purchase.'
    },
    {
      question: 'How do certifications work?',
      answer: 'After completing a certification course and passing the final assessment, you will receive a verified digital certificate that you can share on LinkedIn and add to your resume. Certificates are valid for life.'
    },
    {
      question: 'Can I access courses offline?',
      answer: 'Premium members can download course videos for offline viewing using our mobile app. Downloaded content can be accessed without an internet connection.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for certain regions. All payments are processed securely.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all premium purchases. If you\'re not satisfied with a course, contact our support team for a full refund.'
    },
    {
      question: 'How can I track my progress?',
      answer: 'Your progress is automatically saved as you complete lessons. You can view your overall progress, streak, and course completion status from your dashboard.'
    },
    {
      question: 'Do you offer team or enterprise plans?',
      answer: 'Yes! We offer special pricing for teams and enterprises. Contact our sales team for a custom quote based on your team size and requirements.'
    },
    {
      question: 'How do I get help if I\'m stuck?',
      answer: 'You can ask questions in the course discussion forums, reach out to our support team, or use our AI assistant for quick help with coding problems.'
    },
    {
      question: 'Can I become an instructor?',
      answer: 'Yes! We\'re always looking for qualified instructors. Visit our Careers page or contact us to learn about becoming a LearnHub instructor.'
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Find answers to common questions about LearnHub
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="font-medium text-[var(--text-primary)] pr-4">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <p className="mt-4 text-[var(--text-secondary)] border-t border-[var(--border-primary)] pt-4">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center card bg-[var(--bg-secondary)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Still have questions?</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Can&apos;t find the answer you&apos;re looking for? Contact our support team.
          </p>
          <Link href="/contact" className="btn-primary inline-block">
            Contact Support
          </Link>
        </div>
      </div>
    </Layout>
  );
}
