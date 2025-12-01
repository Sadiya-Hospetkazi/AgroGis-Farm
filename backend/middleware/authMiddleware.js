// Authentication middleware for AgroGig
const jwt = require('jsonwebtoken');
const dataStorage = require('../utils/dataStorage');

const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({
            error: 'Access denied',
            message: 'No token provided'
        });
    }
    
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET || 'agrogig_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: 'Invalid token',
                message: 'Token is invalid or expired'
            });
        }
        
        // Add the farmer data to the request object
        const farmer = dataStorage.getFarmerById(decoded.farmerId);
        if (!farmer) {
            return res.status(404).json({
                error: 'Farmer not found',
                message: 'Associated farmer data not found'
            });
        }
        
        // Attach farmer data to request object
        req.farmer = farmer;
        next();
    });
};

module.exports = {
    authenticateToken
};