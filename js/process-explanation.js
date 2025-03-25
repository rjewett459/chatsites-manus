// Process Explanation Section functionality
// This file implements the interactive features for the process explanation section

document.addEventListener('DOMContentLoaded', function() {
    // Initialize process explanation section
    initProcessExplanation();
});

function initProcessExplanation() {
    // Animate process steps on scroll
    animateProcessStepsOnScroll();
    
    // Initialize tech stack hover effects
    initTechStackHover();
    
    // Initialize step details toggle
    initStepDetailsToggle();
}

// Function to animate process steps on scroll
function animateProcessStepsOnScroll() {
    const processSection = document.getElementById('process');
    if (!processSection) return;
    
    const processSteps = processSection.querySelectorAll('.process-step');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when step comes into view
                entry.target.classList.add('animated');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.2, // 20% of the item must be visible
        rootMargin: '0px 0px -100px 0px' // trigger a bit before the item is fully visible
    });
    
    // Observe each process step
    processSteps.forEach(step => {
        observer.observe(step);
        
        // Set initial state for animation
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Add scroll event for fallback
    window.addEventListener('scroll', () => {
        processSteps.forEach(step => {
            const rect = step.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight - 100 && rect.bottom >= 0;
            
            if (isInViewport && !step.classList.contains('animated')) {
                step.classList.add('animated');
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }
        });
    });
}

// Function to initialize tech stack hover effects
function initTechStackHover() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Scale up the icon
            const icon = item.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            // Show description if it exists
            const description = item.querySelector('.tech-description');
            if (description) {
                description.style.maxHeight = '100px';
                description.style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            // Reset icon scale
            const icon = item.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
            
            // Hide description
            const description = item.querySelector('.tech-description');
            if (description) {
                description.style.maxHeight = '0';
                description.style.opacity = '0';
            }
        });
    });
}

// Function to initialize step details toggle
function initStepDetailsToggle() {
    const stepToggleButtons = document.querySelectorAll('.step-toggle');
    
    stepToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the associated details element
            const stepDetails = button.nextElementSibling;
            if (!stepDetails || !stepDetails.classList.contains('step-details')) return;
            
            // Toggle details visibility
            if (stepDetails.classList.contains('active')) {
                // Hide details
                stepDetails.classList.remove('active');
                stepDetails.style.maxHeight = '0';
                button.innerHTML = 'Show Details <i class="fas fa-chevron-down"></i>';
            } else {
                // Show details
                stepDetails.classList.add('active');
                stepDetails.style.maxHeight = stepDetails.scrollHeight + 'px';
                button.innerHTML = 'Hide Details <i class="fas fa-chevron-up"></i>';
            }
        });
    });
}

// Function to animate timeline on scroll
function animateTimelineOnScroll() {
    const timeline = document.querySelector('.process-timeline');
    if (!timeline) return;
    
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when item comes into view
                entry.target.classList.add('animated');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.2, // 20% of the item must be visible
        rootMargin: '0px 0px -50px 0px' // trigger a bit before the item is fully visible
    });
    
    // Observe each timeline item with delay
    timelineItems.forEach((item, index) => {
        observer.observe(item);
        
        // Set initial state for animation
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transitionDelay = (index * 0.2) + 's';
    });
}

// Function to initialize process section interactivity
function initProcessInteractivity() {
    // Add click event to process steps for more details
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach(step => {
        step.addEventListener('click', () => {
            // Toggle active class
            processSteps.forEach(s => {
                if (s !== step) s.classList.remove('active');
            });
            
            step.classList.toggle('active');
            
            // Show additional details if they exist
            const details = step.querySelector('.step-details');
            if (details) {
                if (step.classList.contains('active')) {
                    details.style.maxHeight = details.scrollHeight + 'px';
                    details.style.opacity = '1';
                } else {
                    details.style.maxHeight = '0';
                    details.style.opacity = '0';
                }
            }
        });
    });
}

// Add scroll event listener for animations
window.addEventListener('scroll', () => {
    animateTimelineOnScroll();
});

// Call this function when the page loads
window.addEventListener('load', () => {
    initProcessInteractivity();
    animateTimelineOnScroll();
});
