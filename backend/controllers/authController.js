const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, location, language } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        // Check if user already exists
        const [existingUsers] = await pool.query('SELECT id FROM farmers WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ 
                success: false,
                message: 'User with this email already exists' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO farmers (name, email, password, phone, location, language) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, location, language || 'en']
        );

        // Get the newly created user
        const [newUserRows] = await pool.query('SELECT * FROM farmers WHERE id = ?', [result.insertId]);
        const newFarmer = newUserRows[0];

        // Generate a JWT token
        const token = jwt.sign(
            { farmerId: newFarmer.id, email: newFarmer.email },
            process.env.JWT_SECRET || 'agrogig_secret_key',
            { expiresIn: '24h' }
        );

        // Return success response (excluding password)
        const { password: _, ...farmerData } = newFarmer;
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            farmer: farmerData
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [result] = await pool.query(
            'SELECT * FROM farmers WHERE email = ?',
            [email]
        );

        if (result.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = result[0];
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
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

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
        const [rows] = await pool.query('SELECT * FROM farmers WHERE id = ?', [farmerId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'No farmer found' 
            });
        }
        
        const farmer = rows[0];
        
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