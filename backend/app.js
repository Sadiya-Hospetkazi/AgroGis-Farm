const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve frontend files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

app.get("/dashboard-professional", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard-professional.html"));
});

app.get("/chatbot", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/chatbot.html"));
});

// Dynamic routes for the professional dashboard pages
app.get("/log-actions", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/log-actions.html"));
});

app.get("/insights", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/insights.html"));
});

app.get("/reports", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/reports.html"));
});

app.get("/language", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/language.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/profile.html"));
});

app.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/logout.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});