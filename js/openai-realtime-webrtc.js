// OpenAI Realtime API with WebRTC implementation
// This file implements the client-side WebRTC connection to OpenAI's Realtime API

// Global variables
let peerConnection = null;
let dataChannel = null;
let audioContext = null;
let mediaStream = null;
let audioSender = null;
let isConnected = false;
let isListening = false;

// Configuration
const REALTIME_API = {
  baseUrl: "https://api.openai.com/v1/realtime",
  model: "gpt-4o-mini",
  transcribeModel: "gpt-4o-mini-transcribe",
  voice: "sage"
};

// Initialize the WebRTC connection to OpenAI Realtime API
async function initializeRealtimeAPI(ephemeralKey, statusCallback, transcriptCallback, responseCallback) {
  try {
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a new RTCPeerConnection
    peerConnection = new RTCPeerConnection();
    
    // Set up data channel for sending and receiving events
    dataChannel = peerConnection.createDataChannel('oai-events');
    
    // Set up data channel event listeners
    setupDataChannelListeners(statusCallback, transcriptCallback, responseCallback);
    
    // Create and set local description (offer)
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true
    });
    await peerConnection.setLocalDescription(offer);
    
    // Send the offer to OpenAI and get the answer
    const sdpResponse = await fetch(`${REALTIME_API.baseUrl}?model=${REALTIME_API.model}`, {
      method: "POST",
      body: peerConnection.localDescription.sdp,
      headers: {
        "Authorization": `Bearer ${ephemeralKey}`,
        "Content-Type": "application/sdp"
      }
    });
    
    if (!sdpResponse.ok) {
      throw new Error(`Failed to connect to OpenAI Realtime API: ${sdpResponse.status} ${sdpResponse.statusText}`);
    }
    
    // Set the remote description (answer from OpenAI)
    const answer = {
      type: "answer",
      sdp: await sdpResponse.text()
    };
    await peerConnection.setRemoteDescription(answer);
    
    // Set up ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
      }
    };
    
    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        isConnected = true;
        statusCallback('connected');
        // Update session with initial configuration
        updateSession();
      } else if (peerConnection.connectionState === 'disconnected' || 
                peerConnection.connectionState === 'failed' ||
                peerConnection.connectionState === 'closed') {
        isConnected = false;
        statusCallback('disconnected');
      }
    };
    
    // Handle ICE connection state changes
    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peerConnection.iceConnectionState);
    };
    
    // Handle track events (receiving audio from OpenAI)
    peerConnection.ontrack = (event) => {
      console.log("Received track:", event.track.kind);
      if (event.track.kind === 'audio') {
        const audioElement = document.createElement('audio');
        audioElement.srcObject = new MediaStream([event.track]);
        audioElement.autoplay = true;
        document.body.appendChild(audioElement);
      }
    };
    
    return true;
  } catch (error) {
    console.error("Error initializing Realtime API:", error);
    statusCallback('error', error.message);
    return false;
  }
}

// Set up data channel event listeners
function setupDataChannelListeners(statusCallback, transcriptCallback, responseCallback) {
  dataChannel.onopen = () => {
    console.log("Data channel opened");
    statusCallback('ready');
  };
  
  dataChannel.onclose = () => {
    console.log("Data channel closed");
    statusCallback('closed');
  };
  
  dataChannel.onerror = (error) => {
    console.error("Data channel error:", error);
    statusCallback('error', error.message);
  };
  
  dataChannel.onmessage = (event) => {
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
      console.error("Error parsing message:", error);
    }
  };
}

// Update session with configuration
function updateSession() {
  if (!isConnected || !dataChannel || dataChannel.readyState !== 'open') {
    console.error("Cannot update session: not connected");
    return false;
  }
  
  const updateEvent = {
    type: "session.update",
    session: {
      voice: REALTIME_API.voice,
      transcribe_model: REALTIME_API.transcribeModel,
      system_instruction: "You are a helpful AI assistant for the ChatSites Portal. You provide concise, accurate information about ChatSites features and capabilities. You can assist with questions, show dynamic assets, and complete tasks like bookings or product suggestions. Keep responses friendly and professional."
    }
  };
  
  try {
    dataChannel.send(JSON.stringify(updateEvent));
    return true;
  } catch (error) {
    console.error("Error updating session:", error);
    return false;
  }
}

// Start listening for user's voice
async function startListening() {
  if (!isConnected) {
    console.error("Cannot start listening: not connected");
    return false;
  }
  
  try {
    // Request microphone access
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Add audio track to peer connection
    const audioTrack = mediaStream.getAudioTracks()[0];
    audioSender = peerConnection.addTrack(audioTrack, mediaStream);
    
    isListening = true;
    return true;
  } catch (error) {
    console.error("Error starting listening:", error);
    return false;
  }
}

// Stop listening
function stopListening() {
  if (!isListening || !mediaStream) {
    return false;
  }
  
  try {
    // Stop all tracks
    mediaStream.getTracks().forEach(track => track.stop());
    
    // Remove audio sender if it exists
    if (audioSender) {
      peerConnection.removeTrack(audioSender);
      audioSender = null;
    }
    
    mediaStream = null;
    isListening = false;
    return true;
  } catch (error) {
    console.error("Error stopping listening:", error);
    return false;
  }
}

// Send a text message
function sendTextMessage(text) {
  if (!isConnected || !dataChannel || dataChannel.readyState !== 'open') {
    console.error("Cannot send message: not connected");
    return false;
  }
  
  const textEvent = {
    type: "text.message",
    text: text
  };
  
  try {
    dataChannel.send(JSON.stringify(textEvent));
    return true;
  } catch (error) {
    console.error("Error sending text message:", error);
    return false;
  }
}

// Close the connection
function closeConnection() {
  try {
    // Stop listening if active
    if (isListening) {
      stopListening();
    }
    
    // Close data channel
    if (dataChannel) {
      dataChannel.close();
      dataChannel = null;
    }
    
    // Close peer connection
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    
    // Close audio context
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    
    isConnected = false;
    return true;
  } catch (error) {
    console.error("Error closing connection:", error);
    return false;
  }
}

// Export the API
window.openAIRealtimeAPI = {
  initialize: initializeRealtimeAPI,
  startListening: startListening,
  stopListening: stopListening,
  sendTextMessage: sendTextMessage,
  closeConnection: closeConnection
};

console.log("OpenAI Realtime API with WebRTC loaded");
