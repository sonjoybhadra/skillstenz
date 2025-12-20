const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const Technology = require('../src/modules/technologies/Technology');
const Course = require('../src/modules/courses/Course');
const User = require('../src/modules/auth/User');

const technologies = [
  {
    name: 'Python',
    slug: 'python',
    description: 'Learn Python programming from basics to advanced. Build real-world applications with one of the most popular programming languages.',
    shortDescription: 'Versatile programming language for web, data science, AI and more',
    icon: '🐍',
    color: '#3776AB',
    category: 'programming',
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
    category: 'web',
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
    category: 'web',
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
    category: 'ai-ml',
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
    category: 'web',
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
    category: 'programming',
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
    category: 'devops',
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
    category: 'database',
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
    category: 'web',
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
    category: 'ai-ml',
    difficulty: 'advanced',
    accessType: 'mixed',
    featured: true,
    isPublished: true,
    tags: ['ai', 'llm', 'agents', 'rag']
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await Technology.deleteMany({});
    await Course.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert technologies
    const createdTechs = await Technology.insertMany(technologies);
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
          pricing: { type: 'free' },
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
          pricing: { type: 'paid', price: 49 },
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
          pricing: { type: 'free' },
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
          pricing: { type: 'paid', price: 79 },
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
