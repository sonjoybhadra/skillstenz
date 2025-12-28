const mongoose = require('mongoose');
require('dotenv').config();

const Roadmap = require('../models/Roadmap');
const Hackathon = require('../models/Hackathon');
const Internship = require('../models/Internship');
const InterviewTopic = require('../models/InterviewTopic');
const CmsPage = require('../models/CmsPage');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk');
    console.log('Connected to MongoDB');

    // Seed Roadmaps
    const roadmaps = [
      {
        slug: 'frontend',
        title: 'Frontend Developer Roadmap',
        name: 'Frontend Developer',
        description: 'Complete path to becoming a professional frontend developer',
        icon: '🎨',
        category: 'frontend',
        duration: '6 months',
        difficulty: 'beginner',
        isFeatured: true,
        steps: [
          { title: 'Internet & Web Basics', topics: ['How the Internet Works', 'HTTP/HTTPS', 'Browsers', 'DNS'], duration: '1 week', order: 1 },
          { title: 'HTML Fundamentals', topics: ['Semantic HTML', 'Forms', 'Accessibility', 'SEO Basics'], duration: '2 weeks', order: 2 },
          { title: 'CSS Fundamentals', topics: ['Box Model', 'Flexbox', 'Grid', 'Responsive Design'], duration: '3 weeks', order: 3 },
          { title: 'JavaScript Basics', topics: ['Variables', 'Data Types', 'Functions', 'DOM Manipulation'], duration: '4 weeks', order: 4 },
          { title: 'Version Control', topics: ['Git Basics', 'GitHub', 'Branching', 'Pull Requests'], duration: '1 week', order: 5 },
          { title: 'React Fundamentals', topics: ['Components', 'Props', 'State', 'Hooks'], duration: '4 weeks', order: 6 },
        ]
      },
      {
        slug: 'backend',
        title: 'Backend Developer Roadmap',
        name: 'Backend Developer',
        description: 'Master server-side development and APIs',
        icon: '⚙️',
        category: 'backend',
        duration: '8 months',
        difficulty: 'intermediate',
        isFeatured: true,
        steps: [
          { title: 'Programming Language', topics: ['Node.js', 'Python', 'Java', 'Go'], duration: '4 weeks', order: 1 },
          { title: 'Databases', topics: ['SQL', 'PostgreSQL', 'MongoDB', 'Redis'], duration: '4 weeks', order: 2 },
          { title: 'APIs', topics: ['REST', 'GraphQL', 'Authentication', 'Rate Limiting'], duration: '3 weeks', order: 3 },
          { title: 'Testing', topics: ['Unit Testing', 'Integration Testing', 'TDD'], duration: '2 weeks', order: 4 },
          { title: 'Docker', topics: ['Containers', 'Docker Compose', 'Best Practices'], duration: '2 weeks', order: 5 },
        ]
      },
      {
        slug: 'fullstack',
        title: 'Full Stack Developer Roadmap',
        name: 'Full Stack Developer',
        description: 'Comprehensive path covering frontend, backend, and DevOps',
        icon: '🚀',
        category: 'other',
        duration: '12 months',
        difficulty: 'advanced',
        isFeatured: true,
        steps: [
          { title: 'Web Fundamentals', topics: ['HTML', 'CSS', 'JavaScript'], duration: '4 weeks', order: 1 },
          { title: 'Frontend Framework', topics: ['React', 'Vue', 'Angular'], duration: '6 weeks', order: 2 },
          { title: 'Backend', topics: ['Node.js', 'Express', 'Databases'], duration: '6 weeks', order: 3 },
          { title: 'DevOps Basics', topics: ['Docker', 'CI/CD', 'Cloud'], duration: '4 weeks', order: 4 },
        ]
      },
      {
        slug: 'devops',
        title: 'DevOps Engineer Roadmap',
        name: 'DevOps Engineer',
        description: 'Master CI/CD, containers, and cloud infrastructure',
        icon: '🔧',
        category: 'devops',
        duration: '8 months',
        difficulty: 'advanced',
        steps: [
          { title: 'Linux', topics: ['Command Line', 'Shell Scripting', 'System Admin'], duration: '3 weeks', order: 1 },
          { title: 'Containers', topics: ['Docker', 'Kubernetes', 'Helm'], duration: '6 weeks', order: 2 },
          { title: 'CI/CD', topics: ['GitHub Actions', 'Jenkins', 'ArgoCD'], duration: '4 weeks', order: 3 },
          { title: 'Cloud', topics: ['AWS', 'Azure', 'GCP'], duration: '6 weeks', order: 4 },
        ]
      }
    ];

    await Roadmap.deleteMany({});
    await Roadmap.insertMany(roadmaps);
    console.log('✅ Roadmaps seeded');

    // Seed Hackathons
    const hackathons = [
      {
        title: 'AI Innovation Challenge 2025',
        slug: 'ai-innovation-challenge-2025',
        organizer: 'Google Developer Groups',
        description: 'Build innovative AI solutions to solve real-world problems.',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-02-17'),
        mode: 'online',
        prize: '$10,000',
        skillsRequired: ['Python', 'Machine Learning', 'TensorFlow'],
        difficulty: 'intermediate',
        registrationLink: 'https://example.com/register',
        isFeatured: true
      },
      {
        title: 'Web3 DeFi Hackathon',
        slug: 'web3-defi-hackathon',
        organizer: 'Ethereum Foundation',
        description: 'Create the next generation of decentralized finance applications.',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-03'),
        mode: 'hybrid',
        prize: '$25,000',
        skillsRequired: ['Solidity', 'React', 'Web3.js'],
        difficulty: 'advanced',
        registrationLink: 'https://example.com/register',
        isFeatured: true
      },
      {
        title: 'Beginner Friendly Code Jam',
        slug: 'beginner-code-jam',
        organizer: 'TechTooTalk',
        description: 'Perfect for beginners to get started with hackathons.',
        startDate: new Date('2025-02-20'),
        endDate: new Date('2025-02-21'),
        mode: 'online',
        prize: '$5,000',
        skillsRequired: ['HTML', 'CSS', 'JavaScript'],
        difficulty: 'beginner',
        registrationLink: 'https://example.com/register'
      }
    ];

    await Hackathon.deleteMany({});
    await Hackathon.insertMany(hackathons);
    console.log('✅ Hackathons seeded');

    // Seed Internships
    const internships = [
      {
        title: 'AI/ML Engineering Intern',
        slug: 'microsoft-ai-ml-intern',
        company: 'Microsoft',
        location: 'Remote',
        type: 'remote',
        duration: '3 months',
        stipend: '$3,000/month',
        skillsRequired: ['Python', 'PyTorch', 'Machine Learning'],
        applyLink: 'https://careers.microsoft.com',
        deadline: new Date('2025-02-15'),
        isFeatured: true,
        description: 'Work on cutting-edge AI/ML projects with world-class engineers.'
      },
      {
        title: 'Full Stack Developer Intern',
        slug: 'google-fullstack-intern',
        company: 'Google',
        location: 'Mountain View, CA',
        type: 'onsite',
        duration: '6 months',
        stipend: '$4,500/month',
        skillsRequired: ['React', 'Node.js', 'MongoDB'],
        applyLink: 'https://careers.google.com',
        deadline: new Date('2025-02-10'),
        isFeatured: true
      },
      {
        title: 'Frontend Developer Intern',
        slug: 'meta-frontend-intern',
        company: 'Meta',
        location: 'Remote',
        type: 'remote',
        duration: '3 months',
        stipend: '$2,500/month',
        skillsRequired: ['React', 'TypeScript', 'CSS'],
        applyLink: 'https://careers.meta.com',
        deadline: new Date('2025-03-01')
      }
    ];

    await Internship.deleteMany({});
    await Internship.insertMany(internships);
    console.log('✅ Internships seeded');

    // Seed Interview Topics
    const interviewTopics = [
      {
        title: 'Arrays & Strings',
        slug: 'arrays-strings',
        category: 'Data Structures',
        icon: '📊',
        difficulty: 'easy',
        isFeatured: true,
        order: 1,
        questions: [
          { question: 'How do you reverse an array in place?', difficulty: 'easy', order: 1 },
          { question: 'Find the missing number in an array of 1 to N', difficulty: 'easy', order: 2 },
          { question: 'Check if a string is a palindrome', difficulty: 'easy', order: 3 },
        ]
      },
      {
        title: 'Trees & Graphs',
        slug: 'trees-graphs',
        category: 'Data Structures',
        icon: '🌳',
        difficulty: 'medium',
        isFeatured: true,
        order: 2,
        questions: [
          { question: 'Implement BFS and DFS traversal', difficulty: 'medium', order: 1 },
          { question: 'Find the height of a binary tree', difficulty: 'easy', order: 2 },
          { question: 'Check if a binary tree is balanced', difficulty: 'medium', order: 3 },
        ]
      },
      {
        title: 'Dynamic Programming',
        slug: 'dynamic-programming',
        category: 'Algorithms',
        icon: '⚙️',
        difficulty: 'hard',
        order: 3,
        questions: [
          { question: 'Solve the Fibonacci sequence using DP', difficulty: 'easy', order: 1 },
          { question: 'Longest Common Subsequence', difficulty: 'medium', order: 2 },
          { question: 'Coin Change Problem', difficulty: 'hard', order: 3 },
        ]
      },
      {
        title: 'System Design',
        slug: 'system-design',
        category: 'System Design',
        icon: '🏗️',
        difficulty: 'hard',
        isFeatured: true,
        order: 4,
        questions: [
          { question: 'Design a URL shortener', difficulty: 'medium', order: 1 },
          { question: 'Design Twitter/X feed', difficulty: 'hard', order: 2 },
          { question: 'Design a rate limiter', difficulty: 'medium', order: 3 },
        ]
      }
    ];

    await InterviewTopic.deleteMany({});
    await InterviewTopic.insertMany(interviewTopics);
    console.log('✅ Interview Topics seeded');

    // Seed CMS Pages
    const cmsPages = [
      {
        slug: 'privacy',
        title: 'Privacy Policy',
        metaTitle: 'Privacy Policy - TechTooTalk',
        metaDescription: 'Learn about how TechTooTalk collects, uses, and protects your personal information.',
        sections: [
          { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us for support.', type: 'text', order: 1 },
          { title: 'How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and personalize your learning experience.', type: 'text', order: 2 },
          { title: 'Data Security', content: 'We implement a variety of security measures to maintain the safety of your personal information.', type: 'text', order: 3 },
          { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time.', type: 'text', order: 4 },
        ]
      },
      {
        slug: 'terms',
        title: 'Terms of Service',
        metaTitle: 'Terms of Service - TechTooTalk',
        sections: [
          { title: 'Acceptance of Terms', content: 'By accessing and using TechTooTalk, you accept and agree to be bound by the terms and provision of this agreement.', type: 'text', order: 1 },
          { title: 'Use License', content: 'Permission is granted to temporarily download one copy of the materials on TechTooTalk for personal, non-commercial transitory viewing only.', type: 'text', order: 2 },
        ]
      },
      {
        slug: 'about',
        title: 'About Us',
        metaTitle: 'About TechTooTalk - Learn Programming Online',
        heroTitle: 'Empowering Developers Worldwide',
        heroSubtitle: 'TechTooTalk is a leading online learning platform dedicated to helping developers master new technologies.',
        sections: [
          { title: 'Our Mission', content: 'To make quality programming education accessible to everyone, everywhere.', type: 'text', order: 1 },
          { title: 'Our Story', content: 'Founded in 2024, TechTooTalk has grown from a small tutorial blog to a comprehensive learning platform serving thousands of developers worldwide.', type: 'text', order: 2 },
          { title: 'What We Offer', type: 'list', items: ['500+ Free Tutorials', 'Interactive Coding Exercises', 'AI-Powered Learning Assistant', 'Industry-Recognized Certificates'], order: 3 },
        ]
      },
      {
        slug: 'contact',
        title: 'Contact Us',
        metaTitle: 'Contact TechTooTalk - Get in Touch',
        heroTitle: 'Get in Touch',
        heroSubtitle: 'Have questions? We\'d love to hear from you.',
        sections: [
          { title: 'Email', content: 'support@techtootalk.com', type: 'text', order: 1 },
          { title: 'Response Time', content: 'We typically respond within 24-48 hours.', type: 'text', order: 2 },
        ]
      }
    ];

    await CmsPage.deleteMany({});
    await CmsPage.insertMany(cmsPages);
    console.log('✅ CMS Pages seeded');

    console.log('\n🎉 All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
