// OpenAI Realtime API with WebRTC implementation

// ✅ Only declare audioContext if not already defined
if (!window.__openAIRealtimeLoaded__) {
  window.__openAIRealtimeLoaded__ = true;

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

// Config
const REALTIME_API = {
  baseUrl: "https://api.openai.com/v1/realtime",
  model: "gpt-4o-mini",
  transcribeModel: "gpt-4o-mini-transcribe",
  voice: "sage"
};

// Initialize connection
async function initializeRealtimeAPI(ephemeralKey, statusCallback, transcriptCallback, responseCallback) {
  try {
    // ✅ Google STUN server only (simple testing)
peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
});


    dataChannel = peerConnection.createDataChannel('oai-events');
    setupDataChannelListeners(statusCallback, transcriptCallback, responseCallback);

    const offer = await peerConnection.createOffer({ offerToReceiveAudio: true });
    await peerConnection.setLocalDescription(offer);

    // Wait for localDescription
    let retry = 0;
    while (!peerConnection.localDescription && retry++ < 10) {
      await new Promise(res => setTimeout(res, 100));
    }
    if (!peerConnection.localDescription) throw new Error("Local description not set");

    // Send SDP offer to OpenAI
    const sdpResponse = await fetch(`${REALTIME_API.baseUrl}?model=${REALTIME_API.model}`, {
      method: "POST",
      body: peerConnection.localDescription.sdp,
      headers: {
        "Authorization": `Bearer ${ephemeralKey}`,
        "Content-Type": "application/sdp"
      }
    });

    if (!sdpResponse.ok) {
      throw new Error(`OpenAI Realtime API error: ${sdpResponse.status}`);
    }

    const answer = {
      type: "answer",
      sdp: await sdpResponse.text()
    };

    // Apply answer
    if (peerConnection.signalingState !== "stable" && !peerConnection.remoteDescription) {
      await peerConnection.setRemoteDescription(answer);
    } else {
      console.warn("Skipping setRemoteDescription (already stable/set)");
    }

    // Connection state logs
    peerConnection.onicecandidate = e => {
      if (e.candidate) console.log("New ICE candidate:", e.candidate);
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        isConnected = true;
        statusCallback('connected');
      } else if (["disconnected", "failed", "closed"].includes(peerConnection.connectionState)) {
        isConnected = false;
        statusCallback('disconnected');
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peerConnection.iceConnectionState);
    };

    // ✅ Handle incoming audio and play it
    peerConnection.ontrack = (event) => {
      if (event.track.kind === 'audio') {
        const audioElement = document.createElement('audio');
        audioElement.srcObject = new MediaStream([event.track]);
        audioElement.autoplay = true;
        audioElement.muted = false;

        audioElement.addEventListener('canplaythrough', () => {
          audioElement.play().catch(err => {
            console.error("Audio playback error:", err);
          });
        });

        document.body.appendChild(audioElement);
        console.log("🎧 Audio track received and playing");
      }
    };

    return true;
  } catch (err) {
    console.error("Realtime API init error:", err);
    statusCallback('error', err.message);
    return false;
  }
}

// Session setup
function setupDataChannelListeners(statusCallback, transcriptCallback, responseCallback) {
  dataChannel.onopen = () => {
    console.log("✅ Data channel open");
    isConnected = true;
    statusCallback('ready');
    updateSession();
  };

  dataChannel.onclose = () => {
    console.log("Data channel closed");
    isConnected = false;
    statusCallback('closed');
  };

  dataChannel.onerror = err => {
    console.error("Data channel error:", err);
    statusCallback('error', err.message);
  };

  dataChannel.onmessage = event => {
    try {
      const message = JSON.parse(event.data);
      console.log("📩 Received:", message);

      switch (message.type) {
        case 'session.created':
        case 'session.updated':
          console.log("Session info:", message.session);
          break;
        case 'input_audio_buffer.speech_started':
          statusCallback('listening');
          break;
        case 'input_audio_buffer.speech_stopped':
          statusCallback('processing');
          break;
        case 'response.audio_transcript.delta':
          if (message.delta?.text) transcriptCallback(message.delta.text);
          break;
        case 'response.audio.started':
          statusCallback('speaking');
          break;
        case 'response.audio.stopped':
        case 'response.done':
          statusCallback('ready');
          if (message.response?.text) responseCallback(message.response.text);
          break;
      }
    } catch (err) {
      console.error("Message parse error:", err);
    }
  };
}

function updateSession() {
  if (!isConnected || !dataChannel || dataChannel.readyState !== 'open') {
    console.error("❌ Cannot update session: not connected");
    return false;
  }

  const update = {
    type: "session.update",
    session: {
      voice: REALTIME_API.voice,
      transcribe_model: REALTIME_API.transcribeModel,
      system_instruction: "You are a helpful AI assistant for the ChatSites Portal. Respond with concise, accurate information. Be friendly and proactive."
    }
  };

  try {
    dataChannel.send(JSON.stringify(update));
    return true;
  } catch (err) {
    console.error("Update session error:", err);
    return false;
  }
}

async function startListening() {
  if (!isConnected) {
    console.error("Cannot start listening: not connected");
    return false;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const track = mediaStream.getAudioTracks()[0];
    audioSender = peerConnection.addTrack(track, mediaStream);
    isListening = true;
    return true;
  } catch (err) {
    console.error("Start listening error:", err);
    return false;
  }
}

function stopListening() {
  if (!isListening || !mediaStream) return false;

  try {
    mediaStream.getTracks().forEach(t => t.stop());
    if (audioSender) peerConnection.removeTrack(audioSender);
    mediaStream = null;
    isListening = false;
    return true;
  } catch (err) {
    console.error("Stop listening error:", err);
    return false;
  }
}

function sendTextMessage(text) {
  if (!isConnected || !dataChannel || dataChannel.readyState !== 'open') {
    console.error("Cannot send: not connected");
    return false;
  }

  try {
    dataChannel.send(JSON.stringify({ type: "text.message", text }));
    return true;
  } catch (err) {
    console.error("Send message error:", err);
    return false;
  }
}

function closeConnection() {
  try {
    if (isListening) stopListening();
    if (dataChannel) dataChannel.close();
    if (peerConnection) peerConnection.close();
    if (window.audioContext) window.audioContext.close();

    peerConnection = null;
    dataChannel = null;
    isConnected = false;
    return true;
  } catch (err) {
    console.error("Close connection error:", err);
    return false;
  }
}

// Export API
window.openAIRealtimeAPI = {
  initialize: initializeRealtimeAPI,
  startListening,
  stopListening,
  sendTextMessage,
  closeConnection
};

console.log("✅ OpenAI Realtime API with WebRTC loaded");
