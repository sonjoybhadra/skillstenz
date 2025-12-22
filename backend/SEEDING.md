# Database Seeding Guide

This guide explains how to seed your database with real course content, topics, lessons, and tutorials for the TechTooTalk platform.

## Overview

The seeding scripts populate your MongoDB database with:
- **Users**: Demo students and instructors
- **Plans**: Membership plans and pricing tiers
- **Courses**: Full-fledged courses with sections and lessons (ALL FREE)
- **Topics**: Technology topics with subtopics and content (ALL FREE)
- **Tutorials**: Free tutorial chapters for all technologies (ALL FREE)

## Scripts Available

### 1. **seed:users** - Populate demo users
```bash
npm run seed:users
```
Creates demo students, instructors, and admin users for testing.

### 2. **seed:plans** - Populate membership plans
```bash
npm run seed:plans
```
Creates subscription plans and pricing information.

### 3. **seed:content** - Populate courses, topics, and tutorials
```bash
npm run seed:content
```
Creates comprehensive FREE content for all students:
- 4 Technologies (JavaScript, Python, React, Web Development)
- 4 Courses with multiple sections and lessons
- 3 Topics with subtopics
- 4 Tutorial chapters

### 4. **seed** - Run all seeders (Recommended)
```bash
npm run seed
```
Executes all three seeders in order: users → plans → content

## Getting Started

### Before Production Deployment

Run the complete seeding process once to populate your database:

```bash
cd backend
npm run seed
```

This will:
1. ✅ Create admin and demo users
2. ✅ Set up membership plans
3. ✅ Populate courses, topics, and tutorials
4. ✅ Mark all content as FREE and PUBLISHED

### For Individual Seeding

You can run individual seeders as needed:

```bash
# Seed only users
npm run seed:users

# Seed only plans
npm run seed:plans

# Seed only content
npm run seed:content
```

## What Gets Created

### Technologies
- **JavaScript** ⚡ - Free
- **Python** 🐍 - Free
- **React** ⚛️ - Free
- **Web Development** 🌐 - Free

### Courses (All FREE - isFree: true, price: 0)

#### JavaScript Fundamentals
- Duration: 20 hours
- Level: Beginner
- 2 Sections with 5 lessons total
- Topics: Variables, Data Types, Functions, DOM, Async/Await
- Includes video, article, and code-based lessons

#### Python for Beginners
- Duration: 25 hours
- Level: Beginner
- 2 Sections with 3 lessons total
- Topics: Variables, Basics, Installation
- Mix of video and article content

#### React Fundamentals
- Duration: 18 hours
- Level: Intermediate
- 1 Section with 1 lesson
- Topics: Components, JSX, Hooks
- Featured course

### Topics (All FREE - accessType: 'free')

1. **DOM Manipulation** (JavaScript)
   - Selecting Elements
   - Modifying Elements

2. **File Handling** (Python)
   - Reading Files
   - Writing Files

3. **State Management** (React)
   - useState Hook
   - useEffect Hook

### Tutorials (All FREE - isPublished: true)

1. **Understanding Arrow Functions** (JavaScript)
   - Difficulty: Beginner
   - Time: 15 minutes
   - Includes code examples and practice exercises

2. **List Comprehensions in Python** (Python)
   - Difficulty: Intermediate
   - Time: 20 minutes
   - Real-world examples

3. **React Hooks Best Practices** (React)
   - Difficulty: Intermediate
   - Time: 25 minutes
   - Best practices and patterns

4. **Responsive Design Essentials** (Web Development)
   - Difficulty: Beginner
   - Time: 30 minutes
   - Mobile-first approach

## Access Control

### For All Students (FREE)
- All courses are free and available to all students
- All topics are accessible without payment
- All tutorial chapters are published and free
- Students can enroll without subscription

### In Production
- After deployment, all seeded content is immediately available
- Students can start learning right away without payment
- First-time users see all these courses on the dashboard

## Database Connection

The seeders use the following connection string priority:
1. `MONGODB_URI` environment variable (if set)
2. `mongodb://localhost:27017/techtootalk` (default local)

### Setting MONGODB_URI

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techtootalk
```

## Expected Output

When running `npm run seed`, you'll see:

```
✓ Connected to MongoDB

🔧 Seeding Technologies...
  ✓ Created technology: JavaScript
  ✓ Created technology: Python
  ✓ Created technology: React
  ✓ Created technology: Web Development

📖 Seeding Courses...
  ✓ Created course: JavaScript Fundamentals
  ✓ Created course: Python for Beginners
  ✓ Created course: React Fundamentals

📚 Seeding Topics...
  ✓ Created topic: DOM Manipulation
  ✓ Created topic: File Handling
  ✓ Created topic: State Management

📝 Seeding Tutorials...
  ✓ Created tutorial: Understanding Arrow Functions
  ✓ Created tutorial: List Comprehensions in Python
  ✓ Created tutorial: React Hooks Best Practices
  ✓ Created tutorial: Responsive Design Essentials

✅ Content seeding completed successfully!

📊 Summary:
   • 4 Technologies seeded
   • 4 Courses seeded (all FREE)
   • 3 Topics seeded (all FREE)
   • 4 Tutorials seeded (all FREE)

💡 All content is FREE for all students!
```

## Idempotency

All seeders check for existing data before creating:
- Won't duplicate technologies if already present
- Won't duplicate courses if already present
- Won't duplicate topics if already present
- Won't duplicate tutorials if already present

This means you can run the seeders multiple times safely!

## Customizing Content

To add your own courses, topics, or tutorials:

1. Edit `backend/scripts/seedCourseContent.js`
2. Add new entries to the respective arrays
3. Run `npm run seed:content` again

Example - Adding a new course:

```javascript
{
  title: 'Your Course Title',
  slug: 'your-course-title',
  description: 'Course description',
  shortDescription: 'Short version',
  technology: techMap['javascript'], // Reference existing tech
  thumbnail: 'https://...',
  level: 'beginner',
  duration: '15 hours',
  isFree: true, // Always true for free content
  price: 0,
  featured: true,
  isPublished: true,
  instructor: admin._id,
  learningObjectives: [...],
  prerequisites: [...],
  tags: [...],
  sections: [...]
}
```

## Troubleshooting

### MongoDB Connection Error
```
✗ MongoDB connection error: connection refused
```
**Solution**: Ensure MongoDB is running
```bash
mongod
```

### Technology Not Found
```
Cannot find technology reference
```
**Solution**: The technology must be seeded first. Run `npm run seed` in order.

### Duplicate Key Error
```
E11000 duplicate key error
```
**Solution**: This is normal if you've run the seeder before. The idempotency check will skip duplicates.

## Next Steps

After seeding:

1. **Login to Admin Panel**
   - Email: `admin@skillstenz.com`
   - Password: `admin123`

2. **View Seeded Content**
   - Navigate to Technologies section
   - Enroll in free courses
   - Browse tutorials

3. **Add More Content**
   - Use Admin Panel to create additional courses
   - Edit existing courses
   - Manage instructor assignments

4. **Customize Pricing** (if going paid)
   - Modify course prices
   - Set up paid vs free courses
   - Configure membership plans

## Support

For issues or questions about seeding, check:
- Backend server logs
- MongoDB database
- `.env` configuration file
- [Mongoose Documentation](https://mongoosejs.com/)

---

**Last Updated**: December 2025
**Status**: Production Ready ✅
