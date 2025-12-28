/**
 * Technology Categories Seeder
 * Seeds technology categories for the platform
 */

const TechnologyCategory = require('../../src/modules/technologies/TechnologyCategory');

const technologyCategories = [
  {
    name: 'Programming Languages',
    slug: 'programming-languages',
    description: 'Core programming languages for software development',
    icon: '💻',
    color: '#3B82F6',
    order: 1,
    isPublished: true,
    featured: true
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend and backend web technologies',
    icon: '🌐',
    color: '#10B981',
    order: 2,
    isPublished: true,
    featured: true
  },
  {
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'iOS, Android and cross-platform mobile development',
    icon: '📱',
    color: '#8B5CF6',
    order: 3,
    isPublished: true,
    featured: true
  },
  {
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'AI, Machine Learning and Deep Learning technologies',
    icon: '🤖',
    color: '#EC4899',
    order: 4,
    isPublished: true,
    featured: true
  },
  {
    name: 'Data Science',
    slug: 'data-science',
    description: 'Data analysis, visualization and scientific computing',
    icon: '📊',
    color: '#F59E0B',
    order: 5,
    isPublished: true,
    featured: true
  },
  {
    name: 'DevOps & Cloud',
    slug: 'devops-cloud',
    description: 'Cloud computing, containerization and CI/CD',
    icon: '☁️',
    color: '#06B6D4',
    order: 6,
    isPublished: true,
    featured: true
  },
  {
    name: 'Database',
    slug: 'database',
    description: 'SQL, NoSQL and database management systems',
    icon: '🗄️',
    color: '#EF4444',
    order: 7,
    isPublished: true,
    featured: false
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Security, ethical hacking and penetration testing',
    icon: '🔐',
    color: '#14B8A6',
    order: 8,
    isPublished: true,
    featured: false
  },
  {
    name: 'Game Development',
    slug: 'game-development',
    description: 'Game engines, graphics and game programming',
    icon: '🎮',
    color: '#A855F7',
    order: 9,
    isPublished: true,
    featured: false
  },
  {
    name: 'Blockchain',
    slug: 'blockchain',
    description: 'Web3, smart contracts and cryptocurrency development',
    icon: '⛓️',
    color: '#6366F1',
    order: 10,
    isPublished: true,
    featured: false
  },
  {
    name: 'Tools & Utilities',
    slug: 'tools-utilities',
    description: 'Development tools, IDEs and productivity utilities',
    icon: '🛠️',
    color: '#64748B',
    order: 11,
    isPublished: true,
    featured: false
  },
  {
    name: 'Operating Systems',
    slug: 'operating-systems',
    description: 'Linux, Windows and system administration',
    icon: '🖥️',
    color: '#0EA5E9',
    order: 12,
    isPublished: true,
    featured: false
  }
];

async function seedTechnologyCategories() {
  try {
    console.log('🏷️  Seeding Technology Categories...');
    
    // Clear existing categories
    await TechnologyCategory.deleteMany({});
    
    // Insert new categories
    const result = await TechnologyCategory.insertMany(technologyCategories);
    
    console.log(`✅ Seeded ${result.length} technology categories`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding technology categories:', error.message);
    throw error;
  }
}

module.exports = { seedTechnologyCategories, technologyCategories };
