const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// User Registration
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

// Employee Registration
router.post('/employee/register', authController.registerEmployee);

// Refresh Token
router.post('/refresh', authController.refreshToken);

// Logout (clear cookies)
router.post('/logout', authController.logout);

// Get Profile (protected route)
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;