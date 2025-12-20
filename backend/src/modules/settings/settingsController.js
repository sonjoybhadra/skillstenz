const SeoSettings = require('./SeoSettings');
const SiteSettings = require('./SiteSettings');

// Get SEO Settings
exports.getSeoSettings = async (req, res) => {
  try {
    const settings = await SeoSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get SEO settings error:', error);
    res.status(500).json({ message: 'Failed to get SEO settings', error: error.message });
  }
};

// Update SEO Settings
exports.updateSeoSettings = async (req, res) => {
  try {
    const {
      siteTitle,
      siteDescription,
      siteKeywords,
      structuredData,
      ogImage,
      twitterHandle,
      googleVerification,
      bingVerification,
      googleAnalyticsId,
      robotsTxt,
      adsensePublisherId,
      adsEnabled,
      autoAds,
      adUnits
    } = req.body;

    let settings = await SeoSettings.findOne();
    
    if (!settings) {
      settings = new SeoSettings();
    }

    // Update fields if provided
    if (siteTitle !== undefined) settings.siteTitle = siteTitle;
    if (siteDescription !== undefined) settings.siteDescription = siteDescription;
    if (siteKeywords !== undefined) settings.siteKeywords = siteKeywords;
    if (structuredData !== undefined) settings.structuredData = structuredData;
    if (ogImage !== undefined) settings.ogImage = ogImage;
    if (twitterHandle !== undefined) settings.twitterHandle = twitterHandle;
    if (googleVerification !== undefined) settings.googleVerification = googleVerification;
    if (bingVerification !== undefined) settings.bingVerification = bingVerification;
    if (googleAnalyticsId !== undefined) settings.googleAnalyticsId = googleAnalyticsId;
    if (robotsTxt !== undefined) settings.robotsTxt = robotsTxt;
    if (adsensePublisherId !== undefined) settings.adsensePublisherId = adsensePublisherId;
    if (adsEnabled !== undefined) settings.adsEnabled = adsEnabled;
    if (autoAds !== undefined) settings.autoAds = autoAds;
    if (adUnits !== undefined) settings.adUnits = adUnits;

    await settings.save();

    res.json({
      message: 'SEO settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update SEO settings error:', error);
    res.status(500).json({ message: 'Failed to update SEO settings', error: error.message });
  }
};

// Get AdSense Settings only
exports.getAdsenseSettings = async (req, res) => {
  try {
    const settings = await SeoSettings.getSettings();
    res.json({
      adsensePublisherId: settings.adsensePublisherId,
      adsEnabled: settings.adsEnabled,
      autoAds: settings.autoAds,
      adUnits: settings.adUnits
    });
  } catch (error) {
    console.error('Get AdSense settings error:', error);
    res.status(500).json({ message: 'Failed to get AdSense settings', error: error.message });
  }
};

// Update AdSense Settings only
exports.updateAdsenseSettings = async (req, res) => {
  try {
    const { adsensePublisherId, adsEnabled, autoAds, adUnits } = req.body;

    let settings = await SeoSettings.findOne();
    if (!settings) {
      settings = new SeoSettings();
    }

    if (adsensePublisherId !== undefined) settings.adsensePublisherId = adsensePublisherId;
    if (adsEnabled !== undefined) settings.adsEnabled = adsEnabled;
    if (autoAds !== undefined) settings.autoAds = autoAds;
    if (adUnits !== undefined) settings.adUnits = adUnits;

    await settings.save();

    res.json({
      message: 'AdSense settings updated successfully',
      adsensePublisherId: settings.adsensePublisherId,
      adsEnabled: settings.adsEnabled,
      autoAds: settings.autoAds,
      adUnits: settings.adUnits
    });
  } catch (error) {
    console.error('Update AdSense settings error:', error);
    res.status(500).json({ message: 'Failed to update AdSense settings', error: error.message });
  }
};

// Get Site Settings (public - for logo, loader, etc.)
exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get site settings error:', error);
    res.status(500).json({ message: 'Failed to get site settings', error: error.message });
  }
};

// Update Site Settings (admin only)
exports.updateSiteSettings = async (req, res) => {
  try {
    const {
      siteName,
      siteTagline,
      logo,
      logoDark,
      logoIcon,
      logoText,
      logoAccentText,
      loaderType,
      loaderColor,
      loaderImage,
      loaderText,
      favicon,
      contactEmail,
      supportEmail,
      maintenanceMode,
      registrationEnabled,
      emailVerificationRequired,
      defaultUserType,
      maxLoginAttempts,
      sessionTimeout,
      socialLinks
    } = req.body;

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    // Update fields if provided
    if (siteName !== undefined) settings.siteName = siteName;
    if (siteTagline !== undefined) settings.siteTagline = siteTagline;
    if (logo !== undefined) settings.logo = logo;
    if (logoDark !== undefined) settings.logoDark = logoDark;
    if (logoIcon !== undefined) settings.logoIcon = logoIcon;
    if (logoText !== undefined) settings.logoText = logoText;
    if (logoAccentText !== undefined) settings.logoAccentText = logoAccentText;
    if (loaderType !== undefined) settings.loaderType = loaderType;
    if (loaderColor !== undefined) settings.loaderColor = loaderColor;
    if (loaderImage !== undefined) settings.loaderImage = loaderImage;
    if (loaderText !== undefined) settings.loaderText = loaderText;
    if (favicon !== undefined) settings.favicon = favicon;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (registrationEnabled !== undefined) settings.registrationEnabled = registrationEnabled;
    if (emailVerificationRequired !== undefined) settings.emailVerificationRequired = emailVerificationRequired;
    if (defaultUserType !== undefined) settings.defaultUserType = defaultUserType;
    if (maxLoginAttempts !== undefined) settings.maxLoginAttempts = maxLoginAttempts;
    if (sessionTimeout !== undefined) settings.sessionTimeout = sessionTimeout;
    if (socialLinks !== undefined) settings.socialLinks = socialLinks;

    await settings.save();

    res.json({
      message: 'Site settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update site settings error:', error);
    res.status(500).json({ message: 'Failed to update site settings', error: error.message });
  }
};

// Get public SEO data (for frontend meta tags)
exports.getPublicSeoData = async (req, res) => {
  try {
    const settings = await SeoSettings.getSettings();
    res.json({
      siteTitle: settings.siteTitle,
      siteDescription: settings.siteDescription,
      siteKeywords: settings.siteKeywords,
      ogImage: settings.ogImage,
      twitterHandle: settings.twitterHandle,
      googleVerification: settings.googleVerification,
      bingVerification: settings.bingVerification,
      googleAnalyticsId: settings.googleAnalyticsId,
      structuredData: settings.structuredData,
      adsensePublisherId: settings.adsensePublisherId,
      adsEnabled: settings.adsEnabled,
      autoAds: settings.autoAds
    });
  } catch (error) {
    console.error('Get public SEO data error:', error);
    res.status(500).json({ message: 'Failed to get SEO data', error: error.message });
  }
};
