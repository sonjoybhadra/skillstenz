/**
 * Seed new homepage sections: Kids Courses, Testimonials, Why Learn AI, Partners
 * Run: npm run seed:new-sections OR node scripts/seedNewHomepageSections.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const HomeSection = require('../src/modules/homepage/HomeSection');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/techtootalk';

const newSections = [
  // Kids Courses Section
  {
    sectionKey: 'kids_courses',
    title: 'Best Online',
    highlightText: 'AI & Coding Classes',
    subtitle: 'For Kids',
    isActive: true,
    order: 10,
    seeAllLink: '/courses/kids',
    seeAllText: 'Explore All Kids Courses',
    kidsCoursesData: {
      tagline: 'Make your child a future innovator',
      courses: [
        {
          title: 'AI Explorer',
          gradeRange: 'Grade 1-3',
          icon: '🤖',
          description: 'Introduction to AI concepts through fun activities and games',
          features: ['Interactive games', 'Visual programming', 'AI art creation', 'Story-based learning'],
          isActive: true,
          order: 1
        },
        {
          title: 'Code Ninja',
          gradeRange: 'Grade 4-6',
          icon: '🥷',
          description: 'Build games and animations with block-based coding',
          features: ['Scratch programming', 'Game development', 'Logic puzzles', 'Animation creation'],
          isActive: true,
          order: 2
        },
        {
          title: 'Python Prodigy',
          gradeRange: 'Grade 7-9',
          icon: '🐍',
          description: 'Learn Python programming with real projects',
          features: ['Python basics', 'Web scraping', 'Data visualization', 'Mini projects'],
          isActive: true,
          order: 3
        },
        {
          title: 'AI Developer',
          gradeRange: 'Grade 10-12',
          icon: '🧠',
          description: 'Advanced AI & Machine Learning concepts for teens',
          features: ['Machine learning', 'Neural networks', 'AI projects', 'Career preparation'],
          isActive: true,
          order: 4
        }
      ]
    }
  },

  // Why Learn AI Section
  {
    sectionKey: 'why_learn_ai',
    title: 'Why Should Your Child Learn',
    highlightText: 'AI & Coding?',
    subtitle: 'Prepare your child for the future with essential 21st-century skills',
    isActive: true,
    order: 11,
    whyLearnPoints: [
      {
        icon: '🧠',
        title: 'Develops Critical Thinking',
        description: 'Coding teaches kids to break down complex problems into smaller, manageable steps, enhancing their analytical abilities.',
        order: 1
      },
      {
        icon: '🚀',
        title: 'Future-Proof Career',
        description: 'AI and coding skills will be essential in nearly every industry by 2030. Give your child a head start.',
        order: 2
      },
      {
        icon: '💡',
        title: 'Boosts Creativity',
        description: 'Building apps and AI projects encourages creative expression and innovation in ways traditional learning cannot.',
        order: 3
      },
      {
        icon: '🎯',
        title: 'Improves Math Skills',
        description: 'Programming reinforces mathematical concepts through practical application, making math fun and relevant.',
        order: 4
      },
      {
        icon: '🤝',
        title: 'Builds Confidence',
        description: 'Completing coding projects gives kids a sense of achievement and self-confidence they carry into all areas of life.',
        order: 5
      },
      {
        icon: '🌍',
        title: 'Global Opportunities',
        description: 'Coding is a universal language that opens doors worldwide. Your child can collaborate with anyone, anywhere.',
        order: 6
      }
    ]
  },

  // Testimonials Section
  {
    sectionKey: 'testimonials',
    title: 'What Our',
    highlightText: 'Students Say',
    subtitle: 'Hear from our young innovators and their parents',
    isActive: true,
    order: 12,
    testimonials: [
      {
        name: 'Arjun Sharma',
        role: 'Grade 8 Student',
        avatar: '👦',
        rating: 5,
        content: 'I built my first AI chatbot! The courses are super fun and the teachers explain everything so well. I never thought coding could be this exciting.',
        course: 'Python Prodigy',
        isActive: true,
        order: 1
      },
      {
        name: 'Priya Mehta',
        role: 'Parent',
        avatar: '👩',
        rating: 5,
        content: 'My daughter loves the weekend classes. She went from playing games to creating them! The instructors are patient and really know how to engage kids.',
        course: 'Code Ninja',
        isActive: true,
        order: 2
      },
      {
        name: 'Rahul Kumar',
        role: 'Grade 10 Student',
        avatar: '👨‍🎓',
        rating: 5,
        content: 'The AI projects are amazing. I\'m now preparing for national-level coding competitions. This platform gave me the foundation I needed.',
        course: 'AI Developer',
        isActive: true,
        order: 3
      },
      {
        name: 'Sneha Patel',
        role: 'Grade 5 Student',
        avatar: '👧',
        rating: 5,
        content: 'I made my own game with Scratch! My friends think I\'m a coding genius now. I can\'t wait to learn Python next year.',
        course: 'Code Ninja',
        isActive: true,
        order: 4
      },
      {
        name: 'Dr. Vikram Sharma',
        role: 'Parent & Physician',
        avatar: '👨‍⚕️',
        rating: 5,
        content: 'Excellent curriculum and patient instructors. Worth every penny invested in my child\'s future. The progress reports are very helpful too.',
        course: 'AI Explorer',
        isActive: true,
        order: 5
      },
      {
        name: 'Ananya Reddy',
        role: 'Grade 12 Student',
        avatar: '👩‍💻',
        rating: 5,
        content: 'Thanks to TechTooTalk, I got accepted into my dream computer science program. The advanced AI course was exactly what I needed.',
        course: 'AI Developer',
        isActive: true,
        order: 6
      }
    ]
  },

  // Partners Section
  {
    sectionKey: 'partners',
    title: 'Trusted By',
    highlightText: 'Leading Organizations',
    subtitle: 'Our partners and collaborators in education',
    isActive: true,
    order: 13,
    partners: [
      { name: 'Google for Education', logo: '🔵', website: 'https://edu.google.com', isActive: true, order: 1 },
      { name: 'Microsoft Learn', logo: '🟦', website: 'https://learn.microsoft.com', isActive: true, order: 2 },
      { name: 'AWS Educate', logo: '🟠', website: 'https://aws.amazon.com/education', isActive: true, order: 3 },
      { name: 'Meta for Developers', logo: '🔷', website: 'https://developers.facebook.com', isActive: true, order: 4 },
      { name: 'OpenAI', logo: '⚪', website: 'https://openai.com', isActive: true, order: 5 },
      { name: 'NVIDIA AI', logo: '🟩', website: 'https://nvidia.com', isActive: true, order: 6 },
      { name: 'IBM Skills', logo: '🔹', website: 'https://skillsbuild.org', isActive: true, order: 7 },
      { name: 'Intel Education', logo: '🔷', website: 'https://intel.com/education', isActive: true, order: 8 }
    ]
  }
];

async function seedNewSections() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📥 Seeding new homepage sections...\n');

    for (const section of newSections) {
      // Check if section exists
      const existing = await HomeSection.findOne({ sectionKey: section.sectionKey });
      
      if (existing) {
        // Update existing section
        await HomeSection.findOneAndUpdate(
          { sectionKey: section.sectionKey },
          { $set: section },
          { runValidators: true }
        );
        console.log(`   📝 Updated: ${section.sectionKey}`);
      } else {
        // Create new section
        await HomeSection.create(section);
        console.log(`   ✅ Created: ${section.sectionKey}`);
      }
    }

    console.log('\n✅ Homepage sections seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Kids Courses: 4 courses for Grade 1-12');
    console.log('   - Why Learn AI: 6 benefit points');
    console.log('   - Testimonials: 6 student/parent reviews');
    console.log('   - Partners: 8 tech company partners');

  } catch (error) {
    console.error('❌ Error seeding sections:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

seedNewSections();
