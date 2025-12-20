const User = require('../auth/User');
const Membership = require('../memberships/Membership');
const Technology = require('../technologies/Technology');
const Content = require('../content/Content');
const AILog = require('../ai/AILog');
const SiteSettings = require('../settings/SiteSettings');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeMemberships = await Membership.countDocuments({ 
      status: 'active',
      expiryDate: { $gt: new Date() }
    });
    
    const membershipRevenue = await Membership.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } } // Assuming amount field exists
    ]);

    const aiUsageStats = await AILog.aggregate([
      {
        $group: {
          _id: null,
          totalQueries: { $sum: 1 },
          totalTokens: { $sum: '$tokensUsed' }
        }
      }
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email userType createdAt');

    res.json({
      totalUsers,
      activeMemberships,
      revenue: membershipRevenue[0]?.total || 0,
      aiStats: aiUsageStats[0] || { totalQueries: 0, totalTokens: 0 },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, userType } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (userType) query.userType = userType;

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

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, userType, accountStatus } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role, userType, accountStatus, updatedAt: new Date() },
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getContentModeration = async (req, res) => {
  try {
    const pendingContent = await Content.find({ approved: false })
      .populate('createdBy', 'email')
      .populate('topicId', 'name')
      .sort({ createdAt: -1 });

    const approvedContent = await Content.countDocuments({ approved: true });
    const totalContent = await Content.countDocuments();

    res.json({
      pendingContent,
      approvedContent,
      totalContent,
      pendingCount: pendingContent.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await Content.findByIdAndUpdate(
      contentId,
      {
        approved: true,
        approvedBy: req.userId,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content approved', content });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await Content.findByIdAndDelete(contentId);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMembershipStats = async (req, res) => {
  try {
    const stats = await Membership.aggregate([
      {
        $group: {
          _id: '$planType',
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$status', 'active'] },
                  { $gt: ['$expiryDate', new Date()] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Technology management
exports.getAllTechnologies = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const technologies = await Technology.find(query)
      .sort({ order: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Technology.countDocuments(query);
    
    res.json({
      technologies,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Admin getAllTechnologies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTechnologyById = async (req, res) => {
  try {
    const { id } = req.params;
    const technology = await Technology.findById(id);
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    res.json(technology);
  } catch (error) {
    console.error('Admin getTechnologyById error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTechnology = async (req, res) => {
  try {
    const { name, slug, description, icon, color, accessType, featured, order, courses } = req.body;
    
    // Generate slug if not provided
    const techSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const technology = new Technology({
      name,
      slug: techSlug,
      description,
      icon,
      color,
      accessType,
      featured,
      order,
      courses: courses || [],
      createdBy: req.userId
    });
    
    await technology.save();
    res.status(201).json({ message: 'Technology created', technology });
  } catch (error) {
    console.error('Admin createTechnology error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Technology name or slug already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

exports.updateTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const technology = await Technology.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    res.json({ message: 'Technology updated', technology });
  } catch (error) {
    console.error('Admin updateTechnology error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    const technology = await Technology.findByIdAndDelete(id);
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    res.json({ message: 'Technology deleted' });
  } catch (error) {
    console.error('Admin deleteTechnology error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Course management within technology
exports.addCourse = async (req, res) => {
  try {
    const { techId } = req.params;
    const courseData = req.body;
    
    const technology = await Technology.findById(techId);
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    // Generate slug if not provided
    if (!courseData.slug && courseData.title) {
      courseData.slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    technology.courses.push(courseData);
    await technology.save();
    
    const addedCourse = technology.courses[technology.courses.length - 1];
    res.status(201).json({ message: 'Course added', course: addedCourse });
  } catch (error) {
    console.error('Admin addCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { techId, courseId } = req.params;
    const updates = req.body;
    
    const technology = await Technology.findById(techId);
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    const courseIndex = technology.courses.findIndex(c => c._id.toString() === courseId);
    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    technology.courses[courseIndex] = {
      ...technology.courses[courseIndex].toObject(),
      ...updates
    };
    
    await technology.save();
    res.json({ message: 'Course updated', course: technology.courses[courseIndex] });
  } catch (error) {
    console.error('Admin updateCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { techId, courseId } = req.params;
    
    const technology = await Technology.findById(techId);
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    
    technology.courses = technology.courses.filter(c => c._id.toString() !== courseId);
    await technology.save();
    
    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Admin deleteCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all courses across all technologies for admin
exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, technology, level, price } = req.query;
    
    const query = {};
    if (technology) query.slug = technology;
    
    const technologies = await Technology.find(query).select('name slug courses');
    
    let allCourses = [];
    technologies.forEach(tech => {
      tech.courses.forEach(course => {
        allCourses.push({
          ...course.toObject(),
          technologyId: tech._id,
          technology: tech.slug,
          technologyName: tech.name
        });
      });
    });
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      allCourses = allCourses.filter(c => 
        c.title?.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
      );
    }
    if (level) {
      allCourses = allCourses.filter(c => c.level === level);
    }
    if (price) {
      allCourses = allCourses.filter(c => c.price === price);
    }
    
    const total = allCourses.length;
    const startIndex = (page - 1) * limit;
    const paginatedCourses = allCourses.slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      courses: paginatedCourses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Admin getAllCourses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent deleting self
    if (userId === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Admin deleteUser error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get site settings
exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get site settings error:', error);
    res.status(500).json({ message: 'Failed to get site settings' });
  }
};

// Update site settings
exports.updateSiteSettings = async (req, res) => {
  try {
    const {
      siteName,
      siteTagline,
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

    if (siteName !== undefined) settings.siteName = siteName;
    if (siteTagline !== undefined) settings.siteTagline = siteTagline;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (registrationEnabled !== undefined) settings.registrationEnabled = registrationEnabled;
    if (emailVerificationRequired !== undefined) settings.emailVerificationRequired = emailVerificationRequired;
    if (defaultUserType !== undefined) settings.defaultUserType = defaultUserType;
    if (maxLoginAttempts !== undefined) settings.maxLoginAttempts = maxLoginAttempts;
    if (sessionTimeout !== undefined) settings.sessionTimeout = sessionTimeout;
    if (socialLinks !== undefined) settings.socialLinks = { ...settings.socialLinks, ...socialLinks };

    await settings.save();

    res.json({
      message: 'Site settings updated successfully',
      ...settings.toObject()
    });
  } catch (error) {
    console.error('Update site settings error:', error);
    res.status(500).json({ message: 'Failed to update site settings' });
  }
};