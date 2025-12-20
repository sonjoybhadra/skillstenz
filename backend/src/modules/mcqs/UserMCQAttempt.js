const mongoose = require('mongoose');

const userMCQAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mcq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCQ',
    required: true
  },
  selectedOption: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  attemptNumber: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes
userMCQAttemptSchema.index({ user: 1, mcq: 1 });
userMCQAttemptSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('UserMCQAttempt', userMCQAttemptSchema);
