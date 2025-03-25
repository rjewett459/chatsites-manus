// Voice interface functionality for ChatSites Portal

document.addEventListener('DOMContentLoaded', function() {
    // Initialize voice interface components
    initVoiceInterface();
    setupSpeechSynthesis();
});

// Initialize voice interface
function initVoiceInterface() {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Speech Recognition API not supported in this browser');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // Get UI elements
    const voiceButton = document.getElementById('voice-input-button');
    const textInput = document.getElementById('text-input');
    const sendButton = document.getElementById('send-button');
    const aiOrb = document.getElementById('ai-orb');
    
    // Set up voice button
    if (voiceButton) {
        voiceButton.addEventListener('click', toggleSpeechRecognition);
    }
    
    // Variable to track recognition state
    let isListening = false;
    
    // Function to toggle speech recognition
    function toggleSpeechRecognition() {
        if (isListening) {
            recognition.stop();
            isListening = false;
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.classList.remove('listening');
            
            // Update portal state
            if (window.portalInterface) {
                window.portalInterface.updateState('idle');
            }
        } else {
            recognition.start();
            isListening = true;
            voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            voiceButton.classList.add('listening');
            
            // Clear previous input
            textInput.value = '';
            
            // Update portal state
            if (window.portalInterface) {
                window.portalInterface.updateState('listening');
            }
            
            // Add visual feedback
            addListeningFeedback();
        }
    }
    
    // Handle recognition results
    recognition.onresult = function(event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        textInput.value = transcript;
        
        // Visual feedback for interim results
        if (event.results[0].isFinal) {
            // Final result received
            console.log('Final transcript:', transcript);
        } else {
            // Interim result
            console.log('Interim transcript:', transcript);
        }
    };
    
    // Handle recognition end
    recognition.onend = function() {
        isListening = false;
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceButton.classList.remove('listening');
        
        // If we have text, send it
        if (textInput.value.trim() !== '') {
            sendButton.click();
        }
        
        // Update portal state
        if (window.portalInterface) {
            window.portalInterface.updateState('idle');
        }
        
        // Remove visual feedback
        removeListeningFeedback();
    };
    
    // Handle recognition errors
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceButton.classList.remove('listening');
        
        // Update portal state
        if (window.portalInterface) {
            window.portalInterface.updateState('idle');
        }
        
        // Remove visual feedback
        removeListeningFeedback();
        
        // Show error message for certain errors
        if (event.error === 'not-allowed') {
            alert('Microphone access is required for voice input. Please allow microphone access in your browser settings.');
        }
    };
    
    // Add visual feedback during listening
    function addListeningFeedback() {
        // Add listening animation to orb
        if (aiOrb) {
            aiOrb.classList.add('listening-animation');
            
            // Add or update listening animation style
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
                    
                    .orb.listening-animation .orb-pulse {
                        animation: pulse 1s infinite !important;
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
            
            // Add voice wave visualization
            const voiceWave = document.createElement('div');
            voiceWave.className = 'voice-wave';
            for (let i = 0; i < 9; i++) {
                const bar = document.createElement('span');
                voiceWave.appendChild(bar);
            }
            
            // Remove any existing voice wave
            const existingWave = aiOrb.querySelector('.voice-wave');
            if (existingWave) {
                existingWave.remove();
            }
            
            aiOrb.appendChild(voiceWave);
        }
    }
    
    // Remove visual feedback
    function removeListeningFeedback() {
        if (aiOrb) {
            aiOrb.classList.remove('listening-animation');
            
            // Remove voice wave
            const voiceWave = aiOrb.querySelector('.voice-wave');
            if (voiceWave) {
                voiceWave.remove();
            }
        }
    }
}

// Set up speech synthesis
function setupSpeechSynthesis() {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
        console.warn('Speech Synthesis API not supported in this browser');
        return;
    }
    
    // Get available voices
    let voices = [];
    
    function getVoices() {
        voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
    }
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
    }
    
    // Get voices right away
    getVoices();
    
    // Function to speak text
    window.speakText = function(text) {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported');
            return;
        }
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set preferred voice
        if (voices.length > 0) {
            // Try to find a female voice
            const femaleVoice = voices.find(voice => 
                voice.name.includes('female') || 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') ||
                voice.name.includes('Google UK English Female')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
        }
        
        // Set properties
        utterance.volume = 1;
        utterance.rate = 1;
        utterance.pitch = 1;
        
        // Add visual feedback during speech
        const aiOrb = document.getElementById('ai-orb');
        if (aiOrb) {
            aiOrb.classList.add('speaking');
            
            // Add speaking animation style
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
        
        // Update portal state
        if (window.portalInterface) {
            window.portalInterface.updateState('responding');
        }
        
        // Handle speech end
        utterance.onend = function() {
            if (aiOrb) {
                aiOrb.classList.remove('speaking');
            }
            
            // Update portal state
            if (window.portalInterface) {
                window.portalInterface.updateState('idle');
            }
        };
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
    };
}

// Function to simulate OpenAI Realtime API integration
// Note: This is a placeholder for the actual API integration
function simulateRealtimeAPI() {
    console.log('Simulating OpenAI Realtime API integration');
    
    // In a real implementation, this would connect to the OpenAI Realtime API
    // using WebRTC for client-side applications
    
    // For demonstration purposes, we're using the Web Speech API
    // but in a production environment, this would be replaced with
    // the actual OpenAI Realtime API implementation
    
    return {
        // Simulate starting a conversation
        startConversation: function() {
            console.log('Starting conversation with simulated Realtime API');
            return {
                id: 'sim_' + Math.random().toString(36).substring(2, 15)
            };
        },
        
        // Simulate sending audio
        sendAudio: function(audioData) {
            console.log('Sending audio data to simulated Realtime API');
            // In a real implementation, this would stream audio to the API
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        transcript: 'Simulated transcript from audio',
                        confidence: 0.95
                    });
                }, 500);
            });
        },
        
        // Simulate sending text
        sendText: function(text) {
            console.log('Sending text to simulated Realtime API:', text);
            // In a real implementation, this would send text to the API
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        response: 'This is a simulated response to: ' + text,
                        audioUrl: null // In real implementation, this might be audio data
                    });
                }, 800);
            });
        }
    };
}

// Export the simulated API for use in other scripts
window.realtimeAPI = simulateRealtimeAPI();
