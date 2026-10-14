/* Welcome-only navigation; no visible countdown banner. */
(() => {
  'use strict';
  const destination = () => new URL('content.html' + location.search + location.hash, location.href).href;
  function transferHash() {
    if (location.hash && location.hash !== '#home') {
      location.replace(destination());
      return true;
    }
    return false;
  }
  if (transferHash()) return;
  window.addEventListener('hashchange', transferHash);
  const start = () => window.setTimeout(() => {
    location.replace(new URL('content.html' + location.search, location.href).href);
  }, 3000);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, {once: true});
})();
