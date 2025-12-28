/**
 * Security Middleware - Protection against injection attacks
 * XSS, NoSQL Injection, Parameter Pollution, etc.
 */

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

/**
 * Sanitize object recursively to prevent XSS attacks
 */
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    // Sanitize string values
    return xss(obj, {
      whiteList: {}, // Remove all HTML tags
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style']
    });
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  
  return obj;
};

/**
 * XSS Protection Middleware
 * Sanitizes req.body, req.query, and req.params
 */
const xssProtection = (req, res, next) => {
  try {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    next();
  } catch (error) {
    console.error('XSS protection error:', error);
    next();
  }
};

/**
 * NoSQL Injection Prevention
 * Removes $ and . from keys to prevent MongoDB injection
 */
const noSqlInjectionPrevention = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`NoSQL injection attempt blocked: ${key} in ${req.originalUrl}`);
  }
});

/**
 * Block dangerous patterns in query strings
 */
const dangerousPatterns = [
  /\$where/i,
  /\$gt/i,
  /\$gte/i,
  /\$lt/i,
  /\$lte/i,
  /\$ne/i,
  /\$in/i,
  /\$nin/i,
  /\$or/i,
  /\$and/i,
  /\$not/i,
  /\$nor/i,
  /\$exists/i,
  /\$type/i,
  /\$mod/i,
  /\$regex/i,
  /\$text/i,
  /\$where/i,
  /\$elemMatch/i,
  /\$size/i,
  /\$all/i,
  /mapReduce/i,
  /\$function/i,
  /\$accumulator/i
];

const queryInjectionProtection = (req, res, next) => {
  const checkForInjection = (obj, location) => {
    if (!obj || typeof obj !== 'object') return false;
    
    const jsonString = JSON.stringify(obj);
    for (const pattern of dangerousPatterns) {
      if (pattern.test(jsonString)) {
        console.warn(`Potential NoSQL injection blocked in ${location}: ${jsonString.substring(0, 100)}`);
        return true;
      }
    }
    return false;
  };

  // Only check query params (not body, as some legitimate operations use these)
  if (checkForInjection(req.query, 'query')) {
    return res.status(400).json({ 
      message: 'Invalid query parameters detected',
      error: 'Potentially malicious request blocked'
    });
  }

  next();
};

/**
 * HTTP Parameter Pollution Protection
 * Prevents attackers from sending multiple values for same parameter
 */
const parameterPollutionProtection = (req, res, next) => {
  // For query params, if multiple values exist, take only the last one
  if (req.query) {
    for (const key in req.query) {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][req.query[key].length - 1];
      }
    }
  }
  next();
};

/**
 * Request Size Limiter for specific routes
 */
const createSizeLimiter = (maxSize = '1mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxBytes = parseSize(maxSize);
    
    if (contentLength > maxBytes) {
      return res.status(413).json({
        message: 'Request too large',
        error: `Maximum size is ${maxSize}`
      });
    }
    next();
  };
};

const parseSize = (size) => {
  const units = { b: 1, kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 };
  const match = size.toLowerCase().match(/^(\d+)(b|kb|mb|gb)?$/);
  if (!match) return 1024 * 1024; // Default 1MB
  return parseInt(match[1]) * (units[match[2]] || 1);
};

/**
 * Validate and sanitize ObjectId parameters
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !/^[a-fA-F0-9]{24}$/.test(id)) {
      // Check if it could be a slug instead
      if (/^[a-z0-9-]+$/i.test(id)) {
        return next(); // Allow slugs
      }
      return res.status(400).json({
        message: 'Invalid ID format',
        error: 'ID must be a valid ObjectId or slug'
      });
    }
    next();
  };
};

/**
 * Sanitize file uploads
 */
const sanitizeFileName = (filename) => {
  if (!filename) return filename;
  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/\.\./g, '')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/^\.+/, '')
    .substring(0, 255);
};

/**
 * Log suspicious activity
 */
const suspiciousActivityLogger = (req, res, next) => {
  const suspiciousHeaders = ['x-forwarded-host', 'x-original-url', 'x-rewrite-url'];
  const suspicious = suspiciousHeaders.some(header => req.headers[header]);
  
  if (suspicious) {
    console.warn(`Suspicious request from ${req.ip}: ${req.method} ${req.originalUrl}`);
  }
  
  // Check for common attack patterns in URL
  const attackPatterns = [
    /\.\.\//,           // Path traversal
    /<script/i,         // XSS
    /javascript:/i,     // XSS
    /on\w+=/i,          // Event handlers
    /union.*select/i,   // SQL injection
    /exec\s*\(/i,       // Command injection
    /eval\s*\(/i        // Code injection
  ];
  
  const urlToCheck = decodeURIComponent(req.originalUrl);
  for (const pattern of attackPatterns) {
    if (pattern.test(urlToCheck)) {
      console.warn(`Attack pattern detected from ${req.ip}: ${req.method} ${req.originalUrl}`);
      return res.status(400).json({
        message: 'Invalid request',
        error: 'Request blocked for security reasons'
      });
    }
  }
  
  next();
};

/**
 * Content-Type validation
 */
const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'] || '';
    
    // Skip for file uploads
    if (contentType.includes('multipart/form-data')) {
      return next();
    }
    
    // For API routes, require JSON
    if (req.body && Object.keys(req.body).length > 0) {
      if (!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded')) {
        return res.status(415).json({
          message: 'Unsupported Media Type',
          error: 'Content-Type must be application/json'
        });
      }
    }
  }
  next();
};

module.exports = {
  xssProtection,
  noSqlInjectionPrevention,
  queryInjectionProtection,
  parameterPollutionProtection,
  createSizeLimiter,
  validateObjectId,
  sanitizeFileName,
  sanitizeObject,
  suspiciousActivityLogger,
  validateContentType
};
