const mongoose = require('mongoose');

const aiLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: true
  },
  response: String,
  aiMode: {
    type: String,
    enum: ['basic', 'advanced'],
    required: true
  },
  tokensUsed: Number,
  processingTime: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AILog', aiLogSchema);