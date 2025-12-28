const TutorialChapter = require('./Tutorial');
const Technology = require('../technologies/Technology');

// Get tutorial (technology + chapters) by slug - matches frontend expectation
const getTutorialBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find technology by slug
    const technology = await Technology.findOne({ slug }).populate('category', 'name slug icon');
    if (!technology) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    // Get all published chapters for this technology
    const chapters = await TutorialChapter.find({ 
      technology: technology._id,
      isPublished: true 
    })
      .sort({ order: 1 })
      .select('title slug description order icon estimatedTime difficulty keyPoints content codeExample');

    // Format response to match frontend Tutorial interface
    const tutorial = {
      _id: technology._id,
      title: `${technology.name} Tutorial`,
      slug: technology.slug,
      description: technology.description || `Learn ${technology.name} with hands-on examples and exercises.`,
      technology: technology.name,
      technologyIcon: technology.icon,
      technologyColor: technology.color,
      category: technology.category?.name || 'Programming',
      level: 'beginner',
      keywords: [technology.name.toLowerCase(), technology.slug],
      chapters: chapters,
      createdAt: technology.createdAt
    };

    res.json({ tutorial });
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all chapters for a technology
const getChaptersByTechnology = async (req, res) => {
  try {
    const { technologySlug } = req.params;
    const { limit = 50, page = 1 } = req.query;

    // Find technology by slug
    const technology = await Technology.findOne({ slug: technologySlug });
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    const chapters = await TutorialChapter.find({ 
      technology: technology._id,
      isPublished: true 
    })
      .sort({ order: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('technology', 'name slug icon color');

    const total = await TutorialChapter.countDocuments({ 
      technology: technology._id,
      isPublished: true 
    });

    res.json({
      chapters,
      technology,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching tutorial chapters:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single chapter by slug
const getChapterBySlug = async (req, res) => {
  try {
    const { technologySlug, chapterSlug } = req.params;

    const technology = await Technology.findOne({ slug: technologySlug });
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    const chapter = await TutorialChapter.findOne({ 
      technology: technology._id,
      slug: chapterSlug
    }).populate('technology', 'name slug icon color')
      .populate('relatedChapters', 'title slug');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Increment view count
    chapter.viewCount += 1;
    await chapter.save();

    // Get prev/next chapters
    const allChapters = await TutorialChapter.find({ 
      technology: technology._id,
      isPublished: true 
    }).sort({ order: 1 }).select('title slug order');

    const currentIndex = allChapters.findIndex(c => c.slug === chapterSlug);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    res.json({
      chapter,
      navigation: {
        prev: prevChapter,
        next: nextChapter,
        total: allChapters.length,
        current: currentIndex + 1
      }
    });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all chapters (including unpublished)
const getAllChapters = async (req, res) => {
  try {
    const { technology, limit = 50, page = 1, search } = req.query;
    
    const query = {};
    if (technology) {
      const tech = await Technology.findOne({ slug: technology });
      if (tech) query.technology = tech._id;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const chapters = await TutorialChapter.find(query)
      .sort({ technology: 1, order: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('technology', 'name slug icon color')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    const total = await TutorialChapter.countDocuments(query);

    res.json({
      chapters,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching all chapters:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Create chapter
const createChapter = async (req, res) => {
  try {
    const { technologyId, title, slug, description, content, order, icon, estimatedTime, difficulty, codeExamples, practiceExercises, keyPoints, isPublished } = req.body;

    // Verify technology exists
    const technology = await Technology.findById(technologyId);
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    // Get next order number if not provided
    let chapterOrder = order;
    if (chapterOrder === undefined) {
      const lastChapter = await TutorialChapter.findOne({ technology: technologyId })
        .sort({ order: -1 });
      chapterOrder = lastChapter ? lastChapter.order + 1 : 1;
    }

    const chapter = new TutorialChapter({
      technology: technologyId,
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      description,
      content,
      order: chapterOrder,
      icon,
      estimatedTime,
      difficulty,
      codeExamples,
      practiceExercises,
      keyPoints,
      isPublished: isPublished !== false,
      createdBy: req.user?._id
    });

    await chapter.save();
    await chapter.populate('technology', 'name slug icon color');

    res.status(201).json({ chapter, message: 'Chapter created successfully' });
  } catch (error) {
    console.error('Error creating chapter:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A chapter with this slug already exists for this technology' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Update chapter
const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedBy: req.user?._id };

    const chapter = await TutorialChapter.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('technology', 'name slug icon color');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json({ chapter, message: 'Chapter updated successfully' });
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Delete chapter
const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const chapter = await TutorialChapter.findByIdAndDelete(id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Reorder chapters
const reorderChapters = async (req, res) => {
  try {
    const { chapters } = req.body; // Array of { id, order }

    const updates = chapters.map(({ id, order }) => 
      TutorialChapter.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updates);

    res.json({ message: 'Chapters reordered successfully' });
  } catch (error) {
    console.error('Error reordering chapters:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTutorialBySlug,
  getChaptersByTechnology,
  getChapterBySlug,
  getAllChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters
};
