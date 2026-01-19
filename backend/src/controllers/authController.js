const authService = require('../services/authService');
const { validateRegister, validateLogin, validateRefresh } = require('../validations/authValidation');

const register = async (req, res, next) => {
  try {
    // Validate input - throws error if invalid
    const validatedData = validateRegister(req.body);
    
    // Register user - throws error if fails
    const result = await authService.registerUser(validatedData);
    
    res.status(201).json({
      success: true,
      data: result
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
    
    res.json({
      success: true,
      data: result
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

module.exports = {
  register,
  login,
  registerEmployee,
  refreshToken
};