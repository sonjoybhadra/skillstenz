const express = require('express');
const router = express.Router();
const roadmapController = require('../modules/roadmaps/roadmapController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', roadmapController.getRoadmaps);
router.get('/:slug', roadmapController.getRoadmapBySlug);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, roadmapController.getAllRoadmaps);
router.post('/', authenticate, requireAdmin, roadmapController.createRoadmap);
router.put('/:id', authenticate, requireAdmin, roadmapController.updateRoadmap);
router.patch('/:id/toggle', authenticate, requireAdmin, roadmapController.toggleRoadmapStatus);
router.delete('/:id', authenticate, requireAdmin, roadmapController.deleteRoadmap);

module.exports = router;
