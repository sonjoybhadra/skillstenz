const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: String,
  shortDescription: String,
  icon: { type: String, default: '💻' },
  image: String,
  color: { type: String, default: '#3B82F6' },
  category: {
    type: String,
    enum: ['programming', 'ai-ml', 'web', 'mobile', 'database', 'devops', 'tools', 'other'],
    default: 'programming'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  accessType: {
    type: String,
    enum: ['free', 'paid', 'mixed'],
    default: 'free'
  },
  featured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  
  // Voting system
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      vote: { type: String, enum: ['up', 'down'] }
    }]
  },
  views: { type: Number, default: 0 },
  
  courseCount: { type: Number, default: 0 },
  topicsCount: { type: Number, default: 0 },
  tags: [String],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  }],
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['documentation', 'tutorial', 'video', 'article', 'book'] }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search
technologySchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for vote score
technologySchema.virtual('voteScore').get(function() {
  return this.votes.upvotes - this.votes.downvotes;
});

// Method to vote
technologySchema.methods.vote = async function(userId, voteType) {
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

// Helper function to generate slug
function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Pre-save middleware
technologySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = generateSlug(this.name);
  }
  next();
});

module.exports = mongoose.model('Technology', technologySchema);
