/**
 * Master Seeder
 * Runs all seeders in the correct order
 * 
 * Usage: npm run seed:all
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import all seeders
const { seedTechnologyCategories } = require('./seeders/technologyCategoriesSeeder');
const { seedTechnologies } = require('./seeders/technologiesSeeder');
const { seedCourses } = require('./seeders/coursesSeeder');
const { seedTutorials } = require('./seeders/tutorialsSeeder');
const { seedRoadmaps } = require('./seeders/roadmapsSeeder');
const { seedCheatsheets } = require('./seeders/cheatsheetsSeeder');
const { seedBlog } = require('./seeders/blogSeeder');
const { seedTopicsLessons } = require('./seeders/topicsLessonsSeeder');
const { seedMCQs } = require('./seeders/mcqsSeeder');
const { seedTutorialChapters } = require('./seeders/tutorialChaptersSeeder');

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Main seeder function
const runAllSeeders = async () => {
  const startTime = Date.now();
  
  console.log('\n' + '='.repeat(60));
  console.log('🌱 TechTooTalk - Master Seeder');
  console.log('='.repeat(60) + '\n');
  
  const results = {
    technologyCategories: 0,
    technologies: 0,
    courses: 0,
    topics: 0,
    tutorials: 0,
    tutorialChapters: 0,
    roadmaps: 0,
    cheatsheets: 0,
    mcqs: 0,
    blogArticles: 0
  };
  
  try {
    // Connect to database
    await connectDB();
    
    // 1. Technology Categories (must be first)
    console.log('\n📂 Step 1/10: Seeding Technology Categories...');
    const categories = await seedTechnologyCategories();
    results.technologyCategories = categories.length;
    
    // 2. Technologies (depends on categories)
    console.log('\n🔧 Step 2/10: Seeding Technologies...');
    const technologies = await seedTechnologies();
    results.technologies = technologies.length;
    
    // 3. Courses (depends on technologies)
    console.log('\n📚 Step 3/10: Seeding Courses...');
    const courses = await seedCourses();
    results.courses = courses.length;
    
    // 4. Topics & Lessons (depends on courses)
    console.log('\n📝 Step 4/10: Seeding Topics & Lessons...');
    const topics = await seedTopicsLessons();
    results.topics = topics.length;
    
    // 5. Tutorials (depends on technologies) - legacy
    console.log('\n📖 Step 5/10: Seeding Tutorials (legacy)...');
    const tutorials = await seedTutorials();
    results.tutorials = tutorials.length;
    
    // 6. Tutorial Chapters (depends on technologies) - comprehensive
    console.log('\n📕 Step 6/10: Seeding Tutorial Chapters (all technologies)...');
    const tutorialChapters = await seedTutorialChapters();
    results.tutorialChapters = tutorialChapters.length;
    
    // 7. Roadmaps (standalone)
    console.log('\n🗺️  Step 7/10: Seeding Roadmaps...');
    const roadmaps = await seedRoadmaps();
    results.roadmaps = roadmaps.length;
    
    // 8. Cheatsheets (depends on technologies)
    console.log('\n📋 Step 8/10: Seeding Cheatsheets...');
    const cheatsheets = await seedCheatsheets();
    results.cheatsheets = cheatsheets.length;
    
    // 9. MCQs (depends on technologies & courses)
    console.log('\n❓ Step 9/10: Seeding MCQs (500 questions)...');
    const mcqs = await seedMCQs();
    results.mcqs = mcqs.length;
    
    // 10. Blog (categories + articles)
    console.log('\n📝 Step 10/10: Seeding Blog...');
    const articles = await seedBlog();
    results.blogArticles = articles.length;
    
    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   ├── Technology Categories: ${results.technologyCategories}`);
    console.log(`   ├── Technologies: ${results.technologies}`);
    console.log(`   ├── Courses: ${results.courses}`);
    console.log(`   ├── Topics & Lessons: ${results.topics}`);
    console.log(`   ├── Tutorials (legacy): ${results.tutorials}`);
    console.log(`   ├── Tutorial Chapters: ${results.tutorialChapters}`);
    console.log(`   ├── Roadmaps: ${results.roadmaps}`);
    console.log(`   ├── Cheatsheets: ${results.cheatsheets}`);
    console.log(`   ├── MCQs: ${results.mcqs}`);
    console.log(`   └── Blog Articles: ${results.blogArticles}`);
    console.log(`\n⏱️  Total time: ${duration} seconds`);
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB\n');
    process.exit(0);
  }
};

// Run individual seeders
const runSeeder = async (seederName) => {
  const seeders = {
    'categories': seedTechnologyCategories,
    'technologies': seedTechnologies,
    'courses': seedCourses,
    'topics': seedTopicsLessons,
    'tutorials': seedTutorials,
    'tutorial-chapters': seedTutorialChapters,
    'roadmaps': seedRoadmaps,
    'cheatsheets': seedCheatsheets,
    'mcqs': seedMCQs,
    'blog': seedBlog
  };
  
  const seeder = seeders[seederName];
  
  if (!seeder) {
    console.error(`❌ Unknown seeder: ${seederName}`);
    console.log('Available seeders:', Object.keys(seeders).join(', '));
    process.exit(1);
  }
  
  try {
    await connectDB();
    console.log(`\n🌱 Running ${seederName} seeder...\n`);
    await seeder();
    console.log(`\n✅ ${seederName} seeder completed!\n`);
  } catch (error) {
    console.error(`\n❌ ${seederName} seeder failed:`, error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);

if (args.length > 0 && args[0] !== 'all') {
  // Run specific seeder
  runSeeder(args[0]);
} else {
  // Run all seeders
  runAllSeeders();
}

module.exports = { runAllSeeders, runSeeder };
