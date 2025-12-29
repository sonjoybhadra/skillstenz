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

// Get latest/recently updated tutorials (for homepage "Latest Updates" section)
const getLatestUpdates = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Get recently created or updated chapters
    const latestChapters = await TutorialChapter.find({ isPublished: true })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .populate('technology', 'name slug icon color')
      .select('title slug description technology updatedAt createdAt');

    // Format for frontend
    const latestUpdates = latestChapters.map(chapter => {
      const isNew = (new Date() - new Date(chapter.createdAt)) < (7 * 24 * 60 * 60 * 1000); // Less than 7 days old
      return {
        _id: chapter._id,
        name: chapter.title,
        title: chapter.title,
        slug: chapter.slug,
        description: chapter.description,
        technology: chapter.technology?.name,
        technologySlug: chapter.technology?.slug,
        icon: chapter.technology?.icon || '📚',
        href: `/tutorials/${chapter.technology?.slug}/${chapter.slug}`,
        isNew,
        updatedAt: chapter.updatedAt,
        createdAt: chapter.createdAt
      };
    });

    res.json({
      latestUpdates,
      monthYear: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      total: latestUpdates.length
    });
  } catch (error) {
    console.error('Error fetching latest updates:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Import tutorial chapters
const importChapters = async (req, res) => {
  try {
    let chaptersData = req.body;
    
    // Handle single or array
    if (!Array.isArray(chaptersData)) {
      chaptersData = [chaptersData];
    }

    if (chaptersData.length === 0) {
      return res.status(400).json({ message: 'At least one chapter is required' });
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: [],
      chapters: []
    };

    for (const chapterData of chaptersData) {
      try {
        // Validate required fields
        if (!chapterData.title) {
          results.failed++;
          results.errors.push('Chapter title is required');
          continue;
        }

        if (!chapterData.technologyId) {
          results.failed++;
          results.errors.push(`Chapter "${chapterData.title}": technology is required`);
          continue;
        }

        // Generate slug if not provided
        if (!chapterData.slug) {
          chapterData.slug = chapterData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }

        // Check if chapter exists
        const exists = await TutorialChapter.findOne({ 
          slug: chapterData.slug,
          technology: chapterData.technologyId
        });
        
        if (exists) {
          results.failed++;
          results.errors.push(`Chapter "${chapterData.title}" already exists`);
          continue;
        }

        // Map technologyId to technology field
        chapterData.technology = chapterData.technologyId;
        delete chapterData.technologyId;

        // Parse YouTube URL if provided
        if (chapterData.videoUrl) {
          const parsed = parseYouTubeUrl(chapterData.videoUrl);
          chapterData.videoUrl = parsed.videoUrl;
          chapterData.videoProvider = parsed.videoProvider;
          chapterData.videoId = parsed.videoId;
        }

        // Create chapter
        const chapter = await TutorialChapter.create(chapterData);
        results.imported++;
        results.chapters.push({
          _id: chapter._id,
          title: chapter.title,
          slug: chapter.slug
        });
      } catch (err) {
        results.failed++;
        results.errors.push(`${chapterData.title || 'Unknown'}: ${err.message}`);
      }
    }

    res.status(results.imported > 0 ? 201 : 400).json({
      success: results.imported > 0,
      message: `Imported ${results.imported} of ${chaptersData.length} chapters`,
      ...results
    });
  } catch (error) {
    console.error('Import tutorials error:', error);
    res.status(500).json({ message: 'Failed to import tutorials', error: error.message });
  }
};

// Helper function to parse YouTube URLs
function parseYouTubeUrl(url) {
  if (!url) return {};
  
  const result = { videoUrl: url, videoProvider: 'youtube' };
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      result.videoId = match[1];
      result.videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
      break;
    }
  }

  return result;
}

module.exports = {
  getTutorialBySlug,
  getChaptersByTechnology,
  getChapterBySlug,
  getAllChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
  getLatestUpdates,
  importChapters
};
