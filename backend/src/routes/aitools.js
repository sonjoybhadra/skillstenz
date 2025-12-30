const express = require('express');
const router = express.Router();
const aiToolController = require('../modules/aitools/aiToolController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes (specific routes BEFORE dynamic :id routes)
router.get('/', aiToolController.getAllAITools);
router.get('/categories', aiToolController.getCategories);
router.get('/featured', aiToolController.getFeaturedAITools);
router.get('/trending', aiToolController.getTrendingAITools);

// Admin routes (specific routes before dynamic)
router.get('/admin/stats', authenticate, requireAdmin, aiToolController.getAIToolStats);
router.post('/bulk-update', authenticate, requireAdmin, aiToolController.bulkUpdateAITools);

// Dynamic routes with :slug and :id
router.get('/slug/:slug', aiToolController.getAIToolBySlug);
router.get('/admin/:id', authenticate, requireAdmin, aiToolController.getAIToolById);
router.post('/:id/vote', authenticate, aiToolController.voteAITool);
router.post('/', authenticate, requireAdmin, aiToolController.createAITool);
router.put('/:id', authenticate, requireAdmin, aiToolController.updateAITool);
router.delete('/:id', authenticate, requireAdmin, aiToolController.deleteAITool);

module.exports = router;
