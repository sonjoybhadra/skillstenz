const Article = require('../../models/Article');
const Category = require('../../models/Category');
const Tag = require('../../models/Tag');

// Get all articles with filters
exports.getArticles = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      search, 
      featured,
      sort = '-publishedAt'
    } = req.query;

    const query = { isPublished: true };

    // Filters
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (featured) query.isFeatured = featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const articles = await Article.find(query)
      .populate('author', 'name username avatar')
      .populate('category', 'name slug icon color')
      .populate('tags', 'name slug color')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single article by slug
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    })
      .populate('author', 'name username avatar bio')
      .populate('category', 'name slug icon color')
      .populate('tags', 'name slug color')
      .populate({
        path: 'comments',
        match: { isApproved: true, parent: null },
        populate: [
          { path: 'user', select: 'name username avatar' },
          { 
            path: 'replies',
            populate: { path: 'user', select: 'name username avatar' }
          }
        ],
        options: { sort: { createdAt: -1 } }
      });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    // Get related articles
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      $or: [
        { category: article.category },
        { tags: { $in: article.tags } }
      ],
      isPublished: true
    })
      .limit(4)
      .select('title slug excerpt featuredImage category tags readTime publishedAt views')
      .populate('category', 'name slug')
      .populate('tags', 'name slug');

    res.json({ article, relatedArticles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create article (Admin only)
exports.createArticle = async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      author: req.user.id
    };

    const article = new Article(articleData);
    await article.save();

    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update article (Admin only)
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete article (Admin only)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle article like
exports.toggleLike = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Toggle logic can be improved with a separate likes collection
    article.likes += 1;
    await article.save();

    res.json({ likes: article.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
