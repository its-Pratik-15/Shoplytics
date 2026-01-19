const prisma = require('../../prisma/db');
const { verifyToken } = require('../utils/jwt');
const { createError } = require('../utils/errors');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Access token is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    const decoded = verifyToken(token);
    
    // Check if user or employee exists
    let user = null;
    if (decoded.type === 'user') {
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true }
      });
    } else if (decoded.type === 'employee') {
      user = await prisma.employee.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true }
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token',
          timestamp: new Date().toISOString()
        }
      });
    }

    req.user = { ...user, type: decoded.type };
    next();
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      success: false,
      error: {
        code: error.code || 'INVALID_TOKEN',
        message: error.message || 'Invalid or expired token',
        timestamp: new Date().toISOString()
      }
    });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          timestamp: new Date().toISOString()
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
          timestamp: new Date().toISOString()
        }
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};