// Minimal main.js for ChatSites Portal (Realtime Voice-Only)

// Wait for page load and activate portal

document.addEventListener('DOMContentLoaded', async function () {
  await initializeAndGreet();
});

async function initializeAndGreet() {
  const portalWelcome = document.getElementById('portal-welcome');
  const aiAssistant = document.getElementById('ai-assistant');

  // Show the assistant UI
  if (portalWelcome) portalWelcome.classList.add('hidden');
  if (aiAssistant) aiAssistant.classList.remove('hidden');

  const statusBox = document.getElementById('webrtc-status');
  if (statusBox) statusBox.textContent = '🔄 Connecting...';

  // 🔑 Get your ephemeral key from your server (this is a placeholder)
  const ephemeralKey = await fetchEphemeralKey();
  if (!ephemeralKey) {
    console.error("❌ Failed to get ephemeral key");
    return;
  }

  // 🧠 Initialize the OpenAI Realtime API
  const initialized = await window.openAIRealtimeAPI.initialize(
    ephemeralKey,
    (status) => {
      console.log("[Status]", status);
      if (statusBox) statusBox.textContent = `🎯 ${status}`;
    },
    (partial) => {
      console.log("[Transcript]", partial);
    },
    (finalResponse) => {
      console.log("[AI Response]", finalResponse);
    }
  );

  if (!initialized) return;

  // ✅ Send first message to trigger voice response
  setTimeout(() => {
    window.openAIRealtimeAPI.sendTextMessage("Hello! I'm your ChatSites assistant. How can I help you today?");
  }, 600);
}

// 🔐 Replace with your own server logic
async function fetchEphemeralKey() {
  try {
    const response = await fetch("/get-ephemeral-key");
    const data = await response.json();
    return data.key;
  } catch (err) {
    console.error("Error fetching ephemeral key:", err);
    return null;
  }
}
