const express = require('express');
const router = express.Router();
const planController = require('../modules/plans/planController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', planController.getPlans);
router.get('/:id', planController.getPlan);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, planController.getAllPlans);
router.post('/', authenticate, requireAdmin, planController.createPlan);
router.put('/:id', authenticate, requireAdmin, planController.updatePlan);
router.delete('/:id', authenticate, requireAdmin, planController.deletePlan);
router.post('/reorder', authenticate, requireAdmin, planController.reorderPlans);

module.exports = router;
