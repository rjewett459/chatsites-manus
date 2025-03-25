// AI Assistant Interface for ChatSites Portal
// This file integrates the OpenAI Realtime WebRTC API with the ChatSites Portal UI

// Global variables
let currentState = 'idle';
let transcriptText = '';
let responseText = '';
let ephemeralKey = null;
let ephemeralKeyExpiry = null;

// DOM elements
let assistantContainer;
let orb;
let messageContainer;
let inputField;
let micButton;
let sendButton;
let statusIndicator;

// Initialize the AI Assistant
function initializeAssistant() {
  // Get DOM elements
  assistantContainer = document.getElementById('ai-assistant');
  orb = document.getElementById('ai-orb');
  messageContainer = document.getElementById('message-container');
  inputField = document.getElementById('user-input');
  micButton = document.getElementById('mic-button');
  sendButton = document.getElementById('send-button');
  statusIndicator = document.getElementById('status-indicator');
  
  // Add event listeners
  micButton.addEventListener('click', toggleVoiceInput);
  sendButton.addEventListener('click', sendTextMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendTextMessage();
    }
  });
  
  // Initialize the pulsating orb animation
  initializeOrb();
  
  // Get ephemeral key from server
  getEphemeralKey()
    .then(() => {
      // Initialize OpenAI Realtime API with WebRTC
      return window.openAIRealtimeAPI.initialize(
        ephemeralKey,
        updateStatus,
        updateTranscript,
        handleResponse
      );
    })
    .then(success => {
      if (success) {
        updateStatus('ready');
        displayWelcomeMessage();
      } else {
        updateStatus('error', 'Failed to initialize AI Assistant');
      }
    })
    .catch(error => {
      console.error('Error initializing AI Assistant:', error);
      updateStatus('error', error.message);
    });
}

// Initialize the pulsating orb animation
function initializeOrb() {
  // Set initial state
  updateOrbState('idle');
}

// Update the orb state based on the assistant's state
function updateOrbState(state) {
  // Remove all state classes
  orb.classList.remove('idle', 'listening', 'processing', 'speaking', 'error');
  
  // Add the current state class
  orb.classList.add(state);
  
  // Update animation based on state
  switch (state) {
    case 'idle':
      orb.style.animation = 'pulse 2s infinite ease-in-out';
      break;
    case 'listening':
      orb.style.animation = 'pulse 1s infinite ease-in-out';
      break;
    case 'processing':
      orb.style.animation = 'pulse 0.5s infinite ease-in-out';
      break;
    case 'speaking':
      orb.style.animation = 'pulse 1.5s infinite ease-in-out';
      break;
    case 'error':
      orb.style.animation = 'shake 0.5s';
      break;
  }
}

// Get ephemeral key from server
async function getEphemeralKey() {
  try {
    // Check if we have a valid ephemeral key
    const now = Math.floor(Date.now() / 1000);
    if (ephemeralKey && ephemeralKeyExpiry && ephemeralKeyExpiry > now + 60) {
      // Key is still valid (with 1 minute buffer)
      return;
    }
    
    // Request a new ephemeral key from the server
    const response = await fetch('/api/ephemeral-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get ephemeral key: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error getting ephemeral key');
    }
    
    ephemeralKey = data.ephemeralKey;
    ephemeralKeyExpiry = data.expiresAt;
    
    console.log('Got ephemeral key, expires at:', new Date(ephemeralKeyExpiry * 1000));
  } catch (error) {
    console.error('Error getting ephemeral key:', error);
    throw error;
  }
}

// Toggle voice input
function toggleVoiceInput() {
  if (currentState === 'listening') {
    // Stop listening
    window.openAIRealtimeAPI.stopListening();
    updateStatus('processing');
  } else if (currentState === 'ready' || currentState === 'idle') {
    // Start listening
    window.openAIRealtimeAPI.startListening()
      .then(success => {
        if (success) {
          updateStatus('listening');
          // Clear previous transcript
          transcriptText = '';
        } else {
          updateStatus('error', 'Failed to start listening');
        }
      })
      .catch(error => {
        console.error('Error starting voice input:', error);
        updateStatus('error', error.message);
      });
  }
}

// Send text message
function sendTextMessage() {
  const text = inputField.value.trim();
  
  if (!text) {
    return;
  }
  
  // Display user message
  displayMessage('user', text);
  
  // Clear input field
  inputField.value = '';
  
  // Send message to OpenAI
  updateStatus('processing');
  window.openAIRealtimeAPI.sendTextMessage(text)
    .then(success => {
      if (!success) {
        updateStatus('error', 'Failed to send message');
      }
    })
    .catch(error => {
      console.error('Error sending text message:', error);
      updateStatus('error', error.message);
    });
}

// Update status
function updateStatus(state, errorMessage) {
  currentState = state;
  
  // Update orb state
  updateOrbState(state);
  
  // Update status indicator
  switch (state) {
    case 'idle':
      statusIndicator.textContent = 'Idle';
      break;
    case 'ready':
      statusIndicator.textContent = 'Ready';
      break;
    case 'listening':
      statusIndicator.textContent = 'Listening...';
      break;
    case 'processing':
      statusIndicator.textContent = 'Processing...';
      break;
    case 'speaking':
      statusIndicator.textContent = 'Speaking...';
      break;
    case 'error':
      statusIndicator.textContent = `Error: ${errorMessage || 'Unknown error'}`;
      break;
    case 'connected':
      statusIndicator.textContent = 'Connected';
      break;
    case 'disconnected':
      statusIndicator.textContent = 'Disconnected';
      break;
    case 'closed':
      statusIndicator.textContent = 'Connection closed';
      break;
  }
}

// Update transcript
function updateTranscript(text) {
  transcriptText += text;
  
  // Display transcript as user message if not already displayed
  if (currentState === 'listening' || currentState === 'processing') {
    // Update existing message or create new one
    const lastMessage = messageContainer.lastElementChild;
    if (lastMessage && lastMessage.classList.contains('user-message')) {
      const messageText = lastMessage.querySelector('.message-text');
      messageText.textContent = transcriptText;
    } else {
      displayMessage('user', transcriptText);
    }
  }
}

// Handle response
function handleResponse(text) {
  responseText = text;
  
  // Display assistant message
  displayMessage('assistant', responseText);
  
  // Reset for next interaction
  transcriptText = '';
  responseText = '';
}

// Display message
function displayMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);
  
  const avatarElement = document.createElement('div');
  avatarElement.classList.add('avatar');
  
  if (sender === 'assistant') {
    avatarElement.innerHTML = '<i class="fas fa-robot"></i>';
  } else {
    avatarElement.innerHTML = '<i class="fas fa-user"></i>';
  }
  
  const messageTextElement = document.createElement('div');
  messageTextElement.classList.add('message-text');
  messageTextElement.textContent = text;
  
  messageElement.appendChild(avatarElement);
  messageElement.appendChild(messageTextElement);
  
  messageContainer.appendChild(messageElement);
  
  // Scroll to bottom
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Display welcome message
function displayWelcomeMessage() {
  const welcomeMessage = "Hello! I'm your ChatSites AI assistant. I can help answer questions, show dynamic content, and assist with various tasks. Try asking me something or click the microphone to speak.";
  displayMessage('assistant', welcomeMessage);
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAssistant);

// Export functions for external use
window.aiAssistant = {
  initialize: initializeAssistant,
  toggleVoiceInput: toggleVoiceInput,
  sendTextMessage: sendTextMessage
};
