/* Case view beacon.
 *
 * One record per case page per browser session, sent to the studio's own gateway.
 * Everything here is best-effort: a failed or blocked request must never affect the
 * page, and nothing is sent when the page is not a case page or the backend is unset.
 */
(function () {
  // Cloudflare Pages redirects /case-x.html to /case-x, so the extension is optional here.
  var m = /(?:^|\/)case-([a-z0-9][a-z0-9-]{0,119})(?:\.html)?\/?$/.exec(window.location.pathname);
  if (!m) return;
  var slug = m[1];

  var cfg = window.JFA_CHAT_CONFIG || {};
  var base = String(cfg.apiBase || '').replace(/\/+$/, '');
  if (!base) return;

  var guard = 'jfa-viewed:' + slug;
  try {
    if (window.sessionStorage.getItem(guard)) return;
    window.sessionStorage.setItem(guard, '1');
  } catch (e) { /* private mode: send anyway, sessionStorage is optional */ }

  var sid = '';
  try { sid = window.localStorage.getItem('jfa-visitor') || ''; } catch (e) { sid = ''; }
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(sid)) {
    sid = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2)).slice(0, 24);
    try { window.localStorage.setItem('jfa-visitor', sid); } catch (e) { /* ignore */ }
  }

  function referrerHost() {
    try {
      var r = document.referrer;
      if (!r) return '';
      var host = r.replace(/^[a-z]+:\/\//i, '').split('/')[0];
      return host.slice(0, 160);
    } catch (e) { return ''; }
  }

  function send() {
    var payload = { slug: slug, sid: sid, ref: referrerHost(), w: window.innerWidth | 0 };
    try {
      window.fetch(base + '/api/view', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        keepalive: true,
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Ngrok-Skip-Browser-Warning': '1'
        },
        body: JSON.stringify(payload)
      }).catch(function () { /* offline is not an error the visitor should see */ });
    } catch (e) { /* ignore */ }
  }

  if (document.readyState === 'complete') {
    send();
  } else {
    window.addEventListener('load', send, { once: true });
  }
})();
