const express = require('express');
const profileController = require('../modules/profiles/profileController');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

// All routes require authentication
router.use(checkAuth);

router.get('/', profileController.getProfile);
router.post('/', profileController.createOrUpdateProfile);
router.get('/versions', profileController.getProfileVersions);
router.post('/restore/:version', profileController.restoreProfileVersion);

module.exports = router;