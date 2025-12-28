const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getDashboardScores, addScore } = require('../controllers/scoresController');

router.get('/dashboard', authenticateToken, getDashboardScores);

router.post('/add', authenticateToken, addScore);

module.exports = router;