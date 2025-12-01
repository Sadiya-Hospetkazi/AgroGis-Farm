const { getCurrentWeather } = require('./weatherService');

const calculateScore = async (type, location = 'Punjab, India') => {
    // Base scores for different action types
    const base = {
        watering: 5,
        weeding: 8,
        fertilizing: 10,
        monitoring: 4,
        seeding: 7,
        soil: 6,
        irrigation: 5
    };

    // Get base score
    let score = base[type] || 5;

    try {
        // Get current weather data
        const weatherData = await getCurrentWeather(location);
        
        // Adjust score based on weather conditions
        switch (type) {
            case 'watering':
                // Adjust watering score based on rainfall
                if (weatherData.rainfall > 10) {
                    // If it's already raining heavily, watering is less valuable
                    score = Math.max(1, score - 3);
                } else if (weatherData.rainfall > 5) {
                    // If it's raining moderately, watering is somewhat less valuable
                    score = Math.max(2, score - 1);
                } else if (weatherData.humidity < 30) {
                    // If it's very dry, watering is more valuable
                    score += 2;
                }
                break;
                
            case 'weeding':
                // Adjust weeding score based on weather
                if (weatherData.humidity > 80) {
                    // High humidity makes weeding harder
                    score = Math.max(2, score - 3);
                } else if (weatherData.temperature > 35) {
                    // Very hot weather makes weeding harder
                    score = Math.max(3, score - 2);
                } else if (weatherData.temperature > 25 && weatherData.humidity < 60) {
                    // Ideal conditions for weeding
                    score += 2;
                }
                break;
                
            case 'fertilizing':
                // Adjust fertilizing score based on weather
                if (weatherData.rainfall > 5) {
                    // Rain might wash away fertilizer
                    score = Math.max(2, score - 3);
                } else if (weatherData.windSpeed > 20) {
                    // High wind might scatter fertilizer
                    score = Math.max(3, score - 2);
                } else if (weatherData.humidity < 70 && weatherData.windSpeed < 10) {
                    // Ideal conditions for fertilizing
                    score += 2;
                }
                break;
                
            case 'seeding':
                // Adjust seeding score based on weather
                if (weatherData.temperature < 10 || weatherData.temperature > 40) {
                    // Extreme temperatures are not suitable for seeding
                    score = Math.max(1, score - 4);
                } else if (weatherData.rainfall > 15) {
                    // Heavy rain might wash away seeds
                    score = Math.max(2, score - 3);
                } else if (weatherData.temperature > 15 && weatherData.temperature < 35 && 
                          weatherData.humidity > 40 && weatherData.humidity < 80) {
                    // Ideal conditions for seeding
                    score += 3;
                }
                break;
        }
        
        // Ensure score is at least 1
        return Math.max(1, Math.round(score));
    } catch (error) {
        console.error('Error calculating score with weather data:', error);
        // Return base score if weather data is unavailable
        return score;
    }
};

module.exports = { calculateScore };