/**
 * Blog Articles Seeder
 * Seeds blog posts with categories and tags
 */

const Article = require('../../src/models/Article');
const Category = require('../../src/models/Category');
const Tag = require('../../src/models/Tag');
const User = require('../../src/modules/auth/User');

// All unique tags used across articles
const allTags = [
  { name: 'Python', slug: 'python', color: '#3572A5' },
  { name: 'Beginner', slug: 'beginner', color: '#22C55E' },
  { name: 'Projects', slug: 'projects', color: '#8B5CF6' },
  { name: 'Learning', slug: 'learning', color: '#06B6D4' },
  { name: 'Portfolio', slug: 'portfolio', color: '#F59E0B' },
  { name: 'React', slug: 'react', color: '#61DAFB' },
  { name: 'Hooks', slug: 'hooks', color: '#EC4899' },
  { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
  { name: 'Frontend', slug: 'frontend', color: '#3B82F6' },
  { name: 'Web Development', slug: 'web-development', color: '#10B981' },
  { name: 'Career', slug: 'career', color: '#6366F1' },
  { name: 'Job Search', slug: 'job-search', color: '#EF4444' },
  { name: 'Interview', slug: 'interview', color: '#F59E0B' },
  { name: 'Resume', slug: 'resume', color: '#14B8A6' },
  { name: 'Senior Developer', slug: 'senior-developer', color: '#8B5CF6' },
  { name: 'Skills', slug: 'skills', color: '#06B6D4' },
  { name: 'Growth', slug: 'growth', color: '#22C55E' },
  { name: 'Leadership', slug: 'leadership', color: '#6366F1' },
  { name: 'Clean Code', slug: 'clean-code', color: '#10B981' },
  { name: 'Best Practices', slug: 'best-practices', color: '#3B82F6' },
  { name: 'Programming', slug: 'programming', color: '#8B5CF6' },
  { name: 'Code Quality', slug: 'code-quality', color: '#22C55E' },
  { name: 'Git', slug: 'git', color: '#F05032' },
  { name: 'Version Control', slug: 'version-control', color: '#6366F1' },
  { name: 'Teamwork', slug: 'teamwork', color: '#06B6D4' },
  { name: 'Workflow', slug: 'workflow', color: '#F59E0B' },
  { name: 'VS Code', slug: 'vscode', color: '#007ACC' },
  { name: 'Extensions', slug: 'extensions', color: '#8B5CF6' },
  { name: 'Productivity', slug: 'productivity', color: '#22C55E' },
  { name: 'Tools', slug: 'tools', color: '#EF4444' },
  { name: 'Developer Experience', slug: 'developer-experience', color: '#EC4899' },
  { name: 'Resources', slug: 'resources', color: '#3B82F6' },
  { name: 'Free', slug: 'free', color: '#22C55E' },
  { name: 'Questions', slug: 'questions', color: '#F59E0B' },
  { name: 'Preparation', slug: 'preparation', color: '#06B6D4' },
  { name: 'System Design', slug: 'system-design', color: '#6366F1' },
  { name: 'Architecture', slug: 'architecture', color: '#8B5CF6' },
  { name: 'Scaling', slug: 'scaling', color: '#EF4444' },
  { name: 'Fullstack', slug: 'fullstack', color: '#10B981' },
  { name: 'Ideas', slug: 'ideas', color: '#F59E0B' },
  { name: 'AI', slug: 'ai', color: '#8B5CF6' },
  { name: 'Copilot', slug: 'copilot', color: '#000000' },
  { name: 'ChatGPT', slug: 'chatgpt', color: '#10A37F' },
  { name: 'Future', slug: 'future', color: '#6366F1' },
  { name: 'Technology', slug: 'technology', color: '#3B82F6' },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
  { name: 'Opinion', slug: 'opinion', color: '#EC4899' }
];

// Blog categories to seed
const blogCategories = [
  {
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Step-by-step guides and how-to articles',
    icon: '📖',
    color: '#3B82F6',
    isActive: true
  },
  {
    name: 'Career Tips',
    slug: 'career-tips',
    description: 'Advice for developers at all stages of their careers',
    icon: '💼',
    color: '#10B981',
    isActive: true
  },
  {
    name: 'Industry News',
    slug: 'industry-news',
    description: 'Latest trends and news in tech industry',
    icon: '📰',
    color: '#8B5CF6',
    isActive: true
  },
  {
    name: 'Best Practices',
    slug: 'best-practices',
    description: 'Coding standards and development best practices',
    icon: '✨',
    color: '#F59E0B',
    isActive: true
  },
  {
    name: 'Tools & Resources',
    slug: 'tools-resources',
    description: 'Reviews and recommendations for developer tools',
    icon: '🛠️',
    color: '#EF4444',
    isActive: true
  },
  {
    name: 'Interview Prep',
    slug: 'interview-prep',
    description: 'Technical interview preparation and tips',
    icon: '🎯',
    color: '#EC4899',
    isActive: true
  },
  {
    name: 'Project Ideas',
    slug: 'project-ideas',
    description: 'Project ideas to build your portfolio',
    icon: '💡',
    color: '#06B6D4',
    isActive: true
  },
  {
    name: 'Opinion',
    slug: 'opinion',
    description: 'Thoughts and opinions on tech topics',
    icon: '💭',
    color: '#6366F1',
    isActive: true
  }
];

const getArticles = (categoryMap, authorId) => [
  // Tutorial Articles
  {
    title: '10 Python Projects for Beginners in 2024',
    slug: '10-python-projects-beginners-2024',
    excerpt: 'Build these beginner-friendly Python projects to strengthen your programming skills and create an impressive portfolio.',
    content: `
# 10 Python Projects for Beginners in 2024

Are you learning Python and wondering what to build? Here are 10 beginner-friendly projects that will help you practice programming concepts while creating something useful.

## 1. To-Do List Application

Build a simple command-line to-do app that lets you add, view, and delete tasks. This project teaches you about lists, user input, and basic CRUD operations.

**Skills you'll learn:**
- Working with lists
- User input handling
- File I/O for persistence

## 2. Calculator

Create a basic calculator that can perform arithmetic operations. Start simple and gradually add more features.

**Features to implement:**
- Basic operations (+, -, *, /)
- History of calculations
- Scientific functions

## 3. Password Generator

Build a secure password generator that creates random passwords based on user preferences.

\`\`\`python
import random
import string

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for _ in range(length))
    return password
\`\`\`

## 4. Web Scraper

Learn to extract data from websites using Beautiful Soup and requests library.

## 5. Quiz Game

Create an interactive quiz game that tests knowledge on various topics.

## 6. Weather App

Build a CLI app that fetches weather data from an API and displays it nicely.

## 7. Expense Tracker

Track your daily expenses and generate spending reports.

## 8. URL Shortener

Create a simple URL shortening service using Flask.

## 9. Hangman Game

Implement the classic word guessing game with ASCII art.

## 10. File Organizer

Build a script that automatically organizes files in a directory by type.

## Conclusion

These projects will give you hands-on experience with Python fundamentals. Start with the simpler ones and gradually work your way up to more complex projects.
    `,
    author: authorId,
    category: categoryMap['tutorials'],
    tags: ['python', 'beginner', 'projects', 'learning', 'portfolio'],
    thumbnail: '/images/blog/python-projects.jpg',
    readTime: 8,
    isPublished: true,
    featured: true,
    views: 15420,
    likes: 342
  },
  {
    title: 'Understanding React Hooks: A Complete Guide',
    slug: 'understanding-react-hooks-complete-guide',
    excerpt: 'Master React Hooks with this comprehensive guide covering useState, useEffect, useContext, and custom hooks.',
    content: `
# Understanding React Hooks: A Complete Guide

React Hooks revolutionized how we write React components. In this guide, we'll explore the most important hooks and how to use them effectively.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## useState

The most fundamental hook for managing state in functional components.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

### Best Practices with useState

1. **Use multiple state variables** for unrelated data
2. **Group related state** in objects when appropriate
3. **Use functional updates** when new state depends on previous

## useEffect

Handle side effects like data fetching, subscriptions, and DOM manipulation.

\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      setUser(data);
    }
    
    fetchUser();
  }, [userId]);
  
  return user ? <h1>{user.name}</h1> : <p>Loading...</p>;
}
\`\`\`

## useContext

Access context values without prop drilling.

## Custom Hooks

Create reusable logic by extracting hook logic into custom hooks.

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  const setValue = (value) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  return [storedValue, setValue];
}
\`\`\`

## Conclusion

Hooks provide a more direct way to use React features. Master these hooks to write cleaner, more maintainable React code.
    `,
    author: authorId,
    category: categoryMap['tutorials'],
    tags: ['react', 'hooks', 'javascript', 'frontend', 'web-development'],
    thumbnail: '/images/blog/react-hooks.jpg',
    readTime: 12,
    isPublished: true,
    featured: true,
    views: 23150,
    likes: 567
  },

  // Career Tips Articles
  {
    title: 'How to Land Your First Developer Job in 2024',
    slug: 'land-first-developer-job-2024',
    excerpt: 'A practical guide to breaking into tech as a new developer with actionable tips for job searching, interviewing, and standing out.',
    content: `
# How to Land Your First Developer Job in 2024

Breaking into tech can feel overwhelming, but with the right strategy, you can land your first developer job. Here's a comprehensive guide based on what actually works.

## Build a Strong Foundation

Before applying, ensure you have:

### Technical Skills
- Proficiency in at least one programming language
- Understanding of data structures and algorithms
- Version control with Git
- Basic web development (HTML, CSS, JavaScript)

### Projects That Matter

Your portfolio projects should:
1. **Solve real problems** - Not just tutorial clones
2. **Be deployed and accessible** - Show them live
3. **Have clean code** - Well-documented and organized
4. **Include a README** - Explain what it does and how

## Optimize Your Resume

### Key Elements
- Keep it to one page
- Lead with projects, not education
- Quantify achievements when possible
- Use keywords from job descriptions

### Avoid Common Mistakes
- Don't list every technology you've touched
- Remove irrelevant work experience
- Proofread multiple times

## The Job Search Strategy

### Where to Apply
- LinkedIn (optimize your profile first)
- Company career pages directly
- AngelList for startups
- Local tech meetups and events

### Quality Over Quantity
Apply to 5-10 targeted jobs per day rather than mass-applying to hundreds.

## Interview Preparation

### Technical Interviews
- Practice LeetCode/HackerRank (focus on easy/medium)
- Review CS fundamentals
- Practice explaining your projects

### Behavioral Interviews
- Use the STAR method
- Have examples ready for common questions
- Research the company thoroughly

## Stand Out from the Crowd

1. **Contribute to open source** - Shows collaboration skills
2. **Write blog posts** - Demonstrates communication
3. **Build in public** - Share your journey on Twitter/LinkedIn
4. **Network genuinely** - Not just when you need something

## Conclusion

Landing your first dev job takes persistence. Focus on continuous learning, building real projects, and putting yourself out there.
    `,
    author: authorId,
    category: categoryMap['career-tips'],
    tags: ['career', 'job-search', 'beginner', 'interview', 'resume'],
    thumbnail: '/images/blog/first-dev-job.jpg',
    readTime: 10,
    isPublished: true,
    featured: true,
    views: 45230,
    likes: 1203
  },
  {
    title: 'From Junior to Senior Developer: Skills You Need',
    slug: 'junior-to-senior-developer-skills',
    excerpt: 'Learn the key skills and mindset shifts that separate junior developers from senior engineers.',
    content: `
# From Junior to Senior Developer: Skills You Need

The journey from junior to senior developer isn't just about years of experience—it's about developing specific skills and changing how you approach problems.

## Technical Excellence

### Beyond Coding
- **System Design** - Understand how pieces fit together
- **Performance Optimization** - Know when and how to optimize
- **Security Awareness** - Build with security in mind
- **Testing Strategy** - Write meaningful tests

### Code Quality
- Write self-documenting code
- Understand design patterns
- Know when NOT to use patterns
- Refactor consistently

## Soft Skills That Matter

### Communication
- Explain technical concepts to non-technical stakeholders
- Write clear documentation
- Give and receive code reviews constructively

### Leadership
- Mentor junior developers
- Lead technical discussions
- Make decisions with incomplete information

## Problem-Solving Approach

### Junior Developer
- "How do I implement this feature?"
- Focus on the code
- Need detailed specifications

### Senior Developer
- "Should we implement this feature?"
- Focus on the business impact
- Can work with ambiguous requirements

## Key Mindset Shifts

1. **Own the outcome, not just the code**
2. **Think in systems, not features**
3. **Prioritize maintainability over cleverness**
4. **Embrace teaching as part of the job**

## Continuous Learning

- Stay updated with industry trends
- Learn adjacent technologies
- Understand the business domain

## Conclusion

Becoming a senior developer is a gradual process. Focus on continuous improvement and take on increasingly challenging responsibilities.
    `,
    author: authorId,
    category: categoryMap['career-tips'],
    tags: ['career', 'senior-developer', 'skills', 'growth', 'leadership'],
    thumbnail: '/images/blog/junior-senior.jpg',
    readTime: 9,
    isPublished: true,
    featured: false,
    views: 18760,
    likes: 456
  },

  // Best Practices Articles
  {
    title: 'Clean Code Principles Every Developer Should Know',
    slug: 'clean-code-principles-developers',
    excerpt: 'Learn the fundamental principles of writing clean, maintainable code that your future self and teammates will thank you for.',
    content: `
# Clean Code Principles Every Developer Should Know

Clean code is not just about making code work—it's about making code readable, maintainable, and a joy to work with.

## Why Clean Code Matters

- **Easier maintenance** - You'll read code more than you write it
- **Fewer bugs** - Clear code has fewer places for bugs to hide
- **Better collaboration** - Others can understand and contribute
- **Faster onboarding** - New team members ramp up quickly

## Naming Things

### Variables and Functions
\`\`\`javascript
// Bad
const d = new Date();
const x = users.filter(u => u.a > 18);

// Good
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 18);
\`\`\`

### Guidelines
- Use meaningful, pronounceable names
- Avoid mental mapping
- Use searchable names
- Don't add unnecessary context

## Functions

### Keep Them Small
A function should do ONE thing and do it well.

\`\`\`javascript
// Bad - Does too much
function processUser(user) {
  validateUser(user);
  saveToDatabase(user);
  sendWelcomeEmail(user);
  updateAnalytics(user);
}

// Good - Single responsibility
function validateAndSaveUser(user) {
  validateUser(user);
  return saveToDatabase(user);
}

function onboardNewUser(user) {
  const savedUser = validateAndSaveUser(user);
  sendWelcomeEmail(savedUser);
  updateAnalytics(savedUser);
}
\`\`\`

## Comments

### Code Should Be Self-Documenting
\`\`\`javascript
// Bad - Comment explains what code does
// Check if user is admin
if (user.role === 'admin') { ... }

// Good - Code explains itself
if (user.isAdmin()) { ... }
\`\`\`

### When to Comment
- Explain WHY, not WHAT
- Clarify complex business logic
- Document public APIs

## Error Handling

- Don't ignore caught errors
- Provide context in error messages
- Use custom error classes when appropriate

## The Boy Scout Rule

"Leave the code better than you found it."

Small improvements add up over time.

## Conclusion

Clean code is a skill that develops with practice. Start applying these principles today and watch your code quality improve.
    `,
    author: authorId,
    category: categoryMap['best-practices'],
    tags: ['clean-code', 'best-practices', 'programming', 'code-quality'],
    thumbnail: '/images/blog/clean-code.jpg',
    readTime: 11,
    isPublished: true,
    featured: true,
    views: 32100,
    likes: 890
  },
  {
    title: 'Git Best Practices for Development Teams',
    slug: 'git-best-practices-teams',
    excerpt: 'Essential Git workflows and best practices to keep your development team productive and your codebase healthy.',
    content: `
# Git Best Practices for Development Teams

A well-organized Git workflow can make or break team productivity. Here are best practices that will help your team collaborate effectively.

## Commit Best Practices

### Write Good Commit Messages
\`\`\`
# Bad
git commit -m "fix"
git commit -m "updates"

# Good
git commit -m "Fix user authentication redirect loop"
git commit -m "Add pagination to products API endpoint"
\`\`\`

### Atomic Commits
Each commit should represent one logical change.

## Branching Strategy

### Git Flow
- \`main\` - Production-ready code
- \`develop\` - Integration branch
- \`feature/*\` - New features
- \`hotfix/*\` - Production fixes

### Branch Naming
\`\`\`
feature/user-authentication
bugfix/login-redirect
hotfix/security-patch
chore/update-dependencies
\`\`\`

## Pull Requests

### Creating Good PRs
- Keep them small and focused
- Write descriptive titles
- Include context in the description
- Link related issues

### Code Review Etiquette
- Be constructive, not critical
- Explain the "why" behind suggestions
- Approve when requirements are met
- Respond promptly to reviews

## Keeping History Clean

### Rebase vs Merge
Use rebase for feature branches, merge for main/develop.

### Interactive Rebase
Clean up commits before merging:
\`\`\`bash
git rebase -i HEAD~3
\`\`\`

## Protecting Branches

- Require pull request reviews
- Require status checks to pass
- Prevent force pushes to main

## Conclusion

Consistent Git practices lead to a healthier codebase and happier team. Start implementing these practices incrementally.
    `,
    author: authorId,
    category: categoryMap['best-practices'],
    tags: ['git', 'version-control', 'teamwork', 'workflow', 'best-practices'],
    thumbnail: '/images/blog/git-practices.jpg',
    readTime: 8,
    isPublished: true,
    featured: false,
    views: 14560,
    likes: 324
  },

  // Tools & Resources Articles
  {
    title: 'VS Code Extensions Every Developer Needs in 2024',
    slug: 'vscode-extensions-2024',
    excerpt: 'Boost your productivity with these must-have VS Code extensions for web development, debugging, and code quality.',
    content: `
# VS Code Extensions Every Developer Needs in 2024

VS Code's power comes from its extensions. Here are the essential extensions that will supercharge your development workflow.

## Code Quality

### ESLint
Automatically find and fix problems in your JavaScript/TypeScript code.

### Prettier
Opinionated code formatter that ensures consistent code style.

### SonarLint
Catch bugs and security issues as you code.

## Productivity

### GitHub Copilot
AI-powered code completion that suggests entire functions.

### Auto Rename Tag
Automatically rename paired HTML/JSX tags.

### Path Intellisense
Autocomplete file paths in your code.

## Visual Enhancements

### Material Icon Theme
Beautiful file icons for better file recognition.

### One Dark Pro
Popular dark theme that's easy on the eyes.

### Bracket Pair Colorizer 2
Color-code matching brackets for easier reading.

## Git Integration

### GitLens
Supercharge Git capabilities with blame info, history, and more.

### Git Graph
Visualize your repository's Git history.

## Framework-Specific

### ES7+ React/Redux Snippets
Shortcuts for React development.

### Tailwind CSS IntelliSense
Autocomplete for Tailwind classes.

### Vue Language Features
Official Vue.js support.

## Debugging

### Thunder Client
Lightweight REST API client built into VS Code.

### Console Ninja
See console.log output inline in your code.

## Settings to Configure

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.wordWrap": "on"
}
\`\`\`

## Conclusion

Start with these essentials and add more as you discover your needs. Remember, more extensions mean slower startup times!
    `,
    author: authorId,
    category: categoryMap['tools-resources'],
    tags: ['vscode', 'extensions', 'productivity', 'tools', 'developer-experience'],
    thumbnail: '/images/blog/vscode-extensions.jpg',
    readTime: 7,
    isPublished: true,
    featured: true,
    views: 28930,
    likes: 678
  },
  {
    title: 'Free Resources to Learn Web Development in 2024',
    slug: 'free-resources-learn-web-development-2024',
    excerpt: 'A curated list of the best free resources to learn HTML, CSS, JavaScript, and modern web frameworks.',
    content: `
# Free Resources to Learn Web Development in 2024

You don't need to spend a fortune to learn web development. Here are the best free resources available.

## HTML & CSS

### freeCodeCamp
The gold standard for free coding education. Complete the Responsive Web Design certification.

### MDN Web Docs
The definitive reference for web technologies.

### CSS-Tricks
Excellent articles and tutorials on CSS.

## JavaScript

### JavaScript.info
Comprehensive JavaScript tutorial from basics to advanced.

### Eloquent JavaScript
Free online book covering JavaScript in depth.

### 30 Days of JavaScript
30 mini-projects to master JavaScript.

## React

### Official React Documentation
Recently revamped with interactive examples.

### Scrimba
Free interactive courses with hands-on coding.

### Full Stack Open
University of Helsinki's modern web development course.

## Backend

### The Odin Project
Full-stack curriculum covering Node.js.

### Node.js Documentation
Official guides and API reference.

## Practice Platforms

### Frontend Mentor
Real-world projects with designs provided.

### Codewars
Level up with coding challenges.

### LeetCode
Technical interview preparation.

## YouTube Channels

- **Traversy Media** - Practical tutorials
- **The Net Ninja** - Framework deep-dives
- **Fireship** - Quick, modern content
- **Web Dev Simplified** - Clear explanations

## Tips for Learning

1. **Don't tutorial hop** - Complete one resource before starting another
2. **Build projects** - Apply what you learn immediately
3. **Read documentation** - Get comfortable with official docs
4. **Join communities** - Discord, Reddit, Twitter

## Conclusion

With these free resources, lack of money is not a barrier to learning web development. The only investment required is your time and dedication.
    `,
    author: authorId,
    category: categoryMap['tools-resources'],
    tags: ['learning', 'resources', 'free', 'web-development', 'beginner'],
    thumbnail: '/images/blog/free-resources.jpg',
    readTime: 9,
    isPublished: true,
    featured: false,
    views: 52340,
    likes: 1456
  },

  // Interview Prep Articles
  {
    title: 'Top 20 JavaScript Interview Questions for 2024',
    slug: 'javascript-interview-questions-2024',
    excerpt: 'Prepare for your next JavaScript interview with these commonly asked questions and detailed answers.',
    content: `
# Top 20 JavaScript Interview Questions for 2024

Ace your JavaScript interview with these essential questions and answers.

## 1. Explain Closures

A closure is a function that has access to variables from its outer scope even after the outer function has returned.

\`\`\`javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
\`\`\`

## 2. What's the difference between == and ===?

- \`==\` compares values with type coercion
- \`===\` compares values and types strictly

Always use \`===\` unless you have a specific reason not to.

## 3. Explain Event Delegation

Event delegation leverages event bubbling to handle events at a higher level in the DOM.

## 4. What is the Event Loop?

The event loop allows JavaScript to perform non-blocking operations despite being single-threaded.

## 5. Explain Promises

Promises represent the eventual completion or failure of an async operation.

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});

promise.then(result => console.log(result));
\`\`\`

## 6. What's the difference between var, let, and const?

- \`var\` - function-scoped, hoisted
- \`let\` - block-scoped, can be reassigned
- \`const\` - block-scoped, cannot be reassigned

## 7. Explain Hoisting

Variable and function declarations are moved to the top of their scope during compilation.

## 8. What are Arrow Functions?

Arrow functions provide a concise syntax and don't bind their own \`this\`.

## 9. Explain this Keyword

\`this\` refers to the object that is executing the current function.

## 10. What is the Spread Operator?

Spreads elements of an iterable into individual elements.

\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
\`\`\`

## Interview Tips

1. Think out loud
2. Ask clarifying questions
3. Consider edge cases
4. Discuss trade-offs

## Conclusion

Practice these questions and understand the concepts deeply. Good luck with your interview!
    `,
    author: authorId,
    category: categoryMap['interview-prep'],
    tags: ['javascript', 'interview', 'job-search', 'preparation', 'questions'],
    thumbnail: '/images/blog/js-interview.jpg',
    readTime: 15,
    isPublished: true,
    featured: true,
    views: 67890,
    likes: 2134
  },
  {
    title: 'System Design Interview: A Beginner\'s Guide',
    slug: 'system-design-interview-beginners-guide',
    excerpt: 'Learn the fundamentals of system design interviews with practical examples and a structured approach.',
    content: `
# System Design Interview: A Beginner's Guide

System design interviews test your ability to design scalable systems. Here's how to approach them.

## The Framework

### 1. Clarify Requirements (5 minutes)
Ask questions to understand scope:
- What features are needed?
- How many users?
- What's the read/write ratio?

### 2. High-Level Design (10 minutes)
Draw the main components:
- Client
- Load Balancer
- Web Servers
- Database
- Cache

### 3. Deep Dive (20 minutes)
Detail specific components based on interviewer interest.

### 4. Wrap Up (5 minutes)
Discuss bottlenecks, trade-offs, and improvements.

## Key Concepts

### Scaling
- **Vertical** - Bigger machines
- **Horizontal** - More machines

### Load Balancing
Distribute traffic across servers.

### Caching
Store frequently accessed data for quick retrieval.

### Database
- SQL for structured data and ACID
- NoSQL for flexibility and scale

### CAP Theorem
Choose 2 of 3: Consistency, Availability, Partition Tolerance.

## Common Designs

### URL Shortener
- Hash function for short codes
- Key-value store for mappings
- Cache for popular URLs

### Twitter Timeline
- Write: Fan-out on write vs read
- Read: Cache user timelines
- Consider celebrity problem

## Practice Tips

1. Practice with a whiteboard
2. Time yourself
3. Study real-world architectures
4. Read engineering blogs

## Conclusion

System design is a skill that improves with practice. Start designing systems you use daily and analyze how they might work.
    `,
    author: authorId,
    category: categoryMap['interview-prep'],
    tags: ['system-design', 'interview', 'architecture', 'scaling', 'preparation'],
    thumbnail: '/images/blog/system-design.jpg',
    readTime: 14,
    isPublished: true,
    featured: false,
    views: 34560,
    likes: 876
  },

  // Project Ideas Articles
  {
    title: '15 Full-Stack Project Ideas to Build Your Portfolio',
    slug: 'fullstack-project-ideas-portfolio',
    excerpt: 'Impress employers with these full-stack project ideas that demonstrate real-world skills.',
    content: `
# 15 Full-Stack Project Ideas to Build Your Portfolio

Build these projects to showcase your full-stack development skills.

## Beginner Level

### 1. Personal Blog
Build a blog with user authentication, markdown support, and comments.

**Tech Stack:** React, Node.js, MongoDB

### 2. Task Manager
Create a Kanban-style task management app with drag-and-drop.

**Tech Stack:** Vue.js, Express, PostgreSQL

### 3. Recipe App
Share and discover recipes with search and filtering.

**Tech Stack:** Next.js, Prisma, SQLite

## Intermediate Level

### 4. E-commerce Store
Full shopping experience with cart, checkout, and payments.

**Tech Stack:** React, Node.js, Stripe, MongoDB

### 5. Social Media Clone
Build a simplified Twitter or Instagram clone.

**Tech Stack:** Next.js, Firebase, Tailwind CSS

### 6. Job Board
Post and apply to jobs with resume uploads.

**Tech Stack:** Django, React, PostgreSQL

### 7. Real-time Chat App
Build a Slack-like chat with channels and direct messages.

**Tech Stack:** React, Socket.io, MongoDB

## Advanced Level

### 8. Video Streaming Platform
Upload, process, and stream videos like YouTube.

**Tech Stack:** Next.js, AWS S3, FFmpeg

### 9. Project Management Tool
Full Jira-like tool with sprints and workflows.

**Tech Stack:** React, GraphQL, PostgreSQL

### 10. AI-Powered App
Integrate GPT for smart features like summarization.

**Tech Stack:** Python, FastAPI, OpenAI API

## Portfolio Tips

1. **Deploy everything** - Make it accessible online
2. **Write documentation** - README with setup instructions
3. **Show process** - Record demos or write case studies
4. **Iterate** - Keep improving based on feedback

## Conclusion

Choose projects that excite you and push your limits. Quality over quantity—3 great projects beat 10 mediocre ones.
    `,
    author: authorId,
    category: categoryMap['project-ideas'],
    tags: ['projects', 'portfolio', 'fullstack', 'learning', 'ideas'],
    thumbnail: '/images/blog/project-ideas.jpg',
    readTime: 10,
    isPublished: true,
    featured: true,
    views: 41230,
    likes: 1567
  },

  // Industry News Articles
  {
    title: 'The Rise of AI in Software Development: What Developers Need to Know',
    slug: 'ai-software-development-developers-guide',
    excerpt: 'How AI tools like GitHub Copilot are changing the way we write code and what it means for developers.',
    content: `
# The Rise of AI in Software Development

AI is transforming how we build software. Here's what you need to know.

## The Current Landscape

### GitHub Copilot
AI pair programmer that suggests code as you type.

### ChatGPT
General-purpose AI for code explanations, debugging, and more.

### Specialized Tools
- Tabnine
- Amazon CodeWhisperer
- Cody by Sourcegraph

## How Developers Are Using AI

### Code Generation
Write boilerplate code and implement common patterns.

### Debugging
Explain errors and suggest fixes.

### Documentation
Generate comments and documentation.

### Learning
Ask questions and get explanations.

## Will AI Replace Developers?

Short answer: No.

AI tools are amplifiers, not replacements. They:
- Speed up routine tasks
- Reduce context switching
- Help with unfamiliar languages/frameworks

But they can't:
- Understand business requirements
- Make architectural decisions
- Debug complex systems
- Replace human creativity

## How to Adapt

1. **Learn to prompt effectively** - Get better at working with AI
2. **Focus on fundamentals** - Understand what AI generates
3. **Develop soft skills** - Communication, problem-solving
4. **Stay curious** - Explore new AI tools and capabilities

## The Future

AI will likely:
- Handle more boilerplate
- Improve code review
- Enhance testing and documentation
- Enable faster prototyping

## Conclusion

Embrace AI as a tool in your toolkit. The developers who thrive will be those who effectively leverage AI while bringing uniquely human skills to the table.
    `,
    author: authorId,
    category: categoryMap['industry-news'],
    tags: ['ai', 'copilot', 'chatgpt', 'future', 'technology'],
    thumbnail: '/images/blog/ai-development.jpg',
    readTime: 8,
    isPublished: true,
    featured: true,
    views: 56780,
    likes: 1890
  },

  // Opinion Articles
  {
    title: 'Why Every Developer Should Learn TypeScript in 2024',
    slug: 'developers-learn-typescript-2024',
    excerpt: 'A case for why TypeScript should be your next learning priority and how it makes you a better developer.',
    content: `
# Why Every Developer Should Learn TypeScript in 2024

If you're still writing plain JavaScript in 2024, here's why you should make the switch to TypeScript.

## The Benefits

### Catch Bugs Early
TypeScript catches errors at compile time instead of runtime.

\`\`\`typescript
// JavaScript - fails at runtime
function greet(name) {
  return "Hello, " + name.toUpperCase();
}
greet(123); // Runtime error!

// TypeScript - fails at compile time
function greet(name: string) {
  return "Hello, " + name.toUpperCase();
}
greet(123); // Compile error!
\`\`\`

### Better IDE Support
Get intelligent autocomplete, refactoring, and navigation.

### Self-Documenting Code
Types serve as documentation that never goes out of date.

### Safer Refactoring
The compiler tells you what breaks when you change things.

## Common Objections

### "It's too verbose"
Modern TypeScript has excellent type inference. You often write less explicit types than you'd expect.

### "It slows me down"
Initial slowdown, yes. But you save time debugging production issues.

### "JavaScript is fine"
For small projects, maybe. But as projects grow, TypeScript's benefits compound.

## Getting Started

1. Start with \`strict: false\` and gradually enable rules
2. Use \`.ts\` extension for new files
3. Add types incrementally
4. Learn utility types as you need them

## Conclusion

TypeScript isn't just a trend—it's become the standard for serious JavaScript development. Learn it, and you'll wonder how you ever coded without it.
    `,
    author: authorId,
    category: categoryMap['opinion'],
    tags: ['typescript', 'javascript', 'opinion', 'programming', 'learning'],
    thumbnail: '/images/blog/typescript-opinion.jpg',
    readTime: 7,
    isPublished: true,
    featured: false,
    views: 23450,
    likes: 567
  }
];

async function seedBlogCategories() {
  try {
    console.log('📁 Seeding Blog Categories...');
    
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert new categories
    const result = await Category.insertMany(blogCategories);
    
    console.log(`✅ Seeded ${result.length} blog categories`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding blog categories:', error.message);
    throw error;
  }
}

async function seedArticles() {
  try {
    console.log('📝 Seeding Blog Articles...');
    
    // Seed tags first
    console.log('🏷️  Seeding Tags...');
    await Tag.deleteMany({});
    const tagDocs = await Tag.insertMany(allTags);
    const tagMap = {};
    tagDocs.forEach(tag => {
      tagMap[tag.slug] = tag._id;
    });
    console.log(`✅ Seeded ${tagDocs.length} tags`);
    
    // Get all categories
    const categories = await Category.find({});
    const categoryMap = {};
    for (const cat of categories) {
      categoryMap[cat.slug] = cat._id;
    }
    
    if (Object.keys(categoryMap).length === 0) {
      console.warn('⚠️  No blog categories found. Please run blog category seeder first.');
      return [];
    }
    
    // Get an author
    let author = await User.findOne({ role: 'admin' });
    if (!author) {
      author = await User.findOne({});
    }
    
    const authorId = author ? author._id : null;
    
    // Clear existing articles
    await Article.deleteMany({});
    
    // Get articles with references
    const articles = getArticles(categoryMap, authorId);
    
    // Convert tag slugs to ObjectIds
    const articlesWithTagIds = articles.map(article => {
      const tagIds = (article.tags || [])
        .map(tagSlug => tagMap[tagSlug])
        .filter(id => id); // Filter out undefined
      return { ...article, tags: tagIds };
    });
    
    // Filter out articles with missing references
    const validArticles = articlesWithTagIds.filter(article => article.category);
    
    // Insert new articles
    const result = await Article.insertMany(validArticles);
    
    console.log(`✅ Seeded ${result.length} blog articles`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding articles:', error.message);
    throw error;
  }
}

async function seedBlog() {
  try {
    await seedBlogCategories();
    const articles = await seedArticles();
    return articles;
  } catch (error) {
    console.error('❌ Error seeding blog:', error.message);
    throw error;
  }
}

module.exports = { seedBlog, seedBlogCategories, seedArticles, blogCategories, getArticles };
