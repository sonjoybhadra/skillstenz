const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Article excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Article content is required']
  },
  featuredImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number, // in minutes
    default: 0
  },
  // SEO Fields
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  metaKeywords: [{
    type: String
  }],
  ogImage: {
    type: String
  },
  canonicalUrl: {
    type: String
  },
  // Schema.org JSON-LD
  schemaType: {
    type: String,
    default: 'Article',
    enum: ['Article', 'BlogPosting', 'NewsArticle', 'TechArticle']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comments
articleSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  justOne: false
});

// Virtual for comment count
articleSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  count: true
});

// Index for faster queries
articleSchema.index({ slug: 1 });
articleSchema.index({ category: 1, isPublished: 1 });
articleSchema.index({ tags: 1, isPublished: 1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ views: -1 });
articleSchema.index({ publishedAt: -1 });

// Calculate read time before saving
articleSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  // Auto-generate meta fields if not provided
  if (!this.metaTitle) {
    this.metaTitle = this.title.slice(0, 60);
  }
  if (!this.metaDescription) {
    this.metaDescription = this.excerpt.slice(0, 160);
  }
  
  // Set published date
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Article', articleSchema);
