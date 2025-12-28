const ApiSettings = require('./ApiSettings');

// Get API Settings (masked for display)
exports.getApiSettings = async (req, res) => {
  try {
    const settings = await ApiSettings.getSettings();
    res.json(settings.toSafeJSON());
  } catch (error) {
    console.error('Get API settings error:', error);
    res.status(500).json({ message: 'Failed to get API settings', error: error.message });
  }
};

// Update OpenAI Settings
exports.updateOpenAISettings = async (req, res) => {
  try {
    const { apiKey, model, maxTokens, temperature, enabled } = req.body;
    
    let settings = await ApiSettings.findOne();
    if (!settings) {
      settings = new ApiSettings();
    }
    
    // Only update apiKey if it's not masked (doesn't start with •)
    if (apiKey !== undefined && !apiKey.startsWith('•')) {
      settings.openai.apiKey = apiKey;
    }
    if (model !== undefined) settings.openai.model = model;
    if (maxTokens !== undefined) settings.openai.maxTokens = maxTokens;
    if (temperature !== undefined) settings.openai.temperature = temperature;
    if (enabled !== undefined) settings.openai.enabled = enabled;
    
    await settings.save();
    
    // Update environment variable for immediate use
    if (apiKey && !apiKey.startsWith('•')) {
      process.env.OPENAI_API_KEY = apiKey;
    }
    
    res.json({
      message: 'OpenAI settings updated successfully',
      openai: settings.toSafeJSON().openai
    });
  } catch (error) {
    console.error('Update OpenAI settings error:', error);
    res.status(500).json({ message: 'Failed to update OpenAI settings', error: error.message });
  }
};

// Update Razorpay Settings
exports.updateRazorpaySettings = async (req, res) => {
  try {
    const { keyId, keySecret, webhookSecret, enabled, testMode } = req.body;
    
    let settings = await ApiSettings.findOne();
    if (!settings) {
      settings = new ApiSettings();
    }
    
    // Only update secrets if they're not masked
    if (keyId !== undefined) settings.razorpay.keyId = keyId;
    if (keySecret !== undefined && !keySecret.startsWith('•')) {
      settings.razorpay.keySecret = keySecret;
    }
    if (webhookSecret !== undefined && !webhookSecret.startsWith('•')) {
      settings.razorpay.webhookSecret = webhookSecret;
    }
    if (enabled !== undefined) settings.razorpay.enabled = enabled;
    if (testMode !== undefined) settings.razorpay.testMode = testMode;
    
    await settings.save();
    
    // Update environment variables for immediate use
    if (keyId) process.env.RAZORPAY_KEY_ID = keyId;
    if (keySecret && !keySecret.startsWith('•')) {
      process.env.RAZORPAY_KEY_SECRET = keySecret;
    }
    
    res.json({
      message: 'Razorpay settings updated successfully',
      razorpay: settings.toSafeJSON().razorpay
    });
  } catch (error) {
    console.error('Update Razorpay settings error:', error);
    res.status(500).json({ message: 'Failed to update Razorpay settings', error: error.message });
  }
};

// Update Stripe Settings
exports.updateStripeSettings = async (req, res) => {
  try {
    const { publishableKey, secretKey, webhookSecret, enabled, testMode } = req.body;
    
    let settings = await ApiSettings.findOne();
    if (!settings) {
      settings = new ApiSettings();
    }
    
    if (publishableKey !== undefined) settings.stripe.publishableKey = publishableKey;
    if (secretKey !== undefined && !secretKey.startsWith('•')) {
      settings.stripe.secretKey = secretKey;
    }
    if (webhookSecret !== undefined && !webhookSecret.startsWith('•')) {
      settings.stripe.webhookSecret = webhookSecret;
    }
    if (enabled !== undefined) settings.stripe.enabled = enabled;
    if (testMode !== undefined) settings.stripe.testMode = testMode;
    
    await settings.save();
    
    res.json({
      message: 'Stripe settings updated successfully',
      stripe: settings.toSafeJSON().stripe
    });
  } catch (error) {
    console.error('Update Stripe settings error:', error);
    res.status(500).json({ message: 'Failed to update Stripe settings', error: error.message });
  }
};

// Update Email Settings
exports.updateEmailSettings = async (req, res) => {
  try {
    const { 
      provider, smtpHost, smtpPort, smtpUser, smtpPassword, smtpSecure,
      sendgridApiKey, fromEmail, fromName, enabled 
    } = req.body;
    
    let settings = await ApiSettings.findOne();
    if (!settings) {
      settings = new ApiSettings();
    }
    
    if (provider !== undefined) settings.email.provider = provider;
    if (smtpHost !== undefined) settings.email.smtpHost = smtpHost;
    if (smtpPort !== undefined) settings.email.smtpPort = smtpPort;
    if (smtpUser !== undefined) settings.email.smtpUser = smtpUser;
    if (smtpPassword !== undefined && !smtpPassword.startsWith('•')) {
      settings.email.smtpPassword = smtpPassword;
    }
    if (smtpSecure !== undefined) settings.email.smtpSecure = smtpSecure;
    if (sendgridApiKey !== undefined && !sendgridApiKey.startsWith('•')) {
      settings.email.sendgridApiKey = sendgridApiKey;
    }
    if (fromEmail !== undefined) settings.email.fromEmail = fromEmail;
    if (fromName !== undefined) settings.email.fromName = fromName;
    if (enabled !== undefined) settings.email.enabled = enabled;
    
    await settings.save();
    
    res.json({
      message: 'Email settings updated successfully',
      email: settings.toSafeJSON().email
    });
  } catch (error) {
    console.error('Update Email settings error:', error);
    res.status(500).json({ message: 'Failed to update Email settings', error: error.message });
  }
};

