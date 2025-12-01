const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const dataStorage = require('../utils/dataStorage');

router.get('/dashboard', authenticateToken, (req, res) => {
    const farmer = req.farmer;
    res.json({
        success: true,
        data: { farmer }
    });
});

module.exports = router;