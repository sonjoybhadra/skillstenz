const express = require('express');
const router = express.Router();
const careerController = require('../modules/careers/careerController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', careerController.getJobs);
router.get('/benefits', careerController.getBenefits);
router.get('/:slug', careerController.getJobBySlug);
router.post('/:jobId/apply', careerController.applyForJob);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, careerController.getAllJobs);
router.get('/admin/applications', authenticate, requireAdmin, careerController.getApplications);
router.patch('/admin/applications/:id', authenticate, requireAdmin, careerController.updateApplicationStatus);
router.post('/', authenticate, requireAdmin, careerController.createJob);
router.put('/:id', authenticate, requireAdmin, careerController.updateJob);
router.patch('/:id/toggle', authenticate, requireAdmin, careerController.toggleJobStatus);
router.delete('/:id', authenticate, requireAdmin, careerController.deleteJob);

module.exports = router;
