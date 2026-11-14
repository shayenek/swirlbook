// Filtry i wyszukiwarka na stronie głównej.
const grid = document.querySelector('#recipe-grid');
if (grid) {
  const cards = [...grid.querySelectorAll('.recipe-card')];
  const filters = [...document.querySelectorAll('.filter')];
  const search = document.querySelector('#search');
  const empty = document.querySelector('#empty');
  let active = 'all';

  const update = () => {
    const q = search.value.trim().toLocaleLowerCase('pl');
    let visible = 0;
    for (const card of cards) {
      const show = (active === 'all' || card.dataset.type === active) && card.dataset.name.includes(q);
      card.hidden = !show;
      if (show) visible += 1;
    }
    empty.hidden = visible !== 0;
  };

  filters.forEach((btn) => btn.addEventListener('click', () => {
    filters.forEach((b) => b.classList.toggle('is-active', b === btn));
    active = btn.dataset.filter;
    update();
  }));
  search.addEventListener('input', update);
}

// Odhaczanie składników i kroków podczas robienia lodów.
document.querySelectorAll('[data-tick]').forEach((el) => {
  el.setAttribute('role', 'checkbox');
  el.setAttribute('aria-checked', 'false');
  el.tabIndex = 0;
  const toggle = () => {
    const done = el.classList.toggle('is-done');
    el.setAttribute('aria-checked', String(done));
  };
  el.addEventListener('click', toggle);
  el.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
  });
});

// Druk.
document.querySelectorAll('[data-print]').forEach((btn) => btn.addEventListener('click', () => window.print()));

// Ekran nie gaśnie, gdy ręce są w kakao.
const wakeBtn = document.querySelector('[data-wake]');
if (wakeBtn && 'wakeLock' in navigator) {
  let lock = null;
  wakeBtn.hidden = false;
  wakeBtn.setAttribute('aria-pressed', 'false');
  const setState = (on) => {
    wakeBtn.setAttribute('aria-pressed', String(on));
    wakeBtn.textContent = on ? 'Ekran nie zgaśnie ✓' : 'Nie wygaszaj ekranu';
  };
  wakeBtn.addEventListener('click', async () => {
    if (lock) { await lock.release(); return; }
    try {
      lock = await navigator.wakeLock.request('screen');
      setState(true);
      lock.addEventListener('release', () => { lock = null; setState(false); });
    } catch { setState(false); }
  });
}
