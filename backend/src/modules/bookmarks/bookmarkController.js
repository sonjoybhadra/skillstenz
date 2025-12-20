const Bookmark = require('./Bookmark');

// Get user bookmarks
exports.getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, page = 1, limit = 20 } = req.query;

    const filter = { user: userId };
    if (type && type !== 'all') {
      filter.itemType = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookmarks = await Bookmark.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Bookmark.countDocuments(filter);

    res.json({
      bookmarks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookmarks', error: error.message });
  }
};

// Add bookmark
exports.addBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemType, itemId, itemModel, title, path, notes } = req.body;

    // Check if already bookmarked
    const existing = await Bookmark.findOne({ user: userId, itemType, itemId });
    if (existing) {
      return res.status(400).json({ message: 'Already bookmarked' });
    }

    const bookmark = await Bookmark.create({
      user: userId,
      itemType,
      itemId,
      itemModel,
      title,
      path,
      notes
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add bookmark', error: error.message });
  }
};

// Remove bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({ _id: id, user: userId });
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove bookmark', error: error.message });
  }
};

// Check if item is bookmarked
exports.checkBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemType, itemId } = req.query;

    const bookmark = await Bookmark.findOne({ user: userId, itemType, itemId });
    
    res.json({ isBookmarked: !!bookmark, bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check bookmark', error: error.message });
  }
};

// Update bookmark notes
exports.updateBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { notes } = req.body;

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id, user: userId },
      { notes },
      { new: true }
    );

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update bookmark', error: error.message });
  }
};
