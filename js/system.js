/* ─── Style guide: live token values ─── */
// Each label is read from the site's own CSS at load, so the page can't
// show a value that base.css no longer has.
(function () {
  const root = getComputedStyle(document.documentElement);
  document.querySelectorAll('.token-value[data-token]').forEach(el => {
    el.textContent = root.getPropertyValue(el.dataset.token).trim() || 'not defined';
  });
})();

/* ─── Style guide: show every state on phones ─── */
(function () {
  const toggle = document.querySelector('.sg-toggle');
  if (!toggle) return;
  const section = document.getElementById(toggle.getAttribute('aria-controls'));
  toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(on));
    toggle.textContent = on ? 'Hide hover and pressed states' : 'Show hover and pressed states';
    section.toggleAttribute('data-all-states', on);
  });
})();

/* ─── Style guide: current section in the nav ─── */
(function () {
  const links = new Map();
  document.querySelectorAll('.sg-nav a[href^="#"]').forEach(a => links.set(a.getAttribute('href').slice(1), a));
  const sections = [...document.querySelectorAll('section[aria-labelledby]')];
  if (!sections.length || !links.size) return;

  const mark = id => links.forEach((a, key) => {
    if (key === id) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });

  // A section counts as current once its top passes just under the sticky bar.
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) mark(e.target.getAttribute('aria-labelledby')); });
  }, { rootMargin: '-90px 0px -60% 0px' });
  sections.forEach(s => io.observe(s));
})();
