const express = require('express');
const router = express.Router();
const certificateController = require('../modules/certificates/certificateController');
const { authenticate, requireAdmin, requireInstructor } = require('../middlewares/auth');

// Public routes
router.get('/verify/:certificateId', certificateController.verifyCertificate);
router.get('/view/:certificateId', certificateController.getCertificateById);

// User routes (authenticated)
router.get('/user/:userId', authenticate, certificateController.getUserCertificates);
router.post('/:certificateId/share', authenticate, certificateController.trackShare);

// Admin routes
router.post('/generate', authenticate, requireInstructor, certificateController.generateCertificate);
router.get('/admin/all', authenticate, requireAdmin, certificateController.getAllCertificates);
router.get('/admin/stats', authenticate, requireAdmin, certificateController.getCertificateStats);
router.put('/admin/:certificateId', authenticate, requireAdmin, certificateController.updateCertificate);
router.post('/admin/:certificateId/revoke', authenticate, requireAdmin, certificateController.revokeCertificate);
router.delete('/admin/:certificateId', authenticate, requireAdmin, certificateController.deleteCertificate);

module.exports = router;
