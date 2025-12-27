const { pool } = require('../config/db');

const getDashboardScores = async (req, res) => {
    const farmerId = parseInt(req.params.farmerId);

    const scoresResult = await pool.query('SELECT * FROM scores WHERE farmer_id = $1', [farmerId]);
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
            sustainability: categoryScores.sustainability || 0,
            weed: categoryScores.weed || 0
        }
    });
};

module.exports = { getDashboardScores };