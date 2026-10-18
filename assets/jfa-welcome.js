/* Welcome page navigation.
   The homepage no longer jumps to the content page on a timer: a visitor can
   read the hero and leave whenever they choose. Deep links that carry an
   in-page target (for example index.html#projects) still resolve on the
   content page, because that is where those sections live. */
(() => {
  'use strict';
  function transferHash() {
    if (location.hash && location.hash !== '#home') {
      location.replace(new URL('content.html' + location.search + location.hash, location.href).href);
      return true;
    }
    return false;
  }
  if (transferHash()) return;
  window.addEventListener('hashchange', transferHash);
})();
