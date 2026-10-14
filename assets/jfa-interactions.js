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
    const card = button.closest('.project-card');
    const title = card.querySelector('h4')?.textContent.trim();
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
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button));
      });
      document.querySelectorAll('.project-card').forEach(card => {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      });
    });
  });
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
