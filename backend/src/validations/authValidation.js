const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRegister = (data) => {
  const { email, password, name, role } = data;
  const errors = [];

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Name validation
  if (!name) {
    errors.push('Name is required');
  } else if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }

  // Role validation (optional)
  if (role && !['OWNER', 'ADMIN', 'CASHIER', 'MANAGER'].includes(role)) {
    errors.push('Role must be one of: OWNER, ADMIN, CASHIER, MANAGER');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { email, password, name, role }
  };
};

const validateLogin = (data) => {
  const { email, password, type = 'user' } = data;
  const errors = [];

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  }

  // Type validation
  if (type && !['user', 'employee'].includes(type)) {
    errors.push('Type must be either user or employee');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { email, password, type }
  };
};

const validateRefresh = (data) => {
  const { refreshToken } = data;
  const errors = [];

  if (!refreshToken) {
    errors.push('Refresh token is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { refreshToken }
  };
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRefresh
};