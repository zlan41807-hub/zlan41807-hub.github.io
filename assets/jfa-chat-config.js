// Public configuration only. No credentials.
// apiBase is the permanent public HTTPS address of the customer-service backend
// (ngrok free fixed domain; the visitor never sees it). Keep the ngrok-skip-browser-warning
// header in jfa-chat.js: without it ngrok serves its interstitial page instead of our JSON.
window.JFA_CHAT_CONFIG = Object.freeze({enabled: true, apiBase: "https://moustache-antitoxic-deliverer.ngrok-free.dev"});
