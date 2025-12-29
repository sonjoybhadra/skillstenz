const Roadmap = require('../../models/Roadmap');

// Public: Get all active roadmaps
exports.getRoadmaps = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = { isActive: true };
    
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    
    const roadmaps = await Roadmap.find(filter)
      .select('-steps.topics')
      .sort({ isFeatured: -1, createdAt: -1 });
    
    res.json({ roadmaps });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
};

// Public: Get roadmap by slug
exports.getRoadmapBySlug = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { slug: req.params.slug, isActive: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    
    res.json({ roadmap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
};

// Admin: Get all roadmaps
exports.getAllRoadmaps = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') filter.category = category;
    
    const roadmaps = await Roadmap.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Roadmap.countDocuments(filter);
    
    res.json({
      roadmaps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
};

// Admin: Create roadmap
exports.createRoadmap = async (req, res) => {
  try {
    const { title, name, description, slug, icon, category, duration, difficulty, steps, isFeatured } = req.body;
    
    const existing = await Roadmap.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'Roadmap with this slug already exists' });
    }
    
    const roadmap = new Roadmap({
      title,
      name: name || title,
      description,
      slug,
      icon,
      category,
      duration,
      difficulty,
      steps: steps || [],
      isFeatured,
      createdBy: req.user.id
    });
    
    await roadmap.save();
    res.status(201).json({ roadmap, message: 'Roadmap created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create roadmap' });
  }
};

// Admin: Update roadmap
exports.updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    
    res.json({ roadmap, message: 'Roadmap updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update roadmap' });
  }
};

// Admin: Toggle roadmap status
exports.toggleRoadmapStatus = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    
    roadmap.isActive = !roadmap.isActive;
    await roadmap.save();
    
    res.json({ roadmap, message: `Roadmap ${roadmap.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle roadmap status' });
  }
};

// Admin: Delete roadmap
exports.deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete roadmap' });
  }
};

// Admin: Import roadmap with nodes and connections
exports.importRoadmap = async (req, res) => {
  try {
    const roadmapData = req.body;

    if (!roadmapData.title) {
      return res.status(400).json({ error: 'Roadmap title is required' });
    }

    // Generate slug if not provided
    if (!roadmapData.slug) {
      roadmapData.slug = roadmapData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if exists
    const existing = await Roadmap.findOne({ slug: roadmapData.slug });
    if (existing) {
      return res.status(400).json({ error: 'Roadmap with this slug already exists' });
    }

    // Convert nodes to steps format if provided
    if (roadmapData.nodes && Array.isArray(roadmapData.nodes)) {
      roadmapData.steps = roadmapData.nodes.map(node => ({
        id: node.id,
        title: node.title,
        description: node.description,
        type: node.type || 'topic',
        order: node.order || 0,
        parentId: node.parentId,
        children: node.children || [],
        resources: node.resources || [],
        optional: node.optional || false,
        topics: []
      }));
    }

    // Store connections for graph visualization
    if (roadmapData.connections) {
      roadmapData.graphConnections = roadmapData.connections;
    }

    roadmapData.createdBy = req.user.id;
    roadmapData.name = roadmapData.name || roadmapData.title;

    const roadmap = new Roadmap(roadmapData);
    await roadmap.save();

    res.status(201).json({
      success: true,
      message: 'Roadmap imported successfully',
      imported: 1,
      roadmap: {
        _id: roadmap._id,
        title: roadmap.title,
        slug: roadmap.slug,
        stepsCount: roadmap.steps?.length || 0
      }
    });
  } catch (error) {
    console.error('Import roadmap error:', error);
    res.status(500).json({ error: 'Failed to import roadmap', details: error.message });
  }
};
