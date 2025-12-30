const mongoose = require('mongoose');

const aiToolSchema = new mongoose.Schema({
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
  logo: {
    type: String,
    default: '' // URL to logo image
  },
  icon: {
    type: String,
    default: '🤖' // Emoji fallback
  },
  tagline: {
    type: String,
    default: ''
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  overview: {
    type: String, // Rich text/HTML for detailed overview
    default: ''
  },
  // Parent Company Information
  parentCompany: {
    name: { type: String, default: '' },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    founded: { type: String, default: '' },
    headquarters: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  // How to Use Section
  howToUse: {
    type: String, // Rich text/HTML with steps
    default: ''
  },
  // Getting Started Steps
  gettingStarted: [{
    step: { type: Number },
    title: { type: String },
    description: { type: String }
  }],
  // Purpose and Use Cases
  purpose: {
    type: String, // Main purpose description
    default: ''
  },
  useCases: [{
    title: { type: String },
    description: { type: String },
    icon: { type: String, default: '✨' }
  }],
  // Features
  features: [{
    title: { type: String },
    description: { type: String },
    icon: { type: String, default: '⚡' }
  }],
  // Pricing Information
  pricing: {
    type: { 
      type: String, 
      enum: ['free', 'freemium', 'paid', 'enterprise', 'open-source'],
      default: 'freemium'
    },
    startingPrice: { type: String, default: '' },
    hasFreeTier: { type: Boolean, default: false },
    pricingUrl: { type: String, default: '' },
    plans: [{
      name: { type: String },
      price: { type: String },
      features: [{ type: String }]
    }]
  },
  // Categorization
  category: {
    type: String,
    enum: [
      'chatbots',
      'image-generation',
      'video-generation',
      'audio-generation',
      'writing-assistant',
      'code-assistant',
      'data-analysis',
      'automation',
      'research',
      'design',
      'marketing',
      'productivity',
      'education',
      'healthcare',
      'finance',
      'other'
    ],
    default: 'other'
  },
  subcategory: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  // Technical Details
  apiAvailable: {
    type: Boolean,
    default: false
  },
  apiDocumentation: {
    type: String,
    default: ''
  },
  platforms: [{
    type: String,
    enum: ['web', 'ios', 'android', 'desktop', 'api', 'chrome-extension', 'vscode', 'slack', 'discord']
  }],
  integrations: [{
    name: { type: String },
    logo: { type: String },
    url: { type: String }
  }],
  // Links
  website: {
    type: String,
    default: ''
  },
  documentation: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  // Pros and Cons
  pros: [{
    type: String
  }],
  cons: [{
    type: String
  }],
  // Alternatives
  alternatives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AITool'
  }],
  // Related Technologies
  relatedTechnologies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  }],
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      vote: { type: String, enum: ['up', 'down'] }
    }]
  },
  // Status
  isPublished: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  isNewTool: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  // SEO
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: [{ type: String }],
    canonicalUrl: { type: String, default: '' }
  },
  // Timestamps
  launchDate: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
aiToolSchema.index({ name: 'text', shortDescription: 'text', overview: 'text', tags: 'text' });
aiToolSchema.index({ slug: 1 });
aiToolSchema.index({ category: 1 });
aiToolSchema.index({ isPublished: 1 });
aiToolSchema.index({ featured: 1 });
aiToolSchema.index({ trending: 1 });
aiToolSchema.index({ 'pricing.type': 1 });
aiToolSchema.index({ order: 1 });

// Virtual for vote score
aiToolSchema.virtual('voteScore').get(function() {
  return (this.votes?.upvotes || 0) - (this.votes?.downvotes || 0);
});

// Ensure virtuals are included in JSON
aiToolSchema.set('toJSON', { virtuals: true });
aiToolSchema.set('toObject', { virtuals: true });

// Pre-save hook to generate slug
aiToolSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('AITool', aiToolSchema);
