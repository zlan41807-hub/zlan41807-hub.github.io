(() => {
  "use strict";
  if (document.getElementById("jfa-chat-toggle")) return;
  const cfg = window.JFA_CHAT_CONFIG || {};
  let base = "", token = "", busy = false;
  if (cfg.enabled === true && typeof cfg.apiBase === "string") {
    try {
      const u = new URL(cfg.apiBase);
      if (u.protocol === "https:" && !u.username && !u.password && !u.search && !u.hash && u.pathname === "/") base = u.origin;
    } catch (_) { /* fail closed */ }
  }
  const el = (tag, id, text) => { const n = document.createElement(tag); if (id) n.id = id; if (text) n.textContent = text; return n; };
  const bilingual = n => {
    const text = n.textContent, at = text.indexOf(" / ");
    if (at < 0) return;
    const en = el("span", "", text.slice(0, at)), zh = el("span", "", text.slice(at + 3));
    en.lang = "en"; en.className = "jfa-chat-en";
    zh.lang = "zh-CN"; zh.className = "jfa-chat-zh";
    n.replaceChildren(en, zh);
  };
  const toggle = el("button", "jfa-chat-toggle", "Chat with us / 客服人员");
  toggle.type = "button"; toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-controls", "jfa-chat-panel");
  const panel = el("section", "jfa-chat-panel"); panel.hidden = true; panel.setAttribute("aria-label", "JFA AI customer service");
  const header = el("header"), title = el("strong", "", "JFA Design Assistant / 设计助手"), close = el("button", "jfa-chat-close", "×");
  close.type = "button"; close.setAttribute("aria-label", "Close chat / 关闭对话"); header.append(title, close);
  const log = el("div", "jfa-chat-log"); log.setAttribute("role", "log"); log.setAttribute("aria-live", "polite");
  const status = el("p", "jfa-chat-status", base ? "AI answers may be inaccurate. Do not share sensitive data. / 请勿提供敏感信息。" : "AI chat is not connected yet. Please contact us via WhatsApp or email. / AI 客服尚未开通，请通过 WhatsApp 或邮件联系。");
  status.setAttribute("role", "status");
  const form = el("form"), label = el("label", "", "Your message / 你的问题"), input = el("textarea", "jfa-chat-input"), send = el("button", "", "Send / 发送");
  input.placeholder = "Ask about design, pricing or your project… / 咨询设计、报价或项目";
  label.htmlFor = input.id; input.maxLength = 2000; input.required = true; send.type = "submit";
  input.disabled = send.disabled = !base;
  [toggle, title, status, label, send].forEach(bilingual);
  new MutationObserver(() => { if (!status.querySelector(".jfa-chat-en")) bilingual(status); }).observe(status, {childList:true});
  // A real action is always offered, whether or not the assistant is connected.
  const contacts = el("p", "jfa-chat-contacts");
  const link = (href, text, external) => { const a = el("a", "", text); a.href = href; if (external) { a.target = "_blank"; a.rel = "noopener"; } return a; };
  contacts.append(link("https://wa.me/8615958117391", "WhatsApp", true), document.createTextNode(" · "),
    link("mailto:1179060110@qq.com", "Email", false), document.createTextNode(" · "),
    link("start.html", "Start a project / 项目申报", false));
  form.append(label, input, send); panel.append(header, log, status, contacts, form);
  const syncContacts = () => { contacts.hidden = !!base; };
  syncContacts();
  document.body.append(toggle, panel);
  const hide = () => { panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); toggle.focus(); };
  toggle.addEventListener("click", () => { if (!panel.hidden) return hide(); panel.hidden = false; toggle.setAttribute("aria-expanded", "true"); (base ? input : close).focus(); });
  close.addEventListener("click", hide);
  panel.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
  const line = (who, text) => { log.append(el("p", "", who + text)); log.scrollTop = log.scrollHeight; };
  async function request(path, body, auth) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 110000);
    try {
      const res = await fetch(base + path, {method:"POST", mode:"cors", credentials:"omit", redirect:"error", cache:"no-store", referrerPolicy:"no-referrer", signal:controller.signal,
        headers:{"Content-Type":"application/json", "ngrok-skip-browser-warning":"true", ...(auth ? {Authorization:"Bearer " + auth} : {})}, body:JSON.stringify(body)});
      if (!res.ok) { const err = new Error("HTTP " + res.status); err.status = res.status; throw err; }
      return await res.json();
    } finally { clearTimeout(timer); }
  }
  form.addEventListener("submit", async e => {
    e.preventDefault(); const message = input.value.trim(); if (!base || busy || !message || message.length > 2000) return;
    busy = true; send.disabled = input.disabled = true; status.textContent = "Thinking… / 正在回复…";
    try {
      if (!token) { const session = await request("/api/session", {}); if (typeof session.token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(session.token)) throw new Error("invalid session"); token = session.token; }
      line("You / 你: ", message); input.value = "";
      const answer = await request("/api/chat", {message}, token);
      if (typeof answer.text !== "string" || answer.text.length > 8000) throw new Error("invalid response");
      line("JFA AI / 设计助手: ", answer.text); status.textContent = "AI guidance only. Our team will confirm project details. / AI 答复仅供参考，项目细节由团队确认。";
    } catch (err) {
      if (err.status === 401) token = "";
      status.textContent = err.status === 429 ? "Chat limit reached. Please try later or contact us via WhatsApp. / 请求过多或今日额度已用完，请稍后或联系 WhatsApp。" : "Chat is temporarily unavailable. Please use WhatsApp or email; your request was not retried. / 暂时无法连接，未自动重试，请通过 WhatsApp 或邮件联系。";
    } finally { busy = false; send.disabled = input.disabled = false; }
  });
})();
