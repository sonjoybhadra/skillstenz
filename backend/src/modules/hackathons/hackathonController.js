const Hackathon = require('../../models/Hackathon');

// Public: Get all active hackathons
exports.getHackathons = async (req, res) => {
  try {
    const { difficulty, mode, featured, upcoming } = req.query;
    const filter = { isActive: true };
    
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (mode && mode !== 'all') filter.mode = mode;
    if (featured === 'true') filter.isFeatured = true;
    if (upcoming === 'true') filter.startDate = { $gte: new Date() };
    
    const hackathons = await Hackathon.find(filter).sort({ startDate: 1 });
    res.json({ hackathons });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
};

// Public: Get hackathon by slug
exports.getHackathonBySlug = async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ slug: req.params.slug, isActive: true });
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    res.json({ hackathon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hackathon' });
  }
};

// Admin: Get all hackathons
exports.getAllHackathons = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } }
      ];
    }
    
    const hackathons = await Hackathon.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Hackathon.countDocuments(filter);
    
    res.json({
      hackathons,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
};

// Admin: Create hackathon
exports.createHackathon = async (req, res) => {
  try {
    const hackathon = new Hackathon(req.body);
    await hackathon.save();
    res.status(201).json({ hackathon, message: 'Hackathon created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create hackathon' });
  }
};

// Admin: Update hackathon
exports.updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    res.json({ hackathon, message: 'Hackathon updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hackathon' });
  }
};

// Admin: Delete hackathon
exports.deleteHackathon = async (req, res) => {
  try {
    await Hackathon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hackathon' });
  }
};
