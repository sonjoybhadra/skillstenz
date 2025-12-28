const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Appearance
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  language: { type: String, default: 'en' },
  
  // Notifications
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  courseUpdates: { type: Boolean, default: true },
  promotionalEmails: { type: Boolean, default: false },
  weeklyDigest: { type: Boolean, default: true },
  commentReplies: { type: Boolean, default: true },
  mentionNotifications: { type: Boolean, default: true },
  
  // Privacy
  profileVisibility: { type: String, enum: ['public', 'private', 'connections'], default: 'public' },
  showEmail: { type: Boolean, default: false },
  showLocation: { type: Boolean, default: true },
  showActivity: { type: Boolean, default: true },
  allowMessages: { type: Boolean, default: true },
  
  // Learning Preferences
  autoplayVideos: { type: Boolean, default: true },
  videoQuality: { type: String, enum: ['auto', '360p', '480p', '720p', '1080p'], default: 'auto' },
  showSubtitles: { type: Boolean, default: false },
  playbackSpeed: { type: Number, default: 1 },
  
  // Two-Factor Auth
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorMethod: { type: String, enum: ['email', 'authenticator', 'sms'], default: 'email' },
  
}, { timestamps: true });

module.exports = mongoose.model('UserSettings', userSettingsSchema);
