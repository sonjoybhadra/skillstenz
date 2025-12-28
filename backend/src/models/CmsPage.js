const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  type: { type: String, enum: ['text', 'list', 'html', 'image', 'video'], default: 'text' },
  items: [{ type: String }], // For list type
  order: { type: Number, default: 0 }
});

const cmsPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  heroImage: { type: String },
  sections: [sectionSchema],
  content: { type: String }, // For simple pages
  isActive: { type: Boolean, default: true },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CmsPage', cmsPageSchema);
