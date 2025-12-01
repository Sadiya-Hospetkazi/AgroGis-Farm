// Weather service for AgroGig
// This service integrates with a real weather API
const { config } = require('../config/env');
// fetch is built-in in Node 18+, so no need to require it

// Mock weather data for demonstration when API key is not available
const mockWeatherData = {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    pressure: 1013
};

// Get current weather for a location
const getCurrentWeather = async (location) {
    try {
        // Check if API key is available
        if (!config.OPENWEATHER_API_KEY) {
            console.log('No API key found, using mock weather data');
            return mockWeatherData;
        }
        
        // Call OpenWeatherMap API
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.OPENWEATHER_API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API response to our format
        return {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            rainfall: data.rain ? data.rain['1h'] || 0 : 0,
            condition: data.weather[0].main,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure
        };
    } catch (error) {
        console.error('Weather service error:', error);
        // Fallback to mock data if API fails
        return mockWeatherData;
    }
};

// Get weather forecast
const getWeatherForecast = async (location, days = 5) {
    try {
        // In a real implementation, this would call a weather forecast API
        // For this demo, we'll return mock forecast data
        const forecast = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            forecast.push({
                date: date.toISOString().split('T')[0],
                temperature: mockWeatherData.temperature + Math.floor(Math.random() * 10) - 5,
                humidity: mockWeatherData.humidity + Math.floor(Math.random() * 20) - 10,
                condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)]
            });
        }
        
        return forecast;
    } catch (error) {
        console.error('Weather forecast error:', error);
        throw new Error('Failed to fetch weather forecast');
    }
};

// Check if weather conditions are suitable for an action
const isWeatherSuitable = (actionType, weatherData) {
    try {
        // Simple rules for weather suitability
        switch (actionType) {
            case 'watering':
                // Not suitable if it's raining heavily
                return weatherData.rainfall < 10;
            case 'weeding':
                // Best done in dry conditions
                return weatherData.humidity < 80;
            case 'fertilizing':
                // Not suitable if rain is expected (would wash away fertilizer)
                return weatherData.rainfall < 5;
            case 'seeding':
                // Best done in moderate conditions
                return weatherData.temperature > 15 && weatherData.temperature < 35;
            default:
                // For other actions, weather is generally not a limiting factor
                return true;
        }
    } catch (error) {
        console.error('Weather suitability check error:', error);
        // If we can't determine suitability, assume it's okay
        return true;
    }
};

module.exports = {
    getCurrentWeather,
    getWeatherForecast,
    isWeatherSuitable
};