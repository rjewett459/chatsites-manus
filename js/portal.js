// Portal specific functionality for ChatSites

document.addEventListener('DOMContentLoaded', function() {
    // Initialize portal components
    initPortalAnimation();
    setupVoiceActivation();
});

// Initialize portal animation effects
function initPortalAnimation() {
    const orb = document.getElementById('ai-orb');
    
    if (orb) {
        // Add pulse animation variations
        orb.addEventListener('mouseover', () => {
            const orbPulse = orb.querySelector('.orb-pulse');
            if (orbPulse) {
                orbPulse.style.animation = 'pulse 1s infinite';
            }
        });
        
        orb.addEventListener('mouseout', () => {
            const orbPulse = orb.querySelector('.orb-pulse');
            if (orbPulse) {
                orbPulse.style.animation = 'pulse 2s infinite';
            }
        });
        
        // Add click effect
        orb.addEventListener('click', () => {
            orb.classList.add('pulse-once');
            setTimeout(() => {
                orb.classList.remove('pulse-once');
            }, 500);
            
            // Trigger voice activation
            document.getElementById('voice-input-button').click();
        });
    }
    
    // Add dynamic content transitions
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        // Add observer to animate content when shown
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (!dynamicContent.classList.contains('hidden')) {
                        animateDynamicContent();
                    }
                }
            });
        });
        
        observer.observe(dynamicContent, { attributes: true });
    }
}

// Function to animate dynamic content when shown
function animateDynamicContent() {
    const dynamicContent = document.getElementById('dynamic-content');
    
    // Add fade-in animation
    if (!document.getElementById('dynamic-content-animation')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'dynamic-content-animation';
        styleSheet.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            #dynamic-content {
                animation: fadeIn 0.5s ease-out forwards;
            }
            
            #dynamic-content h3 {
                animation: fadeIn 0.5s ease-out 0.2s both;
            }
            
            #dynamic-content > div {
                animation: fadeIn 0.5s ease-out 0.4s both;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Add animation classes to child elements
    setTimeout(() => {
        const children = dynamicContent.children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.opacity = '0';
            setTimeout(() => {
                children[i].style.opacity = '1';
                children[i].style.transition = 'opacity 0.3s ease-out';
            }, i * 100 + 100);
        }
    }, 500);
}

// Setup voice activation and response
function setupVoiceActivation() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        console.log('Speech recognition is supported');
        
        // Add visual cue for voice activation
        const voiceButton = document.getElementById('voice-input-button');
        if (voiceButton) {
            // Add ripple effect on click
            voiceButton.addEventListener('click', createRipple);
            
            // Add listening animation
            if (!document.getElementById('voice-button-animation')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'voice-button-animation';
                styleSheet.textContent = `
                    @keyframes listening {
                        0% { box-shadow: 0 0 0 0 rgba(246, 82, 40, 0.7); }
                        70% { box-shadow: 0 0 0 10px rgba(246, 82, 40, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(246, 82, 40, 0); }
                    }
                    
                    #voice-input-button.listening {
                        animation: listening 1.5s infinite;
                        background-color: #d43e1a;
                    }
                    
                    .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background-color: rgba(255, 255, 255, 0.7);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        pointer-events: none;
                    }
                    
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(styleSheet);
            }
        }
    } else {
        console.log('Speech recognition is not supported');
        
        // Add fallback message
        const voiceButton = document.getElementById('voice-input-button');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => {
                alert('Voice recognition is not supported in your browser. Please use Chrome or Edge for this feature.');
            });
        }
    }
}

// Function to create ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Function to handle portal state changes
function updatePortalState(state) {
    const portal = document.querySelector('.portal-frame');
    const orb = document.getElementById('ai-orb');
    
    switch (state) {
        case 'listening':
            portal.classList.add('listening-mode');
            orb.classList.add('listening');
            break;
            
        case 'thinking':
            portal.classList.add('thinking-mode');
            portal.classList.remove('listening-mode');
            orb.classList.remove('listening');
            orb.classList.add('thinking');
            break;
            
        case 'responding':
            portal.classList.remove('thinking-mode');
            orb.classList.remove('thinking');
            orb.classList.add('responding');
            break;
            
        case 'idle':
            portal.classList.remove('listening-mode', 'thinking-mode');
            orb.classList.remove('listening', 'thinking', 'responding');
            break;
            
        default:
            portal.classList.remove('listening-mode', 'thinking-mode');
            orb.classList.remove('listening', 'thinking', 'responding');
    }
}

// Export functions for use in other scripts
window.portalInterface = {
    updateState: updatePortalState,
    animateContent: animateDynamicContent
};
