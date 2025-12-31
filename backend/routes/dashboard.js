const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");
const router = express.Router();

router.get("/", auth, getDashboard);

module.exports = router;