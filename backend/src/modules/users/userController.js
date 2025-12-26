// Upload profile image
const path = require('path');
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Save relative path or URL
    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    user.profileImage = imageUrl;
    await user.save();
    res.json({ message: 'Image uploaded', imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const User = require('../auth/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('membershipId').select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, userType } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (email) user.email = email;
    if (userType) user.userType = userType;
    user.updatedAt = new Date();

    await user.save();
    res.json({ message: 'Profile updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, userType, accountStatus } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (userType) query.userType = userType;
    if (accountStatus) query.accountStatus = accountStatus;

    const users = await User.find(query)
      .populate('membershipId')
      .select('-password -refreshTokens')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountStatus } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { accountStatus, updatedAt: new Date() },
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignMembership = async (req, res) => {
  try {
    const { userId } = req.params;
    const { membershipId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { membershipId, updatedAt: new Date() },
      { new: true }
    ).populate('membershipId').select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Membership assigned', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get public profile by username
exports.getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ 
      username: username.toLowerCase(),
      isPublic: true,
      accountStatus: 'active'
    }).select(
      'username name title profileImage bio location website skills ' +
      'socialLinks experience education projects certifications achievements ' +
      'completedCourses totalPoints badges isPublic'
    );

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};