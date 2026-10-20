/* Welcome page navigation.
   The homepage is the entry screen: it holds for three seconds so the visitor can
   read the hero, then hands them to content.html, where the full site lives.
   The count starts when the hero is parsed rather than when every image has
   finished loading, so a slow first visit does not stretch the wait.
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
  const advance = () => window.setTimeout(() => location.replace(url('')), HOLD_MS);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', advance, { once: true });
  } else {
    advance();
  }
})();
