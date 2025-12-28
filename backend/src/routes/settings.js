const express = require('express');
const router = express.Router();
const settingsController = require('../modules/settings/settingsController');
const userSettingsController = require('../modules/settings/userSettingsController');
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

module.exports = router;
