import Link from 'next/link';
import Layout from '@/components/Layout';

export default function SitemapPage() {
  const siteStructure = [
    {
      category: 'Main Pages',
      pages: [
        { path: '/', name: 'Home', description: 'LearnHub homepage' },
        { path: '/about', name: 'About Us', description: 'Learn about LearnHub' },
        { path: '/contact', name: 'Contact', description: 'Get in touch with us' },
        { path: '/careers', name: 'Careers', description: 'Join our team' },
        { path: '/faq', name: 'FAQ', description: 'Frequently asked questions' },
      ]
    },
    {
      category: 'Learning Resources',
      pages: [
        { path: '/courses', name: 'Courses', description: 'Browse all courses' },
        { path: '/cheatsheets', name: 'Cheatsheets', description: 'Quick reference guides' },
        { path: '/roadmaps', name: 'Roadmaps', description: 'Learning paths' },
        { path: '/technologies', name: 'Technologies', description: 'Browse by technology' },
        { path: '/certifications', name: 'Certifications', description: 'Get certified' },
      ]
    },
    {
      category: 'Developer Tools',
      pages: [
        { path: '/tools', name: 'All Tools', description: 'Browse developer tools' },
        { path: '/compiler/python', name: 'Python Compiler', description: 'Online Python IDE' },
        { path: '/compiler/javascript', name: 'JavaScript Compiler', description: 'Online JavaScript IDE' },
        { path: '/compiler/java', name: 'Java Compiler', description: 'Online Java IDE' },
        { path: '/compiler/cpp', name: 'C++ Compiler', description: 'Online C++ IDE' },
        { path: '/code-editor', name: 'Code Editor', description: 'Multi-file code editor' },
        { path: '/whiteboard', name: 'Whiteboard', description: 'Digital whiteboard' },
        { path: '/tools/qr-generator', name: 'QR Generator', description: 'Generate QR codes' },
        { path: '/tools/json-formatter', name: 'JSON Formatter', description: 'Format JSON data' },
        { path: '/tools/base64', name: 'Base64 Tool', description: 'Encode/decode Base64' },
      ]
    },
    {
      category: 'User Dashboard',
      pages: [
        { path: '/dashboard', name: 'Dashboard', description: 'Your learning dashboard' },
        { path: '/my-courses', name: 'My Courses', description: 'Enrolled courses' },
        { path: '/progress', name: 'Progress', description: 'Track your progress' },
        { path: '/bookmarks', name: 'Bookmarks', description: 'Saved resources' },
        { path: '/notes', name: 'Notes', description: 'Your notes' },
        { path: '/profile-setup', name: 'Profile Setup', description: 'Complete your profile' },
      ]
    },
    {
      category: 'AI & Assistance',
      pages: [
        { path: '/ai-assistant', name: 'AI Assistant', description: 'Get AI-powered help' },
        { path: '/resume-builder', name: 'Resume Builder', description: 'Build your resume' },
      ]
    },
    {
      category: 'Account',
      pages: [
        { path: '/membership', name: 'Membership', description: 'Upgrade your account' },
      ]
    },
    {
      category: 'Legal',
      pages: [
        { path: '/privacy', name: 'Privacy Policy', description: 'Our privacy practices' },
        { path: '/terms', name: 'Terms of Service', description: 'Terms and conditions' },
        { path: '/cookies', name: 'Cookie Policy', description: 'Cookie usage policy' },
      ]
    },
  ];

  const dynamicRoutes = [
    {
      category: 'Dynamic Course Pages',
      examples: [
        '/courses/react',
        '/courses/javascript',
        '/courses/python',
        '/courses/dsa',
        '/courses/machine-learning',
      ]
    },
    {
      category: 'Dynamic Cheatsheet Pages',
      examples: [
        '/cheatsheets/python',
        '/cheatsheets/javascript',
        '/cheatsheets/html',
        '/cheatsheets/java',
        '/cheatsheets/cpp',
      ]
    },
    {
      category: 'Dynamic Roadmap Pages',
      examples: [
        '/roadmaps/react',
        '/roadmaps/javascript',
        '/roadmaps/typescript',
        '/roadmaps/php',
        '/roadmaps/tailwind',
      ]
    },
    {
      category: 'Dynamic Tool Pages',
      examples: [
        '/tools/qr-generator',
        '/tools/image-optimizer',
        '/tools/python-formatter',
        '/tools/whiteboard',
      ]
    },
    {
      category: 'Technology Pages',
      examples: [
        '/dsa',
        '/javascript',
        '/python',
        '/react',
        '/machine-learning',
      ]
    },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Sitemap</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Complete list of all pages on LearnHub
          </p>
        </div>

        {/* Static Pages */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {siteStructure.map((section) => (
            <div key={section.category} className="card">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4 pb-2 border-b border-[var(--border)]">
                {section.category}
              </h2>
              <ul className="space-y-2">
                {section.pages.map((page) => (
                  <li key={page.path}>
                    <Link
                      href={page.path}
                      className="flex justify-between items-center py-2 hover:bg-[var(--muted)] px-2 rounded-lg transition-colors group"
                    >
                      <span className="text-[var(--foreground)] group-hover:text-[var(--primary)]">
                        {page.name}
                      </span>
                      <span className="text-sm text-[var(--muted-foreground)]">{page.path}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dynamic Routes */}
        <div className="card bg-[var(--muted)]">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Dynamic Routes</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            These pages are generated dynamically based on content. Here are some examples:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dynamicRoutes.map((section) => (
              <div key={section.category}>
                <h3 className="font-semibold text-[var(--foreground)] mb-3">{section.category}</h3>
                <ul className="space-y-1">
                  {section.examples.map((path) => (
                    <li key={path}>
                      <Link
                        href={path}
                        className="text-sm text-[var(--primary)] hover:underline"
                      >
                        {path}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-[var(--primary)]">
              {siteStructure.reduce((acc, s) => acc + s.pages.length, 0)}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Static Pages</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-[var(--primary)]">
              {dynamicRoutes.reduce((acc, s) => acc + s.examples.length, 0)}+
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Dynamic Pages</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-[var(--primary)]">
              {siteStructure.length}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Categories</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
