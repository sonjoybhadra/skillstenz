const User = require('../modules/auth/User');

const checkMembership = (requiredPlans = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).populate('membershipId');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.membershipId) {
        // Free plan
        if (requiredPlans.length > 0 && !requiredPlans.includes('free')) {
          return res.status(403).json({ message: 'Upgrade required' });
        }
      } else {
        // Check if membership is active and matches required plans
        const membership = user.membershipId;
        if (membership.status !== 'active' || new Date() > membership.expiryDate) {
          return res.status(403).json({ message: 'Membership expired' });
        }

        if (requiredPlans.length > 0 && !requiredPlans.includes(membership.planType)) {
          return res.status(403).json({ message: 'Upgrade required' });
        }
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = checkMembership;