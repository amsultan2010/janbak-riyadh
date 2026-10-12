// Search and group filter for the Numbers, Help and Links pages.
import { say, fold } from './home.js';

const root = document.querySelector('[data-directory]');
if (root) {
  const search = root.querySelector('[data-dir-search]');
  const results = root.querySelector('[data-dir-results]');
  const none = root.querySelector('[data-dir-none]');
  const links = [...root.querySelectorAll('[data-group]')];
  const sections = [...root.querySelectorAll('section')];
  const entries = [...root.querySelectorAll('.entry')].map((el) => ({ el, q: fold(el.dataset.q), group: el.closest('section').id }));
  let group = '';

  function apply() {
    const tokens = fold(search.value).split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const e of entries) {
      const ok = (!group || e.group === group) && tokens.every((t) => e.q.includes(t));
      e.el.hidden = !ok;
      if (ok) shown++;
    }
    for (const s of sections) s.hidden = !s.querySelector('.entry:not([hidden])');
    for (const a of links) {
      if (a.dataset.group === group) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
    results.hidden = shown === entries.length;
    results.textContent = say('dir.results', { n: shown, total: entries.length });
    none.hidden = shown > 0;
  }

  search.addEventListener('input', apply);
  for (const a of links) {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      group = a.dataset.group;
      apply();
    });
  }
  root.querySelector('[data-dir-tools]').hidden = false;
}
