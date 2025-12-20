const mongoose = require('mongoose');

const cheatsheetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
    required: true
  },
  technology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: true
  },
  category: {
    type: String,
    enum: ['commands', 'syntax', 'shortcuts', 'reference', 'quick-guide', 'other'],
    default: 'reference'
  },
  content: {
    type: String,
    required: true
  },
  sections: [{
    title: String,
    items: [{
      command: String,
      description: String,
      example: String
    }]
  }],
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  icon: {
    type: String,
    default: '📋'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  thumbnail: String,
  downloadUrl: String,
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      voteType: { type: String, enum: ['up', 'down'] }
    }]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate slug from title
cheatsheetSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Vote method
cheatsheetSchema.methods.vote = async function(userId, voteType) {
  const existingVote = this.votes.voters.find(
    v => v.user.toString() === userId.toString()
  );

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      // Remove vote
      this.votes.voters = this.votes.voters.filter(
        v => v.user.toString() !== userId.toString()
      );
      if (voteType === 'up') this.votes.upvotes--;
      else this.votes.downvotes--;
    } else {
      // Change vote
      existingVote.voteType = voteType;
      if (voteType === 'up') {
        this.votes.upvotes++;
        this.votes.downvotes--;
      } else {
        this.votes.upvotes--;
        this.votes.downvotes++;
      }
    }
  } else {
    // New vote
    this.votes.voters.push({ user: userId, voteType });
    if (voteType === 'up') this.votes.upvotes++;
    else this.votes.downvotes++;
  }

  await this.save();
  return this;
};

// Index for search
cheatsheetSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Cheatsheet', cheatsheetSchema);
