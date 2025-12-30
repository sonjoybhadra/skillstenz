'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSettings } from '@/lib/settings';

type UserType = 'student' | 'professional';

export default function MarketingPage() {
  const [userType, setUserType] = useState<UserType>('student');
  const { settings } = useSettings();
  const siteName = settings.siteName || 'SkillStenz';

  const studentFeatures = [
    {
      icon: '📚',
      title: 'Structured Learning Paths',
      description: 'Follow curated roadmaps designed by industry experts to go from beginner to job-ready developer.',
    },
    {
      icon: '💻',
      title: 'Hands-on Coding Practice',
      description: 'Build real projects with our interactive code editor and compiler supporting 10+ languages.',
    },
    {
      icon: '🎯',
      title: 'Interview Preparation',
      description: 'Master DSA, system design, and behavioral questions with our comprehensive interview prep module.',
    },
    {
      icon: '📜',
      title: 'Verifiable Certificates',
      description: 'Earn certificates upon course completion that you can share with potential employers.',
    },
    {
      icon: '🏆',
      title: 'Gamified Learning',
      description: 'Earn points, badges, and climb the leaderboard as you complete courses and challenges.',
    },
    {
      icon: '🤝',
      title: 'Internship Opportunities',
      description: 'Access exclusive internship listings from top companies looking for fresh talent.',
    },
  ];

  const professionalFeatures = [
    {
      icon: '🚀',
      title: 'Skill Upgradation',
      description: 'Stay updated with the latest technologies - AI/ML, Cloud, DevOps, and more advanced topics.',
    },
    {
      icon: '📊',
      title: 'Career Transition',
      description: 'Comprehensive guides and courses to help you transition to new tech roles seamlessly.',
    },
    {
      icon: '💼',
      title: 'Job Board Access',
      description: 'Exclusive access to senior and lead positions from verified companies.',
    },
    {
      icon: '📋',
      title: 'Resume Builder',
      description: 'Create professional resumes with our AI-powered resume builder and customizable templates.',
    },
    {
      icon: '🏅',
      title: 'Professional Certifications',
      description: 'Industry-recognized certifications to validate your expertise and stand out.',
    },
    {
      icon: '🎤',
      title: 'Hackathons & Events',
      description: 'Participate in hackathons, webinars, and networking events to expand your professional circle.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Learners' },
    { value: '500+', label: 'Courses' },
    { value: '1000+', label: 'Tutorials' },
    { value: '95%', label: 'Success Rate' },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at Google',
      image: null,
      type: 'student' as UserType,
      quote: `${siteName} helped me crack my Google interview. The structured DSA roadmap and interview prep was exactly what I needed!`,
    },
    {
      name: 'Rahul Verma',
      role: 'Senior DevOps Engineer',
      image: null,
      type: 'professional' as UserType,
      quote: 'As a 10-year experienced developer, I found the advanced cloud and DevOps courses extremely valuable for my career growth.',
    },
    {
      name: 'Sneha Patel',
      role: 'Frontend Developer at Microsoft',
      image: null,
      type: 'student' as UserType,
      quote: 'The React and Next.js roadmap was comprehensive. Within 6 months, I landed my dream job at Microsoft!',
    },
    {
      name: 'Amit Kumar',
      role: 'Tech Lead at Amazon',
      image: null,
      type: 'professional' as UserType,
      quote: 'The system design and architecture courses helped me transition from individual contributor to tech lead role.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Access to 50+ free courses',
        'Basic coding practice',
        'Community forum access',
        'Weekly newsletters',
      ],
      cta: 'Get Started',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      features: [
        'All Free features',
        'Access to 500+ courses',
        'Interview preparation module',
        'Certificate generation',
        'Priority support',
        'Exclusive job listings',
      ],
      cta: 'Start Free Trial',
      featured: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: [
        'All Pro features',
        'Team management dashboard',
        'Custom learning paths',
        'API access',
        'Dedicated account manager',
        'White-label options',
      ],
      cta: 'Contact Sales',
      featured: false,
    },
  ];

  const features = userType === 'student' ? studentFeatures : professionalFeatures;
  const filteredTestimonials = testimonials.filter(t => t.type === userType);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 opacity-10 dark:opacity-20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          {/* User Type Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setUserType('student')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  userType === 'student'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                🎓 I&apos;m a Student
              </button>
              <button
                onClick={() => setUserType('professional')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  userType === 'professional'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                💼 I&apos;m a Professional
              </button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {userType === 'student' ? (
                <>
                  Launch Your <span className="text-emerald-600">Tech Career</span>
                  <br />
                  With Confidence
                </>
              ) : (
                <>
                  Accelerate Your <span className="text-emerald-600">Tech Growth</span>
                  <br />
                  To The Next Level
                </>
              )}
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {userType === 'student'
                ? 'Master coding, crack interviews, and land your dream job with our comprehensive learning platform designed specifically for students and freshers.'
                : 'Upskill with cutting-edge technologies, advance your career, and stay ahead in the competitive tech industry with our advanced courses and resources.'}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg hover:border-emerald-600 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-500 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {userType === 'student' ? 'Everything You Need to Succeed' : 'Accelerate Your Career Growth'}
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              {userType === 'student'
                ? 'From learning to landing your first job, we\'ve got you covered.'
                : 'Stay ahead with tools and resources designed for experienced professionals.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Popular Learning Paths
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Choose your path and start learning today
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Frontend Developer', icon: '🎨', courses: 45, hours: 120, color: 'from-blue-500 to-purple-600' },
              { title: 'Backend Developer', icon: '⚙️', courses: 52, hours: 140, color: 'from-green-500 to-teal-600' },
              { title: 'Full Stack Developer', icon: '🔥', courses: 85, hours: 250, color: 'from-orange-500 to-red-600' },
              { title: 'Data Science', icon: '📊', courses: 38, hours: 100, color: 'from-cyan-500 to-blue-600' },
              { title: 'DevOps Engineer', icon: '🛠️', courses: 42, hours: 110, color: 'from-purple-500 to-pink-600' },
              { title: 'Mobile Developer', icon: '📱', courses: 35, hours: 95, color: 'from-pink-500 to-rose-600' },
              { title: 'Cloud Architect', icon: '☁️', courses: 28, hours: 85, color: 'from-indigo-500 to-violet-600' },
              { title: 'AI/ML Engineer', icon: '🤖', courses: 48, hours: 130, color: 'from-emerald-500 to-cyan-600' },
            ].map((path, i) => (
              <Link
                key={i}
                href={`/roadmaps/${path.title.toLowerCase().replace(/ /g, '-')}`}
                className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="p-6">
                  <span className="text-4xl mb-4 block">{path.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{path.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{path.courses} courses</span>
                    <span>{path.hours}+ hours</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Hear from {userType === 'student' ? 'students' : 'professionals'} who transformed their careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {filteredTestimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-emerald-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 transition-all ${
                  plan.featured
                    ? 'border-emerald-500 shadow-xl scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 hover:shadow-lg'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                  className={`mt-8 w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of {userType === 'student' ? 'students' : 'professionals'} who are already learning and growing with {siteName}.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Create Free Account
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{siteName}</h3>
              <p className="text-sm">
                Empowering developers worldwide with quality education and career resources.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
                <li><Link href="/tutorials" className="hover:text-white">Tutorials</Link></li>
                <li><Link href="/roadmaps" className="hover:text-white">Roadmaps</Link></li>
                <li><Link href="/cheatsheets" className="hover:text-white">Cheatsheets</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/careers" className="hover:text-white">Jobs</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/tools" className="hover:text-white">Tools</Link></li>
                <li><Link href="/compiler" className="hover:text-white">Compiler</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
