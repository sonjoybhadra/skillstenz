export interface Course {
  id: string;
  title: string;
  description: string;
  technology: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  topics: number;
  lessons?: number;
  thumbnail?: string;
  image?: string;
  featured?: boolean;
  content?: string;
  slug: string; // Add slug for URL routing
  price?: 'free' | 'paid';
  instructor?: string | {
    name: string;
    title: string;
    avatar?: string;
    bio?: string;
    rating?: number;
    students?: number;
    courses?: number;
  };
  rating?: number;
  students?: number;
  studentsCount?: number;
  tags?: string[];
  learningObjectives?: string[];
  prerequisites?: string[];
}

export interface Technology {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
}

// Mock course data
export const courses: Course[] = [
  {
    id: 'python-basics',
    slug: 'python-programming-fundamentals',
    title: 'Python Programming Fundamentals',
    description: 'Learn the basics of Python programming from scratch. Perfect for beginners who want to start their coding journey.',
    technology: 'python',
    level: 'Beginner',
    duration: '8 hours',
    topics: 24,
    lessons: 24,
    image: '/api/placeholder/400/300',
    featured: true,
    price: 'free',
    instructor: {
      name: 'Sarah Johnson',
      title: 'Senior Python Developer',
      avatar: '/api/placeholder/100/100',
      bio: '10+ years of Python development experience, author of "Python for Beginners" book.',
      rating: 4.8,
      students: 1250,
      courses: 5
    },
    rating: 4.8,
    students: 1250,
    studentsCount: 1250,
    tags: ['Python', 'Programming', 'Beginner', 'Data Science'],
    learningObjectives: [
      'Understand Python syntax and basic concepts',
      'Work with variables, data types, and operators',
      'Create and use functions and modules',
      'Handle files and data persistence',
      'Build simple applications and scripts'
    ],
    prerequisites: ['Basic computer skills', 'No prior programming experience required'],
    content: 'Complete Python basics including variables, data types, loops, functions, and object-oriented programming.'
  },
  {
    id: 'javascript-essentials',
    slug: 'javascript-essentials-modern-web-development',
    title: 'JavaScript Essentials for Modern Web Development',
    description: 'Master JavaScript fundamentals including ES6+, asynchronous programming, and modern development practices.',
    technology: 'javascript',
    level: 'Intermediate',
    duration: '12 hours',
    topics: 32,
    featured: true,
    price: 'paid',
    instructor: 'TechToTalk Academy',
    rating: 4.9,
    studentsCount: 2100,
    content: 'Comprehensive JavaScript course covering modern syntax, promises, async/await, modules, and best practices.'
  },
  {
    id: 'react-hooks-guide',
    slug: 'react-hooks-complete-guide',
    title: 'React Hooks: A Complete Guide',
    description: 'Learn how to use React Hooks effectively to build modern, maintainable React applications.',
    technology: 'react',
    level: 'Intermediate',
    duration: '6 hours',
    topics: 18,
    content: 'Master useState, useEffect, useContext, custom hooks, and advanced patterns for React development.'
  },
  {
    id: 'nodejs-backend',
    slug: 'building-backend-apis-nodejs',
    title: 'Building Backend APIs with Node.js',
    description: 'Create robust backend APIs using Node.js, Express, and modern JavaScript practices.',
    technology: 'nodejs',
    level: 'Intermediate',
    duration: '10 hours',
    topics: 28,
    price: 'paid',
    instructor: 'TechToTalk Academy',
    rating: 4.7,
    studentsCount: 890,
    content: 'Learn to build RESTful APIs, handle authentication, work with databases, and deploy Node.js applications.'
  },
  {
    id: 'ai-machine-learning',
    slug: 'introduction-ai-machine-learning',
    title: 'Introduction to AI and Machine Learning',
    description: 'Explore the fundamentals of artificial intelligence and machine learning with practical Python examples.',
    technology: 'ai',
    level: 'Beginner',
    duration: '15 hours',
    topics: 40,
    featured: true,
    price: 'paid',
    instructor: 'TechToTalk Academy',
    rating: 4.9,
    studentsCount: 3200,
    content: 'Cover AI concepts, supervised/unsupervised learning, neural networks, and practical ML projects.'
  },
  {
    id: 'database-design',
    slug: 'database-design-sql-mastery',
    title: 'Database Design and SQL Mastery',
    description: 'Learn database design principles, SQL queries, and database management for modern applications.',
    technology: 'database',
    level: 'Beginner',
    duration: '9 hours',
    topics: 25,
    price: 'free',
    instructor: 'TechToTalk Academy',
    rating: 4.6,
    studentsCount: 1450,
    content: 'Master SQL, database normalization, indexing, and work with both SQL and NoSQL databases.'
  },
  {
    id: 'python-data-science',
    slug: 'python-data-science-analytics',
    title: 'Python for Data Science and Analytics',
    description: 'Use Python libraries like Pandas, NumPy, and Matplotlib for data analysis and visualization.',
    technology: 'python',
    level: 'Intermediate',
    duration: '14 hours',
    topics: 35,
    price: 'paid',
    instructor: 'TechToTalk Academy',
    rating: 4.8,
    studentsCount: 2800,
    content: 'Learn data manipulation, statistical analysis, data visualization, and machine learning with Python.'
  },
  {
    id: 'react-native-mobile',
    slug: 'react-native-cross-platform-mobile-apps',
    title: 'React Native: Cross-Platform Mobile Apps',
    description: 'Build native mobile applications for iOS and Android using React Native and Expo.',
    technology: 'react',
    level: 'Advanced',
    duration: '16 hours',
    topics: 42,
    price: 'paid',
    instructor: 'TechToTalk Academy',
    rating: 4.7,
    studentsCount: 1650,
    content: 'Create mobile apps, handle navigation, integrate APIs, and deploy to app stores.'
  },
  {
    id: 'advanced-javascript',
    slug: 'advanced-javascript-concepts',
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into advanced JavaScript topics including closures, prototypes, and performance optimization.',
    technology: 'javascript',
    level: 'Advanced',
    duration: '11 hours',
    topics: 30,
    price: 'paid',
    instructor: 'TechToTalk Academy',
    rating: 4.8,
    studentsCount: 1950,
    content: 'Master advanced JS concepts, design patterns, performance, and modern development workflows.'
  },
  {
    id: 'security-engineer-foundations',
    slug: 'foundations-modern-public-sector-security-operations-center',
    title: 'Foundations of Modern Public Sector Security Operations Center',
    description: 'Learn the fundamentals of security operations in public sector environments.',
    technology: 'security',
    level: 'Intermediate',
    duration: '12 hours',
    topics: 28,
    price: 'paid',
    instructor: 'TechToTalk Academy',
    rating: 4.9,
    studentsCount: 750,
    content: 'Comprehensive security operations training for public sector security engineers.'
  }
];

