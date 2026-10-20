/* Welcome page navigation.
   The homepage is the fixed entry point and stays on screen for three seconds,
   long enough to read the hero, then hands the visitor to content.html.
   Deep links that carry an in-page target (for example index.html#projects)
   resolve on the content page immediately, because that is where those
   sections live. */
(() => {
  'use strict';
  const HOLD_MS = 3000;
  const url = (hash) => new URL('content.html' + location.search + (hash || ''), location.href).href;
  function transferHash() {
    if (location.hash && location.hash !== '#home') {
      location.replace(url(location.hash));
      return true;
    }
    return false;
  }
  if (transferHash()) return;
  window.addEventListener('hashchange', transferHash);
  const start = () => window.setTimeout(() => location.replace(url('')), HOLD_MS);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
