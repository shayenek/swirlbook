// Ilustracje SVG smaków: miseczka z trzema gałkami i dodatki dopasowane do przepisu.
// Generowane deterministycznie (stałe ziarno losowania), więc build daje te same pliki.

const W = 800;
const H = 600;

function rng(seed) {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;
const at = (x, y, s = 1, r = 0) => `translate(${f(x)} ${f(y)}) rotate(${f(r)}) scale(${s})`;

// ---------- gałka lodów ----------

function scoopPath(cx, cy, r, rand) {
  const y0 = cy + r * 0.25;
  const x0 = cx - r * 0.97;
  const x1 = cx + r * 0.97;
  let d = `M${f(x0)},${f(y0)} A${f(r)},${f(r)} 0 1 1 ${f(x1)},${f(y0)}`;
  const n = 6;
  const step = (x1 - x0) / n;
  for (let i = 0; i < n; i += 1) {
    const sx = x1 - step * i;
    const ex = sx - step;
    const dip = r * (i % 2 ? 0.2 : 0.27) + rand() * r * 0.06;
    d += ` Q${f((sx + ex) / 2)},${f(y0 + dip)} ${f(ex)},${f(y0 + (i === n - 1 ? 0 : rand() * 4 - 2))}`;
  }
  return `${d} Z`;
}

function scoop(id, cx, cy, r, color, rand, texture) {
  const d = scoopPath(cx, cy, r, rand);
  let tex = '';
  if (texture) tex = texture(cx, cy, r, rand);
  return `<g>
  <clipPath id="${id}"><path d="${d}"/></clipPath>
  <path d="${d}" fill="${color}"/>
  <g clip-path="url(#${id})">
    ${tex}
    <rect x="${f(cx - r)}" y="${f(cy - r)}" width="${f(2 * r)}" height="${f(1.6 * r)}" fill="url(#${id.split('-')[0]}-sg)"/>
    <ellipse cx="${f(cx - r * 0.4)}" cy="${f(cy - r * 0.48)}" rx="${f(r * 0.3)}" ry="${f(r * 0.13)}" transform="rotate(-30 ${f(cx - r * 0.4)} ${f(cy - r * 0.48)})" fill="#fff" opacity=".3"/>
  </g>
</g>`;
}

// ---------- tekstury gałek ----------

const specks = (color, n, rMin, rMax, opacity = 1) => (cx, cy, r, rand) => {
  let out = '';
  for (let i = 0; i < n; i += 1) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * r;
    out += `<ellipse cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" rx="${f(rMin + rand() * (rMax - rMin))}" ry="${f(rMin * 0.8 + rand() * (rMax - rMin) * 0.7)}" transform="rotate(${f(rand() * 180)} ${f(cx + Math.cos(a) * d)} ${f(cy + Math.sin(a) * d)})" fill="${color}" opacity="${opacity}"/>`;
  }
  return out;
};

const shavings = (color, n) => (cx, cy, r, rand) => {
  let out = '';
  for (let i = 0; i < n; i += 1) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * r;
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d;
    out += `<rect x="${f(x)}" y="${f(y)}" width="${f(5 + rand() * 9)}" height="${f(2 + rand() * 2.5)}" rx="1" transform="rotate(${f(rand() * 180)} ${f(x)} ${f(y)})" fill="${color}"/>`;
  }
  return out;
};

const both = (...fns) => (...args) => fns.map((fn) => fn(...args)).join('');

// ---------- dodatki ----------

function strawberry(x, y, s = 1, r = 0) {
  const seeds = [[-14, -16], [0, -20], [14, -16], [-22, -2], [-7, -4], [8, -4], [22, -2], [-15, 12], [0, 10], [15, 12], [-7, 25], [7, 25], [0, 37]];
  return `<g transform="${at(x, y, s, r)}">
  <path d="M0,-30 C26,-40 44,-15 33,10 C25,30 9,43 0,49 C-9,43 -25,30 -33,10 C-44,-15 -26,-40 0,-30Z" fill="#d93444"/>
  <path d="M0,-30 C26,-40 44,-15 33,10 C25,30 9,43 0,49 C14,30 22,10 18,-12 C14,-26 8,-30 0,-30Z" fill="#a91f33" opacity=".45"/>
  ${seeds.map(([sx, sy]) => `<ellipse cx="${sx}" cy="${sy}" rx="2" ry="3" fill="#f8de7e"/>`).join('')}
  <ellipse cx="-16" cy="-14" rx="6" ry="11" transform="rotate(25 -16 -14)" fill="#fff" opacity=".28"/>
  ${[-75, -38, 0, 38, 75].map((a) => `<ellipse cx="0" cy="-12" rx="6.5" ry="14" transform="translate(0 -30) rotate(${a})" fill="${a ? '#3f8a3e' : '#2f6d31'}"/>`).join('')}
  <path d="M0,-34 q2,-12 8,-16" stroke="#2f6d31" stroke-width="4" fill="none" stroke-linecap="round"/>
</g>`;
}

