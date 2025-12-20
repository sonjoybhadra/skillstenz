const jwt = require('jsonwebtoken');
const User = require('../modules/auth/User');

// Authenticate user
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.accountStatus === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      userType: user.userType
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Require instructor or admin role
const requireInstructor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Instructor access required' });
  }
  
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  requireInstructor
};
