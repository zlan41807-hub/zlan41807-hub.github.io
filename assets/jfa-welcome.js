/* Welcome-only navigation. The content page never starts this timer. */
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
  document.addEventListener('DOMContentLoaded', () => {
    const pause = document.getElementById('welcomePause');
    const status = document.getElementById('welcomeCountdown');
    let paused = false, deadline, timer;
    function render() {
      const zh = document.documentElement.dataset.lang !== 'en';
      const seconds = deadline ? Math.max(0, Math.ceil((deadline - performance.now()) / 1000)) : 3;
      status.textContent = paused ? (zh ? '自动跳转已暂停 / Navigation paused' : 'Automatic navigation paused') :
        (zh ? `${seconds} 秒后进入内容介绍 / Continuing in ${seconds}s` : `Continuing to Content in ${seconds} seconds`);
      pause.textContent = paused ? (zh ? '已暂停 / Paused' : 'Navigation paused') :
        (zh ? '暂停跳转 / Pause navigation' : 'Pause automatic navigation');
    }
    pause.hidden = false;
    pause.addEventListener('click', () => {
      paused = true;
      clearInterval(timer);
      pause.setAttribute('aria-pressed', 'true');
      render();
    });
    pause.setAttribute('aria-pressed', 'false');
    new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:['data-lang']});
    render();
    window.addEventListener('load', () => {
      if (paused) return;
      deadline = performance.now() + 3000;
      timer = setInterval(() => {
        render();
        if (!paused && performance.now() >= deadline) {
          clearInterval(timer);
          location.replace(new URL('content.html' + location.search, location.href).href);
        }
      }, 100);
    }, {once:true});
  }, {once:true});
})();
