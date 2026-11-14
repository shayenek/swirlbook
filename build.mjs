// Generator statycznej książki. Uruchom: node build.mjs
// Tworzy index.html, przepis/<slug>.html, ksiazka.html i img/<slug>.svg.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { recipes, rules } from './src/recipes.mjs';
import { artFor } from './src/art.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => String(n).replace('.', ',');
const total = String(recipes.length).padStart(2, '0');
const rated = recipes.filter((r) => r.score !== null);
const average = num(Math.round((rated.reduce((a, r) => a + r.score, 0) / rated.length) * 100) / 100);
const typeLabel = { cream: 'Kremowe', fruit: 'Owocowe' };
const ranked = [...recipes].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

const scoreText = (r) => (r.score === null ? 'Do oceny' : `${num(r.score)}/10`);
const scoreHtml = (r) => (r.score === null
  ? '<span class="score pending">Do oceny</span>'
  : `<span class="score">${num(r.score)}<small>/10</small></span>`);

const brand = `<a class="brand" href="/" aria-label="Książka lodów, strona główna"><span class="brand-mark" aria-hidden="true">✳</span><span>zimna<em>rzecz</em></span></a>`;

function page({ title, description, body, bodyClass = '' }) {
  return `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#f5f1e8">
  <meta name="description" content="${esc(description)}">
  <title>${esc(title)}</title>
  <link rel="icon" href="/img/kakaowe.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body class="${bodyClass}">
${body}
  <script src="/app.js" defer></script>
</body>
</html>
`;
}

const footer = `<footer class="footer">${brand}<p>Osobisty notatnik smaków · Ninja CREAMi Swirl NC701EU</p></footer>`;

// ---------- strona główna ----------

function card(r, i) {
  const keywords = [r.name, r.title, r.tag, typeLabel[r.type], ...r.ingredients.map((x) => x[1])].join(' ').toLocaleLowerCase('pl');
  return `<a class="recipe-card${r.score === null ? ' is-pending' : ''}" href="/przepis/${r.slug}" data-type="${r.type}" data-name="${esc(keywords)}">
        <span class="card-art"><img src="/img/${r.slug}.svg" alt="" width="800" height="600" loading="${i < 3 ? 'eager' : 'lazy'}"></span>
        <span class="card-body">
          <span class="card-top"><span class="card-tag">${esc(r.tag)}</span>${scoreHtml(r)}</span>
          <span class="card-title">${esc(r.name)}</span>
          <span class="card-lede">${esc(r.lede)}</span>
          <span class="card-foot"><span>${esc(r.mode)}</span><span class="card-go">Otwórz przepis <span aria-hidden="true">→</span></span></span>
        </span>
      </a>`;
}

