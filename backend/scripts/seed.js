const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Core learning models
const TechnologyCategory = require('../src/modules/technologies/TechnologyCategory');
const Technology = require('../src/modules/technologies/Technology');
const Course = require('../src/modules/courses/Course');
const Topic = require('../src/modules/topics/Topic');
const TutorialChapter = require('../src/modules/tutorials/Tutorial');
const User = require('../src/modules/auth/User');

// High-level technology categories shown across the platform
const technologyCategories = [
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend, backend and full‑stack web technologies for building modern applications.',
    icon: '🌐',
    color: '#3B82F6',
    order: 1,
    featured: true,
    isPublished: true
  },
  {
    name: 'Data & AI',
    slug: 'data-ai',
    description: 'Machine learning, deep learning, data science and AI frameworks for intelligent products.',
    icon: '🤖',
    color: '#F97316',
    order: 2,
    featured: true,
    isPublished: true
  },
  {
    name: 'Backend & APIs',
    slug: 'backend-apis',
    description: 'Backend runtimes, API frameworks and microservices for scalable server‑side systems.',
    icon: '🧩',
    color: '#22C55E',
    order: 3,
    featured: false,
    isPublished: true
  },
  {
    name: 'DevOps & Cloud',
    slug: 'devops-cloud',
    description: 'DevOps tooling, containerization and cloud platforms for production‑ready deployments.',
    icon: '☁️',
    color: '#0EA5E9',
    order: 4,
    featured: false,
    isPublished: true
  },
  {
    name: 'Databases',
    slug: 'databases',
    description: 'Relational and NoSQL databases for transactional and analytical workloads.',
    icon: '🗄️',
    color: '#8B5CF6',
    order: 5,
    featured: false,
    isPublished: true
  }
];

// Core technologies – mapped to categories via categorySlug
const technologies = [
  {
    name: 'Python',
    slug: 'python',
    description: 'Learn Python programming from basics to advanced. Build real-world applications with one of the most popular programming languages.',
    shortDescription: 'Versatile programming language for web, data science, AI and more',
    icon: '🐍',
    color: '#3776AB',
    categorySlug: 'data-ai',
    categoryLegacy: 'programming',
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    tags: ['programming', 'backend', 'data-science', 'automation']
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'Master JavaScript - the language of the web. Build interactive websites, servers, and mobile apps.',
    shortDescription: 'The language of the web for frontend and backend',
    icon: '🟨',
    color: '#F7DF1E',
    categorySlug: 'web-development',
    categoryLegacy: 'programming',
    difficulty: 'beginner',
    accessType: 'free',
    featured: true,
    isPublished: true,
    tags: ['web', 'frontend', 'backend', 'node']
  },
  {
    name: 'React',
    slug: 'react',
    description: 'Build modern user interfaces with React. Learn components, hooks, state management, and more.',
    shortDescription: 'Build modern UIs with the most popular frontend library',
    icon: '⚛️',
    color: '#61DAFB',
    categorySlug: 'web-development',
    categoryLegacy: 'web',
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    tags: ['frontend', 'ui', 'components', 'spa']
  },
  {
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    description: 'Dive into Artificial Intelligence and Machine Learning. Build intelligent systems and models.',
    shortDescription: 'Build intelligent systems with AI and ML',
    icon: '🤖',
    color: '#FF6B6B',
    categorySlug: 'data-ai',
    categoryLegacy: 'ai-ml',
    difficulty: 'advanced',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    tags: ['ai', 'machine-learning', 'deep-learning', 'neural-networks']
  },
  {
    name: 'Node.js',
    slug: 'nodejs',
    description: 'Build scalable server-side applications with Node.js. Create APIs, real-time apps, and more.',
    shortDescription: 'JavaScript runtime for scalable backend applications',
    icon: '🟢',
    color: '#339933',
    categorySlug: 'backend-apis',
    categoryLegacy: 'web',
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    tags: ['backend', 'api', 'server', 'javascript']
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    description: 'Add type safety to JavaScript. Build more maintainable and scalable applications.',
    shortDescription: 'Typed superset of JavaScript for better code',
    icon: '🔷',
    color: '#3178C6',
    categorySlug: 'web-development',
    categoryLegacy: 'programming',
    difficulty: 'intermediate',
    accessType: 'free',
    featured: false,
    isPublished: true,
    tags: ['javascript', 'types', 'frontend', 'backend']
  },
  {
    name: 'Docker',
    slug: 'docker',
    description: 'Learn containerization with Docker. Package and deploy applications consistently.',
    shortDescription: 'Containerize and deploy applications anywhere',
    icon: '🐳',
    color: '#2496ED',
    categorySlug: 'devops-cloud',
    categoryLegacy: 'devops',
    difficulty: 'intermediate',
    accessType: 'free',
    featured: false,
    isPublished: true,
    tags: ['devops', 'containers', 'deployment', 'cloud']
  },
  {
    name: 'MongoDB',
    slug: 'mongodb',
    description: 'Master NoSQL database with MongoDB. Build flexible, scalable database solutions.',
    shortDescription: 'NoSQL database for modern applications',
    icon: '🍃',
    color: '#47A248',
    categorySlug: 'databases',
    categoryLegacy: 'database',
    difficulty: 'beginner',
    accessType: 'free',
    featured: false,
    isPublished: true,
    tags: ['database', 'nosql', 'backend', 'data']
  },
  {
    name: 'Next.js',
    slug: 'nextjs',
    description: 'Build full-stack React applications with Next.js. Server-side rendering, API routes, and more.',
    shortDescription: 'The React framework for production',
    icon: '▲',
    color: '#000000',
    categorySlug: 'web-development',
    categoryLegacy: 'web',
    difficulty: 'intermediate',
    accessType: 'free',
    featured: true,
    isPublished: true,
    tags: ['react', 'frontend', 'fullstack', 'ssr']
  },
  {
    name: 'LangChain',
    slug: 'langchain',
    description: 'Build AI applications with LangChain. Create chains, agents, and RAG systems.',
    shortDescription: 'Framework for building AI-powered applications',
    icon: '🔗',
    color: '#1C3C3C',
    categorySlug: 'data-ai',
    categoryLegacy: 'ai-ml',
    difficulty: 'advanced',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    tags: ['ai', 'llm', 'agents', 'rag']
  }
];

