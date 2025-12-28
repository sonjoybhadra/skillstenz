/**
 * Technologies Seeder
 * Seeds programming languages and frameworks
 */

const Technology = require('../../src/modules/technologies/Technology');
const TechnologyCategory = require('../../src/modules/technologies/TechnologyCategory');

const getTechnologies = (categoryMap) => [
  // Programming Languages
  {
    name: 'Python',
    slug: 'python',
    description: 'Python is a versatile, high-level programming language known for its readability and wide range of applications from web development to data science and AI.',
    shortDescription: 'Versatile language for web, data science and AI',
    icon: '🐍',
    color: '#3776AB',
    category: categoryMap['programming-languages'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 1,
    tags: ['programming', 'scripting', 'data-science', 'machine-learning', 'web']
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript is the programming language of the web, essential for frontend development and increasingly popular for backend with Node.js.',
    shortDescription: 'The language of the web for interactive applications',
    icon: '🟨',
    color: '#F7DF1E',
    category: categoryMap['programming-languages'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 2,
    tags: ['programming', 'web', 'frontend', 'backend', 'nodejs']
  },
  {
    name: 'Java',
    slug: 'java',
    description: 'Java is a powerful, object-oriented programming language used for enterprise applications, Android development, and large-scale systems.',
    shortDescription: 'Enterprise-grade language for robust applications',
    icon: '☕',
    color: '#007396',
    category: categoryMap['programming-languages'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 3,
    tags: ['programming', 'enterprise', 'android', 'spring', 'oop']
  },
  {
    name: 'C++',
    slug: 'cpp',
    description: 'C++ is a powerful systems programming language used for game development, operating systems, and performance-critical applications.',
    shortDescription: 'High-performance language for systems programming',
    icon: '⚡',
    color: '#00599C',
    category: categoryMap['programming-languages'],
    difficulty: 'advanced',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 4,
    tags: ['programming', 'systems', 'games', 'performance', 'competitive']
  },
  {
    name: 'C',
    slug: 'c',
    description: 'C is the foundational programming language that powers operating systems, embedded systems, and serves as the basis for many modern languages.',
    shortDescription: 'Foundation language for systems and embedded development',
    icon: '🔧',
    color: '#A8B9CC',
    category: categoryMap['programming-languages'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: false,
    isPublished: true,
    order: 5,
    tags: ['programming', 'systems', 'embedded', 'low-level']
  },
  {
    name: 'Go',
    slug: 'go',
    description: 'Go (Golang) is a modern programming language by Google, designed for simplicity, efficiency, and excellent concurrency support.',
    shortDescription: 'Modern language for scalable cloud applications',
    icon: '🔵',
    color: '#00ADD8',
    category: categoryMap['programming-languages'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 6,
    tags: ['programming', 'cloud', 'concurrency', 'microservices', 'backend']
  },
  {
    name: 'Rust',
    slug: 'rust',
    description: 'Rust is a systems programming language focused on safety, speed, and concurrency without a garbage collector.',
    shortDescription: 'Safe systems programming with zero-cost abstractions',
    icon: '🦀',
    color: '#DEA584',
    category: categoryMap['programming-languages'],
    difficulty: 'advanced',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 7,
    tags: ['programming', 'systems', 'safety', 'performance', 'webassembly']
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript, adding optional static typing and class-based OOP.',
    shortDescription: 'JavaScript with types for large-scale applications',
    icon: '🔷',
    color: '#3178C6',
    category: categoryMap['programming-languages'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 8,
    tags: ['programming', 'web', 'frontend', 'typescript', 'javascript']
  },
  {
    name: 'PHP',
    slug: 'php',
    description: 'PHP is a popular server-side scripting language designed for web development and powers platforms like WordPress and Laravel.',
    shortDescription: 'Server-side language powering the web',
    icon: '🐘',
    color: '#777BB4',
    category: categoryMap['programming-languages'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: false,
    isPublished: true,
    order: 9,
    tags: ['programming', 'web', 'backend', 'wordpress', 'laravel']
  },
  {
    name: 'Ruby',
    slug: 'ruby',
    description: 'Ruby is a dynamic, elegant programming language focused on simplicity and productivity, famous for the Ruby on Rails framework.',
    shortDescription: 'Elegant language for rapid web development',
    icon: '💎',
    color: '#CC342D',
    category: categoryMap['programming-languages'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: false,
    isPublished: true,
    order: 10,
    tags: ['programming', 'web', 'rails', 'scripting']
  },
  {
    name: 'Swift',
    slug: 'swift',
    description: 'Swift is Apple\'s modern programming language for iOS, macOS, watchOS, and tvOS development with safety and performance in mind.',
    shortDescription: 'Apple\'s modern language for iOS development',
    icon: '🍎',
    color: '#FA7343',
    category: categoryMap['mobile-development'],
    difficulty: 'intermediate',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 11,
    tags: ['programming', 'mobile', 'ios', 'apple', 'macos']
  },
  {
    name: 'Kotlin',
    slug: 'kotlin',
    description: 'Kotlin is a modern programming language for Android development and JVM, offering concise syntax and null safety.',
    shortDescription: 'Modern language for Android and JVM development',
    icon: '🟣',
    color: '#7F52FF',
    category: categoryMap['mobile-development'],
    difficulty: 'intermediate',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 12,
    tags: ['programming', 'mobile', 'android', 'jvm']
  },
  
  // Web Development
  {
    name: 'React',
    slug: 'react',
    description: 'React is a JavaScript library for building user interfaces, maintained by Meta, known for its component-based architecture.',
    shortDescription: 'Popular library for building modern UIs',
    icon: '⚛️',
    color: '#61DAFB',
    category: categoryMap['web-development'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 13,
    tags: ['frontend', 'ui', 'components', 'spa', 'meta']
  },
  {
    name: 'Next.js',
    slug: 'nextjs',
    description: 'Next.js is a React framework for production that enables server-side rendering, static site generation, and API routes.',
    shortDescription: 'React framework for production applications',
    icon: '▲',
    color: '#000000',
    category: categoryMap['web-development'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 14,
    tags: ['frontend', 'react', 'ssr', 'fullstack', 'vercel']
  },
  {
    name: 'Vue.js',
    slug: 'vuejs',
    description: 'Vue.js is a progressive JavaScript framework for building user interfaces with an approachable and versatile design.',
    shortDescription: 'Progressive framework for building UIs',
    icon: '💚',
    color: '#4FC08D',
    category: categoryMap['web-development'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 15,
    tags: ['frontend', 'ui', 'components', 'progressive']
  },
  {
    name: 'Angular',
    slug: 'angular',
    description: 'Angular is a comprehensive TypeScript-based framework by Google for building scalable enterprise web applications.',
    shortDescription: 'Enterprise-ready framework by Google',
    icon: '🅰️',
    color: '#DD0031',
    category: categoryMap['web-development'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 16,
    tags: ['frontend', 'typescript', 'enterprise', 'google']
  },
  {
    name: 'Node.js',
    slug: 'nodejs',
    description: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine, enabling server-side JavaScript and building scalable network applications.',
    shortDescription: 'JavaScript runtime for server-side development',
    icon: '🟢',
    color: '#339933',
    category: categoryMap['web-development'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 17,
    tags: ['backend', 'javascript', 'runtime', 'api', 'server']
  },
  {
    name: 'Express.js',
    slug: 'expressjs',
    description: 'Express.js is a minimal and flexible Node.js web application framework providing a robust set of features for web and mobile apps.',
    shortDescription: 'Fast, minimalist web framework for Node.js',
    icon: '🚂',
    color: '#000000',
    category: categoryMap['web-development'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: false,
    isPublished: true,
    order: 18,
    tags: ['backend', 'nodejs', 'api', 'rest', 'server']
  },
  {
    name: 'Django',
    slug: 'django',
    description: 'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.',
    shortDescription: 'High-level Python web framework',
    icon: '🎸',
    color: '#092E20',
    category: categoryMap['web-development'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 19,
    tags: ['backend', 'python', 'fullstack', 'orm', 'rest']
  },
  {
    name: 'Flask',
    slug: 'flask',
    description: 'Flask is a lightweight Python web framework with minimal dependencies, perfect for microservices and small to medium applications.',
    shortDescription: 'Lightweight Python web framework',
    icon: '🧪',
    color: '#000000',
    category: categoryMap['web-development'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: false,
    isPublished: true,
    order: 20,
    tags: ['backend', 'python', 'microservices', 'api']
  },
  {
    name: 'Tailwind CSS',
    slug: 'tailwindcss',
    description: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.',
    shortDescription: 'Utility-first CSS framework',
    icon: '🎨',
    color: '#38B2AC',
    category: categoryMap['web-development'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 21,
    tags: ['frontend', 'css', 'styling', 'utility', 'design']
  },
  {
    name: 'HTML',
    slug: 'html',
    description: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications.',
    shortDescription: 'Foundation markup language of the web',
    icon: '📄',
    color: '#E34F26',
    category: categoryMap['web-development'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 22,
    tags: ['frontend', 'markup', 'web', 'basics']
  },
  {
    name: 'CSS',
    slug: 'css',
    description: 'CSS (Cascading Style Sheets) is used to style and layout web pages, controlling colors, fonts, and layouts.',
    shortDescription: 'Styling language for web design',
    icon: '🎨',
    color: '#1572B6',
    category: categoryMap['web-development'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 23,
    tags: ['frontend', 'styling', 'design', 'web', 'basics']
  },

  // AI & ML
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.',
    shortDescription: 'Build intelligent systems that learn from data',
    icon: '🧠',
    color: '#FF6B6B',
    category: categoryMap['artificial-intelligence'],
    difficulty: 'intermediate',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 24,
    tags: ['ai', 'ml', 'data-science', 'algorithms', 'models']
  },
  {
    name: 'Deep Learning',
    slug: 'deep-learning',
    description: 'Deep Learning uses neural networks with multiple layers to learn complex patterns in large amounts of data.',
    shortDescription: 'Neural networks for complex pattern recognition',
    icon: '🔮',
    color: '#9B59B6',
    category: categoryMap['artificial-intelligence'],
    difficulty: 'advanced',
    accessType: 'paid',
    featured: true,
    isPublished: true,
    order: 25,
    tags: ['ai', 'neural-networks', 'tensorflow', 'pytorch', 'computer-vision']
  },
  {
    name: 'TensorFlow',
    slug: 'tensorflow',
    description: 'TensorFlow is an open-source machine learning framework developed by Google for building and deploying ML models.',
    shortDescription: 'Google\'s ML framework for production',
    icon: '🔶',
    color: '#FF6F00',
    category: categoryMap['artificial-intelligence'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 26,
    tags: ['ai', 'ml', 'framework', 'google', 'deep-learning']
  },
  {
    name: 'PyTorch',
    slug: 'pytorch',
    description: 'PyTorch is an open-source machine learning library developed by Meta, known for its flexibility and dynamic computation graphs.',
    shortDescription: 'Flexible ML framework for research',
    icon: '🔥',
    color: '#EE4C2C',
    category: categoryMap['artificial-intelligence'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 27,
    tags: ['ai', 'ml', 'framework', 'meta', 'deep-learning']
  },
  {
    name: 'Natural Language Processing',
    slug: 'nlp',
    description: 'NLP enables computers to understand, interpret, and generate human language, powering chatbots, translation, and sentiment analysis.',
    shortDescription: 'AI for understanding human language',
    icon: '💬',
    color: '#2ECC71',
    category: categoryMap['artificial-intelligence'],
    difficulty: 'advanced',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 28,
    tags: ['ai', 'nlp', 'text', 'language', 'transformers']
  },
  {
    name: 'Computer Vision',
    slug: 'computer-vision',
    description: 'Computer Vision enables machines to interpret and understand visual information from the world through images and videos.',
    shortDescription: 'AI for image and video understanding',
    icon: '👁️',
    color: '#3498DB',
    category: categoryMap['artificial-intelligence'],
    difficulty: 'advanced',
    accessType: 'mixed',
    featured: false,
    isPublished: true,
    order: 29,
    tags: ['ai', 'cv', 'images', 'detection', 'recognition']
  },
  {
    name: 'LangChain',
    slug: 'langchain',
    description: 'LangChain is a framework for developing applications powered by language models, enabling agents and complex AI workflows.',
    shortDescription: 'Framework for LLM-powered applications',
    icon: '🦜',
    color: '#1C3C3C',
    category: categoryMap['artificial-intelligence'],
    difficulty: 'intermediate',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 30,
    tags: ['ai', 'llm', 'agents', 'rag', 'chatbots']
  },

  // Data Science
  {
    name: 'Pandas',
    slug: 'pandas',
    description: 'Pandas is a fast, powerful, and flexible Python library for data manipulation and analysis with DataFrames.',
    shortDescription: 'Python library for data manipulation',
    icon: '🐼',
    color: '#150458',
    category: categoryMap['data-science'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 31,
    tags: ['python', 'data', 'analysis', 'dataframes', 'manipulation']
  },
  {
    name: 'NumPy',
    slug: 'numpy',
    description: 'NumPy is the fundamental package for scientific computing in Python, providing support for large multi-dimensional arrays and matrices.',
    shortDescription: 'Scientific computing with Python',
    icon: '🔢',
    color: '#013243',
    category: categoryMap['data-science'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 32,
    tags: ['python', 'math', 'arrays', 'scientific', 'computing']
  },
  {
    name: 'SQL',
    slug: 'sql',
    description: 'SQL (Structured Query Language) is the standard language for managing and querying relational databases.',
    shortDescription: 'Query language for databases',
    icon: '📊',
    color: '#336791',
    category: categoryMap['database'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 33,
    tags: ['database', 'query', 'data', 'relational', 'basics']
  },
  {
    name: 'MongoDB',
    slug: 'mongodb',
    description: 'MongoDB is a popular NoSQL database that uses a document-oriented data model and is designed for scalability.',
    shortDescription: 'NoSQL document database',
    icon: '🍃',
    color: '#47A248',
    category: categoryMap['database'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 34,
    tags: ['database', 'nosql', 'documents', 'scalable']
  },
  {
    name: 'PostgreSQL',
    slug: 'postgresql',
    description: 'PostgreSQL is a powerful, open-source object-relational database system with over 30 years of active development.',
    shortDescription: 'Advanced open-source SQL database',
    icon: '🐘',
    color: '#4169E1',
    category: categoryMap['database'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 35,
    tags: ['database', 'sql', 'relational', 'enterprise']
  },
  {
    name: 'Redis',
    slug: 'redis',
    description: 'Redis is an in-memory data structure store used as a database, cache, message broker, and queue.',
    shortDescription: 'In-memory data store and cache',
    icon: '🔴',
    color: '#DC382D',
    category: categoryMap['database'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: false,
    isPublished: true,
    order: 36,
    tags: ['database', 'cache', 'in-memory', 'nosql']
  },

  // DevOps & Cloud
  {
    name: 'Docker',
    slug: 'docker',
    description: 'Docker is a platform for developing, shipping, and running applications in containers for consistent environments.',
    shortDescription: 'Containerization platform for apps',
    icon: '🐳',
    color: '#2496ED',
    category: categoryMap['devops-cloud'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 37,
    tags: ['devops', 'containers', 'deployment', 'virtualization']
  },
  {
    name: 'Kubernetes',
    slug: 'kubernetes',
    description: 'Kubernetes is an open-source container orchestration platform for automating deployment, scaling, and management.',
    shortDescription: 'Container orchestration at scale',
    icon: '⎈',
    color: '#326CE5',
    category: categoryMap['devops-cloud'],
    difficulty: 'advanced',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 38,
    tags: ['devops', 'containers', 'orchestration', 'scaling']
  },
  {
    name: 'AWS',
    slug: 'aws',
    description: 'Amazon Web Services is the world\'s leading cloud platform offering computing power, storage, and various cloud services.',
    shortDescription: 'Amazon\'s comprehensive cloud platform',
    icon: '☁️',
    color: '#FF9900',
    category: categoryMap['devops-cloud'],
    difficulty: 'intermediate',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 39,
    tags: ['cloud', 'aws', 'services', 'infrastructure']
  },
  {
    name: 'Git',
    slug: 'git',
    description: 'Git is a distributed version control system for tracking changes in source code during software development.',
    shortDescription: 'Version control for developers',
    icon: '📚',
    color: '#F05032',
    category: categoryMap['tools-utilities'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 40,
    tags: ['vcs', 'version-control', 'collaboration', 'basics']
  },
  {
    name: 'Linux',
    slug: 'linux',
    description: 'Linux is an open-source operating system kernel used in servers, embedded systems, and development environments.',
    shortDescription: 'Open-source operating system',
    icon: '🐧',
    color: '#FCC624',
    category: categoryMap['operating-systems'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 41,
    tags: ['os', 'server', 'command-line', 'administration']
  },
  {
    name: 'Bash',
    slug: 'bash',
    description: 'Bash is a Unix shell and command language used for task automation and system administration.',
    shortDescription: 'Unix shell for automation',
    icon: '💻',
    color: '#4EAA25',
    category: categoryMap['tools-utilities'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: false,
    isPublished: true,
    order: 42,
    tags: ['shell', 'scripting', 'automation', 'command-line']
  },

  // Mobile Development
  {
    name: 'React Native',
    slug: 'react-native',
    description: 'React Native is a framework for building native mobile apps using React and JavaScript.',
    shortDescription: 'Cross-platform mobile with React',
    icon: '📱',
    color: '#61DAFB',
    category: categoryMap['mobile-development'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 43,
    tags: ['mobile', 'cross-platform', 'react', 'ios', 'android']
  },
  {
    name: 'Flutter',
    slug: 'flutter',
    description: 'Flutter is Google\'s UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop.',
    shortDescription: 'Google\'s cross-platform UI toolkit',
    icon: '🦋',
    color: '#02569B',
    category: categoryMap['mobile-development'],
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    order: 44,
    tags: ['mobile', 'cross-platform', 'dart', 'google', 'ui']
  },

  // Game Development
  {
    name: 'Unity',
    slug: 'unity',
    description: 'Unity is a cross-platform game engine used to create 2D and 3D games and interactive experiences.',
    shortDescription: 'Popular cross-platform game engine',
    icon: '🎮',
    color: '#000000',
    category: categoryMap['game-development'],
    difficulty: 'intermediate',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 45,
    tags: ['games', 'engine', '3d', '2d', 'csharp']
  },
  {
    name: 'Unreal Engine',
    slug: 'unreal-engine',
    description: 'Unreal Engine is a powerful game engine by Epic Games used for high-fidelity games and real-time 3D applications.',
    shortDescription: 'AAA game development engine',
    icon: '🎯',
    color: '#0E1128',
    category: categoryMap['game-development'],
    difficulty: 'advanced',
    accessType: 'mixed',
    featured: false,
    isPublished: true,
    order: 46,
    tags: ['games', 'engine', '3d', 'unreal', 'cpp']
  },

  // Blockchain
  {
    name: 'Solidity',
    slug: 'solidity',
    description: 'Solidity is the programming language for writing smart contracts on Ethereum and other blockchain platforms.',
    shortDescription: 'Smart contract language for Ethereum',
    icon: '⟠',
    color: '#363636',
    category: categoryMap['blockchain'],
    difficulty: 'intermediate',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    order: 47,
    tags: ['blockchain', 'ethereum', 'smart-contracts', 'web3']
  },

  // Security
  {
    name: 'Ethical Hacking',
    slug: 'ethical-hacking',
    description: 'Ethical Hacking involves testing systems for security vulnerabilities to help organizations protect their data.',
    shortDescription: 'Security testing and penetration testing',
    icon: '🔐',
    color: '#00D4AA',
    category: categoryMap['cybersecurity'],
    difficulty: 'advanced',
    accessType: 'paid',
    featured: true,
    isPublished: true,
    order: 48,
    tags: ['security', 'hacking', 'penetration-testing', 'vulnerabilities']
  },

  // Data Visualization
  {
    name: 'Matplotlib',
    slug: 'matplotlib',
    description: 'Matplotlib is a comprehensive library for creating static, animated, and interactive visualizations in Python.',
    shortDescription: 'Python plotting library',
    icon: '📈',
    color: '#11557C',
    category: categoryMap['data-science'],
    difficulty: 'beginner',
    accessType: 'free',
    featured: false,
    isPublished: true,
    order: 49,
    tags: ['python', 'visualization', 'charts', 'graphs', 'plotting']
  },
  {
    name: 'Power BI',
    slug: 'power-bi',
    description: 'Power BI is a business analytics tool by Microsoft for creating interactive data visualizations and reports.',
    shortDescription: 'Microsoft\'s business analytics tool',
    icon: '📊',
    color: '#F2C811',
    category: categoryMap['data-science'],
    difficulty: 'beginner',
    accessType: 'mixed',
    featured: false,
    isPublished: true,
    order: 50,
    tags: ['analytics', 'visualization', 'business', 'microsoft', 'dashboards']
  }
];

async function seedTechnologies() {
  try {
    console.log('🔧 Seeding Technologies...');
    
    // Get all categories
    const categories = await TechnologyCategory.find({});
    const categoryMap = {};
    for (const cat of categories) {
      categoryMap[cat.slug] = cat._id;
    }
    
    if (Object.keys(categoryMap).length === 0) {
      console.warn('⚠️  No technology categories found. Please run category seeder first.');
      return [];
    }
    
    // Clear existing technologies
    await Technology.deleteMany({});
    
    // Get technologies with category references
    const technologies = getTechnologies(categoryMap);
    
    // Insert new technologies
    const result = await Technology.insertMany(technologies);
    
    // Update category counts
    for (const slug of Object.keys(categoryMap)) {
      const count = await Technology.countDocuments({ category: categoryMap[slug] });
      await TechnologyCategory.findByIdAndUpdate(categoryMap[slug], { technologiesCount: count });
    }
    
    console.log(`✅ Seeded ${result.length} technologies`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding technologies:', error.message);
    throw error;
  }
}

module.exports = { seedTechnologies, getTechnologies };
