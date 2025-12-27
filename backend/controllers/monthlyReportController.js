// Monthly Report controller for AgroGig
const { pool } = require('../config/db');

// Get monthly report controller
const getMonthlyReport = async (req, res) => {
    try {
        const { farmerId } = req.params;
        
        // Get actions for this farmer
        const farmerActionsResult = await pool.query('SELECT * FROM actions WHERE farmer_id = $1', [parseInt(farmerId)]);
        const farmerActions = farmerActionsResult.rows;
        
        // Get total score for this farmer
        const totalScoreResult = await pool.query('SELECT SUM(score) as total_score FROM scores WHERE farmer_id = $1', [parseInt(farmerId)]);
        
        // Group actions by type for the report
        const actionCounts = {};
        let totalScore = totalScoreResult.rows[0].total_score || 0;
        
        farmerActions.forEach(action => {
            const actionType = action.type;
            if (!actionCounts[actionType]) {
                actionCounts[actionType] = 0;
            }
            actionCounts[actionType]++;
        });
        
        // Map to specific report categories
        const watering = actionCounts['Watering'] || actionCounts['watering'] || 0;
        const weeding = actionCounts['Weeding'] || actionCounts['weeding'] || 0;
        const fertilizing = actionCounts['Fertilizing'] || actionCounts['fertilizing'] || 0;
        const irrigation = actionCounts['Irrigation'] || actionCounts['irrigation'] || 0;
        const monitoring = actionCounts['Crop Monitoring'] || actionCounts['Monitoring'] || 
                          actionCounts['crop monitoring'] || actionCounts['monitoring'] || 0;
        
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