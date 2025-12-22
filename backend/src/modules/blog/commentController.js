const Comment = require('../../models/Comment');

// Get comments for an article
exports.getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const query = { 
      article: articleId, 
      isApproved: true,
      parent: null 
    };

    const comments = await Comment.find(query)
      .populate('user', 'name username avatar')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'name username avatar' },
        match: { isApproved: true }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Comment.countDocuments(query);

    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const commentData = {
      ...req.body,
      user: req.user.id
    };

    const comment = new Comment(commentData);
    await comment.save();

    await comment.populate('user', 'name username avatar');

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or unauthorized' });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or unauthorized' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle comment like
exports.toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Toggle logic can be improved with a separate likes collection
    comment.likes += 1;
    await comment.save();

    res.json({ likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
