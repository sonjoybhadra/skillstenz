const express = require('express');
const topicController = require('../modules/topics/topicController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Public routes
router.get('/technology/:technologyId', topicController.getTopicsByTechnology);
router.get('/:id', topicController.getTopic);

// Protected routes
router.use(checkAuth);

// Admin routes
router.post('/', checkRole(['admin']), topicController.createTopic);
router.put('/:id', checkRole(['admin']), topicController.updateTopic);
router.delete('/:id', checkRole(['admin']), topicController.deleteTopic);
router.put('/:id/approve/:subtopicIndex/:contentIndex', checkRole(['admin']), topicController.approveContent);

module.exports = router;