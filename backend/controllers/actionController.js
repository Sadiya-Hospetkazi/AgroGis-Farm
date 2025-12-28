const pool = require('../config/db');
const { calculateScore } = require('../services/scoringService');

const logAction = async (req, res) => {
    try {
        console.log("Received body:", req.body);
        const { type, description, cropType } = req.body;
        const userId = req.userId; // Get user ID from authenticated request

        if (!userId || !type) {
            return res.status(400).json({
                success: false,
                message: "User authentication required and type is required"
            });
        }

        // Insert the action into the database
        const result = await pool.query(
            'INSERT INTO actions (farmer_id, type, description, crop_type) VALUES ($1, $2, $3, $4) RETURNING id',
            [userId, type, description || "", cropType || ""]
        );
        
        const newAction = {
            id: result.rows[0].id,
            farmerId: userId,
            actionType: type,
            description: description || "",
            cropType: cropType || "",
            timestamp: new Date().toISOString()
        };

        // Get user's location for weather-based scoring
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows.length > 0 ? userResult.rows[0] : null;
        const location = user && user.location ? user.location : 'Punjab, India';

        console.log("Score calculation started:", type);
        // Calculate score using the scoring service (with weather adjustments)
        const calculatedScore = await calculateScore(type, location);
        
        // Determine category based on action type
        let category = "";
        
        // Normalize action type to lowercase for consistent comparison
        const normalizedType = type.toLowerCase();
        
        // Map action type to category
        if (normalizedType === "watering") {
            category = "water";
        } else if (normalizedType === "fertilizing") {
            category = "fertilizer";
        } else if (normalizedType === "weeding") {
            category = "weed";
        } else if (normalizedType === "monitoring") {
            category = "monitoring";
        } else if (normalizedType === "irrigation") {
            category = "irrigation";
        } else if (normalizedType === "soil") {
            category = "soil";
        }
        
        // Use the calculated score instead of hardcoded values
        const scoreValue = calculatedScore;
        
        // Insert the score into the database
        const scoreResult = await pool.query(
            'INSERT INTO scores (action_id, farmer_id, score, category, action_type) VALUES ($1, $2, $3, $4, $5)',
            [newAction.id, userId, scoreValue, category, normalizedType]
        );
        
        // Calculate total score for this user
        const totalScoreResult = await pool.query(
            'SELECT SUM(score) as total_score, COUNT(*) as action_count FROM scores WHERE farmer_id = $1',
            [userId]
        );
        
        const totalScore = totalScoreResult.rows[0].total_score || 0;
        const actionCount = totalScoreResult.rows[0].action_count || 0;
        
        updatedScore = {
            farmerId: userId,
            totalPoints: totalScore,
            actionsCount: actionCount,
            lastUpdated: new Date().toISOString()
        };

        console.log("Saving score:", updatedScore);

        res.json({
            success: true,
            action: newAction,
            score: updatedScore
        });

    } catch (error) {
        console.error("LOG ACTION ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to log action",
            error: error.message
        });
    }
};

const getFarmerActions = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from authenticated request
        const actions = await pool.query('SELECT * FROM actions WHERE farmer_id = $1', [userId]);
        res.json({ success: true, actions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    logAction,
    getFarmerActions
};