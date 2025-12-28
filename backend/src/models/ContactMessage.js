const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  category: { type: String, enum: ['general', 'support', 'feedback', 'partnership', 'other'], default: 'general' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'resolved', 'spam'], default: 'new' },
  repliedAt: { type: Date },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replyMessage: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
