const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Security middlewares
const {
  xssProtection,
  noSqlInjectionPrevention,
  queryInjectionProtection,
  parameterPollutionProtection,
  suspiciousActivityLogger,
  validateContentType
} = require('./middlewares/security');

const app = express();

// Security middleware - Helmet with enhanced options
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS with strict origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting - General
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Only 10 auth attempts per 15 minutes
  message: { message: 'Too many authentication attempts, please try again later.' }
});

// Stricter rate limiting for AI routes
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 AI requests per minute
  message: { message: 'AI rate limit exceeded, please try again later.' }
});

// Security: Suspicious activity detection
app.use(suspiciousActivityLogger);

// Security: Content-Type validation
app.use(validateContentType);

// Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security: NoSQL Injection Prevention (must be after body parsing)
app.use(noSqlInjectionPrevention);

// Security: XSS Protection
app.use(xssProtection);

// Security: Query injection protection
app.use(queryInjectionProtection);

// Security: HTTP Parameter Pollution Protection
app.use(parameterPollutionProtection);

// Serve profile images statically
const path = require('path');
app.use('/uploads/profile-images', express.static(path.join(__dirname, '../uploads/profile-images')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  // Seed initial data only if SEED_ON_START env is set or no admin exists
  if (process.env.SEED_ON_START === 'true') {
    const seedData = require('./seed');
    await seedData();
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes with specific rate limiters
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/memberships', require('./routes/memberships'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/technologies', require('./routes/technologies'));
app.use('/api/technology-categories', require('./routes/technologyCategories'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/cheatsheets', require('./routes/cheatsheets'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/tutorials', require('./routes/tutorials'));
app.use('/api/mcqs', require('./routes/mcqs'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/content', require('./routes/content'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/ai', aiLimiter, require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/homepage', require('./routes/homepage'));
app.use('/api/compiler', require('./routes/compiler'));
app.use('/api/roadmaps', require('./routes/roadmaps'));
app.use('/api/hackathons', require('./routes/hackathons'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/ai-tools', require('./routes/aitools'));

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;