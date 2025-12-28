const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
  // TEMPORARY STATIC LOGIN (to prove auth works)
  const token = jwt.sign(
    { id: 1, email: "test@agrogig.com" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

module.exports = router;