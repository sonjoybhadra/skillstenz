const mongoose = require('mongoose');

const technologyCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📂'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  image: String,
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  technologiesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
technologyCategorySchema.index({ order: 1 });
technologyCategorySchema.index({ slug: 1 });
technologyCategorySchema.index({ isPublished: 1 });

module.exports = mongoose.model('TechnologyCategory', technologyCategorySchema);
