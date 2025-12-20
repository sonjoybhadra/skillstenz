const Content = require('./Content');

exports.getContentByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const content = await Content.find({ topicId, approved: true }).sort('createdAt');
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id).populate('createdBy', 'email');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createContent = async (req, res) => {
  try {
    const contentData = { ...req.body, createdBy: req.userId };
    const content = new Content(contentData);
    await content.save();
    res.status(201).json({ message: 'Content created', content });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content updated', content });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByIdAndDelete(id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchContent = async (req, res) => {
  try {
    const { q, type, tags } = req.query;
    const query = { approved: true };

    if (q) {
      query.$text = { $search: q };
    }

    if (type) query.type = type;
    if (tags) query.tags = { $in: tags.split(',') };

    const content = await Content.find(query).populate('topicId', 'name').sort({ score: { $meta: 'textScore' } });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByIdAndUpdate(
      id,
      {
        approved: true,
        approvedBy: req.userId,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content approved', content });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingContent = async (req, res) => {
  try {
    const content = await Content.find({ approved: false }).populate('createdBy', 'email').sort('createdAt');
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};