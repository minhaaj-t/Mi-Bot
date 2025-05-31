const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: 'Message is required' });

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content || '⚠️ No response received.';
    res.json({ reply });
  } catch (error) {
    console.error('Error contacting Groq:', error);
    res.status(500).json({ error: 'Failed to reach Groq API' });
  }
});

module.exports = router;