// Roadmap-style topics used by /admin/topics and learning pages
const learningTopics = [
  {
    technologySlug: 'python',
    name: 'Python Fundamentals',
    description: 'Core Python concepts every developer should know before moving into automation, web or AI.',
    accessType: 'free',
    order: 1,
    subtopics: [
      {
        name: 'Syntax & Variables',
        description: 'Basic syntax, variables and primitive types in Python.',
        content: [
          {
            type: 'text',
            title: 'Python syntax overview',
            content: 'Indentation, comments, expressions and how the Python interpreter executes your code.',
            duration: 10,
            tags: ['python', 'basics', 'syntax'],
            approved: true
          },
          {
            type: 'text',
            title: 'Working with variables & types',
            content: 'Numbers, strings, booleans and how Python handles dynamic typing in real projects.',
            duration: 15,
            tags: ['python', 'variables'],
            approved: true
          }
        ]
      },
      {
        name: 'Control Flow & Functions',
        description: 'Branching, loops and reusable functions.',
        content: [
          {
            type: 'text',
            title: 'If, for, while in practice',
            content: 'Write clean decision logic and iterate over lists, dictionaries and generators.',
            duration: 20,
            tags: ['python', 'control-flow'],
            approved: true
          }
        ]
      }
    ]
  },
  {
    technologySlug: 'javascript',
    name: 'Modern JavaScript Essentials',
    description: 'ES6+ syntax, the DOM and async patterns used in production web apps.',
    accessType: 'free',
    order: 1,
    subtopics: [
      {
        name: 'Language Basics',
        description: 'Let/const, arrow functions and template literals.',
        content: [
          {
            type: 'text',
            title: 'From var to let/const',
            content: 'Block scoping and how to avoid the most common bugs when refactoring legacy code.',
            duration: 10,
            tags: ['javascript', 'es6'],
            approved: true
          }
        ]
      },
      {
        name: 'Async JavaScript',
        description: 'Promises, async/await and real API calls.',
        content: [
          {
            type: 'text',
            title: 'Mastering async/await',
            content: 'Turn callback‑heavy code into readable async flows and handle errors correctly.',
            duration: 20,
            tags: ['javascript', 'async'],
            approved: true
          }
        ]
      }
    ]
  },
  {
    technologySlug: 'react',
    name: 'React Developer Roadmap',
    description: 'From basic components to hooks and state management for production UIs.',
    accessType: 'free',
    order: 2,
    subtopics: [
      {
        name: 'Core Concepts',
        description: 'JSX, props and component composition.',
        content: [
          {
            type: 'text',
            title: 'Thinking in components',
            content: 'Break complex pages into small, testable pieces that map to real user journeys.',
            duration: 15,
            tags: ['react', 'components'],
            approved: true
          }
        ]
      }
    ]
  },
  {
    technologySlug: 'langchain',
    name: 'LangChain for Production AI',
    description: 'Design LLM‑powered agents, tools and RAG pipelines that are ready for real users.',
    accessType: 'paid',
    order: 3,
    subtopics: [
      {
        name: 'RAG Foundations',
        description: 'Retrieval‑augmented generation patterns.',
        content: [
          {
            type: 'text',
            title: 'Why RAG beats giant prompts',
            content: 'Use vector search and chunking instead of brittle mega‑prompts to keep answers grounded.',
            duration: 25,
            tags: ['langchain', 'rag', 'vector-search'],
            approved: true
          }
        ]
      }
    ]
  }
];

