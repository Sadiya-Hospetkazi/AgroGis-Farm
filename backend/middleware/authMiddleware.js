// Authentication middleware for AgroGig
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authenticateToken = async (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({
            error: 'Access denied',
            message: 'No token provided'
        });
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agrogig_secret_key');
        
        // Add the farmer data to the request object
        const result = await pool.query('SELECT * FROM farmers WHERE id = $1', [decoded.farmerId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Farmer not found',
                message: 'Associated farmer data not found'
            });
        }
        
        // Attach farmer data to request object
        req.farmer = result.rows[0];
        req.farmerId = decoded.farmerId;
        next();
    } catch (err) {
        return res.status(403).json({
            error: 'Invalid token',
            message: 'Token is invalid or expired'
        });
    }
};

module.exports = {
    authenticateToken
};