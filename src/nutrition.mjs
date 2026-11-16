// Wartości na 100 g produktu. kcal i makroskładniki pochodzą z etykiet
// lub wskazanych niżej danych referencyjnych; brak etykiety = szacunek.
const foods = {
  milk: { kcal: 60, protein: 3.1, fat: 3.2, carbs: 4.7, sugars: 4.7 },
  cream36: { kcal: 346, protein: 2.2, fat: 36, carbs: 3.3, sugars: 3.3 },
  condensed: { kcal: 322, protein: 7.3, fat: 8, carbs: 55, sugars: 55 },
  cocoa: { kcal: 228, protein: 19.6, fat: 13.7, carbs: 20.9, sugars: 1.8 },
  biscoff: { kcal: 584, protein: 2.9, fat: 38.1, carbs: 57, sugars: 36.8 },
  strawberry: { kcal: 32, protein: 0.7, fat: 0.3, carbs: 5.7, sugars: 4.9 },
  sugar: { kcal: 400, protein: 0, fat: 0, carbs: 100, sugars: 100 },
  oreo: { kcal: 480, protein: 5, fat: 20, carbs: 69, sugars: 38 },
  mango: { kcal: 70, protein: 0.5, fat: 0.3, carbs: 16, sugars: 15 },
  passion: { kcal: 95, protein: 1.8, fat: 0.7, carbs: 20, sugars: 16 },
  coconut: { kcal: 165, protein: 0.5, fat: 17, carbs: 2.9, sugars: 2.5 },
  agave: { kcal: 310, protein: 0, fat: 0, carbs: 76, sugars: 68 },
  nutella: { kcal: 539, protein: 6.3, fat: 30.9, carbs: 57.5, sugars: 56.3 },
  alpro: { kcal: 111, protein: 0.6, fat: 6.3, carbs: 12.4, sugars: 8.4 },
  raspberry: { kcal: 52, protein: 1.2, fat: 0.7, carbs: 5.4, sugars: 4.4 },
  kinder: { kcal: 566, protein: 8.7, fat: 35, carbs: 53.5, sugars: 53.3 },
};

// Ilości do obliczeń, niezależne od treści i historii przepisów.
// Płyny w ml przy Nutelli traktujemy orientacyjnie jako tyle samo gramów.
const amounts = {
  kakaowe: [['milk', 260], ['cream36', 90], ['condensed', 110], ['cocoa', 30]],
  lotus: [['milk', 270], ['cream36', 60], ['condensed', 30], ['biscoff', 70]],
  truskawkowe: [['strawberry', 300], ['milk', 124], ['sugar', 58]],
  oreo: [['milk', 280], ['cream36', 90], ['condensed', 150], ['oreo', 33]],
  mango: [['mango', 150], ['passion', 150], ['coconut', 125], ['agave', 20]],
  wanilia: [['milk', 280], ['cream36', 90], ['condensed', 150]],
  nutella: [['nutella', 110], ['milk', 200], ['cream36', 150], ['cocoa', 7]],
  jogurtowe: [['alpro', 340], ['milk', 80], ['condensed', 30]],
  malinowe: [['strawberry', 160], ['raspberry', 100], ['milk', 90], ['cream36', 60], ['condensed', 80]],
  kinder: [['kinder', 150], ['milk', 320], ['cream36', 20]],
};

const assumptions = {
  kakaowe: 'Kakao bez potwierdzonej etykiety; sól pominięta.',
  lotus: 'Krem Lotus przyjęto jako wersję gładką; sól pominięta.',
  truskawkowe: 'Sok z cytryny pominięty; masa dotyczy owoców po rozmrożeniu razem z sokiem.',
  oreo: 'Założono 33 g Oreo (około 3 ciasteczka). Ilość faktycznie dodana jest nieznana; baza bez Oreo ma 520 g.',
  mango: 'Przyjęto 20 g agawy. Etykiety mango i przecieru są nieznane; ekstrakt waniliowy pominięty.',
  wanilia: 'Aromat waniliowy pominięty.',
  nutella: 'Przyjęto 110 g Nutelli, 150 g śmietanki 36% i 7 g kakao. Oryginał podaje zakresy oraz objętości w ml.',
  jogurtowe: 'Ustalona receptura; faktycznie użyte proporcje niepotwierdzone. Dane Alpro z odpowiednika o tym samym smaku.',
  malinowe: 'Masa i wartości zakładają zachowanie całego soku z owoców; przetarcie przez sito je zmieni.',
  kinder: 'Sól pominięta.',
};

export function nutritionFor(slug) {
  const ingredients = amounts[slug];
  if (!ingredients) return null;
  const keys = ['kcal', 'protein', 'fat', 'carbs', 'sugars'];
  const whole = Object.fromEntries(keys.map((key) => [key, 0]));
  let mass = 0;
  for (const [food, grams] of ingredients) {
    mass += grams;
    for (const key of keys) whole[key] += foods[food][key] * grams / 100;
  }
  const per100 = Object.fromEntries(keys.map((key) => [key, whole[key] * 100 / mass]));
  return { mass, whole, per100, assumptions: assumptions[slug] };
}
