// Test login functionality
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataStorage = require('./backend/utils/dataStorage');

console.log('Testing login functionality...');

// Get all farmers
const farmers = dataStorage.getFarmers();
console.log('Farmers in database:', farmers.length);

// Test farmer
const testFarmer = farmers[0];
console.log('Test farmer:', testFarmer);

// Test password validation
if (testFarmer) {
    console.log('Testing password validation...');
    const isPasswordValid = bcrypt.compareSync('password123', testFarmer.password);
    console.log('Password valid:', isPasswordValid);
    
    // Test JWT token generation
    if (isPasswordValid) {
        console.log('Testing JWT token generation...');
        const token = jwt.sign(
            { farmerId: testFarmer.id, email: testFarmer.email },
            'agrogig_secret_key',
            { expiresIn: '24h' }
        );
        console.log('Token generated successfully');
        console.log('Token:', token);
    }
}