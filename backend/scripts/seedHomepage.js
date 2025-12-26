const mongoose = require('mongoose');
require('dotenv').config();

const HomeSection = require('../src/modules/homepage/HomeSection');

const homepageSections = [
  {
    sectionKey: 'hero',
    title: 'Hero Section',
    isActive: true,
    order: 0,
    heroData: {
      badge: '🚀 THE FUTURE IS AI - START YOUR JOURNEY',
      mainTitle: 'Master',
      highlightTitle: 'AI & AI Agents',
      description: 'Learn to build intelligent AI agents, LLM applications, and cutting-edge AI solutions. From LangChain to RAG systems, master the technologies that are reshaping the world.',
      stats: [
        { value: '10+', label: 'AI Technologies' },
        { value: '50+', label: 'AI Projects' },
        { value: '1:1', label: 'AI Mentorship' },
        { value: '24/7', label: 'AI Support' },
      ],
      ctaButtons: [
        { text: 'Start Learning AI', href: '/technologies/ai', variant: 'primary' },
        { text: 'Explore AI Agents', href: '/technologies/ai-agents', variant: 'secondary' },
      ],
      backgroundImage: '/ai-resume-banner.png'
    }
  },
  {
    sectionKey: 'cta_cards',
    title: 'CTA Cards',
    isActive: true,
    order: 1,
    ctaCards: [
      {
        title: '🎓 Annual Membership',
        description: 'Become a SkillStenz Pro member and enjoy unlimited access to all courses, projects, and exclusive content.',
        buttonText: 'Subscribe Now',
        buttonHref: '/membership',
        gradient: 'from-blue-600 to-blue-700',
        order: 0
      },
      {
        title: '🏆 Online Certifications',
        description: 'Stand out with industry-recognized certifications and receive valuable certificates and knowledge.',
        buttonText: 'Get Certified',
        buttonHref: '/certifications',
        gradient: 'from-blue-500 to-indigo-700',
        order: 1
      }
    ]
  },
  {
    sectionKey: 'latest_updates',
    title: 'Latest',
    highlightText: 'Updates',
    subtitle: 'Newly Added and Updated Tutorials',
    isActive: true,
    order: 2,
    latestUpdates: {
      monthYear: 'December, 2025',
      items: [
        { name: 'AI Agents with LangGraph', title: 'AI Agents with LangGraph', icon: '📚', isNew: true, order: 0 },
        { name: 'GPT-4 Vision Tutorial', title: 'GPT-4 Vision Tutorial', icon: '📚', isNew: true, order: 1 },
        { name: 'RAG with Pinecone', title: 'RAG with Pinecone', icon: '📚', isNew: true, order: 2 },
        { name: 'LangChain v0.3 Guide', title: 'LangChain v0.3 Guide', icon: '📚', isNew: false, order: 3 },
        { name: 'Prompt Engineering Best Practices', title: 'Prompt Engineering Best Practices', icon: '📚', isNew: false, order: 4 },
        { name: 'Building Multi-Agent Systems', title: 'Building Multi-Agent Systems', icon: '📚', isNew: true, order: 5 },
      ]
    }
  },
  {
    sectionKey: 'cheatsheets',
    title: 'Cheatsheets',
    highlightText: 'Instant Learning',
    isActive: true,
    order: 4,
    seeAllLink: '/cheatsheets',
    seeAllText: 'See all',
    backgroundColor: 'gray',
    items: [
      { name: 'Python Cheatsheet', icon: '🐍', href: '/cheatsheets/python', order: 0 },
      { name: 'JavaScript Cheatsheet', icon: '🟨', href: '/cheatsheets/javascript', order: 1 },
      { name: 'React Cheatsheet', icon: '⚛️', href: '/cheatsheets/react', order: 2 },
      { name: 'TypeScript Cheatsheet', icon: '🔷', href: '/cheatsheets/typescript', order: 3 },
      { name: 'SQL Cheatsheet', icon: '🗃️', href: '/cheatsheets/sql', order: 4 },
      { name: 'Git Cheatsheet', icon: '📚', href: '/cheatsheets/git', order: 5 },
      { name: 'Docker Cheatsheet', icon: '🐳', href: '/cheatsheets/docker', order: 6 },
      { name: 'AI/ML Cheatsheet', icon: '🤖', href: '/cheatsheets/ai', order: 7 },
    ]
  },
  {
    sectionKey: 'roadmaps',
    title: 'Roadmaps',
    highlightText: 'Mastery Blueprint',
    isActive: true,
    order: 5,
    seeAllLink: '/roadmaps',
    seeAllText: 'See all',
    backgroundColor: 'white',
    items: [
      { name: 'Full Stack Developer', icon: '🚀', href: '/roadmaps/fullstack', order: 0 },
      { name: 'Frontend Developer', icon: '🎨', href: '/roadmaps/frontend', order: 1 },
      { name: 'Backend Developer', icon: '⚙️', href: '/roadmaps/backend', order: 2 },
      { name: 'AI/ML Engineer', icon: '🤖', href: '/roadmaps/ai-ml', order: 3 },
      { name: 'DevOps Engineer', icon: '🔧', href: '/roadmaps/devops', order: 4 },
      { name: 'Mobile Developer', icon: '📱', href: '/roadmaps/mobile', order: 5 },
      { name: 'Data Scientist', icon: '📊', href: '/roadmaps/data-scientist', order: 6 },
      { name: 'Cloud Architect', icon: '☁️', href: '/roadmaps/cloud', order: 7 },
    ]
  },
  {
    sectionKey: 'career_categories',
    title: 'Build Your',
    highlightText: 'Career',
    isActive: true,
    order: 6,
    backgroundColor: 'gray',
    careerCategories: [
      {
        title: 'AI & AI Agents',
        colorClass: 'blue',
        tags: ['Artificial Intelligence', 'AI Agents', 'LangChain', 'Machine Learning', 'GenAI'],
        order: 0
      },
      {
        title: 'Full Stack & Web Development',
        colorClass: 'red',
        tags: ['React.js', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB'],
        order: 1
      },
      {
        title: 'Backend & DevOps',
        colorClass: 'green',
        tags: ['Python', 'Java', 'Go', 'Docker', 'Kubernetes'],
        order: 2
      },
      {
        title: 'Mobile & Modern Languages',
        colorClass: 'purple',
        tags: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Rust'],
        order: 3
      }
    ]
  },
  {
    sectionKey: 'compiler',
    title: 'Start Coding',
    highlightText: 'in Seconds',
    isActive: true,
    order: 7,
    backgroundColor: 'white',
    compilerData: {
      title: 'Start Coding',
      subtitle: 'Coding Ground For Developers - An interactive online platform for hands-on learning',
      languages: [
        { name: 'Python', icon: '🐍', href: '/compiler/python', isPrimary: true, order: 0 },
        { name: 'JavaScript', icon: '🟨', href: '/compiler/javascript', isPrimary: true, order: 1 },
        { name: 'TypeScript', icon: '🔷', href: '/compiler/typescript', isPrimary: true, order: 2 },
        { name: 'PHP', icon: '🐘', href: '/compiler/php', isPrimary: true, order: 3 },
        { name: 'Java', icon: '☕', href: '/compiler/java', isPrimary: true, order: 4 },
        { name: 'C', icon: '©️', href: '/compiler/c', isPrimary: true, order: 5 },
        { name: 'C++', icon: '⚡', href: '/compiler/cpp', isPrimary: true, order: 6 },
        { name: 'Go', icon: '🔵', href: '/compiler/go', isPrimary: true, order: 7 },
        { name: 'Rust', icon: '🦀', href: '/compiler/rust', isPrimary: true, order: 8 },
        { name: 'Ruby', icon: '💎', href: '/compiler/ruby', isPrimary: true, order: 9 },
        { name: 'React.js', icon: '⚛️', href: '/compiler/react', isPrimary: false, order: 10 },
        { name: 'Next.js', icon: '▲', href: '/compiler/nextjs', isPrimary: false, order: 11 },
        { name: 'Node.js', icon: '🟢', href: '/compiler/nodejs', isPrimary: false, order: 12 },
        { name: 'Bun.js', icon: '🥟', href: '/compiler/bunjs', isPrimary: false, order: 13 },
        { name: 'HTML/CSS', icon: '📄', href: '/compiler/html', isPrimary: false, order: 14 },
        { name: 'SQL', icon: '🗃️', href: '/compiler/sql', isPrimary: false, order: 15 },
        { name: 'MongoDB', icon: '🍃', href: '/compiler/mongodb', isPrimary: false, order: 16 },
        { name: 'Swift', icon: '🍎', href: '/compiler/swift', isPrimary: false, order: 17 },
        { name: 'Kotlin', icon: '🟣', href: '/compiler/kotlin', isPrimary: false, order: 18 },
        { name: 'Dart', icon: '🎯', href: '/compiler/dart', isPrimary: false, order: 19 },
      ],
      ctaButton: {
        text: 'View All Compilers',
        href: '/compiler',
        variant: 'primary'
      }
    }
  },
  {
    sectionKey: 'tools',
    title: 'Most Popular',
    highlightText: 'Tools',
    subtitle: 'Utilize the frequently used tools for your needs',
    isActive: true,
    order: 8,
    seeAllLink: '/tools',
    seeAllText: 'See all',
    backgroundColor: 'gray',
    items: [
      { name: 'Code Formatter', icon: '✨', href: '/tools/formatter', order: 0 },
      { name: 'JSON Viewer', icon: '📋', href: '/tools/json-viewer', order: 1 },
      { name: 'Regex Tester', icon: '🔍', href: '/tools/regex', order: 2 },
      { name: 'Color Picker', icon: '🎨', href: '/tools/color-picker', order: 3 },
      { name: 'Base64 Encoder', icon: '🔐', href: '/tools/base64', order: 4 },
      { name: 'Markdown Editor', icon: '📝', href: '/tools/markdown', order: 5 },
      { name: 'API Tester', icon: '🌐', href: '/tools/api-tester', order: 6 },
      { name: 'AI Code Generator', icon: '🤖', href: '/tools/ai-code', order: 7 },
    ]
  }
];

async function seedHomepage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk');
    console.log('Connected to MongoDB');

    // Clear existing homepage sections
    await HomeSection.deleteMany({});
    console.log('Cleared existing homepage sections');

    // Insert new sections
    await HomeSection.insertMany(homepageSections);
    console.log(`Inserted ${homepageSections.length} homepage sections`);

    console.log('Homepage seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding homepage:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  seedHomepage();
}

module.exports = seedHomepage;
