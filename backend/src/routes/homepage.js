const express = require('express');
const router = express.Router();
const homepageController = require('../modules/homepage/homepageController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

// Public routes
router.get('/sections', homepageController.getAllSections);
router.get('/sections/:sectionKey', homepageController.getSectionByKey);

// Admin routes
router.get('/admin/sections', checkAuth, checkRole(['admin']), homepageController.adminGetAllSections);
router.put('/admin/sections/reorder', checkAuth, checkRole(['admin']), homepageController.reorderSections);
router.get('/admin/sections/:id', checkAuth, checkRole(['admin']), homepageController.adminGetSection);
router.post('/admin/sections', checkAuth, checkRole(['admin']), homepageController.createSection);
router.put('/admin/sections/:id', checkAuth, checkRole(['admin']), homepageController.updateSection);
router.put('/admin/sections/key/:sectionKey', checkAuth, checkRole(['admin']), homepageController.updateSectionByKey);
router.delete('/admin/sections/:id', checkAuth, checkRole(['admin']), homepageController.deleteSection);
router.patch('/admin/sections/:id/toggle', checkAuth, checkRole(['admin']), homepageController.toggleSectionStatus);
router.patch('/admin/sections/:sectionKey/items', checkAuth, checkRole(['admin']), homepageController.updateSectionItems);

module.exports = router;
