import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // Store your key in .env

app.get('/api/generate-quiz', async (req, res) => {
    const prompt = `
Generate 5 general knowledge multiple-choice questions in this JSON format:
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "ans": 3
  }
]
Only return the JSON array.
`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        const data = await response.json();

        const message = data.choices?.[0]?.message?.content;

        const quiz = JSON.parse(message);
        res.json(quiz);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
