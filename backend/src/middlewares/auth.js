const prisma = require('../../prisma/db');
const { verifyToken } = require('../utils/jwt');
const { createError } = require('../utils/errors');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('NO_TOKEN', 'Access token is required', 401);
    }

    // verifyToken will throw error if invalid
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
      throw createError('INVALID_TOKEN', 'Invalid authentication token', 401);
    }

    req.user = { ...user, type: decoded.type };
    next();
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw createError('UNAUTHORIZED', 'Authentication required', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw createError('FORBIDDEN', 'Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  };
};

module.exports = {
  authenticateToken,
  requireRole
};