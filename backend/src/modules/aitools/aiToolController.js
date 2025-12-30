const AITool = require('./AITool');

// Get all AI Tools (public)
exports.getAllAITools = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      pricing,
      featured, 
      trending,
      published = 'true',
      apiAvailable,
      platform,
      page = 1, 
      limit = 50, 
      sort = '-featured,-trending,order,name' 
    } = req.query;
    
    const query = {};
    
    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { 'parentCompany.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filters
    if (category && category !== 'all') query.category = category;
    if (pricing && pricing !== 'all') query['pricing.type'] = pricing;
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;
    if (published !== undefined) query.isPublished = published === 'true';
    if (apiAvailable === 'true') query.apiAvailable = true;
    if (platform) query.platforms = platform;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sortObj = {};
    sort.split(',').forEach(s => {
      if (s.startsWith('-')) {
        sortObj[s.substring(1)] = -1;
      } else {
        sortObj[s] = 1;
      }
    });
    
    const aiTools = await AITool.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-overview -howToUse -votes.voters')
      .populate('alternatives', 'name slug logo icon')
      .lean();
    
    const total = await AITool.countDocuments(query);
    
    // Get category counts for filters
    const categoryCounts = await AITool.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get pricing type counts
    const pricingCounts = await AITool.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$pricing.type', count: { $sum: 1 } } }
    ]);
    
    res.json({
      tools: aiTools,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        categories: categoryCounts,
        pricing: pricingCounts
      }
    });
  } catch (error) {
    console.error('Get AI tools error:', error);
    res.status(500).json({ message: 'Failed to get AI tools', error: error.message });
  }
};

// Get AI Tool by slug (public)
exports.getAIToolBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const aiTool = await AITool.findOne({ slug, isPublished: true })
      .populate('alternatives', 'name slug logo icon shortDescription category pricing.type')
      .populate('relatedTechnologies', 'name slug icon')
      .populate('createdBy', 'name');
    
    if (!aiTool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }
    
    // Increment views
    aiTool.views++;
    await aiTool.save();
    
    // Get related tools from same category
    const relatedTools = await AITool.find({
      _id: { $ne: aiTool._id },
      category: aiTool.category,
      isPublished: true
    })
    .select('name slug logo icon shortDescription category pricing.type')
    .limit(6)
    .lean();
    
    res.json({
      tool: aiTool,
      relatedTools
    });
  } catch (error) {
    console.error('Get AI tool error:', error);
    res.status(500).json({ message: 'Failed to get AI tool', error: error.message });
  }
};

// Get AI Tool by ID (admin)
exports.getAIToolById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const aiTool = await AITool.findById(id)
      .populate('alternatives', 'name slug logo')
      .populate('relatedTechnologies', 'name slug icon')
      .populate('createdBy', 'name email');
    
    if (!aiTool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }
    
    res.json(aiTool);
  } catch (error) {
    console.error('Get AI tool error:', error);
    res.status(500).json({ message: 'Failed to get AI tool', error: error.message });
  }
};

// Create AI Tool (admin)
exports.createAITool = async (req, res) => {
  try {
    const toolData = { ...req.body };
    
    // Generate slug if not provided
    if (!toolData.slug && toolData.name) {
      toolData.slug = toolData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    // Set creator
    toolData.createdBy = req.user._id;
    
    const aiTool = new AITool(toolData);
    await aiTool.save();
    
    res.status(201).json({
      message: 'AI Tool created successfully',
      tool: aiTool
    });
  } catch (error) {
    console.error('Create AI tool error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An AI tool with this name or slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create AI tool', error: error.message });
  }
};

// Update AI Tool (admin)
exports.updateAITool = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    // Regenerate slug if name changed and slug not provided
    if (updates.name && !updates.slug) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    updates.lastUpdated = new Date();
    
    const aiTool = await AITool.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true 
    });
    
    if (!aiTool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }
    
    res.json({
      message: 'AI Tool updated successfully',
      tool: aiTool
    });
  } catch (error) {
    console.error('Update AI tool error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An AI tool with this name or slug already exists' });
    }
    res.status(500).json({ message: 'Failed to update AI tool', error: error.message });
  }
};

// Delete AI Tool (admin)
exports.deleteAITool = async (req, res) => {
  try {
    const { id } = req.params;
    
    const aiTool = await AITool.findByIdAndDelete(id);
    
    if (!aiTool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }
    
    res.json({ message: 'AI Tool deleted successfully' });
  } catch (error) {
    console.error('Delete AI tool error:', error);
    res.status(500).json({ message: 'Failed to delete AI tool', error: error.message });
  }
};

