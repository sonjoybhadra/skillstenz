const checkFeatureAccess = (feature) => {
  return async (req, res, next) => {
    try {
      const user = req.user; // Assumes user is already populated by previous middleware

      if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      let hasAccess = false;

      if (user.membershipId) {
        const membership = user.membershipId;
        if (membership.status === 'active' && new Date() <= membership.expiryDate) {
          hasAccess = membership.features.includes(feature);
        }
      } else {
        // Free plan features
        const freeFeatures = ['basic_technologies', 'limited_ai'];
        hasAccess = freeFeatures.includes(feature);
      }

      if (!hasAccess) {
        return res.status(403).json({ message: 'Feature not available in your plan' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = checkFeatureAccess;