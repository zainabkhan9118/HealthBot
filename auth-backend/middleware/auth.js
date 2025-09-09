const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    console.log('Headers received:', req.headers);
    
    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
      console.log('Found Bearer token');
    } 
    // Check for x-auth-token header that our frontend is sending
    else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
      console.log('Found x-auth-token header');
    }

    // Make sure token exists
    if (!token) {
      console.log('No token found, access denied');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    console.log('Token found:', token.substring(0, 10) + '...');

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified, decoded ID:', decoded.id);

      // Add user to request object
      req.user = await User.findById(decoded.id);
      console.log('User found:', req.user ? 'Yes' : 'No');

      next();
    } catch (err) {
      console.log('Token verification failed:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
