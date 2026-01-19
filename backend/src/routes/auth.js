const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// User Registration
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

// Employee Registration
router.post('/employee/register', authController.registerEmployee);

// Refresh Token
router.post('/refresh', authController.refreshToken);

module.exports = router;