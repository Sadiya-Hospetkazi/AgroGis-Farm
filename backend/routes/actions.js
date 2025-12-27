const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { logAction, getFarmerActions } = require('../controllers/actionController');

// Log a farming action (protected route - uses authenticated user's ID)
router.post('/log', authenticateToken, logAction);

// Get actions for the authenticated farmer
router.get('/my-actions', authenticateToken, getFarmerActions);

module.exports = router;