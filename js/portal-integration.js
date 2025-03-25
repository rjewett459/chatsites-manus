// Integration script for ChatSites Portal
// This file integrates all WebRTC components with the main portal

// Load order is important:
// 1. openai-realtime-webrtc.js - Base WebRTC implementation
// 2. speech-to-speech.js - Speech-to-speech enhancement
// 3. ai-assistant-webrtc.js - AI assistant interface
// 4. portal-integration.js (this file) - Integration with portal

// Global variables
let portalInitialized = false;

// Initialize the portal with WebRTC functionality
function initializePortalWithWebRTC() {
  if (portalInitialized) {
    console.log('Portal already initialized with WebRTC');
    return false;
  }
  
  try {
    console.log('Initializing portal with WebRTC functionality');
    
    // Check if all required components are loaded
    if (!window.openAIRealtimeAPI) {
      throw new Error('OpenAI Realtime WebRTC API not loaded');
    }
    
    if (!window.enhanceWebRTCWithSpeechToSpeech) {
      throw new Error('Speech-to-Speech enhancement not loaded');
    }
    
    if (!window.aiAssistant) {
      throw new Error('AI Assistant interface not loaded');
    }
    
    // Replace the existing AI assistant with the WebRTC version
    const aiAssistantContainer = document.getElementById('ai-assistant');
    if (!aiAssistantContainer) {
      throw new Error('AI Assistant container not found');
    }
    
    // Update the portal UI to indicate WebRTC functionality
    const portalHeader = document.querySelector('.portal-header h2');
    if (portalHeader) {
      portalHeader.textContent = 'ChatSites™ Portal with Realtime Voice AI';
    }
    
    // Add WebRTC indicator
    const webrtcIndicator = document.createElement('div');
    webrtcIndicator.classList.add('webrtc-indicator');
    webrtcIndicator.innerHTML = '<i class="fas fa-broadcast-tower"></i> WebRTC Enabled';
    webrtcIndicator.style.color = '#f65228';
    webrtcIndicator.style.fontWeight = 'bold';
    webrtcIndicator.style.margin = '5px 0';
    webrtcIndicator.style.fontSize = '0.8rem';
    
    const portalControls = document.querySelector('.portal-controls');
    if (portalControls) {
      portalControls.prepend(webrtcIndicator);
    }
    
    // Initialize the AI assistant with WebRTC
    window.aiAssistant.initialize();
    
    portalInitialized = true;
    console.log('Portal successfully initialized with WebRTC functionality');
    return true;
  } catch (error) {
    console.error('Error initializing portal with WebRTC:', error);
    
    // Fallback to non-WebRTC version
    console.log('Falling back to non-WebRTC version');
    return false;
  }
}

// Check if all scripts are loaded and initialize
function checkAndInitialize() {
  if (
    typeof window.openAIRealtimeAPI !== 'undefined' &&
    typeof window.enhanceWebRTCWithSpeechToSpeech !== 'undefined' &&
    typeof window.aiAssistant !== 'undefined'
  ) {
    // All required scripts are loaded, initialize
    initializePortalWithWebRTC();
  } else {
    // Wait and try again
    setTimeout(checkAndInitialize, 100);
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Start checking for scripts
  checkAndInitialize();
});

// Export for external use
window.portalWebRTC = {
  initialize: initializePortalWithWebRTC
};

console.log('Portal WebRTC integration module loaded');
