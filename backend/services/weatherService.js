// backend/services/weatherService.js

// No need to import fetch — Node 18 has fetch built-in

async function getCurrentWeather(location) {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            throw new Error("Missing OPENWEATHER_API_KEY");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Weather Service Error:", error);
        return null;
    }
}

module.exports = { getCurrentWeather };