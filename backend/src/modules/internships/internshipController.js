const Internship = require('../../models/Internship');

// Public: Get all active internships
exports.getInternships = async (req, res) => {
  try {
    const { type, featured, search } = req.query;
    const filter = { isActive: true };
    
    if (type && type !== 'all') filter.type = type;
    if (featured === 'true') filter.isFeatured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    const internships = await Internship.find(filter).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ internships });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
};

// Public: Get internship by slug
exports.getInternshipBySlug = async (req, res) => {
  try {
    const internship = await Internship.findOne({ slug: req.params.slug, isActive: true });
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.json({ internship });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internship' });
  }
};

// Admin: Get all internships
exports.getAllInternships = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    const internships = await Internship.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Internship.countDocuments(filter);
    
    res.json({
      internships,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
};

// Admin: Create internship
exports.createInternship = async (req, res) => {
  try {
    const internship = new Internship(req.body);
    await internship.save();
    res.status(201).json({ internship, message: 'Internship created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create internship' });
  }
};

// Admin: Update internship
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.json({ internship, message: 'Internship updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update internship' });
  }
};

// Admin: Delete internship
exports.deleteInternship = async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete internship' });
  }
};
