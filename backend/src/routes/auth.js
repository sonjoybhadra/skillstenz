const express = require('express');
const { body } = require('express-validator');
const authController = require('../modules/auth/authController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').optional().trim().isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('userType').isIn(['fresher', 'experienced'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', loginValidation, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, authController.updateProfile);

// Admin routes - User management
router.get('/users', authenticate, requireAdmin, authController.getAllUsers);
router.get('/users/:id', authenticate, requireAdmin, authController.getUserById);
router.put('/users/:id', authenticate, requireAdmin, authController.updateUser);
router.delete('/users/:id', authenticate, requireAdmin, authController.deleteUser);

module.exports = router;