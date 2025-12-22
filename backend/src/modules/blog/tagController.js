const Tag = require('../../models/Tag');

// Get all tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({ isActive: true })
      .sort({ name: 1 })
      .populate('articleCount')
      .lean();

    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single tag by slug
exports.getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug, isActive: true })
      .populate('articleCount');

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create tag (Admin only)
exports.createTag = async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update tag (Admin only)
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete tag (Admin only)
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
