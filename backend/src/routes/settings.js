const express = require('express');
const router = express.Router();
const settingsController = require('../modules/settings/settingsController');
const userSettingsController = require('../modules/settings/userSettingsController');
const apiSettingsController = require('../modules/settings/apiSettingsController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

// Public routes
router.get('/public/seo', settingsController.getPublicSeoData);
router.get('/public/site', settingsController.getSiteSettings);

// User settings routes
router.get('/user', checkAuth, userSettingsController.getUserSettings);
router.put('/user', checkAuth, userSettingsController.updateUserSettings);

// Admin routes - Site Settings
router.get('/site', checkAuth, checkRole(['admin']), settingsController.getSiteSettings);
router.put('/site', checkAuth, checkRole(['admin']), settingsController.updateSiteSettings);

// Admin routes - SEO Settings
router.get('/seo', checkAuth, checkRole(['admin']), settingsController.getSeoSettings);
router.put('/seo', checkAuth, checkRole(['admin']), settingsController.updateSeoSettings);

router.get('/adsense', checkAuth, checkRole(['admin']), settingsController.getAdsenseSettings);
router.put('/adsense', checkAuth, checkRole(['admin']), settingsController.updateAdsenseSettings);

// Admin routes - API Settings (Payment, AI, OAuth, Email)
router.get('/api', checkAuth, checkRole(['admin']), apiSettingsController.getApiSettings);
router.put('/api', checkAuth, checkRole(['admin']), apiSettingsController.updateAllApiSettings);
router.put('/api/openai', checkAuth, checkRole(['admin']), apiSettingsController.updateOpenAISettings);
router.put('/api/razorpay', checkAuth, checkRole(['admin']), apiSettingsController.updateRazorpaySettings);
router.put('/api/stripe', checkAuth, checkRole(['admin']), apiSettingsController.updateStripeSettings);
router.put('/api/email', checkAuth, checkRole(['admin']), apiSettingsController.updateEmailSettings);
router.put('/api/google-oauth', checkAuth, checkRole(['admin']), apiSettingsController.updateGoogleOAuthSettings);
router.put('/api/github-oauth', checkAuth, checkRole(['admin']), apiSettingsController.updateGitHubOAuthSettings);
router.post('/api/test-openai', checkAuth, checkRole(['admin']), apiSettingsController.testOpenAIConnection);
router.post('/api/test-razorpay', checkAuth, checkRole(['admin']), apiSettingsController.testRazorpayConnection);

module.exports = router;
