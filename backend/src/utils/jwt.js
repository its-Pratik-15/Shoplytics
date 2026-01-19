const jwt = require('jsonwebtoken');
const { createError } = require('./errors');

const generateToken = (user, type) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      type: type // 'user' or 'employee'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const generateRefreshToken = (user, type) => {
  return jwt.sign(
    { 
      id: user.id, 
      type: type 
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createError('TOKEN_EXPIRED', 'Authentication token has expired', 401);
    }
    throw createError('INVALID_TOKEN', 'Invalid authentication token', 401);
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createError('REFRESH_TOKEN_EXPIRED', 'Refresh token has expired', 401);
    }
    throw createError('INVALID_REFRESH_TOKEN', 'Invalid refresh token', 401);
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
};