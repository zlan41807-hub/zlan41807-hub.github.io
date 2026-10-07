// Public configuration only. No credentials.
// apiBase is the public HTTPS tunnel that fronts the loopback customer-service gateway.
// If the tunnel URL changes, update apiBase here and redeploy, or set enabled:false (the widget then shows the offline notice).
window.JFA_CHAT_CONFIG = Object.freeze({enabled: true, apiBase: "https://rebates-gordon-infrastructure-yesterday.trycloudflare.com"});
