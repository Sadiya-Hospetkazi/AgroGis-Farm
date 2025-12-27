// Report controller for AgroGig
const { pool } = require('../config/db');

// Get monthly report controller
const getMonthlyReport = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from authenticated request
        
        // Get real actions for this user for the current month
        const currentDate = new Date();
        const currentMonth = currentDate.toISOString().substring(0, 7); // YYYY-MM
        
        const farmerActionsResult = await pool.query(
            'SELECT * FROM actions WHERE farmer_id = $1 AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)',
            [userId]
        );
        const farmerActions = farmerActionsResult.rows;
        
        // Calculate statistics
        const totalActions = farmerActions.length;
        
        // Get total score for this user
        const farmerScoresResult = await pool.query(
            'SELECT SUM(score) as total_score FROM scores WHERE farmer_id = $1',
            [userId]
        );
        
        const totalScore = farmerScoresResult.rows[0].total_score || 0;
        
        const avgDailyScore = totalActions > 0 ? (totalScore / 30).toFixed(1) : 0; // Assuming 30 days in month
        
        // Action distribution with proper mapping
        const actionDistribution = {
            watering: 0,
            weeding: 0,
            fertilizing: 0,
            irrigation: 0,
            monitoring: 0
        };
        
        farmerActions.forEach(action => {
            const actionType = action.type;
            if (actionDistribution.hasOwnProperty(actionType)) {
                actionDistribution[actionType]++;
            }
        });
        
        // Create a more detailed report with all the fields the frontend expects
        const detailedReport = {
            month: currentMonth,
            totalActions,
            total_score: totalScore,
            avgDailyScore,
            actionDistribution,
            watering: actionDistribution.watering,
            weeding: actionDistribution.weeding,
            fertilizing: actionDistribution.fertilizing,
            irrigation: actionDistribution.irrigation,
            monitoring: actionDistribution.monitoring
        };
        
        res.json({
            success: true,
            report: detailedReport
        });
    } catch (error) {
        console.error('Get monthly report error:', error);
        res.status(500).json({ 
            error: 'Failed to generate report',
            message: error.message 
        });
    }
};

// Get action distribution controller
const getActionDistribution = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from authenticated request
        
        // Get real actions for this user
        const farmerActionsResult = await pool.query('SELECT * FROM actions WHERE farmer_id = $1', [userId]);
        const farmerActions = farmerActionsResult.rows;
        
        // Calculate distribution
        const distribution = {};
        farmerActions.forEach(action => {
            const actionType = action.type;
            if (!distribution[actionType]) {
                distribution[actionType] = 0;
            }
            distribution[actionType]++;
        });
        
        res.json({
            success: true,
            distribution
        });
    } catch (error) {
        console.error('Get action distribution error:', error);
        res.status(500).json({ 
            error: 'Failed to get action distribution',
            message: error.message 
        });
    }
};

// Get recommendations controller
const getRecommendations = async (req, res) => {
    try {
        // In a real implementation, this would use AI/ML to generate personalized recommendations
        // For this demo, we'll return generic recommendations based on user's actions
        
        const userId = req.userId; // Get user ID from authenticated request
        const farmerActionsResult = await pool.query('SELECT * FROM actions WHERE farmer_id = $1', [userId]);
        const farmerActions = farmerActionsResult.rows;
        
        // Generate recommendations based on actions
        const recommendations = [];
        
        // Count different action types
        const actionCounts = {};
        farmerActions.forEach(action => {
            const actionType = action.type;
            actionCounts[actionType] = (actionCounts[actionType] || 0) + 1;
        });
        
        // Generate personalized recommendations
        if (actionCounts.watering > actionCounts.weeding) {
            recommendations.push("Consider increasing weeding frequency to maintain balanced crop care.");
        }
        
        if (actionCounts.fertilizing > 0) {
            recommendations.push("Continue with your fertilizing schedule for optimal crop nutrition.");
        } else {
            recommendations.push("Consider fertilizing your crops to improve yield.");
        }
        
        if (actionCounts.monitoring > 0) {
            recommendations.push("Your monitoring activities are helping track crop health effectively.");
        } else {
            recommendations.push("Regular monitoring helps detect issues early. Consider checking your crops daily.");
        }
        
        // Generic recommendations
        recommendations.push("Stay consistent with your farming practices for best results.");
        recommendations.push("Check weather forecasts regularly to optimize your farming schedule.");
        
        res.json({
            success: true,
            recommendations
        });
    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ 
            error: 'Failed to get recommendations',
            message: error.message 
        });
    }
};

// Claim reward controller
const claimReward = (req, res) => {
    try {
        const { rewardId } = req.body;
        const userId = req.userId; // Get user ID from authenticated request
        
        // In a real implementation, this would process the reward claim
        // For this demo, we'll just return a success response
        
        // Generate a mock coupon code
        const couponCode = 'AGRO' + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        res.json({
            success: true,
            message: 'Reward claimed successfully!',
            couponCode,
            rewardDetails: {
                rewardId,
                farmerId: userId,
                claimedDate: new Date(),
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            }
        });
    } catch (error) {
        console.error('Claim reward error:', error);
        res.status(500).json({ 
            error: 'Failed to claim reward',
            message: error.message 
        });
    }
};

module.exports = {
    getMonthlyReport,
    getActionDistribution,
    getRecommendations,
    claimReward
};