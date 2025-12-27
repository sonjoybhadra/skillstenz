// Master seed script for SkillsTenz content
// Seeds technologies, tutorials, courses, categories, and articles

const mongoose = require('mongoose');
require('dotenv').config();

const Technology = require('../src/modules/technologies/Technology');
const TutorialChapter = require('../src/modules/tutorials/Tutorial');
const Course = require('../src/modules/courses/Course');
const Category = require('../src/models/Category');
const Article = require('../src/models/Article');

const technologies = require('./data/technologies');
const tutorials = require('./data/tutorials');
const courses = require('./data/courses');
const categories = require('./data/categories');

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Seed Technologies
    await Technology.deleteMany({});
    await Technology.insertMany(technologies);
    console.log('Seeded Technologies');

    // Seed Tutorials (as chapters)
    await TutorialChapter.deleteMany({});
    const techDocs = await Technology.find({});
    const techSlugMap = {};
    for (const tech of techDocs) {
      techSlugMap[tech.slug] = tech._id;
    }

    for (const tut of tutorials) {
      if (!tut.technologySlug) {
        console.warn(`Skipping tutorial '${tut.title}' - missing technologySlug field.`);
        continue;
      }

      const techId = techSlugMap[tut.technologySlug];
      if (!techId) {
        console.warn(`Skipping tutorial '${tut.title}' - could not find technology for slug '${tut.technologySlug}'`);
        continue;
      }

      if (!tut.chapters || tut.chapters.length === 0) {
        console.warn(`Skipping tutorial '${tut.title}' - no chapters found.`);
        continue;
      }

      let order = 1;
      for (const chapter of tut.chapters) {
        if (!chapter.title) {
          console.warn(`Skipping chapter with missing title in tutorial '${tut.title}'`);
          continue;
        }

        const slug = chapter.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (!slug) {
          console.warn(`Skipping chapter with invalid slug in tutorial '${tut.title}'`);
          continue;
        }

        await TutorialChapter.create({
          technology: techId,
          title: chapter.title,
          slug,
          description: tut.shortDescription || '',
          content: `${chapter.explanation || ''}\n${chapter.practicalExample || ''}`,
          order,
          difficulty: (tut.audienceLevel || 'beginner').toLowerCase(),
          keyPoints: chapter.keyNotes ? [chapter.keyNotes] : [],
          isPublished: true
        });
        order++;
      }
    }
    console.log('Seeded Tutorials');

    // Seed Courses
    await Course.deleteMany({});
    for (const course of courses) {
      // Support both 'technology' and 'technologySlug' field names
      const techSlug = course.technologySlug || course.technology;
      if (!techSlug) {
        console.warn(`Skipping course '${course.title}' - missing technology/technologySlug field.`);
        continue;
      }

      const techId = techSlugMap[techSlug];
      if (!techId) {
        console.warn(`Skipping course '${course.title}' - could not find technology for slug '${techSlug}'`);
        continue;
      }

      if (!course.topics || course.topics.length === 0) {
        console.warn(`Skipping course '${course.title}' - no topics found.`);
        continue;
      }

      await Course.create({
        title: course.title,
        slug: course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: course.objective || '',
        technology: techId,
        level: (course.skillLevel || 'beginner').toLowerCase(),
        duration: course.duration || 0,
        sections: course.topics.map((topic, i) => ({
          title: topic.title || '',
          description: topic.conceptExplanation || '',
          order: i + 1,
          lessons: (topic.lessons || []).map((lesson, j) => ({
            title: lesson.title || '',
            description: lesson.explanation || '',
            content: lesson.example || '',
            order: j + 1,
            isPublished: true
          }))
        })),
        isPublished: true
      });
    }
    console.log('Seeded Courses');

    // Get admin user for article author
    const User = require('../src/modules/auth/User');
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.warn('No admin user found, skipping articles seeding');
    }

    // Seed Categories and Articles
    await Category.deleteMany({});
    await Article.deleteMany({});
    for (const cat of categories) {
      const category = await Category.create({
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: cat.description || '',
        isActive: true
      });

      if (adminUser && cat.articles && cat.articles.length > 0) {
        for (const art of cat.articles) {
          await Article.create({
            title: art.title,
            slug: art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            excerpt: art.seoDescription || 'Article excerpt',
            content: art.content || 'Article content',
            category: category._id,
            author: adminUser._id,
            isPublished: true,
            metaTitle: art.title,
            metaDescription: art.seoDescription || ''
          });
        }
      }
    }
    console.log('Seeded Categories and Articles');

    await mongoose.disconnect();
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAll();