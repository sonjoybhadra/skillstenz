const mongoose = require('mongoose');

const seoSettingsSchema = new mongoose.Schema({
  // General SEO
  siteTitle: {
    type: String,
    default: 'TechTooTalk - Master AI & Modern Technologies'
  },
  siteDescription: {
    type: String,
    default: 'Learn AI, AI Agents, LangChain, Machine Learning, and modern programming. Free tutorials and courses for developers.'
  },
  siteKeywords: {
    type: String,
    default: 'AI, AI Agents, LangChain, Machine Learning, Python, React, Node.js, tutorials, courses'
  },
  structuredData: {
    type: Boolean,
    default: true
  },

  // Social/Open Graph
  ogImage: {
    type: String,
    default: '/og-image.jpg'
  },
  twitterHandle: {
    type: String,
    default: '@techtootalk'
  },

  // Verification Codes
  googleVerification: {
    type: String,
    default: ''
  },
  bingVerification: {
    type: String,
    default: ''
  },

  // Analytics
  googleAnalyticsId: {
    type: String,
    default: ''
  },

  // robots.txt content
  robotsTxt: {
    type: String,
    default: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Sitemap: https://techtootalk.com/sitemap.xml`
  },

  // AdSense Settings
  adsensePublisherId: {
    type: String,
    default: ''
  },
  adsEnabled: {
    type: Boolean,
    default: false
  },
  autoAds: {
    type: Boolean,
    default: false
  },
  adUnits: [{
    name: String,
    type: {
      type: String,
      enum: ['display', 'infeed', 'inArticle', 'multiplex'],
      default: 'display'
    },
    placement: {
      type: String,
      enum: ['header', 'sidebar', 'content', 'footer'],
      default: 'header'
    },
    code: String,
    enabled: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
});

// Ensure only one settings document exists
seoSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SeoSettings', seoSettingsSchema);