// Vote on AI Tool
exports.voteAITool = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'up' or 'down'
    const userId = req.user._id;
    
    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }
    
    const aiTool = await AITool.findById(id);
    
    if (!aiTool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }
    
    // Check if user already voted
    const existingVoteIndex = aiTool.votes.voters.findIndex(
      v => v.user.toString() === userId.toString()
    );
    
    if (existingVoteIndex > -1) {
      const existingVote = aiTool.votes.voters[existingVoteIndex];
      
      // If same vote, remove it (toggle off)
      if (existingVote.vote === vote) {
        aiTool.votes[vote === 'up' ? 'upvotes' : 'downvotes']--;
        aiTool.votes.voters.splice(existingVoteIndex, 1);
      } else {
        // Change vote
        aiTool.votes[existingVote.vote === 'up' ? 'upvotes' : 'downvotes']--;
        aiTool.votes[vote === 'up' ? 'upvotes' : 'downvotes']++;
        existingVote.vote = vote;
      }
    } else {
      // New vote
      aiTool.votes[vote === 'up' ? 'upvotes' : 'downvotes']++;
      aiTool.votes.voters.push({ user: userId, vote });
    }
    
    await aiTool.save();
    
    res.json({
      message: 'Vote recorded',
      upvotes: aiTool.votes.upvotes,
      downvotes: aiTool.votes.downvotes,
      voteScore: aiTool.votes.upvotes - aiTool.votes.downvotes
    });
  } catch (error) {
    console.error('Vote AI tool error:', error);
    res.status(500).json({ message: 'Failed to vote', error: error.message });
  }
};

// Get AI Tool stats (admin)
exports.getAIToolStats = async (req, res) => {
  try {
    const totalTools = await AITool.countDocuments();
    const publishedTools = await AITool.countDocuments({ isPublished: true });
    const featuredTools = await AITool.countDocuments({ featured: true });
    const trendingTools = await AITool.countDocuments({ trending: true });
    
    const byCategory = await AITool.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byPricing = await AITool.aggregate([
      { $group: { _id: '$pricing.type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const topViewed = await AITool.find({ isPublished: true })
      .sort({ views: -1 })
      .limit(10)
      .select('name slug logo views');
    
    const recentlyAdded = await AITool.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name slug logo createdAt isPublished');
    
    res.json({
      stats: {
        total: totalTools,
        published: publishedTools,
        featured: featuredTools,
        trending: trendingTools,
        draft: totalTools - publishedTools
      },
      byCategory,
      byPricing,
      topViewed,
      recentlyAdded
    });
  } catch (error) {
    console.error('Get AI tool stats error:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};

// Get featured AI Tools
exports.getFeaturedAITools = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const tools = await AITool.find({ isPublished: true, featured: true })
      .sort({ order: 1, name: 1 })
      .limit(parseInt(limit))
      .select('name slug logo icon shortDescription category pricing.type')
      .lean();
    
    res.json(tools);
  } catch (error) {
    console.error('Get featured AI tools error:', error);
    res.status(500).json({ message: 'Failed to get featured tools', error: error.message });
  }
};

// Get trending AI Tools
exports.getTrendingAITools = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const tools = await AITool.find({ isPublished: true, trending: true })
      .sort({ views: -1, 'votes.upvotes': -1 })
      .limit(parseInt(limit))
      .select('name slug logo icon shortDescription category pricing.type views')
      .lean();
    
    res.json(tools);
  } catch (error) {
    console.error('Get trending AI tools error:', error);
    res.status(500).json({ message: 'Failed to get trending tools', error: error.message });
  }
};

// Get categories with counts
exports.getCategories = async (req, res) => {
  try {
    const categories = await AITool.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const categoryInfo = {
      'chatbots': { name: 'Chatbots & Assistants', icon: '💬', color: '#3B82F6' },
      'image-generation': { name: 'Image Generation', icon: '🎨', color: '#8B5CF6' },
      'video-generation': { name: 'Video Generation', icon: '🎬', color: '#EC4899' },
      'audio-generation': { name: 'Audio & Music', icon: '🎵', color: '#F59E0B' },
      'writing-assistant': { name: 'Writing & Content', icon: '✍️', color: '#10B981' },
      'code-assistant': { name: 'Code & Development', icon: '💻', color: '#6366F1' },
      'data-analysis': { name: 'Data & Analytics', icon: '📊', color: '#14B8A6' },
      'automation': { name: 'Automation', icon: '⚡', color: '#F97316' },
      'research': { name: 'Research & Knowledge', icon: '🔬', color: '#8B5CF6' },
      'design': { name: 'Design & Creative', icon: '🎯', color: '#EC4899' },
      'marketing': { name: 'Marketing & Sales', icon: '📈', color: '#EF4444' },
      'productivity': { name: 'Productivity', icon: '⏱️', color: '#22C55E' },
      'education': { name: 'Education & Learning', icon: '📚', color: '#3B82F6' },
      'healthcare': { name: 'Healthcare', icon: '🏥', color: '#06B6D4' },
      'finance': { name: 'Finance', icon: '💰', color: '#84CC16' },
      'other': { name: 'Other Tools', icon: '🔧', color: '#6B7280' }
    };
    
    const result = categories.map(cat => ({
      slug: cat._id,
      count: cat.count,
      ...categoryInfo[cat._id] || { name: cat._id, icon: '🔧', color: '#6B7280' }
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to get categories', error: error.message });
  }
};

// Bulk update AI Tools (admin)
exports.bulkUpdateAITools = async (req, res) => {
  try {
    const { ids, updates } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No tool IDs provided' });
    }
    
    const result = await AITool.updateMany(
      { _id: { $in: ids } },
      { $set: { ...updates, lastUpdated: new Date() } }
    );
    
    res.json({
      message: `${result.modifiedCount} tools updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update AI tools error:', error);
    res.status(500).json({ message: 'Failed to bulk update', error: error.message });
  }
};
