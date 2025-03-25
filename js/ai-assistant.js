// OpenAI Realtime API integration for ChatSites Portal
// This file implements the AI assistant interface with voice capabilities

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI assistant interface
    initAIAssistantInterface();
});

function initAIAssistantInterface() {
    // Get UI elements
    const textInput = document.getElementById('text-input');
    const sendButton = document.getElementById('send-button');
    const voiceButton = document.getElementById('voice-input-button');
    const assistantMessages = document.getElementById('assistant-messages');
    const aiOrb = document.getElementById('ai-orb');
    const dynamicContent = document.getElementById('dynamic-content');
    
    // Add enhanced AI assistant styles
    addAIAssistantStyles();
    
    // Initialize the simulated OpenAI Realtime API
    const realtimeAPI = initRealtimeAPI();
    
    // Set up text input and send button
    if (textInput && sendButton) {
        // Send message on button click
        sendButton.addEventListener('click', () => {
            sendUserMessage();
        });
        
        // Send message on Enter key
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }
    
    // Set up voice input button
    if (voiceButton) {
        voiceButton.addEventListener('click', () => {
            toggleVoiceRecognition();
        });
    }
    
    // Function to send user message
    function sendUserMessage() {
        const message = textInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessageToChat('user', message);
            
            // Clear input
            textInput.value = '';
            
            // Simulate AI thinking
            simulateAiThinking();
            
            // Process user message using the Realtime API
            realtimeAPI.processUserMessage(message)
                .then(response => {
                    // Stop thinking animation
                    stopAiThinking();
                    
                    // Add AI response to chat
                    addMessageToChat('assistant', response.text);
                    
                    // Speak the response
                    if (window.speakText) {
                        window.speakText(response.text);
                    }
                    
                    // Show dynamic content if included in response
                    if (response.dynamicContent) {
                        showDynamicContent(response.dynamicContent);
                    }
                })
                .catch(error => {
                    console.error('Error processing message:', error);
                    stopAiThinking();
                    addMessageToChat('assistant', 'I apologize, but I encountered an error processing your request. Please try again.');
                });
        }
    }
    
    // Function to add message to chat with enhanced styling
    function addMessageToChat(sender, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add(`${sender}-message-container`);
        
        if (sender === 'user') {
            messageContainer.style.textAlign = 'right';
        }
        
        const messageElement = document.createElement('div');
        messageElement.classList.add(`${sender}-message`);
        
        // Add typing animation for assistant messages
        if (sender === 'assistant') {
            messageElement.classList.add('typing');
            
            // Typing effect
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < message.length) {
                    messageElement.textContent += message.charAt(i);
                    i++;
                    
                    // Scroll to bottom as text appears
                    assistantMessages.scrollTop = assistantMessages.scrollHeight;
                } else {
                    clearInterval(typingInterval);
                    messageElement.classList.remove('typing');
                }
            }, 20);
        } else {
            messageElement.textContent = message;
        }
        
        messageContainer.appendChild(messageElement);
        assistantMessages.appendChild(messageContainer);
        
        // Scroll to bottom of messages
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }
    
    // Function to simulate AI thinking with enhanced orb animation
    function simulateAiThinking() {
        if (aiOrb) {
            aiOrb.classList.add('thinking');
            
            // Increase pulse animation speed
            const orbPulse = aiOrb.querySelector('.orb-pulse');
            if (orbPulse) {
                orbPulse.style.animation = 'pulse 0.8s infinite';
            }
            
            // Add thinking waves
            if (!aiOrb.querySelector('.thinking-waves')) {
                const thinkingWaves = document.createElement('div');
                thinkingWaves.classList.add('thinking-waves');
                
                for (let i = 0; i < 3; i++) {
                    const wave = document.createElement('div');
                    wave.classList.add('thinking-wave');
                    thinkingWaves.appendChild(wave);
                }
                
                aiOrb.appendChild(thinkingWaves);
            }
            
            // Update portal state if available
            if (window.portalInterface) {
                window.portalInterface.updateState('thinking');
            }
        }
    }
    
    // Function to stop AI thinking animation
    function stopAiThinking() {
        if (aiOrb) {
            aiOrb.classList.remove('thinking');
            
            // Reset pulse animation
            const orbPulse = aiOrb.querySelector('.orb-pulse');
            if (orbPulse) {
                orbPulse.style.animation = 'pulse 2s infinite';
            }
            
            // Remove thinking waves
            const thinkingWaves = aiOrb.querySelector('.thinking-waves');
            if (thinkingWaves) {
                thinkingWaves.remove();
            }
            
            // Update portal state if available
            if (window.portalInterface) {
                window.portalInterface.updateState('idle');
            }
        }
    }
    
    // Function to show dynamic content
    function showDynamicContent(content) {
        if (dynamicContent) {
            dynamicContent.innerHTML = content;
            dynamicContent.classList.remove('hidden');
            
            // Animate content appearance
            if (window.portalInterface && window.portalInterface.animateContent) {
                window.portalInterface.animateContent();
            }
        }
    }
    
    // Voice recognition state
    let isListening = false;
    let recognition = null;
    
    // Function to toggle voice recognition with enhanced feedback
    function toggleVoiceRecognition() {
        if (isListening) {
            stopVoiceRecognition();
        } else {
            startVoiceRecognition();
        }
    }
    
    // Function to start voice recognition
    function startVoiceRecognition() {
        // Check if speech recognition is supported
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice recognition is not supported in your browser. Please use Chrome or Edge for this feature.');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Configure recognition
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        // Update UI
        isListening = true;
        voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        voiceButton.classList.add('listening');
        
        // Clear previous input
        textInput.value = '';
        textInput.placeholder = 'Listening...';
        
        // Add visual feedback
        addListeningFeedback();
        
        // Update portal state if available
        if (window.portalInterface) {
            window.portalInterface.updateState('listening');
        }
        
        // Start recognition
        recognition.start();
        
        // Handle interim results
        recognition.onresult = function(event) {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            textInput.value = transcript;
            
            // If final result
            if (event.results[0].isFinal) {
                // Process after a short delay
                setTimeout(() => {
                    stopVoiceRecognition();
                    sendUserMessage();
                }, 500);
            }
        };
        
        // Handle recognition end
        recognition.onend = function() {
            stopVoiceRecognition();
        };
        
        // Handle errors
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopVoiceRecognition();
            
            if (event.error === 'not-allowed') {
                alert('Microphone access is required for voice input. Please allow microphone access in your browser settings.');
            }
        };
    }
    
    // Function to stop voice recognition
    function stopVoiceRecognition() {
        isListening = false;
        
        if (recognition) {
            recognition.stop();
        }
        
        // Update UI
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceButton.classList.remove('listening');
        textInput.placeholder = 'Type your message or press the mic to speak...';
        
        // Remove visual feedback
        removeListeningFeedback();
        
        // Update portal state if available
        if (window.portalInterface) {
            window.portalInterface.updateState('idle');
        }
    }
    
    // Function to add visual feedback during listening
    function addListeningFeedback() {
        if (aiOrb) {
            aiOrb.classList.add('listening-animation');
            
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
    
    // Function to remove visual feedback
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

// Function to initialize the simulated OpenAI Realtime API
function initRealtimeAPI() {
    console.log('Initializing OpenAI Realtime API integration');
    
    // Check if the OpenAI Realtime API is available
    if (window.openAIRealtimeAPI) {
        console.log('Using OpenAI Realtime API for voice and text processing');
        
        // Initialize the API
        window.openAIRealtimeAPI.initialize(
            (message) => {
                console.log('Received message from OpenAI Realtime API:', message);
            },
            (state) => {
                console.log('OpenAI Realtime API state changed:', state);
            }
        ).catch(error => {
            console.error('Error initializing OpenAI Realtime API:', error);
        });
        
        // Return an API wrapper that uses the OpenAI Realtime API
        return {
            processUserMessage: async (message) => {
                return new Promise((resolve, reject) => {
                    try {
                        // Send the message to the OpenAI Realtime API
                        window.openAIRealtimeAPI.sendTextMessage(message);
                        
                        // For demonstration purposes, we'll resolve with a simulated response
                        // In a real implementation, this would wait for the API response
                        setTimeout(() => {
                            resolve(getResponseForMessage(message));
                        }, 1500);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        };
    } else {
        console.warn('OpenAI Realtime API not available, using simulation mode');
        
        // Return a simulated API for demonstration
        return {
            processUserMessage: async (message) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(getResponseForMessage(message));
                    }, 1500);
                });
            }
        };
    }
    
    // Sample responses for demonstration
    function getResponseForMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return {
                text: "Hello! I'm your ChatSites assistant. How can I help you today?",
                dynamicContent: null
            };
        } else if (lowerMessage.includes('features') || lowerMessage.includes('what can you do')) {
            return {
                text: "ChatSites offers a range of features including voice-first interaction, AI-powered conversations, dynamic content display, and seamless integration with your business systems. Would you like to know more about any specific feature?",
                dynamicContent: `
                    <div class="feature-highlight">
                        <h3>Key Features</h3>
                        <ul>
                            <li>Voice-First Interface</li>
                            <li>Advanced AI Understanding</li>
                            <li>Mobile-First Design</li>
                            <li>Custom Branding</li>
                            <li>No-Code Editing</li>
                        </ul>
                        <a href="features/index.html" class="feature-link">View All Features</a>
                    </div>
                `
            };
        } else if (lowerMessage.includes('pricing') || lowerMessage.includes('cost')) {
            return {
                text: "ChatSites offers flexible pricing plans starting from $29/month for small businesses. Enterprise plans with custom features are also available. Would you like me to send you our detailed pricing information?",
                dynamicContent: `
                    <div class="pricing-card">
                        <h3>Pricing Plans</h3>
                        <div class="pricing-options">
                            <div class="pricing-option">
                                <h4>Starter</h4>
                                <p class="price">$29/month</p>
                                <p>For small businesses</p>
                            </div>
                            <div class="pricing-option highlighted">
                                <h4>Professional</h4>
                                <p class="price">$79/month</p>
                                <p>Most popular</p>
                            </div>
                            <div class="pricing-option">
                                <h4>Enterprise</h4>
                                <p class="price">Custom</p>
                                <p>For large organizations</p>
                            </div>
                        </div>
                    </div>
                `
            };
        } else if (lowerMessage.includes('demo') || lowerMessage.includes('try')) {
            return {
                text: "You're experiencing a demo of ChatSites right now! This is how your customers would interact with your website. Would you like to see how it works in a specific industry context?",
                dynamicContent: null
            };
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
            return {
                text: "Our support team is available 24/7. You can reach us at support@chatsites.com or call us at (555) 123-4567. Would you like me to connect you with a support agent?",
                dynamicContent: `
                    <div class="contact-card">
                        <h3>Contact Us</h3>
                        <p><i class="fas fa-envelope"></i> support@chatsites.com</p>
                        <p><i class="fas fa-phone"></i> (555) 123-4567</p>
                        <button class="contact-button">Connect with Support</button>
                    </div>
                `
            };
        } else {
            return {
                text: "I understand you're interested in ChatSites. Our platform transforms static websites into interactive, conversational experiences. How can I assist you with your specific needs?",
                dynamicContent: null
            };
        }
    }
}
        help: {
            text: "I can help you with information about our services, show you product demos, or assist with booking appointments. What would you like to know?",
            dynamicContent: null
        },
        product: {
            text: "We offer a range of AI-powered conversational website solutions. Here are our featured products:",
            dynamicContent: `
                <h3>Featured Products</h3>
                <div class="product-cards">
                    <div class="product-card">
                        <img src="images/product-starter.png" alt="Starter Package">
                        <h4>Starter Package</h4>
                        <p>Basic AI assistant integration for your website</p>
                        <button class="product-button">Learn More</button>
                    </div>
                    <div class="product-card">
                        <img src="images/product-pro.png" alt="Professional Package">
                        <h4>Professional Package</h4>
                        <p>Advanced features with custom branding</p>
                        <button class="product-button">Learn More</button>
                    </div>
                    <div class="product-card">
                        <img src="images/product-enterprise.png" alt="Enterprise Package">
                        <h4>Enterprise Package</h4>
                        <p>Full-featured solution with dedicated support</p>
                        <button class="product-button">Learn More</button>
                    </div>
                </div>
            `
        },
        booking: {
            text: "I'd be happy to help you book an appointment. Please select a date and time that works for you:",
            dynamicContent: `
                <h3>Book an Appointment</h3>
                <div class="booking-form">
                    <div class="form-group">
                        <label>Select Date</label>
                        <input type="date" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Select Time</label>
                        <select class="form-control">
                            <option>9:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>1:00 PM</option>
                            <option>2:00 PM</option>
                            <option>3:00 PM</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Your Name</label>
                        <input type="text" class="form-control" placeholder="Enter your name">
                    </div>
                    <div class="form-group">
                        <label>Your Email</label>
                        <input type="email" class="form-control" placeholder="Enter your email">
                    </div>
                    <button class="booking-button">Book Appointment</button>
                </div>
            `
        },
        pricing: {
            text: "Our pricing is based on your specific needs. Here's our standard pricing structure:",
            dynamicContent: `
                <h3>Pricing Plans</h3>
                <div class="pricing-table">
                    <div class="pricing-plan">
                        <h4>Basic</h4>
                        <div class="price">$99<span>/month</span></div>
                        <ul>
                            <li>AI Assistant Integration</li>
                            <li>Text-based Chat</li>
                            <li>Basic Customization</li>
                            <li>Email Support</li>
                        </ul>
                        <button class="pricing-button">Get Started</button>
                    </div>
                    <div class="pricing-plan featured">
                        <div class="popular-tag">Most Popular</div>
                        <h4>Professional</h4>
                        <div class="price">$199<span>/month</span></div>
                        <ul>
                            <li>Everything in Basic</li>
                            <li>Voice Integration</li>
                            <li>Dynamic Content Display</li>
                            <li>Priority Support</li>
                        </ul>
                        <button class="pricing-button">Get Started</button>
                    </div>
                    <div class="pricing-plan">
                        <h4>Enterprise</h4>
                        <div class="price">$499<span>/month</span></div>
                        <ul>
                            <li>Everything in Professional</li>
                            <li>Custom AI Training</li>
                            <li>Advanced Analytics</li>
                            <li>Dedicated Account Manager</li>
                        </ul>
                        <button class="pricing-button">Get Started</button>
                    </div>
                </div>
            `
        },
        demo: {
            text: "Here's a quick demo of how ChatSites can transform your website:",
            dynamicContent: `
                <h3>ChatSites in Action</h3>
                <div class="video-demo">
                    <div class="video-placeholder">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                        <p>ChatSites Demo Video</p>
                    </div>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-comment"></i>
                            <p>Natural Conversations</p>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-microphone"></i>
                            <p>Voice Commands</p>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-mobile-alt"></i>
                            <p>Mobile Optimized</p>
                        </div>
                    </div>
                </div>
            `
        },
        default: {
            text: "I understand you're interested in ChatSites. Our AI-powered portal can transform your website into an interactive, conversational experience. What specific aspect would you like to know more about?",
            dynamicContent: null
        }
    };
    
    return {
        // Simulate processing a user message
        processUserMessage: function(message) {
            return new Promise((resolve) => {
                // Simulate API processing time
                setTimeout(() => {
                    const lowerMessage = message.toLowerCase();
                    let response;
                    
                    // Simple pattern matching for demo purposes
                    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                        response = sampleResponses.greeting;
                    } 
                    else if (lowerMessage.includes('help')) {
                        response = sampleResponses.help;
                    }
                    else if (lowerMessage.includes('product') || lowerMessage.includes('service')) {
                        response = sampleResponses.product;
                    }
                    else if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
                        response = sampleResponses.booking;
                    }
                    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
                        response = sampleResponses.pricing;
                    }
                    else if (lowerMessage.includes('demo') || lowerMessage.includes('example')) {
                        response = sampleResponses.demo;
                    }
                    else {
                        response = sampleResponses.default;
                    }
                    
                    resolve(response);
                }, 1500); // Simulate processing delay
            });
        },
        
        // In a real implementation, these methods would connect to the OpenAI Realtime API
        startConversation: function() {
            console.log('Starting conversation with simulated Realtime API');
            return {
                id: 'sim_' + Math.random().toString(36).substring(2, 15)
            };
        },
        
        sendAudio: function(audioData) {
            console.log('Sending audio data to simulated Realtime API');
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        transcript: 'Simulated transcript from audio',
                        confidence: 0.95
                    });
                }, 500);
            });
        },
        
        sendText: function(text) {
            console.log('Sending text to simulated Realtime API:', text);
            return this.processUserMessage(text);
        }
    };
}

