const express = require('express');
const router = express.Router();
const internshipController = require('../modules/internships/internshipController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', internshipController.getInternships);
router.get('/:slug', internshipController.getInternshipBySlug);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, internshipController.getAllInternships);
router.post('/', authenticate, requireAdmin, internshipController.createInternship);
router.put('/:id', authenticate, requireAdmin, internshipController.updateInternship);
router.delete('/:id', authenticate, requireAdmin, internshipController.deleteInternship);

module.exports = router;
