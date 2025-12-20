const mongoose = require('mongoose');

const resumeSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['personal', 'summary', 'experience', 'education', 'skills', 'certifications', 'projects', 'custom'],
    required: true
  },
  title: String,
  content: mongoose.Schema.Types.Mixed, // Flexible content
  order: {
    type: Number,
    default: 0
  },
  visible: {
    type: Boolean,
    default: true
  }
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  template: {
    type: String,
    enum: ['basic', 'modern', 'ats', 'creative'],
    default: 'basic'
  },
  sections: [resumeSectionSchema],
  publicId: {
    type: String,
    unique: true,
    sparse: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  autoFilled: {
    type: Boolean,
    default: false
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
resumeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to generate public ID
resumeSchema.methods.generatePublicId = function() {
  this.publicId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

module.exports = mongoose.model('Resume', resumeSchema);