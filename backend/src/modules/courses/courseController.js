const Course = require('./Course');
const Technology = require('../technologies/Technology');

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
      
    const total = await Course.countDocuments(query);
    
    res.json({
      courses,
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
    
    const course = await Course.findById(id)
      .populate('technology', 'name slug icon color')
      .populate('instructor', 'name profileImage instructorTitle instructorBio expertise')
      .populate('createdBy', 'name email');
    
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
    
    // Increment views
    course.views++;
    await course.save();
    
    // Hide video URLs for non-free lessons if user not enrolled
    const courseObj = course.toObject();
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
