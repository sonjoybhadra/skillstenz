/**
 * Topics & Lessons Seeder
 * Creates topics and lessons related to courses
 */

const Topic = require('../../src/modules/courses/Topic');
const Course = require('../../src/modules/courses/Course');
const Technology = require('../../src/modules/technologies/Technology');

const getTopicsForCourse = (course, technology) => {
  const topicsData = {
    'python': [
      { title: 'Introduction to Python', slug: 'introduction-to-python', description: 'Get started with Python programming', difficulty: 'beginner', duration: 15, type: 'lesson', order: 1, isFree: true },
      { title: 'Python Installation & Setup', slug: 'python-installation-setup', description: 'Install Python and set up your development environment', difficulty: 'beginner', duration: 20, type: 'lesson', order: 2, isFree: true },
      { title: 'Variables and Data Types', slug: 'variables-data-types', description: 'Learn about Python variables and data types', difficulty: 'beginner', duration: 25, type: 'lesson', order: 3, isFree: true },
      { title: 'Operators in Python', slug: 'operators-python', description: 'Arithmetic, comparison, and logical operators', difficulty: 'beginner', duration: 20, type: 'lesson', order: 4, isFree: false },
      { title: 'Control Flow - If/Else', slug: 'control-flow-if-else', description: 'Conditional statements in Python', difficulty: 'beginner', duration: 25, type: 'lesson', order: 5, isFree: false },
      { title: 'Loops in Python', slug: 'loops-python', description: 'For and while loops explained', difficulty: 'beginner', duration: 30, type: 'lesson', order: 6, isFree: false },
      { title: 'Functions', slug: 'functions', description: 'Creating and using functions', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 7, isFree: false },
      { title: 'Lists and Tuples', slug: 'lists-tuples', description: 'Working with Python collections', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 8, isFree: false },
      { title: 'Dictionaries', slug: 'dictionaries', description: 'Key-value pairs in Python', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 9, isFree: false },
      { title: 'Object-Oriented Programming', slug: 'oop-python', description: 'Classes and objects in Python', difficulty: 'intermediate', duration: 45, type: 'lesson', order: 10, isFree: false },
      { title: 'File Handling', slug: 'file-handling', description: 'Read and write files in Python', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 11, isFree: false },
      { title: 'Exception Handling', slug: 'exception-handling', description: 'Try, except, and error handling', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 12, isFree: false },
      { title: 'Modules and Packages', slug: 'modules-packages', description: 'Organizing Python code', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 13, isFree: false },
      { title: 'Python Quiz', slug: 'python-quiz', description: 'Test your Python knowledge', difficulty: 'intermediate', duration: 20, type: 'quiz', order: 14, isFree: false },
      { title: 'Python Project', slug: 'python-project', description: 'Build a real-world Python application', difficulty: 'intermediate', duration: 60, type: 'project', order: 15, isFree: false }
    ],
    'javascript': [
      { title: 'Introduction to JavaScript', slug: 'introduction-to-javascript', description: 'Get started with JavaScript', difficulty: 'beginner', duration: 15, type: 'lesson', order: 1, isFree: true },
      { title: 'JavaScript in Browser', slug: 'javascript-in-browser', description: 'Running JavaScript in web browsers', difficulty: 'beginner', duration: 20, type: 'lesson', order: 2, isFree: true },
      { title: 'Variables - let, const, var', slug: 'variables-let-const-var', description: 'JavaScript variable declarations', difficulty: 'beginner', duration: 25, type: 'lesson', order: 3, isFree: true },
      { title: 'Data Types', slug: 'data-types-js', description: 'JavaScript primitive and reference types', difficulty: 'beginner', duration: 25, type: 'lesson', order: 4, isFree: false },
      { title: 'Operators', slug: 'operators-js', description: 'JavaScript operators explained', difficulty: 'beginner', duration: 20, type: 'lesson', order: 5, isFree: false },
      { title: 'Control Structures', slug: 'control-structures', description: 'If/else and switch statements', difficulty: 'beginner', duration: 25, type: 'lesson', order: 6, isFree: false },
      { title: 'Loops', slug: 'loops-js', description: 'For, while, and do-while loops', difficulty: 'beginner', duration: 25, type: 'lesson', order: 7, isFree: false },
      { title: 'Functions', slug: 'functions-js', description: 'Function declarations and expressions', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 8, isFree: false },
      { title: 'Arrow Functions', slug: 'arrow-functions', description: 'ES6 arrow function syntax', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 9, isFree: false },
      { title: 'Arrays', slug: 'arrays-js', description: 'Working with JavaScript arrays', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 10, isFree: false },
      { title: 'Objects', slug: 'objects-js', description: 'JavaScript objects and properties', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 11, isFree: false },
      { title: 'DOM Manipulation', slug: 'dom-manipulation', description: 'Interacting with the Document Object Model', difficulty: 'intermediate', duration: 40, type: 'lesson', order: 12, isFree: false },
      { title: 'Events', slug: 'events-js', description: 'Event handling in JavaScript', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 13, isFree: false },
      { title: 'Async JavaScript', slug: 'async-javascript', description: 'Promises and async/await', difficulty: 'advanced', duration: 45, type: 'lesson', order: 14, isFree: false },
      { title: 'JavaScript Project', slug: 'javascript-project', description: 'Build an interactive web application', difficulty: 'advanced', duration: 60, type: 'project', order: 15, isFree: false }
    ],
    'react': [
      { title: 'Introduction to React', slug: 'introduction-to-react', description: 'Understanding React and its ecosystem', difficulty: 'beginner', duration: 20, type: 'lesson', order: 1, isFree: true },
      { title: 'Setting Up React', slug: 'setting-up-react', description: 'Create React App and project structure', difficulty: 'beginner', duration: 25, type: 'lesson', order: 2, isFree: true },
      { title: 'JSX Syntax', slug: 'jsx-syntax', description: 'JavaScript XML in React', difficulty: 'beginner', duration: 25, type: 'lesson', order: 3, isFree: true },
      { title: 'Components', slug: 'components-react', description: 'Functional and class components', difficulty: 'beginner', duration: 30, type: 'lesson', order: 4, isFree: false },
      { title: 'Props', slug: 'props-react', description: 'Passing data between components', difficulty: 'beginner', duration: 25, type: 'lesson', order: 5, isFree: false },
      { title: 'State', slug: 'state-react', description: 'Managing component state', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 6, isFree: false },
      { title: 'useState Hook', slug: 'usestate-hook', description: 'State management with hooks', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 7, isFree: false },
      { title: 'useEffect Hook', slug: 'useeffect-hook', description: 'Side effects in React', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 8, isFree: false },
      { title: 'Event Handling', slug: 'event-handling-react', description: 'Handling events in React', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 9, isFree: false },
      { title: 'Conditional Rendering', slug: 'conditional-rendering', description: 'Rendering based on conditions', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 10, isFree: false },
      { title: 'Lists and Keys', slug: 'lists-keys', description: 'Rendering lists in React', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 11, isFree: false },
      { title: 'Forms', slug: 'forms-react', description: 'Controlled and uncontrolled forms', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 12, isFree: false },
      { title: 'Context API', slug: 'context-api', description: 'State management with Context', difficulty: 'advanced', duration: 40, type: 'lesson', order: 13, isFree: false },
      { title: 'React Router', slug: 'react-router', description: 'Navigation in React apps', difficulty: 'advanced', duration: 40, type: 'lesson', order: 14, isFree: false },
      { title: 'React Project', slug: 'react-project', description: 'Build a complete React application', difficulty: 'advanced', duration: 90, type: 'project', order: 15, isFree: false }
    ],
    'nodejs': [
      { title: 'Introduction to Node.js', slug: 'introduction-to-nodejs', description: 'Understanding Node.js runtime', difficulty: 'beginner', duration: 20, type: 'lesson', order: 1, isFree: true },
      { title: 'Installing Node.js', slug: 'installing-nodejs', description: 'Set up Node.js environment', difficulty: 'beginner', duration: 15, type: 'lesson', order: 2, isFree: true },
      { title: 'Node.js Basics', slug: 'nodejs-basics', description: 'Core concepts and REPL', difficulty: 'beginner', duration: 25, type: 'lesson', order: 3, isFree: true },
      { title: 'Modules in Node.js', slug: 'modules-nodejs', description: 'CommonJS and ES modules', difficulty: 'beginner', duration: 30, type: 'lesson', order: 4, isFree: false },
      { title: 'NPM Basics', slug: 'npm-basics', description: 'Node Package Manager essentials', difficulty: 'beginner', duration: 25, type: 'lesson', order: 5, isFree: false },
      { title: 'File System Module', slug: 'file-system-module', description: 'Reading and writing files', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 6, isFree: false },
      { title: 'HTTP Module', slug: 'http-module', description: 'Creating HTTP servers', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 7, isFree: false },
      { title: 'Express.js Basics', slug: 'expressjs-basics', description: 'Web framework for Node.js', difficulty: 'intermediate', duration: 40, type: 'lesson', order: 8, isFree: false },
      { title: 'Routing in Express', slug: 'routing-express', description: 'Creating API routes', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 9, isFree: false },
      { title: 'Middleware', slug: 'middleware-express', description: 'Express middleware explained', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 10, isFree: false },
      { title: 'REST API Design', slug: 'rest-api-design', description: 'Building RESTful APIs', difficulty: 'intermediate', duration: 40, type: 'lesson', order: 11, isFree: false },
      { title: 'MongoDB Integration', slug: 'mongodb-integration', description: 'Connecting to MongoDB', difficulty: 'advanced', duration: 45, type: 'lesson', order: 12, isFree: false },
      { title: 'Authentication', slug: 'authentication-nodejs', description: 'JWT and session authentication', difficulty: 'advanced', duration: 50, type: 'lesson', order: 13, isFree: false },
      { title: 'Error Handling', slug: 'error-handling-nodejs', description: 'Handling errors gracefully', difficulty: 'advanced', duration: 30, type: 'lesson', order: 14, isFree: false },
      { title: 'Node.js Project', slug: 'nodejs-project', description: 'Build a complete REST API', difficulty: 'advanced', duration: 90, type: 'project', order: 15, isFree: false }
    ],
    'java': [
      { title: 'Introduction to Java', slug: 'introduction-to-java', description: 'Java programming fundamentals', difficulty: 'beginner', duration: 20, type: 'lesson', order: 1, isFree: true },
      { title: 'JDK Installation', slug: 'jdk-installation', description: 'Setting up Java Development Kit', difficulty: 'beginner', duration: 20, type: 'lesson', order: 2, isFree: true },
      { title: 'Hello World in Java', slug: 'hello-world-java', description: 'Your first Java program', difficulty: 'beginner', duration: 15, type: 'lesson', order: 3, isFree: true },
      { title: 'Variables and Data Types', slug: 'variables-data-types-java', description: 'Java primitive types', difficulty: 'beginner', duration: 25, type: 'lesson', order: 4, isFree: false },
      { title: 'Operators', slug: 'operators-java', description: 'Java operators explained', difficulty: 'beginner', duration: 20, type: 'lesson', order: 5, isFree: false },
      { title: 'Control Flow', slug: 'control-flow-java', description: 'If-else and switch statements', difficulty: 'beginner', duration: 25, type: 'lesson', order: 6, isFree: false },
      { title: 'Loops', slug: 'loops-java', description: 'For, while, and do-while loops', difficulty: 'beginner', duration: 25, type: 'lesson', order: 7, isFree: false },
      { title: 'Arrays', slug: 'arrays-java', description: 'Working with arrays in Java', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 8, isFree: false },
      { title: 'Methods', slug: 'methods-java', description: 'Creating and calling methods', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 9, isFree: false },
      { title: 'Classes and Objects', slug: 'classes-objects-java', description: 'OOP fundamentals in Java', difficulty: 'intermediate', duration: 40, type: 'lesson', order: 10, isFree: false },
      { title: 'Inheritance', slug: 'inheritance-java', description: 'Extending classes in Java', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 11, isFree: false },
      { title: 'Interfaces', slug: 'interfaces-java', description: 'Abstraction with interfaces', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 12, isFree: false },
      { title: 'Exception Handling', slug: 'exception-handling-java', description: 'Try-catch and custom exceptions', difficulty: 'advanced', duration: 35, type: 'lesson', order: 13, isFree: false },
      { title: 'Collections Framework', slug: 'collections-java', description: 'Lists, Sets, and Maps', difficulty: 'advanced', duration: 45, type: 'lesson', order: 14, isFree: false },
      { title: 'Java Project', slug: 'java-project', description: 'Build a Java application', difficulty: 'advanced', duration: 90, type: 'project', order: 15, isFree: false }
    ],
    'typescript': [
      { title: 'Introduction to TypeScript', slug: 'introduction-to-typescript', description: 'Why TypeScript matters', difficulty: 'beginner', duration: 20, type: 'lesson', order: 1, isFree: true },
      { title: 'TypeScript Setup', slug: 'typescript-setup', description: 'Installing and configuring TypeScript', difficulty: 'beginner', duration: 20, type: 'lesson', order: 2, isFree: true },
      { title: 'Basic Types', slug: 'basic-types-ts', description: 'Primitive types in TypeScript', difficulty: 'beginner', duration: 25, type: 'lesson', order: 3, isFree: true },
      { title: 'Type Annotations', slug: 'type-annotations', description: 'Adding types to variables', difficulty: 'beginner', duration: 25, type: 'lesson', order: 4, isFree: false },
      { title: 'Interfaces', slug: 'interfaces-ts', description: 'Defining object shapes', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 5, isFree: false },
      { title: 'Type Aliases', slug: 'type-aliases', description: 'Creating custom types', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 6, isFree: false },
      { title: 'Union and Intersection Types', slug: 'union-intersection-types', description: 'Combining types', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 7, isFree: false },
      { title: 'Functions in TypeScript', slug: 'functions-typescript', description: 'Typed functions', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 8, isFree: false },
      { title: 'Classes', slug: 'classes-ts', description: 'OOP in TypeScript', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 9, isFree: false },
      { title: 'Generics', slug: 'generics-ts', description: 'Reusable type-safe code', difficulty: 'advanced', duration: 40, type: 'lesson', order: 10, isFree: false },
      { title: 'Enums', slug: 'enums-ts', description: 'Enumerated types', difficulty: 'intermediate', duration: 20, type: 'lesson', order: 11, isFree: false },
      { title: 'Modules', slug: 'modules-ts', description: 'Organizing TypeScript code', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 12, isFree: false },
      { title: 'TypeScript with React', slug: 'typescript-react', description: 'Using TypeScript in React apps', difficulty: 'advanced', duration: 45, type: 'lesson', order: 13, isFree: false },
      { title: 'Advanced Types', slug: 'advanced-types-ts', description: 'Mapped and conditional types', difficulty: 'advanced', duration: 45, type: 'lesson', order: 14, isFree: false },
      { title: 'TypeScript Project', slug: 'typescript-project', description: 'Build a TypeScript application', difficulty: 'advanced', duration: 90, type: 'project', order: 15, isFree: false }
    ],
    'mongodb': [
      { title: 'Introduction to MongoDB', slug: 'introduction-to-mongodb', description: 'NoSQL database fundamentals', difficulty: 'beginner', duration: 20, type: 'lesson', order: 1, isFree: true },
      { title: 'Installing MongoDB', slug: 'installing-mongodb', description: 'Set up MongoDB locally', difficulty: 'beginner', duration: 20, type: 'lesson', order: 2, isFree: true },
      { title: 'MongoDB Compass', slug: 'mongodb-compass', description: 'GUI tool for MongoDB', difficulty: 'beginner', duration: 15, type: 'lesson', order: 3, isFree: true },
      { title: 'CRUD Operations', slug: 'crud-operations', description: 'Create, Read, Update, Delete', difficulty: 'beginner', duration: 35, type: 'lesson', order: 4, isFree: false },
      { title: 'Query Operators', slug: 'query-operators', description: 'Comparison and logical operators', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 5, isFree: false },
      { title: 'Indexes', slug: 'indexes-mongodb', description: 'Improving query performance', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 6, isFree: false },
      { title: 'Aggregation Pipeline', slug: 'aggregation-pipeline', description: 'Data processing pipeline', difficulty: 'intermediate', duration: 40, type: 'lesson', order: 7, isFree: false },
      { title: 'Schema Design', slug: 'schema-design', description: 'Designing MongoDB schemas', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 8, isFree: false },
      { title: 'Mongoose ODM', slug: 'mongoose-odm', description: 'Object Data Modeling for Node.js', difficulty: 'intermediate', duration: 40, type: 'lesson', order: 9, isFree: false },
      { title: 'Relationships', slug: 'relationships-mongodb', description: 'Embedding vs referencing', difficulty: 'advanced', duration: 35, type: 'lesson', order: 10, isFree: false },
      { title: 'MongoDB Project', slug: 'mongodb-project', description: 'Build a database-driven app', difficulty: 'advanced', duration: 90, type: 'project', order: 11, isFree: false }
    ],
    'html': [
      { title: 'Introduction to HTML', slug: 'introduction-to-html', description: 'What is HTML and how it works', difficulty: 'beginner', duration: 15, type: 'lesson', order: 1, isFree: true },
      { title: 'HTML Document Structure', slug: 'html-document-structure', description: 'Basic HTML document layout', difficulty: 'beginner', duration: 20, type: 'lesson', order: 2, isFree: true },
      { title: 'Text Elements', slug: 'text-elements', description: 'Headings, paragraphs, and formatting', difficulty: 'beginner', duration: 20, type: 'lesson', order: 3, isFree: true },
      { title: 'Links and Navigation', slug: 'links-navigation', description: 'Creating hyperlinks', difficulty: 'beginner', duration: 20, type: 'lesson', order: 4, isFree: false },
      { title: 'Images and Media', slug: 'images-media', description: 'Adding images and multimedia', difficulty: 'beginner', duration: 25, type: 'lesson', order: 5, isFree: false },
      { title: 'Lists', slug: 'lists-html', description: 'Ordered and unordered lists', difficulty: 'beginner', duration: 20, type: 'lesson', order: 6, isFree: false },
      { title: 'Tables', slug: 'tables-html', description: 'Creating data tables', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 7, isFree: false },
      { title: 'Forms', slug: 'forms-html', description: 'User input and form elements', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 8, isFree: false },
      { title: 'Semantic HTML', slug: 'semantic-html', description: 'Meaningful HTML elements', difficulty: 'intermediate', duration: 25, type: 'lesson', order: 9, isFree: false },
      { title: 'HTML5 Features', slug: 'html5-features', description: 'Modern HTML5 elements', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 10, isFree: false },
      { title: 'HTML Project', slug: 'html-project', description: 'Build a complete webpage', difficulty: 'intermediate', duration: 60, type: 'project', order: 11, isFree: false }
    ],
    'css': [
      { title: 'Introduction to CSS', slug: 'introduction-to-css', description: 'Styling web pages', difficulty: 'beginner', duration: 15, type: 'lesson', order: 1, isFree: true },
      { title: 'CSS Syntax and Selectors', slug: 'css-syntax-selectors', description: 'How to target HTML elements', difficulty: 'beginner', duration: 25, type: 'lesson', order: 2, isFree: true },
      { title: 'Colors and Backgrounds', slug: 'colors-backgrounds', description: 'Styling colors and backgrounds', difficulty: 'beginner', duration: 25, type: 'lesson', order: 3, isFree: true },
      { title: 'Text and Fonts', slug: 'text-fonts', description: 'Typography in CSS', difficulty: 'beginner', duration: 25, type: 'lesson', order: 4, isFree: false },
      { title: 'Box Model', slug: 'box-model', description: 'Understanding the CSS box model', difficulty: 'intermediate', duration: 30, type: 'lesson', order: 5, isFree: false },
      { title: 'Display and Positioning', slug: 'display-positioning', description: 'Layout and positioning elements', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 6, isFree: false },
      { title: 'Flexbox', slug: 'flexbox', description: 'Flexible box layout', difficulty: 'intermediate', duration: 40, type: 'lesson', order: 7, isFree: false },
      { title: 'CSS Grid', slug: 'css-grid', description: 'Two-dimensional layouts', difficulty: 'intermediate', duration: 45, type: 'lesson', order: 8, isFree: false },
      { title: 'Responsive Design', slug: 'responsive-design', description: 'Mobile-first design approach', difficulty: 'intermediate', duration: 35, type: 'lesson', order: 9, isFree: false },
      { title: 'Animations and Transitions', slug: 'animations-transitions', description: 'Adding motion to web pages', difficulty: 'advanced', duration: 40, type: 'lesson', order: 10, isFree: false },
      { title: 'CSS Project', slug: 'css-project', description: 'Build a responsive website', difficulty: 'advanced', duration: 90, type: 'project', order: 11, isFree: false }
    ]
  };

  const techSlug = technology?.slug || 'default';
  const topics = topicsData[techSlug] || topicsData['python'];
  
  return topics.map(topic => ({
    ...topic,
    course: course._id,
    technology: technology?._id,
    content: `# ${topic.title}\n\n${topic.description}\n\nThis is a comprehensive lesson on ${topic.title}. Learn step by step with practical examples and exercises.`,
    codeExamples: [{
      title: `${topic.title} Example`,
      language: techSlug === 'python' ? 'python' : techSlug === 'java' ? 'java' : 'javascript',
      code: `// Example code for ${topic.title}\nconsole.log("Learning ${topic.title}");`,
      explanation: `This example demonstrates the basic concepts of ${topic.title}.`
    }],
    tags: [technology?.name || 'programming', topic.difficulty, topic.type],
    isPublished: true
  }));
};

const seedTopicsLessons = async () => {
  try {
    // Clear existing topics
    await Topic.deleteMany({});
    console.log('   └── Cleared existing topics');

    // Get all courses with their technologies
    const courses = await Course.find().populate('technology');
    
    if (courses.length === 0) {
      console.log('   └── No courses found. Please run courses seeder first.');
      return [];
    }

    const allTopics = [];

    for (const course of courses) {
      const topics = getTopicsForCourse(course, course.technology);
      
      for (const topicData of topics) {
        const topic = new Topic(topicData);
        await topic.save();
        allTopics.push(topic);
      }
    }

    console.log(`   └── Created ${allTopics.length} topics for ${courses.length} courses`);
    return allTopics;
  } catch (error) {
    console.error('   └── Error seeding topics:', error.message);
    throw error;
  }
};

module.exports = { seedTopicsLessons };
