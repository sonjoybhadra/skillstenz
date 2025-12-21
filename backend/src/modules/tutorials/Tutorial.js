const mongoose = require('mongoose');

// Tutorial Chapter Schema - for free tutorials
const TutorialChapterSchema = new mongoose.Schema({
  technology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: '📖'
  },
  estimatedTime: {
    type: Number,  // in minutes
    default: 10
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  codeExamples: [{
    title: String,
    language: String,
    code: String,
    output: String
  }],
  practiceExercises: [{
    question: String,
    hint: String,
    solution: String
  }],
  keyPoints: [{
    type: String
  }],
  relatedChapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TutorialChapter'
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for unique slug per technology
TutorialChapterSchema.index({ technology: 1, slug: 1 }, { unique: true });
TutorialChapterSchema.index({ technology: 1, order: 1 });

// Auto-generate slug from title if not provided
TutorialChapterSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

module.exports = mongoose.model('TutorialChapter', TutorialChapterSchema);
