const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middlewares/auth');
const Course = require('../courses/Course');
const Technology = require('../technologies/Technology');
const Topic = require('../topics/Topic');

// @route   POST /api/courses/import
// @desc    Import course with sections and lessons
// @access  Private/Admin
router.post('/import', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const courseData = req.body;

    // Validate required fields
    if (!courseData.title) {
      return res.status(400).json({ message: 'Course title is required' });
    }

    // Generate slug if not provided
    if (!courseData.slug) {
      courseData.slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ slug: courseData.slug });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this slug already exists' });
    }

    // Process sections and lessons
    if (courseData.sections && Array.isArray(courseData.sections)) {
      courseData.sections = courseData.sections.map((section, sIndex) => ({
        ...section,
        order: section.order || sIndex + 1,
        lessons: (section.lessons || []).map((lesson, lIndex) => ({
          ...lesson,
          order: lesson.order || lIndex + 1,
          // Parse YouTube URL if provided
          ...(lesson.videoUrl && parseYouTubeUrl(lesson.videoUrl))
        }))
      }));
    }

    // Set instructor to current user if not provided
    if (!courseData.instructor) {
      courseData.instructor = req.user._id;
    }

    // Create course
    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course imported successfully',
      imported: 1,
      course: {
        _id: course._id,
        title: course.title,
        slug: course.slug,
        sectionsCount: course.sections?.length || 0,
        lessonsCount: course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0
      }
    });
  } catch (error) {
    console.error('Import course error:', error);
    res.status(500).json({ message: 'Failed to import course', error: error.message });
  }
});

// @route   POST /api/courses/import/bulk
// @desc    Import multiple courses
// @access  Private/Admin
router.post('/import/bulk', protect, authorize('admin'), async (req, res) => {
  try {
    const { courses } = req.body;
    
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ message: 'Courses array is required' });
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: []
    };

    for (const courseData of courses) {
      try {
        // Generate slug
        if (!courseData.slug) {
          courseData.slug = courseData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }

        // Skip if exists
        const exists = await Course.findOne({ slug: courseData.slug });
        if (exists) {
          results.failed++;
          results.errors.push(`Course "${courseData.title}" already exists`);
          continue;
        }

        courseData.instructor = courseData.instructor || req.user._id;
        
        await Course.create(courseData);
        results.imported++;
      } catch (err) {
        results.failed++;
        results.errors.push(`${courseData.title}: ${err.message}`);
      }
    }

    res.json({
      success: results.imported > 0,
      message: `Imported ${results.imported} of ${courses.length} courses`,
      ...results
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ message: 'Bulk import failed', error: error.message });
  }
});

// Helper function to parse YouTube URLs
function parseYouTubeUrl(url) {
  if (!url) return {};
  
  const result = { videoUrl: url, videoProvider: 'youtube' };
  
  // Extract video ID from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      result.videoId = match[1];
      result.videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
      break;
    }
  }

  return result;
}

module.exports = router;
