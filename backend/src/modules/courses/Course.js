const mongoose = require('mongoose');

// Lesson Schema - individual lessons in a course section
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: String,
  description: String,
  contentType: {
    type: String,
    enum: ['video', 'article', 'quiz', 'assignment', 'code'],
    default: 'video'
  },
  // Video content
  videoUrl: String,
  videoDuration: Number, // in seconds
  videoProvider: {
    type: String,
    enum: ['youtube', 'vimeo', 'custom', 'local'],
    default: 'youtube'
  },
  // Article content
  content: String, // HTML/Markdown content
  // Quiz content
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    passingScore: { type: Number, default: 70 }
  },
  // Code content
  codeLanguage: String,
  codeSnippet: String,
  // Common fields
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['pdf', 'link', 'download', 'github'] }
  }],
  order: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true }
});

// Section Schema - groups of lessons
const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: { type: Number, default: 0 },
  lessons: [lessonSchema]
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: String,
  shortDescription: String,
  technology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: true
  },
  thumbnail: String,
  previewVideo: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  language: { type: String, default: 'English' },
  duration: String, // e.g., "10 hours"
  totalDurationSeconds: { type: Number, default: 0 },
  
  // Pricing
  price: { type: Number, default: 0 },
  originalPrice: Number,
  currency: { type: String, default: 'USD' },
  isFree: { type: Boolean, default: true },
  
  // Content
  sections: [sectionSchema],
  lessonsCount: { type: Number, default: 0 },
  sectionsCount: { type: Number, default: 0 },
  
  // Instructor
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // What you'll learn
  learningObjectives: [String],
  prerequisites: [String],
  targetAudience: [String],
  tags: [String],
  
  // Status
  featured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  
  // Voting system
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      vote: { type: String, enum: ['up', 'down'] }
    }]
  },
  
  // Stats
  views: { type: Number, default: 0 },
  enrollmentsCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ technology: 1 });
courseSchema.index({ slug: 1 });
courseSchema.index({ isPublished: 1, featured: 1 });

// Virtual for vote score
courseSchema.virtual('voteScore').get(function() {
  return this.votes.upvotes - this.votes.downvotes;
});

// Method to vote
courseSchema.methods.vote = async function(userId, voteType) {
  const existingVote = this.votes.voters.find(v => v.user.toString() === userId.toString());
  
  if (existingVote) {
    if (existingVote.vote === voteType) {
      this.votes.voters = this.votes.voters.filter(v => v.user.toString() !== userId.toString());
      if (voteType === 'up') this.votes.upvotes--;
      else this.votes.downvotes--;
    } else {
      existingVote.vote = voteType;
      if (voteType === 'up') {
        this.votes.upvotes++;
        this.votes.downvotes--;
      } else {
        this.votes.downvotes++;
        this.votes.upvotes--;
      }
    }
  } else {
    this.votes.voters.push({ user: userId, vote: voteType });
    if (voteType === 'up') this.votes.upvotes++;
    else this.votes.downvotes++;
  }
  
  return this.save();
};

// Method to rate
courseSchema.methods.rate = async function(userId, rating, review) {
  const existingRating = this.ratings.find(r => r.user.toString() === userId.toString());
  
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.review = review;
  } else {
    this.ratings.push({ user: userId, rating, review });
    this.ratingsCount++;
  }
  
  // Calculate average rating
  const totalRating = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  this.rating = totalRating / this.ratings.length;
  
  return this.save();
};

// Helper function to generate slug
function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Pre-save middleware
courseSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }
  
  // Calculate counts
  this.sectionsCount = this.sections ? this.sections.length : 0;
  this.lessonsCount = this.sections ? this.sections.reduce((total, section) => {
    return total + (section.lessons ? section.lessons.length : 0);
  }, 0) : 0;
  
  // Calculate total duration
  this.totalDurationSeconds = this.sections ? this.sections.reduce((total, section) => {
    return total + (section.lessons ? section.lessons.reduce((lessonTotal, lesson) => {
      return lessonTotal + (lesson.videoDuration || 0);
    }, 0) : 0);
  }, 0) : 0;
  
  next();
});

module.exports = mongoose.model('Course', courseSchema);
