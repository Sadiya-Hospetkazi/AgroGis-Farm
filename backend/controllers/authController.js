const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, location, language } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const [existing] = await pool.query(
            'SELECT id FROM farmers WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Farmer already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO farmers (name, email, password, phone, location, language) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, location, language]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('REGISTER ERROR:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [result] = await pool.query(
            'SELECT * FROM farmers WHERE email = ?',
            [email]
        );

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { farmerId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token
        });
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
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
        const [result] = await pool.query('SELECT * FROM farmers WHERE id = ?', [farmerId]);
        
        if (result.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'No farmer found' 
            });
        }
        
        const farmer = result[0];
        
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