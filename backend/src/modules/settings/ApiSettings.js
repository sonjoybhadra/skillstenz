const mongoose = require('mongoose');

const apiSettingsSchema = new mongoose.Schema({
  // OpenAI Settings
  openai: {
    apiKey: {
      type: String,
      default: ''
    },
    model: {
      type: String,
      enum: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini'],
      default: 'gpt-4o-mini'
    },
    maxTokens: {
      type: Number,
      default: 2000
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2
    },
    enabled: {
      type: Boolean,
      default: false
    }
  },
  // Razorpay Payment Settings
  razorpay: {
    keyId: {
      type: String,
      default: ''
    },
    keySecret: {
      type: String,
      default: ''
    },
    webhookSecret: {
      type: String,
      default: ''
    },
    enabled: {
      type: Boolean,
      default: false
    },
    testMode: {
      type: Boolean,
      default: true
    }
  },
  // Stripe Payment Settings (future)
  stripe: {
    publishableKey: {
      type: String,
      default: ''
    },
    secretKey: {
      type: String,
      default: ''
    },
    webhookSecret: {
      type: String,
      default: ''
    },
    enabled: {
      type: Boolean,
      default: false
    },
    testMode: {
      type: Boolean,
      default: true
    }
  },
  // Email Service Settings
  email: {
    provider: {
      type: String,
      enum: ['smtp', 'sendgrid', 'mailgun', 'ses'],
      default: 'smtp'
    },
    smtpHost: {
      type: String,
      default: ''
    },
    smtpPort: {
      type: Number,
      default: 587
    },
    smtpUser: {
      type: String,
      default: ''
    },
    smtpPassword: {
      type: String,
      default: ''
    },
    smtpSecure: {
      type: Boolean,
      default: false
    },
    sendgridApiKey: {
      type: String,
      default: ''
    },
    fromEmail: {
      type: String,
      default: ''
    },
    fromName: {
      type: String,
      default: 'TechTooTalk'
    },
    enabled: {
      type: Boolean,
      default: false
    }
  },
  // Google OAuth Settings
  googleOAuth: {
    clientId: {
      type: String,
      default: ''
    },
    clientSecret: {
      type: String,
      default: ''
    },
    enabled: {
      type: Boolean,
      default: false
    }
  },
  // GitHub OAuth Settings
  githubOAuth: {
    clientId: {
      type: String,
      default: ''
    },
    clientSecret: {
      type: String,
      default: ''
    },
    enabled: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Static method to get settings (creates default if not exists)
apiSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Helper to mask sensitive data for display
apiSettingsSchema.methods.toSafeJSON = function() {
  const obj = this.toObject();
  
  // Mask API keys (show last 4 characters only)
  const maskKey = (key) => {
    if (!key || key.length < 8) return key ? '••••••••' : '';
    return '••••••••' + key.slice(-4);
  };
  
  // Mask OpenAI
  if (obj.openai?.apiKey) {
    obj.openai.apiKey = maskKey(obj.openai.apiKey);
  }
  
  // Mask Razorpay
  if (obj.razorpay?.keySecret) {
    obj.razorpay.keySecret = maskKey(obj.razorpay.keySecret);
  }
  
  // Mask Stripe
  if (obj.stripe?.secretKey) {
    obj.stripe.secretKey = maskKey(obj.stripe.secretKey);
  }
  if (obj.stripe?.webhookSecret) {
    obj.stripe.webhookSecret = maskKey(obj.stripe.webhookSecret);
  }
  
  // Mask Email
  if (obj.email?.smtpPassword) {
    obj.email.smtpPassword = maskKey(obj.email.smtpPassword);
  }
  if (obj.email?.sendgridApiKey) {
    obj.email.sendgridApiKey = maskKey(obj.email.sendgridApiKey);
  }
  
  // Mask OAuth secrets
  if (obj.googleOAuth?.clientSecret) {
    obj.googleOAuth.clientSecret = maskKey(obj.googleOAuth.clientSecret);
  }
  if (obj.githubOAuth?.clientSecret) {
    obj.githubOAuth.clientSecret = maskKey(obj.githubOAuth.clientSecret);
  }
  
  return obj;
};

module.exports = mongoose.model('ApiSettings', apiSettingsSchema);
