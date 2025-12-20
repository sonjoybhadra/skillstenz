const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  grade: String,
  description: String
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String,
  technologies: [String]
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalDetails: {
    firstName: String,
    lastName: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String,
    summary: String
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [String],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    url: String
  }],
  versions: [{
    version: Number,
    data: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to create version
profileSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    const version = this.versions.length + 1;
    this.versions.push({
      version,
      data: this.toObject(),
      createdAt: new Date()
    });
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);