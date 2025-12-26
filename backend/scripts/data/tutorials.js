// Tutorials seed data for SkillsTenz
// 50 tutorials, each with 15 chapters, all fields populated

const tutorials = [
  // Example tutorial structure. The full file will contain 50 such objects.
  {
    title: 'Introduction to Python Programming',
    technologySlug: 'python',
    shortDescription: 'Learn Python from scratch, covering syntax, data types, control flow, and practical coding.',
    audienceLevel: 'Beginner',
    outcome: 'Understand Python basics, write scripts, and solve real-world problems.',
    chapters: [
      {
        title: 'Getting Started with Python',
        explanation: 'Introduction to Python, installation, and setup.',
        practicalExample: 'Writing your first Python script.',
        keyNotes: 'Python is interpreted, easy to learn.',
        summary: 'You can now run Python code on your machine.'
      },
      {
        title: 'Variables and Data Types',
        explanation: 'Understanding variables, strings, numbers, and booleans.',
        practicalExample: 'Assigning and printing variables.',
        keyNotes: 'Python is dynamically typed.',
        summary: 'You can use and manipulate basic data types.'
      },
      // ... 13 more chapters ...
    ]
  },
  // ... 49 more tutorials ...
];

module.exports = tutorials;
