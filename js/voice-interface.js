// Voice interface for ChatSites Portal (OpenAI Real-Time Voice Only)

// Wait for page load
// Use OpenAI Realtime Voice (disables browser TTS & STT)
document.addEventListener('DOMContentLoaded', () => {
  initVoiceInterface();
});

function initVoiceInterface() {
  const voiceButton = document.getElementById('voice-input-button');
  const textInput = document.getElementById('text-input');
  const sendButton = document.getElementById('send-button');
  const aiOrb = document.getElementById('ai-orb');

  let isListening = false;

  if (voiceButton) {
    voiceButton.addEventListener('click', () => {
      if (isListening) {
        window.openAIRealtimeAPI.stopListening();
        updateUIState('idle');
        removeListeningFeedback();
        isListening = false;
      } else {
        window.openAIRealtimeAPI.startListening();
        updateUIState('listening');
        addListeningFeedback();
        isListening = true;
      }
    });
  }

  function updateUIState(state) {
    isListening = state === 'listening';
    if (voiceButton) {
      voiceButton.innerHTML = isListening ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
      voiceButton.classList.toggle('listening', isListening);
    }
    if (window.portalInterface) {
      window.portalInterface.updateState(state);
    }
  }

  function addListeningFeedback() {
    if (!aiOrb) return;
    aiOrb.classList.add('listening-animation');
    if (!document.getElementById('listening-animation-style')) {
      const style = document.createElement('style');
      style.id = 'listening-animation-style';
      style.textContent = `
        @keyframes listeningPulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 0.9; }
          100% { transform: scale(1); opacity: 0.7; }
        }
        .listening-animation {
          animation: listeningPulse 1s infinite ease-in-out;
        }
        .voice-wave {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .voice-wave span {
          display: inline-block;
          width: 3px;
          height: 5px;
          margin: 0 1px;
          background-color: rgba(246, 82, 40, 0.7);
          border-radius: 1px;
          animation: voiceWave 0.5s infinite ease-in-out alternate;
        }
        @keyframes voiceWave {
          0% { height: 5px; }
          100% { height: 15px; }
        }
        .voice-wave span:nth-child(1) { animation-delay: 0.0s; }
        .voice-wave span:nth-child(2) { animation-delay: 0.1s; }
        .voice-wave span:nth-child(3) { animation-delay: 0.2s; }
        .voice-wave span:nth-child(4) { animation-delay: 0.3s; }
        .voice-wave span:nth-child(5) { animation-delay: 0.4s; }
        .voice-wave span:nth-child(6) { animation-delay: 0.3s; }
        .voice-wave span:nth-child(7) { animation-delay: 0.2s; }
        .voice-wave span:nth-child(8) { animation-delay: 0.1s; }
        .voice-wave span:nth-child(9) { animation-delay: 0.0s; }
      `;
      document.head.appendChild(style);
    }
    const voiceWave = document.createElement('div');
    voiceWave.className = 'voice-wave';
    for (let i = 0; i < 9; i++) {
      const bar = document.createElement('span');
      voiceWave.appendChild(bar);
    }
    const existingWave = aiOrb.querySelector('.voice-wave');
    if (existingWave) existingWave.remove();
    aiOrb.appendChild(voiceWave);
  }

  function removeListeningFeedback() {
    if (!aiOrb) return;
    aiOrb.classList.remove('listening-animation');
    const wave = aiOrb.querySelector('.voice-wave');
    if (wave) wave.remove();
  }
}

// ✅ Realtime WebRTC uses STUN/TURN ICE config
if (!window.audioContext) {
  window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// NOTE: Update your RTCPeerConnection to use STUN/TURN like this:
// peerConnection = new RTCPeerConnection({
//   iceServers: [
//     { urls: 'stun:stun.l.google.com:19302' },
//     {
//       urls: 'turn:openrelay.metered.ca:80',
//       username: 'openrelayproject',
//       credential: 'openrelayproject'
//     }
//   ]
// });

