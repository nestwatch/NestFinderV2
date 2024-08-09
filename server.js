import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // adjust this to match your frontend origin
  methods: 'POST',
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'No message provided' });
    }

    try {
        const response = await fetch('http://localhost:3000/realty-in-ca', { // Replace with your Grok API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: userMessage,
            }),
        });

        const grokResponse = await response.json();

        if (!response.ok) {
            console.error('Grok API error:', grokResponse);
            return res.status(500).json({ error: 'Error fetching response from Grok' });
        }

        // Extracting the response text
        const chatResponse = grokResponse.answer;

        res.json({ response: chatResponse });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});