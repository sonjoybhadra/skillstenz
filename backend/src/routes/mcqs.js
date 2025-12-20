const express = require('express');
const router = express.Router();
const mcqController = require('../modules/mcqs/mcqController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', mcqController.getMCQs);
router.get('/interview', mcqController.getInterviewMCQs);
router.get('/skill/:skill', mcqController.getSkillMCQs);
router.get('/:id', mcqController.getMCQ);

// Authenticated routes
router.post('/:id/submit', authenticate, mcqController.submitAnswer);
router.post('/complete-test', authenticate, mcqController.completeTest);
router.get('/user/progress', authenticate, mcqController.getUserProgress);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, mcqController.getAllMCQs);
router.post('/', authenticate, requireAdmin, mcqController.createMCQ);
router.put('/:id', authenticate, requireAdmin, mcqController.updateMCQ);
router.delete('/:id', authenticate, requireAdmin, mcqController.deleteMCQ);

module.exports = router;