// Function to add enhanced AI assistant styles
function addAIAssistantStyles() {
    // Check if styles already exist
    if (!document.getElementById('ai-assistant-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'ai-assistant-styles';
        styleSheet.textContent = `
            /* Enhanced message styling */
            .assistant-message-container, .user-message-container {
                margin-bottom: 15px;
                max-width: 100%;
                display: flex;
            }
            
            .assistant-message-container {
                justify-content: flex-start;
            }
            
            .user-message-container {
                justify-content: flex-end;
            }
            
            .assistant-message {
                background-color: white;
                padding: 12px 16px;
                border-radius: 18px;
                border-top-left-radius: 4px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                max-width: 80%;
                position: relative;
                animation: fadeInLeft 0.3s ease-out forwards;
            }
            
            .user-message {
                background-color: #f65228;
                color: white;
                padding: 12px 16px;
                border-radius: 18px;
                border-top-right-radius: 4px;
                max-width: 80%;
                position: relative;
                animation: fadeInRight 0.3s ease-out forwards;
            }
            
            @keyframes fadeInLeft {
                from { opacity: 0; transform: translateX(-10px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes fadeInRight {
                from { opacity: 0; transform: translateX(10px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            /* Typing animation */
            .typing::after {
                content: '|';
                animation: blink 1s infinite;
            }
            
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            
            /* Enhanced thinking animation */
            .thinking-waves {
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }
            
            .thinking-wave {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: rgba(246, 82, 40, 0.7);
                animation: thinkingWave 1.5s infinite ease-in-out;
            }
            
            .thinking-wave:nth-child(1) { animation-delay: 0s; }
            .thinking-wave:nth-child(2) { animation-delay: 0.2s; }
            .thinking-wave:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes thinkingWave {
                0%, 100% { transform: scale(0.5); opacity: 0.5; }
                50% { transform: scale(1); opacity: 1; }
            }
            
            /* Enhanced input area */
            .user-input {
                position: relative;
                margin-top: 15px;
            }
            
            .user-input input {
                padding-right: 90px;
                transition: all 0.3s ease;
                border-color: #e2e8f0;
            }
            
            .user-input input:focus {
                border-color: #f65228;
                box-shadow: 0 0 0 2px rgba(246, 82, 40, 0.2);
                outline: none;
            }
            
            .user-input button {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                transition: all 0.3s ease;
            }
            
            #voice-input-button {
                right: 50px;
            }
            
            #send-button {
                right: 5px;
            }
            
            /* Enhanced button hover effects */
            .user-input button:hover {
                transform: translateY(-50%) scale(1.1);
                background-color: #d43e1a;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}
