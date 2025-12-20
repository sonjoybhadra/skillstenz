const express = require('express');
const membershipController = require('../modules/memberships/membershipController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// All routes require authentication
router.use(checkAuth);

// User routes
router.get('/', membershipController.getMembership);
router.post('/upgrade', membershipController.upgradeMembership);
router.post('/cancel', membershipController.cancelMembership);

// Admin routes
router.get('/all', checkRole(['admin']), membershipController.getAllMemberships);
router.put('/:membershipId/status', checkRole(['admin']), membershipController.updateMembershipStatus);

module.exports = router;