export const technologies: Technology[] = [
  {
    slug: 'python',
    name: 'Python',
    description: 'Learn Python programming for web development, data science, and automation.',
    icon: 'fa-python',
    color: 'bg-blue-500',
    courseCount: 2
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    description: 'Master JavaScript for modern web development and full-stack applications.',
    icon: 'fa-js',
    color: 'bg-yellow-500',
    courseCount: 2
  },
  {
    slug: 'react',
    name: 'React',
    description: 'Build modern user interfaces with React and related technologies.',
    icon: 'fa-react',
    color: 'bg-blue-400',
    courseCount: 2
  },
  {
    slug: 'nodejs',
    name: 'Node.js',
    description: 'Create server-side applications and APIs with Node.js and Express.',
    icon: 'fa-node-js',
    color: 'bg-green-500',
    courseCount: 1
  },
  {
    slug: 'ai',
    name: 'AI & ML',
    description: 'Explore artificial intelligence and machine learning with Python.',
    icon: 'fa-brain',
    color: 'bg-purple-500',
    courseCount: 1
  },
  {
    slug: 'database',
    name: 'Databases',
    description: 'Learn database design, SQL, and modern database technologies.',
    icon: 'fa-database',
    color: 'bg-orange-500',
    courseCount: 1
  },
  {
    slug: 'security',
    name: 'Security',
    description: 'Master cybersecurity, security operations, and information protection.',
    icon: 'fa-shield-alt',
    color: 'bg-red-500',
    courseCount: 1
  }
];

// Helper functions
export function getCoursesByTechnology(technologySlug: string): Course[] {
  return courses.filter(course => course.technology === technologySlug);
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(course => course.slug === slug);
}

export function getTechnologyBySlug(slug: string): Technology | undefined {
  return technologies.find(technology => technology.slug === slug);
}

export function getFeaturedCourses(): Course[] {
  return courses.filter(course => course.featured);
}

export function getCoursesByLevel(level: string): Course[] {
  return courses.filter(course => course.level === level);
}

export function getFreeCourses(): Course[] {
  return courses.filter(course => course.price === 'free');
}

export function getPaidCourses(): Course[] {
  return courses.filter(course => course.price === 'paid');
}

export function getCoursesByInstructor(instructor: string): Course[] {
  return courses.filter(course => course.instructor === instructor);
}

// Generate static params for all courses
export function getAllCourseSlugs(): { slug: string }[] {
  return courses.map(course => ({ slug: course.slug }));
}

// Generate static params for all technologies
export function getAllTechnologySlugs(): { slug: string }[] {
  return technologies.map(technology => ({ slug: technology.slug }));
}