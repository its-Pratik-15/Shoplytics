const authService = require('../services/authService');
const { validateRegister, validateLogin, validateRefresh } = require('../validations/authValidation');

const register = async (req, res, next) => {
  try {
    // Validate input
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors[0],
          timestamp: new Date().toISOString()
        }
      });
    }

    const result = await authService.registerUser(validation.data);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Validate input
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors[0],
          timestamp: new Date().toISOString()
        }
      });
    }

    const result = await authService.loginUser(validation.data);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const registerEmployee = async (req, res, next) => {
  try {
    // Validate input
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors[0],
          timestamp: new Date().toISOString()
        }
      });
    }

    const result = await authService.registerEmployee(validation.data);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    // Validate input
    const validation = validateRefresh(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors[0],
          timestamp: new Date().toISOString()
        }
      });
    }

    const result = await authService.refreshToken(validation.data.refreshToken);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  registerEmployee,
  refreshToken
};