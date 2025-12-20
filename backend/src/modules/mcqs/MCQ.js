const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['text', 'code', 'image'],
    default: 'text'
  },
  codeSnippet: {
    language: String,
    code: String
  },
  imageUrl: String,
  options: [{
    text: String,
    isCorrect: Boolean,
    explanation: String
  }],
  correctAnswer: {
    type: Number, // Index of correct option
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  hints: [String],
  
  // Categorization
  category: {
    type: String,
    enum: ['course', 'skill', 'interview', 'certification'],
    required: true
  },
  
  // Related entities
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  technology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  },
  skill: {
    type: String,
    trim: true
  },
  
  // Difficulty
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  
  // Interview specific
  interviewLevel: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior', 'lead', 'architect'],
  },
  company: String, // e.g., "Google", "Microsoft"
  interviewRound: {
    type: String,
    enum: ['screening', 'technical', 'coding', 'system-design', 'behavioral']
  },
  
  // Code level (for code-based questions)
  codeLevel: {
    type: String,
    enum: ['syntax', 'logic', 'algorithm', 'optimization', 'design-pattern', 'architecture']
  },
  
  // Stats
  timesAttempted: {
    type: Number,
    default: 0
  },
  timesCorrect: {
    type: Number,
    default: 0
  },
  averageTime: {
    type: Number, // in seconds
    default: 0
  },
  
  // Points & Time
  points: {
    type: Number,
    default: 10
  },
  timeLimit: {
    type: Number, // in seconds
    default: 60
  },
  
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
mcqSchema.index({ category: 1, difficulty: 1 });
mcqSchema.index({ course: 1, topic: 1 });
mcqSchema.index({ skill: 1, difficulty: 1 });
mcqSchema.index({ interviewLevel: 1, codeLevel: 1 });

// Virtual for success rate
mcqSchema.virtual('successRate').get(function() {
  if (this.timesAttempted === 0) return 0;
  return Math.round((this.timesCorrect / this.timesAttempted) * 100);
});

module.exports = mongoose.model('MCQ', mcqSchema);
