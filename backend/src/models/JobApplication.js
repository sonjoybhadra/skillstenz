const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  resume: { type: String }, // File path or URL
  coverLetter: { type: String },
  linkedinUrl: { type: String },
  portfolioUrl: { type: String },
  experience: { type: String },
  currentCompany: { type: String },
  currentSalary: { type: String },
  expectedSalary: { type: String },
  noticePeriod: { type: String },
  answers: [{ 
    question: String, 
    answer: String 
  }],
  status: { 
    type: String, 
    enum: ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'], 
    default: 'applied' 
  },
  notes: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