function raspberry(x, y, s = 1, r = 0) {
  const pts = [];
  const rows = [[-26, 3], [-15, 4], [-3, 5], [9, 4], [20, 3], [29, 2]];
  for (const [ry, n] of rows) {
    const width = ry === -26 ? 14 : ry > 20 ? 10 : 22;
    for (let i = 0; i < n; i += 1) pts.push([n === 1 ? 0 : -width + (2 * width * i) / (n - 1), ry]);
  }
  return `<g transform="${at(x, y, s, r)}">
  <ellipse cx="0" cy="2" rx="27" ry="33" fill="#8f1739"/>
  ${pts.map(([px, py]) => `<circle cx="${f(px)}" cy="${py}" r="8" fill="#c8295a"/><circle cx="${f(px - 2.5)}" cy="${py - 2.5}" r="2.4" fill="#fff" opacity=".45"/>`).join('')}
  <path d="M-8,-33 L0,-38 L8,-33" stroke="#4e7a35" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</g>`;
}

function leaf(x, y, s = 1, r = 0) {
  return `<g transform="${at(x, y, s, r)}">
  <path d="M0,0 C14,-18 40,-20 58,0 C40,20 14,18 0,0Z" fill="#4c9a4a"/>
  <path d="M0,0 C14,-18 40,-20 58,0 C40,4 16,4 0,0Z" fill="#6fb565"/>
  <path d="M2,0 L52,0" stroke="#2f6d31" stroke-width="2" stroke-linecap="round"/>
</g>`;
}

function cherry(x, y, s = 1) {
  return `<g transform="${at(x, y, s)}">
  <path d="M2,-18 C4,-40 14,-52 30,-60" stroke="#4f5e36" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="0" r="23" fill="#c5362f"/>
  <circle cx="5" cy="5" r="19" fill="#9e2420" opacity=".5"/>
  <ellipse cx="-8" cy="-8" rx="6" ry="9" transform="rotate(35 -8 -8)" fill="#fff" opacity=".45"/>
</g>`;
}

function chocShard(x, y, s = 1, r = 0, color = '#2f1b12') {
  return `<g transform="${at(x, y, s, r)}">
  <path d="M-4,-34 L24,-12 L16,30 L-20,22 L-24,-10Z" fill="${color}"/>
  <path d="M-4,-34 L24,-12 L4,-6 L-24,-10Z" fill="#fff" opacity=".12"/>
  <path d="M-4,-34 L24,-12" stroke="#fff" stroke-width="2" opacity=".25"/>
</g>`;
}

function chocSquare(x, y, s = 1, r = 0, color = '#3a2217') {
  return `<g transform="${at(x, y, s, r)}">
  <rect x="-40" y="-26" width="80" height="52" rx="5" fill="${color}"/>
  <rect x="-34" y="-20" width="32" height="40" rx="3" fill="#fff" opacity=".08"/>
  <rect x="2" y="-20" width="32" height="40" rx="3" fill="#fff" opacity=".08"/>
  <path d="M-34,-20 h32 M2,-20 h32" stroke="#fff" stroke-width="2" opacity=".2"/>
</g>`;
}

function biscoff(x, y, s = 1, r = 0) {
  const w = 120;
  const h = 64;
  let bumps = '';
  for (let i = 0; i <= 12; i += 1) {
    const bx = -w / 2 + (w * i) / 12;
    bumps += `<circle cx="${f(bx)}" cy="${-h / 2}" r="5.5"/><circle cx="${f(bx)}" cy="${h / 2}" r="5.5"/>`;
  }
  for (let i = 0; i <= 6; i += 1) {
    const by = -h / 2 + (h * i) / 6;
    bumps += `<circle cx="${-w / 2}" cy="${f(by)}" r="5.5"/><circle cx="${w / 2}" cy="${f(by)}" r="5.5"/>`;
  }
  return `<g transform="${at(x, y, s, r)}">
  <g fill="#bd742f">${bumps}</g>
  <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="#c67d36"/>
  <rect x="${-w / 2 + 9}" y="${-h / 2 + 9}" width="${w - 18}" height="${h - 18}" rx="3" fill="none" stroke="#a65f25" stroke-width="2.5"/>
  <path d="M-34,-6 h68 M-26,6 h52" stroke="#a65f25" stroke-width="4" stroke-linecap="round"/>
  <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="10" fill="#fff" opacity=".12"/>
</g>`;
}

