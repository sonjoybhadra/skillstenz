const express = require('express');
const router = express.Router();
const hackathonController = require('../modules/hackathons/hackathonController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', hackathonController.getHackathons);
router.get('/:slug', hackathonController.getHackathonBySlug);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, hackathonController.getAllHackathons);
router.post('/', authenticate, requireAdmin, hackathonController.createHackathon);
router.put('/:id', authenticate, requireAdmin, hackathonController.updateHackathon);
router.delete('/:id', authenticate, requireAdmin, hackathonController.deleteHackathon);

module.exports = router;
