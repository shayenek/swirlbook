// Generator statycznej książki. Uruchom: node build.mjs
// Tworzy index.html, przepis/<slug>.html, ksiazka.html i img/<slug>.svg.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { recipes, rules } from './src/recipes.mjs';
import { artFor } from './src/art.mjs';
import { nutritionFor } from './src/nutrition.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => String(n).replace('.', ',');
const iceRecipes = recipes.filter((r) => r.category !== 'other');
const otherRecipes = recipes.filter((r) => r.category === 'other');
const total = String(iceRecipes.length).padStart(2, '0');
const rated = iceRecipes.filter((r) => r.score !== null);
const average = num(Math.round((rated.reduce((a, r) => a + r.score, 0) / rated.length) * 100) / 100);
const typeLabel = { cream: 'Kremowe', fruit: 'Owocowe' };
const ranked = [...iceRecipes].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

const scoreText = (r) => (r.score === null ? 'Do oceny' : `${num(r.score)}/10`);
const scoreHtml = (r) => (r.score === null
  ? '<span class="score pending">Do oceny</span>'
  : `<span class="score">${num(r.score)}<small>/10</small></span>`);

const brand = `<a class="brand" href="/" aria-label="Przepisomania, strona główna"><img class="brand-logo" src="/logo.svg" alt="" width="36" height="36"><span>Przepiso<em>mania</em></span></a>`;

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
  <link rel="icon" href="/logo.svg" type="image/svg+xml">
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

const footer = `<footer class="footer">${brand}<p>Osobisty notatnik przepisów</p></footer>`;

// ---------- strona główna ----------

function card(r, i) {
  const isOther = r.category === 'other';
  const nutrition = nutritionFor(r.slug);
  const keywords = [r.name, r.title, r.tag, typeLabel[r.type] ?? '', ...r.ingredients.map((x) => x[1])].join(' ').toLocaleLowerCase('pl');
  return `<a class="recipe-card${!isOther && r.score === null ? ' is-pending' : ''}" href="/przepis/${r.slug}" data-type="${r.type ?? 'other'}" data-name="${esc(keywords)}">
        <span class="card-art"><img src="/img/${r.slug}.svg" alt="" width="800" height="600" loading="${i < 3 ? 'eager' : 'lazy'}"></span>
        <span class="card-body">
          <span class="card-top"><span class="card-tag">${esc(r.tag)}</span>${isOther ? '' : scoreHtml(r)}</span>
          <span class="card-title">${esc(r.name)}</span>
          <span class="card-lede">${esc(r.lede)}</span>
${nutrition ? `          <span class="card-nutrition">≈ ${Math.round(nutrition.per100.kcal)} kcal / 100 g</span>\n` : ''}
          <span class="card-foot"><span>${esc(isOther ? r.duration : r.mode)}</span><span class="card-go">Otwórz przepis <span aria-hidden="true">→</span></span></span>
        </span>
      </a>`;
}

function indexPage() {
  const cream = iceRecipes.filter((r) => r.type === 'cream').length;
  const fruit = iceRecipes.filter((r) => r.type === 'fruit').length;
  const best = ranked[0];
  const body = `
  <header class="topbar">
    ${brand}
    <nav class="topnav" aria-label="Nawigacja po lodach">
      <a href="#przepisy">Przepisy</a>
      <a href="#ranking">Ranking</a>
      <a href="#zasady">Zasady</a>
    </nav>
  </header>

  <main>
    <div class="category-tabs" role="tablist" aria-label="Kategorie przepisów">
      <button id="tab-lody" class="category-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="panel-lody" data-category="lody">Lody <span>${iceRecipes.length}</span></button>
      <button id="tab-inne-przepisy" class="category-tab" type="button" role="tab" aria-selected="false" aria-controls="panel-inne-przepisy" data-category="inne-przepisy" tabindex="-1">Inne przepisy <span>${otherRecipes.length}</span></button>
    </div>
    <div id="panel-lody" role="tabpanel" aria-labelledby="tab-lody">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow"><span class="dot"></span>Domowe testy · Ninja CREAMi Swirl</p>
        <h1>Mała księga<br>dobrych <i>lodów.</i></h1>
        <p class="hero-lede">${iceRecipes.length} smaków, konkretne proporcje i notatki prosto z kuchni. Każdy przepis ma swoją stronę.</p>
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
        <button class="filter is-active" type="button" data-filter="all">Wszystkie <span>${iceRecipes.length}</span></button>
        <button class="filter" type="button" data-filter="cream">Kremowe <span>${cream}</span></button>
        <button class="filter" type="button" data-filter="fruit">Owocowe <span>${fruit}</span></button>
      </div>
      <div class="recipe-grid" id="recipe-grid">
      ${iceRecipes.map(card).join('\n      ')}
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
    </div>

    <section class="section other-section" id="panel-inne-przepisy" role="tabpanel" aria-labelledby="tab-inne-przepisy" hidden>
      <div class="section-head">
        <div><p class="eyebrow">Z domowej kuchni</p><h1>Inne przepisy</h1></div>
      </div>
      <p class="other-intro">Sprawdzone przepisy poza lodami, z dokładnymi proporcjami i krokami.</p>
      <div class="recipe-grid">
        ${otherRecipes.map(card).join('\n        ')}
      </div>
    </section>
  </main>
  ${footer}`;
  return page({
    title: 'Przepisomania — lody i inne przepisy',
    description: 'Osobista książka lodów i innych przepisów.',
    body,
  });
}

// ---------- strona przepisu ----------

