import Link from 'next/link';
import Layout from '@/components/Layout';

export default function AboutPage() {
  const team = [
    { name: 'John Doe', role: 'Founder & CEO', image: '/team/john.jpg' },
    { name: 'Jane Smith', role: 'CTO', image: '/team/jane.jpg' },
    { name: 'Mike Johnson', role: 'Lead Developer', image: '/team/mike.jpg' },
    { name: 'Sarah Williams', role: 'Content Lead', image: '/team/sarah.jpg' },
  ];

  const stats = [
    { label: 'Active Learners', value: '100K+' },
    { label: 'Courses', value: '500+' },
    { label: 'Countries', value: '150+' },
    { label: 'Instructors', value: '50+' },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">About LearnHub</h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            We&apos;re on a mission to make quality tech education accessible to everyone, everywhere.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary)]">{stat.value}</div>
              <div className="text-[var(--muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="card mb-16">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Our Mission</h2>
          <p className="text-[var(--muted-foreground)] mb-4">
            LearnHub was founded with a simple belief: that education should be accessible to everyone. 
            We provide high-quality programming courses, tutorials, and resources to help learners 
            at all levels achieve their goals.
          </p>
          <p className="text-[var(--muted-foreground)]">
            Whether you&apos;re just starting your coding journey or looking to advance your career, 
            we have the resources to help you succeed. Our platform offers interactive learning 
            experiences, hands-on projects, and a supportive community of learners.
          </p>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="w-24 h-24 mx-auto bg-[var(--muted)] rounded-full mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">{member.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Ready to Start Learning?</h2>
          <p className="text-[var(--muted-foreground)] mb-6">Join thousands of learners who are already building their future with LearnHub.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/courses" className="btn-primary">Browse Courses</Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
