const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middlewares/auth');
const TutorialChapter = require('./TutorialChapter');
const Technology = require('../technologies/Technology');

// @route   POST /api/tutorials/admin/import
// @desc    Import tutorial chapters
// @access  Private/Admin
router.post('/import', protect, authorize('admin', 'instructor'), async (req, res) => {
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
});

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

module.exports = router;
