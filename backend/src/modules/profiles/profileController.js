const Profile = require('./Profile');
const User = require('../auth/User');

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    profileData.userId = req.userId;

    let profile = await Profile.findOne({ userId: req.userId });
    
    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile(profileData);
      await profile.save();
    }

    // Update profile completion percentage
    const completion = calculateProfileCompletion(profile);
    await User.findByIdAndUpdate(req.userId, { profileCompletionPercentage: completion });

    res.json({ message: 'Profile saved', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfileVersions = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.versions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.restoreProfileVersion = async (req, res) => {
  try {
    const { version } = req.params;
    const profile = await Profile.findOne({ userId: req.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const versionData = profile.versions.find(v => v.version === parseInt(version));
    if (!versionData) {
      return res.status(404).json({ message: 'Version not found' });
    }

    // Restore version data
    Object.assign(profile, versionData.data);
    profile.versions = profile.versions.slice(0, versionData.version);
    await profile.save();

    res.json({ message: 'Profile restored', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

function calculateProfileCompletion(profile) {
  const fields = [
    'personalDetails.firstName',
    'personalDetails.lastName',
    'personalDetails.phone',
    'personalDetails.location',
    'personalDetails.summary',
    'education',
    'experience',
    'skills'
  ];

  let completed = 0;
  const total = fields.length;

  fields.forEach(field => {
    const value = getNestedValue(profile, field);
    if (value && (Array.isArray(value) ? value.length > 0 : true)) {
      completed++;
    }
  });

  return Math.round((completed / total) * 100);
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}