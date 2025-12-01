// Authentication routes for AgroGig
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Login route
router.post('/login', authController.login);

// Register route
router.post('/register', authController.register);

// Logout route
router.post('/logout', authController.logout);

// Get current user (protected route)
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;