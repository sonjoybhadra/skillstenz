const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => console.error('✗ MongoDB connection error:', err));

const Technology = require('../src/modules/technologies/Technology');
const Course = require('../src/modules/courses/Course');
const Topic = require('../src/modules/topics/Topic');
const TutorialChapter = require('../src/modules/tutorials/Tutorial');
const User = require('../src/modules/auth/User');

const seedContent = async () => {
  try {
    console.log('\n📚 Starting course content seeding...\n');

    // Get or create admin user for instructor
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = new User({
        email: 'admin@techtootalk.com',
        password: 'admin123',
        role: 'admin',
        userType: 'experienced'
      });
      await admin.save();
      console.log('✓ Admin user created');
    }

    // ==========================================
    // 1. SEED TECHNOLOGIES
    // ==========================================
    console.log('\n🔧 Seeding Technologies...');
    
    const technologies = [
      {
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Master JavaScript - the language of the web. Learn from basics to advanced concepts.',
        icon: '⚡',
        color: '#F7DF1E',
        accessType: 'free',
        featured: true,
        order: 1
      },
      {
        name: 'Python',
        slug: 'python',
        description: 'Python programming - versatile language for web, data science, and automation.',
        icon: '🐍',
        color: '#3776AB',
        accessType: 'free',
        featured: true,
        order: 2
      },
      {
        name: 'React',
        slug: 'react',
        description: 'Build modern UI with React. Master components, hooks, and state management.',
        icon: '⚛️',
        color: '#61DAFB',
        accessType: 'free',
        featured: true,
        order: 3
      },
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Complete web development course covering frontend, backend, and databases.',
        icon: '🌐',
        color: '#007BFF',
        accessType: 'free',
        featured: true,
        order: 4
      }
    ];

    const techMap = {};
    for (const tech of technologies) {
      let existingTech = await Technology.findOne({ slug: tech.slug });
      if (!existingTech) {
        existingTech = new Technology(tech);
        await existingTech.save();
        console.log(`  ✓ Created technology: ${tech.name}`);
      } else {
        console.log(`  ✓ Technology exists: ${tech.name}`);
      }
      techMap[tech.slug] = existingTech._id;
    }

    // ==========================================
    // 2. SEED COURSES
    // ==========================================
    console.log('\n📖 Seeding Courses...');

    const courses = [
      {
        title: 'JavaScript Fundamentals',
        slug: 'javascript-fundamentals',
        description: 'Learn the core concepts of JavaScript programming. Perfect for beginners.',
        shortDescription: 'Master JavaScript basics in 20 hours',
        technology: techMap['javascript'],
        thumbnail: 'https://via.placeholder.com/400x300?text=JavaScript+Fundamentals',
        level: 'beginner',
        duration: '20 hours',
        isFree: true,
        price: 0,
        featured: true,
        isPublished: true,
        instructor: admin._id,
        learningObjectives: [
          'Understand variables, data types, and operators',
          'Master functions and scope',
          'Work with arrays and objects',
          'Handle DOM manipulation',
          'Understand async/await and promises'
        ],
        prerequisites: ['Basic computer knowledge', 'Text editor (VS Code)'],
        tags: ['JavaScript', 'Beginner', 'Web Development'],
        sections: [
          {
            title: 'Getting Started with JavaScript',
            description: 'Introduction to JavaScript and setup',
            order: 1,
            lessons: [
              {
                title: 'What is JavaScript?',
                contentType: 'video',
                description: 'Learn what JavaScript is and why it matters',
                videoUrl: 'https://www.youtube.com/embed/W6NZfCO5tTE',
                videoDuration: 600,
                isFree: true,
                order: 1,
                isPublished: true
              },
              {
                title: 'Setting Up Your Development Environment',
                contentType: 'article',
                description: 'Install and configure VS Code',
                content: '<h2>Setup Guide</h2><p>Download VS Code from code.visualstudio.com</p><ol><li>Install Node.js</li><li>Install VS Code</li><li>Install JavaScript extensions</li></ol>',
                isFree: true,
                order: 2,
                isPublished: true
              },
              {
                title: 'Your First JavaScript Program',
                contentType: 'code',
                description: 'Write and run your first JS code',
                codeLanguage: 'javascript',
                codeSnippet: 'console.log("Hello, JavaScript!");\nconst message = "Welcome to JS";\nconsole.log(message);',
                isFree: true,
                order: 3,
                isPublished: true
              }
            ]
          },
          {
            title: 'Variables and Data Types',
            description: 'Understanding variables and primitive types',
            order: 2,
            lessons: [
              {
                title: 'Variables: var, let, const',
                contentType: 'video',
                description: 'Learn the differences between var, let, and const',
                videoUrl: 'https://www.youtube.com/embed/gSR5IWH5FUU',
                videoDuration: 1200,
                isFree: true,
                order: 1,
                isPublished: true
              },
              {
                title: 'Data Types in JavaScript',
                contentType: 'article',
                description: 'Explore strings, numbers, booleans, objects, and more',
                content: '<h2>JavaScript Data Types</h2><p>Primitive types: String, Number, Boolean, undefined, null, Symbol</p><p>Complex types: Object, Array</p>',
                isFree: true,
                order: 2,
                isPublished: true
              }
            ]
          }
        ]
      },
      {
        title: 'Python for Beginners',
        slug: 'python-for-beginners',
        description: 'Start your Python journey with this comprehensive beginner course.',
        shortDescription: 'Learn Python from scratch in 25 hours',
        technology: techMap['python'],
        thumbnail: 'https://via.placeholder.com/400x300?text=Python+for+Beginners',
        level: 'beginner',
        duration: '25 hours',
        isFree: true,
        price: 0,
        featured: true,
        isPublished: true,
        instructor: admin._id,
        learningObjectives: [
          'Understand Python syntax and structure',
          'Work with variables, lists, and dictionaries',
          'Create functions and use modules',
          'Handle file operations',
          'Build simple projects'
        ],
        prerequisites: ['Basic computer knowledge', 'Python installed'],
        tags: ['Python', 'Beginner', 'Programming'],
        sections: [
          {
            title: 'Introduction to Python',
            description: 'Get started with Python programming',
            order: 1,
            lessons: [
              {
                title: 'Why Python?',
                contentType: 'video',
                description: 'Understanding Python and its use cases',
                videoUrl: 'https://www.youtube.com/embed/rfscVS0vtik',
                videoDuration: 480,
                isFree: true,
                order: 1,
                isPublished: true
              },
              {
                title: 'Installing Python',
                contentType: 'article',
                description: 'Step-by-step Python installation guide',
                content: '<h2>Installation Steps</h2><ol><li>Visit python.org</li><li>Download latest version</li><li>Run installer</li><li>Verify installation</li></ol><pre>python --version</pre>',
                isFree: true,
                order: 2,
                isPublished: true
              }
            ]
          },
          {
            title: 'Python Basics',
            description: 'Core Python concepts',
            order: 2,
            lessons: [
              {
                title: 'Variables and Data Types',
                contentType: 'video',
                description: 'Learn variables and types in Python',
                videoUrl: 'https://www.youtube.com/embed/jK4JEY7ELms',
                videoDuration: 900,
                isFree: true,
                order: 1,
                isPublished: true
              }
            ]
          }
        ]
      },
      {
        title: 'React Fundamentals',
        slug: 'react-fundamentals',
        description: 'Learn React - the modern way to build user interfaces.',
        shortDescription: 'Master React basics and build components',
        technology: techMap['react'],
        thumbnail: 'https://via.placeholder.com/400x300?text=React+Fundamentals',
        level: 'intermediate',
        duration: '18 hours',
        isFree: true,
        price: 0,
        featured: true,
        isPublished: true,
        instructor: admin._id,
        learningObjectives: [
          'Understand React components and JSX',
          'Work with props and state',
          'Create functional components with hooks',
          'Handle forms and events',
          'Build complete applications'
        ],
        prerequisites: ['JavaScript knowledge', 'Node.js installed'],
        tags: ['React', 'Frontend', 'JavaScript'],
        sections: [
          {
            title: 'React Basics',
            description: 'Foundation of React',
            order: 1,
            lessons: [
              {
                title: 'What is React?',
                contentType: 'video',
                description: 'Introduction to React library',
                videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
                videoDuration: 600,
                isFree: true,
                order: 1,
                isPublished: true
              }
            ]
          }
        ]
      }
    ];

    const courseMap = {};
    for (const courseData of courses) {
      let existingCourse = await Course.findOne({ slug: courseData.slug });
      if (!existingCourse) {
        existingCourse = new Course(courseData);
        existingCourse.lessonsCount = courseData.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);
        existingCourse.sectionsCount = courseData.sections.length;
        await existingCourse.save();
        console.log(`  ✓ Created course: ${courseData.title}`);
      } else {
        console.log(`  ✓ Course exists: ${courseData.title}`);
      }
      courseMap[courseData.slug] = existingCourse._id;
    }

    // ==========================================
    // 3. SEED TOPICS
    // ==========================================
    console.log('\n📚 Seeding Topics...');

    const topics = [
      {
        technologyId: techMap['javascript'],
        name: 'DOM Manipulation',
        description: 'Master DOM manipulation with JavaScript',
        accessType: 'free',
        order: 1,
        createdBy: admin._id,
        subtopics: [
          {
            name: 'Selecting DOM Elements',
            description: 'Learn different ways to select elements',
            content: [
              {
                type: 'text',
                title: 'querySelector Overview',
                content: 'querySelector is a powerful method for selecting DOM elements using CSS selectors.',
                tags: ['DOM', 'JavaScript']
              }
            ]
          },
          {
            name: 'Modifying DOM Elements',
            description: 'Change element properties and styles',
            content: [
              {
                type: 'text',
                title: 'Changing innerHTML',
                content: 'Use innerHTML to dynamically change element content.'
              }
            ]
          }
        ]
      },
      {
        technologyId: techMap['python'],
        name: 'File Handling',
        description: 'Work with files in Python',
        accessType: 'free',
        order: 2,
        createdBy: admin._id,
        subtopics: [
          {
            name: 'Reading Files',
            description: 'Read file contents in Python',
            content: [
              {
                type: 'text',
                title: 'Open Function',
                content: 'The open() function is used to open files in Python.'
              }
            ]
          },
          {
            name: 'Writing Files',
            description: 'Write data to files',
            content: [
              {
                type: 'text',
                title: 'Write Mode',
                content: 'Use "w" mode to write to files, overwriting existing content.'
              }
            ]
          }
        ]
      },
      {
        technologyId: techMap['react'],
        name: 'State Management',
        description: 'Manage component state effectively',
        accessType: 'free',
        order: 1,
        createdBy: admin._id,
        subtopics: [
          {
            name: 'useState Hook',
            description: 'Use the useState hook for state',
            content: [
              {
                type: 'text',
                title: 'useState Basics',
                content: 'The useState hook is the primary way to add state to functional components.'
              }
            ]
          },
          {
            name: 'useEffect Hook',
            description: 'Handle side effects with useEffect',
            content: [
              {
                type: 'text',
                title: 'useEffect Cleanup',
                content: 'Return a cleanup function from useEffect to prevent memory leaks.'
              }
            ]
          }
        ]
      }
    ];

    for (const topicData of topics) {
      let existingTopic = await Topic.findOne({ 
        technologyId: topicData.technologyId, 
        name: topicData.name 
      });
      if (!existingTopic) {
        existingTopic = new Topic(topicData);
        await existingTopic.save();
        console.log(`  ✓ Created topic: ${topicData.name}`);
      } else {
        console.log(`  ✓ Topic exists: ${topicData.name}`);
      }
    }

    // ==========================================
    // 4. SEED TUTORIALS
    // ==========================================
    console.log('\n📝 Seeding Tutorials...');

    const tutorials = [
      {
        technology: techMap['javascript'],
        title: 'Understanding Arrow Functions',
        slug: 'understanding-arrow-functions',
        description: 'A deep dive into arrow functions and how they differ from regular functions',
        content: '<h2>Arrow Functions</h2><p>Arrow functions provide a concise syntax for writing functions.</p>',
        order: 1,
        difficulty: 'beginner',
        estimatedTime: 15,
        isPublished: true,
        createdBy: admin._id,
        keyPoints: [
          'Arrow functions have shorter syntax',
          'They lexically bind "this"',
          'Single parameter doesn\'t need parentheses',
          'Single expression returns implicitly'
        ],
        codeExamples: [
          {
            title: 'Basic Arrow Function',
            language: 'javascript',
            code: 'const greet = (name) => {\n  return `Hello, ${name}!`;\n};\n\nconst greetShort = name => `Hello, ${name}!`;',
            output: 'Hello, John!'
          }
        ],
        practiceExercises: [
          {
            question: 'Convert this function to arrow syntax: function add(a, b) { return a + b; }',
            hint: 'Use const and remove the function keyword',
            solution: 'const add = (a, b) => a + b;'
          }
        ]
      },
      {
        technology: techMap['python'],
        title: 'List Comprehensions in Python',
        slug: 'list-comprehensions-python',
        description: 'Master list comprehensions for writing cleaner, more efficient code',
        content: '<h2>List Comprehensions</h2><p>A concise way to create lists in Python.</p>',
        order: 2,
        difficulty: 'intermediate',
        estimatedTime: 20,
        isPublished: true,
        createdBy: admin._id,
        keyPoints: [
          'More concise than loops',
          'Generally faster than loops',
          'Can include conditions',
          'Readable and Pythonic'
        ],
        codeExamples: [
          {
            title: 'Basic List Comprehension',
            language: 'python',
            code: '# Traditional way\nsquares = []\nfor i in range(10):\n    squares.append(i**2)\n\n# Using list comprehension\nsquares = [i**2 for i in range(10)]',
            output: '[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]'
          }
        ]
      },
      {
        technology: techMap['react'],
        title: 'React Hooks Best Practices',
        slug: 'react-hooks-best-practices',
        description: 'Learn the best practices for using React hooks effectively',
        content: '<h2>Hooks Best Practices</h2><p>Guidelines for writing better React code with hooks.</p>',
        order: 1,
        difficulty: 'intermediate',
        estimatedTime: 25,
        isPublished: true,
        createdBy: admin._id,
        keyPoints: [
          'Only call hooks at the top level',
          'Only call hooks from React functions',
          'Use custom hooks to share logic',
          'Dependencies array is important'
        ],
        codeExamples: [
          {
            title: 'Correct useEffect Usage',
            language: 'javascript',
            code: 'useEffect(() => {\n  // Side effect here\n  return () => {\n    // Cleanup here\n  };\n}, [dependency]);',
            output: 'Effect runs when dependency changes'
          }
        ]
      },
      {
        technology: techMap['web-development'],
        title: 'Responsive Design Essentials',
        slug: 'responsive-design-essentials',
        description: 'Create websites that work on all devices',
        content: '<h2>Responsive Design</h2><p>Make your websites mobile-friendly and responsive.</p>',
        order: 1,
        difficulty: 'beginner',
        estimatedTime: 30,
        isPublished: true,
        createdBy: admin._id,
        keyPoints: [
          'Mobile-first approach',
          'Flexible grids and layouts',
          'Flexible images and media',
          'Media queries for different screens',
          'CSS Grid and Flexbox'
        ],
        codeExamples: [
          {
            title: 'Basic Media Query',
            language: 'css',
            code: '/* Desktop first */\n.container { width: 1200px; }\n\n/* Mobile */\n@media (max-width: 768px) {\n  .container { width: 100%; }\n}',
            output: 'Responsive layout'
          }
        ]
      }
    ];

    for (const tutorialData of tutorials) {
      let existingTutorial = await TutorialChapter.findOne({ slug: tutorialData.slug });
      if (!existingTutorial) {
        existingTutorial = new TutorialChapter(tutorialData);
        await existingTutorial.save();
        console.log(`  ✓ Created tutorial: ${tutorialData.title}`);
      } else {
        console.log(`  ✓ Tutorial exists: ${tutorialData.title}`);
      }
    }

    console.log('\n✅ Content seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${technologies.length} Technologies seeded`);
    console.log(`   • ${courses.length} Courses seeded (all FREE)`);
    console.log(`   • ${topics.length} Topics seeded (all FREE)`);
    console.log(`   • ${tutorials.length} Tutorials seeded (all FREE)`);
    console.log('\n💡 All content is FREE for all students!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding content:', error.message);
    process.exit(1);
  }
};

seedContent();
