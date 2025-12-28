const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  technologyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: true
  },
  categoryId: String, // Reference to category within technology
  name: {
    type: String,
    required: true
  },
  description: String,
  subtopics: [{
    name: String,
    description: String,
    content: [{
      type: {
        type: String,
        enum: ['text', 'video', 'pdf', 'link'],
        required: true
      },
      title: String,
      content: String,
      url: String,
      duration: Number,
      tags: [String],
      approved: {
        type: Boolean,
        default: false
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      approvedAt: Date
    }]
  }],
  accessType: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
topicSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('LegacyTopic', topicSchema);