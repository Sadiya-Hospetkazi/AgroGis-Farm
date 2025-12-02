// Environment configuration for AgroGig
// This file manages environment variables and configuration

// Load environment variables from .env file
require('dotenv').config();

// Environment configuration
const envConfig = {
    // Server configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3001,
    
    // Database configuration
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'agrogig',
    
    // JWT configuration
    JWT_SECRET: process.env.JWT_SECRET || 'agrogig_secret_key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    
    // ChromaDB configuration
    CHROMA_HOST: process.env.CHROMA_HOST || 'localhost',
    CHROMA_PORT: process.env.CHROMA_PORT || 8000,
    CHROMA_PATH: process.env.CHROMA_PATH || './database/chroma',
    
    // API Keys
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
    
    // Application settings
    APP_NAME: process.env.APP_NAME || 'AgroGig',
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    
    // Feature flags
    ENABLE_AI_RECOMMENDATIONS: process.env.ENABLE_AI_RECOMMENDATIONS === 'true' || true,
    ENABLE_VOICE_RECOGNITION: process.env.ENABLE_VOICE_RECOGNITION === 'true' || true,
    ENABLE_MULTILINGUAL: process.env.ENABLE_MULTILINGUAL === 'true' || true
};

// Validate required environment variables
const validateEnv = () => {
    const requiredVars = [];
    const missingVars = [];
    
    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });
    
    if (missingVars.length > 0) {
        console.warn('Missing required environment variables:', missingVars);
        return false;
    }
    
    return true;
};

// Get configuration for a specific environment
const getConfigForEnvironment = (environment) => {
    const configs = {
        development: {
            debug: true,
            logging: true
        },
        production: {
            debug: false,
            logging: false
        },
        test: {
            debug: true,
            logging: true
        }
    };
    
    return configs[environment] || configs.development;
};

// Log current configuration (without sensitive data)
const logConfig = () => {
    console.log('Application Configuration:');
    console.log('- Environment:', envConfig.NODE_ENV);
    console.log('- Port:', envConfig.PORT);
    console.log('- Database Host:', envConfig.DB_HOST);
    console.log('- Database Name:', envConfig.DB_NAME);
    console.log('- ChromaDB Host:', envConfig.CHROMA_HOST);
    console.log('- ChromaDB Port:', envConfig.CHROMA_PORT);
    console.log('- App Name:', envConfig.APP_NAME);
    console.log('- App Version:', envConfig.APP_VERSION);
};

module.exports = {
    config: envConfig,
    validateEnv,
    getConfigForEnvironment,
    logConfig
};