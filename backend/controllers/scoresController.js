const { pool } = require('../config/db');

const getDashboardScores = async (req, res) => {
    const userId = req.userId; // Get user ID from authenticated request

    const scoresResult = await pool.query('SELECT * FROM scores WHERE farmer_id = $1', [userId]);
    const scores = scoresResult.rows;

    if (scores.length === 0) {
        return res.json({
            success: true,
            scores: {
                soil: 0,
                irrigation: 0,
                sustainability: 0,
                weed: 0
            }
        });
    }

    // Calculate aggregated scores by category
    const categoryScores = {};
    scores.forEach(score => {
        const category = score.category;
        if (!categoryScores[category]) {
            categoryScores[category] = 0;
        }
        categoryScores[category] += score.score;
    });

    res.json({
        success: true,
        scores: {
            soil: categoryScores.soil || 0,
            irrigation: categoryScores.irrigation || 0,
            sustainability: categoryScores.fertilizer || 0,
            weed: categoryScores.weed || 0
        }
    });
};

const addScore = async (req, res) => {
    try {
        const { action_type, points } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        await pool.query(
            `INSERT INTO scores (farmer_id, action_type, score)
             VALUES ($1, $2, $3)`,
            [userId, action_type, points]
        );

        res.json({ success: true, message: 'Score added successfully' });
    } catch (err) {
        console.error('Score insert error:', err);
        res.status(500).json({ success: false, message: 'Failed to add score' });
    }
};

module.exports = { getDashboardScores, addScore };