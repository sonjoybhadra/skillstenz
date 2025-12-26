const mongoose = require('mongoose');

// Item schema for section items (cheatsheets, roadmaps, tools, updates, etc.)
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String, // Alternative to name for updates
  icon: { type: String, default: '📘' },
  href: String,
  description: String,
  image: String,
  isNew: { type: Boolean, default: false },
  tags: [String], // For career sections
  order: { type: Number, default: 0 }
}, { _id: true });

// CTA Button schema
const ctaButtonSchema = new mongoose.Schema({
  text: { type: String, required: true },
  href: { type: String, required: true },
  variant: { type: String, enum: ['primary', 'secondary', 'outline'], default: 'primary' }
});

// Stat schema for hero stats
const statSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true }
});

// CTA Card schema for promotional cards
const ctaCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  icon: String,
  buttonText: String,
  buttonHref: String,
  gradient: { type: String, default: 'from-blue-600 to-blue-700' },
  order: { type: Number, default: 0 }
}, { _id: true });

// Career Category schema
const careerCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  colorClass: { type: String, default: 'blue' }, // blue, red, green, purple
  tags: [String],
  order: { type: Number, default: 0 }
}, { _id: true });

// Compiler language schema
const compilerLanguageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: String,
  href: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }, // Primary languages shown larger
  order: { type: Number, default: 0 }
}, { _id: true });

// Home Section Schema
const homeSectionSchema = new mongoose.Schema({
  sectionKey: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'hero',
      'cta_cards',
      'latest_updates',
      'technologies', // Already dynamic via technologiesAPI
      'cheatsheets',
      'roadmaps',
      'career_categories',
      'compiler',
      'tools'
    ]
  },
  title: { type: String, required: true },
  subtitle: String,
  highlightText: String, // Text to highlight in title
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  
  // Hero section specific
  heroData: {
    badge: String,
    mainTitle: String,
    highlightTitle: String,
    description: String,
    stats: [statSchema],
    ctaButtons: [ctaButtonSchema],
    backgroundImage: String
  },
  
  // CTA Cards section
  ctaCards: [ctaCardSchema],
  
  // Latest Updates section
  latestUpdates: {
    monthYear: String, // "December, 2025"
    items: [itemSchema]
  },
  
  // Grid sections (cheatsheets, roadmaps, tools)
  items: [itemSchema],
  
  // Career categories section
  careerCategories: [careerCategorySchema],
  
  // Compiler section
  compilerData: {
    title: String,
    subtitle: String,
    languages: [compilerLanguageSchema],
    ctaButton: ctaButtonSchema
  },
  
  // Common section settings
  seeAllLink: String,
  seeAllText: { type: String, default: 'See all' },
  backgroundColor: { type: String, enum: ['white', 'gray', 'dark'], default: 'white' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
homeSectionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
homeSectionSchema.index({ sectionKey: 1 });
homeSectionSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('HomeSection', homeSectionSchema);
