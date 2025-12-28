const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/scores", auth, (req, res) => {
  res.json({
    score: 42,
    user: req.user
  });
});

module.exports = router;