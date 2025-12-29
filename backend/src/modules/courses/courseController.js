const Course = require('./Course');
const Technology = require('../technologies/Technology');
const Topic = require('./Topic');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { search, technology, level, featured, published, free, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    if (technology) query.technology = technology;
    if (level) query.level = level;
    if (featured === 'true') query.featured = true;
    if (published !== undefined) query.isPublished = published === 'true';
    if (free === 'true') query.isFree = true;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('technology', 'name slug icon color')
      .populate('instructor', 'name profileImage instructorTitle')
      .select('-sections -ratings');
    
    // Get topic counts for each course
    const courseIds = courses.map(c => c._id);
    const topicCounts = await Topic.aggregate([
      { $match: { course: { $in: courseIds }, isPublished: true } },
      { $group: { _id: '$course', count: { $sum: 1 } } }
    ]);
    
    const topicCountMap = {};
    topicCounts.forEach(tc => {
      topicCountMap[tc._id.toString()] = tc.count;
    });
    
    // Add topic counts to courses
    const coursesWithCounts = courses.map(course => {
      const courseObj = course.toObject();
      courseObj.topicsCount = topicCountMap[course._id.toString()] || 0;
      return courseObj;
    });
      
    const total = await Course.countDocuments(query);
    
    res.json({
      courses: coursesWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Failed to get courses', error: error.message });
  }
};

// Get course by ID (with full details)
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require('mongoose');
    
    // Check if id is a valid ObjectId, otherwise try to find by slug
    let course;
    if (mongoose.Types.ObjectId.isValid(id)) {
      course = await Course.findById(id)
        .populate('technology', 'name slug icon color')
        .populate('instructor', 'name profileImage instructorTitle instructorBio expertise')
        .populate('createdBy', 'name email');
    }
    
    // If not found by ObjectId, try slug
    if (!course) {
      course = await Course.findOne({ slug: id })
        .populate('technology', 'name slug icon color')
        .populate('instructor', 'name profileImage instructorTitle instructorBio expertise')
        .populate('createdBy', 'name email');
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Failed to get course', error: error.message });
  }
};

// Get course by slug (public)
exports.getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const course = await Course.findOne({ slug, isPublished: true })
      .populate('technology', 'name slug icon color')
      .populate('instructor', 'name profileImage instructorTitle instructorBio expertise');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Get topics count for this course
    const topicsCount = await Topic.countDocuments({ 
      course: course._id, 
      isPublished: true 
    });
    
    // Increment views
    course.views++;
    await course.save();
    
    // Hide video URLs for non-free lessons if user not enrolled
    const courseObj = course.toObject();
    courseObj.topicsCount = topicsCount;
    courseObj.sections = courseObj.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        videoUrl: lesson.isFree ? lesson.videoUrl : undefined,
        content: lesson.isFree ? lesson.content : undefined
      }))
    }));
    
    res.json(courseObj);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Failed to get course', error: error.message });
  }
};

// Create course (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    
    const course = new Course({
      ...courseData,
      createdBy: req.userId,
      instructor: courseData.instructor || req.userId
    });
    
    await course.save();
    
    // Update technology course count
    if (courseData.technology) {
      await Technology.findByIdAndUpdate(courseData.technology, {
        $inc: { courseCount: 1 }
      });
    }
    
    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Course with this slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

// Update course (Admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
};

// Delete course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Update technology course count
    if (course.technology) {
      await Technology.findByIdAndUpdate(course.technology, {
        $inc: { courseCount: -1 }
      });
    }
    
    await course.deleteOne();
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
};

// Add section to course
exports.addSection = async (req, res) => {
  try {
    const { id } = req.params;
    const sectionData = req.body;
    
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    course.sections.push({
      ...sectionData,
      order: course.sections.length
    });
    
    await course.save();
    
    res.json({
      message: 'Section added successfully',
      course
    });
  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({ message: 'Failed to add section', error: error.message });
  }
};

// Add lesson to section
exports.addLesson = async (req, res) => {
  try {
    const { id, sectionIndex } = req.params;
    const lessonData = req.body;
    
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.sections[sectionIndex]) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    course.sections[sectionIndex].lessons.push({
      ...lessonData,
      order: course.sections[sectionIndex].lessons.length
    });
    
    await course.save();
    
    res.json({
      message: 'Lesson added successfully',
      course
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ message: 'Failed to add lesson', error: error.message });
  }
};

// Vote on course
exports.voteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body;
    
    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote type. Use "up" or "down".' });
    }
    
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await course.vote(req.userId, vote);
    
    res.json({
      message: 'Vote recorded',
      upvotes: course.votes.upvotes,
      downvotes: course.votes.downvotes
    });
  } catch (error) {
    console.error('Vote course error:', error);
    res.status(500).json({ message: 'Failed to vote', error: error.message });
  }
};

// Rate course
exports.rateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await course.rate(req.userId, rating, review);
    
    res.json({
      message: 'Rating submitted',
      rating: course.rating,
      ratingsCount: course.ratingsCount
    });
  } catch (error) {
    console.error('Rate course error:', error);
    res.status(500).json({ message: 'Failed to rate course', error: error.message });
  }
};

// Get course stats for admin
exports.getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const freeCourses = await Course.countDocuments({ isFree: true });
    const featuredCourses = await Course.countDocuments({ featured: true });
    
    const levelStats = await Course.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);
    
    const topViewed = await Course.find()
      .sort('-views')
      .limit(5)
      .select('title slug views rating enrollmentsCount')
      .populate('technology', 'name icon');
    
    const topRated = await Course.find({ ratingsCount: { $gte: 5 } })
      .sort('-rating')
      .limit(5)
      .select('title slug rating ratingsCount')
      .populate('technology', 'name icon');
    
    res.json({
      totalCourses,
      publishedCourses,
      draftCourses: totalCourses - publishedCourses,
      freeCourses,
      paidCourses: totalCourses - freeCourses,
      featuredCourses,
      levelStats,
      topViewed,
      topRated
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};

// Import course with sections and lessons
exports.importCourse = async (req, res) => {
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
    courseData.createdBy = req.user._id;

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
};

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
