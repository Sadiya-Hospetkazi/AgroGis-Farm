// Main Express server for AgroGig
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const authRoutes = require('./routes/auth');
const actionsRoutes = require('./routes/actions');
const scoresRoutes = require('./routes/scores');
const reportsRoutes = require('./routes/reports');
const monthlyReportsRoutes = require('./routes/monthlyReports');
const protectedRoutes = require('./routes/protected');
const chatbotRoutes = require('./routes/chatbot');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/actions', actionsRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/monthly-reports', monthlyReportsRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/dashboard-professional', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard-professional.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/chatbot.html'));
});

// Dynamic routes for the professional dashboard pages
app.get('/log-actions', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/log-actions.html'));
});

app.get('/insights', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/insights.html'));
});

app.get('/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/reports.html'));
});

app.get('/language', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/language.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/profile.html'));
});

app.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/logout.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`AgroGig server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
});

module.exports = app;