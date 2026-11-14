const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.recipe-card')];
const search = document.querySelector('#search');
const empty = document.querySelector('#empty-state');
let activeFilter = 'all';

function updateCards() {
  const query = search.value.trim().toLocaleLowerCase('pl');
  let visible = 0;
  for (const card of cards) {
    const matchesType = activeFilter === 'all' || card.dataset.type === activeFilter;
    const matchesText = card.dataset.name.includes(query);
    card.hidden = !(matchesType && matchesText);
    if (!card.hidden) visible += 1;
  }
  empty.hidden = visible !== 0;
}

filters.forEach((button) => button.addEventListener('click', () => {
  filters.forEach((item) => item.classList.toggle('active', item === button));
  activeFilter = button.dataset.filter;
  updateCards();
}));

search.addEventListener('input', updateCards);

document.querySelectorAll('.card-foot a').forEach((link) => link.addEventListener('click', () => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) target.open = true;
}));
