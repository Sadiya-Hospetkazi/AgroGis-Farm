const dataStorage = require('../utils/dataStorage');

const getDashboardScores = (req, res) => {
    const farmerId = parseInt(req.params.farmerId);

    const scores = dataStorage.getScoresByFarmerId(farmerId);

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

    const latest = scores[scores.length - 1];
    const cat = latest.categoryScores || {};

    res.json({
        success: true,
        scores: {
            soil: cat.soil || 0,
            irrigation: cat.irrigation || 0,
            sustainability: cat.sustainability || 0,
            weed: cat.weed || 0
        }
    });
};

module.exports = { getDashboardScores };