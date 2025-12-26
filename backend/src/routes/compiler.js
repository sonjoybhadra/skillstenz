const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middlewares/auth');
const compilerService = require('../services/compilerService');

const router = express.Router();

const runLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many compile requests. Please slow down.',
});

router.post(
  '/run',
  authenticate,
  runLimiter,
  [
    body('language').isString().trim().notEmpty().withMessage('Language is required.'),
    body('code').isString().trim().isLength({ min: 1 }).withMessage('Code cannot be empty.'),
    body('stdin').optional().isString().isLength({ max: 5000 }).withMessage('stdin must be under 5000 characters.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    try {
      const result = await compilerService.executeCode({
        languageKey: req.body.language.toLowerCase(),
        code: req.body.code,
        stdin: req.body.stdin,
      });

      return res.json(result);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ message: error.message || 'Unable to execute code right now.' });
    }
  }
);

module.exports = router;
