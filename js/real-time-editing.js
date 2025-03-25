// Real-Time Editing Demo functionality
// This file implements the simulated voice editing functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize real-time editing demo
    initRealTimeEditingDemo();
});

function initRealTimeEditingDemo() {
    // Get elements
    const editVoiceButton = document.getElementById('edit-voice-command');
    const editTextInput = document.getElementById('edit-text-command');
    const sendEditButton = document.getElementById('send-edit-command');
    const editableContent = document.getElementById('editable-content');
    const editingResult = document.getElementById('editing-result');
    const updatedContent = document.getElementById('updated-content');
    
    // If elements don't exist, exit
    if (!editVoiceButton || !editTextInput || !sendEditButton || !editableContent || !editingResult || !updatedContent) return;
    
    // Set up event listeners
    editVoiceButton.addEventListener('click', simulateVoiceCommand);
    sendEditButton.addEventListener('click', processEditCommand);
    editTextInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processEditCommand();
        }
    });
    
    // Function to simulate voice command
    function simulateVoiceCommand() {
        // Toggle recording state
        editVoiceButton.classList.add('recording');
        editVoiceButton.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
        
        // Simulate recording for 2 seconds
        setTimeout(function() {
            // Stop recording
            editVoiceButton.classList.remove('recording');
            editVoiceButton.innerHTML = '<i class="fas fa-microphone"></i> Voice Command';
            
            // Set a sample command
            editTextInput.value = "Update my hours to 9am–5pm on weekdays";
            
            // Process the command
            processEditCommand();
        }, 2000);
    }
    
    // Function to process edit command
    function processEditCommand() {
        const command = editTextInput.value.trim();
        if (!command) return;
        
        // Parse the command
        const updatedHours = parseEditCommand(command);
        
        // If command was successfully parsed
        if (updatedHours) {
            // Update the content
            updateContent(updatedHours);
            
            // Show the result
            showResult(updatedHours);
            
            // Clear the input
            editTextInput.value = '';
        }
    }
    
    // Function to parse edit command
    function parseEditCommand(command) {
        // Simple parsing for demo purposes
        // In a real implementation, this would use NLP to understand various command formats
        
        const lowerCommand = command.toLowerCase();
        
        // Check for hours update command
        if (lowerCommand.includes('hour') || lowerCommand.includes('time')) {
            // Extract time information
            let weekdayHours = '';
            let saturdayHours = '';
            let sundayHours = '';
            
            // Extract weekday hours
            if (lowerCommand.includes('weekday') || lowerCommand.includes('monday') || 
                lowerCommand.includes('week day') || lowerCommand.includes('week-day')) {
                
                // Look for time pattern like 9am-5pm or 9am to 5pm
                const timePattern = /(\d+)(am|pm)[^\w]+(to|\-|\–|\—)[ ]*(\d+)(am|pm)/i;
                const match = lowerCommand.match(timePattern);
                
                if (match) {
                    weekdayHours = `${match[1]}${match[2]} - ${match[4]}${match[5]}`;
                }
            }
            
            // If no specific weekday hours found, use the first time pattern in the command
            if (!weekdayHours) {
                const timePattern = /(\d+)(am|pm)[^\w]+(to|\-|\–|\—)[ ]*(\d+)(am|pm)/i;
                const match = lowerCommand.match(timePattern);
                
                if (match) {
                    weekdayHours = `${match[1]}${match[2]} - ${match[4]}${match[5]}`;
                }
            }
            
            // For demo purposes, keep Saturday and Sunday hours the same
            // In a real implementation, we would parse these separately
            
            // Return the updated hours
            if (weekdayHours) {
                return {
                    weekday: weekdayHours,
                    saturday: 'Saturday: 10am - 4pm', // Keep the same for demo
                    sunday: 'Sunday: Closed' // Keep the same for demo
                };
            }
        }
        
        // If command couldn't be parsed, return null
        return null;
    }
    
    // Function to update content
    function updateContent(hours) {
        // Create updated content
        const updatedHtml = `
            <p>Monday - Friday: ${hours.weekday}</p>
            <p>${hours.saturday}</p>
            <p>${hours.sunday}</p>
        `;
        
        // Update the result content
        updatedContent.innerHTML = updatedHtml;
    }
    
    // Function to show result
    function showResult(hours) {
        // Show the result container
        editingResult.classList.remove('hidden');
        editingResult.classList.add('active');
        
        // Apply highlight animation to changed content
        const weekdayElement = updatedContent.querySelector('p:first-child');
        if (weekdayElement) {
            weekdayElement.classList.add('highlight-change');
        }
    }
}

// Additional functions for more complex editing scenarios

// Function to handle more complex voice commands (for future implementation)
function handleComplexVoiceCommand(command) {
    // This would use more advanced NLP to understand various command formats
    // For example:
    // - "Change my logo to the new design"
    // - "Update the hero image to the beach photo"
    // - "Add a new section about our team"
    
    // For now, we'll just log the command
    console.log('Complex voice command received:', command);
    
    // Return a simulated response
    return {
        success: true,
        message: 'Command processed successfully',
        action: 'update_content',
        details: {
            element: 'section',
            id: 'about-team',
            content: 'New team section content would go here'
        }
    };
}

// Function to simulate AI processing of edit commands
function simulateAIProcessing(command) {
    // This would connect to an AI service to process the command
    // For demo purposes, we'll just return a simulated response after a delay
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                intent: 'update_hours',
                entities: {
                    day_range: 'weekdays',
                    open_time: '9am',
                    close_time: '5pm'
                },
                confidence: 0.92
            });
        }, 1000);
    });
}

// Function to apply content changes with animation
function applyContentChanges(elementId, newContent, highlightChanges = true) {
    const element = document.getElementById(elementId);
    if (!element) return false;
    
    // Store original content for comparison
    const originalContent = element.innerHTML;
    
    // Update content
    element.innerHTML = newContent;
    
    // If highlighting changes is enabled
    if (highlightChanges) {
        // Find differences and apply highlight class
        // This is a simplified approach; a real implementation would use
        // a diff algorithm to identify specific changed elements
        
        element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, div').forEach(el => {
            // Simple check: if the element's text isn't in the original content
            if (originalContent.indexOf(el.textContent) === -1) {
                el.classList.add('highlight-change');
                
                // Remove highlight class after animation completes
                setTimeout(() => {
                    el.classList.remove('highlight-change');
                }, 2000);
            }
        });
    }
    
    return true;
}
