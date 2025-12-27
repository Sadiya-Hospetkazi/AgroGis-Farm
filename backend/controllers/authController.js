// Authentication controller for AgroGig
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dataStorage = require('../utils/dataStorage');

// Get all farmers
const mockFarmers = dataStorage.getFarmers();

// If no farmers exist, create sample data
if (mockFarmers.length === 0) {
    // Hash the passwords
    const saltRounds = 10;
    const rajeshPassword = bcrypt.hashSync('password123', saltRounds);
    const priyaPassword = bcrypt.hashSync('password123', saltRounds);
    
    const sampleFarmers = [
        {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            password: rajeshPassword,
            phone: '+919876543210',
            language: 'en',
            location: 'Punjab, India'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            email: 'priya@example.com',
            password: priyaPassword,
            phone: '+919876543211',
            language: 'hi',
            location: 'Uttar Pradesh, India'
        }
    ];
    
    sampleFarmers.forEach(farmer => {
        dataStorage.addFarmer(farmer);
    });
}

// Login controller
const login = (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find the farmer by email
        const farmer = dataStorage.getFarmerByEmail(email);
        
        if (!farmer) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'No farmer found with this email' 
            });
        }
        
        // Validate password
        const isPasswordValid = bcrypt.compareSync(password, farmer.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Incorrect password'
            });
        }
        
        // Generate a JWT token
        const token = jwt.sign(
            { farmerId: farmer.id, email: farmer.email },
            process.env.JWT_SECRET || 'agrogig_secret_key',
            { expiresIn: '24h' }
        );
        
        // Return success response with token and farmer data (excluding password)
        const { password: _, ...farmerData } = farmer;
        res.json({
            success: true,
            token,
            farmer: farmerData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed',
            message: error.message 
        });
    }
};

// Register controller
const register = (req, res) => {
    try {
        console.log("REGISTER BODY:", req.body);
        
        const { name, email, password, phone, location, language } = req.body;
        
        // Check if farmer already exists
        const existingFarmer = dataStorage.getFarmerByEmail(email);
        if (existingFarmer) {
            return res.status(409).json({ 
                error: 'Farmer already exists',
                message: 'A farmer with this email already exists' 
            });
        }
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        
        // Get the next farmer ID
        const farmers = dataStorage.getFarmers();
        const nextId = farmers.length > 0 ? Math.max(...farmers.map(f => f.id)) + 1 : 1;
        
        // Create new farmer
        const newFarmer = {
            id: nextId,
            name,
            email,
            password: hashedPassword,
            phone,
            language: language || 'en',
            location: location || 'Not specified'
        };
        
        // Save farmer to data storage
        const success = dataStorage.addFarmer(newFarmer);
        if (!success) {
            return res.status(500).json({
                error: 'Registration failed',
                message: 'Failed to save farmer data'
            });
        }
        
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
            message: 'Farmer registered successfully',
            token,
            farmer: farmerData
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Logout controller
const logout = (req, res) => {
    try {
        // In a real app, we would invalidate the token
        // For this demo, we'll just send a success response
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            error: 'Logout failed',
            message: error.message 
        });
    }
};

// Get current user controller
const getCurrentUser = (req, res) => {
    try {
        // Get farmer data from the authenticated request
        const farmer = req.farmer;
        
        if (!farmer) {
            return res.status(404).json({ 
                error: 'Farmer not found',
                message: 'No farmer data available' 
            });
        }
        
        // Return farmer data excluding password
        const { password: _, ...farmerData } = farmer;
        res.json({
            success: true,
            farmer: farmerData
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ 
            error: 'Failed to get user data',
            message: error.message 
        });
    }
};

module.exports = {
    login,
    register,
    logout,
    getCurrentUser
};