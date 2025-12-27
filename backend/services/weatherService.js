// backend/services/weatherService.js

const fetch = require('node-fetch');

const mockWeatherData = {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    pressure: 1013
};

const getCurrentWeather = async (location) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            console.log("OPENWEATHER_API_KEY not found, using mock data");
            return mockWeatherData;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API failed: ${response.status}`);
        }

        const data = await response.json();

        return {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            rainfall: data.rain ? data.rain['1h'] || 0 : 0,
            condition: data.weather[0].main,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure
        };
    } catch (error) {
        console.error("Weather service error:", error.message);
        return mockWeatherData;
    }
};

module.exports = { getCurrentWeather };