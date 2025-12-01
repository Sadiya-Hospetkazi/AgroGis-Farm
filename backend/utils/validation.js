// Validation utilities for AgroGig

// Validate action data
const validateAction = (actionData) => {
    try {
        // Check required fields
        if (!actionData.farmerId) {
            return 'Farmer ID is required';
        }
        
        if (!actionData.type) {
            return 'Action type is required';
        }
        
        if (!actionData.date) {
            return 'Action date is required';
        }
        
        // Validate action type
        const validActionTypes = ['watering', 'weeding', 'fertilizing', 'irrigation', 'monitoring', 'seeding'];
        if (!validActionTypes.includes(actionData.type)) {
            return `Invalid action type. Valid types are: ${validActionTypes.join(', ')}`;
        }
        
        // Validate date
        const actionDate = new Date(actionData.date);
        if (isNaN(actionDate.getTime())) {
            return 'Invalid date format';
        }
        
        // Validate field area if provided
        if (actionData.fieldArea) {
            const fieldArea = parseFloat(actionData.fieldArea);
            if (isNaN(fieldArea) || fieldArea < 0) {
                return 'Field area must be a positive number';
            }
        }
        
        // Validate crop type if provided
        if (actionData.cropType) {
            const validCropTypes = ['tomato', 'rice', 'wheat', 'corn', 'cotton', 'mixed'];
            if (!validCropTypes.includes(actionData.cropType)) {
                return `Invalid crop type. Valid types are: ${validCropTypes.join(', ')}`;
            }
        }
        
        return null; // No validation errors
    } catch (error) {
        console.error('Action validation error:', error);
        return 'Validation failed due to an unexpected error';
    }
};

// Validate farmer data
const validateFarmer = (farmerData) => {
    try {
        // Check required fields
        if (!farmerData.name) {
            return 'Name is required';
        }
        
        if (!farmerData.email) {
            return 'Email is required';
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(farmerData.email)) {
            return 'Invalid email format';
        }
        
        // Validate phone if provided
        if (farmerData.phone) {
            // Simple phone validation (adjust as needed for your region)
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(farmerData.phone.replace(/[\s\-\(\)]/g, ''))) {
                return 'Invalid phone number format';
            }
        }
        
        // Validate language if provided
        if (farmerData.language) {
            const validLanguages = ['en', 'hi', 'kn'];
            if (!validLanguages.includes(farmerData.language)) {
                return `Invalid language. Valid languages are: ${validLanguages.join(', ')}`;
            }
        }
        
        return null; // No validation errors
    } catch (error) {
        console.error('Farmer validation error:', error);
        return 'Validation failed due to an unexpected error';
    }
};

// Validate score data
const validateScore = (scoreData) => {
    try {
        // Check required fields
        if (!scoreData.actionId) {
            return 'Action ID is required';
        }
        
        if (!scoreData.farmerId) {
            return 'Farmer ID is required';
        }
        
        if (scoreData.score === undefined || scoreData.score === null) {
            return 'Score is required';
        }
        
        // Validate score is a number
        const score = parseInt(scoreData.score);
        if (isNaN(score)) {
            return 'Score must be a number';
        }
        
        // Validate score range (assuming 1-20 scale)
        if (score < 1 || score > 20) {
            return 'Score must be between 1 and 20';
        }
        
        return null; // No validation errors
    } catch (error) {
        console.error('Score validation error:', error);
        return 'Validation failed due to an unexpected error';
    }
};

module.exports = {
    validateAction,
    validateFarmer,
    validateScore
};