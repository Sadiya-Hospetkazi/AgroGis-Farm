const express = require("express");
const auth = require("../middleware/authMiddleware");
const pool = require("../config/db");
const router = express.Router();

router.get("/scores", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
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
    
    res.json({
      success: true,
      userId: userId,
      totalScore: totalScore,
      scoreTotals: scoreTotals,
      scores: scores
    });
  } catch (err) {
    console.error('Scores endpoint error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch scores',
      error: err.message
    });
  }
});

module.exports = router;