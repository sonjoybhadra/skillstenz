/**
 * Roadmaps Seeder
 * Seeds career development roadmaps with steps and topics
 * Schema: { slug, title, name, description, icon, category, duration, difficulty, steps, isActive, isFeatured, views }
 * category enum: ['frontend', 'backend', 'mobile', 'devops', 'data', 'other']
 * difficulty enum: ['beginner', 'intermediate', 'advanced']
 */

const Roadmap = require('../../src/models/Roadmap');

const roadmaps = [
  {
    title: 'Frontend Developer Roadmap',
    slug: 'frontend-developer',
    name: 'Frontend Developer',
    description: 'Complete roadmap to become a frontend developer in 2024. Learn HTML, CSS, JavaScript, React, and modern web development practices.',
    category: 'frontend',
    difficulty: 'beginner',
    duration: '6-9 months',
    isActive: true,
    isFeatured: true,
    icon: '🎨',
    steps: [
      {
        title: 'Internet Basics',
        order: 1,
        duration: '1 week',
        topics: ['How the Internet Works', 'HTTP/HTTPS', 'DNS', 'Browsers', 'Web Hosting']
      },
      {
        title: 'HTML Fundamentals',
        order: 2,
        duration: '2 weeks',
        topics: ['HTML Basics', 'Semantic HTML', 'Forms', 'Accessibility', 'SEO Basics']
      },
      {
        title: 'CSS Fundamentals',
        order: 3,
        duration: '3 weeks',
        topics: ['CSS Basics', 'Box Model', 'Flexbox', 'CSS Grid', 'Responsive Design', 'CSS Variables']
      },
      {
        title: 'JavaScript Basics',
        order: 4,
        duration: '4 weeks',
        topics: ['Variables & Data Types', 'Functions', 'DOM Manipulation', 'Events', 'ES6+ Features']
      },
      {
        title: 'Version Control',
        order: 5,
        duration: '1 week',
        topics: ['Git Basics', 'GitHub', 'Branching', 'Pull Requests', 'Git Workflow']
      },
      {
        title: 'CSS Frameworks',
        order: 6,
        duration: '2 weeks',
        topics: ['Tailwind CSS', 'Bootstrap', 'CSS-in-JS', 'Styled Components']
      },
      {
        title: 'JavaScript Frameworks',
        order: 7,
        duration: '6 weeks',
        topics: ['React Fundamentals', 'Components', 'State Management', 'Hooks', 'React Router']
      },
      {
        title: 'Build Tools',
        order: 8,
        duration: '2 weeks',
        topics: ['NPM', 'Vite', 'Webpack', 'ESLint', 'Prettier']
      },
      {
        title: 'Testing',
        order: 9,
        duration: '2 weeks',
        topics: ['Unit Testing', 'Jest', 'React Testing Library', 'E2E Testing']
      },
      {
        title: 'TypeScript',
        order: 10,
        duration: '3 weeks',
        topics: ['TypeScript Basics', 'Types & Interfaces', 'Generics', 'TypeScript with React']
      }
    ]
  },
  {
    title: 'Backend Developer Roadmap',
    slug: 'backend-developer',
    name: 'Backend Developer',
    description: 'Complete roadmap to become a backend developer. Learn server-side programming, databases, APIs, and system design.',
    category: 'backend',
    difficulty: 'intermediate',
    duration: '8-12 months',
    isActive: true,
    isFeatured: true,
    icon: '⚙️',
    steps: [
      {
        title: 'Programming Language',
        order: 1,
        duration: '4 weeks',
        topics: ['JavaScript/Node.js', 'Python', 'Java', 'Go', 'Choose One']
      },
      {
        title: 'Version Control',
        order: 2,
        duration: '1 week',
        topics: ['Git Fundamentals', 'GitHub/GitLab', 'Branching Strategies']
      },
      {
        title: 'Databases',
        order: 3,
        duration: '4 weeks',
        topics: ['SQL Basics', 'PostgreSQL', 'MongoDB', 'ORMs', 'Database Design']
      },
      {
        title: 'APIs',
        order: 4,
        duration: '3 weeks',
        topics: ['REST APIs', 'GraphQL', 'API Design', 'Authentication', 'Rate Limiting']
      },
      {
        title: 'Web Frameworks',
        order: 5,
        duration: '4 weeks',
        topics: ['Express.js', 'Django', 'Spring Boot', 'FastAPI', 'NestJS']
      },
      {
        title: 'Authentication & Security',
        order: 6,
        duration: '3 weeks',
        topics: ['JWT', 'OAuth', 'Session Management', 'HTTPS', 'Security Best Practices']
      },
      {
        title: 'Caching',
        order: 7,
        duration: '2 weeks',
        topics: ['Redis', 'Memcached', 'CDN', 'Cache Strategies']
      },
      {
        title: 'Testing',
        order: 8,
        duration: '2 weeks',
        topics: ['Unit Testing', 'Integration Testing', 'TDD', 'Mocking']
      },
      {
        title: 'Containerization',
        order: 9,
        duration: '2 weeks',
        topics: ['Docker', 'Docker Compose', 'Container Registries']
      },
      {
        title: 'CI/CD',
        order: 10,
        duration: '2 weeks',
        topics: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'Deployment Strategies']
      },
      {
        title: 'Cloud Services',
        order: 11,
        duration: '4 weeks',
        topics: ['AWS', 'Azure', 'GCP', 'Serverless', 'Cloud Architecture']
      }
    ]
  },
  {
    title: 'Full Stack Developer Roadmap',
    slug: 'fullstack-developer',
    name: 'Full Stack Developer',
    description: 'Comprehensive roadmap to become a full stack developer. Master both frontend and backend technologies.',
    category: 'frontend',
    difficulty: 'intermediate',
    duration: '12-18 months',
    isActive: true,
    isFeatured: true,
    icon: '🚀',
    steps: [
      {
        title: 'HTML & CSS',
        order: 1,
        duration: '3 weeks',
        topics: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Responsive Design']
      },
      {
        title: 'JavaScript',
        order: 2,
        duration: '6 weeks',
        topics: ['ES6+', 'DOM', 'Async/Await', 'Fetch API', 'Error Handling']
      },
      {
        title: 'React',
        order: 3,
        duration: '6 weeks',
        topics: ['Components', 'Hooks', 'State Management', 'React Router', 'Next.js']
      },
      {
        title: 'Node.js',
        order: 4,
        duration: '4 weeks',
        topics: ['Node Fundamentals', 'Express.js', 'NPM', 'File System', 'Streams']
      },
      {
        title: 'Databases',
        order: 5,
        duration: '4 weeks',
        topics: ['MongoDB', 'PostgreSQL', 'Mongoose', 'Prisma', 'SQL']
      },
      {
        title: 'Authentication',
        order: 6,
        duration: '2 weeks',
        topics: ['JWT', 'OAuth', 'Sessions', 'Password Hashing']
      },
      {
        title: 'TypeScript',
        order: 7,
        duration: '3 weeks',
        topics: ['Types', 'Interfaces', 'Generics', 'TypeScript with React/Node']
      },
      {
        title: 'Testing',
        order: 8,
        duration: '3 weeks',
        topics: ['Jest', 'React Testing Library', 'API Testing', 'E2E Testing']
      },
      {
        title: 'DevOps Basics',
        order: 9,
        duration: '3 weeks',
        topics: ['Docker', 'CI/CD', 'Cloud Deployment', 'Monitoring']
      }
    ]
  },
  {
    title: 'DevOps Engineer Roadmap',
    slug: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Learn DevOps practices, CI/CD, cloud platforms, containerization, and infrastructure as code.',
    category: 'devops',
    difficulty: 'advanced',
    duration: '10-14 months',
    isActive: true,
    isFeatured: true,
    icon: '🔧',
    steps: [
      {
        title: 'Linux Fundamentals',
        order: 1,
        duration: '4 weeks',
        topics: ['Linux Commands', 'File System', 'Permissions', 'Shell Scripting', 'Process Management']
      },
      {
        title: 'Networking',
        order: 2,
        duration: '3 weeks',
        topics: ['TCP/IP', 'DNS', 'HTTP', 'Load Balancing', 'Firewalls']
      },
      {
        title: 'Version Control',
        order: 3,
        duration: '1 week',
        topics: ['Git Flow', 'Monorepos', 'Branch Strategies', 'Code Review']
      },
      {
        title: 'Containerization',
        order: 4,
        duration: '4 weeks',
        topics: ['Docker', 'Docker Compose', 'Container Best Practices', 'Multi-stage Builds']
      },
      {
        title: 'Container Orchestration',
        order: 5,
        duration: '6 weeks',
        topics: ['Kubernetes', 'Helm', 'Service Mesh', 'Operators']
      },
      {
        title: 'CI/CD Pipelines',
        order: 6,
        duration: '4 weeks',
        topics: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'ArgoCD']
      },
      {
        title: 'Infrastructure as Code',
        order: 7,
        duration: '4 weeks',
        topics: ['Terraform', 'Ansible', 'CloudFormation', 'Pulumi']
      },
      {
        title: 'Cloud Platforms',
        order: 8,
        duration: '6 weeks',
        topics: ['AWS', 'Azure', 'GCP', 'Multi-cloud Strategies']
      },
      {
        title: 'Monitoring & Logging',
        order: 9,
        duration: '3 weeks',
        topics: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog']
      },
      {
        title: 'Security',
        order: 10,
        duration: '3 weeks',
        topics: ['Security Scanning', 'Secrets Management', 'Compliance', 'Zero Trust']
      }
    ]
  },
  {
    title: 'Data Scientist Roadmap',
    slug: 'data-scientist',
    name: 'Data Scientist',
    description: 'Complete roadmap to become a data scientist. Learn statistics, machine learning, and data analysis.',
    category: 'data',
    difficulty: 'intermediate',
    duration: '12-18 months',
    isActive: true,
    isFeatured: true,
    icon: '📊',
    steps: [
      {
        title: 'Python Programming',
        order: 1,
        duration: '4 weeks',
        topics: ['Python Basics', 'Data Structures', 'OOP', 'File Handling']
      },
      {
        title: 'Mathematics & Statistics',
        order: 2,
        duration: '6 weeks',
        topics: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics', 'Distributions']
      },
      {
        title: 'Data Manipulation',
        order: 3,
        duration: '4 weeks',
        topics: ['NumPy', 'Pandas', 'Data Cleaning', 'Data Transformation']
      },
      {
        title: 'Data Visualization',
        order: 4,
        duration: '3 weeks',
        topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboard Creation']
      },
      {
        title: 'SQL & Databases',
        order: 5,
        duration: '3 weeks',
        topics: ['SQL Fundamentals', 'Joins', 'Aggregations', 'Database Design']
      },
      {
        title: 'Machine Learning',
        order: 6,
        duration: '8 weeks',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Scikit-learn', 'Model Evaluation']
      },
      {
        title: 'Deep Learning',
        order: 7,
        duration: '6 weeks',
        topics: ['Neural Networks', 'TensorFlow', 'PyTorch', 'CNNs', 'RNNs']
      },
      {
        title: 'Feature Engineering',
        order: 8,
        duration: '3 weeks',
        topics: ['Feature Selection', 'Feature Creation', 'Dimensionality Reduction']
      },
      {
        title: 'Model Deployment',
        order: 9,
        duration: '3 weeks',
        topics: ['Flask/FastAPI', 'Docker', 'MLflow', 'Cloud Deployment']
      }
    ]
  },
  {
    title: 'Machine Learning Engineer Roadmap',
    slug: 'ml-engineer',
    name: 'Machine Learning Engineer',
    description: 'Roadmap to become an ML engineer. Focus on building and deploying ML systems at scale.',
    category: 'data',
    difficulty: 'advanced',
    duration: '12-18 months',
    isActive: true,
    isFeatured: true,
    icon: '🤖',
    steps: [
      {
        title: 'Programming Proficiency',
        order: 1,
        duration: '4 weeks',
        topics: ['Python Advanced', 'Data Structures', 'Algorithms', 'OOP']
      },
      {
        title: 'Mathematics for ML',
        order: 2,
        duration: '6 weeks',
        topics: ['Linear Algebra', 'Calculus', 'Probability', 'Optimization']
      },
      {
        title: 'Machine Learning Fundamentals',
        order: 3,
        duration: '8 weeks',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Selection', 'Hyperparameter Tuning']
      },
      {
        title: 'Deep Learning',
        order: 4,
        duration: '8 weeks',
        topics: ['Neural Networks', 'CNNs', 'RNNs', 'Transformers', 'Attention Mechanism']
      },
      {
        title: 'ML Frameworks',
        order: 5,
        duration: '4 weeks',
        topics: ['TensorFlow', 'PyTorch', 'Keras', 'Hugging Face']
      },
      {
        title: 'MLOps',
        order: 6,
        duration: '6 weeks',
        topics: ['Model Serving', 'ML Pipelines', 'Experiment Tracking', 'Model Monitoring']
      },
      {
        title: 'Cloud ML Services',
        order: 7,
        duration: '4 weeks',
        topics: ['AWS SageMaker', 'Google AI Platform', 'Azure ML', 'Vertex AI']
      },
      {
        title: 'System Design for ML',
        order: 8,
        duration: '4 weeks',
        topics: ['ML System Design', 'Data Pipelines', 'Feature Stores', 'A/B Testing']
      }
    ]
  },
  {
    title: 'Mobile App Developer Roadmap',
    slug: 'mobile-developer',
    name: 'Mobile App Developer',
    description: 'Learn to build mobile applications for iOS and Android using modern frameworks.',
    category: 'mobile',
    difficulty: 'intermediate',
    duration: '8-12 months',
    isActive: true,
    isFeatured: false,
    icon: '📱',
    steps: [
      {
        title: 'Programming Fundamentals',
        order: 1,
        duration: '4 weeks',
        topics: ['Variables', 'Control Flow', 'Functions', 'OOP']
      },
      {
        title: 'Cross-Platform Development',
        order: 2,
        duration: '8 weeks',
        topics: ['React Native', 'Flutter', 'Framework Comparison']
      },
      {
        title: 'UI/UX for Mobile',
        order: 3,
        duration: '3 weeks',
        topics: ['Mobile UI Patterns', 'Navigation', 'Gestures', 'Accessibility']
      },
      {
        title: 'State Management',
        order: 4,
        duration: '3 weeks',
        topics: ['Redux', 'Provider', 'Riverpod', 'State Patterns']
      },
      {
        title: 'APIs & Networking',
        order: 5,
        duration: '3 weeks',
        topics: ['REST APIs', 'GraphQL', 'WebSockets', 'Offline Support']
      },
      {
        title: 'Local Storage',
        order: 6,
        duration: '2 weeks',
        topics: ['SQLite', 'Async Storage', 'Secure Storage']
      },
      {
        title: 'Native Features',
        order: 7,
        duration: '3 weeks',
        topics: ['Camera', 'Location', 'Push Notifications', 'Biometrics']
      },
      {
        title: 'Testing & Debugging',
        order: 8,
        duration: '2 weeks',
        topics: ['Unit Testing', 'Widget Testing', 'Integration Testing']
      },
      {
        title: 'App Store Deployment',
        order: 9,
        duration: '2 weeks',
        topics: ['App Store', 'Google Play', 'Code Signing', 'CI/CD']
      }
    ]
  },
  {
    title: 'Cybersecurity Roadmap',
    slug: 'cybersecurity',
    name: 'Cybersecurity Specialist',
    description: 'Learn to protect systems and networks from cyber threats. Master security tools and techniques.',
    category: 'other',
    difficulty: 'advanced',
    duration: '12-18 months',
    isActive: true,
    isFeatured: false,
    icon: '🔐',
    steps: [
      {
        title: 'Networking Fundamentals',
        order: 1,
        duration: '4 weeks',
        topics: ['OSI Model', 'TCP/IP', 'Protocols', 'Network Devices']
      },
      {
        title: 'Linux Security',
        order: 2,
        duration: '4 weeks',
        topics: ['Linux Administration', 'Permissions', 'Firewalls', 'SELinux']
      },
      {
        title: 'Security Fundamentals',
        order: 3,
        duration: '4 weeks',
        topics: ['CIA Triad', 'Authentication', 'Encryption', 'Security Policies']
      },
      {
        title: 'Web Security',
        order: 4,
        duration: '4 weeks',
        topics: ['OWASP Top 10', 'XSS', 'SQL Injection', 'CSRF']
      },
      {
        title: 'Penetration Testing',
        order: 5,
        duration: '6 weeks',
        topics: ['Reconnaissance', 'Scanning', 'Exploitation', 'Post-Exploitation']
      },
      {
        title: 'Security Tools',
        order: 6,
        duration: '4 weeks',
        topics: ['Nmap', 'Wireshark', 'Metasploit', 'Burp Suite']
      },
      {
        title: 'Incident Response',
        order: 7,
        duration: '3 weeks',
        topics: ['IR Process', 'Forensics', 'Malware Analysis', 'Recovery']
      },
      {
        title: 'Cloud Security',
        order: 8,
        duration: '4 weeks',
        topics: ['Cloud Security', 'IAM', 'Container Security', 'Compliance']
      }
    ]
  },
  {
    title: 'Blockchain Developer Roadmap',
    slug: 'blockchain-developer',
    name: 'Blockchain Developer',
    description: 'Learn to build decentralized applications and smart contracts on blockchain platforms.',
    category: 'other',
    difficulty: 'advanced',
    duration: '8-12 months',
    isActive: true,
    isFeatured: false,
    icon: '⛓️',
    steps: [
      {
        title: 'Blockchain Fundamentals',
        order: 1,
        duration: '3 weeks',
        topics: ['Distributed Ledgers', 'Consensus Mechanisms', 'Cryptography', 'Hash Functions']
      },
      {
        title: 'Ethereum Basics',
        order: 2,
        duration: '3 weeks',
        topics: ['Ethereum Architecture', 'Gas', 'EVM', 'Accounts']
      },
      {
        title: 'Solidity Programming',
        order: 3,
        duration: '6 weeks',
        topics: ['Solidity Basics', 'Data Types', 'Functions', 'Modifiers', 'Events']
      },
      {
        title: 'Smart Contract Security',
        order: 4,
        duration: '4 weeks',
        topics: ['Common Vulnerabilities', 'Auditing', 'Testing', 'Best Practices']
      },
      {
        title: 'DApp Development',
        order: 5,
        duration: '6 weeks',
        topics: ['Web3.js', 'Ethers.js', 'Frontend Integration', 'Wallet Connection']
      },
      {
        title: 'Development Tools',
        order: 6,
        duration: '3 weeks',
        topics: ['Hardhat', 'Truffle', 'Ganache', 'OpenZeppelin']
      },
      {
        title: 'DeFi Protocols',
        order: 7,
        duration: '4 weeks',
        topics: ['AMMs', 'Lending', 'Yield Farming', 'Oracles']
      },
      {
        title: 'NFTs & Token Standards',
        order: 8,
        duration: '3 weeks',
        topics: ['ERC-20', 'ERC-721', 'ERC-1155', 'NFT Marketplaces']
      }
    ]
  },
  {
    title: 'AI Engineer Roadmap',
    slug: 'ai-engineer',
    name: 'AI Engineer',
    description: 'Build and deploy AI applications including LLMs, chatbots, and AI-powered products.',
    category: 'data',
    difficulty: 'advanced',
    duration: '10-14 months',
    isActive: true,
    isFeatured: true,
    icon: '🧠',
    steps: [
      {
        title: 'Python Mastery',
        order: 1,
        duration: '3 weeks',
        topics: ['Advanced Python', 'Async Programming', 'Type Hints', 'Best Practices']
      },
      {
        title: 'Machine Learning Foundations',
        order: 2,
        duration: '6 weeks',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Evaluation Metrics', 'Feature Engineering']
      },
      {
        title: 'Deep Learning',
        order: 3,
        duration: '6 weeks',
        topics: ['Neural Networks', 'CNNs', 'RNNs', 'Transformers']
      },
      {
        title: 'Natural Language Processing',
        order: 4,
        duration: '4 weeks',
        topics: ['Text Processing', 'Word Embeddings', 'Sequence Models', 'BERT/GPT']
      },
      {
        title: 'LLMs & Prompt Engineering',
        order: 5,
        duration: '4 weeks',
        topics: ['OpenAI API', 'Prompt Engineering', 'Fine-tuning', 'RAG']
      },
      {
        title: 'LangChain & AI Frameworks',
        order: 6,
        duration: '4 weeks',
        topics: ['LangChain', 'Agents', 'Chains', 'Memory', 'Tools']
      },
      {
        title: 'Vector Databases',
        order: 7,
        duration: '2 weeks',
        topics: ['Embeddings', 'Pinecone', 'Weaviate', 'ChromaDB']
      },
      {
        title: 'AI Deployment',
        order: 8,
        duration: '4 weeks',
        topics: ['FastAPI', 'Docker', 'GPU Deployment', 'Model Optimization']
      }
    ]
  }
];

async function seedRoadmaps() {
  try {
    console.log('🗺️  Seeding Roadmaps...');
    
    // Clear existing roadmaps
    await Roadmap.deleteMany({});
    
    // Insert new roadmaps
    const result = await Roadmap.insertMany(roadmaps);
    
    console.log(`✅ Seeded ${result.length} roadmaps with ${result.reduce((sum, r) => sum + r.steps.length, 0)} total steps`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding roadmaps:', error.message);
    throw error;
  }
}

module.exports = { seedRoadmaps, roadmaps };
