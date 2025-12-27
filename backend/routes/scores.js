const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getDashboardScores } = require('../controllers/scoresController');

router.get('/dashboard', authenticateToken, getDashboardScores);

module.exports = router;