function oreo(x, y, s = 1, r = 0) {
  let dots = '';
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    dots += `<circle cx="${f(Math.cos(a) * 21)}" cy="${f(Math.sin(a) * 21)}" r="3" fill="#3b302c"/>`;
  }
  return `<g transform="${at(x, y, s, r)}">
  <ellipse cx="0" cy="7" rx="36" ry="36" fill="#1d1715"/>
  <ellipse cx="0" cy="4" rx="36" ry="36" fill="#efe8da"/>
  <circle cx="0" cy="0" r="36" fill="#2a211f"/>
  <circle cx="0" cy="0" r="29" fill="none" stroke="#3b302c" stroke-width="2.5"/>
  ${dots}
  <circle cx="0" cy="0" r="10" fill="none" stroke="#3b302c" stroke-width="2.5"/>
  <path d="M-24,-22 A33,33 0 0 1 10,-32" stroke="#fff" stroke-width="3" fill="none" opacity=".18" stroke-linecap="round"/>
</g>`;
}

function crumbs(cx, cy, rx, ry, n, color, rand, size = 7) {
  let out = '';
  for (let i = 0; i < n; i += 1) {
    const x = cx + (rand() * 2 - 1) * rx;
    const y = cy + (rand() * 2 - 1) * ry;
    const k = size * (0.4 + rand() * 0.8);
    out += `<path d="M${f(x)},${f(y - k)} L${f(x + k)},${f(y - k * 0.2)} L${f(x + k * 0.4)},${f(y + k * 0.8)} L${f(x - k * 0.8)},${f(y + k * 0.4)}Z" fill="${color}"/>`;
  }
  return out;
}

function dots(cx, cy, rx, ry, n, color, rand, rMin = 1.5, rMax = 3.5, opacity = 1) {
  let out = '';
  for (let i = 0; i < n; i += 1) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand());
    out += `<circle cx="${f(cx + Math.cos(a) * d * rx)}" cy="${f(cy + Math.sin(a) * d * ry)}" r="${f(rMin + rand() * (rMax - rMin))}" fill="${color}" opacity="${opacity}"/>`;
  }
  return out;
}

function hazelnut(x, y, s = 1, r = 0) {
  return `<g transform="${at(x, y, s, r)}">
  <path d="M0,-24 C18,-24 24,-6 22,8 C20,20 8,28 0,34 C-8,28 -20,20 -22,8 C-24,-6 -18,-24 0,-24Z" fill="#94592b"/>
  <path d="M0,-24 C18,-24 24,-6 22,8 C20,20 8,28 0,34 C10,20 14,4 10,-10 C8,-18 4,-24 0,-24Z" fill="#6f3f1b" opacity=".5"/>
  <path d="M-21,-6 C-18,-26 18,-26 21,-6 C10,-2 -10,-2 -21,-6Z" fill="#d1ad7a"/>
  <path d="M-12,-12 l3,2 M-2,-15 l3,2 M8,-12 l3,2 M-6,-8 l3,2 M4,-8 l3,2" stroke="#b08a58" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="-9" cy="8" rx="4" ry="9" fill="#fff" opacity=".22"/>
</g>`;
}

function mangoCube(x, y, s = 1, r = 0) {
  return `<g transform="${at(x, y, s, r)}">
  <rect x="-20" y="-20" width="40" height="40" rx="9" fill="#ef9a1c"/>
  <rect x="-20" y="-20" width="34" height="32" rx="9" fill="#f9b73a"/>
  <rect x="-14" y="-15" width="14" height="7" rx="3.5" fill="#fff" opacity=".4"/>
</g>`;
}

