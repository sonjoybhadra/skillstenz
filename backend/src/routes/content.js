const express = require('express');
const contentController = require('../modules/content/contentController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Public routes
router.get('/search', contentController.searchContent);
router.get('/topic/:topicId', contentController.getContentByTopic);
router.get('/:id', contentController.getContent);

// Protected routes
router.use(checkAuth);

// User routes
router.post('/', contentController.createContent);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

// Admin routes
router.put('/:id/approve', checkRole(['admin']), contentController.approveContent);
router.get('/admin/pending', checkRole(['admin']), contentController.getPendingContent);

module.exports = router;