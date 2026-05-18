const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validateMiddleware');

/**
 * Auth Routes
 * POST /api/auth/signup  — Register a new user
 * POST /api/auth/login   — Login and get JWT token
 */
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

module.exports = router;
