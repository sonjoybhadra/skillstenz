const UserSettings = require('../../models/UserSettings');

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ user: req.user.id });
    
    if (!settings) {
      // Create default settings
      settings = new UserSettings({ user: req.user.id });
      await settings.save();
    }
    
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const allowedFields = [
      'theme', 'fontSize', 'language',
      'emailNotifications', 'pushNotifications', 'courseUpdates',
      'promotionalEmails', 'weeklyDigest', 'commentReplies', 'mentionNotifications',
      'profileVisibility', 'showEmail', 'showLocation', 'showActivity', 'allowMessages',
      'autoplayVideos', 'videoQuality', 'showSubtitles', 'playbackSpeed',
      'twoFactorEnabled', 'twoFactorMethod'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    const settings = await UserSettings.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, upsert: true }
    );
    
    res.json({ settings, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