function passionHalf(x, y, s = 1, rand) {
  let seeds = '';
  for (let i = 0; i < 16; i += 1) {
    const a = rand() * Math.PI * 2;
    const d = 6 + rand() * 20;
    const sx = Math.cos(a) * d;
    const sy = Math.sin(a) * d;
    seeds += `<circle cx="${f(sx)}" cy="${f(sy)}" r="5" fill="#f7c948" opacity=".9"/><circle cx="${f(sx)}" cy="${f(sy)}" r="2.6" fill="#24150c"/>`;
  }
  return `<g transform="${at(x, y, s)}">
  <circle cx="0" cy="0" r="46" fill="#5a2643"/>
  <circle cx="5" cy="5" r="40" fill="#3e1830" opacity=".5"/>
  <circle cx="0" cy="0" r="38" fill="#f3e7c6"/>
  <circle cx="0" cy="0" r="32" fill="#eeac2a"/>
  ${seeds}
  <path d="M-30,-22 A38,38 0 0 1 -6,-37" stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
</g>`;
}

function vanillaPod(d, w = 9) {
  return `<path d="${d}" stroke="#2f1d12" stroke-width="${w}" fill="none" stroke-linecap="round"/>
  <path d="${d}" stroke="#6d4a30" stroke-width="2" fill="none" stroke-linecap="round" transform="translate(-1.5 -2.5)"/>`;
}

function vanillaFlower(x, y, s = 1, r = 0) {
  return `<g transform="${at(x, y, s, r)}">
  ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-24" rx="15" ry="26" transform="rotate(${a})" fill="#f8edc4"/><ellipse cx="0" cy="-22" rx="5" ry="16" transform="rotate(${a})" fill="#fff" opacity=".55"/>`).join('')}
  <circle cx="0" cy="0" r="12" fill="#efc95b"/>
  <circle cx="-3" cy="-3" r="4" fill="#fff" opacity=".5"/>
</g>`;
}

function coconutHalf(x, y, s = 1, rand) {
  let fibres = '';
  for (let i = 0; i < 40; i += 1) {
    const a = rand() * Math.PI * 2;
    const d = 40 + rand() * 6;
    const x1 = Math.cos(a) * d;
    const y1 = Math.sin(a) * d;
    fibres += `<path d="M${f(x1)},${f(y1)} l${f(Math.cos(a + 1.4) * 7)},${f(Math.sin(a + 1.4) * 7)}" stroke="#93643d" stroke-width="2" stroke-linecap="round"/>`;
  }
  return `<g transform="${at(x, y, s)}">
  <circle cx="0" cy="0" r="48" fill="#6b4226"/>
  ${fibres}
  <circle cx="0" cy="0" r="38" fill="#fbf8ef"/>
  <circle cx="4" cy="5" r="31" fill="#e9e3d4"/>
  <path d="M-28,-18 A34,34 0 0 1 -4,-34" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
</g>`;
}

function drizzle(d, color, width = 12) {
  return `<path d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".25" transform="translate(-1 -2.5)"/>`;
}

function drip(x, y, len, color, w = 9) {
  return `<path d="M${x},${y} v${len}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><circle cx="${x}" cy="${y + len}" r="${f(w * 0.72)}" fill="${color}"/>`;
}

function sparkle(x, y, s = 1, color = '#fff', opacity = 0.75) {
  return `<path transform="${at(x, y, s)}" d="M0,-16 C2,-4 4,-2 16,0 C4,2 2,4 0,16 C-2,4 -4,2 -16,0 C-4,-2 -2,-4 0,-16Z" fill="${color}" opacity="${opacity}"/>`;
}

// ---------- kompozycje ----------

