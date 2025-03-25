// Dynamic Asset Portal View functionality
// This file implements the dynamic content rendering for the portal

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dynamic asset portal
    initDynamicAssetPortal();
});

function initDynamicAssetPortal() {
    // Get the dynamic content container
    const dynamicContent = document.getElementById('dynamic-content');
    
    // If dynamic content container doesn't exist, exit
    if (!dynamicContent) return;
    
    // Create asset templates for different content types
    createAssetTemplates();
    
    // Set up event listeners for dynamic content
    setupDynamicContentListeners();
}

// Function to create asset templates
function createAssetTemplates() {
    // Store templates in window object for global access
    window.assetTemplates = {
        // Product grid template
        productGrid: function(title, products) {
            return `
                <div class="dynamic-asset-container">
                    <div class="asset-header">
                        <h3 class="asset-title">${title}</h3>
                        <div class="asset-controls">
                            <button class="asset-control-button" title="Refresh"><i class="fas fa-sync-alt"></i></button>
                            <button class="asset-control-button" title="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="asset-content">
                        <div class="asset-grid">
                            ${products.map(product => `
                                <div class="asset-card" data-product-id="${product.id}">
                                    <div class="asset-card-image">
                                        <i class="${product.icon || 'fas fa-box'}"></i>
                                    </div>
                                    <div class="asset-card-content">
                                        <h4 class="asset-card-title">${product.name}</h4>
                                        <p class="asset-card-description">${product.description}</p>
                                        <button class="asset-card-button" data-action="view-product" data-product-id="${product.id}">View Details</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Image gallery template
        imageGallery: function(title, images) {
            return `
                <div class="dynamic-asset-container">
                    <div class="asset-header">
                        <h3 class="asset-title">${title}</h3>
                        <div class="asset-controls">
                            <button class="asset-control-button" title="Slideshow"><i class="fas fa-play"></i></button>
                            <button class="asset-control-button" title="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="asset-content">
                        <div class="asset-gallery">
                            ${images.map((image, index) => `
                                <div class="gallery-item" data-image-id="${index}">
                                    <img src="${image.thumbnail || image.src}" alt="${image.alt || 'Gallery image'}" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Form template
        form: function(title, formFields, submitText = 'Submit') {
            return `
                <div class="dynamic-asset-container">
                    <div class="asset-header">
                        <h3 class="asset-title">${title}</h3>
                        <div class="asset-controls">
                            <button class="asset-control-button" title="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="asset-content">
                        <div class="asset-form">
                            <form id="dynamic-form">
                                ${formFields.map(field => {
                                    if (field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number') {
                                        return `
                                            <div class="form-row">
                                                <label class="form-label" for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                                                <input class="form-input" type="${field.type}" id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                                            </div>
                                        `;
                                    } else if (field.type === 'textarea') {
                                        return `
                                            <div class="form-row">
                                                <label class="form-label" for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                                                <textarea class="form-textarea" id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
                                            </div>
                                        `;
                                    } else if (field.type === 'select') {
                                        return `
                                            <div class="form-row">
                                                <label class="form-label" for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                                                <select class="form-select" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
                                                    ${field.options.map(option => `
                                                        <option value="${option.value}">${option.label}</option>
                                                    `).join('')}
                                                </select>
                                            </div>
                                        `;
                                    }
                                    return '';
                                }).join('')}
                                <div class="form-row">
                                    <button type="submit" class="form-submit">${submitText}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Video player template
        videoPlayer: function(title, videoSrc, posterSrc) {
            return `
                <div class="dynamic-asset-container">
                    <div class="asset-header">
                        <h3 class="asset-title">${title}</h3>
                        <div class="asset-controls">
                            <button class="asset-control-button" title="Fullscreen"><i class="fas fa-expand"></i></button>
                            <button class="asset-control-button" title="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="asset-content">
                        <div class="asset-video">
                            ${videoSrc ? `
                                <video controls width="100%" poster="${posterSrc || ''}">
                                    <source src="${videoSrc}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            ` : `
                                <div class="video-placeholder">
                                    <div class="video-play-button">
                                        <i class="fas fa-play"></i>
                                    </div>
                                    <p class="video-title">${title}</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Audio player template
        audioPlayer: function(title, audioSrc) {
            return `
                <div class="dynamic-asset-container">
                    <div class="asset-header">
                        <h3 class="asset-title">${title}</h3>
                        <div class="asset-controls">
                            <button class="asset-control-button" title="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="asset-content">
                        <div class="asset-audio">
                            ${audioSrc ? `
                                <audio id="audio-element" src="${audioSrc}" style="display: none;"></audio>
                            ` : ''}
                            <div class="audio-controls">
                                <button class="audio-play-button" id="audio-play">
                                    <i class="fas fa-play"></i>
                                </button>
                                <div class="audio-progress">
                                    <div class="audio-progress-bar" id="audio-progress-bar"></div>
                                </div>
                                <div class="audio-time" id="audio-time">0:00</div>
                            </div>
                            <p class="audio-title">${title}</p>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Calendar/booking widget template
        calendar: function(title, availableDates) {
            const now = new Date();
            const month = now.getMonth();
            const year = now.getFullYear();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();
            
            // Create array of day numbers
            const days = [];
            for (let i = 1; i <= daysInMonth; i++) {
                days.push(i);
            }
            
            // Add empty cells for days before the 1st
            const emptyCellsBefore = Array(firstDay).fill(null);
            
            // Combine arrays
            const calendarDays = [...emptyCellsBefore, ...days];
            
            return `
                <div class="dynamic-asset-container">
                    <div class="asset-header">
                        <h3 class="asset-title">${title}</h3>
                        <div class="asset-controls">
                            <button class="asset-control-button" title="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="asset-content">
                        <div class="asset-calendar">
                            <div class="calendar-header">
                                <h4 class="calendar-title">${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now)}</h4>
                                <div class="calendar-nav">
                                    <button class="calendar-nav-button" id="prev-month"><i class="fas fa-chevron-left"></i></button>
                                    <button class="calendar-nav-button" id="next-month"><i class="fas fa-chevron-right"></i></button>
                                </div>
                            </div>
                            <div class="calendar-grid">
                                <div class="calendar-day-header">Sun</div>
                                <div class="calendar-day-header">Mon</div>
                                <div class="calendar-day-header">Tue</div>
                                <div class="calendar-day-header">Wed</div>
                                <div class="calendar-day-header">Thu</div>
                                <div class="calendar-day-header">Fri</div>
                                <div class="calendar-day-header">Sat</div>
                                
                                ${calendarDays.map((day, index) => {
                                    if (day === null) {
                                        return `<div class="calendar-day disabled"></div>`;
                                    }
                                    
                                    const date = new Date(year, month, day);
                                    const dateStr = date.toISOString().split('T')[0];
                                    const isAvailable = availableDates ? availableDates.includes(dateStr) : day > now.getDate();
                                    const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                                    
                                    return `
                                        <div class="calendar-day ${isAvailable ? '' : 'disabled'} ${isToday ? 'active' : ''}" 
                                             data-date="${dateStr}" 
                                             ${isAvailable ? 'data-available="true"' : ''}>
                                            ${day}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                            
                            <div class="time-slots" id="time-slots">
                                <div class="time-slot" data-time="09:00">9:00 AM</div>
                                <div class="time-slot" data-time="10:00">10:00 AM</div>
                                <div class="time-slot" data-time="11:00">11:00 AM</div>
                                <div class="time-slot" data-time="13:00">1:00 PM</div>
                                <div class="time-slot" data-time="14:00">2:00 PM</div>
                                <div class="time-slot" data-time="15:00">3:00 PM</div>
                                <div class="time-slot" data-time="16:00">4:00 PM</div>
                                <div class="time-slot" data-time="17:00">5:00 PM</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Product showcase template
        productShowcase: function(product) {
            return `
                <div class="dynamic-asset-container">
                    <div class="asset-header">
                        <h3 class="asset-title">Product Details</h3>
                        <div class="asset-controls">
                            <button class="asset-control-button" title="Share"><i class="fas fa-share-alt"></i></button>
                            <button class="asset-control-button" title="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="asset-content">
                        <div class="product-showcase">
                            <div class="product-main">
                                <div class="product-image-main">
                                    <i class="${product.icon || 'fas fa-box'}"></i>
                                </div>
                                <div class="product-details">
                                    <h2 class="product-title">${product.name}</h2>
                                    <div class="product-price">${product.price}</div>
                                    <p class="product-description">${product.description}</p>
                                    
                                    ${product.options ? `
                                        <div class="product-options">
                                            <label class="option-label">${product.options.label}:</label>
                                            <div class="option-buttons">
                                                ${product.options.values.map((option, index) => `
                                                    <button class="option-button ${index === 0 ? 'active' : ''}" data-option-value="${option}">${option}</button>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    <div class="product-actions">
                                        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                                        <button class="wishlist-button" data-product-id="${product.id}"><i class="far fa-heart"></i></button>
                                    </div>
                                </div>
                            </div>
                            
                            ${product.thumbnails ? `
                                <div class="product-thumbnails">
                                    ${product.thumbnails.map((thumb, index) => `
                                        <div class="product-thumbnail ${index === 0 ? 'active' : ''}" data-thumb-index="${index}">
                                            <img src="${thumb}" alt="Product thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    };
}

// Function to set up event listeners for dynamic content
function setupDynamicContentListeners() {
    // Get the dynamic content container
    const dynamicContent = document.getElementById('dynamic-content');
    
    if (!dynamicContent) return;
    
    // Delegate event listener for all interactive elements in dynamic content
    dynamicContent.addEventListener('click', function(e) {
        // Close button in asset header
        if (e.target.closest('.asset-control-button') && e.target.closest('.asset-control-button').title === 'Close') {
            dynamicContent.classList.add('hidden');
            dynamicContent.innerHTML = '';
            return;
        }
        
        // Product card view details button
        if (e.target.closest('[data-action="view-product"]')) {
            const productId = e.target.closest('[data-action="view-product"]').getAttribute('data-product-id');
            showProductDetails(productId);
            return;
        }
        
        // Calendar day selection
        if (e.target.closest('.calendar-day[data-available="true"]')) {
            // Remove active class from all days
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('active');
            });
            
            // Add active class to clicked day
            e.target.closest('.calendar-day').classList.add('active');
            return;
        }
        
        // Time slot selection
        if (e.target.closest('.time-slot')) {
            // Remove active class from all time slots
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('active');
            });
            
            // Add active class to clicked time slot
            e.target.closest('.time-slot').classList.add('active');
            return;
        }
        
        // Product option selection
        if (e.target.closest('.option-button')) {
            // Remove active class from all options in the same group
            e.target.closest('.option-buttons').querySelectorAll('.option-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked option
            e.target.closest('.option-button').classList.add('active');
            return;
        }
        
        // Audio play button
        if (e.target.closest('.audio-play-button')) {
            toggleAudioPlayback();
            return;
        }
        
        // Video placeholder play button
        if (e.target.closest('.video-placeholder')) {
            simulateVideoPlay(e.target.closest('.asset-video'));
            return;
        }
    });
    
    // Add form submission handler
    dynamicContent.addEventListener('submit', function(e) {
        if (e.target.id === 'dynamic-form') {
            e.preventDefault();
            simulateFormSubmission(e.target);
        }
    });
}

// Function to show product details
function showProductDetails(productId) {
    // In a real implementation, this would fetch product details from an API
    // For demo purposes, we'll use sample data
    
    const sampleProducts = {
        '1': {
            id: '1',
            name: 'Premium AI Assistant',
            price: '$199.99',
            description: 'Our flagship AI assistant with advanced voice recognition, natural language processing, and seamless integration with your existing systems.',
            icon: 'fas fa-robot',
            options: {
                label: 'License Type',
                values: ['Standard', 'Professional', 'Enterprise']
            },
            thumbnails: [
                'https://via.placeholder.com/70',
                'https://via.placeholder.com/70',
                'https://via.placeholder.com/70',
                'https://via.placeholder.com/70'
            ]
        },
        '2': {
            id: '2',
            name: 'Voice Integration Module',
            price: '$89.99',
            description: 'Add advanced voice capabilities to your ChatSites portal with this powerful integration module.',
            icon: 'fas fa-microphone',
            options: {
                label: 'Platform',
                values: ['Web', 'Mobile', 'Desktop', 'All Platforms']
            }
        },
        '3': {
            id: '3',
            name: 'Analytics Dashboard',
            price: '$129.99',
            description: 'Gain valuable insights into user interactions with your ChatSites portal through our comprehensive analytics dashboard.',
            icon: 'fas fa-chart-line',
            options: {
                label: 'Data Retention',
                values: ['30 Days', '90 Days', '1 Year', 'Unlimited']
            }
        }
    };
    
    const product = sampleProducts[productId] || {
        id: productId,
        name: 'Sample Product',
        price: '$99.99',
        description: 'This is a sample product description.',
        icon: 'fas fa-box'
    };
    
    // Get the dynamic content container
    const dynamicContent = document.getElementById('dynamic-content');
    
    if (dynamicContent) {
        // Render product showcase
        dynamicContent.innerHTML = window.assetTemplates.productShowcase(product);
        dynamicContent.classList.remove('hidden');
    }
}

// Function to toggle audio playback
function toggleAudioPlayback() {
    const audioElement = document.getElementById('audio-element');
    const playButton = document.getElementById('audio-play');
    const progressBar = document.getElementById('audio-progress-bar');
    const timeDisplay = document.getElementById('audio-time');
    
    if (!audioElement || !playButton) return;
    
    // Toggle play/pause
    if (audioElement.paused) {
        // If no src attribute, simulate playback
        if (!audioElement.src) {
            simulateAudioPlayback(playButton, progressBar, timeDisplay);
            return;
        }
        
        // Play actual audio
        audioElement.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Update progress bar
        audioElement.addEventListener('timeupdate', function() {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Update time display
            const minutes = Math.floor(audioElement.currentTime / 60);
            const seconds = Math.floor(audioElement.currentTime % 60);
            timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        });
        
        // Reset when ended
        audioElement.addEventListener('ended', function() {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00';
        });
    } else {
        // Pause audio
        audioElement.pause();
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Function to simulate audio playback (for demo)
function simulateAudioPlayback(playButton, progressBar, timeDisplay) {
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Simulate progress
    let progress = 0;
    let seconds = 0;
    
    const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${progress}%`;
        
        // Update time display
        seconds += 1;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        
        // End after 100%
        if (progress >= 100) {
            clearInterval(interval);
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            
            // Reset after a delay
            setTimeout(() => {
                progressBar.style.width = '0%';
                timeDisplay.textContent = '0:00';
            }, 1000);
        }
    }, 300); // Faster for demo purposes
    
    // Store interval ID for cleanup
    playButton.dataset.intervalId = interval;
    
    // Add click handler to stop simulation
    playButton.addEventListener('click', function stopSimulation() {
        if (playButton.innerHTML.includes('pause')) {
            clearInterval(interval);
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            playButton.removeEventListener('click', stopSimulation);
        }
    }, { once: true });
}

// Function to simulate video playback (for demo)
function simulateVideoPlay(videoContainer) {
    if (!videoContainer) return;
    
    const placeholder = videoContainer.querySelector('.video-placeholder');
    if (!placeholder) return;
    
    // Replace placeholder with video element
    videoContainer.innerHTML = `
        <video controls autoplay width="100%">
            <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;
}

// Function to simulate form submission
function simulateFormSubmission(form) {
    // Get form data
    const formData = new FormData(form);
    const formValues = {};
    
    for (const [key, value] of formData.entries()) {
        formValues[key] = value;
    }
    
    console.log('Form submitted with values:', formValues);
    
    // Show success message
    const formContainer = form.closest('.asset-form');
    
    if (formContainer) {
        formContainer.innerHTML = `
            <div class="form-success">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #38a169; margin-bottom: 15px;"></i>
                <h4 style="margin-bottom: 10px;">Submission Successful!</h4>
                <p>Thank you for your submission. We'll get back to you shortly.</p>
            </div>
        `;
    }
}

// Function to render dynamic content based on type
// This function can be called from other parts of the application
function renderDynamicContent(contentType, data) {
    // Get the dynamic content container
    const dynamicContent = document.getElementById('dynamic-content');
    
    if (!dynamicContent || !window.assetTemplates) return;
    
    // Render content based on type
    switch (contentType) {
        case 'products':
            dynamicContent.innerHTML = window.assetTemplates.productGrid(data.title, data.products);
            break;
        case 'gallery':
            dynamicContent.innerHTML = window.assetTemplates.imageGallery(data.title, data.images);
            break;
        case 'form':
            dynamicContent.innerHTML = window.assetTemplates.form(data.title, data.fields, data.submitText);
            break;
        case 'video':
            dynamicContent.innerHTML = window.assetTemplates.videoPlayer(data.title, data.src, data.poster);
            break;
        case 'audio':
            dynamicContent.innerHTML = window.assetTemplates.audioPlayer(data.title, data.src);
            break;
        case 'calendar':
            dynamicContent.innerHTML = window.assetTemplates.calendar(data.title, data.availableDates);
            break;
        case 'product':
            dynamicContent.innerHTML = window.assetTemplates.productShowcase(data.product);
            break;
        default:
            console.warn('Unknown content type:', contentType);
            return;
    }
    
    // Show the content
    dynamicContent.classList.remove('hidden');
}

// Make the render function globally available
window.renderDynamicContent = renderDynamicContent;

// Sample data for testing
const sampleData = {
    products: {
        title: 'Featured Products',
        products: [
            {
                id: '1',
                name: 'Premium AI Assistant',
                description: 'Advanced AI assistant with voice recognition',
                icon: 'fas fa-robot'
            },
            {
                id: '2',
                name: 'Voice Integration Module',
                description: 'Add voice capabilities to your portal',
                icon: 'fas fa-microphone'
            },
            {
                id: '3',
                name: 'Analytics Dashboard',
                description: 'Track user interactions and engagement',
                icon: 'fas fa-chart-line'
            }
        ]
    },
    gallery: {
        title: 'Image Gallery',
        images: [
            { src: 'https://via.placeholder.com/150', alt: 'Image 1' },
            { src: 'https://via.placeholder.com/150', alt: 'Image 2' },
            { src: 'https://via.placeholder.com/150', alt: 'Image 3' },
            { src: 'https://via.placeholder.com/150', alt: 'Image 4' },
            { src: 'https://via.placeholder.com/150', alt: 'Image 5' },
            { src: 'https://via.placeholder.com/150', alt: 'Image 6' }
        ]
    },
    form: {
        title: 'Contact Us',
        submitText: 'Send Message',
        fields: [
            { type: 'text', id: 'name', label: 'Your Name', required: true },
            { type: 'email', id: 'email', label: 'Email Address', required: true },
            { type: 'select', id: 'subject', label: 'Subject', options: [
                { value: 'general', label: 'General Inquiry' },
                { value: 'support', label: 'Technical Support' },
                { value: 'sales', label: 'Sales Question' }
            ]},
            { type: 'textarea', id: 'message', label: 'Your Message', required: true }
        ]
    },
    calendar: {
        title: 'Book an Appointment',
        availableDates: [
            '2025-03-26',
            '2025-03-27',
            '2025-03-28',
            '2025-03-29',
            '2025-04-01',
            '2025-04-02',
            '2025-04-03'
        ]
    }
};

// Expose sample data for testing
window.sampleAssetData = sampleData;
