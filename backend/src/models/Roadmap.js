const mongoose = require('mongoose');

const roadmapStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topics: [{ type: String }],
  duration: { type: String },
  order: { type: Number, default: 0 }
});

const roadmapSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: '📚' },
  category: { type: String, enum: ['frontend', 'backend', 'mobile', 'devops', 'data', 'other'], default: 'other' },
  duration: { type: String },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  steps: [roadmapStepSchema],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
