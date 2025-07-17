import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('✅ Radiospeak backend is running');
});

app.post('/api/generate', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'Invalid message input' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: `Rewrite this for professional event radio: "${userMessage}"` }],
        temperature: 0.6
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    if (!message) throw new Error("Invalid OpenAI response");

    res.json({ reply: message });

  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ error: 'Error generating message' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Radiospeak backend running on port ${PORT}`);
});

