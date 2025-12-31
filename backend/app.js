// Load environment variables first
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve frontend files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});