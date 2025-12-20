const express = require('express');
const paymentController = require('../modules/payments/paymentController');
const razorpayController = require('../modules/payments/razorpayController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Webhooks (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);
router.post('/razorpay/webhook', express.json(), razorpayController.razorpayWebhook);

// Public route - get Razorpay key
router.get('/razorpay/key', razorpayController.getRazorpayKey);

// Protected routes
router.use(checkAuth);

// Stripe routes (legacy)
router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);

// Razorpay routes
router.post('/razorpay/create-order', razorpayController.createOrder);
router.post('/razorpay/verify', razorpayController.verifyPayment);

// Payment history
router.get('/history', razorpayController.getPaymentHistory);

// Admin routes
router.get('/all', checkRole(['admin']), razorpayController.getAllPayments);

module.exports = router;