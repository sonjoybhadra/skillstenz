const express = require('express');
const adminController = require('../modules/admin/adminController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// All routes require admin role
router.use(checkAuth);
router.use(checkRole(['admin']));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Technology management
router.get('/technologies', adminController.getAllTechnologies);
router.get('/technologies/:id', adminController.getTechnologyById);
router.post('/technologies', adminController.createTechnology);
router.put('/technologies/:id', adminController.updateTechnology);
router.delete('/technologies/:id', adminController.deleteTechnology);

// Course management (within technologies)
router.get('/courses', adminController.getAllCourses);
router.post('/technologies/:techId/courses', adminController.addCourse);
router.put('/technologies/:techId/courses/:courseId', adminController.updateCourse);
router.delete('/technologies/:techId/courses/:courseId', adminController.deleteCourse);

// Content moderation
router.get('/content-moderation', adminController.getContentModeration);
router.put('/content/:contentId/approve', adminController.approveContent);
router.delete('/content/:contentId/reject', adminController.rejectContent);

// Membership stats
router.get('/membership-stats', adminController.getMembershipStats);

// Site settings
router.get('/site-settings', adminController.getSiteSettings);
router.put('/site-settings', adminController.updateSiteSettings);

module.exports = router;