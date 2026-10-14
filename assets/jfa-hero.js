(() => {
  'use strict';
  const hero = document.querySelector('.hero-carousel');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.hero-slide')];
  const controls = hero.querySelector('.hero-carousel-controls');
  const dots = [...hero.querySelectorAll('.hero-dots button')];
  const rotation = hero.querySelector('.hero-rotation');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, paused = reduced.matches, hovered = false, focused = false;
  controls.hidden = false;
  function schedule() {
    clearInterval(timer);
    const running = !paused && !reduced.matches && !hovered && !focused && !document.hidden;
    hero.dataset.autoplay = running ? 'running' : 'paused';
    rotation.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
    rotation.hidden = reduced.matches;
    if (running) timer = setInterval(() => show(current + 1, false), 6000);
  }
  function show(index, announce = true) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      if (i === current) dots[i].setAttribute('aria-current', 'true');
      else dots[i].removeAttribute('aria-current');
    });
    hero.querySelector('.hero-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (announce) hero.querySelector('.hero-status').textContent = slides[current].getAttribute('aria-label');
    schedule();
  }
  hero.querySelector('.hero-prev').addEventListener('click', () => show(current - 1));
  hero.querySelector('.hero-next').addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  rotation.addEventListener('click', () => { paused = !paused; schedule(); });
  hero.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovered = true; schedule(); } });
  hero.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  hero.addEventListener('focusin', () => { focused = true; schedule(); });
  hero.addEventListener('focusout', () => { setTimeout(() => { focused = hero.contains(document.activeElement); schedule(); }, 0); });
  controls.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); show(current + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  let start;
  hero.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' && !e.target.closest('a,button')) start = {x: e.clientX, y: e.clientY};
  });
  hero.addEventListener('pointerup', e => {
    if (!start) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  });
  hero.addEventListener('pointercancel', () => { start = null; });
  reduced.addEventListener('change', () => { paused = true; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  schedule();
})();
