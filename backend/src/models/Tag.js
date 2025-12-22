const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    maxlength: [30, 'Name cannot exceed 30 characters']
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
    maxlength: [150, 'Description cannot exceed 150 characters']
  },
  color: {
    type: String,
    default: '#6b7280'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for article count
tagSchema.virtual('articleCount', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'tags',
  count: true
});

// Index
tagSchema.index({ slug: 1 });

module.exports = mongoose.model('Tag', tagSchema);
