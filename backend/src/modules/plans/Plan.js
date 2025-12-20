const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
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
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  duration: {
    type: Number,
    required: true,
    default: 1 // in months
  },
  durationType: {
    type: String,
    enum: ['day', 'month', 'year', 'lifetime'],
    default: 'month'
  },
  features: [{
    title: String,
    included: {
      type: Boolean,
      default: true
    }
  }],
  aiQueryLimit: {
    type: Number,
    default: 10 // 0 = unlimited
  },
  benefits: {
    accessAllCourses: { type: Boolean, default: false },
    accessAllTechnologies: { type: Boolean, default: false },
    premiumTemplates: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    certificateAccess: { type: Boolean, default: false },
    resumeBuilder: { type: Boolean, default: false },
    careerTools: { type: Boolean, default: false }
  },
  order: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  razorpayPlanId: {
    type: String,
    default: null
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
planSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Plan', planSchema);
