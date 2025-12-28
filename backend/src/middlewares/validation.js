/**
 * Input Validation Helpers
 * Common validation rules for routes
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Common validation rules
 */
const validationRules = {
  // ObjectId validation
  objectId: (fieldName = 'id', location = 'param') => {
    const validator = location === 'param' ? param(fieldName) : 
                      location === 'query' ? query(fieldName) : body(fieldName);
    return validator
      .optional()
      .matches(/^[a-fA-F0-9]{24}$/)
      .withMessage(`${fieldName} must be a valid ObjectId`);
  },

  // Slug validation
  slug: (fieldName = 'slug', location = 'param') => {
    const validator = location === 'param' ? param(fieldName) : 
                      location === 'query' ? query(fieldName) : body(fieldName);
    return validator
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage(`${fieldName} must be a valid slug (lowercase letters, numbers, and hyphens)`);
  },

  // Email validation
  email: (fieldName = 'email') => {
    return body(fieldName)
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address');
  },

  // Password validation
  password: (fieldName = 'password') => {
    return body(fieldName)
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number');
  },

  // Username validation
  username: (fieldName = 'username') => {
    return body(fieldName)
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and hyphens');
  },

  // Name validation (for full names)
  name: (fieldName = 'name') => {
    return body(fieldName)
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage(`${fieldName} must be between 2 and 100 characters`)
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  },

  // Title validation
  title: (fieldName = 'title') => {
    return body(fieldName)
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage(`${fieldName} must be between 3 and 200 characters`)
      .escape();
  },

  // Description/Content validation
  content: (fieldName = 'content', maxLength = 50000) => {
    return body(fieldName)
      .optional()
      .isLength({ max: maxLength })
      .withMessage(`${fieldName} cannot exceed ${maxLength} characters`);
  },

  // URL validation
  url: (fieldName = 'url') => {
    return body(fieldName)
      .optional()
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage(`${fieldName} must be a valid URL`);
  },

  // Pagination validation
  pagination: () => [
    query('page')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Page must be a positive integer (max 1000)'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],

  // Search query validation
  search: (fieldName = 'search') => {
    return query(fieldName)
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query cannot exceed 100 characters')
      .escape();
  },

  // Boolean validation
  boolean: (fieldName, location = 'body') => {
    const validator = location === 'query' ? query(fieldName) : body(fieldName);
    return validator
      .optional()
      .isBoolean()
      .withMessage(`${fieldName} must be true or false`);
  },

  // Enum validation
  enum: (fieldName, allowedValues, location = 'body') => {
    const validator = location === 'query' ? query(fieldName) : body(fieldName);
    return validator
      .optional()
      .isIn(allowedValues)
      .withMessage(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  },

  // Integer validation
  integer: (fieldName, options = {}, location = 'body') => {
    const validator = location === 'query' ? query(fieldName) : body(fieldName);
    return validator
      .optional()
      .isInt(options)
      .withMessage(`${fieldName} must be a valid integer`);
  },

  // Array validation
  array: (fieldName, options = {}) => {
    return body(fieldName)
      .optional()
      .isArray(options)
      .withMessage(`${fieldName} must be an array`);
  },

  // Tags validation
  tags: (fieldName = 'tags') => {
    return body(fieldName)
      .optional()
      .isArray({ max: 20 })
      .withMessage('Tags must be an array with maximum 20 items')
      .custom((value) => {
        if (value) {
          for (const tag of value) {
            if (typeof tag !== 'string' || tag.length > 50) {
              throw new Error('Each tag must be a string with maximum 50 characters');
            }
          }
        }
        return true;
      });
  }
};

/**
 * Preset validation chains for common operations
 */
const presets = {
  // Registration validation
  register: [
    validationRules.email('email'),
    validationRules.password('password'),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    handleValidationErrors
  ],

  // Login validation
  login: [
    validationRules.email('email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ],

  // Course creation validation
  createCourse: [
    validationRules.title('title'),
    validationRules.content('description', 5000),
    validationRules.enum('level', ['beginner', 'intermediate', 'advanced']),
    validationRules.tags('tags'),
    handleValidationErrors
  ],

  // Article creation validation
  createArticle: [
    validationRules.title('title'),
    validationRules.content('content', 100000),
    validationRules.tags('tags'),
    handleValidationErrors
  ],

  // Generic ID param validation
  idParam: [
    param('id')
      .matches(/^[a-fA-F0-9]{24}$|^[a-z0-9-]+$/)
      .withMessage('Invalid ID or slug format'),
    handleValidationErrors
  ],

  // Pagination validation
  paginated: [
    ...validationRules.pagination(),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  validationRules,
  presets,
  body,
  param,
  query,
  validationResult
};
