const { createError } = require('../utils/errors');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRegister = (data) => {
  const { email, password, name, role } = data;

  // Email validation
  if (!email) {
    throw createError('VALIDATION_ERROR', 'Email is required', 400);
  }
  if (!validateEmail(email)) {
    throw createError('VALIDATION_ERROR', 'Please provide a valid email address', 400);
  }

  // Password validation
  if (!password) {
    throw createError('VALIDATION_ERROR', 'Password is required', 400);
  }
  if (password.length < 6) {
    throw createError('VALIDATION_ERROR', 'Password must be at least 6 characters long', 400);
  }

  // Name validation
  if (!name) {
    throw createError('VALIDATION_ERROR', 'Name is required', 400);
  }
  if (name.length < 2) {
    throw createError('VALIDATION_ERROR', 'Name must be at least 2 characters long', 400);
  }
  if (name.length > 50) {
    throw createError('VALIDATION_ERROR', 'Name cannot exceed 50 characters', 400);
  }

  // Role validation (optional)
  if (role && !['OWNER', 'ADMIN', 'CASHIER', 'MANAGER'].includes(role)) {
    throw createError('VALIDATION_ERROR', 'Role must be one of: OWNER, ADMIN, CASHIER, MANAGER', 400);
  }

  return { email, password, name, role };
};

const validateLogin = (data) => {
  const { email, password, type = 'user' } = data;

  // Email validation
  if (!email) {
    throw createError('VALIDATION_ERROR', 'Email is required', 400);
  }
  if (!validateEmail(email)) {
    throw createError('VALIDATION_ERROR', 'Please provide a valid email address', 400);
  }

  // Password validation
  if (!password) {
    throw createError('VALIDATION_ERROR', 'Password is required', 400);
  }

  // Type validation
  if (type && !['user', 'employee'].includes(type)) {
    throw createError('VALIDATION_ERROR', 'Type must be either user or employee', 400);
  }

  return { email, password, type };
};

const validateRefresh = (data) => {
  const { refreshToken } = data;

  if (!refreshToken) {
    throw createError('VALIDATION_ERROR', 'Refresh token is required', 400);
  }

  return { refreshToken };
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRefresh
};