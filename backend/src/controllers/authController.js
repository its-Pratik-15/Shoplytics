const authService = require('../services/authService');
const { validateRegister, validateLogin } = require('../validations/authValidation');

const register = async (req, res, next) => {
  try {
    // Validate input - throws error if invalid
    const validatedData = validateRegister(req.body);
    
    // Register user - throws error if fails
    const result = await authService.registerUser(validatedData);
    
    // Set secure cookies for production
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.cookie('user', JSON.stringify(result.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        message: 'Registration successful'
      }
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

const login = async (req, res, next) => {
  try {
    // Validate input - throws error if invalid
    const validatedData = validateLogin(req.body);
    
    // Login user - throws error if fails
    const result = await authService.loginUser(validatedData);
    
    // Set secure cookies for production
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.cookie('user', JSON.stringify(result.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      data: {
        user: result.user,
        message: 'Login successful'
      }
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

const registerEmployee = async (req, res, next) => {
  try {
    // Validate input - throws error if invalid
    const validatedData = validateRegister(req.body);
    
    // Register employee - throws error if fails
    const result = await authService.registerEmployee(validatedData);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

const refreshToken = async (req, res, next) => {
  try {
    // Validate input - throws error if invalid
    const validatedData = validateRefresh(req.body);
    
    // Refresh token - throws error if fails
    const result = await authService.refreshToken(validatedData.refreshToken);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

const logout = async (req, res, next) => {
  try {
    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('user');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    // User is already available from auth middleware
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  registerEmployee,
  refreshToken,
  logout,
  getProfile
};