// Monthly Report controller for AgroGig
const { pool } = require('../config/db');

// Get monthly report controller
const getMonthlyReport = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from authenticated request
        
        // Get scores for this user
        const scoresResult = await pool.query('SELECT * FROM scores WHERE farmer_id = $1', [userId]);
        const scores = scoresResult.rows;
        
        // Get total score for this user
        const totalScoreResult = await pool.query('SELECT SUM(score) as total_score FROM scores WHERE farmer_id = $1', [userId]);
        
        // Group scores by action type for the report
        const scoreTotals = {};
        let totalScore = totalScoreResult.rows[0].total_score || 0;
        
        scores.forEach(score => {
            const actionType = score.action_type || score.category;
            if (!scoreTotals[actionType]) {
                scoreTotals[actionType] = 0;
            }
            scoreTotals[actionType] += score.score;
        });
        
        // Map to specific report categories
        const watering = scoreTotals['watering'] || scoreTotals['water'] || 0;
        const weeding = scoreTotals['weeding'] || scoreTotals['weed'] || 0;
        const fertilizing = scoreTotals['fertilizing'] || scoreTotals['fertilizer'] || 0;
        const irrigation = scoreTotals['irrigation'] || 0;
        const monitoring = scoreTotals['monitoring'] || 0;
        
        res.json({
            success: true,
            report: {
                watering: watering,
                weeding: weeding,
                fertilizing: fertilizing,
                irrigation: irrigation,
                monitoring: monitoring,
                total_score: totalScore
            }
        });
    } catch (error) {
        console.error('Get monthly report error:', error);
        res.status(500).json({ 
            error: 'Failed to generate monthly report',
            message: error.message 
        });
    }
};

module.exports = {
    getMonthlyReport
};