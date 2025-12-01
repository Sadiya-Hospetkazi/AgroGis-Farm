// Simple test to verify the setup
console.log('AgroGig Backend Test');

// Test importing modules
try {
    const express = require('express');
    const mysql = require('mysql2');
    console.log('✓ Required modules imported successfully');
} catch (error) {
    console.error('✗ Failed to import modules:', error.message);
}

// Test database configuration
try {
    const dbConfig = require('../config/db');
    console.log('✓ Database configuration loaded successfully');
} catch (error) {
    console.error('✗ Failed to load database configuration:', error.message);
}

// Test environment configuration
try {
    const envConfig = require('../config/env');
    console.log('✓ Environment configuration loaded successfully');
} catch (error) {
    console.error('✗ Failed to load environment configuration:', error.message);
}

// Test services
try {
    const weatherService = require('../services/weatherService');
    const scoringService = require('../services/scoringService');
    console.log('✓ Services loaded successfully');
} catch (error) {
    console.error('✗ Failed to load services:', error.message);
}

// Test controllers
try {
    const authController = require('../controllers/authController');
    const actionController = require('../controllers/actionController');
    console.log('✓ Controllers loaded successfully');
} catch (error) {
    console.error('✗ Failed to load controllers:', error.message);
}

console.log('Setup test completed');