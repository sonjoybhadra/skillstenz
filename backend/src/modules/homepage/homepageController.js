const HomeSection = require('./HomeSection');

// Get all active sections (public)
exports.getAllSections = async (req, res) => {
  try {
    const sections = await HomeSection.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
    
    // Transform to object keyed by sectionKey for easier frontend usage
    const sectionsMap = {};
    sections.forEach(section => {
      sectionsMap[section.sectionKey] = section;
    });
    
    res.json({ success: true, data: sectionsMap });
  } catch (error) {
    console.error('Get homepage sections error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch homepage sections' });
  }
};

// Get a specific section by key (public)
exports.getSectionByKey = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const section = await HomeSection.findOne({ sectionKey, isActive: true }).lean();
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch section' });
  }
};

// Admin: Get all sections including inactive
exports.adminGetAllSections = async (req, res) => {
  try {
    const sections = await HomeSection.find().sort({ order: 1 }).lean();
    res.json({ success: true, data: sections });
  } catch (error) {
    console.error('Admin get sections error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sections' });
  }
};

// Admin: Get section by ID
exports.adminGetSection = async (req, res) => {
  try {
    const section = await HomeSection.findById(req.params.id).lean();
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Admin get section error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch section' });
  }
};

// Admin: Create new section
exports.createSection = async (req, res) => {
  try {
    const existingSection = await HomeSection.findOne({ sectionKey: req.body.sectionKey });
    if (existingSection) {
      return res.status(400).json({ 
        success: false, 
        message: 'Section with this key already exists' 
      });
    }
    
    const section = new HomeSection(req.body);
    await section.save();
    
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ success: false, message: 'Failed to create section' });
  }
};

// Admin: Update section
exports.updateSection = async (req, res) => {
  try {
    const section = await HomeSection.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ success: false, message: 'Failed to update section' });
  }
};

// Admin: Update section by key
exports.updateSectionByKey = async (req, res) => {
  try {
    const section = await HomeSection.findOneAndUpdate(
      { sectionKey: req.params.sectionKey },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true, upsert: true }
    );
    
    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Update section by key error:', error);
    res.status(500).json({ success: false, message: 'Failed to update section' });
  }
};

// Admin: Delete section
exports.deleteSection = async (req, res) => {
  try {
    const section = await HomeSection.findByIdAndDelete(req.params.id);
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    res.json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete section' });
  }
};

// Admin: Toggle section active status
exports.toggleSectionStatus = async (req, res) => {
  try {
    const section = await HomeSection.findById(req.params.id);
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    section.isActive = !section.isActive;
    section.updatedAt = new Date();
    await section.save();
    
    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Toggle section status error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle section status' });
  }
};

// Admin: Reorder sections
exports.reorderSections = async (req, res) => {
  try {
    const { sections } = req.body; // Array of { id, order }
    
    const bulkOps = sections.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order, updatedAt: new Date() }
      }
    }));
    
    await HomeSection.bulkWrite(bulkOps);
    
    const updatedSections = await HomeSection.find().sort({ order: 1 }).lean();
    res.json({ success: true, data: updatedSections });
  } catch (error) {
    console.error('Reorder sections error:', error);
    res.status(500).json({ success: false, message: 'Failed to reorder sections' });
  }
};

// Admin: Update specific items in a section (for adding/removing items)
exports.updateSectionItems = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { items, latestUpdates, ctaCards, careerCategories, compilerData } = req.body;
    
    const updateData = { updatedAt: new Date() };
    
    if (items !== undefined) updateData.items = items;
    if (latestUpdates !== undefined) updateData.latestUpdates = latestUpdates;
    if (ctaCards !== undefined) updateData.ctaCards = ctaCards;
    if (careerCategories !== undefined) updateData.careerCategories = careerCategories;
    if (compilerData !== undefined) updateData.compilerData = compilerData;
    
    const section = await HomeSection.findOneAndUpdate(
      { sectionKey },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Update section items error:', error);
    res.status(500).json({ success: false, message: 'Failed to update section items' });
  }
};
