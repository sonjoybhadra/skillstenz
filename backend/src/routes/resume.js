const express = require('express');
const resumeController = require('../modules/resume/resumeController');
const checkAuth = require('../middlewares/checkAuth');
const checkMembership = require('../middlewares/checkMembership');

const router = express.Router();

// Public routes
router.get('/public/:publicId', resumeController.getPublicResume);

// Protected routes
router.use(checkAuth);

router.get('/', resumeController.getResume);
router.post('/', resumeController.createResume);
router.put('/', resumeController.updateResume);
router.post('/autofill', resumeController.autoFillResume);
router.get('/export/pdf', checkMembership(['silver', 'gold']), resumeController.exportPDF);
router.get('/export/docx', checkMembership(['silver', 'gold']), resumeController.exportDOCX);
router.post('/public', checkMembership(['silver', 'gold']), resumeController.makePublic);

module.exports = router;