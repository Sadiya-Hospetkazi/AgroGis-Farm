// Monthly Reports routes for AgroGig
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const monthlyReportController = require('../controllers/monthlyReportController');

// Get monthly report for the authenticated user
router.get('/monthly', authenticateToken, monthlyReportController.getMonthlyReport);

module.exports = router;