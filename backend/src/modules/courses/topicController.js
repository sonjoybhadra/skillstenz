const Topic = require('./Topic');
const Course = require('./Course');

// Get all topics for a course
exports.getCourseTopics = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const topics = await Topic.find({ course: courseId, isPublished: true })
      .select('title slug description duration difficulty type order isFree viewCount')
      .sort({ order: 1 });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topics', error: error.message });
  }
};

// Get single topic with content
exports.getTopic = async (req, res) => {
  try {
    const { courseSlug, topicSlug } = req.params;
    
    // Find course first
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const topic = await Topic.findOne({ 
      course: course._id, 
      slug: topicSlug,
      isPublished: true 
    })
      .populate('course', 'title slug')
      .populate('technology', 'name slug')
      .populate('prerequisites', 'title slug');

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Increment view count
    await Topic.findByIdAndUpdate(topic._id, { $inc: { viewCount: 1 } });

    // Get next and previous topics
    const [prevTopic, nextTopic] = await Promise.all([
      Topic.findOne({ 
        course: course._id, 
        order: { $lt: topic.order }, 
        isPublished: true 
      }).sort({ order: -1 }).select('title slug'),
      Topic.findOne({ 
        course: course._id, 
        order: { $gt: topic.order }, 
        isPublished: true 
      }).sort({ order: 1 }).select('title slug')
    ]);

    res.json({
      topic,
      navigation: {
        prev: prevTopic,
        next: nextTopic
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topic', error: error.message });
  }
};

// Mark topic as completed
exports.completeTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user._id;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check if already completed
    const alreadyCompleted = topic.completedBy.some(
      c => c.user.toString() === userId.toString()
    );

    if (!alreadyCompleted) {
      await Topic.findByIdAndUpdate(topicId, {
        $push: { completedBy: { user: userId } }
      });

      // Update user's course progress
      const User = require('../auth/User');
      await User.updateOne(
        { 
          _id: userId, 
          'enrolledCourses.course': topic.course 
        },
        { 
          $addToSet: { 'enrolledCourses.$.completedLessons': topicId.toString() }
        }
      );
    }

    res.json({ message: 'Topic marked as completed', alreadyCompleted });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete topic', error: error.message });
  }
};

// Admin: Create topic
exports.createTopic = async (req, res) => {
  try {
    const topicData = req.body;
    
    // Generate slug if not provided
    if (!topicData.slug) {
      topicData.slug = topicData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Get the highest order number
    const lastTopic = await Topic.findOne({ course: topicData.course })
      .sort({ order: -1 });
    topicData.order = lastTopic ? lastTopic.order + 1 : 0;

    const topic = await Topic.create(topicData);
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create topic', error: error.message });
  }
};

// Admin: Update topic
exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update topic', error: error.message });
  }
};

// Admin: Delete topic
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete topic', error: error.message });
  }
};

// Admin: Reorder topics
exports.reorderTopics = async (req, res) => {
  try {
    const { courseId, topicOrders } = req.body;
    // topicOrders: [{ id: '...', order: 0 }, { id: '...', order: 1 }]

    const bulkOps = topicOrders.map(item => ({
      updateOne: {
        filter: { _id: item.id, course: courseId },
        update: { $set: { order: item.order } }
      }
    }));

    await Topic.bulkWrite(bulkOps);

    res.json({ message: 'Topics reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder topics', error: error.message });
  }
};

// Admin: Get all topics for a course (including unpublished)
exports.getAdminCourseTopics = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const topics = await Topic.find({ course: courseId })
      .sort({ order: 1 });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topics', error: error.message });
  }
};
