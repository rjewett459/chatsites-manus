// Speech-to-Speech functionality for ChatSites Portal
// This file enhances the WebRTC implementation with true speech-to-speech capabilities

// Global variables
let audioContext = null;
let audioQueue = [];
let isPlaying = false;

// Initialize audio context
function initializeAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return true;
  }
  return false;
}

// Handle incoming audio from OpenAI
async function handleIncomingAudio(audioData) {
  try {
    // Convert base64 audio data to ArrayBuffer
    const binaryString = window.atob(audioData);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
    
    // Add to queue and play if not already playing
    audioQueue.push(audioBuffer);
    
    if (!isPlaying) {
      playNextInQueue();
    }
    
    return true;
  } catch (error) {
    console.error('Error handling incoming audio:', error);
    return false;
  }
}

// Play next audio in queue
function playNextInQueue() {
  if (audioQueue.length === 0) {
    isPlaying = false;
    return;
  }
  
  isPlaying = true;
  const audioBuffer = audioQueue.shift();
  
  // Create audio source
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  
  // Play audio
  source.onended = playNextInQueue;
  source.start(0);
}

// Enhanced WebRTC data channel message handler
function enhancedDataChannelHandler(event, statusCallback, transcriptCallback, responseCallback) {
  try {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);
    
    // Handle different event types
    if (message.type === 'session.created') {
      console.log("Session created:", message.session);
    } else if (message.type === 'session.updated') {
      console.log("Session updated:", message.session);
    } else if (message.type === 'input_audio_buffer.speech_started') {
      statusCallback('listening');
    } else if (message.type === 'input_audio_buffer.speech_stopped') {
      statusCallback('processing');
    } else if (message.type === 'response.audio_transcript.delta') {
      // Handle streaming transcript
      if (message.delta && message.delta.text) {
        transcriptCallback(message.delta.text);
      }
    } else if (message.type === 'response.audio.started') {
      statusCallback('speaking');
    } else if (message.type === 'response.audio.delta') {
      // Handle streaming audio
      if (message.delta && message.delta.audio) {
        handleIncomingAudio(message.delta.audio);
      }
    } else if (message.type === 'response.audio.stopped') {
      statusCallback('ready');
    } else if (message.type === 'response.done') {
      // Handle completion of response
      statusCallback('ready');
      if (message.response && message.response.text) {
        responseCallback(message.response.text);
      }
    }
  } catch (error) {
    console.error("Error processing WebRTC message:", error);
  }
}

// Setup enhanced audio processing for WebRTC
function setupEnhancedAudioProcessing(peerConnection, mediaStream) {
  try {
    // Initialize audio context
    initializeAudioContext();
    
    // Create audio processing node
    const source = audioContext.createMediaStreamSource(mediaStream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    
    // Connect nodes
    source.connect(processor);
    processor.connect(audioContext.destination);
    
    // Process audio
    processor.onaudioprocess = (e) => {
      // Get input data
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Here you could add additional audio processing if needed
      // For example, noise reduction, gain control, etc.
      
      // For now, we'll just pass the audio through to the peer connection
    };
    
    return true;
  } catch (error) {
    console.error('Error setting up enhanced audio processing:', error);
    return false;
  }
}

// Enhance the existing WebRTC implementation
function enhanceWebRTCWithSpeechToSpeech() {
  // Store original functions
  const originalInitialize = window.openAIRealtimeAPI.initialize;
  const originalStartListening = window.openAIRealtimeAPI.startListening;
  
  // Override initialize function
  window.openAIRealtimeAPI.initialize = async function(ephemeralKey, statusCallback, transcriptCallback, responseCallback) {
    // Initialize audio context
    initializeAudioContext();
    
    // Call original initialize
    const success = await originalInitialize(ephemeralKey, statusCallback, transcriptCallback, responseCallback);
    
    if (success) {
      // Enhance data channel message handling
      if (window.openAIRealtimeAPI._dataChannel) {
        const originalOnMessage = window.openAIRealtimeAPI._dataChannel.onmessage;
        window.openAIRealtimeAPI._dataChannel.onmessage = (event) => {
          enhancedDataChannelHandler(event, statusCallback, transcriptCallback, responseCallback);
          if (originalOnMessage) {
            originalOnMessage(event);
          }
        };
      }
    }
    
    return success;
  };
  
  // Override startListening function
  window.openAIRealtimeAPI.startListening = async function() {
    // Call original startListening
    const success = await originalStartListening();
    
    if (success && window.openAIRealtimeAPI._mediaStream && window.openAIRealtimeAPI._peerConnection) {
      // Setup enhanced audio processing
      setupEnhancedAudioProcessing(
        window.openAIRealtimeAPI._peerConnection,
        window.openAIRealtimeAPI._mediaStream
      );
    }
    
    return success;
  };
  
  // Add new functions
  window.openAIRealtimeAPI.handleIncomingAudio = handleIncomingAudio;
  window.openAIRealtimeAPI.playNextInQueue = playNextInQueue;
  
  console.log("Enhanced WebRTC with true speech-to-speech functionality");
  return true;
}

// Export the enhancement function
window.enhanceWebRTCWithSpeechToSpeech = enhanceWebRTCWithSpeechToSpeech;

// Auto-enhance when loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for the base WebRTC implementation to load
  const checkInterval = setInterval(() => {
    if (window.openAIRealtimeAPI) {
      clearInterval(checkInterval);
      enhanceWebRTCWithSpeechToSpeech();
    }
  }, 100);
});

console.log("Speech-to-Speech enhancement module loaded");
