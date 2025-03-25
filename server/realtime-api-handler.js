// Server-side API handler for OpenAI Realtime API
// This file handles secure API key storage and ephemeral key generation

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Endpoint to generate an ephemeral key for client-side WebRTC connection
router.post('/ephemeral-key', async (req, res) => {
  try {
    // Get the OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured'
      });
    }
    
    // Create a session with OpenAI to get an ephemeral key
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        voice: "sage"
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating OpenAI session:', errorText);
      return res.status(response.status).json({
        success: false,
        error: `Failed to create OpenAI session: ${response.status} ${response.statusText}`
      });
    }
    
    const data = await response.json();
    
    // Return only the ephemeral key to the client
    // This keeps the OpenAI API key secure on the server
    res.json({
      success: true,
      ephemeralKey: data.client_secret.value,
      expiresAt: data.client_secret.expires_at
    });
  } catch (error) {
    console.error('Error generating ephemeral key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate ephemeral key'
    });
  }
});

module.exports = router;
