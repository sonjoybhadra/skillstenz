const Technology = require('./Technology');

// Get all technologies
exports.getAllTechnologies = async (req, res) => {
  try {
    const { search, category, featured, published, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (published !== undefined) query.isPublished = published === 'true';
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const technologies = await Technology.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');
      
    const total = await Technology.countDocuments(query);
    
    res.json({
      technologies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get technologies error:', error);
    res.status(500).json({ message: 'Failed to get technologies', error: error.message });
  }
};

// Get technology by ID
exports.getTechnologyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const technology = await Technology.findById(id)
      .populate('createdBy', 'name email profileImage')
      .populate('prerequisites', 'name slug icon');
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    res.json(technology);
  } catch (error) {
    console.error('Get technology error:', error);
    res.status(500).json({ message: 'Failed to get technology', error: error.message });
  }
};

// Get technology by slug
exports.getTechnologyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const technology = await Technology.findOne({ slug })
      .populate('createdBy', 'name email profileImage')
      .populate('prerequisites', 'name slug icon');
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    // Increment views
    technology.views++;
    await technology.save();
    
    res.json(technology);
  } catch (error) {
    console.error('Get technology error:', error);
    res.status(500).json({ message: 'Failed to get technology', error: error.message });
  }
};

// Create technology (Admin only)
exports.createTechnology = async (req, res) => {
  try {
    const { name, slug, description, shortDescription, icon, image, color, category, difficulty, accessType, featured, isPublished, tags, resources } = req.body;
    
    const technology = new Technology({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      shortDescription,
      icon,
      image,
      color,
      category,
      difficulty,
      accessType,
      featured,
      isPublished,
      tags,
      resources,
      createdBy: req.userId
    });
    
    await technology.save();
    
    res.status(201).json({
      message: 'Technology created successfully',
      technology
    });
  } catch (error) {
    console.error('Create technology error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Technology with this name or slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create technology', error: error.message });
  }
};

// Update technology (Admin only)
exports.updateTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const technology = await Technology.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    res.json({
      message: 'Technology updated successfully',
      technology
    });
  } catch (error) {
    console.error('Update technology error:', error);
    res.status(500).json({ message: 'Failed to update technology', error: error.message });
  }
};

// Delete technology (Admin only)
exports.deleteTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    
    const technology = await Technology.findByIdAndDelete(id);
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    res.json({ message: 'Technology deleted successfully' });
  } catch (error) {
    console.error('Delete technology error:', error);
    res.status(500).json({ message: 'Failed to delete technology', error: error.message });
  }
};

// Vote on technology
exports.voteTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'up' or 'down'
    
    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote type. Use "up" or "down".' });
    }
    
    const technology = await Technology.findById(id);
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    await technology.vote(req.userId, vote);
    
    res.json({
      message: 'Vote recorded',
      upvotes: technology.votes.upvotes,
      downvotes: technology.votes.downvotes
    });
  } catch (error) {
    console.error('Vote technology error:', error);
    res.status(500).json({ message: 'Failed to vote', error: error.message });
  }
};

// Get technology stats for admin
exports.getTechnologyStats = async (req, res) => {
  try {
    const totalTechnologies = await Technology.countDocuments();
    const publishedTechnologies = await Technology.countDocuments({ isPublished: true });
    const featuredTechnologies = await Technology.countDocuments({ featured: true });
    
    const categoryStats = await Technology.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const topViewed = await Technology.find()
      .sort('-views')
      .limit(5)
      .select('name slug views votes');
    
    res.json({
      totalTechnologies,
      publishedTechnologies,
      draftTechnologies: totalTechnologies - publishedTechnologies,
      featuredTechnologies,
      categoryStats,
      topViewed
    });
  } catch (error) {
    console.error('Get technology stats error:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};
