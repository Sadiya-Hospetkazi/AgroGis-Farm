const dataStorage = require('../utils/dataStorage');
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

        const newAction = {
            id: Date.now(),
            farmerId: parseInt(farmerId),
            actionType: type,
            description: description || "",
            cropType: cropType || "",
            timestamp: new Date().toISOString()
        };

        dataStorage.addAction(newAction);

        // Get farmer's location for weather-based scoring
        const farmer = dataStorage.getFarmerById(parseInt(farmerId));
        const location = farmer && farmer.location ? farmer.location : 'Punjab, India';

        console.log("Score calculation started:", type);
        const scorePoints = await calculateScore(type, location);

        // Get existing scores for this farmer
        const existingScores = dataStorage.getScoresByFarmerId(parseInt(farmerId));
        
        let updatedScore;
        
        if (existingScores.length > 0) {
            // Update existing score entry
            const latestScore = existingScores[existingScores.length - 1];
            let updatedTotalPoints = latestScore.totalPoints || 0;
            const updatedActionsCount = (latestScore.actionsCount || 0) + 1;
            
            // Update category-specific scores based on action type
            const updatedCategoryScores = latestScore.categoryScores || {};
            
            // Update individual category scores and total points
            // Normalize action type to lowercase for consistent comparison
            const normalizedType = type.toLowerCase();
            
            // Use exact matching instead of includes to prevent incorrect mappings
            if (normalizedType === "watering") {
                updatedCategoryScores.irrigation = (updatedCategoryScores.irrigation || 0) + 5;
                updatedTotalPoints += 5;
            } else if (normalizedType === "fertilizing") {
                updatedCategoryScores.soil = (updatedCategoryScores.soil || 0) + 10;
                updatedTotalPoints += 10;
            } else if (normalizedType === "weeding") {
                updatedCategoryScores.weed = (updatedCategoryScores.weed || 0) + 8;
                updatedTotalPoints += 8;
            } else if (normalizedType === "monitoring") {
                updatedCategoryScores.sustainability = (updatedCategoryScores.sustainability || 0) + 4;
                updatedTotalPoints += 4;
            } else if (normalizedType === "irrigation") {
                updatedCategoryScores.irrigation = (updatedCategoryScores.irrigation || 0) + 5;
                updatedTotalPoints += 5;
            } else if (normalizedType === "soil") {
                updatedCategoryScores.soil = (updatedCategoryScores.soil || 0) + 6;
                updatedTotalPoints += 6;
            }
            
            updatedScore = {
                id: latestScore.id,
                farmerId: parseInt(farmerId),
                totalPoints: updatedTotalPoints,
                actionsCount: updatedActionsCount,
                categoryScores: updatedCategoryScores,
                lastUpdated: new Date().toISOString()
            };
            
            dataStorage.updateScore(updatedScore);
        } else {
            // Create new score entry
            const categoryScores = {};
            let initialTotalPoints = 0;
            
            // Set initial category scores based on first action
            // Normalize action type to lowercase for consistent comparison
            const normalizedType = type.toLowerCase();
            
            // Use exact matching instead of includes to prevent incorrect mappings
            if (normalizedType === "watering") {
                categoryScores.irrigation = 5;
                initialTotalPoints = 5;
            } else if (normalizedType === "fertilizing") {
                categoryScores.soil = 10;
                initialTotalPoints = 10;
            } else if (normalizedType === "weeding") {
                categoryScores.weed = 8;
                initialTotalPoints = 8;
            } else if (normalizedType === "monitoring") {
                categoryScores.sustainability = 4;
                initialTotalPoints = 4;
            } else if (normalizedType === "irrigation") {
                categoryScores.irrigation = 5;
                initialTotalPoints = 5;
            } else if (normalizedType === "soil") {
                categoryScores.soil = 6;
                initialTotalPoints = 6;
            }
            
            updatedScore = {
                id: Date.now() + 5,
                farmerId: parseInt(farmerId),
                totalPoints: initialTotalPoints,
                actionsCount: 1,
                categoryScores: categoryScores,
                lastUpdated: new Date().toISOString()
            };
            
            dataStorage.addScore(updatedScore);
        }

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

const getFarmerActions = (req, res) => {
    try {
        const farmerId = parseInt(req.params.farmerId);
        const actions = dataStorage.getActionsByFarmerId(farmerId);
        res.json({ success: true, actions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    logAction,
    getFarmerActions
};