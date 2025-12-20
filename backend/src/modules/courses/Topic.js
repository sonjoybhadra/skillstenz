const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
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
    type: String, // Markdown content
    default: ''
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  technology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  },
  order: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in minutes
    default: 10
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  type: {
    type: String,
    enum: ['lesson', 'video', 'quiz', 'exercise', 'project'],
    default: 'lesson'
  },
  videoUrl: String,
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['link', 'pdf', 'code', 'download'] }
  }],
  codeExamples: [{
    title: String,
    language: String,
    code: String,
    explanation: String
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  tags: [String],
  isFree: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  completedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date, default: Date.now }
  }],
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
topicSchema.index({ course: 1, order: 1 });
topicSchema.index({ slug: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Topic', topicSchema);
