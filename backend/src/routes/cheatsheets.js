const express = require('express');
const router = express.Router();
const cheatsheetController = require('../modules/cheatsheets/cheatsheetController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', cheatsheetController.getAllCheatsheets);
router.get('/slug/:slug', cheatsheetController.getCheatsheetBySlug);
router.get('/:id', cheatsheetController.getCheatsheetById);

// Protected routes
router.post('/:id/vote', authenticate, cheatsheetController.voteCheatsheet);
router.post('/:id/download', cheatsheetController.trackDownload);

// Admin routes
router.get('/admin/stats', authenticate, requireAdmin, cheatsheetController.getCheatsheetStats);
router.post('/', authenticate, requireAdmin, cheatsheetController.createCheatsheet);
router.post('/import', authenticate, requireAdmin, cheatsheetController.importCheatsheet);
router.put('/:id', authenticate, requireAdmin, cheatsheetController.updateCheatsheet);
router.delete('/:id', authenticate, requireAdmin, cheatsheetController.deleteCheatsheet);

module.exports = router;
