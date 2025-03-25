// Client-side OpenAI Realtime API integration
// This file implements the client-side interface for the OpenAI Realtime API

// Global variables
let realtimeSession = null;
let audioContext = null;
let mediaRecorder = null;
let isRecording = false;

// Initialize the OpenAI Realtime API interface
const openAIRealtimeAPI = {
  // Initialize the API
  initialize: async function(messageCallback, stateCallback) {
    console.log('Initializing OpenAI Realtime API client');
    
    try {
      // Set up callbacks
      this.messageCallback = messageCallback || function() {};
      this.stateCallback = stateCallback || function() {};
      
      // Initialize audio context
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Signal that initialization is complete
      this.stateCallback('initialized');
      return true;
    } catch (error) {
      console.error('Error initializing OpenAI Realtime API:', error);
      throw error;
    }
  },
  
  // Send a text message to the API
  sendTextMessage: async function(message) {
    console.log('Sending text message to OpenAI Realtime API:', message);
    
    try {
      this.stateCallback('sending');
      
      // In a production environment, this would make a request to the server
      // which would then use the OpenAI Realtime API
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Store session ID if provided
        if (data.sessionId) {
          realtimeSession = data.sessionId;
        }
        
        // Call the message callback with the response
        this.messageCallback({
          type: 'text',
          content: data.message,
          voice: 'sage' // Using sage voice as requested
        });
        
        this.stateCallback('received');
        return data;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending text message:', error);
      this.stateCallback('error');
      throw error;
    }
  },
  
  // Start voice recording
  startVoiceRecording: async function() {
    if (isRecording) return;
    
    try {
      this.stateCallback('recording');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
      
      // Set up event handlers
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', async () => {
        // Create audio blob
        const audioBlob = new Blob(audioChunks);
        
        // In a production environment, this would send the audio to the server
        // which would then use the OpenAI Realtime API for transcription
        
        // For now, simulate a response
        setTimeout(() => {
          this.messageCallback({
            type: 'transcription',
            content: 'This is a simulated transcription of your voice input',
            voice: 'sage' // Using sage voice as requested
          });
          
          this.stateCallback('transcribed');
        }, 1000);
      });
      
      // Start recording
      mediaRecorder.start();
      isRecording = true;
    } catch (error) {
      console.error('Error starting voice recording:', error);
      this.stateCallback('error');
      throw error;
    }
  },
  
  // Stop voice recording
  stopVoiceRecording: function() {
    if (!isRecording || !mediaRecorder) return;
    
    try {
      // Stop recording
      mediaRecorder.stop();
      isRecording = false;
      
      // Stop all tracks in the stream
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      this.stateCallback('processing');
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      this.stateCallback('error');
      throw error;
    }
  },
  
  // Play audio from the API
  playAudio: async function(audioData) {
    try {
      // In a production environment, this would play audio received from the server
      // For now, use the Web Speech API for demonstration
      const utterance = new SpeechSynthesisUtterance(audioData.content);
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Female')) || speechSynthesis.getVoices()[0];
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      speechSynthesis.speak(utterance);
      
      this.stateCallback('speaking');
      
      return new Promise((resolve) => {
        utterance.onend = () => {
          this.stateCallback('idle');
          resolve();
        };
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      this.stateCallback('error');
      throw error;
    }
  }
};

// Make the API available globally
window.openAIRealtimeAPI = openAIRealtimeAPI;

console.log('OpenAI Realtime API client loaded');
