const express = require('express');
const router = express.Router();
const { getDashboardScores } = require('../controllers/scoresController');

router.get('/dashboard/:farmerId', getDashboardScores);

module.exports = router;