function indexPage() {
  const cream = recipes.filter((r) => r.type === 'cream').length;
  const fruit = recipes.filter((r) => r.type === 'fruit').length;
  const best = ranked[0];
  const body = `
  <header class="topbar">
    ${brand}
    <nav class="topnav" aria-label="Nawigacja główna">
      <a href="#przepisy">Przepisy</a>
      <a href="#ranking">Ranking</a>
      <a href="#zasady">Zasady</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow"><span class="dot"></span>Domowe testy · Ninja CREAMi Swirl</p>
        <h1>Mała księga<br>dobrych <i>lodów.</i></h1>
        <p class="hero-lede">Dziewięć smaków, konkretne proporcje i notatki prosto z kuchni. Każdy przepis ma swoją stronę.</p>
        <dl class="hero-meta">
          <div><dt>receptur</dt><dd>${total}</dd></div>
          <div><dt>średnia ocen</dt><dd>${average}</dd></div>
          <div><dt>faworyt</dt><dd><a href="/przepis/${best.slug}">${esc(best.name)}</a></dd></div>
        </dl>
      </div>
      <a class="hero-art" href="/przepis/${best.slug}">
        <img src="/img/${best.slug}.svg" alt="Ilustracja: lody kakaowe w miseczce z wisienką" width="800" height="600">
        <span class="hero-badge">Nr 1 · ${scoreText(best)}</span>
      </a>
    </section>

    <section class="section" id="przepisy">
      <div class="section-head">
        <div><p class="eyebrow">Zamroź · ukręć · spróbuj</p><h2>Przepisy</h2></div>
        <label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Szukaj smaku lub składnika" aria-label="Szukaj przepisu"></label>
      </div>
      <div class="filters" role="group" aria-label="Filtruj przepisy">
        <button class="filter is-active" type="button" data-filter="all">Wszystkie <span>${recipes.length}</span></button>
        <button class="filter" type="button" data-filter="cream">Kremowe <span>${cream}</span></button>
        <button class="filter" type="button" data-filter="fruit">Owocowe <span>${fruit}</span></button>
      </div>
      <div class="recipe-grid" id="recipe-grid">
      ${recipes.map(card).join('\n      ')}
      </div>
      <p class="empty" id="empty" hidden>Nie ma takiego smaku. Spróbuj innej nazwy.</p>
    </section>

    <section class="section" id="ranking">
      <div class="section-head">
        <div><p class="eyebrow">Werdykt zamrażarki</p><h2>Ranking</h2></div>
        <a class="button-ghost" href="/ksiazka">Cała książka do druku <span aria-hidden="true">→</span></a>
      </div>
      <ol class="rank">
        ${ranked.map((r) => `<li><a class="rank-row${r === best ? ' is-best' : ''}${r.score === null ? ' is-pending' : ''}" href="/przepis/${r.slug}">
          <span class="rank-no">${r.rank}</span>
          <img class="rank-thumb" src="/img/${r.slug}.svg" alt="" width="800" height="600" loading="lazy">
          <span class="rank-name">${esc(r.name)}${r.kicker ? ` <small>${esc(r.kicker)}</small>` : ''}</span>
          ${scoreHtml(r)}
        </a></li>`).join('\n        ')}
      </ol>
    </section>

    <section class="rules" id="zasady">
      <div class="rules-inner">
        <div>
          <p class="eyebrow">Mały manifest zamrażarki</p>
          <h2>Dobre lody<br>lubią <i>porządek.</i></h2>
          <p class="rules-intro">Kilka zasad, które pomagają powtórzyć udany test.</p>
        </div>
        <ol class="rules-list">
          ${rules.map((r, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(r)}</p></li>`).join('\n          ')}
        </ol>
      </div>
    </section>
  </main>
  ${footer}`;
  return page({
    title: 'Książka lodów — Ninja CREAMi Swirl',
    description: 'Osobista książka przepisów do Ninja CREAMi Swirl NC701EU.',
    body,
  });
}

// ---------- strona przepisu ----------

function recipeBlock(r, i, { headingTag = 'h1', interactive = true } = {}) {
  const programs = r.programs.map((p) => `<span class="chip">${esc(p)}</span>`).join('<span class="chip-arrow" aria-hidden="true">→</span>');
  const tick = interactive ? ' data-tick' : '';
  return `<article class="recipe" id="${r.slug}">
    <header class="recipe-hero">
      <div class="recipe-art"><img src="/img/${r.slug}.svg" alt="Ilustracja: ${esc(r.name)}" width="800" height="600"></div>
      <div class="recipe-intro">
        <p class="eyebrow">Przepis ${String(i + 1).padStart(2, '0')} / ${total} · ${typeLabel[r.type]}</p>
        <${headingTag} class="recipe-title">${esc(r.title)}</${headingTag}>
        <p class="recipe-lede">${esc(r.lede)}</p>
        <div class="recipe-facts">
          <div class="fact"><span class="fact-label">Ocena</span>${scoreHtml(r)}</div>
          <div class="fact"><span class="fact-label">Status</span><span class="fact-value">${esc(r.tag)}</span></div>
        </div>
        <div class="programs"><span class="fact-label">Programy</span><div class="chips">${programs}</div>${r.programNote ? `<p class="program-note">${esc(r.programNote)}</p>` : ''}</div>
      </div>
    </header>

    <div class="recipe-body">
      <section class="panel ingredients">
        <h2>${esc(r.ingredientsTitle ?? 'Składniki')}</h2>
        <ul class="ing-list">
          ${r.ingredients.map(([amount, item]) => `<li${tick}><span class="ing-amount">${esc(amount)}</span><span class="ing-item">${esc(item)}</span></li>`).join('\n          ')}
        </ul>
        ${interactive ? '<p class="hint">Dotknij składnika lub kroku, żeby go odhaczyć.</p>' : ''}
      </section>
      <section class="method">
        <h2>Przygotowanie</h2>
        <ol class="steps">
          ${r.steps.map((s) => `<li${tick}><span>${esc(s)}</span></li>`).join('\n          ')}
        </ol>
        <aside class="note">
          <h3>${esc(r.noteTitle)}</h3>
          ${r.notes.map((n) => `<p>${esc(n)}</p>`).join('\n          ')}
        </aside>
      </section>
    </div>
  </article>`;
}

function recipePage(r, i) {
  const prev = recipes[(i - 1 + recipes.length) % recipes.length];
  const next = recipes[(i + 1) % recipes.length];
  const body = `
  <header class="topbar">
    ${brand}
    <a class="back" href="/#przepisy"><span aria-hidden="true">←</span> Wszystkie przepisy</a>
  </header>
  <main class="recipe-page">
    ${recipeBlock(r, i)}
    <div class="tools">
      <button class="button-ghost" type="button" data-wake hidden>Nie wygaszaj ekranu</button>
      <button class="button-ghost" type="button" data-print>Drukuj przepis</button>
    </div>
    <nav class="pager" aria-label="Inne przepisy">
      <a class="pager-link" href="/przepis/${prev.slug}"><img src="/img/${prev.slug}.svg" alt="" width="800" height="600" loading="lazy"><span><small>← Poprzedni</small>${esc(prev.name)}</span></a>
      <a class="pager-link is-next" href="/przepis/${next.slug}"><span><small>Następny →</small>${esc(next.name)}</span><img src="/img/${next.slug}.svg" alt="" width="800" height="600" loading="lazy"></a>
    </nav>
  </main>
  ${footer}`;
  return page({
    title: `${r.title} — książka lodów`,
    description: r.lede,
    body,
    bodyClass: 'is-recipe',
  });
}

function bookPage() {
  const body = `
  <header class="topbar">
    ${brand}
    <a class="back" href="/"><span aria-hidden="true">←</span> Strona główna</a>
  </header>
  <main class="book">
    <div class="book-head">
      <h1>Cała książka</h1>
      <button class="button-solid" type="button" data-print>Drukuj wszystkie przepisy</button>
    </div>
    ${recipes.map((r, i) => recipeBlock(r, i, { headingTag: 'h2', interactive: false })).join('\n    ')}
  </main>
  ${footer}`;
  return page({ title: 'Cała książka — książka lodów', description: 'Wszystkie przepisy na jednej stronie do druku.', body, bodyClass: 'is-book' });
}

// ---------- zapis ----------

rmSync('przepis', { recursive: true, force: true });
rmSync('img', { recursive: true, force: true });
mkdirSync('przepis');
mkdirSync('img');

for (const r of recipes) writeFileSync(`img/${r.slug}.svg`, artFor(r.slug));
recipes.forEach((r, i) => writeFileSync(`przepis/${r.slug}.html`, recipePage(r, i)));
writeFileSync('index.html', indexPage());
writeFileSync('ksiazka.html', bookPage());

console.log(`Gotowe: ${recipes.length} przepisów, średnia ${average}.`);
