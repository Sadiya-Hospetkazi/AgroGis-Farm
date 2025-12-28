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

        // For direct score additions, we'll set action_id to null and determine category from action_type
        let category = "";
        if (action_type.toLowerCase().includes('water')) {
            category = "water";
        } else if (action_type.toLowerCase().includes('fertiliz')) {
            category = "fertilizer";
        } else if (action_type.toLowerCase().includes('weed')) {
            category = "weed";
        } else if (action_type.toLowerCase().includes('monitor')) {
            category = "monitoring";
        } else if (action_type.toLowerCase().includes('irrigation')) {
            category = "irrigation";
        } else if (action_type.toLowerCase().includes('soil')) {
            category = "soil";
        }
        
        await pool.query(
            `INSERT INTO scores (action_id, farmer_id, score, category, action_type)
             VALUES (NULL, $1, $2, $3, $4)`,
            [userId, points, category, action_type]
        );

        res.json({ success: true, message: 'Score added successfully' });
    } catch (err) {
        console.error('Score insert error:', err);
        res.status(500).json({ success: false, message: 'Failed to add score' });
    }
};

module.exports = { getDashboardScores, addScore };