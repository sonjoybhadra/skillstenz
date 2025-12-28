const InterviewTopic = require('../../models/InterviewTopic');

// Public: Get all active interview topics
exports.getInterviewTopics = async (req, res) => {
  try {
    const { category, difficulty, featured } = req.query;
    const filter = { isActive: true };
    
    if (category && category !== 'all') filter.category = category;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (featured === 'true') filter.isFeatured = true;
    
    const topics = await InterviewTopic.find(filter)
      .select('-questions')
      .sort({ order: 1, createdAt: -1 });
    
    res.json({ topics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interview topics' });
  }
};

// Public: Get topic by slug with questions
exports.getTopicBySlug = async (req, res) => {
  try {
    const topic = await InterviewTopic.findOne({ slug: req.params.slug, isActive: true });
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json({ topic });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
};

// Admin: Get all interview topics
exports.getAllTopics = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') filter.category = category;
    
    const topics = await InterviewTopic.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await InterviewTopic.countDocuments(filter);
    
    res.json({
      topics,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
};

// Admin: Create topic
exports.createTopic = async (req, res) => {
  try {
    const topic = new InterviewTopic(req.body);
    await topic.save();
    res.status(201).json({ topic, message: 'Topic created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
};

// Admin: Update topic
exports.updateTopic = async (req, res) => {
  try {
    const topic = await InterviewTopic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json({ topic, message: 'Topic updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
};

// Admin: Delete topic
exports.deleteTopic = async (req, res) => {
  try {
    await InterviewTopic.findByIdAndDelete(req.params.id);
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
};
