const express = require('express');
const userController = require('../modules/users/userController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Public routes - Must be before checkAuth
router.get('/public/:username', userController.getPublicProfile);

// All routes below require authentication
router.use(checkAuth);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Profile image upload
const uploadProfileImage = require('../middlewares/uploadProfileImage');
router.post('/profile/image', uploadProfileImage.single('image'), userController.uploadProfileImage);

// Admin only routes
router.get('/', checkRole(['admin']), userController.getAllUsers);
router.put('/:userId/status', checkRole(['admin']), userController.updateUserStatus);
router.put('/:userId/membership', checkRole(['admin']), userController.assignMembership);

module.exports = router;