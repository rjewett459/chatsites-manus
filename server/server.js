// Server-side Express.js server for ChatSites Portal
// This file sets up the server to handle API requests and serve static files

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import API handlers
const realtimeApiHandler = require('./realtime-api-handler');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'application/sdp' }));
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api', realtimeApiHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
