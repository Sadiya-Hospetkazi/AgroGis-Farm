// Chatbot routes for AgroGig
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const dataStorage = require('../utils/dataStorage');

// Mock knowledge base for farming questions
const knowledgeBase = {
    watering: [
        "Based on current weather conditions, it's recommended to water your crops in the early morning or late evening to minimize evaporation.",
        "The soil moisture level is at 45%, which is optimal for irrigation.",
        "For vegetable crops, water deeply but less frequently to encourage deep root growth.",
        "Drip irrigation is the most water-efficient method for row crops."
    ],
    fertilizing: [
        "For tomatoes, use a balanced fertilizer with equal parts nitrogen, phosphorus, and potassium (10-10-10).",
        "Apply fertilizer every 2-3 weeks during the growing season.",
        "Organic options include compost tea or fish emulsion.",
        "Side-dress nitrogen-rich fertilizers when plants are about 6 inches tall."
    ],
    pests: [
        "To prevent pest infestations: 1) Practice crop rotation, 2) Introduce beneficial insects like ladybugs, 3) Use neem oil spray, 4) Keep garden clean and debris-free, 5) Monitor plants regularly for early detection.",
        "Common crop pests include aphids, caterpillars, and beetles.",
        "Neem oil is an effective organic pesticide against many common pests.",
        "Encourage natural predators like birds and beneficial insects in your garden."
    ],
    harvesting: [
        "Wheat is typically ready to harvest when the grains are hard and golden brown, usually 110-130 days after planting.",
        "Test by biting a grain - if it's hard, it's ready. Harvest in the morning when dew has dried.",
        "For vegetables, harvest when they reach full color and size but before they become overripe.",
        "Leafy greens can be harvested multiple times by picking outer leaves."
    ],
    soil: [
        "To improve soil health: 1) Add organic matter like compost, 2) Practice cover cropping, 3) Minimize tillage, 4) Test soil pH regularly, 5) Rotate crops annually.",
        "Earthworms are a great indicator of healthy soil!",
        "The ideal soil pH for most crops is between 6.0 and 7.0.",
        "Compost adds nutrients and improves soil structure and water retention."
    ],
    weather: [
        "Tomorrow's forecast shows partly cloudy skies with a 20% chance of rain.",
        "Temperature will range between 26-30°C.",
        "It's a good day for outdoor farming activities.",
        "Protect sensitive crops if strong winds are forecasted."
    ]
};

// Chatbot endpoint - get response to a question
router.post('/ask', authenticateToken, (req, res) => {
    try {
        const { question } = req.body;
        const farmer = req.farmer;
        
        if (!question) {
            return res.status(400).json({
                error: 'Question is required',
                message: 'Please provide a question to ask the chatbot'
            });
        }
        
        // Generate response based on question content
        const response = generateResponse(question);
        
        // Log the interaction
        const interaction = {
            id: Date.now(),
            farmerId: farmer.id,
            question: question,
            response: response,
            timestamp: new Date().toISOString()
        };
        
        // In a real app, we would save this to a database
        // For now, we'll just log it to the console
        console.log('Chatbot interaction:', interaction);
        
        res.json({
            success: true,
            data: {
                question: question,
                response: response,
                interactionId: interaction.id
            }
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ 
            error: 'Chatbot failed',
            message: error.message 
        });
    }
});

// Function to generate response based on question
function generateResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Check for specific keywords in the question
    if (lowerQuestion.includes('water') || lowerQuestion.includes('irrigation')) {
        return getRandomResponse(knowledgeBase.watering);
    } else if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('fertilizing')) {
        return getRandomResponse(knowledgeBase.fertilizing);
    } else if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect') || lowerQuestion.includes('bug')) {
        return getRandomResponse(knowledgeBase.pests);
    } else if (lowerQuestion.includes('harvest') || lowerQuestion.includes('pick')) {
        return getRandomResponse(knowledgeBase.harvesting);
    } else if (lowerQuestion.includes('soil') || lowerQuestion.includes('dirt')) {
        return getRandomResponse(knowledgeBase.soil);
    } else if (lowerQuestion.includes('weather') || lowerQuestion.includes('rain') || lowerQuestion.includes('sun')) {
        return getRandomResponse(knowledgeBase.weather);
    } else {
        // Default response for unrecognized questions
        return "I understand your question about \"" + question + "\". As your AI farming assistant, I recommend monitoring your crops closely and following best practices for optimal yield. For more specific advice, please provide more details about your crops, location, and current conditions.";
    }
}

// Function to get a random response from an array
function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Chatbot endpoint - get conversation history
router.get('/history', authenticateToken, (req, res) => {
    try {
        const farmer = req.farmer;
        
        // In a real app, this would fetch from a database
        // For now, we'll return an empty array
        res.json({
            success: true,
            data: {
                history: []
            }
        });
    } catch (error) {
        console.error('Chatbot history error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch chat history',
            message: error.message 
        });
    }
});

module.exports = router;