const themes = {
  kakaowe: {
    bg: '#d8b291', disc: '#ebd1b4', scoops: ['#4c2f22', '#563626', '#5f3c2a'],
    bowl: '#f6f1e7', bowlInner: '#ddd0bb', stripe: '#f06a42',
    texture: specks('#7c5139', 26, 1.5, 3.5, 0.8),
    back: (rand) => dots(400, 560, 230, 18, 40, '#6a4330', rand, 1, 2.6, 0.55),
    front: (rand) => `
      ${chocShard(472, 222, 1.05, 22)}
      ${cherry(395, 170, 1)}
      ${dots(400, 230, 60, 30, 10, '#fbf6ec', rand, 1.6, 2.6)}
      ${chocSquare(160, 528, 1, 14)}
      ${chocSquare(642, 532, 0.9, -12)}
      ${chocShard(212, 556, 0.6, -40)}`,
  },
  lotus: {
    bg: '#e3c48d', disc: '#f1dbad', scoops: ['#c99961', '#d3a46c', '#c48f57'],
    bowl: '#f8f3ea', bowlInner: '#e4d6bf', stripe: '#a65f25',
    texture: specks('#a9672d', 22, 1.5, 4, 0.75),
    front: (rand) => `
      ${drizzle('M330,250 C360,230 380,262 410,240 C440,220 455,252 478,236', '#9a4f1b', 10)}
      ${drip(352, 248, 30, '#9a4f1b')}${drip(432, 236, 22, '#9a4f1b')}
      ${biscoff(458, 198, 0.8, -24)}
      ${crumbs(372, 214, 34, 14, 8, '#b06a2c', rand, 6)}
      ${biscoff(162, 528, 0.95, 12)}
      ${biscoff(646, 530, 0.85, -9)}
      ${crumbs(400, 566, 220, 12, 22, '#b06a2c', rand, 6)}`,
  },
  truskawkowe: {
    bg: '#e8a99c', disc: '#f4c8bc', scoops: ['#ee8b97', '#f198a2', '#ea828f'],
    bowl: '#f8f4ee', bowlInner: '#ead9cf', stripe: '#d93444',
    texture: specks('#c4304a', 30, 1.2, 3, 0.7),
    front: () => `
      ${leaf(370, 186, 0.8, -150)}
      ${strawberry(404, 172, 0.9, 12)}
      ${strawberry(160, 512, 1.25, -22)}
      ${strawberry(646, 512, 1.15, 26)}
      ${leaf(600, 556, 0.9, -12)}`,
  },
  oreo: {
    bg: '#cac7b3', disc: '#e1dfcd', scoops: ['#efe9dc', '#f3eee3', '#ebe4d5'],
    bowl: '#2f3f36', bowlInner: '#25332b', stripe: '#e8e1d0',
    texture: specks('#2a211f', 46, 1.6, 5, 0.9),
    front: (rand) => `
      ${oreo(448, 204, 0.85, 18)}
      ${crumbs(372, 222, 40, 14, 10, '#2a211f', rand, 7)}
      ${oreo(162, 524, 1.05, -8)}
      ${chocShard(232, 552, 0.55, 30, '#2a211f')}
      ${oreo(648, 528, 0.95, 14)}
      ${crumbs(420, 566, 230, 12, 26, '#2a211f', rand, 6)}`,
  },
  mango: {
    bg: '#eabd6c', disc: '#f5d698', scoops: ['#f5ae36', '#f7ba4a', '#f2a42c'],
    bowl: '#f8f4ec', bowlInner: '#eadcc4', stripe: '#5a2643',
    texture: specks('#ffd27a', 24, 1.5, 4, 0.8),
    front: (rand) => `
      ${dots(400, 222, 58, 26, 9, '#f7c948', rand, 4, 5)}
      ${mangoCube(372, 190, 0.8, -12)}
      ${mangoCube(424, 184, 0.75, 16)}
      ${leaf(440, 176, 0.7, -40)}
      ${passionHalf(170, 512, 1.1, rand)}
      ${mangoCube(246, 552, 0.8, 18)}
      ${passionHalf(640, 518, 0.95, rand)}
      ${mangoCube(560, 558, 0.75, -14)}`,
  },
  wanilia: {
    bg: '#e5d6aa', disc: '#f3e8c6', scoops: ['#f6ebc6', '#f9efcf', '#f2e4b9'],
    bowl: '#30463a', bowlInner: '#263a2f', stripe: '#efc95b',
    texture: specks('#2e2116', 38, 1, 2.2, 0.85),
    front: () => `
      ${vanillaPod('M430,226 C452,196 468,170 478,140', 8)}
      ${vanillaFlower(380, 192, 0.7, 12)}
      ${vanillaPod('M110,560 C200,512 280,520 340,548', 10)}
      ${vanillaPod('M128,536 C210,496 290,500 352,524', 9)}
      ${vanillaFlower(640, 516, 1.05, -8)}`,
  },
  nutella: {
    bg: '#c09679', disc: '#d9b69b', scoops: ['#7a4a2d', '#865438', '#8c5a3b'],
    bowl: '#f6f1e7', bowlInner: '#ddd0bb', stripe: '#3a2216',
    texture: specks('#5a341e', 26, 1.5, 3.5, 0.7),
    front: (rand) => `
      ${drizzle('M326,252 C356,228 384,262 412,238 C440,216 458,250 480,232', '#2e1a10', 10)}
      ${drip(366, 246, 26, '#2e1a10')}${drip(446, 234, 32, '#2e1a10')}
      ${hazelnut(396, 186, 0.9, -8)}
      ${crumbs(430, 214, 30, 10, 7, '#d1ad7a', rand, 5)}
      ${hazelnut(150, 520, 1.1, -20)}
      ${hazelnut(210, 548, 0.95, 24)}
      ${chocShard(650, 520, 1, 18, '#3a2216')}
      ${hazelnut(596, 552, 0.9, 10)}`,
  },
  jogurtowe: {
    bg: '#bfd2c2', disc: '#d9e6d9', scoops: ['#fbf8f1', '#f6f2e9', '#fdfbf6'],
    bowl: '#2f4a3c', bowlInner: '#243b2f', stripe: '#f3eee2',
    texture: shavings('#3a2418', 22),
    front: (rand) => `
      ${chocShard(450, 206, 0.75, 26, '#3a2418')}
      ${dots(380, 214, 40, 14, 8, '#fff', rand, 2, 4)}
      ${coconutHalf(644, 514, 1.1, rand)}
      ${chocShard(160, 520, 0.95, -18, '#3a2418')}
      ${chocShard(214, 552, 0.6, 40, '#3a2418')}
      ${crumbs(420, 566, 220, 12, 20, '#fbf8ef', rand, 5)}`,
  },
  malinowe: {
    bg: '#dda7a7', disc: '#efc7c4', scoops: ['#f1b0bc', '#f4bcc6', '#eda5b4'],
    bowl: '#f8f4ee', bowlInner: '#ead9d2', stripe: '#c8295a',
    texture: specks('#c73a5a', 28, 1.2, 3.4, 0.75),
    front: () => `
      ${raspberry(380, 186, 0.75, -10)}
      ${raspberry(424, 182, 0.7, 14)}
      ${leaf(440, 166, 0.65, -50)}
      ${raspberry(150, 520, 1, -14)}
      ${raspberry(208, 548, 0.85, 20)}
      ${strawberry(636, 510, 1.1, 22)}
      ${raspberry(574, 552, 0.8, -8)}`,
  },
};