function nutritionBlock(r) {
  const data = nutritionFor(r.slug);
  if (!data) return '';
  const columns = [
    ['Energia', 'kcal', 'kcal'],
    ['Białko', 'protein', 'g'],
    ['Tłuszcz', 'fat', 'g'],
    ['Węglowodany', 'carbs', 'g'],
    ['w tym cukry', 'sugars', 'g'],
  ];
  const value = (number, unit) => `${num(unit === 'kcal' ? Math.round(number) : (Math.round(number * 10) / 10).toFixed(1))} ${unit}`;
  return `<section class="nutrition" aria-labelledby="nutrition-${r.slug}">
    <div class="nutrition-head">
      <div><p class="eyebrow">Wartości szacunkowe</p><h2 id="nutrition-${r.slug}">Kalorie i wartości odżywcze</h2></div>
      <p>Masa bazy: <strong>≈ ${num(data.mass)} g</strong></p>
    </div>
    <div class="nutrition-table-wrap"><table class="nutrition-table">
      <thead><tr><th scope="col">Składnik</th><th scope="col">Cała baza</th><th scope="col">100 g</th></tr></thead>
      <tbody>${columns.map(([label, key, unit]) => `<tr><th scope="row">${label}</th><td>${value(data.whole[key], unit)}</td><td>${value(data.per100[key], unit)}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="nutrition-note">Zawartość tłuszczu w bazie: ≈ ${num((Math.round(data.per100.fat * 10) / 10).toFixed(1))}%. ${esc(data.assumptions)} Wartości dotyczą składników przed mrożeniem i ewentualnym odłożeniem nadmiaru ponad MAX FILL. Rzeczywista porcja może się różnić.</p>
  </section>`;
}

function recipeBlock(r, i, { headingTag = 'h1', interactive = true } = {}) {
  const isOther = r.category === 'other';
  const categoryRecipes = isOther ? otherRecipes : iceRecipes;
  const number = categoryRecipes.indexOf(r) + 1;
  const programs = isOther ? '' : r.programs.map((p) => `<span class="chip">${esc(p)}</span>`).join('<span class="chip-arrow" aria-hidden="true">→</span>');
  const tick = interactive ? ' data-tick' : '';
  return `<article class="recipe" id="${r.slug}">
    <header class="recipe-hero">
      <div class="recipe-art"><img src="/img/${r.slug}.svg" alt="Ilustracja: ${esc(r.name)}" width="800" height="600"></div>
      <div class="recipe-intro">
        <p class="eyebrow">${isOther ? 'Inne przepisy' : `Przepis ${String(number).padStart(2, '0')} / ${total} · ${typeLabel[r.type]}`}</p>
        <${headingTag} class="recipe-title">${esc(r.title)}</${headingTag}>
        <p class="recipe-lede">${esc(r.lede)}</p>
        <div class="recipe-facts">
          ${isOther ? `<div class="fact"><span class="fact-label">Czas</span><span class="fact-value">${esc(r.duration)}</span></div>` : `<div class="fact"><span class="fact-label">Ocena</span>${scoreHtml(r)}</div>`}
          <div class="fact"><span class="fact-label">${isOther ? 'Rodzaj' : 'Status'}</span><span class="fact-value">${esc(r.tag)}</span></div>
        </div>${isOther ? '' : `
        <div class="programs"><span class="fact-label">Programy</span><div class="chips">${programs}</div>${r.programNote ? `<p class="program-note">${esc(r.programNote)}</p>` : ''}</div>`}
      </div>
    </header>

${nutritionBlock(r)}

    <div class="recipe-body">
      <section class="panel ingredients">
        <h2>${esc(r.ingredientsTitle ?? 'Składniki')}</h2>
        <ul class="ing-list">
          ${r.ingredients.map(([amount, item]) => `<li${tick}><span class="ing-amount">${esc(amount)}</span><span class="ing-item">${esc(item)}</span></li>`).join('\n          ')}
        </ul>${interactive ? '\n        <p class="hint">Dotknij składnika lub kroku, żeby go odhaczyć.</p>' : ''}
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
  const isOther = r.category === 'other';
  const categoryRecipes = isOther ? otherRecipes : iceRecipes;
  const position = categoryRecipes.indexOf(r);
  const prev = categoryRecipes[(position - 1 + categoryRecipes.length) % categoryRecipes.length];
  const next = categoryRecipes[(position + 1) % categoryRecipes.length];
  const body = `
  <header class="topbar">
    ${brand}
    <a class="back" href="/${isOther ? '#inne-przepisy' : '#przepisy'}"><span aria-hidden="true">←</span> ${isOther ? 'Inne przepisy' : 'Lody'}</a>
  </header>
  <main class="recipe-page">
    ${recipeBlock(r, i)}
    <div class="tools">
      <button class="button-ghost" type="button" data-wake hidden>Nie wygaszaj ekranu</button>
      <button class="button-ghost" type="button" data-print>Drukuj przepis</button>
    </div>
    ${categoryRecipes.length > 1 ? `<nav class="pager" aria-label="Pozostałe przepisy w kategorii">
      <a class="pager-link" href="/przepis/${prev.slug}"><img src="/img/${prev.slug}.svg" alt="" width="800" height="600" loading="lazy"><span><small>← Poprzedni</small>${esc(prev.name)}</span></a>
      <a class="pager-link is-next" href="/przepis/${next.slug}"><span><small>Następny →</small>${esc(next.name)}</span><img src="/img/${next.slug}.svg" alt="" width="800" height="600" loading="lazy"></a>
    </nav>` : ''}
  </main>
  ${footer}`;
  return page({
    title: `${r.title} — Przepisomania`,
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
  return page({ title: 'Cała książka — Przepisomania', description: 'Wszystkie przepisy na jednej stronie do druku.', body, bodyClass: 'is-book' });
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
