// Explainer Section functionality
// This file implements the tab switching and interactive features for the explainer section

document.addEventListener('DOMContentLoaded', function() {
    // Initialize explainer section
    initExplainerSection();
});

function initExplainerSection() {
    // Get all tab buttons and content panes
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // If no tabs found, exit
    if (!tabButtons.length || !tabPanes.length) return;
    
    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the tab ID from the data attribute
            const tabId = button.getAttribute('data-tab');
            
            // Switch to the selected tab
            switchTab(tabId, tabButtons, tabPanes);
        });
    });
    
    // Initialize any interactive elements in the tabs
    initTabInteractivity();
}

// Function to switch tabs
function switchTab(tabId, tabButtons, tabPanes) {
    // Remove active class from all buttons and panes
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to selected button and pane
    const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    const selectedPane = document.getElementById(tabId);
    
    if (selectedButton) selectedButton.classList.add('active');
    if (selectedPane) selectedPane.classList.add('active');
    
    // Initialize any specific content in the selected tab
    initTabContent(tabId);
}

// Function to initialize tab interactivity
function initTabInteractivity() {
    // Add any interactive elements or event listeners for tab content
    
    // Example: Add click event to CTA buttons in tabs
    const ctaButtons = document.querySelectorAll('.tab-pane .cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Prevent default action if it's a link
            e.preventDefault();
            
            // Get the action from data attribute
            const action = button.getAttribute('data-action');
            
            // Handle different actions
            handleCtaAction(action);
        });
    });
    
    // Example: Add hover effects to feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// Function to initialize specific content for a tab
function initTabContent(tabId) {
    // Initialize content specific to each tab
    switch (tabId) {
        case 'core-concept':
            // Initialize core concept tab content
            initCoreConceptTab();
            break;
        case 'hybrid-interface':
            // Initialize hybrid interface tab content
            initHybridInterfaceTab();
            break;
        case 'mobile-first':
            // Initialize mobile-first tab content
            initMobileFirstTab();
            break;
        case 'future':
            // Initialize future tab content
            initFutureTab();
            break;
        case 'bridge':
            // Initialize bridge tab content
            initBridgeTab();
            break;
    }
}

// Functions to initialize specific tab content
function initCoreConceptTab() {
    // Add any specific initialization for the core concept tab
    console.log('Core Concept tab initialized');
    
    // Example: Animate the vision timeline if it exists
    const timeline = document.querySelector('#core-concept .timeline');
    if (timeline) {
        animateTimeline(timeline);
    }
}

function initHybridInterfaceTab() {
    // Add any specific initialization for the hybrid interface tab
    console.log('Hybrid Interface tab initialized');
    
    // Example: Initialize comparison chart if it exists
    const comparisonTable = document.querySelector('#hybrid-interface .comparison-table');
    if (comparisonTable) {
        animateComparisonTable(comparisonTable);
    }
}

function initMobileFirstTab() {
    // Add any specific initialization for the mobile-first tab
    console.log('Mobile-first tab initialized');
    
    // Example: Initialize device preview if it exists
    const devicePreview = document.querySelector('#mobile-first .device-preview');
    if (devicePreview) {
        initDevicePreview(devicePreview);
    }
}

function initFutureTab() {
    // Add any specific initialization for the future tab
    console.log('Future tab initialized');
    
    // Example: Initialize future vision animation if it exists
    const futureVision = document.querySelector('#future .future-vision');
    if (futureVision) {
        initFutureVision(futureVision);
    }
}

function initBridgeTab() {
    // Add any specific initialization for the bridge tab
    console.log('Bridge tab initialized');
    
    // Example: Initialize bridge diagram if it exists
    const bridgeDiagram = document.querySelector('#bridge .bridge-diagram');
    if (bridgeDiagram) {
        initBridgeDiagram(bridgeDiagram);
    }
}

// Helper functions for tab content initialization
function animateTimeline(timeline) {
    // Animate timeline items one by one
    const items = timeline.querySelectorAll('.timeline-item');
    
    items.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Animate with delay based on index
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 * index);
    });
}

function animateComparisonTable(table) {
    // Animate comparison table rows
    const rows = table.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        // Skip header row
        if (index === 0) return;
        
        // Set initial state
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Animate with delay based on index
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 200 * index);
    });
}

function initDevicePreview(devicePreview) {
    // Initialize device preview with simulated screen changes
    const deviceScreen = devicePreview.querySelector('.device-screen');
    if (!deviceScreen) return;
    
    // Array of screen states to cycle through
    const screenStates = [
        { content: 'Home Screen', class: 'home' },
        { content: 'Voice Command', class: 'voice' },
        { content: 'Content Update', class: 'update' }
    ];
    
    // Set initial state
    let currentState = 0;
    updateDeviceScreen(deviceScreen, screenStates[currentState]);
    
    // Cycle through states every few seconds
    setInterval(() => {
        currentState = (currentState + 1) % screenStates.length;
        updateDeviceScreen(deviceScreen, screenStates[currentState]);
    }, 3000);
}

function updateDeviceScreen(screen, state) {
    // Update device screen with new state
    screen.className = 'device-screen ' + state.class;
    screen.innerHTML = `<div class="screen-content">${state.content}</div>`;
    
    // Add transition effect
    screen.style.opacity = '0';
    setTimeout(() => {
        screen.style.opacity = '1';
    }, 100);
}

function initFutureVision(futureVision) {
    // Initialize future vision with animated elements
    const elements = futureVision.querySelectorAll('.vision-element');
    
    elements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // Animate with delay based on index
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 400 * index);
    });
}

function initBridgeDiagram(bridgeDiagram) {
    // Initialize bridge diagram with animated connections
    const connections = bridgeDiagram.querySelectorAll('.connection');
    const nodes = bridgeDiagram.querySelectorAll('.node');
    
    // Animate nodes first
    nodes.forEach((node, index) => {
        node.style.opacity = '0';
        node.style.transform = 'scale(0.8)';
        node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            node.style.opacity = '1';
            node.style.transform = 'scale(1)';
        }, 300 * index);
    });
    
    // Then animate connections
    setTimeout(() => {
        connections.forEach((connection, index) => {
            connection.style.opacity = '0';
            connection.style.strokeDashoffset = connection.getTotalLength();
            connection.style.strokeDasharray = connection.getTotalLength();
            connection.style.transition = 'opacity 0.5s ease, stroke-dashoffset 1s ease';
            
            setTimeout(() => {
                connection.style.opacity = '1';
                connection.style.strokeDashoffset = '0';
            }, 200 * index);
        });
    }, nodes.length * 300);
}

// Function to handle CTA button actions
function handleCtaAction(action) {
    // Handle different CTA actions
    switch (action) {
        case 'learn-more':
            console.log('Learn more action triggered');
            // Scroll to a specific section or open a modal
            scrollToSection('features');
            break;
        case 'try-demo':
            console.log('Try demo action triggered');
            // Scroll to demo section
            scrollToSection('hero');
            // Activate the demo
            const activateButton = document.getElementById('activate-portal');
            if (activateButton) activateButton.click();
            break;
        case 'contact':
            console.log('Contact action triggered');
            // Open contact form or modal
            openContactForm();
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Helper function to scroll to a section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Helper function to open contact form
function openContactForm() {
    // This would open a contact form modal in a real implementation
    alert('Contact form would open here');
}

// Export functions for use in other scripts
window.explainerFunctions = {
    switchTab,
    handleCtaAction
};
