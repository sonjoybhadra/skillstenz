const express = require('express');
const router = express.Router();
const tutorialController = require('../modules/tutorials/tutorialController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes (no auth required - FREE tutorials)
// Order matters - more specific routes first
router.get('/latest', tutorialController.getLatestUpdates);
router.get('/technology/:technologySlug/chapter/:chapterSlug', tutorialController.getChapterBySlug);
router.get('/technology/:technologySlug', tutorialController.getChaptersByTechnology);
router.get('/:slug', tutorialController.getTutorialBySlug);

// Admin routes (auth required)
router.get('/admin/chapters', authenticate, requireAdmin, tutorialController.getAllChapters);
router.post('/admin/chapters', authenticate, requireAdmin, tutorialController.createChapter);
router.post('/admin/import', authenticate, requireAdmin, tutorialController.importChapters);
router.put('/admin/chapters/:id', authenticate, requireAdmin, tutorialController.updateChapter);
router.delete('/admin/chapters/:id', authenticate, requireAdmin, tutorialController.deleteChapter);
router.post('/admin/chapters/reorder', authenticate, requireAdmin, tutorialController.reorderChapters);

module.exports = router;
