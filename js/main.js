// Minimal main.js for ChatSites Portal (Real-Time Voice Only)

// Wait for page load
// Setup: Only handles portal activation and hands off to real-time voice

document.addEventListener('DOMContentLoaded', function() {
  initPortalDemo();
});

function initPortalDemo() {
  const activateButton = document.getElementById('activate-portal');
  const startDemoButton = document.getElementById('start-demo');
  const portalWelcome = document.getElementById('portal-welcome');
  const aiAssistant = document.getElementById('ai-assistant');

  // Activate portal from welcome screen
  if (activateButton) {
    activateButton.addEventListener('click', () => {
      activatePortal();
    });
  }

  // Start demo from hero section
  if (startDemoButton) {
    startDemoButton.addEventListener('click', () => {
      const portalDemo = document.querySelector('.portal-demo-container');
      portalDemo.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (portalWelcome.classList.contains('active')) {
          activatePortal();
        }
      }, 1000);
    });
  }

  function activatePortal() {
    portalWelcome.classList.remove('active');
    portalWelcome.classList.add('hidden');
    aiAssistant.classList.remove('hidden');
    aiAssistant.classList.add('active');

    // Start AI voice greeting via real-time API
    if (window.openAIRealtimeAPI && window.openAIRealtimeAPI.sendTextMessage) {
      setTimeout(() => {
        window.openAIRealtimeAPI.sendTextMessage("Hello! I'm your ChatSites assistant. How can I help you today?");
      }, 600);
    }
  }
}
