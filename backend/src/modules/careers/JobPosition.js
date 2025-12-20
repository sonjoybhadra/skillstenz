const mongoose = require('mongoose');

const jobPositionSchema = new mongoose.Schema({
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
  department: {
    type: String,
    required: true,
    enum: ['Engineering', 'Design', 'Content', 'Education', 'Marketing', 'Operations', 'Sales', 'HR']
  },
  location: {
    type: String,
    required: true,
    default: 'Remote'
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  experience: {
    type: String,
    default: '2+ years'
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
    display: { type: Boolean, default: false }
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  niceToHave: [{
    type: String
  }],
  benefits: [{
    icon: String,
    title: String,
    description: String
  }],
  skills: [{
    type: String
  }],
  applicationUrl: {
    type: String
  },
  applicationEmail: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

jobPositionSchema.index({ isActive: 1, department: 1 });
jobPositionSchema.index({ slug: 1 });

// Pre-save to generate slug
jobPositionSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('JobPosition', jobPositionSchema);
