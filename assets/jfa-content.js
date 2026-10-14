/* Presentation changes are scoped to this English content page. */
(() => {
  const next = document.querySelector('#aboutCarousel .carousel-next');
  if (next) { next.textContent = '→'; next.title = 'Next studio image'; }
  const chat = document.getElementById('jfa-chat-toggle');
  const actions = document.querySelector('#about .about-text');
  if (chat && actions) actions.append(chat);
  // Keep other pages' saved display mode untouched; use English option labels here.
  document.querySelectorAll('select option[data-en]').forEach(o => { o.textContent = o.dataset.en; });
})();