// Update Google OAuth Settings
exports.updateGoogleOAuthSettings = async (req, res) => {
  try {
    const { clientId, clientSecret, enabled } = req.body;
    
    let settings = await ApiSettings.findOne();
    if (!settings) {
      settings = new ApiSettings();
    }
    
    if (clientId !== undefined) settings.googleOAuth.clientId = clientId;
    if (clientSecret !== undefined && !clientSecret.startsWith('•')) {
      settings.googleOAuth.clientSecret = clientSecret;
    }
    if (enabled !== undefined) settings.googleOAuth.enabled = enabled;
    
    await settings.save();
    
    res.json({
      message: 'Google OAuth settings updated successfully',
      googleOAuth: settings.toSafeJSON().googleOAuth
    });
  } catch (error) {
    console.error('Update Google OAuth settings error:', error);
    res.status(500).json({ message: 'Failed to update Google OAuth settings', error: error.message });
  }
};

// Update GitHub OAuth Settings
exports.updateGitHubOAuthSettings = async (req, res) => {
  try {
    const { clientId, clientSecret, enabled } = req.body;
    
    let settings = await ApiSettings.findOne();
    if (!settings) {
      settings = new ApiSettings();
    }
    
    if (clientId !== undefined) settings.githubOAuth.clientId = clientId;
    if (clientSecret !== undefined && !clientSecret.startsWith('•')) {
      settings.githubOAuth.clientSecret = clientSecret;
    }
    if (enabled !== undefined) settings.githubOAuth.enabled = enabled;
    
    await settings.save();
    
    res.json({
      message: 'GitHub OAuth settings updated successfully',
      githubOAuth: settings.toSafeJSON().githubOAuth
    });
  } catch (error) {
    console.error('Update GitHub OAuth settings error:', error);
    res.status(500).json({ message: 'Failed to update GitHub OAuth settings', error: error.message });
  }
};

// Update all API settings at once
exports.updateAllApiSettings = async (req, res) => {
  try {
    const { openai, razorpay, stripe, email, googleOAuth, githubOAuth } = req.body;
    
    let settings = await ApiSettings.findOne();
    if (!settings) {
      settings = new ApiSettings();
    }
    
    // Helper to update nested settings
    const updateNested = (target, source, secretFields = []) => {
      if (!source) return;
      for (const [key, value] of Object.entries(source)) {
        if (value !== undefined) {
          // Skip masked values for secret fields
          if (secretFields.includes(key) && typeof value === 'string' && value.startsWith('•')) {
            continue;
          }
          target[key] = value;
        }
      }
    };
    
    updateNested(settings.openai, openai, ['apiKey']);
    updateNested(settings.razorpay, razorpay, ['keySecret', 'webhookSecret']);
    updateNested(settings.stripe, stripe, ['secretKey', 'webhookSecret']);
    updateNested(settings.email, email, ['smtpPassword', 'sendgridApiKey']);
    updateNested(settings.googleOAuth, googleOAuth, ['clientSecret']);
    updateNested(settings.githubOAuth, githubOAuth, ['clientSecret']);
    
    await settings.save();
    
    // Update environment variables
    if (openai?.apiKey && !openai.apiKey.startsWith('•')) {
      process.env.OPENAI_API_KEY = openai.apiKey;
    }
    if (razorpay?.keyId) process.env.RAZORPAY_KEY_ID = razorpay.keyId;
    if (razorpay?.keySecret && !razorpay.keySecret.startsWith('•')) {
      process.env.RAZORPAY_KEY_SECRET = razorpay.keySecret;
    }
    
    res.json({
      message: 'API settings updated successfully',
      settings: settings.toSafeJSON()
    });
  } catch (error) {
    console.error('Update API settings error:', error);
    res.status(500).json({ message: 'Failed to update API settings', error: error.message });
  }
};

// Test OpenAI connection
exports.testOpenAIConnection = async (req, res) => {
  try {
    const settings = await ApiSettings.getSettings();
    
    if (!settings.openai.apiKey) {
      return res.status(400).json({ success: false, message: 'OpenAI API key not configured' });
    }
    
    // Dynamic import for OpenAI
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: settings.openai.apiKey });
    
    const response = await openai.chat.completions.create({
      model: settings.openai.model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "Connection successful!" in exactly those words.' }],
      max_tokens: 20
    });
    
    res.json({ 
      success: true, 
      message: 'OpenAI connection successful',
      response: response.choices[0]?.message?.content 
    });
  } catch (error) {
    console.error('Test OpenAI connection error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to connect to OpenAI' 
    });
  }
};

// Test Razorpay connection
exports.testRazorpayConnection = async (req, res) => {
  try {
    const settings = await ApiSettings.getSettings();
    
    if (!settings.razorpay.keyId || !settings.razorpay.keySecret) {
      return res.status(400).json({ success: false, message: 'Razorpay credentials not configured' });
    }
    
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: settings.razorpay.keyId,
      key_secret: settings.razorpay.keySecret
    });
    
    // Try to fetch orders (will fail with invalid credentials)
    await razorpay.orders.all({ count: 1 });
    
    res.json({ success: true, message: 'Razorpay connection successful' });
  } catch (error) {
    console.error('Test Razorpay connection error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.error?.description || error.message || 'Failed to connect to Razorpay' 
    });
  }
};
