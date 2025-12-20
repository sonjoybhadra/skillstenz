const express = require('express');
const aiController = require('../modules/ai/aiController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');
const checkMembership = require('../middlewares/checkMembership');

const router = express.Router();

// All routes require authentication
router.use(checkAuth);

router.post('/query', aiController.processQuery);
router.get('/usage', aiController.getUsageStats);
router.get('/history', aiController.getQueryHistory);

// Admin routes
router.get('/admin/stats', checkRole(['admin']), aiController.getAdminStats);

module.exports = router;