const Certificate = require('./Certificate');
const User = require('../auth/User');
const Course = require('../courses/Course');
const Technology = require('../technologies/Technology');

// Generate certificate for user
exports.generateCertificate = async (req, res) => {
  try {
    const {
      userId,
      certificateType,
      courseId,
      technologyId,
      testId,
      title,
      description,
      score,
      totalQuestions,
      correctAnswers,
      tags
    } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({
      user: userId,
      certificateType,
      course: courseId,
      technology: technologyId,
      testId
    });

    if (existingCert) {
      return res.status(400).json({ message: 'Certificate already issued for this achievement' });
    }

    // Create certificate
    const certificate = new Certificate({
      user: userId,
      certificateType,
      course: courseId,
      technology: technologyId,
      testId,
      title,
      description,
      score,
      totalQuestions,
      correctAnswers,
      tags,
      issuedByAdmin: req.user?.role === 'admin' ? req.user.id : null
    });

    await certificate.save();

    // Add certificate to user's profile
    if (!user.certificates) user.certificates = [];
    user.certificates.push(certificate._id);
    await user.save();

    // Populate certificate details
    await certificate.populate([
      { path: 'user', select: 'name email username profileImage' },
      { path: 'course', select: 'title slug thumbnail' },
      { path: 'technology', select: 'name slug icon' }
    ]);

    res.status(201).json({
      message: 'Certificate generated successfully',
      certificate
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Failed to generate certificate', error: error.message });
  }
};

// Get user's certificates
exports.getUserCertificates = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, type } = req.query;

    const query = { user: userId };
    if (status) query.status = status;
    if (type) query.certificateType = type;

    const certificates = await Certificate.find(query)
      .populate('course', 'title slug thumbnail')
      .populate('technology', 'name slug icon')
      .sort({ issueDate: -1 });

    res.json({
      certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};

// Get certificate by ID (for verification)
exports.getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate('user', 'name email username profileImage')
      .populate('course', 'title slug thumbnail')
      .populate('technology', 'name slug icon');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({ certificate });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Failed to fetch certificate', error: error.message });
  }
};

// Verify certificate
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate('user', 'name email username')
      .populate('course', 'title')
      .populate('technology', 'name');

    if (!certificate) {
      return res.json({
        valid: false,
        message: 'Certificate not found'
      });
    }

    const isValid = certificate.isValid();

    res.json({
      valid: isValid,
      certificate: isValid ? certificate : null,
      message: isValid ? 'Certificate is valid' : 'Certificate is invalid or expired'
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ message: 'Failed to verify certificate', error: error.message });
  }
};

// Admin: Get all certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      search,
      sortBy = 'issueDate',
      order = 'desc'
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.certificateType = type;

    // Search by user name or certificate title
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { certificateId: { $regex: search, $options: 'i' } },
        { user: { $in: users.map(u => u._id) } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const certificates = await Certificate.find(query)
      .populate('user', 'name email username profileImage')
      .populate('course', 'title slug')
      .populate('technology', 'name slug')
      .populate('issuedByAdmin', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Certificate.countDocuments(query);

    res.json({
      certificates,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get all certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};

// Admin: Revoke certificate
exports.revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { reason } = req.body;

    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.status = 'revoked';
    certificate.notes = reason || 'Revoked by admin';
    await certificate.save();

    res.json({
      message: 'Certificate revoked successfully',
      certificate
    });
  } catch (error) {
    console.error('Revoke certificate error:', error);
    res.status(500).json({ message: 'Failed to revoke certificate', error: error.message });
  }
};

// Admin: Delete certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Remove from user's certificates
    await User.findByIdAndUpdate(certificate.user, {
      $pull: { certificates: certificate._id }
    });

    await certificate.deleteOne();

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ message: 'Failed to delete certificate', error: error.message });
  }
};

// Admin: Update certificate
exports.updateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const updates = req.body;

    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'status', 'notes', 'tags', 'isPublic', 'expiryDate'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        certificate[field] = updates[field];
      }
    });

    await certificate.save();

    await certificate.populate([
      { path: 'user', select: 'name email username' },
      { path: 'course', select: 'title slug' },
      { path: 'technology', select: 'name slug' }
    ]);

    res.json({
      message: 'Certificate updated successfully',
      certificate
    });
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ message: 'Failed to update certificate', error: error.message });
  }
};

// Get certificate statistics (Admin dashboard)
exports.getCertificateStats = async (req, res) => {
  try {
    const totalCertificates = await Certificate.countDocuments();
    const activeCertificates = await Certificate.countDocuments({ status: 'active' });
    const revokedCertificates = await Certificate.countDocuments({ status: 'revoked' });

    const certificatesByType = await Certificate.aggregate([
      { $group: { _id: '$certificateType', count: { $sum: 1 } } }
    ]);

    const recentCertificates = await Certificate.find()
      .populate('user', 'name email username')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    const topPerformers = await Certificate.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$user', avgScore: { $avg: '$score' }, count: { $sum: 1 } } },
      { $sort: { avgScore: -1 } },
      { $limit: 10 }
    ]);

    // Populate user details for top performers
    await User.populate(topPerformers, { path: '_id', select: 'name email username profileImage' });

    res.json({
      stats: {
        total: totalCertificates,
        active: activeCertificates,
        revoked: revokedCertificates,
        byType: certificatesByType
      },
      recentCertificates,
      topPerformers: topPerformers.map(tp => ({
        user: tp._id,
        averageScore: Math.round(tp.avgScore),
        certificateCount: tp.count
      }))
    });
  } catch (error) {
    console.error('Get certificate stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

// Update share count
exports.trackShare = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { platform } = req.body;

    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.shareCount += 1;
    if (platform === 'linkedin') {
      certificate.linkedInShared = true;
    }

    await certificate.save();

    res.json({ message: 'Share tracked successfully' });
  } catch (error) {
    console.error('Track share error:', error);
    res.status(500).json({ message: 'Failed to track share', error: error.message });
  }
};
