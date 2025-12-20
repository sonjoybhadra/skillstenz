const express = require('express');
const courseController = require('../modules/courses/courseController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/stats', checkAuth, checkRole(['admin']), courseController.getCourseStats);
router.get('/slug/:slug', courseController.getCourseBySlug);
router.get('/:id', courseController.getCourseById);

// Protected routes
router.use(checkAuth);

// Vote and rate
router.post('/:id/vote', courseController.voteCourse);
router.post('/:id/rate', courseController.rateCourse);

// Admin routes
router.post('/', checkRole(['admin', 'instructor']), courseController.createCourse);
router.put('/:id', checkRole(['admin', 'instructor']), courseController.updateCourse);
router.delete('/:id', checkRole(['admin']), courseController.deleteCourse);

// Section and lesson management
router.post('/:id/sections', checkRole(['admin', 'instructor']), courseController.addSection);
router.post('/:id/sections/:sectionIndex/lessons', checkRole(['admin', 'instructor']), courseController.addLesson);

module.exports = router;
