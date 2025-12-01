// Reports routes for AgroGig
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get monthly report for a farmer
router.get('/monthly/:farmerId', reportController.getMonthlyReport);

// Get action distribution
router.get('/distribution/:farmerId', reportController.getActionDistribution);

// Get AI recommendations
router.get('/recommendations/:farmerId', reportController.getRecommendations);

// Claim reward
router.post('/rewards/claim', reportController.claimReward);

module.exports = router;