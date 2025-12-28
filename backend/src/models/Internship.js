const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  companyLogo: { type: String },
  location: { type: String },
  type: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'remote' },
  duration: { type: String },
  stipend: { type: String },
  description: { type: String },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  skillsRequired: [{ type: String }],
  applyLink: { type: String },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  applicationsCount: { type: Number, default: 0 },
}, { timestamps: true });

internshipSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = `${this.company}-${this.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Internship', internshipSchema);
