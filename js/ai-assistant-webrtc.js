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
  console.log('✅ initializeAssistant called');

  // Get DOM elements
  assistantContainer = document.getElementById('ai-assistant');
  orb = document.getElementById('ai-orb');
  messageContainer = document.getElementById('message-container');
  inputField = document.getElementById('user-input');
  micButton = document.getElementById('mic-button');
  sendButton = document.getElementById('send-button');
  statusIndicator = document.getElementById('status-indicator');

  // ✅ Add event listeners only if the elements exist
  if (micButton) micButton.addEventListener('click', toggleVoiceInput);
  if (sendButton) sendButton.addEventListener('click', sendTextMessage);
  if (inputField) {
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendTextMessage();
      }
    });
  }

  // Initialize the pulsating orb animation
  initializeOrb();

  // Get ephemeral key and initialize OpenAI Realtime API
  getEphemeralKey()
    .then(() => {
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
  updateOrbState('idle');
}

// Update the orb state
function updateOrbState(state) {
  orb?.classList.remove('idle', 'listening', 'processing', 'speaking', 'error');
  orb?.classList.add(state);

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

// Get ephemeral key from the server
async function getEphemeralKey() {
  try {
    const now = Math.floor(Date.now() / 1000);
    if (ephemeralKey && ephemeralKeyExpiry && ephemeralKeyExpiry > now + 60) {
      return;
    }

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

    console.log('🔐 Got ephemeral key, expires at:', new Date(ephemeralKeyExpiry * 1000));
  } catch (error) {
    console.error('❌ Error getting ephemeral key:', error);
    throw error;
  }
}

// Toggle voice input
function toggleVoiceInput() {
  console.log('🎙️ toggleVoiceInput called');

  if (currentState === 'listening') {
    window.openAIRealtimeAPI.stopListening();
    updateStatus('processing');
  } else if (currentState === 'ready' || currentState === 'idle') {
    window.openAIRealtimeAPI.startListening()
      .then(success => {
        if (success) {
          updateStatus('listening');
          transcriptText = '';
        } else {
          updateStatus('error', 'Failed to start listening');
        }
      })
      .catch(error => {
        console.error('❌ Error starting voice input:', error);
        updateStatus('error', error.message);
      });
  }
}

// Send text message
function sendTextMessage() {
  const text = inputField?.value.trim();
  if (!text) return;

  displayMessage('user', text);
  inputField.value = '';
  updateStatus('processing');

  window.openAIRealtimeAPI.sendTextMessage(text)
    .then(success => {
      if (!success) {
        updateStatus('error', 'Failed to send message');
      }
    })
    .catch(error => {
      console.error('❌ Error sending text message:', error);
      updateStatus('error', error.message);
    });
}

// Update status
function updateStatus(state, errorMessage) {
  currentState = state;
  updateOrbState(state);

  if (!statusIndicator) return;

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

  if (!messageContainer) return;

  const lastMessage = messageContainer.lastElementChild;
  if (lastMessage && lastMessage.classList.contains('user-message')) {
    const messageText = lastMessage.querySelector('.message-text');
    messageText.textContent = transcriptText;
  } else {
    displayMessage('user', transcriptText);
  }
}

// Handle assistant response
function handleResponse(text) {
  responseText = text;

  // Display assistant message
  displayMessage('assistant', responseText);

  // ✅ OPTIONAL: Uncomment this if you're NOT using OpenAI's real-time voice
  // window.speakText(responseText);

  transcriptText = '';
  responseText = '';
}


// Display a message in the UI
function displayMessage(sender, text) {
  if (!messageContainer) return;

  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);

  const avatarElement = document.createElement('div');
  avatarElement.classList.add('avatar');
  avatarElement.innerHTML = sender === 'assistant' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

  const messageTextElement = document.createElement('div');
  messageTextElement.classList.add('message-text');
  messageTextElement.textContent = text;

  messageElement.appendChild(avatarElement);
  messageElement.appendChild(messageTextElement);
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Display welcome message
function displayWelcomeMessage() {
  const welcomeMessage = "Hello! I'm your ChatSites AI assistant. I can help answer questions, show dynamic content, and assist with various tasks. Try asking me something or click the microphone to speak.";
  displayMessage('assistant', welcomeMessage);
}

// Initialize once DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeAssistant);

// Export for external use
window.aiAssistant = {
  initialize: initializeAssistant,
  toggleVoiceInput: toggleVoiceInput,
  sendTextMessage: sendTextMessage
};
