/* Welcome page navigation.
   The homepage is a real page and must not move on its own: an earlier version
   sent every visitor to content.html after five seconds, which read as the page
   jumping while people were still looking at the hero.
   Deep links that carry an in-page target (for example index.html#projects)
   still resolve on the content page immediately, because that is where those
   sections live. */
(() => {
  'use strict';
  const url = (hash) => new URL('content.html' + location.search + (hash || ''), location.href).href;
  function transferHash() {
    if (location.hash && location.hash !== '#home') {
      location.replace(url(location.hash));
      return true;
    }
    return false;
  }
  transferHash();
  window.addEventListener('hashchange', transferHash);
})();
