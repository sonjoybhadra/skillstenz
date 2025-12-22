'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { technologiesAPI, Technology } from '../lib/api';
import EnhancedSEO from '../components/EnhancedSEO';

export default function Home() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    { name: 'Aarav Sharma', role: 'Software Engineer (India)', avatar: '🧑‍💻', text: 'Affordable courses, clear notes, and interview prep helped me get my first job.' },
    { name: 'Ananya Gupta', role: 'Frontend Developer', avatar: '👩‍💻', text: 'Loved the Hindi notes and UPI options. Roadmaps are very practical!' },
    { name: 'Rahul Verma', role: 'ML Engineer', avatar: '🧠', text: 'Great DSA and system design prep. The projects are job-ready.' },
  ];

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const { data, error } = await technologiesAPI.getAll();
        if (data && !error) {
          setTechnologies(data);
        }
      } catch (err) {
        console.error('Failed to fetch technologies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnologies();

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const getTechIcon = (slug: string): string => {
    const icons: Record<string, string> = {
      'ai': '🤖', 'ai-agents': '🦾', 'machine-learning': '🧠', 'langchain': '🔗',
      'prompt-engineering': '💬', 'rag-systems': '📚', 'nlp': '💭', 'computer-vision': '👁️',
      'python-for-ai': '🐍', 'genai-applications': '✨', 'default': '📘'
    };
    return icons[slug] || icons['default'];
  };

  const featuredTech = technologies.filter(t => t.featured).slice(0, 8);

  const features = [
    { icon: '🎓', title: 'Expert-Led Courses', desc: 'Learn from industry professionals with real-world experience' },
    { icon: '💻', title: 'Hands-On Projects', desc: 'Build portfolio-worthy projects while learning' },
    { icon: '🏆', title: 'Industry Certificates', desc: 'Earn recognized certificates to boost your career' },
    { icon: '🚀', title: 'Career Support', desc: 'Get guidance from resume building to job interviews' },
    { icon: '⚡', title: 'Interactive Coding', desc: 'Practice coding in our built-in online compilers' },
    { icon: '👥', title: 'Community Access', desc: 'Join thousands of learners and grow together' },
  ];

  // (moved testimonials above to avoid redeclaration)

  const stats = [
    { label: 'Active Students', value: '50,000+', icon: '👨‍🎓' },
    { label: 'Expert Instructors', value: '100+', icon: '👨‍🏫' },
    { label: 'Course Hours', value: '10,000+', icon: '⏱️' },
    { label: 'Completion Rate', value: '94%', icon: '📊' },
  ];

  return (
    <>
      <EnhancedSEO
        title="TechTooTalk - Learn AI, Web Development & Programming"
        description="Master AI, AI Agents, Web Development, and Programming with expert-led courses, hands-on projects, and industry certifications. Start your tech career today!"
        keywords="AI courses, web development, programming, AI agents, LangChain, machine learning, online learning"
        ogType="website"
        canonical="https://techtootalk.com"
      />
      <Layout>
        {/* Hero Section with Animated Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="container relative z-10 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6 animate-fade-in">
                <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
                  <span className="text-sm font-semibold">🇮🇳 Learn AI & Tech for Indian Students</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">AI & Tech</span>
                  <br />Skills That Matter
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Learn AI, AI Agents, Web Development, and Programming from industry experts. 
                  Build real projects, earn certificates, and launch your dream career.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/courses" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    Explore Courses
                  </Link>
                  <Link href="/technologies" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold text-lg transition-all duration-300 border border-white/20">
                    Browse Technologies
                  </Link>
                </div>
                {/* Trust Badges (India Focus) */}
                <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span>₹0 Free Courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span>UPI • Paytm • PhonePe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span>English + हिंदी Notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Interview & Placement Prep</span>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative animate-float">
                <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                      <span className="text-4xl">🎯</span>
                      <div>
                        <div className="font-semibold">Goal-Oriented Learning</div>
                        <div className="text-sm text-blue-200">Track your progress</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                      <span className="text-4xl">💡</span>
                      <div>
                        <div className="font-semibold">Expert Mentorship</div>
                        <div className="text-sm text-blue-200">1-on-1 guidance</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                      <span className="text-4xl">🏆</span>
                      <div>
                        <div className="font-semibold">Career Transformation</div>
                        <div className="text-sm text-blue-200">Land your dream job</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* India Focus - Student Essentials */}
        <section className="section" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <div className="container">
            <div className="grid grid-3" style={{ gap: '16px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h3 className="text-lg font-bold mb-2">🇮🇳 Made for Indian Students</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Affordable learning with INR pricing, scholarships, and regional support.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="tag">₹ INR</span>
                  <span className="tag">UPI • Paytm • PhonePe</span>
                  <span className="tag">हिंदी Notes</span>
                </div>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <h3 className="text-lg font-bold mb-2">🧭 Exam & Interview Prep</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  DSA, system design, aptitude, and coding interview preparation.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link href="/mcqs" className="tag">Aptitude MCQs</Link>
                  <Link href="/tools/markdown" className="tag">Notes</Link>
                  <Link href="/roadmaps" className="tag">Roadmaps</Link>
                </div>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <h3 className="text-lg font-bold mb-2">🎓 Scholarships & Aid</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Student discounts and scholarships for eligible learners.
                </p>
                <div className="mt-3">
                  <Link href="/membership" className="btn btn-outline btn-sm">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white dark:bg-slate-900 py-12 border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center space-y-2 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="text-4xl">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-800">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose <span className="text-blue-600">TechTooTalk</span>?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to succeed in your tech career</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="group p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20">
          <div className="container">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-2">
                  Explore <span className="text-blue-600">Technologies</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Master the most in-demand technologies</p>
              </div>
              <Link href="/technologies" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(featuredTech.length > 0 ? featuredTech : technologies.slice(0, 8)).map((tech) => (
                  <Link key={tech._id} href={`/technologies/${tech.slug}`} className="group p-6 bg-white dark:bg-slate-900 rounded-xl shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-slate-700">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{getTechIcon(tech.slug || '')}</div>
                    <div className="font-semibold text-lg mb-1">{tech.name}</div>
                    {tech.courses && tech.courses.length > 0 && (
                      <div className="text-sm text-gray-500">{tech.courses.length} courses</div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Student Success Stories</h2>
              <p className="text-xl text-blue-100">Join thousands who transformed their careers</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className={`transition-opacity duration-500 ${idx === activeTestimonial ? 'block' : 'hidden'}`}>
                    <div className="text-6xl mb-6">{testimonial.avatar}</div>
                    <p className="text-2xl mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-blue-200">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Testimonial Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${idx === activeTestimonial ? 'bg-white w-8' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey in India?</h2>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Join thousands of students across India learning AI, web development, and programming. 
                Enjoy INR pricing, UPI options, and student-friendly plans.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/membership" className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-xl">
                  Get Started Today
                </Link>
                <Link href="/courses" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-bold text-lg transition-all border-2 border-white">
                  Browse Free Courses
                </Link>
                <div className="w-full flex justify-center mt-4">
                  <div className="flex items-center gap-3 text-sm text-blue-100">
                    <span className="badge badge-light">₹ INR</span>
                    <span className="badge badge-light">UPI • Paytm • PhonePe</span>
                    <span className="badge badge-light">English + हिंदी</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inline Styles for Animations */}
        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }
        `}</style>
      </Layout>
    </>
  );
}
