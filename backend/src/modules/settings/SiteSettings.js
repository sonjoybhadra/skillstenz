const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'TechTooTalk Learn'
  },
  siteTagline: {
    type: String,
    default: 'AI-Powered Learning Platform'
  },
  // Logo Settings
  logo: {
    type: String,
    default: '' // URL to logo image
  },
  logoDark: {
    type: String,
    default: '' // URL to dark theme logo
  },
  logoIcon: {
    type: String,
    default: 'T' // Single character or URL for icon
  },
  logoText: {
    type: String,
    default: 'TechTooTalk'
  },
  logoAccentText: {
    type: String,
    default: 'Talk'
  },
  // Loader Settings
  loaderType: {
    type: String,
    enum: ['spinner', 'dots', 'pulse', 'bars', 'custom'],
    default: 'spinner'
  },
  loaderColor: {
    type: String,
    default: '#0968c6'
  },
  loaderImage: {
    type: String,
    default: '' // URL to custom loader image/gif
  },
  loaderText: {
    type: String,
    default: 'Loading...'
  },
  // Favicon
  favicon: {
    type: String,
    default: '/favicon.ico'
  },
  contactEmail: {
    type: String,
    default: 'contact@techtootalk.com'
  },
  supportEmail: {
    type: String,
    default: 'support@techtootalk.com'
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  registrationEnabled: {
    type: Boolean,
    default: true
  },
  emailVerificationRequired: {
    type: Boolean,
    default: false
  },
  defaultUserType: {
    type: String,
    enum: ['fresher', 'experienced'],
    default: 'fresher'
  },
  maxLoginAttempts: {
    type: Number,
    default: 5
  },
  sessionTimeout: {
    type: Number,
    default: 24 // hours
  },
  socialLinks: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    youtube: { type: String, default: '' },
    discord: { type: String, default: '' }
  }
}, {
  timestamps: true
});

// Static method to get settings (creates default if not exists)
siteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
