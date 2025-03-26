// Voice interface for ChatSites Portal

document.addEventListener('DOMContentLoaded', () => {
  initVoiceInterface();
  setupSpeechSynthesis();
});

// Initialize voice interface
function initVoiceInterface() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Speech Recognition API not supported in this browser');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  const voiceButton = document.getElementById('voice-input-button');
  const textInput = document.getElementById('text-input');
  const sendButton = document.getElementById('send-button');
  const aiOrb = document.getElementById('ai-orb');

  let isListening = false;

  if (voiceButton) {
    voiceButton.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        textInput.value = '';
        updateUIState('listening');
        addListeningFeedback();
      }
    });
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');

    textInput.value = transcript;

    if (event.results[0].isFinal) {
      console.log('Final transcript:', transcript);
    } else {
      console.log('Interim transcript:', transcript);
    }
  };

  recognition.onend = () => {
    isListening = false;
    updateUIState('idle');
    removeListeningFeedback();

    if (textInput.value.trim() !== '') {
      sendButton.click();
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    updateUIState('idle');
    removeListeningFeedback();

    if (event.error === 'not-allowed') {
      alert('Microphone access is required. Please allow microphone access in your browser settings.');
    }
  };

  function updateUIState(state) {
    isListening = state === 'listening';
    if (voiceButton) {
      voiceButton.innerHTML = isListening
        ? '<i class="fas fa-microphone-slash"></i>'
        : '<i class="fas fa-microphone"></i>';
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

// Set up speech synthesis
function setupSpeechSynthesis() {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech Synthesis API not supported');
    return;
  }

  let voices = [];

  function getVoices() {
    voices = window.speechSynthesis.getVoices();
  }

  window.speechSynthesis.onvoiceschanged = getVoices;
  getVoices();

  window.speakText = function (text) {
    if (!text || !voices.length) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const preferred = voices.find(voice =>
      voice.name.includes('female') || voice.name.includes('Samantha') || voice.name.includes('Google UK English Female')
    );

    if (preferred) utterance.voice = preferred;

    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    const aiOrb = document.getElementById('ai-orb');
    if (aiOrb) {
      aiOrb.classList.add('speaking');

      if (!document.getElementById('speaking-animation-style')) {
        const style = document.createElement('style');
        style.id = 'speaking-animation-style';
        style.textContent = `
          @keyframes speakingPulse {
            0% { transform: scale(1); }
            10% { transform: scale(1.05); }
            20% { transform: scale(1); }
            30% { transform: scale(1.03); }
            40% { transform: scale(1); }
            50% { transform: scale(1.02); }
            60% { transform: scale(1); }
            100% { transform: scale(1); }
          }
          .orb.speaking {
            animation: speakingPulse 2s infinite;
          }
        `;
        document.head.appendChild(style);
      }
    }

    if (window.portalInterface) {
      window.portalInterface.updateState('responding');
    }

    utterance.onend = () => {
      if (aiOrb) aiOrb.classList.remove('speaking');
      if (window.portalInterface) window.portalInterface.updateState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };
}
