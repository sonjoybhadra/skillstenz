const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  // Certificate unique identifier
  certificateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // User who earned the certificate
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Certificate type
  certificateType: {
    type: String,
    enum: ['course', 'test', 'skill', 'technology', 'achievement'],
    required: true
  },

  // Related course/test/skill
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  technology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  },
  testId: {
    type: String // MCQ test ID
  },

  // Certificate details
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },

  // Score and performance
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass', 'Excellent', 'Outstanding']
  },
  totalQuestions: Number,
  correctAnswers: Number,

  // Issue and expiry dates
  issueDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  expiryDate: {
    type: Date // Some certificates may expire
  },

  // Certificate metadata
  issuedBy: {
    name: {
      type: String,
      default: 'SkillStenz'
    },
    logo: String,
    signature: String
  },

  // Verification
  verificationUrl: String,
  isVerified: {
    type: Boolean,
    default: true
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active'
  },

  // Admin management
  issuedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String, // Admin notes

  // Tags for filtering
  tags: [String],

  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },

  // Social sharing
  shareCount: {
    type: Number,
    default: 0
  },
  linkedInShared: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
certificateSchema.index({ user: 1, createdAt: -1 });
certificateSchema.index({ certificateType: 1, status: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ technology: 1 });

// Virtual for verification URL
certificateSchema.virtual('fullVerificationUrl').get(function() {
  return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-certificate/${this.certificateId}`;
});

// Method to check if certificate is valid
certificateSchema.methods.isValid = function() {
  if (this.status !== 'active') return false;
  if (this.expiryDate && this.expiryDate < new Date()) return false;
  return true;
};

// Method to generate certificate ID
certificateSchema.statics.generateCertificateId = function() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${randomStr}`.toUpperCase();
};

// Method to calculate grade
certificateSchema.statics.calculateGrade = function(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  return 'Pass';
};

// Pre-save hook
certificateSchema.pre('save', async function(next) {
  // Auto-generate certificate ID if not exists
  if (!this.certificateId) {
    this.certificateId = this.constructor.generateCertificateId();
  }

  // Auto-calculate grade if score exists
  if (this.score && !this.grade) {
    this.grade = this.constructor.calculateGrade(this.score);
  }

  // Set verification URL
  this.verificationUrl = this.fullVerificationUrl;

  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
