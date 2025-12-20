const Membership = require('./Membership');
const User = require('../auth/User');

exports.getMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ userId: req.userId });
    res.json(membership || { planType: 'free', features: Membership.getPlanFeatures('free') });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.upgradeMembership = async (req, res) => {
  try {
    const { planType, duration } = req.body; // duration in months

    if (!['silver', 'gold'].includes(planType)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + (duration || 1));

    const features = Membership.getPlanFeatures(planType);
    const aiUsageLimit = Membership.getAILimit(planType);

    let membership = await Membership.findOne({ userId: req.userId });
    
    if (membership) {
      membership.planType = planType;
      membership.status = 'active';
      membership.features = features;
      membership.aiUsageLimit = aiUsageLimit;
      membership.expiryDate = expiryDate;
      membership.updatedAt = new Date();
      await membership.save();
    } else {
      membership = new Membership({
        userId: req.userId,
        planType,
        features,
        aiUsageLimit,
        expiryDate
      });
      await membership.save();
    }

    // Update user membership reference
    await User.findByIdAndUpdate(req.userId, { membershipId: membership._id });

    res.json({ message: 'Membership upgraded', membership });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelMembership = async (req, res) => {
  try {
    const membership = await Membership.findOneAndUpdate(
      { userId: req.userId },
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json({ message: 'Membership cancelled', membership });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllMemberships = async (req, res) => {
  try {
    const { page = 1, limit = 10, planType, status } = req.query;
    const query = {};
    
    if (planType) query.planType = planType;
    if (status) query.status = status;

    const memberships = await Membership.find(query)
      .populate('userId', 'email userType')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Membership.countDocuments(query);

    res.json({
      memberships,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMembershipStatus = async (req, res) => {
  try {
    const { membershipId } = req.params;
    const { status } = req.body;

    const membership = await Membership.findByIdAndUpdate(
      membershipId,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'email userType');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json({ message: 'Membership status updated', membership });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};