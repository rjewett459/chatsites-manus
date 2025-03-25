// Use Case Walkthrough Cards functionality
// This file implements the interactive walkthroughs for different industry scenarios

document.addEventListener('DOMContentLoaded', function() {
    // Initialize use case walkthrough cards
    initUseCaseWalkthroughs();
});

function initUseCaseWalkthroughs() {
    // Add walkthrough modal to the page
    addWalkthroughModal();
    
    // Set up event listeners for use case cards
    setupUseCaseCardListeners();
    
    // Create walkthrough content for each industry
    createWalkthroughContent();
}

// Function to add walkthrough modal to the page
function addWalkthroughModal() {
    // Check if modal already exists
    if (document.getElementById('walkthrough-modal')) return;
    
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'walkthrough-modal';
    modal.className = 'walkthrough-modal';
    
    // Add modal content
    modal.innerHTML = `
        <div class="walkthrough-content">
            <div class="walkthrough-header">
                <h2 class="walkthrough-title">Industry Walkthrough</h2>
                <p class="walkthrough-subtitle">See how ChatSites transforms customer experiences</p>
                <button class="close-walkthrough">&times;</button>
            </div>
            <div class="walkthrough-body">
                <div class="walkthrough-steps">
                    <!-- Steps will be added dynamically -->
                </div>
                <div class="walkthrough-content-area">
                    <!-- Content will be added dynamically -->
                </div>
                <div class="step-navigation">
                    <button class="step-button prev disabled">
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button class="step-button next">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modal);
    
    // Add event listener for close button
    const closeButton = modal.querySelector('.close-walkthrough');
    closeButton.addEventListener('click', () => {
        closeWalkthroughModal();
    });
    
    // Add event listener for clicking outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeWalkthroughModal();
        }
    });
    
    // Add event listeners for navigation buttons
    const prevButton = modal.querySelector('.step-button.prev');
    const nextButton = modal.querySelector('.step-button.next');
    
    prevButton.addEventListener('click', () => {
        if (!prevButton.classList.contains('disabled')) {
            navigateWalkthroughStep('prev');
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (!nextButton.classList.contains('disabled')) {
            navigateWalkthroughStep('next');
        }
    });
}

// Function to set up event listeners for use case cards
function setupUseCaseCardListeners() {
    // Get all use case cards
    const useCaseCards = document.querySelectorAll('.use-case-card');
    
    // Add click event listener to each card
    useCaseCards.forEach(card => {
        const tryButton = card.querySelector('.try-use-case');
        if (tryButton) {
            tryButton.addEventListener('click', () => {
                const useCase = card.getAttribute('data-use-case');
                openWalkthroughModal(useCase);
            });
        }
    });
}

// Function to open walkthrough modal for a specific use case
function openWalkthroughModal(useCase) {
    // Get modal element
    const modal = document.getElementById('walkthrough-modal');
    if (!modal) return;
    
    // Update modal title and subtitle based on use case
    const title = modal.querySelector('.walkthrough-title');
    const subtitle = modal.querySelector('.walkthrough-subtitle');
    
    // Set title and subtitle based on use case
    switch (useCase) {
        case 'real-estate':
            title.textContent = 'Real Estate Walkthrough';
            subtitle.textContent = 'See how ChatSites transforms property listings and viewings';
            break;
        case 'ecommerce':
            title.textContent = 'E-commerce Walkthrough';
            subtitle.textContent = 'See how ChatSites enhances online shopping experiences';
            break;
        case 'education':
            title.textContent = 'Education & Coaching Walkthrough';
            subtitle.textContent = 'See how ChatSites revolutionizes learning experiences';
            break;
        case 'support':
            title.textContent = 'Customer Support Walkthrough';
            subtitle.textContent = 'See how ChatSites streamlines customer service';
            break;
        case 'healthcare':
            title.textContent = 'Healthcare Walkthrough';
            subtitle.textContent = 'See how ChatSites improves patient experiences';
            break;
        default:
            title.textContent = 'Industry Walkthrough';
            subtitle.textContent = 'See how ChatSites transforms customer experiences';
    }
    
    // Load walkthrough steps and content
    loadWalkthroughContent(useCase);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Add animation class
    setTimeout(() => {
        modal.querySelector('.walkthrough-content').classList.add('animated');
    }, 10);
}

// Function to close walkthrough modal
function closeWalkthroughModal() {
    // Get modal element
    const modal = document.getElementById('walkthrough-modal');
    if (!modal) return;
    
    // Hide modal
    modal.style.display = 'none';
    
    // Reset active step
    window.currentWalkthroughStep = 0;
}

// Function to load walkthrough content for a specific use case
function loadWalkthroughContent(useCase) {
    // Get walkthrough steps and content areas
    const stepsContainer = document.querySelector('.walkthrough-steps');
    const contentArea = document.querySelector('.walkthrough-content-area');
    
    // Clear existing content
    stepsContainer.innerHTML = '';
    contentArea.innerHTML = '';
    
    // Get walkthrough data for the use case
    const walkthroughData = window.walkthroughContent[useCase] || window.walkthroughContent.default;
    
    // Add steps
    walkthroughData.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = `walkthrough-step ${index === 0 ? 'active' : ''}`;
        stepElement.textContent = step.title;
        stepElement.setAttribute('data-step', index);
        
        // Add click event to navigate to this step
        stepElement.addEventListener('click', () => {
            navigateToWalkthroughStep(index);
        });
        
        stepsContainer.appendChild(stepElement);
    });
    
    // Add content for each step
    walkthroughData.steps.forEach((step, index) => {
        const contentElement = document.createElement('div');
        contentElement.className = `step-content ${index === 0 ? 'active' : ''}`;
        contentElement.setAttribute('data-step', index);
        
        // Add content HTML
        contentElement.innerHTML = step.content;
        
        // Add to content area
        contentArea.appendChild(contentElement);
    });
    
    // Set current step
    window.currentWalkthroughStep = 0;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Initialize any interactive elements in the first step
    initializeStepInteractivity(0);
}

// Function to navigate to a specific walkthrough step
function navigateToWalkthroughStep(stepIndex) {
    // Get all step elements and content elements
    const stepElements = document.querySelectorAll('.walkthrough-step');
    const contentElements = document.querySelectorAll('.step-content');
    
    // Validate step index
    if (stepIndex < 0 || stepIndex >= stepElements.length) return;
    
    // Remove active class from all steps and content
    stepElements.forEach(el => el.classList.remove('active'));
    contentElements.forEach(el => el.classList.remove('active'));
    
    // Add active class to current step and content
    stepElements[stepIndex].classList.add('active');
    contentElements[stepIndex].classList.add('active');
    
    // Update current step
    window.currentWalkthroughStep = stepIndex;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Initialize any interactive elements in this step
    initializeStepInteractivity(stepIndex);
}

// Function to navigate walkthrough steps (prev/next)
function navigateWalkthroughStep(direction) {
    // Get current step
    const currentStep = window.currentWalkthroughStep;
    
    // Calculate new step index
    const newStep = direction === 'next' ? currentStep + 1 : currentStep - 1;
    
    // Navigate to new step
    navigateToWalkthroughStep(newStep);
}

// Function to update navigation buttons based on current step
function updateNavigationButtons() {
    // Get navigation buttons
    const prevButton = document.querySelector('.step-button.prev');
    const nextButton = document.querySelector('.step-button.next');
    
    // Get total number of steps
    const totalSteps = document.querySelectorAll('.walkthrough-step').length;
    
    // Update previous button
    if (window.currentWalkthroughStep === 0) {
        prevButton.classList.add('disabled');
    } else {
        prevButton.classList.remove('disabled');
    }
    
    // Update next button
    if (window.currentWalkthroughStep === totalSteps - 1) {
        nextButton.textContent = 'Finish';
        nextButton.innerHTML = 'Finish <i class="fas fa-check"></i>';
    } else {
        nextButton.textContent = 'Next';
        nextButton.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

// Function to initialize interactivity for a specific step
function initializeStepInteractivity(stepIndex) {
    // Get the current step content element
    const stepContent = document.querySelector(`.step-content[data-step="${stepIndex}"]`);
    if (!stepContent) return;
    
    // Initialize demo chat if present
    const demoChat = stepContent.querySelector('.demo-chat');
    const demoInput = stepContent.querySelector('.demo-input input');
    const demoButton = stepContent.querySelector('.demo-input button');
    
    if (demoChat && demoInput && demoButton) {
        // Clear any existing messages
        demoChat.innerHTML = '';
        
        // Add initial assistant message
        const initialMessage = stepContent.getAttribute('data-initial-message') || 'Hello! How can I help you today?';
        addDemoChatMessage('assistant', initialMessage);
        
        // Set up event listeners for demo chat
        demoButton.addEventListener('click', () => {
            sendDemoChatMessage(demoInput, demoChat);
        });
        
        demoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDemoChatMessage(demoInput, demoChat);
            }
        });
    }
    
    // Initialize any other interactive elements
    // ...
}

// Function to send a message in the demo chat
function sendDemoChatMessage(input, chat) {
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    addDemoChatMessage('user', message);
    
    // Clear input
    input.value = '';
    
    // Simulate assistant response after a delay
    setTimeout(() => {
        // Get a response based on the message
        const response = getDemoResponse(message);
        
        // Add assistant message
        addDemoChatMessage('assistant', response);
        
        // Scroll to bottom of chat
        chat.scrollTop = chat.scrollHeight;
    }, 1000);
}

// Function to add a message to the demo chat
function addDemoChatMessage(sender, message) {
    // Get the demo chat element
    const demoChat = document.querySelector('.demo-chat');
    if (!demoChat) return;
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `demo-message ${sender}`;
    messageElement.textContent = message;
    
    // Add to chat
    demoChat.appendChild(messageElement);
    
    // Scroll to bottom of chat
    demoChat.scrollTop = demoChat.scrollHeight;
}

// Function to get a demo response based on user message
function getDemoResponse(message) {
    // Simple pattern matching for demo purposes
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! I'm your ChatSites assistant. How can I help you today?";
    } 
    else if (lowerMessage.includes('property') || lowerMessage.includes('house') || lowerMessage.includes('home')) {
        return "I'd be happy to help you find the perfect property. We have several listings that might interest you. Would you like to see properties in a specific area or price range?";
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our properties range from $250,000 to $1.2 million. What's your budget range so I can show you suitable options?";
    }
    else if (lowerMessage.includes('appointment') || lowerMessage.includes('viewing') || lowerMessage.includes('tour')) {
        return "I can help you schedule a viewing. We have availability this week on Wednesday and Friday. Which day works better for you?";
    }
    else if (lowerMessage.includes('product') || lowerMessage.includes('item')) {
        return "We have several products that might interest you. Are you looking for something specific, or would you like to see our bestsellers?";
    }
    else if (lowerMessage.includes('course') || lowerMessage.includes('class') || lowerMessage.includes('learn')) {
        return "We offer a variety of courses for all skill levels. Our most popular courses are in digital marketing, web development, and business leadership. Which area interests you most?";
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('issue')) {
        return "I'm here to help! Could you please describe the issue you're experiencing in more detail so I can assist you better?";
    }
    else if (lowerMessage.includes('doctor') || lowerMessage.includes('appointment') || lowerMessage.includes('medical')) {
        return "I can help you schedule an appointment with one of our healthcare providers. We have openings this week. Would you prefer a morning or afternoon appointment?";
    }
    else {
        return "Thank you for your message. How else can I assist you with your needs today?";
    }
}

// Function to create walkthrough content for each industry
function createWalkthroughContent() {
    // Create global object to store walkthrough content
    window.walkthroughContent = {
        // Real Estate walkthrough
        'real-estate': {
            steps: [
                {
                    title: 'Introduction',
                    content: `
                        <div class="step-content-header">
                            <h3>Transforming Real Estate with ChatSites</h3>
                            <p>See how ChatSites revolutionizes property listings, viewings, and client interactions.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>The real estate industry relies heavily on personal connections and visual experiences. ChatSites transforms how properties are showcased and how agents interact with potential buyers.</p>
                                <p>With ChatSites, real estate websites become interactive platforms where visitors can:</p>
                                <ul>
                                    <li>Get instant answers about properties without waiting for an agent</li>
                                    <li>Take virtual property tours guided by an AI assistant</li>
                                    <li>Schedule viewings and appointments through natural conversation</li>
                                    <li>Receive personalized property recommendations based on their preferences</li>
                                </ul>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-home" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Property Search',
                    content: `
                        <div class="step-content-header">
                            <h3>Conversational Property Search</h3>
                            <p>Help clients find their dream home through natural conversation.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="Hello! I'm your real estate assistant. I can help you find properties, schedule viewings, or answer questions about neighborhoods. How can I help you today?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Conversational Property Search</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="I'm looking for a 3-bedroom house under $500,000">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites understands natural language queries about properties, allowing clients to search in the same way they'd talk to a real estate agent.</p>
                            <p>The AI can filter properties based on multiple criteria mentioned in a single conversation, saving time and creating a more natural search experience.</p>
                        </div>
                    `
                },
                {
                    title: 'Virtual Tours',
                    content: `
                        <div class="step-content-header">
                            <h3>AI-Guided Virtual Property Tours</h3>
                            <p>Let clients explore properties remotely with an AI guide.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>ChatSites can guide potential buyers through virtual property tours, highlighting key features and answering questions in real-time.</p>
                                <p>The AI assistant can:</p>
                                <ul>
                                    <li>Navigate through different rooms based on voice commands</li>
                                    <li>Highlight important features like renovations or appliances</li>
                                    <li>Provide additional context about the property and neighborhood</li>
                                    <li>Answer specific questions about dimensions, materials, or age</li>
                                </ul>
                                <p>This creates an immersive experience that helps buyers make informed decisions before scheduling in-person viewings.</p>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-vr-cardboard" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Scheduling',
                    content: `
                        <div class="step-content-header">
                            <h3>Seamless Appointment Scheduling</h3>
                            <p>Convert interest into viewings with frictionless scheduling.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="I've found several properties that match your criteria. Would you like to schedule a viewing for any of them?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Appointment Scheduling</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="Yes, I'd like to see the Colonial house on Friday">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites makes it easy for potential buyers to schedule property viewings without leaving the conversation.</p>
                            <p>The AI can check agent availability, suggest optimal viewing times, and add appointments directly to the agent's calendar.</p>
                        </div>
                    `
                }
            ]
        },
        
        // E-commerce walkthrough
        'ecommerce': {
            steps: [
                {
                    title: 'Introduction',
                    content: `
                        <div class="step-content-header">
                            <h3>Revolutionizing E-commerce with ChatSites</h3>
                            <p>See how ChatSites transforms online shopping experiences.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>E-commerce success depends on helping customers find the right products and making the purchase process as smooth as possible. ChatSites transforms online stores into interactive shopping experiences.</p>
                                <p>With ChatSites, e-commerce websites can:</p>
                                <ul>
                                    <li>Provide personalized product recommendations through conversation</li>
                                    <li>Answer detailed questions about products instantly</li>
                                    <li>Guide customers through complex purchase decisions</li>
                                    <li>Streamline checkout and handle post-purchase support</li>
                                </ul>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-shopping-cart" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Product Discovery',
                    content: `
                        <div class="step-content-header">
                            <h3>Conversational Product Discovery</h3>
                            <p>Help customers find exactly what they need through natural conversation.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="Welcome to Fashion Forward! I'm your personal shopping assistant. How can I help you find the perfect item today?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Product Discovery</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="I need a dress for a summer wedding">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites understands natural language queries about products, allowing customers to describe what they're looking for in their own words.</p>
                            <p>The AI can interpret complex requirements and preferences, then suggest relevant products that match the customer's needs.</p>
                        </div>
                    `
                },
                {
                    title: 'Product Details',
                    content: `
                        <div class="step-content-header">
                            <h3>Interactive Product Information</h3>
                            <p>Answer customer questions about products in real-time.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>ChatSites can provide detailed information about products, answering specific questions that customers might have before making a purchase.</p>
                                <p>The AI assistant can:</p>
                                <ul>
                                    <li>Explain product features and specifications</li>
                                    <li>Compare different products side-by-side</li>
                                    <li>Provide sizing guidance and compatibility information</li>
                                    <li>Share customer reviews and ratings</li>
                                </ul>
                                <p>This helps customers make informed purchase decisions and reduces return rates.</p>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-tag" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Checkout',
                    content: `
                        <div class="step-content-header">
                            <h3>Streamlined Checkout Process</h3>
                            <p>Guide customers through checkout with conversational assistance.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="I've added the Summer Floral Maxi Dress to your cart. Would you like to continue shopping or proceed to checkout?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Checkout Process</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="I'd like to checkout now">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites makes the checkout process smoother by guiding customers through each step and addressing any concerns that arise.</p>
                            <p>The AI can help with shipping options, promo code application, and payment methods, reducing cart abandonment rates.</p>
                        </div>
                    `
                }
            ]
        },
        
        // Education walkthrough
        'education': {
            steps: [
                {
                    title: 'Introduction',
                    content: `
                        <div class="step-content-header">
                            <h3>Transforming Education with ChatSites</h3>
                            <p>See how ChatSites enhances learning experiences and student engagement.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>Education and coaching businesses need to deliver personalized learning experiences at scale. ChatSites transforms educational websites into interactive learning platforms.</p>
                                <p>With ChatSites, education websites can:</p>
                                <ul>
                                    <li>Provide 24/7 personalized guidance to students</li>
                                    <li>Help learners find the right courses based on their goals</li>
                                    <li>Answer questions about course content and materials</li>
                                    <li>Facilitate enrollment and track learning progress</li>
                                </ul>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-graduation-cap" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Course Selection',
                    content: `
                        <div class="step-content-header">
                            <h3>Personalized Course Recommendations</h3>
                            <p>Help students find the perfect learning path through conversation.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="Welcome to Growth Mindset Academy! I'm your learning assistant. What skills are you interested in developing?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Course Selection</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="I want to learn digital marketing">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites understands learners' goals and preferences, recommending courses that align with their specific needs and skill level.</p>
                            <p>The AI can suggest learning paths that combine multiple courses for comprehensive skill development.</p>
                        </div>
                    `
                },
                {
                    title: 'Learning Support',
                    content: `
                        <div class="step-content-header">
                            <h3>Interactive Learning Assistance</h3>
                            <p>Provide on-demand help with course content and assignments.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>ChatSites can provide immediate assistance to students as they work through course materials, answering questions and clarifying concepts.</p>
                                <p>The AI assistant can:</p>
                                <ul>
                                    <li>Explain complex concepts in simple terms</li>
                                    <li>Provide additional examples and resources</li>
                                    <li>Guide students through practice exercises</li>
                                    <li>Offer feedback on assignments and projects</li>
                                </ul>
                                <p>This creates a supportive learning environment that helps students succeed.</p>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-chalkboard-teacher" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Enrollment',
                    content: `
                        <div class="step-content-header">
                            <h3>Streamlined Course Enrollment</h3>
                            <p>Guide students through the enrollment process with conversational assistance.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="Based on your interests, I recommend our 'Digital Marketing Mastery' course. Would you like to learn more about it or enroll now?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Enrollment Process</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="I'd like to enroll in this course">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites makes the enrollment process smoother by guiding students through each step and addressing any questions or concerns.</p>
                            <p>The AI can help with payment options, course schedules, and prerequisites, increasing conversion rates.</p>
                        </div>
                    `
                }
            ]
        },
        
        // Customer Support walkthrough
        'support': {
            steps: [
                {
                    title: 'Introduction',
                    content: `
                        <div class="step-content-header">
                            <h3>Revolutionizing Customer Support with ChatSites</h3>
                            <p>See how ChatSites transforms customer service experiences.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>Effective customer support is crucial for business success, but scaling personalized support can be challenging. ChatSites transforms support websites into interactive help centers.</p>
                                <p>With ChatSites, support websites can:</p>
                                <ul>
                                    <li>Provide instant answers to common customer questions</li>
                                    <li>Troubleshoot technical issues through conversation</li>
                                    <li>Guide customers through self-service processes</li>
                                    <li>Seamlessly escalate to human agents when necessary</li>
                                </ul>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-headset" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Issue Resolution',
                    content: `
                        <div class="step-content-header">
                            <h3>Conversational Troubleshooting</h3>
                            <p>Solve customer problems through natural conversation.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="Welcome to TechSupport Hub! I'm your support assistant. How can I help you today?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Issue Resolution</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="I can't connect to my WiFi network">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites understands customer issues and can guide them through step-by-step troubleshooting processes to resolve problems quickly.</p>
                            <p>The AI can adapt its approach based on the customer's technical knowledge and previous troubleshooting attempts.</p>
                        </div>
                    `
                },
                {
                    title: 'Self-Service',
                    content: `
                        <div class="step-content-header">
                            <h3>Guided Self-Service</h3>
                            <p>Help customers help themselves through interactive guidance.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>ChatSites can guide customers through self-service processes, helping them complete tasks without waiting for human assistance.</p>
                                <p>The AI assistant can:</p>
                                <ul>
                                    <li>Walk customers through account management tasks</li>
                                    <li>Guide users through software setup and configuration</li>
                                    <li>Help with form completion and document submission</li>
                                    <li>Provide step-by-step instructions with visual aids</li>
                                </ul>
                                <p>This empowers customers to solve their own issues while reducing support ticket volume.</p>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-tools" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Human Handoff',
                    content: `
                        <div class="step-content-header">
                            <h3>Seamless Human Escalation</h3>
                            <p>Connect customers with human agents when needed.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="I understand you're having trouble with your WiFi connection. I've guided you through the basic troubleshooting steps, but it seems like we need additional help. Would you like me to connect you with a technical specialist?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Human Handoff</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="Yes, please connect me with a specialist">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites knows when to escalate issues to human agents, ensuring customers get the help they need for complex problems.</p>
                            <p>The AI provides context to human agents, creating a smooth transition and eliminating the need for customers to repeat information.</p>
                        </div>
                    `
                }
            ]
        },
        
        // Healthcare walkthrough
        'healthcare': {
            steps: [
                {
                    title: 'Introduction',
                    content: `
                        <div class="step-content-header">
                            <h3>Transforming Healthcare with ChatSites</h3>
                            <p>See how ChatSites enhances patient experiences and streamlines healthcare processes.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>Healthcare providers need to deliver personalized patient experiences while managing administrative tasks efficiently. ChatSites transforms healthcare websites into interactive patient portals.</p>
                                <p>With ChatSites, healthcare websites can:</p>
                                <ul>
                                    <li>Provide 24/7 information about services and conditions</li>
                                    <li>Streamline appointment scheduling and management</li>
                                    <li>Guide patients through pre-appointment preparations</li>
                                    <li>Answer common health questions while maintaining privacy</li>
                                </ul>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-heartbeat" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Appointment Scheduling',
                    content: `
                        <div class="step-content-header">
                            <h3>Conversational Appointment Booking</h3>
                            <p>Help patients schedule appointments through natural conversation.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="Welcome to Wellness Medical Center! I'm your healthcare assistant. How can I help you today?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Appointment Scheduling</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="I need to schedule a check-up appointment">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites understands patient needs and can help them schedule appointments with the right healthcare providers.</p>
                            <p>The AI can check provider availability, suggest optimal appointment times, and collect necessary pre-appointment information.</p>
                        </div>
                    `
                },
                {
                    title: 'Health Information',
                    content: `
                        <div class="step-content-header">
                            <h3>Accessible Health Information</h3>
                            <p>Provide reliable health information through conversation.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>ChatSites can provide patients with reliable health information, helping them understand conditions, treatments, and preventive care.</p>
                                <p>The AI assistant can:</p>
                                <ul>
                                    <li>Explain medical procedures and what to expect</li>
                                    <li>Provide information about symptoms and when to seek care</li>
                                    <li>Share preparation instructions for appointments and tests</li>
                                    <li>Offer general wellness and prevention guidance</li>
                                </ul>
                                <p>This empowers patients with knowledge while clearly indicating when they should consult healthcare professionals.</p>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-notes-medical" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Patient Support',
                    content: `
                        <div class="step-content-header">
                            <h3>Ongoing Patient Support</h3>
                            <p>Guide patients through their healthcare journey.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="I've scheduled your check-up appointment for Tuesday at 10:00 AM with Dr. Johnson. Is there anything else you'd like to know before your visit?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the Patient Support</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="Do I need to bring anything to my appointment?">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>ChatSites provides ongoing support to patients throughout their healthcare journey, from pre-appointment preparation to post-visit follow-up.</p>
                            <p>The AI can send appointment reminders, check on recovery progress, and help patients navigate insurance and billing questions.</p>
                        </div>
                    `
                }
            ]
        },
        
        // Default walkthrough (fallback)
        'default': {
            steps: [
                {
                    title: 'Introduction',
                    content: `
                        <div class="step-content-header">
                            <h3>Transforming Customer Experiences with ChatSites</h3>
                            <p>See how ChatSites revolutionizes digital interactions across industries.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>ChatSites is a cutting-edge platform that transforms static websites into dynamic, conversational experiences. By integrating advanced AI capabilities, ChatSites creates more engaging and personalized customer interactions.</p>
                                <p>With ChatSites, businesses can:</p>
                                <ul>
                                    <li>Provide 24/7 personalized customer service</li>
                                    <li>Guide users through complex processes with natural conversation</li>
                                    <li>Showcase products and services in an interactive way</li>
                                    <li>Streamline conversions and transactions</li>
                                </ul>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-comments" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Key Features',
                    content: `
                        <div class="step-content-header">
                            <h3>ChatSites Key Features</h3>
                            <p>Discover the powerful capabilities that make ChatSites unique.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>ChatSites combines several cutting-edge technologies to create a seamless conversational experience:</p>
                                <ul>
                                    <li><strong>Voice-First Design:</strong> Natural voice interactions with advanced speech recognition and synthesis</li>
                                    <li><strong>Multimodal Communication:</strong> Seamlessly combines text, voice, and visual elements</li>
                                    <li><strong>Dynamic Content Rendering:</strong> Displays relevant information, images, and interactive elements based on conversation</li>
                                    <li><strong>Contextual Understanding:</strong> Remembers conversation history and user preferences</li>
                                    <li><strong>No-Code Customization:</strong> Easy to customize without technical expertise</li>
                                </ul>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-cogs" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                },
                {
                    title: 'Demo',
                    content: `
                        <div class="step-content-header">
                            <h3>ChatSites in Action</h3>
                            <p>Experience the power of conversational interfaces.</p>
                        </div>
                        <div class="step-content-demo" data-initial-message="Hello! I'm your ChatSites assistant. I can help you learn about our platform, show you demos, or answer any questions you might have. How can I assist you today?">
                            <div class="demo-title">
                                <i class="fas fa-comment-dots"></i>
                                <span>Try the ChatSites Demo</span>
                            </div>
                            <div class="demo-content">
                                <div class="demo-chat"></div>
                                <div class="demo-input">
                                    <input type="text" placeholder="Type your message..." value="Tell me about ChatSites features">
                                    <button><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="step-content-text">
                            <p>This demo showcases the conversational capabilities of ChatSites. Try asking different questions to see how the AI responds and adapts to your needs.</p>
                        </div>
                    `
                },
                {
                    title: 'Get Started',
                    content: `
                        <div class="step-content-header">
                            <h3>Start Your ChatSites Journey</h3>
                            <p>Transform your website into a conversational experience.</p>
                        </div>
                        <div class="step-content-body">
                            <div class="step-content-text">
                                <p>Getting started with ChatSites is easy:</p>
                                <ol>
                                    <li>Choose your industry and use case</li>
                                    <li>Customize your AI assistant's personality and knowledge</li>
                                    <li>Integrate the ChatSites portal into your website</li>
                                    <li>Launch and start engaging with your customers in a whole new way</li>
                                </ol>
                                <p>Our team is ready to help you every step of the way, ensuring a smooth implementation and optimal results.</p>
                                <div style="margin-top: 20px; text-align: center;">
                                    <button style="background-color: #f65228; color: white; border: none; border-radius: 8px; padding: 12px 24px; font-size: 1rem; cursor: pointer;">Build Your ChatSite</button>
                                </div>
                            </div>
                            <div class="step-content-image">
                                <i class="fas fa-rocket" style="font-size: 5rem; color: #f65228;"></i>
                            </div>
                        </div>
                    `
                }
            ]
        }
    };
}
