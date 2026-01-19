const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/db');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { createError } = require('../utils/errors');

const registerUser = async (userData) => {
  const { email, password, name, role = 'OWNER' } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw createError('USER_EXISTS', 'User with this email already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  // Generate tokens
  const accessToken = generateToken(user, 'user');
  const refreshToken = generateRefreshToken(user, 'user');

  return {
    user,
    accessToken,
    refreshToken,
    expiresIn: 24 * 60 * 60 // 24 hours in seconds
  };
};

const registerEmployee = async (employeeData) => {
  const { email, password, name, role = 'CASHIER' } = employeeData;

  // Check if employee already exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { email }
  });

  if (existingEmployee) {
    throw createError('EMPLOYEE_EXISTS', 'Employee with this email already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create employee
  const employee = await prisma.employee.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  // Generate tokens
  const accessToken = generateToken(employee, 'employee');
  const refreshToken = generateRefreshToken(employee, 'employee');

  return {
    user: employee,
    accessToken,
    refreshToken,
    expiresIn: 24 * 60 * 60 // 24 hours in seconds
  };
};

const loginUser = async (loginData) => {
  const { email, password, type = 'user' } = loginData;

  let user = null;
  
  // Find user or employee based on type
  if (type === 'user') {
    user = await prisma.user.findUnique({
      where: { email }
    });
  } else if (type === 'employee') {
    user = await prisma.employee.findUnique({
      where: { email }
    });
  }

  if (!user) {
    throw createError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    throw createError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  // Generate tokens
  const accessToken = generateToken(userWithoutPassword, type);
  const refreshToken = generateRefreshToken(userWithoutPassword, type);

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
    expiresIn: 24 * 60 * 60 // 24 hours in seconds
  };
};

const refreshToken = async (refreshTokenValue) => {
  const decoded = verifyRefreshToken(refreshTokenValue);
  
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
    throw createError('INVALID_REFRESH_TOKEN', 'Invalid refresh token', 401);
  }

  // Generate new tokens
  const newAccessToken = generateToken(user, decoded.type);
  const newRefreshToken = generateRefreshToken(user, decoded.type);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: 24 * 60 * 60 // 24 hours in seconds
  };
};

module.exports = {
  registerUser,
  registerEmployee,
  loginUser,
  refreshToken
};