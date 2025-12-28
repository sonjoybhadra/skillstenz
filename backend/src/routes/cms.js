const express = require('express');
const router = express.Router();
const cmsController = require('../modules/cms/cmsController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/page/:slug', cmsController.getPage);
router.post('/contact', cmsController.submitContactForm);

// Admin routes
router.get('/pages', authenticate, requireAdmin, cmsController.getAllPages);
router.put('/page/:slug', authenticate, requireAdmin, cmsController.savePage);
router.delete('/page/:slug', authenticate, requireAdmin, cmsController.deletePage);

// Contact messages admin
router.get('/messages', authenticate, requireAdmin, cmsController.getContactMessages);
router.patch('/messages/:id', authenticate, requireAdmin, cmsController.updateMessageStatus);
router.delete('/messages/:id', authenticate, requireAdmin, cmsController.deleteMessage);

module.exports = router;
