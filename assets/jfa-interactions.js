/* Shared progressive enhancements. No network requests or contact routing changes. */
(() => {
  'use strict';
  const nav = document.getElementById('navLinks');
  const toggle = document.querySelector('.nav-toggle');
  const mobile = matchMedia('(max-width: 880px)');
  // Put the disclosure before its links in DOM order so Tab enters the menu.
  if (nav && toggle) nav.before(toggle);
  function setMenu(open, restore = false) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (restore) toggle.focus();
  }
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', e => {
    if (mobile.matches && !e.target.closest('#navbar')) setMenu(false);
  });
  document.addEventListener('focusin', e => {
    if (mobile.matches && !e.target.closest('#navbar')) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));
  nav?.querySelectorAll('a').forEach(a => {
    if (new URL(a.href).pathname === location.pathname && !new URL(a.href).hash) a.setAttribute('aria-current', 'page');
  });

  const content = document.querySelector('main') || document.querySelector('section');
  if (content) {
    if (!content.id) content.id = 'main-content';
    content.tabIndex = -1;
    const skip = document.createElement('a');
    skip.href = '#' + content.id; skip.className = 'skip-link'; skip.textContent = 'Skip to content';
    skip.addEventListener('click', () => content.focus());
    document.body.prepend(skip);
  }

  const dialog = document.getElementById('aiLightbox');
  const image = document.getElementById('aiLightboxImg');
  let returnTo, oldOverflow;
  window.openProjectImage = (source, trigger) => {
    if (!dialog || !source) return;
    returnTo = trigger || document.activeElement;
    image.src = source.currentSrc || source.src;
    image.alt = source.alt.replace(/^\s*\/\s*/, '');
    document.getElementById('aiLightboxCaption').textContent = image.alt;
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('button').focus();
  };
  dialog?.querySelector('button').addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog?.addEventListener('close', () => {
    document.body.style.overflow = oldOverflow || '';
    returnTo?.focus({preventScroll: true});
  });
  document.querySelectorAll('.project-open').forEach(button => {
    const card = button.closest('.dz-card, .project-card, .cs-card');
    const title = card.querySelector('h4, h3')?.textContent.trim();
    button.setAttribute('aria-label', 'View ' + title);
    button.addEventListener('click', () => window.openProjectImage(card.querySelector('img'), button));
  });
  const slider = document.getElementById('residentialSlider');
  if (slider) {
    const enlarge = document.createElement('button');
    enlarge.type = 'button'; enlarge.className = 'project-enlarge';
    enlarge.textContent = 'Enlarge'; enlarge.setAttribute('aria-label', 'Enlarge current residential image');
    slider.append(enlarge); // Existing slider click handler resolves the current slide.
  }
  // Featured Projects: one card per screen, same anatomy as the designs carousel.
  const pjButtons = [...document.querySelectorAll('#projects .dz-filter')];
  const pjCards = [...document.querySelectorAll('#projects .dz-card')];
  const pjGrid = document.getElementById('pjGrid');
  if (pjButtons.length && pjCards.length) {
    const pjPrev = document.getElementById('pjPrev');
    const pjNext = document.getElementById('pjNext');
    const pjPos = document.getElementById('pjPos');
    const pjNav = document.querySelector('.pj-nav');
    let pjCat = pjButtons[0].dataset.filter;
    let pjIndex = 0;

    const pjMeasure = () => {
      if (!pjGrid) return;
      // Showing all cards at once to measure them grew the document from about 9,000px
      // to about 41,000px for a single frame. On a phone that frame (the URL bar showing
      // or hiding fires resize) threw the scroll position down to the footer, so the grid
      // is pinned to its current height while the measurement happens.
      const lock = Math.round(pjGrid.getBoundingClientRect().height);
      const prevMin = pjGrid.style.minHeight;
      pjGrid.style.minHeight = lock + 'px';
      pjGrid.style.maxHeight = lock + 'px';
      pjGrid.style.overflow = 'hidden';
      pjGrid.style.removeProperty('--dz-card-h');
      const keep = pjCards.map(card => card.hidden);
      pjCards.forEach(card => { card.hidden = false; });
      void pjGrid.offsetHeight;
      let tallest = 0;
      pjCards.forEach(card => {
        const h = card.getBoundingClientRect().height;
        if (h > tallest) tallest = h;
      });
      pjGrid.style.setProperty('--dz-card-h', Math.round(tallest) + 'px');
      pjCards.forEach((card, i) => { card.hidden = keep[i]; });
      pjGrid.style.minHeight = prevMin;
      pjGrid.style.maxHeight = '';
      pjGrid.style.overflow = '';
      void pjGrid.offsetHeight;
    };

    const pjRender = () => {
      const items = pjCards.filter(card => (card.dataset.cat || card.dataset.category) === pjCat);
      if (pjIndex >= items.length) pjIndex = 0;
      if (pjIndex < 0) pjIndex = items.length - 1;
      pjCards.forEach(card => { card.hidden = true; });
      if (items[pjIndex]) { items[pjIndex].hidden = false; items[pjIndex].classList.add('visible'); }
      pjButtons.forEach(b => {
        const on = b.dataset.filter === pjCat;
        b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on));
      });
      if (pjPos) pjPos.textContent = items.length ? (pjIndex + 1) + ' / ' + items.length : '0 / 0';
      const pjCount = document.getElementById('pjCount');
      if (pjCount) pjCount.textContent = items.length;
      if (pjPrev) pjPrev.disabled = items.length < 2;
      if (pjNext) pjNext.disabled = items.length < 2;
      if (pjNav) pjNav.hidden = items.length < 2;
    };

    pjButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.classList.contains('is-on')));
      button.addEventListener('click', () => {
        if (button.dataset.filter === pjCat) return;
        pjCat = button.dataset.filter; pjIndex = 0; pjRender();
      });
    });
    pjPrev?.addEventListener('click', () => { pjIndex--; pjRender(); });
    pjNext?.addEventListener('click', () => { pjIndex++; pjRender(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' && pjPrev && !pjPrev.disabled) { pjIndex--; pjRender(); }
      if (e.key === 'ArrowRight' && pjNext && !pjNext.disabled) { pjIndex++; pjRender(); }
    });
    let pjTimer = null, pjWidth = window.innerWidth;
    addEventListener('resize', () => {
      clearTimeout(pjTimer);
      pjTimer = setTimeout(() => {
        // Phone browsers fire resize every time the URL bar shows or hides. The card
        // height only depends on the width, so a height-only change must not re-measure.
        if (window.innerWidth === pjWidth) return;
        pjWidth = window.innerWidth;
        pjMeasure(); pjRender();
      }, 180);
    });
    pjMeasure();
    pjRender();
  }
  document.querySelectorAll('.pv-toggle,.hiw-tabs').forEach(group => {
    group.setAttribute('role', 'group');
    group.querySelectorAll('[role="tab"]').forEach(button => { button.removeAttribute('role'); button.removeAttribute('aria-selected'); });
  });
  document.querySelectorAll('.dz-filter,.pv-toggle button,.hiw-tabs button').forEach(button => {
    const update = () => button.setAttribute('aria-pressed', String(button.classList.contains('is-on')));
    new MutationObserver(update).observe(button, {attributes: true, attributeFilter: ['class']}); update();
  });
  const carousel = document.getElementById('aboutCarousel');
  if (carousel) {
    const images = [...carousel.querySelectorAll('.carousel-img')];
    if (images.length > 1) {
      let index = 0;
      const control = document.createElement('button'); control.type = 'button'; control.className = 'carousel-next';
      control.textContent = 'Next image'; control.setAttribute('aria-label', 'Show next studio image');
      control.addEventListener('click', () => {
        images[index].classList.remove('active'); index = (index + 1) % images.length; images[index].classList.add('active');
      }); carousel.append(control);
    }
  }
  // The source's start-form labels were empty. Restore visible, descriptive names.
  const labels = {stUnit:'Unit / Suite',stStreet:'Street address',stCity:'City *',stProvince:'State / Province',stPostcode:'Postal code *',stName:'Name *',stCompany:'Company',stClientType:'Client type *',stPreferred:'Preferred contact method *',stEmail:'Email',stPhone:'Phone *',stAltContact:'Alternative contact',stRole:'Your role',stService:'Service needed *',stArea:'Project area (m²)',stBudget:'Budget',stTimeline:'Timeline',stMessage:'Project details'};
  Object.entries(labels).forEach(([id, label]) => {
    const field = document.getElementById(id); const el = document.querySelector(`label[for="${id}"]`);
    if (field && el && !/[A-Za-z]/.test(el.textContent)) el.textContent = label;
  });
  document.querySelectorAll('form').forEach(form => {
    const status = document.createElement('p');
    status.className = 'sr-only'; status.setAttribute('role', 'status'); form.append(status);
    const submit = form.querySelector('[type="submit"]');
    if (submit) new MutationObserver(() => { status.textContent = submit.textContent.trim(); }).observe(submit, {childList:true, subtree:true});
  });
})();
