const Cheatsheet = require('./Cheatsheet');

// Get all cheatsheets
exports.getAllCheatsheets = async (req, res) => {
  try {
    const { technology, category, difficulty, featured, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (technology) query.technology = technology;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [cheatsheets, total] = await Promise.all([
      Cheatsheet.find(query)
        .populate('technology', 'name slug icon color')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Cheatsheet.countDocuments(query)
    ]);

    res.json({
      cheatsheets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get cheatsheets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get cheatsheet by ID
exports.getCheatsheetById = async (req, res) => {
  try {
    const cheatsheet = await Cheatsheet.findById(req.params.id)
      .populate('technology', 'name slug icon color')
      .populate('createdBy', 'name email');
    
    if (!cheatsheet) {
      return res.status(404).json({ message: 'Cheatsheet not found' });
    }

    // Increment views
    cheatsheet.views++;
    await cheatsheet.save();

    res.json({ cheatsheet });
  } catch (error) {
    console.error('Get cheatsheet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get cheatsheet by slug
exports.getCheatsheetBySlug = async (req, res) => {
  try {
    const cheatsheet = await Cheatsheet.findOne({ slug: req.params.slug })
      .populate('technology', 'name slug icon color')
      .populate('createdBy', 'name email');
    
    if (!cheatsheet) {
      return res.status(404).json({ message: 'Cheatsheet not found' });
    }

    // Increment views
    cheatsheet.views++;
    await cheatsheet.save();

    res.json({ cheatsheet });
  } catch (error) {
    console.error('Get cheatsheet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create cheatsheet
exports.createCheatsheet = async (req, res) => {
  try {
    const cheatsheetData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Generate slug if not provided
    if (!cheatsheetData.slug) {
      cheatsheetData.slug = cheatsheetData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const cheatsheet = new Cheatsheet(cheatsheetData);
    await cheatsheet.save();

    res.status(201).json({
      message: 'Cheatsheet created successfully',
      cheatsheet
    });
  } catch (error) {
    console.error('Create cheatsheet error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A cheatsheet with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cheatsheet
exports.updateCheatsheet = async (req, res) => {
  try {
    const cheatsheet = await Cheatsheet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('technology', 'name slug icon color');

    if (!cheatsheet) {
      return res.status(404).json({ message: 'Cheatsheet not found' });
    }

    res.json({
      message: 'Cheatsheet updated successfully',
      cheatsheet
    });
  } catch (error) {
    console.error('Update cheatsheet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete cheatsheet
exports.deleteCheatsheet = async (req, res) => {
  try {
    const cheatsheet = await Cheatsheet.findByIdAndDelete(req.params.id);

    if (!cheatsheet) {
      return res.status(404).json({ message: 'Cheatsheet not found' });
    }

    res.json({ message: 'Cheatsheet deleted successfully' });
  } catch (error) {
    console.error('Delete cheatsheet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Vote on cheatsheet
exports.voteCheatsheet = async (req, res) => {
  try {
    const { voteType } = req.body;
    
    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const cheatsheet = await Cheatsheet.findById(req.params.id);
    
    if (!cheatsheet) {
      return res.status(404).json({ message: 'Cheatsheet not found' });
    }

    await cheatsheet.vote(req.user.id, voteType);

    res.json({
      message: 'Vote recorded',
      votes: {
        upvotes: cheatsheet.votes.upvotes,
        downvotes: cheatsheet.votes.downvotes
      }
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Track download
exports.trackDownload = async (req, res) => {
  try {
    const cheatsheet = await Cheatsheet.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!cheatsheet) {
      return res.status(404).json({ message: 'Cheatsheet not found' });
    }

    res.json({
      message: 'Download tracked',
      downloads: cheatsheet.downloads
    });
  } catch (error) {
    console.error('Track download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get cheatsheet stats
exports.getCheatsheetStats = async (req, res) => {
  try {
    const [total, published, featured, byCategory] = await Promise.all([
      Cheatsheet.countDocuments(),
      Cheatsheet.countDocuments({ isPublished: true }),
      Cheatsheet.countDocuments({ isFeatured: true }),
      Cheatsheet.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      total,
      published,
      featured,
      byCategory: byCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Import cheatsheet
exports.importCheatsheet = async (req, res) => {
  try {
    const cheatsheetData = req.body;

    if (!cheatsheetData.title) {
      return res.status(400).json({ message: 'Cheatsheet title is required' });
    }

    // Generate slug if not provided
    if (!cheatsheetData.slug) {
      cheatsheetData.slug = cheatsheetData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if exists
    const existing = await Cheatsheet.findOne({ slug: cheatsheetData.slug });
    if (existing) {
      return res.status(400).json({ message: 'Cheatsheet with this slug already exists' });
    }

    // Process tags if string
    if (typeof cheatsheetData.tags === 'string') {
      cheatsheetData.tags = cheatsheetData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    cheatsheetData.createdBy = req.user.id;

    const cheatsheet = new Cheatsheet(cheatsheetData);
    await cheatsheet.save();

    res.status(201).json({
      success: true,
      message: 'Cheatsheet imported successfully',
      imported: 1,
      cheatsheet: {
        _id: cheatsheet._id,
        title: cheatsheet.title,
        slug: cheatsheet.slug,
        sectionsCount: cheatsheet.sections?.length || 0
      }
    });
  } catch (error) {
    console.error('Import cheatsheet error:', error);
    res.status(500).json({ message: 'Failed to import cheatsheet', error: error.message });
  }
};
