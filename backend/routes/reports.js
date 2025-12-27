// Reports routes for AgroGig
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

// Get monthly report for the authenticated user
router.get('/monthly', authenticateToken, reportController.getMonthlyReport);

// Get action distribution
router.get('/distribution', authenticateToken, reportController.getActionDistribution);

// Get AI recommendations
router.get('/recommendations', authenticateToken, reportController.getRecommendations);

// Claim reward
router.post('/rewards/claim', authenticateToken, reportController.claimReward);

module.exports = router;