// realtime-api-handler.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // If you're using Node 18+, you can omit this
require('dotenv').config();

router.get('/get-ephemeral-key', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/realtime/ephemeral_keys', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expires_in: 600 // Optional: expire after 10 minutes
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("🔴 Failed to get ephemeral key:", error);
      return res.status(500).json({ error: 'Failed to get ephemeral key' });
    }

    const data = await response.json();
    res.json({ key: data.key });
  } catch (err) {
    console.error("⚠️ Error generating ephemeral key:", err);
    res.status(500).json({ error: 'Error generating ephemeral key' });
  }
});

module.exports = router;
