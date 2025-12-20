const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('../src/modules/auth/User');

const demoUsers = [
  {
    username: 'john_doe',
    name: 'John Doe',
    email: 'john.doe@demo.com',
    password: 'Demo@123',
    role: 'student',
    userType: 'fresher',
    title: 'Frontend Developer',
    bio: 'Passionate about creating beautiful user interfaces with React and Vue.js',
    location: 'New York, USA',
    skills: ['JavaScript', 'React', 'CSS', 'HTML'],
    interests: ['Web Development', 'UI/UX', 'Open Source'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'jane_smith',
    name: 'Jane Smith',
    email: 'jane.smith@demo.com',
    password: 'Demo@123',
    role: 'student',
    userType: 'experienced',
    title: 'Full Stack Developer',
    bio: 'Building scalable applications with Node.js and Python',
    location: 'San Francisco, USA',
    skills: ['Python', 'Node.js', 'MongoDB', 'AWS'],
    interests: ['Backend Development', 'Cloud Computing', 'DevOps'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'mike_johnson',
    name: 'Mike Johnson',
    email: 'mike.johnson@demo.com',
    password: 'Demo@123',
    role: 'instructor',
    userType: 'experienced',
    title: 'Senior Software Engineer',
    bio: 'Teaching programming for over 5 years. Specialized in Python and Machine Learning.',
    location: 'Austin, USA',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
    interests: ['AI/ML', 'Teaching', 'Research'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'sarah_wilson',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@demo.com',
    password: 'Demo@123',
    role: 'student',
    userType: 'fresher',
    title: 'Computer Science Student',
    bio: 'Learning to code and exploring different technologies',
    location: 'London, UK',
    skills: ['Java', 'Python', 'SQL'],
    interests: ['Programming', 'Data Structures', 'Algorithms'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'david_brown',
    name: 'David Brown',
    email: 'david.brown@demo.com',
    password: 'Demo@123',
    role: 'student',
    userType: 'experienced',
    title: 'Mobile App Developer',
    bio: 'Creating mobile experiences with React Native and Flutter',
    location: 'Toronto, Canada',
    skills: ['React Native', 'Flutter', 'Dart', 'JavaScript'],
    interests: ['Mobile Development', 'Cross-platform Apps', 'UI Design'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'emma_davis',
    name: 'Emma Davis',
    email: 'emma.davis@demo.com',
    password: 'Demo@123',
    role: 'instructor',
    userType: 'experienced',
    title: 'DevOps Engineer',
    bio: 'Helping teams achieve continuous delivery with modern DevOps practices',
    location: 'Berlin, Germany',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    interests: ['Cloud Infrastructure', 'Automation', 'Security'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'alex_martinez',
    name: 'Alex Martinez',
    email: 'alex.martinez@demo.com',
    password: 'Demo@123',
    role: 'student',
    userType: 'fresher',
    title: 'Data Science Enthusiast',
    bio: 'Exploring the world of data and analytics',
    location: 'Madrid, Spain',
    skills: ['Python', 'Pandas', 'NumPy', 'Jupyter'],
    interests: ['Data Analysis', 'Visualization', 'Statistics'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'olivia_taylor',
    name: 'Olivia Taylor',
    email: 'olivia.taylor@demo.com',
    password: 'Demo@123',
    role: 'student',
    userType: 'experienced',
    title: 'Backend Developer',
    bio: 'Building robust APIs and microservices',
    location: 'Sydney, Australia',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    interests: ['API Design', 'Microservices', 'System Design'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'ryan_garcia',
    name: 'Ryan Garcia',
    email: 'ryan.garcia@demo.com',
    password: 'Demo@123',
    role: 'student',
    userType: 'fresher',
    title: 'Web Development Student',
    bio: 'Starting my journey in web development',
    location: 'Mumbai, India',
    skills: ['HTML', 'CSS', 'JavaScript'],
    interests: ['Frontend', 'Web Design', 'Responsive Design'],
    isEmailVerified: true,
    isActive: true
  },
  {
    username: 'lisa_anderson',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@demo.com',
    password: 'Demo@123',
    role: 'student',
    userType: 'experienced',
    title: 'QA Engineer',
    bio: 'Ensuring software quality through automated testing',
    location: 'Singapore',
    skills: ['Selenium', 'Jest', 'Cypress', 'Python'],
    interests: ['Test Automation', 'Quality Assurance', 'CI/CD'],
    isEmailVerified: true,
    isActive: true
  }
];

async function seedUsers() {
  try {
    console.log('Starting user seeding...\n');

    for (const userData of demoUsers) {
      // Delete existing demo user first to reset password
      await User.deleteOne({ email: userData.email });

      // Create user - password will be hashed by User model pre-save hook
      const user = new User({
        ...userData
        // Password is passed as plain text, User model will hash it
      });

      await user.save();
      console.log(`✅ Created user: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
    }

    console.log('\n========================================');
    console.log('✨ Demo users seeding completed!');
    console.log('========================================\n');
    console.log('Demo Login Credentials:');
    console.log('------------------------');
    console.log('Password for all users: Demo@123');
    console.log('');
    console.log('Users:');
    demoUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role})`);
    });
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
