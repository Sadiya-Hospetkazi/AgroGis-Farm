// Monthly Reports routes for AgroGig
const express = require('express');
const router = express.Router();
const monthlyReportController = require('../controllers/monthlyReportController');

// Get monthly report for a farmer
router.get('/monthly/:farmerId', monthlyReportController.getMonthlyReport);

module.exports = router;