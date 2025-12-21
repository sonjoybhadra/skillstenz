const express = require('express');
const router = express.Router();
const tutorialController = require('../modules/tutorials/tutorialController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes (no auth required - FREE tutorials)
router.get('/technology/:technologySlug', tutorialController.getChaptersByTechnology);
router.get('/technology/:technologySlug/chapter/:chapterSlug', tutorialController.getChapterBySlug);

// Admin routes (auth required)
router.get('/admin/chapters', authenticate, requireAdmin, tutorialController.getAllChapters);
router.post('/admin/chapters', authenticate, requireAdmin, tutorialController.createChapter);
router.put('/admin/chapters/:id', authenticate, requireAdmin, tutorialController.updateChapter);
router.delete('/admin/chapters/:id', authenticate, requireAdmin, tutorialController.deleteChapter);
router.post('/admin/chapters/reorder', authenticate, requireAdmin, tutorialController.reorderChapters);

module.exports = router;
