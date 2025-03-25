// Main JavaScript file for ChatSites Portal

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initTabs();
    initPortalDemo();
    initRealTimeEditingDemo();
    initUseCase();
    initModal();
    
    // Update todo list
    updateTodoList();
});

// Initialize tabs in the explainer section
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize portal demo
function initPortalDemo() {
    const activateButton = document.getElementById('activate-portal');
    const startDemoButton = document.getElementById('start-demo');
    const portalWelcome = document.getElementById('portal-welcome');
    const aiAssistant = document.getElementById('ai-assistant');
    
    // Activate portal from welcome screen
    if (activateButton) {
        activateButton.addEventListener('click', () => {
            portalWelcome.classList.remove('active');
            portalWelcome.classList.add('hidden');
            aiAssistant.classList.remove('hidden');
            aiAssistant.classList.add('active');
            
            // Simulate initial greeting with voice
            setTimeout(() => {
                playWelcomeMessage();
            }, 500);
        });
    }
    
    // Start demo from hero section
    if (startDemoButton) {
        startDemoButton.addEventListener('click', () => {
            // Scroll to portal demo if not in view
            const portalDemo = document.querySelector('.portal-demo-container');
            portalDemo.scrollIntoView({ behavior: 'smooth' });
            
            // Activate portal after scrolling
            setTimeout(() => {
                if (portalWelcome.classList.contains('active')) {
                    portalWelcome.classList.remove('active');
                    portalWelcome.classList.add('hidden');
                    aiAssistant.classList.remove('hidden');
                    aiAssistant.classList.add('active');
                    
                    // Simulate initial greeting with voice
                    setTimeout(() => {
                        playWelcomeMessage();
                    }, 500);
                }
            }, 1000);
        });
    }
    
    // Set up text input and send button
    const textInput = document.getElementById('text-input');
    const sendButton = document.getElementById('send-button');
    const voiceButton = document.getElementById('voice-input-button');
    const assistantMessages = document.getElementById('assistant-messages');
    
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
        
        // Voice input button
        if (voiceButton) {
            voiceButton.addEventListener('click', () => {
                toggleVoiceInput();
            });
        }
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
            
            // Process user message and generate response
            setTimeout(() => {
                processUserMessage(message);
            }, 1500);
        }
    }
    
    // Function to add message to chat
    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(`${sender}-message`);
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        
        messageElement.appendChild(messageText);
        assistantMessages.appendChild(messageElement);
        
        // Scroll to bottom of messages
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }
    
    // Function to simulate AI thinking with orb animation
    function simulateAiThinking() {
        const orb = document.getElementById('ai-orb');
        orb.classList.add('thinking');
        
        // Increase pulse animation speed
        const orbPulse = document.querySelector('.orb-pulse');
        orbPulse.style.animation = 'pulse 0.8s infinite';
    }
    
    // Function to stop AI thinking animation
    function stopAiThinking() {
        const orb = document.getElementById('ai-orb');
        orb.classList.remove('thinking');
        
        // Reset pulse animation
        const orbPulse = document.querySelector('.orb-pulse');
        orbPulse.style.animation = 'pulse 2s infinite';
    }
    
    // Function to process user message and generate response
    function processUserMessage(message) {
        let response = '';
        let showDynamicContent = false;
        let dynamicContentHTML = '';
        
        // Simple pattern matching for demo purposes
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = "Hello! I'm your ChatSites assistant. How can I help you today?";
        } 
        else if (lowerMessage.includes('help')) {
            response = "I can help you with information about our services, show you product demos, or assist with booking appointments. What would you like to know?";
        }
        else if (lowerMessage.includes('product') || lowerMessage.includes('service')) {
            response = "We offer a range of AI-powered conversational website solutions. Would you like to see our featured products?";
            showDynamicContent = true;
            dynamicContentHTML = `
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
            `;
        }
        else if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
            response = "I'd be happy to help you book an appointment. Please select a date and time that works for you:";
            showDynamicContent = true;
            dynamicContentHTML = `
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
            `;
        }
        else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
            response = "Our pricing is based on your specific needs. Here's our standard pricing structure:";
            showDynamicContent = true;
            dynamicContentHTML = `
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
            `;
        }
        else if (lowerMessage.includes('demo') || lowerMessage.includes('example')) {
            response = "Here's a quick demo of how ChatSites can transform your website:";
            showDynamicContent = true;
            dynamicContentHTML = `
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
            `;
        }
        else {
            response = "I understand you're interested in ChatSites. Our AI-powered portal can transform your website into an interactive, conversational experience. What specific aspect would you like to know more about?";
        }
        
        // Stop thinking animation
        stopAiThinking();
        
        // Add AI response to chat
        addMessageToChat('assistant', response);
        
        // Speak the response
        speakText(response);
        
        // Show dynamic content if needed
        if (showDynamicContent) {
            const dynamicContent = document.getElementById('dynamic-content');
            dynamicContent.innerHTML = dynamicContentHTML;
            dynamicContent.classList.remove('hidden');
            
            // Add CSS for dynamic content
            addDynamicContentStyles();
        }
    }
    
    // Function to add dynamic content styles
    function addDynamicContentStyles() {
        // Check if styles already exist
        if (!document.getElementById('dynamic-content-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'dynamic-content-styles';
            styleSheet.textContent = `
                #dynamic-content {
                    margin-top: 20px;
                    padding: 20px;
                    border-radius: 8px;
                    background-color: #1a202c;
                    color: white;
                }
                
                #dynamic-content h3 {
                    margin-bottom: 20px;
                    color: #f65228;
                }
                
                .product-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .product-card {
                    background-color: #2d3748;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                }
                
                .product-card img {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 15px;
                    background-color: #4a5568;
                    border-radius: 50%;
                    padding: 10px;
                }
                
                .product-card h4 {
                    margin-bottom: 10px;
                    color: white;
                }
                
                .product-card p {
                    font-size: 0.9rem;
                    color: #a0aec0;
                    margin-bottom: 15px;
                }
                
                .product-button {
                    background-color: #f65228;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                
                .booking-form {
                    background-color: #2d3748;
                    border-radius: 8px;
                    padding: 20px;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #e2e8f0;
                }
                
                .form-control {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #4a5568;
                    border-radius: 4px;
                    background-color: #1a202c;
                    color: white;
                }
                
                .booking-button {
                    background-color: #f65228;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 10px 20px;
                    font-size: 1rem;
                    cursor: pointer;
                    width: 100%;
                    margin-top: 10px;
                }
                
                .pricing-table {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .pricing-plan {
                    background-color: #2d3748;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    position: relative;
                }
                
                .pricing-plan.featured {
                    border: 2px solid #f65228;
                }
                
                .popular-tag {
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #f65228;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                
                .pricing-plan h4 {
                    margin-bottom: 15px;
                    color: white;
                }
                
                .price {
                    font-size: 2rem;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 20px;
                }
                
                .price span {
                    font-size: 1rem;
                    color: #a0aec0;
                }
                
                .pricing-plan ul {
                    list-style: none;
                    padding: 0;
                    margin-bottom: 20px;
                }
                
                .pricing-plan ul li {
                    padding: 8px 0;
                    border-bottom: 1px solid #4a5568;
                    color: #e2e8f0;
                }
                
                .pricing-button {
                    background-color: #f65228;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 10px 20px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    width: 100%;
                }
                
                .video-demo {
                    background-color: #2d3748;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .video-placeholder {
                    height: 200px;
                    background-color: #1a202c;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                
                .play-button {
                    width: 60px;
                    height: 60px;
                    background-color: rgba(246, 82, 40, 0.8);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 15px;
                }
                
                .play-button i {
                    font-size: 1.5rem;
                    color: white;
                }
                
                .demo-features {
                    display: flex;
                    justify-content: space-around;
                    padding: 15px;
                }
                
                .demo-feature {
                    text-align: center;
                }
                
                .demo-feature i {
                    font-size: 1.5rem;
                    color: #f65228;
                    margin-bottom: 10px;
                }
                
                .demo-feature p {
                    font-size: 0.9rem;
                    color: #e2e8f0;
                    margin: 0;
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }
}

// Function to play welcome message
function playWelcomeMessage() {
    const welcomeMessage = "Hello! I'm your ChatSites assistant. How can I help you today?";
    speakText(welcomeMessage);
}

// Function to speak text using Web Speech API
function speakText(text) {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        
        // Use a female voice if available
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
        if (femaleVoice) {
            speech.voice = femaleVoice;
        }
        
        window.speechSynthesis.speak(speech);
    }
}

// Function to toggle voice input
function toggleVoiceInput() {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        
        // Change microphone button appearance
        const voiceButton = document.getElementById('voice-input-button');
        voiceButton.classList.add('listening');
        voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        
        // Start listening
        recognition.start();
        
        // Handle results
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('text-input').value = transcript;
            
            // Reset microphone button
            voiceButton.classList.remove('listening');
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            
            // Send message after a short delay
            setTimeout(() => {
                document.getElementById('send-button').click();
            }, 500);
        };
        
        // Handle end of speech
        recognition.onend = function() {
            voiceButton.classList.remove('listening');
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        };
        
        // Handle errors
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            voiceButton.classList.remove('listening');
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        };
    } else {
        alert('Speech recognition is not supported in your browser. Please use Chrome or Edge for this feature.');
    }
}

// Initialize real-time editing demo
function initRealTimeEditingDemo() {
    const editVoiceCommand = document.getElementById('edit-voice-command');
    const editTextCommand = document.getElementById('edit-text-command');
    const sendEditCommand = document.getElementById('send-edit-command');
    const editingResult = document.getElementById('editing-result');
    const updatedContent = document.getElementById('updated-content');
    
    if (editVoiceCommand && editTextCommand && sendEditCommand) {
        // Voice command button
        editVoiceCommand.addEventListener('click', () => {
            // Simulate voice command for demo
            editTextCommand.value = "Update my hours to 9am–5pm on weekdays";
            
            // Process command after a short delay
            setTimeout(() => {
                processEditCommand();
            }, 500);
        });
        
        // Send command button
        sendEditCommand.addEventListener('click', () => {
            processEditCommand();
        });
        
        // Enter key in text input
        editTextCommand.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processEditCommand();
            }
        });
    }
    
    // Function to process edit command
    function processEditCommand() {
        const command = editTextCommand.value.trim();
        if (command) {
            // Update content based on command
            if (command.toLowerCase().includes('hours') && command.toLowerCase().includes('9am') && command.toLowerCase().includes('5pm')) {
                updatedContent.innerHTML = `
                    <p>Monday - Friday: 9am - 5pm</p>
                    <p>Saturday: 10am - 4pm</p>
                    <p>Sunday: Closed</p>
                `;
                
                // Show result
                editingResult.classList.remove('hidden');
                
                // Clear command
                editTextCommand.value = '';
            }
        }
    }
}

// Initialize use case demos
function initUseCase() {
    const useCaseButtons = document.querySelectorAll('.try-use-case');
    
    useCaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const useCase = button.parentElement.getAttribute('data-use-case');
            
            // Scroll to portal demo
            const portalDemo = document.querySelector('.portal-demo-container');
            portalDemo.scrollIntoView({ behavior: 'smooth' });
            
            // Activate portal if not already active
            setTimeout(() => {
                const portalWelcome = document.getElementById('portal-welcome');
                const aiAssistant = document.getElementById('ai-assistant');
                
                if (portalWelcome.classList.contains('active')) {
                    portalWelcome.classList.remove('active');
                    portalWelcome.classList.add('hidden');
                    aiAssistant.classList.remove('hidden');
                    aiAssistant.classList.add('active');
                }
                
                // Load use case demo
                setTimeout(() => {
                    loadUseCase(useCase);
                }, 500);
            }, 1000);
        });
    });
    
    // Function to load use case demo
    function loadUseCase(useCase) {
        const assistantMessages = document.getElementById('assistant-messages');
        const dynamicContent = document.getElementById('dynamic-content');
        
        // Clear previous messages
        assistantMessages.innerHTML = '';
        
        // Add welcome message based on use case
        let welcomeMessage = '';
        let dynamicContentHTML = '';
        
        switch (useCase) {
            case 'real-estate':
                welcomeMessage = "Welcome to Dream Home Realty! I'm your virtual assistant. I can help you find properties, schedule viewings, or answer questions about neighborhoods. How can I assist you today?";
                dynamicContentHTML = `
                    <h3>Featured Properties</h3>
                    <div class="property-listings">
                        <div class="property-card">
                            <div class="property-image"></div>
                            <h4>Modern Downtown Condo</h4>
                            <p class="property-price">$425,000</p>
                            <p class="property-details">2 bed | 2 bath | 1,200 sq ft</p>
                            <button class="property-button">View Details</button>
                        </div>
                        <div class="property-card">
                            <div class="property-image"></div>
                            <h4>Suburban Family Home</h4>
                            <p class="property-price">$650,000</p>
                            <p class="property-details">4 bed | 3 bath | 2,500 sq ft</p>
                            <button class="property-button">View Details</button>
                        </div>
                        <div class="property-card">
                            <div class="property-image"></div>
                            <h4>Luxury Waterfront Villa</h4>
                            <p class="property-price">$1,250,000</p>
                            <p class="property-details">5 bed | 4.5 bath | 4,200 sq ft</p>
                            <button class="property-button">View Details</button>
                        </div>
                    </div>
                `;
                break;
                
            case 'ecommerce':
                welcomeMessage = "Welcome to Fashion Forward! I'm your personal shopping assistant. I can help you find products, check availability, or process your order. What are you looking for today?";
                dynamicContentHTML = `
                    <h3>Trending Products</h3>
                    <div class="product-grid">
                        <div class="product-item">
                            <div class="product-image"></div>
                            <h4>Premium Leather Jacket</h4>
                            <p class="product-price">$199.99</p>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>(42)</span>
                            </div>
                            <button class="add-to-cart">Add to Cart</button>
                        </div>
                        <div class="product-item">
                            <div class="product-image"></div>
                            <h4>Designer Sunglasses</h4>
                            <p class="product-price">$89.99</p>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                                <span>(28)</span>
                            </div>
                            <button class="add-to-cart">Add to Cart</button>
                        </div>
                        <div class="product-item">
                            <div class="product-image"></div>
                            <h4>Smart Watch Pro</h4>
                            <p class="product-price">$249.99</p>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <span>(107)</span>
                            </div>
                            <button class="add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                `;
                break;
                
            case 'education':
                welcomeMessage = "Welcome to Growth Mindset Academy! I'm your learning assistant. I can help you find courses, track your progress, or connect with instructors. What would you like to learn today?";
                dynamicContentHTML = `
                    <h3>Popular Courses</h3>
                    <div class="course-list">
                        <div class="course-card">
                            <div class="course-image"></div>
                            <div class="course-badge">Bestseller</div>
                            <h4>Digital Marketing Mastery</h4>
                            <p class="course-instructor">By Sarah Johnson</p>
                            <div class="course-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>4.8 (2,145 students)</span>
                            </div>
                            <p class="course-price">$89.99</p>
                            <button class="enroll-button">Enroll Now</button>
                        </div>
                        <div class="course-card">
                            <div class="course-image"></div>
                            <div class="course-badge">New</div>
                            <h4>Data Science Fundamentals</h4>
                            <p class="course-instructor">By Michael Chen</p>
                            <div class="course-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                                <span>4.2 (876 students)</span>
                            </div>
                            <p class="course-price">$129.99</p>
                            <button class="enroll-button">Enroll Now</button>
                        </div>
                        <div class="course-card">
                            <div class="course-image"></div>
                            <h4>Leadership & Management</h4>
                            <p class="course-instructor">By Dr. Lisa Thompson</p>
                            <div class="course-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <span>4.9 (3,421 students)</span>
                            </div>
                            <p class="course-price">$149.99</p>
                            <button class="enroll-button">Enroll Now</button>
                        </div>
                    </div>
                `;
                break;
                
            case 'support':
                welcomeMessage = "Welcome to TechSupport Hub! I'm your support assistant. I can help troubleshoot issues, find solutions, or connect you with a human agent if needed. What can I help you with today?";
                dynamicContentHTML = `
                    <h3>Common Support Topics</h3>
                    <div class="support-topics">
                        <div class="support-topic">
                            <div class="topic-icon"><i class="fas fa-wifi"></i></div>
                            <h4>Internet Connectivity</h4>
                            <p>Troubleshoot connection issues and network problems</p>
                            <button class="topic-button">Get Help</button>
                        </div>
                        <div class="support-topic">
                            <div class="topic-icon"><i class="fas fa-lock"></i></div>
                            <h4>Account Security</h4>
                            <p>Password resets and security settings</p>
                            <button class="topic-button">Get Help</button>
                        </div>
                        <div class="support-topic">
                            <div class="topic-icon"><i class="fas fa-credit-card"></i></div>
                            <h4>Billing Issues</h4>
                            <p>Payment problems and subscription management</p>
                            <button class="topic-button">Get Help</button>
                        </div>
                    </div>
                    <div class="support-contact">
                        <p>Need urgent help?</p>
                        <button class="contact-button"><i class="fas fa-phone"></i> Call Support</button>
                        <button class="contact-button"><i class="fas fa-comment"></i> Live Chat</button>
                    </div>
                `;
                break;
                
            case 'healthcare':
                welcomeMessage = "Welcome to Wellness Medical Center! I'm your healthcare assistant. I can help schedule appointments, provide general health information, or connect you with specialists. How may I assist you today?";
                dynamicContentHTML = `
                    <h3>Our Services</h3>
                    <div class="healthcare-services">
                        <div class="service-card">
                            <div class="service-icon"><i class="fas fa-user-md"></i></div>
                            <h4>Primary Care</h4>
                            <p>Comprehensive healthcare for patients of all ages</p>
                            <button class="service-button">Book Appointment</button>
                        </div>
                        <div class="service-card">
                            <div class="service-icon"><i class="fas fa-heartbeat"></i></div>
                            <h4>Cardiology</h4>
                            <p>Specialized care for heart and cardiovascular conditions</p>
                            <button class="service-button">Book Appointment</button>
                        </div>
                        <div class="service-card">
                            <div class="service-icon"><i class="fas fa-brain"></i></div>
                            <h4>Neurology</h4>
                            <p>Expert diagnosis and treatment of neurological disorders</p>
                            <button class="service-button">Book Appointment</button>
                        </div>
                    </div>
                    <div class="healthcare-hours">
                        <h4>Hours of Operation</h4>
                        <p>Monday - Friday: 8am - 6pm</p>
                        <p>Saturday: 9am - 1pm</p>
                        <p>Sunday: Closed</p>
                        <p class="emergency-note">For emergencies, please call 911 or visit your nearest emergency room.</p>
                    </div>
                `;
                break;
                
            default:
                welcomeMessage = "Welcome to ChatSites! I'm your virtual assistant. How can I help you today?";
        }
        
        // Add welcome message
        const messageElement = document.createElement('div');
        messageElement.classList.add('assistant-message');
        
        const messageText = document.createElement('p');
        messageText.textContent = welcomeMessage;
        
        messageElement.appendChild(messageText);
        assistantMessages.appendChild(messageElement);
        
        // Speak welcome message
        speakText(welcomeMessage);
        
        // Show dynamic content
        if (dynamicContentHTML) {
            dynamicContent.innerHTML = dynamicContentHTML;
            dynamicContent.classList.remove('hidden');
            
            // Add CSS for use case content
            addUseCaseStyles();
        }
    }
    
    // Function to add use case styles
    function addUseCaseStyles() {
        // Check if styles already exist
        if (!document.getElementById('use-case-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'use-case-styles';
            styleSheet.textContent = `
                /* Real Estate Styles */
                .property-listings {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .property-card {
                    background-color: #2d3748;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .property-image {
                    height: 120px;
                    background-color: #4a5568;
                    background-image: linear-gradient(45deg, #4a5568 25%, #2d3748 25%, #2d3748 50%, #4a5568 50%, #4a5568 75%, #2d3748 75%, #2d3748 100%);
                    background-size: 20px 20px;
                }
                
                .property-card h4 {
                    padding: 15px 15px 5px;
                    margin: 0;
                    color: white;
                }
                
                .property-price {
                    padding: 0 15px;
                    margin: 0 0 5px;
                    color: #f65228;
                    font-weight: bold;
                }
                
                .property-details {
                    padding: 0 15px 15px;
                    margin: 0;
                    color: #a0aec0;
                    font-size: 0.9rem;
                }
                
                .property-button {
                    width: 100%;
                    padding: 10px;
                    background-color: #f65228;
                    color: white;
                    border: none;
                    font-weight: 500;
                    cursor: pointer;
                }
                
                /* E-commerce Styles */
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .product-item {
                    background-color: #2d3748;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                }
                
                .product-image {
                    height: 120px;
                    background-color: #4a5568;
                    border-radius: 4px;
                    margin-bottom: 15px;
                    background-image: linear-gradient(135deg, #4a5568 25%, #2d3748 25%, #2d3748 50%, #4a5568 50%, #4a5568 75%, #2d3748 75%, #2d3748 100%);
                    background-size: 20px 20px;
                }
                
                .product-item h4 {
                    margin-bottom: 10px;
                    color: white;
                }
                
                .product-price {
                    color: #f65228;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .product-rating {
                    color: #f6e05e;
                    margin-bottom: 15px;
                }
                
                .product-rating span {
                    color: #a0aec0;
                    margin-left: 5px;
                }
                
                .add-to-cart {
                    background-color: #f65228;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    width: 100%;
                }
                
                /* Education Styles */
                .course-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }
                
                .course-card {
                    background-color: #2d3748;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                }
                
                .course-image {
                    height: 140px;
                    background-color: #4a5568;
                    background-image: linear-gradient(60deg, #4a5568 25%, #2d3748 25%, #2d3748 50%, #4a5568 50%, #4a5568 75%, #2d3748 75%, #2d3748 100%);
                    background-size: 20px 20px;
                }
                
                .course-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: #f65228;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                
                .course-card h4 {
                    padding: 15px 15px 5px;
                    margin: 0;
                    color: white;
                }
                
                .course-instructor {
                    padding: 0 15px;
                    margin: 0 0 10px;
                    color: #a0aec0;
                    font-size: 0.9rem;
                }
                
                .course-rating {
                    padding: 0 15px;
                    margin: 0 0 10px;
                    color: #f6e05e;
                    font-size: 0.9rem;
                }
                
                .course-rating span {
                    color: #a0aec0;
                    margin-left: 5px;
                }
                
                .course-price {
                    padding: 0 15px;
                    margin: 0 0 15px;
                    color: #f65228;
                    font-weight: bold;
                }
                
                .enroll-button {
                    width: 100%;
                    padding: 10px;
                    background-color: #f65228;
                    color: white;
                    border: none;
                    font-weight: 500;
                    cursor: pointer;
                }
                
                /* Support Styles */
                .support-topics {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .support-topic {
                    background-color: #2d3748;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                }
                
                .topic-icon {
                    width: 60px;
                    height: 60px;
                    background-color: rgba(246, 82, 40, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                }
                
                .topic-icon i {
                    font-size: 1.5rem;
                    color: #f65228;
                }
                
                .support-topic h4 {
                    margin-bottom: 10px;
                    color: white;
                }
                
                .support-topic p {
                    color: #a0aec0;
                    margin-bottom: 15px;
                    font-size: 0.9rem;
                }
                
                .topic-button {
                    background-color: transparent;
                    color: #f65228;
                    border: 1px solid #f65228;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                
                .support-contact {
                    background-color: #2d3748;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                }
                
                .support-contact p {
                    color: white;
                    margin-bottom: 15px;
                }
                
                .contact-button {
                    background-color: #f65228;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 10px 20px;
                    margin: 0 10px;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                
                /* Healthcare Styles */
                .healthcare-services {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .service-card {
                    background-color: #2d3748;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                }
                
                .service-icon {
                    width: 60px;
                    height: 60px;
                    background-color: rgba(246, 82, 40, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                }
                
                .service-icon i {
                    font-size: 1.5rem;
                    color: #f65228;
                }
                
                .service-card h4 {
                    margin-bottom: 10px;
                    color: white;
                }
                
                .service-card p {
                    color: #a0aec0;
                    margin-bottom: 15px;
                    font-size: 0.9rem;
                }
                
                .service-button {
                    background-color: #f65228;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                
                .healthcare-hours {
                    background-color: #2d3748;
                    border-radius: 8px;
                    padding: 20px;
                }
                
                .healthcare-hours h4 {
                    color: white;
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .healthcare-hours p {
                    color: #e2e8f0;
                    margin-bottom: 5px;
                    text-align: center;
                }
                
                .emergency-note {
                    margin-top: 15px;
                    color: #f65228;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }
}

// Initialize modal
function initModal() {
    const modal = document.getElementById('demo-modal');
    const watchDemoButton = document.getElementById('watch-demo-button');
    const closeModal = document.querySelector('.close-modal');
    
    if (modal && watchDemoButton && closeModal) {
        // Open modal
        watchDemoButton.addEventListener('click', () => {
            modal.style.display = 'flex';
            
            // Set video source (placeholder for demo)
            const iframe = modal.querySelector('iframe');
            iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Placeholder video
        });
        
        // Close modal
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            
            // Reset video source
            const iframe = modal.querySelector('iframe');
            iframe.src = 'about:blank';
        });
        
        // Close modal when clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                
                // Reset video source
                const iframe = modal.querySelector('iframe');
                iframe.src = 'about:blank';
            }
        });
    }
}

// Update todo list
function updateTodoList() {
    // This function would update the todo.md file in a real implementation
    console.log('Todo list updated');
}
