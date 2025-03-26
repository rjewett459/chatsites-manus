// OpenAI Realtime API with WebRTC implementation
// This file implements the client-side WebRTC connection to OpenAI's Realtime API

// ✅ Global-safe audioContext
if (!window.audioContext) {
  window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
}
const audioContext = window.audioContext;

// Global variables
let peerConnection = null;
let dataChannel = null;
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
    peerConnection = new RTCPeerConnection();
    dataChannel = peerConnection.createDataChannel('oai-events');
    setupDataChannelListeners(statusCallback, transcriptCallback, responseCallback);

    const offer = await peerConnection.createOffer({ offerToReceiveAudio: true });
    await peerConnection.setLocalDescription(offer);

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

    const answer = {
      type: "answer",
      sdp: await sdpResponse.text()
    };

    if (peerConnection.signalingState !== "stable" && !peerConnection.remoteDescription) {
      await peerConnection.setRemoteDescription(answer);
    } else {
      console.warn("⚠️ Skipping setRemoteDescription: already stable or set.");
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        statusCallback('connected');
      } else if (['disconnected', 'failed', 'closed'].includes(peerConnection.connectionState)) {
        isConnected = false;
        statusCallback('disconnected');
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peerConnection.iceConnectionState);
    };

    peerConnection.ontrack = (event) => {
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
    console.log("✅ Data channel opened");
    isConnected = true;
    statusCallback('ready');

    // ✅ Add delay before sending update to avoid race conditions
    setTimeout(() => {
      if (isConnected && dataChannel.readyState === 'open') {
        updateSession();
      }
    }, 250);
  };

  dataChannel.onclose = () => {
    console.log("Data channel closed");
    isConnected = false;
    statusCallback('closed');
  };

  dataChannel.onerror = (error) => {
    console.error("Data channel error:", error);
    statusCallback('error', error.message);
  };

  dataChannel.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("📩 Received message:", message);

      if (message.type === 'session.created') {
        console.log("Session created:", message.session);
      } else if (message.type === 'session.updated') {
        console.log("Session updated:", message.session);
      } else if (message.type === 'input_audio_buffer.speech_started') {
        statusCallback('listening');
      } else if (message.type === 'input_audio_buffer.speech_stopped') {
        statusCallback('processing');
      } else if (message.type === 'response.audio_transcript.delta') {
        if (message.delta?.text) {
          transcriptCallback(message.delta.text);
        }
      } else if (message.type === 'response.audio.started') {
        statusCallback('speaking');
      } else if (message.type === 'response.audio.stopped') {
        statusCallback('ready');
      } else if (message.type === 'response.done') {
        statusCallback('ready');
        if (message.response?.text) {
          responseCallback(message.response.text);
        }
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };
}

// Update session with voice + system instructions
function updateSession() {
  if (!isConnected || !dataChannel || dataChannel.readyState !== 'open') {
    console.error("❌ Cannot update session: not connected");
    return false;
  }

  const updateEvent = {
    type: "session.update",
    session: {
      voice: REALTIME_API.voice,
      transcribe_model: REALTIME_API.transcribeModel,
      system_instruction:
        "You are a helpful AI assistant for the ChatSites Portal. You provide concise, accurate information about ChatSites features and capabilities. You can assist with questions, show dynamic assets, and complete tasks like bookings or product suggestions. Keep responses friendly and professional."
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

// Start listening to user's voice
async function startListening() {
  if (!isConnected) {
    console.error("Cannot start listening: not connected");
    return false;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
  if (!isListening || !mediaStream) return false;

  try {
    mediaStream.getTracks().forEach(track => track.stop());
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

// Send a text message to OpenAI
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
    if (isListening) stopListening();
    if (dataChannel) {
      dataChannel.close();
      dataChannel = null;
    }
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    if (window.audioContext) {
      window.audioContext.close();
      window.audioContext = null;
    }

    isConnected = false;
    return true;
  } catch (error) {
    console.error("Error closing connection:", error);
    return false;
  }
}

// ✅ Export the API
window.openAIRealtimeAPI = {
  initialize: initializeRealtimeAPI,
  startListening: startListening,
  stopListening: stopListening,
  sendTextMessage: sendTextMessage,
  closeConnection: closeConnection
};

console.log("✅ OpenAI Realtime API with WebRTC loaded");
