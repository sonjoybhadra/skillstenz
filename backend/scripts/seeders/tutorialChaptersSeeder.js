/**
 * Tutorial Chapters Seeder
 * Creates chapters for ALL technologies (not just a few)
 */

const TutorialChapter = require('../../src/modules/tutorials/Tutorial');
const Technology = require('../../src/modules/technologies/Technology');

// Generate chapters based on technology type
const generateChaptersForTechnology = (technology) => {
  const slug = technology.slug;
  const name = technology.name;
  
  // Define chapter templates for different technology categories
  const chapterTemplates = {
    // Programming Languages
    programmingLanguage: [
      { title: `Introduction to ${name}`, slug: 'introduction', icon: '📚', difficulty: 'beginner', time: 10, order: 1 },
      { title: `${name} Installation & Setup`, slug: 'installation-setup', icon: '⚙️', difficulty: 'beginner', time: 15, order: 2 },
      { title: `Hello World in ${name}`, slug: 'hello-world', icon: '👋', difficulty: 'beginner', time: 10, order: 3 },
      { title: 'Variables & Data Types', slug: 'variables-data-types', icon: '📦', difficulty: 'beginner', time: 20, order: 4 },
      { title: 'Operators', slug: 'operators', icon: '➕', difficulty: 'beginner', time: 15, order: 5 },
      { title: 'Control Flow - Conditionals', slug: 'conditionals', icon: '🔀', difficulty: 'beginner', time: 20, order: 6 },
      { title: 'Loops', slug: 'loops', icon: '🔄', difficulty: 'beginner', time: 20, order: 7 },
      { title: 'Functions', slug: 'functions', icon: '⚡', difficulty: 'intermediate', time: 25, order: 8 },
      { title: 'Arrays / Lists', slug: 'arrays-lists', icon: '📋', difficulty: 'intermediate', time: 25, order: 9 },
      { title: 'Objects / Dictionaries', slug: 'objects-dictionaries', icon: '🗂️', difficulty: 'intermediate', time: 25, order: 10 },
      { title: 'String Manipulation', slug: 'strings', icon: '📝', difficulty: 'intermediate', time: 20, order: 11 },
      { title: 'Error Handling', slug: 'error-handling', icon: '🚨', difficulty: 'intermediate', time: 20, order: 12 },
      { title: 'File I/O', slug: 'file-io', icon: '📂', difficulty: 'intermediate', time: 20, order: 13 },
      { title: 'Modules & Packages', slug: 'modules-packages', icon: '📦', difficulty: 'intermediate', time: 20, order: 14 },
      { title: 'OOP - Classes & Objects', slug: 'oop-classes', icon: '🏗️', difficulty: 'advanced', time: 30, order: 15 },
      { title: 'OOP - Inheritance', slug: 'oop-inheritance', icon: '👨‍👧', difficulty: 'advanced', time: 25, order: 16 },
      { title: 'Best Practices', slug: 'best-practices', icon: '✨', difficulty: 'advanced', time: 20, order: 17 },
    ],
    // Web Frameworks
    webFramework: [
      { title: `Introduction to ${name}`, slug: 'introduction', icon: '📚', difficulty: 'beginner', time: 15, order: 1 },
      { title: 'Getting Started', slug: 'getting-started', icon: '🚀', difficulty: 'beginner', time: 20, order: 2 },
      { title: 'Project Structure', slug: 'project-structure', icon: '📁', difficulty: 'beginner', time: 15, order: 3 },
      { title: 'Core Concepts', slug: 'core-concepts', icon: '💡', difficulty: 'beginner', time: 25, order: 4 },
      { title: 'Components', slug: 'components', icon: '🧩', difficulty: 'intermediate', time: 25, order: 5 },
      { title: 'State Management', slug: 'state-management', icon: '🔄', difficulty: 'intermediate', time: 30, order: 6 },
      { title: 'Routing', slug: 'routing', icon: '🛤️', difficulty: 'intermediate', time: 25, order: 7 },
      { title: 'Forms & Validation', slug: 'forms-validation', icon: '📝', difficulty: 'intermediate', time: 25, order: 8 },
      { title: 'API Integration', slug: 'api-integration', icon: '🔌', difficulty: 'intermediate', time: 30, order: 9 },
      { title: 'Styling', slug: 'styling', icon: '🎨', difficulty: 'intermediate', time: 20, order: 10 },
      { title: 'Authentication', slug: 'authentication', icon: '🔐', difficulty: 'advanced', time: 30, order: 11 },
      { title: 'Performance Optimization', slug: 'performance', icon: '⚡', difficulty: 'advanced', time: 25, order: 12 },
      { title: 'Testing', slug: 'testing', icon: '🧪', difficulty: 'advanced', time: 25, order: 13 },
      { title: 'Deployment', slug: 'deployment', icon: '🌐', difficulty: 'advanced', time: 20, order: 14 },
      { title: 'Best Practices', slug: 'best-practices', icon: '✨', difficulty: 'advanced', time: 20, order: 15 },
    ],
    // Database
    database: [
      { title: `Introduction to ${name}`, slug: 'introduction', icon: '📚', difficulty: 'beginner', time: 15, order: 1 },
      { title: 'Installation & Setup', slug: 'installation', icon: '⚙️', difficulty: 'beginner', time: 20, order: 2 },
      { title: 'Basic Concepts', slug: 'basic-concepts', icon: '💡', difficulty: 'beginner', time: 20, order: 3 },
      { title: 'Data Types', slug: 'data-types', icon: '📦', difficulty: 'beginner', time: 15, order: 4 },
      { title: 'CRUD Operations', slug: 'crud-operations', icon: '✏️', difficulty: 'beginner', time: 25, order: 5 },
      { title: 'Querying Data', slug: 'querying', icon: '🔍', difficulty: 'intermediate', time: 30, order: 6 },
      { title: 'Filtering & Sorting', slug: 'filtering-sorting', icon: '📊', difficulty: 'intermediate', time: 25, order: 7 },
      { title: 'Indexing', slug: 'indexing', icon: '📑', difficulty: 'intermediate', time: 25, order: 8 },
      { title: 'Relationships', slug: 'relationships', icon: '🔗', difficulty: 'intermediate', time: 30, order: 9 },
      { title: 'Aggregation', slug: 'aggregation', icon: '📈', difficulty: 'advanced', time: 30, order: 10 },
      { title: 'Transactions', slug: 'transactions', icon: '💱', difficulty: 'advanced', time: 25, order: 11 },
      { title: 'Security', slug: 'security', icon: '🔐', difficulty: 'advanced', time: 25, order: 12 },
      { title: 'Backup & Recovery', slug: 'backup-recovery', icon: '💾', difficulty: 'advanced', time: 20, order: 13 },
      { title: 'Performance Tuning', slug: 'performance', icon: '⚡', difficulty: 'advanced', time: 25, order: 14 },
    ],
    // DevOps & Tools
    devops: [
      { title: `Introduction to ${name}`, slug: 'introduction', icon: '📚', difficulty: 'beginner', time: 15, order: 1 },
      { title: 'Installation & Setup', slug: 'installation', icon: '⚙️', difficulty: 'beginner', time: 20, order: 2 },
      { title: 'Basic Commands', slug: 'basic-commands', icon: '💻', difficulty: 'beginner', time: 25, order: 3 },
      { title: 'Core Concepts', slug: 'core-concepts', icon: '💡', difficulty: 'beginner', time: 20, order: 4 },
      { title: 'Configuration', slug: 'configuration', icon: '🔧', difficulty: 'intermediate', time: 25, order: 5 },
      { title: 'Workflows', slug: 'workflows', icon: '🔄', difficulty: 'intermediate', time: 30, order: 6 },
      { title: 'Best Practices', slug: 'best-practices', icon: '✨', difficulty: 'intermediate', time: 25, order: 7 },
      { title: 'Troubleshooting', slug: 'troubleshooting', icon: '🔍', difficulty: 'advanced', time: 25, order: 8 },
      { title: 'Advanced Usage', slug: 'advanced-usage', icon: '🚀', difficulty: 'advanced', time: 30, order: 9 },
      { title: 'Integration', slug: 'integration', icon: '🔌', difficulty: 'advanced', time: 25, order: 10 },
    ],
    // AI & ML
    aiml: [
      { title: `Introduction to ${name}`, slug: 'introduction', icon: '📚', difficulty: 'beginner', time: 20, order: 1 },
      { title: 'Prerequisites & Setup', slug: 'setup', icon: '⚙️', difficulty: 'beginner', time: 25, order: 2 },
      { title: 'Core Concepts', slug: 'core-concepts', icon: '💡', difficulty: 'beginner', time: 30, order: 3 },
      { title: 'Getting Started', slug: 'getting-started', icon: '🚀', difficulty: 'beginner', time: 25, order: 4 },
      { title: 'Data Preparation', slug: 'data-preparation', icon: '📊', difficulty: 'intermediate', time: 30, order: 5 },
      { title: 'Model Building', slug: 'model-building', icon: '🏗️', difficulty: 'intermediate', time: 35, order: 6 },
      { title: 'Training & Evaluation', slug: 'training-evaluation', icon: '🎯', difficulty: 'intermediate', time: 35, order: 7 },
      { title: 'Optimization', slug: 'optimization', icon: '⚡', difficulty: 'advanced', time: 30, order: 8 },
      { title: 'Deployment', slug: 'deployment', icon: '🌐', difficulty: 'advanced', time: 30, order: 9 },
      { title: 'Best Practices', slug: 'best-practices', icon: '✨', difficulty: 'advanced', time: 25, order: 10 },
    ],
    // Mobile Development
    mobile: [
      { title: `Introduction to ${name}`, slug: 'introduction', icon: '📚', difficulty: 'beginner', time: 15, order: 1 },
      { title: 'Environment Setup', slug: 'setup', icon: '⚙️', difficulty: 'beginner', time: 25, order: 2 },
      { title: 'First App', slug: 'first-app', icon: '📱', difficulty: 'beginner', time: 20, order: 3 },
      { title: 'UI Components', slug: 'ui-components', icon: '🧩', difficulty: 'beginner', time: 30, order: 4 },
      { title: 'Layouts', slug: 'layouts', icon: '📐', difficulty: 'intermediate', time: 25, order: 5 },
      { title: 'Navigation', slug: 'navigation', icon: '🧭', difficulty: 'intermediate', time: 25, order: 6 },
      { title: 'State Management', slug: 'state-management', icon: '🔄', difficulty: 'intermediate', time: 30, order: 7 },
      { title: 'Data Storage', slug: 'data-storage', icon: '💾', difficulty: 'intermediate', time: 25, order: 8 },
      { title: 'Networking', slug: 'networking', icon: '🌐', difficulty: 'intermediate', time: 30, order: 9 },
      { title: 'Native Features', slug: 'native-features', icon: '📲', difficulty: 'advanced', time: 30, order: 10 },
      { title: 'Testing', slug: 'testing', icon: '🧪', difficulty: 'advanced', time: 25, order: 11 },
      { title: 'Publishing', slug: 'publishing', icon: '🚀', difficulty: 'advanced', time: 25, order: 12 },
    ],
    // CSS Frameworks
    cssFramework: [
      { title: `Introduction to ${name}`, slug: 'introduction', icon: '📚', difficulty: 'beginner', time: 10, order: 1 },
      { title: 'Installation', slug: 'installation', icon: '⚙️', difficulty: 'beginner', time: 15, order: 2 },
      { title: 'Basic Usage', slug: 'basic-usage', icon: '🎨', difficulty: 'beginner', time: 20, order: 3 },
      { title: 'Layout System', slug: 'layout', icon: '📐', difficulty: 'beginner', time: 25, order: 4 },
      { title: 'Typography', slug: 'typography', icon: '✏️', difficulty: 'beginner', time: 15, order: 5 },
      { title: 'Colors & Backgrounds', slug: 'colors', icon: '🎨', difficulty: 'intermediate', time: 20, order: 6 },
      { title: 'Spacing & Sizing', slug: 'spacing', icon: '📏', difficulty: 'intermediate', time: 20, order: 7 },
      { title: 'Components', slug: 'components', icon: '🧩', difficulty: 'intermediate', time: 25, order: 8 },
      { title: 'Responsive Design', slug: 'responsive', icon: '📱', difficulty: 'intermediate', time: 25, order: 9 },
      { title: 'Customization', slug: 'customization', icon: '🔧', difficulty: 'advanced', time: 25, order: 10 },
      { title: 'Best Practices', slug: 'best-practices', icon: '✨', difficulty: 'advanced', time: 20, order: 11 },
    ],
    // Default/Generic
    default: [
      { title: `Introduction to ${name}`, slug: 'introduction', icon: '📚', difficulty: 'beginner', time: 15, order: 1 },
      { title: 'Getting Started', slug: 'getting-started', icon: '🚀', difficulty: 'beginner', time: 20, order: 2 },
      { title: 'Core Concepts', slug: 'core-concepts', icon: '💡', difficulty: 'beginner', time: 25, order: 3 },
      { title: 'Basic Usage', slug: 'basic-usage', icon: '⚙️', difficulty: 'beginner', time: 20, order: 4 },
      { title: 'Intermediate Topics', slug: 'intermediate', icon: '📈', difficulty: 'intermediate', time: 30, order: 5 },
      { title: 'Advanced Features', slug: 'advanced', icon: '🔥', difficulty: 'advanced', time: 30, order: 6 },
      { title: 'Best Practices', slug: 'best-practices', icon: '✨', difficulty: 'advanced', time: 20, order: 7 },
      { title: 'Resources & Next Steps', slug: 'resources', icon: '📖', difficulty: 'beginner', time: 10, order: 8 },
    ]
  };

  // Determine which template to use based on technology
  const programmingLangs = ['python', 'javascript', 'java', 'cpp', 'c', 'go', 'rust', 'typescript', 'php', 'ruby', 'swift', 'kotlin', 'csharp', 'scala', 'perl', 'r', 'dart', 'lua', 'haskell', 'elixir'];
  const webFrameworks = ['react', 'angular', 'vue', 'nextjs', 'nuxt', 'svelte', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails', 'nestjs', 'remix', 'astro', 'gatsby'];
  const databases = ['mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'sqlite', 'oracle', 'mariadb', 'cassandra', 'dynamodb', 'firebase', 'supabase'];
  const devopsTools = ['git', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'aws', 'azure', 'gcp', 'linux', 'nginx', 'github-actions', 'circleci', 'grafana', 'prometheus'];
  const aimlTech = ['tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'opencv', 'langchain', 'huggingface', 'openai', 'machine-learning', 'deep-learning', 'nlp', 'computer-vision'];
  const mobileDev = ['react-native', 'flutter', 'ios', 'android', 'xamarin', 'ionic'];
  const cssFrameworks = ['tailwindcss', 'bootstrap', 'sass', 'less', 'css', 'html'];

  let template;
  if (programmingLangs.includes(slug)) {
    template = chapterTemplates.programmingLanguage;
  } else if (webFrameworks.includes(slug)) {
    template = chapterTemplates.webFramework;
  } else if (databases.includes(slug)) {
    template = chapterTemplates.database;
  } else if (devopsTools.includes(slug)) {
    template = chapterTemplates.devops;
  } else if (aimlTech.includes(slug)) {
    template = chapterTemplates.aiml;
  } else if (mobileDev.includes(slug)) {
    template = chapterTemplates.mobile;
  } else if (cssFrameworks.includes(slug)) {
    template = chapterTemplates.cssFramework;
  } else {
    template = chapterTemplates.default;
  }

  // Generate chapters from template
  return template.map(ch => ({
    technology: technology._id,
    title: ch.title,
    slug: ch.slug,
    description: `Learn ${ch.title.toLowerCase()} with practical examples and hands-on exercises.`,
    content: generateChapterContent(ch.title, name, ch.difficulty),
    order: ch.order,
    icon: ch.icon,
    estimatedTime: ch.time,
    difficulty: ch.difficulty,
    keyPoints: generateKeyPoints(ch.title, name),
    codeExamples: generateCodeExamples(ch.title, slug),
    isPublished: true
  }));
};

const generateChapterContent = (title, techName, difficulty) => {
  return `# ${title}

Welcome to the **${title}** chapter of our ${techName} tutorial series.

## Overview

This ${difficulty}-level chapter covers essential concepts that every ${techName} developer should know.

## What You'll Learn

In this chapter, you will:
- Understand the fundamentals of ${title.toLowerCase()}
- Learn best practices and common patterns
- Practice with hands-on examples
- Build confidence in using these concepts

## Prerequisites

Before starting this chapter, make sure you:
- Have ${techName} installed on your system
- Understand basic programming concepts
- Completed previous chapters in this series

## Let's Get Started!

${title} is a fundamental concept in ${techName} programming. Understanding it will help you write better, more efficient code.

### Key Concepts

1. **Understanding the Basics** - Start with the foundational principles
2. **Practical Application** - Apply what you learn with real examples
3. **Best Practices** - Learn industry-standard approaches
4. **Common Pitfalls** - Avoid typical mistakes beginners make

## Summary

By the end of this chapter, you should be comfortable with ${title.toLowerCase()} in ${techName}. Practice these concepts regularly to reinforce your learning.

## Next Steps

Continue to the next chapter to build upon these concepts and expand your ${techName} knowledge.
`;
};

const generateKeyPoints = (title, techName) => {
  return [
    `Understand the basics of ${title.toLowerCase()}`,
    `Learn practical applications in ${techName}`,
    `Master common patterns and best practices`,
    `Avoid typical mistakes and pitfalls`,
    `Build real-world skills through examples`
  ];
};

const generateCodeExamples = (title, techSlug) => {
  const codeTemplates = {
    python: { language: 'python', code: `# ${title} Example in Python\nprint("Learning ${title}")\n\n# Practice exercise\ndef example():\n    """Demonstrate ${title}"""\n    return "Success!"` },
    javascript: { language: 'javascript', code: `// ${title} Example in JavaScript\nconsole.log("Learning ${title}");\n\n// Practice exercise\nfunction example() {\n  return "Success!";\n}` },
    java: { language: 'java', code: `// ${title} Example in Java\npublic class Example {\n    public static void main(String[] args) {\n        System.out.println("Learning ${title}");\n    }\n}` },
    typescript: { language: 'typescript', code: `// ${title} Example in TypeScript\nconst message: string = "Learning ${title}";\nconsole.log(message);\n\nfunction example(): string {\n  return "Success!";\n}` },
    cpp: { language: 'cpp', code: `// ${title} Example in C++\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Learning ${title}" << endl;\n    return 0;\n}` },
    go: { language: 'go', code: `// ${title} Example in Go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Learning ${title}")\n}` },
    rust: { language: 'rust', code: `// ${title} Example in Rust\nfn main() {\n    println!("Learning ${title}");\n}` },
    html: { language: 'html', code: `<!-- ${title} Example in HTML -->\n<!DOCTYPE html>\n<html>\n<head>\n    <title>${title}</title>\n</head>\n<body>\n    <h1>Learning ${title}</h1>\n</body>\n</html>` },
    css: { language: 'css', code: `/* ${title} Example in CSS */\n.example {\n    /* ${title} styles */\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}` }
  };

  const template = codeTemplates[techSlug] || codeTemplates.javascript;
  
  return [{
    title: `${title} Example`,
    language: template.language,
    code: template.code,
    output: 'Success!'
  }];
};

const seedTutorialChapters = async () => {
  try {
    // Clear existing tutorial chapters
    await TutorialChapter.deleteMany({});
    console.log('   └── Cleared existing tutorial chapters');

    // Get all published technologies
    const technologies = await Technology.find({ isPublished: true });
    
    if (technologies.length === 0) {
      console.log('   └── No technologies found. Please run technologies seeder first.');
      return [];
    }

    const allChapters = [];

    for (const technology of technologies) {
      const chapters = generateChaptersForTechnology(technology);
      
      for (const chapterData of chapters) {
        const chapter = new TutorialChapter(chapterData);
        await chapter.save();
        allChapters.push(chapter);
      }
    }

    // Group by technology for summary
    const chaptersByTech = {};
    allChapters.forEach(ch => {
      const techId = ch.technology.toString();
      chaptersByTech[techId] = (chaptersByTech[techId] || 0) + 1;
    });

    console.log(`   └── Created ${allChapters.length} chapters for ${technologies.length} technologies`);
    console.log(`   └── Average ${Math.round(allChapters.length / technologies.length)} chapters per technology`);
    
    return allChapters;
  } catch (error) {
    console.error('   └── Error seeding tutorial chapters:', error.message);
    throw error;
  }
};

module.exports = { seedTutorialChapters };
