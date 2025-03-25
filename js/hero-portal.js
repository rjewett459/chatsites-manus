// Enhanced portal demo implementation for hero section

document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced portal demo
    initEnhancedPortalDemo();
});

function initEnhancedPortalDemo() {
    // Get portal elements
    const portalFrame = document.querySelector('.portal-frame');
    const portalWelcome = document.getElementById('portal-welcome');
    const aiAssistant = document.getElementById('ai-assistant');
    const activateButton = document.getElementById('activate-portal');
    const startDemoButton = document.getElementById('start-demo');
    const orb = document.getElementById('ai-orb');
    
    // Add 3D hover effect to portal frame
    if (portalFrame) {
        portalFrame.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // Calculate rotation based on mouse position
            // The rotation is limited to a small range for subtle effect
            const rotateY = ((x / rect.width) - 0.5) * 5; // -2.5 to 2.5 degrees
            const rotateX = ((y / rect.height) - 0.5) * -5; // 2.5 to -2.5 degrees
            
            // Apply the transform
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Reset transform when mouse leaves
        portalFrame.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
    
    // Enhanced activation button with particle effect
    if (activateButton) {
        activateButton.addEventListener('mouseenter', function() {
            // Add particle effect on hover
            createParticleEffect(this);
        });
        
        // Enhanced activation functionality
        activateButton.addEventListener('click', function() {
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // Transition from welcome to assistant
            portalWelcome.classList.add('fade-out');
            
            setTimeout(() => {
                portalWelcome.classList.remove('active');
                portalWelcome.classList.add('hidden');
                portalWelcome.classList.remove('fade-out');
                
                // Show AI assistant with fade-in
                aiAssistant.classList.remove('hidden');
                aiAssistant.classList.add('fade-in');
                
                setTimeout(() => {
                    aiAssistant.classList.add('active');
                    aiAssistant.classList.remove('fade-in');
                    
                    // Trigger welcome message with voice
                    playEnhancedWelcomeMessage();
                }, 300);
            }, 300);
        });
    }
    
    // Enhanced start demo button
    if (startDemoButton) {
        startDemoButton.addEventListener('click', function() {
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // Scroll to portal demo with smooth effect
            const portalDemo = document.querySelector('.portal-demo-container');
            
            // Add highlight effect to portal
            portalDemo.classList.add('highlight-portal');
            setTimeout(() => {
                portalDemo.classList.remove('highlight-portal');
            }, 2000);
            
            // Smooth scroll
            portalDemo.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // Activate portal after scrolling
            setTimeout(() => {
                if (portalWelcome.classList.contains('active')) {
                    // Trigger click on activate button
                    activateButton.click();
                }
            }, 1000);
        });
    }
    
    // Enhanced orb interactions
    if (orb) {
        // Add 3D effect on hover
        orb.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const rotateY = ((x / rect.width) - 0.5) * 20; // -10 to 10 degrees
            const rotateX = ((y / rect.height) - 0.5) * -20; // 10 to -10 degrees
            
            // Apply the transform
            this.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Reset transform when mouse leaves
        orb.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateX(0) rotateY(0)';
        });
        
        // Add click effect
        orb.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('orb-ripple');
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Trigger voice input
            document.getElementById('voice-input-button').click();
        });
    }
    
    // Add CSS for enhanced effects
    addEnhancedStyles();
}

// Function to create particle effect
function createParticleEffect(element) {
    // Create 10 particles
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('span');
        particle.classList.add('particle');
        
        // Random position around the button
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        
        // Random size
        const size = Math.random() * 5 + 2;
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;
        
        // Add to element
        element.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Function to play enhanced welcome message
function playEnhancedWelcomeMessage() {
    // Get message elements
    const assistantMessages = document.getElementById('assistant-messages');
    const welcomeMessage = document.querySelector('.welcome-message');
    
    // Clear previous messages
    if (assistantMessages) {
        assistantMessages.innerHTML = '';
    }
    
    // Create typing effect for welcome message
    const message = "Hello! I'm your ChatSites assistant. How can I help you today?";
    const messageElement = document.createElement('div');
    messageElement.classList.add('assistant-message');
    messageElement.classList.add('typing');
    
    assistantMessages.appendChild(messageElement);
    
    // Typing effect
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < message.length) {
            messageElement.textContent += message.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            messageElement.classList.remove('typing');
            
            // Speak the message
            if (window.speakText) {
                window.speakText(message);
            }
        }
    }, 30);
}

// Function to add enhanced styles
function addEnhancedStyles() {
    // Check if styles already exist
    if (!document.getElementById('enhanced-portal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'enhanced-portal-styles';
        styleSheet.textContent = `
            /* Enhanced portal animations */
            .portal-frame {
                transition: transform 0.3s ease;
                transform-origin: center;
                will-change: transform;
            }
            
            .highlight-portal {
                animation: highlightPulse 2s ease-in-out;
            }
            
            @keyframes highlightPulse {
                0% { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
                50% { box-shadow: 0 10px 30px rgba(246, 82, 40, 0.4); }
                100% { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
            }
            
            /* Button click animation */
            .clicked {
                transform: scale(0.95);
            }
            
            /* Fade animations */
            .fade-out {
                opacity: 0;
                transform: translateY(-10px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .fade-in {
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            /* Particle effect */
            .particle {
                position: absolute;
                background-color: #f65228;
                border-radius: 50%;
                opacity: 0.7;
                animation: particleFloat 1s ease-out forwards;
            }
            
            @keyframes particleFloat {
                0% { transform: translate(0, 0); opacity: 0.7; }
                100% { transform: translate(var(--x, 50px), var(--y, -50px)); opacity: 0; }
            }
            
            /* Orb ripple effect */
            .orb-ripple {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: orbRipple 0.6s ease-out forwards;
            }
            
            @keyframes orbRipple {
                to { transform: scale(1.5); opacity: 0; }
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
        `;
        document.head.appendChild(styleSheet);
    }
}
