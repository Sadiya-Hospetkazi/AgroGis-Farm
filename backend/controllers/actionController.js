const pool = require('../config/db');
const { calculateScore } = require('../services/scoringService');

const logAction = async (req, res) => {
    try {
        console.log("Received body:", req.body);
        const { farmerId, type, description, cropType } = req.body;

        if (!farmerId || !type) {
            return res.status(400).json({
                success: false,
                message: "farmerId and type are required"
            });
        }

        // Insert the action into the database
        const result = await pool.query(
            'INSERT INTO actions (farmer_id, type, description, crop_type) VALUES (?, ?, ?, ?)',
            [parseInt(farmerId), type, description || "", cropType || ""]
        );
        
        const newAction = {
            id: result.insertId,
            farmerId: parseInt(farmerId),
            actionType: type,
            description: description || "",
            cropType: cropType || "",
            timestamp: new Date().toISOString()
        };

        // Get farmer's location for weather-based scoring
        const [farmerResult] = await pool.query('SELECT * FROM farmers WHERE id = ?', [parseInt(farmerId)]);
        const farmer = farmerResult.length > 0 ? farmerResult[0] : null;
        const location = farmer && farmer.location ? farmer.location : 'Punjab, India';

        console.log("Score calculation started:", type);
        const scorePoints = await calculateScore(type, location);

        // Get existing scores for this farmer
        const [existingScores] = await pool.query('SELECT * FROM scores WHERE farmer_id = ?', [parseInt(farmerId)]);
        
        // Calculate score based on action type
        let scoreValue = 0;
        let category = "";
        
        // Normalize action type to lowercase for consistent comparison
        const normalizedType = type.toLowerCase();
        
        // Use exact matching instead of includes to prevent incorrect mappings
        if (normalizedType === "watering") {
            scoreValue = 5;
            category = "water";
        } else if (normalizedType === "fertilizing") {
            scoreValue = 10;
            category = "fertilizer";
        } else if (normalizedType === "weeding") {
            scoreValue = 8;
            category = "weed";
        } else if (normalizedType === "monitoring") {
            scoreValue = 4;
            category = "monitoring";
        } else if (normalizedType === "irrigation") {
            scoreValue = 5;
            category = "irrigation";
        } else if (normalizedType === "soil") {
            scoreValue = 6;
            category = "soil";
        }
        
        // Insert the score into the database
        const scoreResult = await pool.query(
            'INSERT INTO scores (action_id, farmer_id, score, category) VALUES (?, ?, ?, ?)',
            [newAction.id, parseInt(farmerId), scoreValue, category]
        );
        
        // Calculate total score for this farmer
        const [totalScoreResult] = await pool.query(
            'SELECT SUM(score) as total_score, COUNT(*) as action_count FROM scores WHERE farmer_id = ?',
            [parseInt(farmerId)]
        );
        
        const totalScore = totalScoreResult[0].total_score || 0;
        const actionCount = totalScoreResult[0].action_count || 0;
        
        updatedScore = {
            farmerId: parseInt(farmerId),
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
        const farmerId = parseInt(req.params.farmerId);
        const [actions] = await pool.query('SELECT * FROM actions WHERE farmer_id = ?', [farmerId]);
        res.json({ success: true, actions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    logAction,
    getFarmerActions
};