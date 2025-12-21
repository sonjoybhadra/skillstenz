const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  // Seed initial data
  if (process.env.NODE_ENV !== 'production') {
    const seedData = require('./seed');
    await seedData();
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
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
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/careers', require('./routes/careers'));

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