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
    { label: 'Active Learners', value: '100K+', icon: '👥' },
    { label: 'Courses', value: '500+', icon: '📚' },
    { label: 'Countries', value: '150+', icon: '🌍' },
    { label: 'Instructors', value: '50+', icon: '👨‍🏫' },
  ];

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
            About LearnHub
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
            We&apos;re on a mission to make quality tech education accessible to everyone, everywhere.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-primary)', 
                borderRadius: '6px', 
                padding: '24px 20px', 
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-accent)', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-primary)', 
          borderRadius: '6px', 
          padding: '28px', 
          marginBottom: '48px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.7' }}>
            LearnHub was founded with a simple belief: that education should be accessible to everyone. 
            We provide high-quality programming courses, tutorials, and resources to help learners 
            at all levels achieve their goals.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            Whether you&apos;re just starting your coding journey or looking to advance your career, 
            we have the resources to help you succeed. Our platform offers interactive learning 
            experiences, hands-on projects, and a supportive community of learners.
          </p>
        </div>

        {/* Team */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' }}>Our Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {team.map((member, index) => (
              <div 
                key={index} 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-primary)', 
                  borderRadius: '6px', 
                  padding: '24px 20px', 
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  margin: '0 auto 12px', 
                  background: 'var(--bg-primary)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px', fontSize: '15px' }}>{member.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'var(--bg-accent)', borderRadius: '6px', padding: '40px 24px', color: 'white' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>Ready to Start Learning?</h2>
          <p style={{ opacity: 0.9, marginBottom: '20px', fontSize: '15px' }}>Join thousands of learners who are already building their future with LearnHub.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/courses" style={{ background: 'white', color: 'var(--bg-accent)', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>Browse Courses</Link>
            <Link href="/contact" style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>Contact Us</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
