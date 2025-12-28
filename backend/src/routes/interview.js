const express = require('express');
const router = express.Router();
const interviewController = require('../modules/interview/interviewController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', interviewController.getInterviewTopics);
router.get('/:slug', interviewController.getTopicBySlug);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, interviewController.getAllTopics);
router.post('/', authenticate, requireAdmin, interviewController.createTopic);
router.put('/:id', authenticate, requireAdmin, interviewController.updateTopic);
router.delete('/:id', authenticate, requireAdmin, interviewController.deleteTopic);

module.exports = router;
