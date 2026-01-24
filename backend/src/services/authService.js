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

  // Generate token (7 days expiry)
  const token = generateToken(user, 'user');

  return {
    user,
    token,
    expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
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
  const { email, password } = loginData;

  let user = null;
  let userType = null;
  
  // First try to find in users table
  user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (user) {
    userType = 'user';
  } else {
    // If not found in users, try employees table
    user = await prisma.employee.findUnique({
      where: { email }
    });
    
    if (user) {
      userType = 'employee';
    }
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

  // Generate token (7 days expiry)
  const token = generateToken(userWithoutPassword, userType);

  return {
    user: {
      ...userWithoutPassword,
      userType // Add userType to response for frontend permissions
    },
    token,
    expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
  };
};

module.exports = {
  registerUser,
  registerEmployee,
  loginUser
};