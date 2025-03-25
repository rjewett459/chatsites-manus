// Speech-to-Speech functionality for ChatSites Portal
// This file enhances the WebRTC implementation with true speech-to-speech capabilities

// ✅ Global-safe audioContext
if (!window.audioContext) {
  window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
}
const audioContext = window.audioContext;

let audioQueue = [];
let isPlaying = false;

// Initialize audio context (returns true if created here)
function initializeAudioContext() {
  if (!audioContext) {
    console.warn('AudioContext is not available.');
    return false;
  }
  return true;
}

// Handle incoming audio from OpenAI
async function handleIncomingAudio(audioData) {
  try {
    const binaryString = window.atob(audioData);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);

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

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);

  source.onended = playNextInQueue;
  source.start(0);
}

// Enhanced WebRTC data channel message handler
function enhancedDataChannelHandler(event, statusCallback, transcriptCallback, responseCallback) {
  try {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);

    if (message.type === 'session.created') {
      console.log("Session created:", message.session);
    } else if (message.type === 'session.updated') {
      console.log("Session updated:", message.session);
    } else if (message.type === 'input_audio_buffer.speech_started') {
      statusCallback('listening');
    } else if (message.type === 'input_audio_buffer.speech_stopped') {
      statusCallback('processing');
    } else if (message.type === 'response.audio_transcript.delta') {
      if (message.delta && message.delta.text) {
        transcriptCallback(message.delta.text);
      }
    } else if (message.type === 'response.audio.started') {
      statusCallback('speaking');
    } else if (message.type === 'response.audio.delta') {
      if (message.delta && message.delta.audio) {
        handleIncomingAudio(message.delta.audio);
      }
    } else if (message.type === 'response.audio.stopped') {
      statusCallback('ready');
    } else if (message.type === 'response.done') {
      statusCallback('ready');
      if (message.response && message.response.text) {
        responseCallback(message.response.text);
      }
    }
  } catch (error) {
    console.error("Error processing WebRTC message:", error);
  }
}

// Setup enhanced audio processing
function setupEnhancedAudioProcessing(peerConnection, mediaStream) {
  try {
    initializeAudioContext();

    const source = audioContext.createMediaStreamSource(mediaStream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      // Optionally process audio here
    };

    return true;
  } catch (error) {
    console.error('Error setting up enhanced audio processing:', error);
    return false;
  }
}

// Enhance the existing WebRTC implementation
function enhanceWebRTCWithSpeechToSpeech() {
  const originalInitialize = window.openAIRealtimeAPI.initialize;
  const originalStartListening = window.openAIRealtimeAPI.startListening;

  window.openAIRealtimeAPI.initialize = async function(ephemeralKey, statusCallback, transcriptCallback, responseCallback) {
    initializeAudioContext();

    const success = await originalInitialize(ephemeralKey, statusCallback, transcriptCallback, responseCallback);

    if (success && window.openAIRealtimeAPI._dataChannel) {
      const originalOnMessage = window.openAIRealtimeAPI._dataChannel.onmessage;
      window.openAIRealtimeAPI._dataChannel.onmessage = (event) => {
        enhancedDataChannelHandler(event, statusCallback, transcriptCallback, responseCallback);
        if (originalOnMessage) originalOnMessage(event);
      };
    }

    return success;
  };

  window.openAIRealtimeAPI.startListening = async function() {
    const success = await originalStartListening();

    if (success && window.openAIRealtimeAPI._mediaStream && window.openAIRealtimeAPI._peerConnection) {
      setupEnhancedAudioProcessing(
        window.openAIRealtimeAPI._peerConnection,
        window.openAIRealtimeAPI._mediaStream
      );
    }

    return success;
  };

  window.openAIRealtimeAPI.handleIncomingAudio = handleIncomingAudio;
  window.openAIRealtimeAPI.playNextInQueue = playNextInQueue;

  console.log("🎤 Enhanced WebRTC with true speech-to-speech functionality");
  return true;
}

// Export and auto-run
window.enhanceWebRTCWithSpeechToSpeech = enhanceWebRTCWithSpeechToSpeech;

document.addEventListener('DOMContentLoaded', () => {
  const checkInterval = setInterval(() => {
    if (window.openAIRealtimeAPI) {
      clearInterval(checkInterval);
      enhanceWebRTCWithSpeechToSpeech();
    }
  }, 100);
});

console.log("✅ Speech-to-Speech enhancement module loaded");
