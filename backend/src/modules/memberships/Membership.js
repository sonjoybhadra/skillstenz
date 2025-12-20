const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planType: {
    type: String,
    enum: ['free', 'silver', 'gold'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  features: [{
    type: String,
    enum: [
      'basic_technologies',
      'advanced_technologies',
      'limited_ai',
      'unlimited_ai',
      'premium_templates',
      'priority_support'
    ]
  }],
  aiUsageLimit: {
    type: Number,
    default: 0 // 0 means unlimited for paid plans
  },
  aiUsageCount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  paymentMethodId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// TTL index for auto-expiry
membershipSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware
membershipSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get plan features
membershipSchema.statics.getPlanFeatures = function(planType) {
  const plans = {
    free: ['basic_technologies', 'limited_ai'],
    silver: ['basic_technologies', 'advanced_technologies', 'limited_ai', 'premium_templates'],
    gold: ['basic_technologies', 'advanced_technologies', 'unlimited_ai', 'premium_templates', 'priority_support']
  };
  return plans[planType] || [];
};

// Static method to get AI limits
membershipSchema.statics.getAILimit = function(planType) {
  const limits = {
    free: 10,
    silver: 100,
    gold: 0 // unlimited
  };
  return limits[planType] || 0;
};

module.exports = mongoose.model('Membership', membershipSchema);