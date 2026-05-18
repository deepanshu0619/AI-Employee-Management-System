const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header.
 * Attaches user object to req.user if valid.
 * Blocks access with 401/403 if token is missing or invalid.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found, authorization denied',
        });
      }

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Access denied — invalid or expired token',
      });
    }
  }

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Access denied — no token provided',
    });
  }
};

module.exports = { protect };
