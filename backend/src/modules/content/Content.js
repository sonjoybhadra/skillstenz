const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  subtopicId: String,
  type: {
    type: String,
    enum: ['text', 'video', 'pdf', 'link'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: String,
  url: String,
  duration: Number, // for videos in minutes
  tags: [String],
  approved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware
contentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for search
contentSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Content', contentSchema);