// Free tutorial chapters used by /tutorials and chapter pages
const tutorialChapters = [
  {
    technologySlug: 'python',
    title: 'Introduction to Python for AI',
    description: 'Set up your environment, write your first script and understand how Python powers AI workflows.',
    content: '# Welcome to Python for AI\n\nYou will install Python, create a virtual environment and run a simple script that loads a model.',
    order: 1,
    difficulty: 'beginner',
    keyPoints: [
      'Install Python and VS Code',
      'Create and activate a virtual environment',
      'Run your first Python script'
    ],
    codeExamples: [
      {
        title: 'Hello, AI world',
        language: 'python',
        code: "print('Hello, AI world!')",
        output: 'Hello, AI world!'
      }
    ]
  },
  {
    technologySlug: 'javascript',
    title: 'Modern JavaScript in 15 Minutes',
    description: 'A quick practical tour of modern JavaScript syntax you will use in every frontend project.',
    content: 'Learn let/const, arrow functions, destructuring and template literals with focused examples.',
    order: 1,
    difficulty: 'beginner',
    keyPoints: [
      'Understand how let/const differ from var',
      'Use arrow functions to keep callbacks concise',
      'Use template literals for readable string interpolation'
    ]
  },
  {
    technologySlug: 'react',
    title: 'React Hooks Crash Course',
    description: 'Replace class components with hooks and manage state and side‑effects in a clean way.',
    content: 'You will build a small component that fetches data and shows loading, error and success states.',
    order: 1,
    difficulty: 'intermediate',
    keyPoints: [
      'Understand useState and useEffect',
      'Avoid common dependency array pitfalls',
      'Structure data‑fetching UI patterns'
    ]
  },
  {
    technologySlug: 'langchain',
    title: 'Building Your First LangChain Agent',
    description: 'Create a simple agent that calls tools and reasons step‑by‑step using an LLM.',
    content: 'You will configure a model, connect a search tool and run the agent against real questions.',
    order: 1,
    difficulty: 'advanced',
    keyPoints: [
      'Understand chains vs agents',
      'Register tools and prompts safely',
      'Log and debug agent reasoning traces'
    ]
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data (only learning content, keep users/payments/etc.)
    await TechnologyCategory.deleteMany({});
    await Technology.deleteMany({});
    await Course.deleteMany({});
    await Topic.deleteMany({});
    await TutorialChapter.deleteMany({});
    console.log('✅ Cleared existing learning content');

    // Insert technology categories
    const createdCategories = await TechnologyCategory.insertMany(technologyCategories);
    const categoryBySlug = createdCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat;
      return acc;
    }, {});
    console.log(`✅ Inserted ${createdCategories.length} technology categories`);

    // Insert technologies and attach category ObjectId
    const techDocsToInsert = technologies.map(t => {
      const { categorySlug, categoryLegacy, ...rest } = t;
      const categoryDoc = categoryBySlug[categorySlug];
      return {
        ...rest,
        categoryLegacy: categoryLegacy || 'programming',
        category: categoryDoc ? categoryDoc._id : undefined
      };
    });

    const createdTechs = await Technology.insertMany(techDocsToInsert);
    console.log(`✅ Inserted ${createdTechs.length} technologies`);

    // Find admin user to set as instructor
    let instructor = await User.findOne({ role: 'admin' });
    if (!instructor) {
      instructor = await User.findOne({});
    }

    // Create sample courses for Python
    const pythonTech = createdTechs.find(t => t.slug === 'python');
    if (pythonTech && instructor) {
      const pythonCourses = [
        {
          title: 'Python for Beginners',
          slug: 'python-for-beginners',
          description: 'Complete Python programming course for absolute beginners. Learn variables, data types, control flow, functions, and more.',
          shortDescription: 'Start your Python journey from zero',
          technology: pythonTech._id,
          instructor: instructor._id,
          level: 'beginner',
          language: 'English',
          isFree: true,
          price: 0,
          originalPrice: 0,
          isPublished: true,
          featured: true,
          learningObjectives: ['Understand Python basics', 'Write Python programs', 'Work with data structures', 'Handle files and exceptions'],
          sections: [
            {
              title: 'Getting Started',
              description: 'Introduction to Python programming',
              order: 1,
              lessons: [
                { title: 'Welcome to Python', contentType: 'video', videoProvider: 'youtube', videoDuration: 300, isFree: true, order: 1 },
                { title: 'Installing Python', contentType: 'video', videoProvider: 'youtube', videoDuration: 420, isFree: true, order: 2 },
                { title: 'Your First Python Program', contentType: 'video', videoProvider: 'youtube', videoDuration: 600, isFree: false, order: 3 }
              ]
            },
            {
              title: 'Variables and Data Types',
              description: 'Learn about Python variables and basic data types',
              order: 2,
              lessons: [
                { title: 'Variables in Python', contentType: 'video', videoProvider: 'youtube', videoDuration: 480, isFree: false, order: 1 },
                { title: 'Numbers and Math', contentType: 'video', videoProvider: 'youtube', videoDuration: 540, isFree: false, order: 2 },
                { title: 'Strings and Text', contentType: 'video', videoProvider: 'youtube', videoDuration: 660, isFree: false, order: 3 }
              ]
            }
          ]
        },
        {
          title: 'Python Data Science',
          slug: 'python-data-science',
          description: 'Learn data science with Python. Master NumPy, Pandas, Matplotlib, and more.',
          shortDescription: 'Data analysis and visualization with Python',
          technology: pythonTech._id,
          instructor: instructor._id,
          level: 'intermediate',
          language: 'English',
          isFree: false,
          price: 49,
          originalPrice: 99,
          currency: 'USD',
          isPublished: true,
          featured: true,
          learningObjectives: ['Master NumPy arrays', 'Analyze data with Pandas', 'Create visualizations', 'Perform statistical analysis'],
          sections: [
            {
              title: 'NumPy Fundamentals',
              description: 'Working with NumPy arrays',
              order: 1,
              lessons: [
                { title: 'Introduction to NumPy', contentType: 'video', videoProvider: 'youtube', videoDuration: 600, isFree: true, order: 1 },
                { title: 'Creating Arrays', contentType: 'video', videoProvider: 'youtube', videoDuration: 720, isFree: false, order: 2 }
              ]
            }
          ]
        }
      ];
      await Course.insertMany(pythonCourses);
      console.log(`✅ Inserted ${pythonCourses.length} Python courses`);
    }

    // Create sample courses for JavaScript
    const jsTech = createdTechs.find(t => t.slug === 'javascript');
    if (jsTech && instructor) {
      const jsCourses = [
        {
          title: 'JavaScript Fundamentals',
          slug: 'javascript-fundamentals',
          description: 'Master JavaScript from the ground up. Learn syntax, DOM manipulation, events, and modern ES6+ features.',
          shortDescription: 'Complete JavaScript course for beginners',
          technology: jsTech._id,
          instructor: instructor._id,
          level: 'beginner',
          language: 'English',
            isFree: false,
            price: 79,
            originalPrice: 149,
            currency: 'USD',
          price: 0,
          originalPrice: 0,
          isPublished: true,
          featured: true,
          sections: [
            {
              title: 'JavaScript Basics',
              order: 1,
              lessons: [
                { title: 'What is JavaScript?', contentType: 'video', videoProvider: 'youtube', videoDuration: 360, isFree: true, order: 1 },
                { title: 'Variables and Constants', contentType: 'video', videoProvider: 'youtube', videoDuration: 480, isFree: true, order: 2 }
              ]
            }
          ]
        }
      ];
      await Course.insertMany(jsCourses);
      console.log(`✅ Inserted ${jsCourses.length} JavaScript courses`);
      // Create AI & Machine Learning courses
      const aiTech = createdTechs.find(t => t.slug === 'ai-ml');
      if (aiTech && instructor) {
        const aiCourses = [
          {
            title: 'Practical Machine Learning with Python',
            slug: 'practical-machine-learning-with-python',
            description: 'End-to-end machine learning workflow: data preparation, model training, evaluation and deployment basics using Python.',
            shortDescription: 'Ship real ML models, not just notebooks.',
            technology: aiTech._id,
            instructor: instructor._id,
            level: 'intermediate',
            language: 'English',
            isFree: false,
            price: 89,
            originalPrice: 179,
            currency: 'USD',
            learningObjectives: [
              'Frame ML problems from real product requirements',
              'Build supervised models with scikit-learn',
              'Evaluate models with the right metrics',
              'Prepare a model for basic deployment'
            ],
            prerequisites: ['Solid Python fundamentals', 'Comfortable with basic statistics'],
            isPublished: true,
            featured: true,
            sections: [
              {
                title: 'ML Foundations',
                description: 'What ML is (and is not) plus the core workflow.',
                order: 1,
                lessons: [
                  {
                    title: 'ML in Real Products',
                    description: 'Understand where ML adds value and where it does not.',
                    contentType: 'video',
                    videoProvider: 'youtube',
                    videoDuration: 600,
                    isFree: true,
                    order: 1
                  },
                  {
                    title: 'Supervised vs Unsupervised Learning',
                    contentType: 'article',
                    content: 'We compare regression, classification and clustering with practical examples.',
                    isFree: true,
                    order: 2
                  }
                ]
              },
              {
                title: 'Model Training with scikit-learn',
                order: 2,
                lessons: [
                  {
                    title: 'Building Your First Classifier',
                    contentType: 'code',
                    codeLanguage: 'python',
                    codeSnippet: 'from sklearn.ensemble import RandomForestClassifier',
                    isFree: false,
                    order: 1
                  }
                ]
              }
            ]
          }
        ];
        await Course.insertMany(aiCourses);
        console.log(`✅ Inserted ${aiCourses.length} AI/ML courses`);
      }

      // Create LangChain courses
      const langchainTech = createdTechs.find(t => t.slug === 'langchain');
      if (langchainTech && instructor) {
        const langchainCourses = [
          {
            title: 'LangChain & RAG in Production',
            slug: 'langchain-and-rag-in-production',
            description: 'Design, build and monitor retrieval-augmented generation systems and agents with LangChain.',
            shortDescription: 'From prototype notebooks to production-grade AI apps.',
            technology: langchainTech._id,
            instructor: instructor._id,
            level: 'advanced',
            language: 'English',
            isFree: false,
            price: 129,
            originalPrice: 249,
            currency: 'USD',
            learningObjectives: [
              'Design robust RAG architectures',
              'Implement tools and agents safely',
              'Instrument and monitor LLM applications',
              'Work with vector databases and embeddings'
            ],
            isPublished: true,
            featured: true,
            sections: [
              {
                title: 'RAG Architecture',
                order: 1,
                lessons: [
                  {
                    title: 'What Makes RAG Reliable',
                    contentType: 'article',
                    content: 'Chunking, retrieval, re-ranking and grounding techniques explained with diagrams.',
                    isFree: true,
                    order: 1
                  }
                ]
              },
              {
                title: 'LangChain Tooling & Agents',
                order: 2,
                lessons: [
                  {
                    title: 'Building a Research Assistant Agent',
                    contentType: 'code',
                    codeLanguage: 'python',
                    codeSnippet: '# LangChain agent example',
                    isFree: false,
                    order: 1
                  }
                ]
              }
            ]
          }
        ];
        await Course.insertMany(langchainCourses);
        console.log(`✅ Inserted ${langchainCourses.length} LangChain courses`);
      }

      // Create Next.js course
      const nextTech = createdTechs.find(t => t.slug === 'nextjs');
      if (nextTech && instructor) {
        const nextCourses = [
          {
            title: 'Next.js 14 Full-Stack Bootcamp',
            slug: 'nextjs-14-fullstack-bootcamp',
            description: 'Build production-ready full-stack apps with the Next.js App Router, API routes, auth and deployment.',
            shortDescription: 'From zero to deployed full-stack Next.js app.',
            technology: nextTech._id,
            instructor: instructor._id,
            level: 'intermediate',
            language: 'English',
            isFree: false,
            price: 99,
            originalPrice: 199,
            currency: 'USD',
            isPublished: true,
            featured: true,
            sections: [
              {
                title: 'App Router Fundamentals',
                order: 1,
                lessons: [
                  {
                    title: 'Layouts, Pages and Loading States',
                    contentType: 'video',
                    videoProvider: 'youtube',
                    videoDuration: 900,
                    isFree: true,
                    order: 1
                  }
                ]
              }
            ]
          }
        ];
        await Course.insertMany(nextCourses);
        console.log(`✅ Inserted ${nextCourses.length} Next.js courses`);
      }

      // Create Node.js course
      const nodeTech = createdTechs.find(t => t.slug === 'nodejs');
      if (nodeTech && instructor) {
        const nodeCourses = [
          {
            title: 'Node.js REST APIs with Express',
            slug: 'nodejs-rest-apis-with-express',
            description: 'Design and build secure, documented REST APIs using Node.js, Express and MongoDB.',
            shortDescription: 'Battle-tested API patterns in Node.js.',
            technology: nodeTech._id,
            instructor: instructor._id,
            level: 'intermediate',
            language: 'English',
            isFree: true,
            price: 0,
            originalPrice: 0,
            isPublished: true,
            featured: false,
            sections: [
              {
                title: 'API Design Basics',
                order: 1,
                lessons: [
                  {
                    title: 'Designing Resources and Routes',
                    contentType: 'article',
                    content: 'Best practices for path design, versioning and pagination.',
                    isFree: true,
                    order: 1
                  }
                ]
              }
            ]
          }
        ];
        await Course.insertMany(nodeCourses);
        console.log(`✅ Inserted ${nodeCourses.length} Node.js courses`);
      }

      // Create Docker course
      const dockerTech = createdTechs.find(t => t.slug === 'docker');
      if (dockerTech && instructor) {
        const dockerCourses = [
          {
            title: 'Docker for Developers',
            slug: 'docker-for-developers',
            description: 'Containerize applications, work with images and run multi-service stacks using Docker Compose.',
            shortDescription: 'Ship the same app everywhere with confidence.',
            technology: dockerTech._id,
            instructor: instructor._id,
            level: 'beginner',
            language: 'English',
            isFree: true,
            price: 0,
            originalPrice: 0,
            isPublished: true,
            featured: false,
            sections: [
              {
                title: 'Docker Fundamentals',
                order: 1,
                lessons: [
                  {
                    title: 'Images, Containers and Registries',
                    contentType: 'video',
                    videoProvider: 'youtube',
                    videoDuration: 780,
                    isFree: true,
                    order: 1
                  }
                ]
              }
            ]
          }
        ];
        await Course.insertMany(dockerCourses);
        console.log(`✅ Inserted ${dockerCourses.length} Docker courses`);
      }

      // Create MongoDB course
      const mongoTech = createdTechs.find(t => t.slug === 'mongodb');
      if (mongoTech && instructor) {
        const mongoCourses = [
          {
            title: 'MongoDB for Backend Developers',
            slug: 'mongodb-for-backend-developers',
            description: 'Model schemas, write performant queries and design indexes for Node.js backends using MongoDB.',
            shortDescription: 'Build reliable data layers with MongoDB.',
            technology: mongoTech._id,
            instructor: instructor._id,
            level: 'beginner',
            language: 'English',
            isFree: true,
            price: 0,
            originalPrice: 0,
            isPublished: true,
            featured: false,
            sections: [
              {
                title: 'Documents & Collections',
                order: 1,
                lessons: [
                  {
                    title: 'Designing Collections for APIs',
                    contentType: 'article',
                    content: 'How to map API resources to MongoDB collections and documents.',
                    isFree: true,
                    order: 1
                  }
                ]
              }
            ]
          }
        ];
        await Course.insertMany(mongoCourses);
        console.log(`✅ Inserted ${mongoCourses.length} MongoDB courses`);
      }
    }

    // Create sample courses for React
    const reactTech = createdTechs.find(t => t.slug === 'react');
    if (reactTech && instructor) {
      const reactCourses = [
        {
          title: 'React Complete Guide',
          slug: 'react-complete-guide',
          description: 'Build modern web applications with React. Learn components, hooks, state management, and real-world projects.',
          shortDescription: 'Everything you need to know about React',
          technology: reactTech._id,
          instructor: instructor._id,
          level: 'intermediate',
          language: 'English',
          isFree: false,
          price: 79,
          originalPrice: 149,
          currency: 'USD',
          isPublished: true,
          featured: true,
          sections: [
            {
              title: 'React Fundamentals',
              order: 1,
              lessons: [
                { title: 'Introduction to React', contentType: 'video', videoProvider: 'youtube', videoDuration: 420, isFree: true, order: 1 },
                { title: 'Creating Components', contentType: 'video', videoProvider: 'youtube', videoDuration: 540, isFree: false, order: 2 }
              ]
            }
          ]
        }
      ];
      await Course.insertMany(reactCourses);
      console.log(`✅ Inserted ${reactCourses.length} React courses`);
    }

    // Insert roadmap topics (Topic collection)
    for (const topicConfig of learningTopics) {
      const tech = createdTechs.find(t => t.slug === topicConfig.technologySlug);
      if (!tech) continue;

      await Topic.create({
        technologyId: tech._id,
        name: topicConfig.name,
        description: topicConfig.description,
        subtopics: topicConfig.subtopics,
        accessType: topicConfig.accessType || 'free',
        order: topicConfig.order || 0
      });
    }
    console.log('✅ Inserted roadmap topics');

    // Insert free tutorial chapters
    for (const chapterConfig of tutorialChapters) {
      const tech = createdTechs.find(t => t.slug === chapterConfig.technologySlug);
      if (!tech) continue;

      await TutorialChapter.create({
        technology: tech._id,
        title: chapterConfig.title,
        slug: chapterConfig.slug || undefined,
        description: chapterConfig.description,
        content: chapterConfig.content,
        order: chapterConfig.order || 0,
        difficulty: chapterConfig.difficulty || 'beginner',
        keyPoints: chapterConfig.keyPoints || [],
        codeExamples: chapterConfig.codeExamples || []
      });
    }
    console.log('✅ Inserted tutorial chapters');

    // Update course counts
    const techIds = createdTechs.map(t => t._id);
    for (const techId of techIds) {
      const count = await Course.countDocuments({ technology: techId, isPublished: true });
      await Technology.findByIdAndUpdate(techId, { courseCount: count });
    }
    console.log('✅ Updated course counts');

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
