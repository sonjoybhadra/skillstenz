// Categories and articles seed data for SkillsTenz
// 15 categories, each with 10 articles

const categories = [
  // Example category structure. The full file will contain 15 categories.
  {
    name: 'Programming Basics',
    description: 'Foundational concepts and skills for new programmers.',
    articles: [
      {
        title: 'What is Programming?',
        seoDescription: 'A beginner-friendly introduction to programming concepts and logic.',
        content: 'Programming is the process of creating instructions for computers to follow. It involves logic, problem-solving, and creativity. In this article, you will learn what programming is, why it matters, and how to get started.',
        keyLearningPoints: [
          'Understand the definition of programming',
          'Recognize the importance of logic and problem-solving',
          'Identify common programming languages'
        ],
        conclusion: 'Programming is a valuable skill that opens many opportunities.'
      },
      // ... 9 more articles ...
    ]
  },
  // ... 14 more categories ...
];

module.exports = categories;