export function artFor(slug) {
  const t = themes[slug];
  if (!t) throw new Error(`Brak ilustracji dla: ${slug}`);
  const rand = rng(slug);
  const p = slug;
  const bowlBody = 'M205,400 C210,492 300,545 400,545 C500,545 590,492 595,400 A195,36 0 0 1 205,400Z';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 98 660 495" role="img">
<defs>
  <radialGradient id="${p}-sg" cx=".34" cy=".26" r=".85">
    <stop offset="0" stop-color="#fff" stop-opacity=".38"/>
    <stop offset=".38" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".62" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".3"/>
  </radialGradient>
  <linearGradient id="${p}-bg" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity=".3"/>
    <stop offset=".35" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".6" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".2"/>
  </linearGradient>
</defs>
<rect x="-50" y="-50" width="${W + 100}" height="${H + 100}" fill="${t.bg}"/>
<circle cx="430" cy="270" r="235" fill="${t.disc}"/>
${sparkle(150, 140, 1.1)}${sparkle(680, 210, 0.8)}${sparkle(214, 300, 0.55)}${sparkle(622, 96, 0.5)}
<ellipse cx="400" cy="566" rx="250" ry="24" fill="#3b2a1c" opacity=".14"/>
${t.back ? t.back(rand) : ''}
<rect x="342" y="536" width="116" height="26" rx="8" fill="${t.bowl}"/>
<rect x="342" y="550" width="116" height="12" rx="6" fill="#000" opacity=".12"/>
<ellipse cx="400" cy="400" rx="195" ry="36" fill="${t.bowlInner}"/>
${scoop(`${p}-l`, 312, 368, 94, t.scoops[0], rand, t.texture)}
${scoop(`${p}-r`, 488, 368, 94, t.scoops[1], rand, t.texture)}
${scoop(`${p}-t`, 400, 276, 102, t.scoops[2], rand, t.texture)}
<clipPath id="${p}-bowl"><path d="${bowlBody}"/></clipPath>
<path d="${bowlBody}" fill="${t.bowl}"/>
<g clip-path="url(#${p}-bowl)">
  <ellipse cx="400" cy="430" rx="206" ry="64" fill="none" stroke="${t.stripe}" stroke-width="13"/>
  <ellipse cx="400" cy="452" rx="206" ry="70" fill="none" stroke="${t.stripe}" stroke-width="3" opacity=".7"/>
  <rect x="205" y="395" width="390" height="155" fill="url(#${p}-bg)"/>
</g>
<path d="M595,400 A195,36 0 0 1 205,400" fill="none" stroke="#fff" stroke-width="3.5" opacity=".55"/>
${t.front(rand)}
</svg>
`;
}

export const artColors = Object.fromEntries(Object.entries(themes).map(([k, v]) => [k, v.bg]));
