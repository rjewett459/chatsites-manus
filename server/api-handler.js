// Server-side API key handling for OpenAI Realtime API
// This file would be used in a Node.js backend environment

require('dotenv').config();

const express = require('express');
const WebSocket = require('ws');
const fetch = require('node-fetch');

const router = express.Router();

// REST endpoint for text-based interactions
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Create a new realtime session
    const sessionResponse = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
        }),
      }
    );
    
    if (!sessionResponse.ok) {
      throw new Error(`API request failed with status ${sessionResponse.status}`);
    }
    
    const sessionData = await sessionResponse.json();
    const sessionId = sessionData.id;
    
    // Send message to the session
    const messageResponse = await fetch(
      `https://api.openai.com/v1/realtime/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
          role: "user",
        }),
      }
    );
    
    if (!messageResponse.ok) {
      throw new Error(`API request failed with status ${messageResponse.status}`);
    }
    
    const messageData = await messageResponse.json();
    
    // Generate speech with sage voice
    const speechResponse = await fetch(
      "https://api.openai.com/v1/audio/speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: messageData.content,
          voice: "sage", // Using the sage voice as requested
          response_format: "mp3",
        }),
      }
    );
    
    if (!speechResponse.ok) {
      throw new Error(`API request failed with status ${speechResponse.status}`);
    }
    
    res.json({ 
      success: true, 
      message: messageData.content,
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process your request' 
    });
  }
});

// WebSocket handler for real-time audio interactions
const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    let sessionId = null;
    
    ws.on('message', async (message) => {
      try {
        // Handle different message types (audio chunks, text, etc.)
        const data = JSON.parse(message);
        
        if (data.type === 'init') {
          // Initialize a new session
          const response = await fetch(
            "https://api.openai.com/v1/realtime/sessions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
              }),
            }
          );
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const sessionData = await response.json();
          sessionId = sessionData.id;
          
          ws.send(JSON.stringify({
            type: 'session',
            sessionId: sessionId
          }));
        } else if (data.type === 'audio') {
          // Process audio with OpenAI's Realtime API
          // In a real implementation, this would handle streaming audio
          
          // For now, simulate a response
          ws.send(JSON.stringify({
            type: 'transcription',
            text: 'This is a simulated transcription'
          }));
          
          // Send message to the session
          if (!sessionId) {
            // Create a session if one doesn't exist
            const response = await fetch(
              "https://api.openai.com/v1/realtime/sessions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "gpt-4o-realtime-preview-2024-12-17",
                }),
              }
            );
            
            if (!response.ok) {
              throw new Error(`API request failed with status ${response.status}`);
            }
            
            const sessionData = await response.json();
            sessionId = sessionData.id;
          }
          
          const messageResponse = await fetch(
            `https://api.openai.com/v1/realtime/sessions/${sessionId}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: 'This is a simulated transcription',
                role: "user",
              }),
            }
          );
          
          if (!messageResponse.ok) {
            throw new Error(`API request failed with status ${messageResponse.status}`);
          }
          
          const messageData = await messageResponse.json();
          
          ws.send(JSON.stringify({
            type: 'message',
            text: messageData.content
          }));
          
          // Generate speech with sage voice
          const speechResponse = await fetch(
            "https://api.openai.com/v1/audio/speech",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "tts-1",
                input: messageData.content,
                voice: "sage", // Using the sage voice as requested
                response_format: "mp3",
              }),
            }
          );
          
          if (!speechResponse.ok) {
            throw new Error(`API request failed with status ${speechResponse.status}`);
          }
          
          // In a real implementation, we would stream the audio back
          ws.send(JSON.stringify({
            type: 'audio_ready',
            message: 'Audio generated with sage voice'
          }));
        } else if (data.type === 'text') {
          // Process text message
          if (!sessionId) {
            // Create a session if one doesn't exist
            const response = await fetch(
              "https://api.openai.com/v1/realtime/sessions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "gpt-4o-realtime-preview-2024-12-17",
                }),
              }
            );
            
            if (!response.ok) {
              throw new Error(`API request failed with status ${response.status}`);
            }
            
            const sessionData = await response.json();
            sessionId = sessionData.id;
          }
          
          const messageResponse = await fetch(
            `https://api.openai.com/v1/realtime/sessions/${sessionId}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: data.text,
                role: "user",
              }),
            }
          );
          
          if (!messageResponse.ok) {
            throw new Error(`API request failed with status ${messageResponse.status}`);
          }
          
          const messageData = await messageResponse.json();
          
          ws.send(JSON.stringify({
            type: 'message',
            text: messageData.content
          }));
          
          // Generate speech with sage voice
          const speechResponse = await fetch(
            "https://api.openai.com/v1/audio/speech",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "tts-1",
                input: messageData.content,
                voice: "sage", // Using the sage voice as requested
                response_format: "mp3",
              }),
            }
          );
          
          if (!speechResponse.ok) {
            throw new Error(`API request failed with status ${speechResponse.status}`);
          }
          
          // In a real implementation, we would stream the audio back
          ws.send(JSON.stringify({
            type: 'audio_ready',
            message: 'Audio generated with sage voice'
          }));
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process your request'
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      // Clean up session if needed
    });
  });
};

module.exports = {
  router,
  setupWebSocketServer
};
