/**
 * Courses, Topics & Lessons Seeder
 * Seeds complete courses with sections and lessons
 */

const Course = require('../../src/modules/courses/Course');
const Technology = require('../../src/modules/technologies/Technology');
const User = require('../../src/modules/auth/User');

const getCourses = (techMap, instructorId) => [
  // Python Courses
  {
    title: 'Python Complete Masterclass',
    slug: 'python-complete-masterclass',
    technology: techMap['python'],
    description: 'Master Python from scratch to advanced concepts including OOP, file handling, and real-world projects.',
    shortDescription: 'Complete Python programming course from beginner to expert',
    thumbnail: '/images/courses/python-masterclass.jpg',
    duration: 3600, // 60 hours in minutes
    level: 'beginner',
    accessType: 'free',
    isPremium: false,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 0,
    tags: ['python', 'programming', 'beginner', 'oop'],
    sections: [
      {
        title: 'Getting Started with Python',
        order: 1,
        lessons: [
          { title: 'Introduction to Python', slug: 'introduction-to-python', duration: 15, type: 'video', order: 1, isFree: true, content: 'Learn what Python is and why it is one of the most popular programming languages today.' },
          { title: 'Setting Up Python Environment', slug: 'setting-up-python', duration: 20, type: 'video', order: 2, isFree: true, content: 'Install Python and set up your development environment with VS Code.' },
          { title: 'Your First Python Program', slug: 'first-python-program', duration: 15, type: 'video', order: 3, isFree: true, content: 'Write and run your first Hello World program in Python.' },
          { title: 'Python Syntax Basics', slug: 'python-syntax-basics', duration: 25, type: 'video', order: 4, isFree: false, content: 'Understand Python syntax, indentation, and basic structure.' }
        ]
      },
      {
        title: 'Variables and Data Types',
        order: 2,
        lessons: [
          { title: 'Understanding Variables', slug: 'understanding-variables', duration: 20, type: 'video', order: 1, isFree: false, content: 'Learn how to declare and use variables in Python.' },
          { title: 'Numbers and Math Operations', slug: 'numbers-math', duration: 25, type: 'video', order: 2, isFree: false, content: 'Work with integers, floats, and mathematical operations.' },
          { title: 'Strings and Text Manipulation', slug: 'strings-text', duration: 30, type: 'video', order: 3, isFree: false, content: 'Master string operations and formatting in Python.' },
          { title: 'Lists and Tuples', slug: 'lists-tuples', duration: 35, type: 'video', order: 4, isFree: false, content: 'Learn about Python collections: lists and tuples.' },
          { title: 'Dictionaries and Sets', slug: 'dictionaries-sets', duration: 30, type: 'video', order: 5, isFree: false, content: 'Understand dictionaries and sets for data storage.' }
        ]
      },
      {
        title: 'Control Flow',
        order: 3,
        lessons: [
          { title: 'If-Else Statements', slug: 'if-else-statements', duration: 25, type: 'video', order: 1, isFree: false, content: 'Learn conditional statements in Python.' },
          { title: 'For Loops', slug: 'for-loops', duration: 25, type: 'video', order: 2, isFree: false, content: 'Iterate through sequences with for loops.' },
          { title: 'While Loops', slug: 'while-loops', duration: 20, type: 'video', order: 3, isFree: false, content: 'Use while loops for conditional iteration.' },
          { title: 'Loop Control Statements', slug: 'loop-control', duration: 20, type: 'video', order: 4, isFree: false, content: 'Master break, continue, and pass statements.' }
        ]
      },
      {
        title: 'Functions and Modules',
        order: 4,
        lessons: [
          { title: 'Defining Functions', slug: 'defining-functions', duration: 30, type: 'video', order: 1, isFree: false, content: 'Create reusable code with functions.' },
          { title: 'Function Parameters and Returns', slug: 'function-parameters', duration: 25, type: 'video', order: 2, isFree: false, content: 'Work with function arguments and return values.' },
          { title: 'Lambda Functions', slug: 'lambda-functions', duration: 20, type: 'video', order: 3, isFree: false, content: 'Use anonymous lambda functions.' },
          { title: 'Modules and Packages', slug: 'modules-packages', duration: 30, type: 'video', order: 4, isFree: false, content: 'Organize code with modules and packages.' }
        ]
      },
      {
        title: 'Object-Oriented Programming',
        order: 5,
        lessons: [
          { title: 'Classes and Objects', slug: 'classes-objects', duration: 35, type: 'video', order: 1, isFree: false, content: 'Introduction to OOP with classes and objects.' },
          { title: 'Inheritance', slug: 'inheritance', duration: 30, type: 'video', order: 2, isFree: false, content: 'Extend classes with inheritance.' },
          { title: 'Polymorphism', slug: 'polymorphism', duration: 25, type: 'video', order: 3, isFree: false, content: 'Understand polymorphism in Python.' },
          { title: 'Encapsulation', slug: 'encapsulation', duration: 25, type: 'video', order: 4, isFree: false, content: 'Data hiding with encapsulation.' }
        ]
      }
    ]
  },

  // JavaScript Course
  {
    title: 'JavaScript Fundamentals to Advanced',
    slug: 'javascript-fundamentals-advanced',
    technology: techMap['javascript'],
    description: 'Complete JavaScript course covering ES6+, DOM manipulation, async programming, and modern JavaScript practices.',
    shortDescription: 'Master JavaScript from basics to advanced ES6+ features',
    thumbnail: '/images/courses/javascript-course.jpg',
    duration: 3000,
    level: 'beginner',
    accessType: 'free',
    isPremium: false,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 0,
    tags: ['javascript', 'web', 'frontend', 'es6'],
    sections: [
      {
        title: 'JavaScript Basics',
        order: 1,
        lessons: [
          { title: 'Introduction to JavaScript', slug: 'intro-javascript', duration: 15, type: 'video', order: 1, isFree: true, content: 'What is JavaScript and its role in web development.' },
          { title: 'Variables: let, const, var', slug: 'js-variables', duration: 20, type: 'video', order: 2, isFree: true, content: 'Understanding variable declarations in modern JavaScript.' },
          { title: 'Data Types in JavaScript', slug: 'js-data-types', duration: 25, type: 'video', order: 3, isFree: true, content: 'Primitive and reference data types.' },
          { title: 'Operators and Expressions', slug: 'js-operators', duration: 20, type: 'video', order: 4, isFree: false, content: 'Work with operators and build expressions.' }
        ]
      },
      {
        title: 'Functions and Scope',
        order: 2,
        lessons: [
          { title: 'Function Declarations and Expressions', slug: 'js-functions', duration: 25, type: 'video', order: 1, isFree: false, content: 'Create functions in different ways.' },
          { title: 'Arrow Functions', slug: 'arrow-functions', duration: 20, type: 'video', order: 2, isFree: false, content: 'Modern arrow function syntax.' },
          { title: 'Scope and Closures', slug: 'scope-closures', duration: 30, type: 'video', order: 3, isFree: false, content: 'Understand scope and leverage closures.' },
          { title: 'Higher-Order Functions', slug: 'higher-order-functions', duration: 25, type: 'video', order: 4, isFree: false, content: 'Functions that operate on functions.' }
        ]
      },
      {
        title: 'DOM Manipulation',
        order: 3,
        lessons: [
          { title: 'Selecting DOM Elements', slug: 'selecting-dom', duration: 20, type: 'video', order: 1, isFree: false, content: 'Select elements with querySelector and getElementById.' },
          { title: 'Modifying DOM Elements', slug: 'modifying-dom', duration: 25, type: 'video', order: 2, isFree: false, content: 'Change content, styles, and attributes.' },
          { title: 'Event Listeners', slug: 'event-listeners', duration: 30, type: 'video', order: 3, isFree: false, content: 'Handle user interactions with events.' },
          { title: 'Creating and Removing Elements', slug: 'creating-elements', duration: 25, type: 'video', order: 4, isFree: false, content: 'Dynamically add and remove DOM elements.' }
        ]
      },
      {
        title: 'Asynchronous JavaScript',
        order: 4,
        lessons: [
          { title: 'Callbacks and Callback Hell', slug: 'callbacks', duration: 25, type: 'video', order: 1, isFree: false, content: 'Understanding asynchronous callbacks.' },
          { title: 'Promises', slug: 'promises', duration: 30, type: 'video', order: 2, isFree: false, content: 'Handle async operations with Promises.' },
          { title: 'Async/Await', slug: 'async-await', duration: 25, type: 'video', order: 3, isFree: false, content: 'Write cleaner async code with async/await.' },
          { title: 'Fetch API', slug: 'fetch-api', duration: 30, type: 'video', order: 4, isFree: false, content: 'Make HTTP requests with Fetch.' }
        ]
      }
    ]
  },

  // React Course
  {
    title: 'React Complete Guide',
    slug: 'react-complete-guide',
    technology: techMap['react'],
    description: 'Build modern web applications with React including hooks, context, Redux, and real-world projects.',
    shortDescription: 'Master React with hooks, context and Redux',
    thumbnail: '/images/courses/react-course.jpg',
    duration: 2400,
    level: 'intermediate',
    accessType: 'mixed',
    isPremium: false,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 0,
    tags: ['react', 'frontend', 'spa', 'hooks'],
    sections: [
      {
        title: 'React Fundamentals',
        order: 1,
        lessons: [
          { title: 'What is React?', slug: 'what-is-react', duration: 15, type: 'video', order: 1, isFree: true, content: 'Introduction to React and its component-based architecture.' },
          { title: 'Setting Up React Project', slug: 'react-setup', duration: 20, type: 'video', order: 2, isFree: true, content: 'Create React apps with Create React App and Vite.' },
          { title: 'JSX Syntax', slug: 'jsx-syntax', duration: 25, type: 'video', order: 3, isFree: true, content: 'Learn JSX and how it differs from HTML.' },
          { title: 'Components and Props', slug: 'components-props', duration: 30, type: 'video', order: 4, isFree: false, content: 'Build reusable components with props.' }
        ]
      },
      {
        title: 'React Hooks',
        order: 2,
        lessons: [
          { title: 'useState Hook', slug: 'usestate-hook', duration: 30, type: 'video', order: 1, isFree: false, content: 'Manage component state with useState.' },
          { title: 'useEffect Hook', slug: 'useeffect-hook', duration: 35, type: 'video', order: 2, isFree: false, content: 'Handle side effects with useEffect.' },
          { title: 'useContext Hook', slug: 'usecontext-hook', duration: 25, type: 'video', order: 3, isFree: false, content: 'Share state across components with Context.' },
          { title: 'Custom Hooks', slug: 'custom-hooks', duration: 30, type: 'video', order: 4, isFree: false, content: 'Create your own reusable hooks.' }
        ]
      },
      {
        title: 'State Management with Redux',
        order: 3,
        lessons: [
          { title: 'Introduction to Redux', slug: 'intro-redux', duration: 25, type: 'video', order: 1, isFree: false, content: 'Understanding Redux and its principles.' },
          { title: 'Actions and Reducers', slug: 'actions-reducers', duration: 30, type: 'video', order: 2, isFree: false, content: 'Create actions and reducers.' },
          { title: 'Redux Toolkit', slug: 'redux-toolkit', duration: 35, type: 'video', order: 3, isFree: false, content: 'Modern Redux with Redux Toolkit.' },
          { title: 'Async Actions with Thunk', slug: 'redux-thunk', duration: 30, type: 'video', order: 4, isFree: false, content: 'Handle async operations in Redux.' }
        ]
      }
    ]
  },

  // Node.js Course
  {
    title: 'Node.js Backend Development',
    slug: 'nodejs-backend-development',
    technology: techMap['nodejs'],
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Learn REST APIs and authentication.',
    shortDescription: 'Build production-ready backends with Node.js',
    thumbnail: '/images/courses/nodejs-course.jpg',
    duration: 2700,
    level: 'intermediate',
    accessType: 'free',
    isPremium: false,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 0,
    tags: ['nodejs', 'backend', 'express', 'mongodb'],
    sections: [
      {
        title: 'Node.js Fundamentals',
        order: 1,
        lessons: [
          { title: 'Introduction to Node.js', slug: 'intro-nodejs', duration: 15, type: 'video', order: 1, isFree: true, content: 'What is Node.js and how it works.' },
          { title: 'Node.js Modules', slug: 'nodejs-modules', duration: 25, type: 'video', order: 2, isFree: true, content: 'Working with built-in and custom modules.' },
          { title: 'File System Operations', slug: 'fs-operations', duration: 30, type: 'video', order: 3, isFree: false, content: 'Read and write files with fs module.' },
          { title: 'NPM and Package Management', slug: 'npm-packages', duration: 20, type: 'video', order: 4, isFree: false, content: 'Manage dependencies with NPM.' }
        ]
      },
      {
        title: 'Express.js Framework',
        order: 2,
        lessons: [
          { title: 'Getting Started with Express', slug: 'express-intro', duration: 20, type: 'video', order: 1, isFree: false, content: 'Set up your first Express server.' },
          { title: 'Routing in Express', slug: 'express-routing', duration: 25, type: 'video', order: 2, isFree: false, content: 'Handle different routes and HTTP methods.' },
          { title: 'Middleware', slug: 'express-middleware', duration: 30, type: 'video', order: 3, isFree: false, content: 'Create and use middleware functions.' },
          { title: 'Error Handling', slug: 'express-errors', duration: 25, type: 'video', order: 4, isFree: false, content: 'Handle errors gracefully in Express.' }
        ]
      },
      {
        title: 'MongoDB and Mongoose',
        order: 3,
        lessons: [
          { title: 'Introduction to MongoDB', slug: 'mongodb-intro', duration: 25, type: 'video', order: 1, isFree: false, content: 'NoSQL databases and MongoDB basics.' },
          { title: 'Mongoose ODM', slug: 'mongoose-odm', duration: 30, type: 'video', order: 2, isFree: false, content: 'Model data with Mongoose schemas.' },
          { title: 'CRUD Operations', slug: 'mongoose-crud', duration: 35, type: 'video', order: 3, isFree: false, content: 'Create, Read, Update, Delete with Mongoose.' },
          { title: 'Relationships and Population', slug: 'mongoose-relations', duration: 30, type: 'video', order: 4, isFree: false, content: 'Handle relationships between documents.' }
        ]
      },
      {
        title: 'Authentication and Security',
        order: 4,
        lessons: [
          { title: 'JWT Authentication', slug: 'jwt-auth', duration: 35, type: 'video', order: 1, isFree: false, content: 'Implement JWT-based authentication.' },
          { title: 'Password Hashing', slug: 'password-hashing', duration: 20, type: 'video', order: 2, isFree: false, content: 'Securely hash passwords with bcrypt.' },
          { title: 'Protected Routes', slug: 'protected-routes', duration: 25, type: 'video', order: 3, isFree: false, content: 'Protect routes with authentication middleware.' },
          { title: 'Security Best Practices', slug: 'security-practices', duration: 30, type: 'video', order: 4, isFree: false, content: 'Implement security headers and rate limiting.' }
        ]
      }
    ]
  },

  // Machine Learning Course
  {
    title: 'Machine Learning with Python',
    slug: 'machine-learning-python',
    technology: techMap['machine-learning'],
    description: 'Learn machine learning algorithms, data preprocessing, model training, and deployment with Python and scikit-learn.',
    shortDescription: 'From ML fundamentals to real-world projects',
    thumbnail: '/images/courses/ml-course.jpg',
    duration: 3600,
    level: 'intermediate',
    accessType: 'mixed',
    isPremium: true,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 49.99,
    tags: ['machine-learning', 'python', 'data-science', 'ai'],
    sections: [
      {
        title: 'ML Fundamentals',
        order: 1,
        lessons: [
          { title: 'What is Machine Learning?', slug: 'what-is-ml', duration: 20, type: 'video', order: 1, isFree: true, content: 'Introduction to machine learning concepts.' },
          { title: 'Types of Machine Learning', slug: 'ml-types', duration: 25, type: 'video', order: 2, isFree: true, content: 'Supervised, unsupervised, and reinforcement learning.' },
          { title: 'Python for ML Setup', slug: 'python-ml-setup', duration: 20, type: 'video', order: 3, isFree: true, content: 'Set up your ML development environment.' },
          { title: 'NumPy and Pandas Essentials', slug: 'numpy-pandas', duration: 40, type: 'video', order: 4, isFree: false, content: 'Essential libraries for data manipulation.' }
        ]
      },
      {
        title: 'Data Preprocessing',
        order: 2,
        lessons: [
          { title: 'Data Cleaning', slug: 'data-cleaning', duration: 30, type: 'video', order: 1, isFree: false, content: 'Handle missing values and outliers.' },
          { title: 'Feature Engineering', slug: 'feature-engineering', duration: 35, type: 'video', order: 2, isFree: false, content: 'Create meaningful features from raw data.' },
          { title: 'Data Normalization', slug: 'data-normalization', duration: 25, type: 'video', order: 3, isFree: false, content: 'Scale and normalize your data.' },
          { title: 'Train-Test Split', slug: 'train-test-split', duration: 20, type: 'video', order: 4, isFree: false, content: 'Properly split data for training and testing.' }
        ]
      },
      {
        title: 'Supervised Learning',
        order: 3,
        lessons: [
          { title: 'Linear Regression', slug: 'linear-regression', duration: 35, type: 'video', order: 1, isFree: false, content: 'Predict continuous values with linear regression.' },
          { title: 'Logistic Regression', slug: 'logistic-regression', duration: 30, type: 'video', order: 2, isFree: false, content: 'Classification with logistic regression.' },
          { title: 'Decision Trees', slug: 'decision-trees', duration: 35, type: 'video', order: 3, isFree: false, content: 'Build interpretable decision tree models.' },
          { title: 'Random Forests', slug: 'random-forests', duration: 30, type: 'video', order: 4, isFree: false, content: 'Ensemble learning with random forests.' },
          { title: 'Support Vector Machines', slug: 'svm', duration: 35, type: 'video', order: 5, isFree: false, content: 'Classification with SVMs.' }
        ]
      }
    ]
  },

  // Docker Course
  {
    title: 'Docker for Developers',
    slug: 'docker-for-developers',
    technology: techMap['docker'],
    description: 'Master containerization with Docker. Learn to build, ship, and run applications in containers.',
    shortDescription: 'Containerize your applications with Docker',
    thumbnail: '/images/courses/docker-course.jpg',
    duration: 1800,
    level: 'intermediate',
    accessType: 'free',
    isPremium: false,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 0,
    tags: ['docker', 'devops', 'containers', 'deployment'],
    sections: [
      {
        title: 'Docker Fundamentals',
        order: 1,
        lessons: [
          { title: 'What is Docker?', slug: 'what-is-docker', duration: 15, type: 'video', order: 1, isFree: true, content: 'Understanding containers and Docker.' },
          { title: 'Installing Docker', slug: 'installing-docker', duration: 15, type: 'video', order: 2, isFree: true, content: 'Install Docker on your machine.' },
          { title: 'Docker Images and Containers', slug: 'images-containers', duration: 25, type: 'video', order: 3, isFree: true, content: 'Understand the difference between images and containers.' },
          { title: 'Docker Hub', slug: 'docker-hub', duration: 20, type: 'video', order: 4, isFree: false, content: 'Pull and push images to Docker Hub.' }
        ]
      },
      {
        title: 'Building Docker Images',
        order: 2,
        lessons: [
          { title: 'Dockerfile Basics', slug: 'dockerfile-basics', duration: 30, type: 'video', order: 1, isFree: false, content: 'Write your first Dockerfile.' },
          { title: 'Multi-Stage Builds', slug: 'multi-stage-builds', duration: 25, type: 'video', order: 2, isFree: false, content: 'Optimize images with multi-stage builds.' },
          { title: 'Best Practices', slug: 'dockerfile-best-practices', duration: 25, type: 'video', order: 3, isFree: false, content: 'Write efficient Dockerfiles.' }
        ]
      },
      {
        title: 'Docker Compose',
        order: 3,
        lessons: [
          { title: 'Introduction to Compose', slug: 'compose-intro', duration: 20, type: 'video', order: 1, isFree: false, content: 'Manage multi-container applications.' },
          { title: 'Compose File Syntax', slug: 'compose-syntax', duration: 30, type: 'video', order: 2, isFree: false, content: 'Write docker-compose.yml files.' },
          { title: 'Networking in Compose', slug: 'compose-networking', duration: 25, type: 'video', order: 3, isFree: false, content: 'Connect containers with networks.' },
          { title: 'Volumes and Data Persistence', slug: 'compose-volumes', duration: 25, type: 'video', order: 4, isFree: false, content: 'Persist data with volumes.' }
        ]
      }
    ]
  },

  // SQL Course
  {
    title: 'SQL for Data Analysis',
    slug: 'sql-data-analysis',
    technology: techMap['sql'],
    description: 'Master SQL for querying databases, data analysis, and reporting. From basic queries to advanced analytics.',
    shortDescription: 'Query databases like a pro',
    thumbnail: '/images/courses/sql-course.jpg',
    duration: 1500,
    level: 'beginner',
    accessType: 'free',
    isPremium: false,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 0,
    tags: ['sql', 'database', 'data', 'analytics'],
    sections: [
      {
        title: 'SQL Basics',
        order: 1,
        lessons: [
          { title: 'Introduction to SQL', slug: 'intro-sql', duration: 15, type: 'video', order: 1, isFree: true, content: 'What is SQL and why learn it.' },
          { title: 'SELECT Statements', slug: 'select-statements', duration: 25, type: 'video', order: 2, isFree: true, content: 'Query data with SELECT.' },
          { title: 'Filtering with WHERE', slug: 'where-clause', duration: 20, type: 'video', order: 3, isFree: true, content: 'Filter results with WHERE conditions.' },
          { title: 'Sorting with ORDER BY', slug: 'order-by', duration: 15, type: 'video', order: 4, isFree: false, content: 'Sort query results.' }
        ]
      },
      {
        title: 'Joins and Relationships',
        order: 2,
        lessons: [
          { title: 'INNER JOIN', slug: 'inner-join', duration: 25, type: 'video', order: 1, isFree: false, content: 'Combine tables with INNER JOIN.' },
          { title: 'LEFT and RIGHT JOIN', slug: 'left-right-join', duration: 25, type: 'video', order: 2, isFree: false, content: 'Outer joins explained.' },
          { title: 'Self Joins', slug: 'self-joins', duration: 20, type: 'video', order: 3, isFree: false, content: 'Join a table with itself.' }
        ]
      },
      {
        title: 'Aggregations and Grouping',
        order: 3,
        lessons: [
          { title: 'Aggregate Functions', slug: 'aggregate-functions', duration: 25, type: 'video', order: 1, isFree: false, content: 'COUNT, SUM, AVG, MIN, MAX.' },
          { title: 'GROUP BY', slug: 'group-by', duration: 25, type: 'video', order: 2, isFree: false, content: 'Group data for analysis.' },
          { title: 'HAVING Clause', slug: 'having-clause', duration: 20, type: 'video', order: 3, isFree: false, content: 'Filter grouped data.' }
        ]
      }
    ]
  },

  // Git Course
  {
    title: 'Git and GitHub Essentials',
    slug: 'git-github-essentials',
    technology: techMap['git'],
    description: 'Learn version control with Git and collaborate on projects using GitHub. Essential skills for every developer.',
    shortDescription: 'Master version control and collaboration',
    thumbnail: '/images/courses/git-course.jpg',
    duration: 900,
    level: 'beginner',
    accessType: 'free',
    isPremium: false,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 0,
    tags: ['git', 'github', 'version-control', 'collaboration'],
    sections: [
      {
        title: 'Git Fundamentals',
        order: 1,
        lessons: [
          { title: 'What is Version Control?', slug: 'version-control', duration: 10, type: 'video', order: 1, isFree: true, content: 'Why version control matters.' },
          { title: 'Installing and Configuring Git', slug: 'git-setup', duration: 15, type: 'video', order: 2, isFree: true, content: 'Set up Git on your machine.' },
          { title: 'Your First Repository', slug: 'first-repo', duration: 20, type: 'video', order: 3, isFree: true, content: 'Initialize and manage your first repo.' },
          { title: 'Staging and Committing', slug: 'staging-committing', duration: 20, type: 'video', order: 4, isFree: false, content: 'Track changes with commits.' }
        ]
      },
      {
        title: 'Branching and Merging',
        order: 2,
        lessons: [
          { title: 'Understanding Branches', slug: 'git-branches', duration: 20, type: 'video', order: 1, isFree: false, content: 'Work on features in isolation.' },
          { title: 'Merging Branches', slug: 'merging-branches', duration: 25, type: 'video', order: 2, isFree: false, content: 'Combine branch changes.' },
          { title: 'Resolving Conflicts', slug: 'resolving-conflicts', duration: 25, type: 'video', order: 3, isFree: false, content: 'Handle merge conflicts.' }
        ]
      },
      {
        title: 'GitHub Collaboration',
        order: 3,
        lessons: [
          { title: 'Remote Repositories', slug: 'remote-repos', duration: 20, type: 'video', order: 1, isFree: false, content: 'Work with remote repositories.' },
          { title: 'Pull Requests', slug: 'pull-requests', duration: 25, type: 'video', order: 2, isFree: false, content: 'Collaborate with pull requests.' },
          { title: 'GitHub Actions Basics', slug: 'github-actions', duration: 25, type: 'video', order: 3, isFree: false, content: 'Introduction to CI/CD with GitHub Actions.' }
        ]
      }
    ]
  },

  // Flutter Course
  {
    title: 'Flutter Mobile Development',
    slug: 'flutter-mobile-development',
    technology: techMap['flutter'],
    description: 'Build beautiful cross-platform mobile apps with Flutter and Dart. Create iOS and Android apps from a single codebase.',
    shortDescription: 'Build stunning cross-platform mobile apps',
    thumbnail: '/images/courses/flutter-course.jpg',
    duration: 2400,
    level: 'intermediate',
    accessType: 'mixed',
    isPremium: true,
    featured: true,
    isPublished: true,
    instructor: instructorId,
    price: 39.99,
    tags: ['flutter', 'mobile', 'dart', 'cross-platform'],
    sections: [
      {
        title: 'Flutter Basics',
        order: 1,
        lessons: [
          { title: 'Introduction to Flutter', slug: 'intro-flutter', duration: 15, type: 'video', order: 1, isFree: true, content: 'What is Flutter and its advantages.' },
          { title: 'Setting Up Flutter', slug: 'flutter-setup', duration: 25, type: 'video', order: 2, isFree: true, content: 'Install Flutter SDK and IDE.' },
          { title: 'Dart Language Basics', slug: 'dart-basics', duration: 35, type: 'video', order: 3, isFree: true, content: 'Learn Dart programming language.' },
          { title: 'Your First Flutter App', slug: 'first-flutter-app', duration: 25, type: 'video', order: 4, isFree: false, content: 'Build your first Flutter application.' }
        ]
      },
      {
        title: 'Flutter Widgets',
        order: 2,
        lessons: [
          { title: 'Widget Fundamentals', slug: 'widget-fundamentals', duration: 30, type: 'video', order: 1, isFree: false, content: 'Understanding Flutter widgets.' },
          { title: 'Layout Widgets', slug: 'layout-widgets', duration: 35, type: 'video', order: 2, isFree: false, content: 'Row, Column, Container, and more.' },
          { title: 'Input Widgets', slug: 'input-widgets', duration: 30, type: 'video', order: 3, isFree: false, content: 'Buttons, TextFields, and forms.' },
          { title: 'Stateful vs Stateless', slug: 'stateful-stateless', duration: 25, type: 'video', order: 4, isFree: false, content: 'Understanding widget state.' }
        ]
      },
      {
        title: 'State Management',
        order: 3,
        lessons: [
          { title: 'setState and InheritedWidget', slug: 'setstate-inherited', duration: 30, type: 'video', order: 1, isFree: false, content: 'Basic state management.' },
          { title: 'Provider Package', slug: 'provider-package', duration: 35, type: 'video', order: 2, isFree: false, content: 'State management with Provider.' },
          { title: 'Riverpod Basics', slug: 'riverpod-basics', duration: 35, type: 'video', order: 3, isFree: false, content: 'Modern state management with Riverpod.' }
        ]
      }
    ]
  },

  // Tailwind CSS Course
  {
    title: 'Tailwind CSS from Zero to Hero',
    slug: 'tailwind-css-zero-to-hero',
    technology: techMap['tailwindcss'],
    description: 'Master Tailwind CSS utility-first approach. Build modern, responsive designs without writing custom CSS.',
    shortDescription: 'Utility-first CSS for rapid development',
    thumbnail: '/images/courses/tailwind-course.jpg',
    duration: 900,
    level: 'beginner',
    accessType: 'free',
    isPremium: false,
    featured: false,
    isPublished: true,
    instructor: instructorId,
    price: 0,
    tags: ['tailwindcss', 'css', 'frontend', 'styling'],
    sections: [
      {
        title: 'Getting Started',
        order: 1,
        lessons: [
          { title: 'What is Tailwind CSS?', slug: 'what-is-tailwind', duration: 10, type: 'video', order: 1, isFree: true, content: 'Introduction to utility-first CSS.' },
          { title: 'Setting Up Tailwind', slug: 'tailwind-setup', duration: 20, type: 'video', order: 2, isFree: true, content: 'Install and configure Tailwind.' },
          { title: 'Utility Classes Overview', slug: 'utility-classes', duration: 25, type: 'video', order: 3, isFree: true, content: 'Understanding utility classes.' }
        ]
      },
      {
        title: 'Core Concepts',
        order: 2,
        lessons: [
          { title: 'Spacing and Sizing', slug: 'spacing-sizing', duration: 25, type: 'video', order: 1, isFree: false, content: 'Margin, padding, and dimensions.' },
          { title: 'Typography', slug: 'tailwind-typography', duration: 20, type: 'video', order: 2, isFree: false, content: 'Text styling with Tailwind.' },
          { title: 'Colors and Backgrounds', slug: 'colors-backgrounds', duration: 20, type: 'video', order: 3, isFree: false, content: 'Apply colors and backgrounds.' },
          { title: 'Flexbox and Grid', slug: 'flexbox-grid', duration: 30, type: 'video', order: 4, isFree: false, content: 'Layout with Flexbox and Grid.' }
        ]
      },
      {
        title: 'Responsive Design',
        order: 3,
        lessons: [
          { title: 'Responsive Breakpoints', slug: 'responsive-breakpoints', duration: 25, type: 'video', order: 1, isFree: false, content: 'Build responsive layouts.' },
          { title: 'Dark Mode', slug: 'dark-mode', duration: 20, type: 'video', order: 2, isFree: false, content: 'Implement dark mode easily.' },
          { title: 'Custom Configuration', slug: 'custom-config', duration: 25, type: 'video', order: 3, isFree: false, content: 'Customize your Tailwind config.' }
        ]
      }
    ]
  }
];

async function seedCourses() {
  try {
    console.log('📚 Seeding Courses...');
    
    // Get all technologies
    const technologies = await Technology.find({});
    const techMap = {};
    for (const tech of technologies) {
      techMap[tech.slug] = tech._id;
    }
    
    if (Object.keys(techMap).length === 0) {
      console.warn('⚠️  No technologies found. Please run technology seeder first.');
      return [];
    }
    
    // Get or create instructor
    let instructor = await User.findOne({ role: 'admin' });
    if (!instructor) {
      instructor = await User.findOne({ role: 'instructor' });
    }
    if (!instructor) {
      instructor = await User.findOne({});
    }
    
    const instructorId = instructor ? instructor._id : null;
    
    // Clear existing courses
    await Course.deleteMany({});
    
    // Get courses with references
    const courses = getCourses(techMap, instructorId);
    
    // Filter out courses with missing technology references
    const validCourses = courses.filter(course => course.technology);
    
    // Insert new courses
    const result = await Course.insertMany(validCourses);
    
    console.log(`✅ Seeded ${result.length} courses with ${result.reduce((sum, c) => sum + c.sections.length, 0)} sections`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding courses:', error.message);
    throw error;
  }
}

module.exports = { seedCourses, getCourses };
