const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateToken, (req, res) => {
    const user = req.user;
    res.json({
        success: true,
        data: { user }
    });
});

module.exports = router;