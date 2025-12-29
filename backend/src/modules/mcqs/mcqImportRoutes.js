const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middlewares/auth');
const MCQ = require('./MCQ');

// @route   POST /api/mcqs/import
// @desc    Import MCQ questions
// @access  Private/Admin
router.post('/import', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    let mcqsData = req.body;
    
    // Handle single or array
    if (!Array.isArray(mcqsData)) {
      mcqsData = [mcqsData];
    }

    if (mcqsData.length === 0) {
      return res.status(400).json({ message: 'At least one MCQ is required' });
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: [],
      mcqs: []
    };

    for (const mcqData of mcqsData) {
      try {
        // Validate required fields
        if (!mcqData.question) {
          results.failed++;
          results.errors.push('Question text is required');
          continue;
        }

        if (!mcqData.options || mcqData.options.length < 2) {
          results.failed++;
          results.errors.push(`"${mcqData.question.substring(0, 30)}...": At least 2 options required`);
          continue;
        }

        // Ensure at least one correct answer
        const hasCorrect = mcqData.options.some(opt => opt.isCorrect);
        if (!hasCorrect) {
          results.failed++;
          results.errors.push(`"${mcqData.question.substring(0, 30)}...": At least one correct answer required`);
          continue;
        }

        // Set defaults
        mcqData.category = mcqData.category || 'technology';
        mcqData.difficulty = mcqData.difficulty || 'medium';
        mcqData.points = mcqData.points || 10;
        mcqData.isActive = mcqData.isActive !== false;
        mcqData.createdBy = req.user._id;

        // Find correct answer index
        const correctIndex = mcqData.options.findIndex(opt => opt.isCorrect);
        mcqData.correctAnswer = correctIndex;

        // Create MCQ
        const mcq = await MCQ.create(mcqData);
        results.imported++;
        results.mcqs.push({
          _id: mcq._id,
          question: mcq.question.substring(0, 50) + '...'
        });
      } catch (err) {
        results.failed++;
        results.errors.push(`MCQ: ${err.message}`);
      }
    }

    res.status(results.imported > 0 ? 201 : 400).json({
      success: results.imported > 0,
      message: `Imported ${results.imported} of ${mcqsData.length} MCQs`,
      ...results
    });
  } catch (error) {
    console.error('Import MCQs error:', error);
    res.status(500).json({ message: 'Failed to import MCQs', error: error.message });
  }
});

// @route   POST /api/mcqs/import/technology/:techId
// @desc    Import MCQs for a specific technology
// @access  Private/Admin
router.post('/import/technology/:techId', protect, authorize('admin'), async (req, res) => {
  try {
    let mcqsData = req.body;
    const { techId } = req.params;
    
    if (!Array.isArray(mcqsData)) {
      mcqsData = [mcqsData];
    }

    // Add technology to all MCQs
    mcqsData = mcqsData.map(mcq => ({
      ...mcq,
      technology: techId
    }));

    // Use the same import logic
    const results = {
      imported: 0,
      failed: 0,
      errors: []
    };

    for (const mcqData of mcqsData) {
      try {
        if (!mcqData.question || !mcqData.options?.length >= 2) {
          results.failed++;
          continue;
        }

        const correctIndex = mcqData.options.findIndex(opt => opt.isCorrect);
        mcqData.correctAnswer = correctIndex;
        mcqData.createdBy = req.user._id;

        await MCQ.create(mcqData);
        results.imported++;
      } catch (err) {
        results.failed++;
        results.errors.push(err.message);
      }
    }

    res.json({
      success: results.imported > 0,
      message: `Imported ${results.imported} of ${mcqsData.length} MCQs`,
      ...results
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to import', error: error.message });
  }
});

module.exports = router;
