// Courses seed data for SkillsTenz
// 5 courses per technology, each with 10 topics, each topic with 15 lessons

const courses = [
  // Example course structure. The full file will contain 5 courses per technology.
  {
    technology: 'python', // slug reference
    title: 'Python Fundamentals',
    objective: 'Master the basics of Python programming for web, data, and automation.',
    duration: '20 hours',
    skillLevel: 'Beginner',
    topics: [
      {
        title: 'Variables and Data Types',
        conceptExplanation: 'Learn about variables, data types, and type conversion in Python.',
        realWorldUseCase: 'Storing user input and processing data.',
        bestPractices: 'Use descriptive variable names and proper types.',
        lessons: [
          {
            title: 'Introduction to Variables',
            explanation: 'What are variables and how to use them in Python.',
            example: 'x = 5\nname = "Alice"',
            practiceTask: 'Create variables for age, name, and city.'
          },
          // ... 14 more lessons ...
        ]
      },
      // ... 9 more topics ...
    ]
  },
  // ... more courses for other technologies ...
];

module.exports = courses;
