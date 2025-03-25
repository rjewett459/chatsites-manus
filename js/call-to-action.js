// Call to Action functionality
// This file implements the video modal and CTA button interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize call to action section
    initCallToAction();
});

function initCallToAction() {
    // Set up video thumbnail click handler
    setupVideoThumbnail();
    
    // Set up CTA button animations
    setupCtaButtons();
    
    // Set up feature animations
    setupFeatureAnimations();
}

// Function to set up video thumbnail click handler
function setupVideoThumbnail() {
    const videoThumbnail = document.querySelector('.video-thumbnail');
    const videoOverlay = document.querySelector('.video-overlay');
    const videoClose = document.querySelector('.video-close');
    
    if (videoThumbnail && videoOverlay) {
        // Add click event to video thumbnail
        videoThumbnail.addEventListener('click', () => {
            // Show video overlay
            videoOverlay.style.display = 'flex';
            
            // Add animation class
            setTimeout(() => {
                videoOverlay.classList.add('active');
            }, 10);
            
            // Start video if iframe exists
            const videoIframe = videoOverlay.querySelector('iframe');
            if (videoIframe) {
                // Add autoplay parameter to src if not already present
                if (!videoIframe.src.includes('autoplay=1')) {
                    videoIframe.src += (videoIframe.src.includes('?') ? '&' : '?') + 'autoplay=1';
                }
            }
        });
        
        // Add click event to close button
        if (videoClose) {
            videoClose.addEventListener('click', () => {
                closeVideoOverlay(videoOverlay);
            });
        }
        
        // Add click event to overlay background
        videoOverlay.addEventListener('click', (e) => {
            if (e.target === videoOverlay) {
                closeVideoOverlay(videoOverlay);
            }
        });
        
        // Add escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoOverlay.classList.contains('active')) {
                closeVideoOverlay(videoOverlay);
            }
        });
    }
}

// Function to close video overlay
function closeVideoOverlay(overlay) {
    // Remove active class
    overlay.classList.remove('active');
    
    // Hide overlay after animation
    setTimeout(() => {
        overlay.style.display = 'none';
        
        // Pause video if iframe exists
        const videoIframe = overlay.querySelector('iframe');
        if (videoIframe) {
            // Replace src with itself but without autoplay to stop video
            videoIframe.src = videoIframe.src.replace('autoplay=1', 'autoplay=0');
        }
    }, 300);
}

// Function to set up CTA button animations
function setupCtaButtons() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    
    ctaButtons.forEach(button => {
        // Add hover animation
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
        
        // Add click animation
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
            
            // Handle button action
            handleCtaButtonClick(button);
        });
    });
}

// Function to handle CTA button clicks
function handleCtaButtonClick(button) {
    // Get button action from data attribute
    const action = button.getAttribute('data-action');
    
    // Handle different actions
    switch (action) {
        case 'try-builder':
            console.log('Try Builder action triggered');
            // Redirect to builder page or show modal
            showBuilderModal();
            break;
        case 'watch-demo':
            console.log('Watch Demo action triggered');
            // Trigger video play
            const videoThumbnail = document.querySelector('.video-thumbnail');
            if (videoThumbnail) {
                videoThumbnail.click();
            }
            break;
        case 'sign-up':
            console.log('Sign Up action triggered');
            // Show sign up form
            showSignUpForm();
            break;
        case 'learn-more':
            console.log('Learn More action triggered');
            // Scroll to specific section
            scrollToSection('about');
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Function to show builder modal
function showBuilderModal() {
    // This would show a modal with builder options in a real implementation
    alert('ChatSites Builder would launch here');
}

// Function to show sign up form
function showSignUpForm() {
    // This would show a sign up form in a real implementation
    alert('Sign Up form would appear here');
}

// Function to scroll to a section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to set up feature animations
function setupFeatureAnimations() {
    const features = document.querySelectorAll('.cta-feature');
    
    features.forEach(feature => {
        // Add hover animation
        feature.addEventListener('mouseenter', () => {
            const icon = feature.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        feature.addEventListener('mouseleave', () => {
            const icon = feature.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// Function to animate CTA section on scroll
function animateCtaOnScroll() {
    const ctaSection = document.getElementById('cta');
    if (!ctaSection) return;
    
    // Check if section is in viewport
    const rect = ctaSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isInViewport) {
        // Animate title
        const title = ctaSection.querySelector('.cta-title');
        if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }
        
        // Animate description
        const description = ctaSection.querySelector('.cta-description');
        if (description) {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
        }
        
        // Animate buttons with delay
        const buttons = ctaSection.querySelectorAll('.cta-buttons button');
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 200 * (index + 1));
        });
        
        // Animate video with delay
        const video = ctaSection.querySelector('.cta-video');
        if (video) {
            setTimeout(() => {
                video.style.opacity = '1';
                video.style.transform = 'translateY(0)';
            }, 400);
        }
        
        // Animate features with delay
        const features = ctaSection.querySelectorAll('.cta-feature');
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
            }, 600 + 200 * index);
        });
    }
}

// Add scroll event listener for animations
window.addEventListener('scroll', animateCtaOnScroll);
window.addEventListener('load', animateCtaOnScroll);
