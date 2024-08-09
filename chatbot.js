const axios = require('axios');

const API_KEY = 'YOUR_API_KEY'; // Replace with your API key
const API_URL = 'https://api.gemini.ai/chat'; // Replace with the correct endpoint

async function getChatResponse(userMessage) {
    try {
        const response = await axios.post(API_URL, {
            message: userMessage
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching response from Gemini AI:', error);
        return { message: 'Sorry, I am having trouble understanding you.' };
    }
}

module.exports = getChatResponse;
