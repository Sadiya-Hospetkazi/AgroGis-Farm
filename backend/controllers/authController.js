const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, location, language } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password required'
            });
        }

        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password, phone, location, language)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, email`,
            [name, email, hashedPassword, phone, location, language || 'en']
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'agrogig_secret_key',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        console.error('REGISTER ERROR:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'agrogig_secret_key',
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// LOGOUT
exports.logout = (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
    try {
        // Get farmer ID from the authenticated request
        const farmerId = req.farmerId;
        
        if (!farmerId) {
            return res.status(404).json({ 
                success: false,
                message: 'No farmer data available' 
            });
        }
        
        // Get farmer data from database
        const result = await pool.query('SELECT * FROM farmers WHERE id = $1', [farmerId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'No farmer found' 
            });
        }
        
        const farmer = result.rows[0];
        
        // Return farmer data excluding password
        const { password: _, ...farmerData } = farmer;
        res.json({
            success: true,
            farmer: farmerData
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};