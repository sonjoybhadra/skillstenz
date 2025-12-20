const express = require('express');
const technologyController = require('../modules/technologies/technologyController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Public routes
router.get('/', technologyController.getAllTechnologies);
router.get('/stats', checkAuth, checkRole(['admin']), technologyController.getTechnologyStats);
router.get('/slug/:slug', technologyController.getTechnologyBySlug);
router.get('/:id', technologyController.getTechnologyById);

// Protected routes
router.use(checkAuth);

// Vote on technology
router.post('/:id/vote', technologyController.voteTechnology);

// Admin routes for technologies
router.post('/', checkRole(['admin']), technologyController.createTechnology);
router.put('/:id', checkRole(['admin']), technologyController.updateTechnology);
router.delete('/:id', checkRole(['admin']), technologyController.deleteTechnology);

module.exports = router;