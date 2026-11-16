# Przepisomania — osobista książka przepisów

Prywatna, statyczna książka przepisów. Strona główna ma taby „Lody” i „Inne przepisy”. Każdy przepis ma własną stronę (`/przepis/<slug>`), a `/ksiazka` zbiera wszystkie do druku. Przepisy lodowe dotyczą Ninja CREAMi Swirl NC701EU.

## Edycja

Treść przepisów jest w `src/recipes.mjs`. Przepisy spoza lodów mają `category: 'other'`. Ilustracje SVG generuje `src/art.mjs`. Po zmianie uruchom:

```bash
node build.mjs
```

Skrypt nadpisuje `index.html`, `ksiazka.html`, `przepis/*.html` i `img/*.svg`. Tych plików nie edytuj ręcznie. Nowy przepis wymaga ilustracji w `src/art.mjs`.

## Wartości odżywcze

`src/nutrition.mjs` przechowuje przyjęte wartości na 100 g składników i gramatury użyte do obliczeń. Generator sumuje kcal, białko, tłuszcz, węglowodany i cukry, a następnie dzieli je przez masę bazy. Wszystkie wyniki w serwisie są oznaczone jako szacunkowe. Masa i kalorie dotyczą składników przed mrożeniem, bez strat, odłożenia nadmiaru ponad MAX FILL lub odcedzenia owoców.

Źródła danych: zdjęcie etykiety słodzonego mleka zagęszczonego z rozmowy użytkownika (322 kcal, 8 g tłuszczu, 55 g węglowodanów i cukrów, 7,3 g białka na 100 g), [mleko 3,2% Piątnica](https://piatnica.com.pl/en/product/mleko-wiejskie-3-2-1-l-en/), [śmietanka 36% Piątnica](https://piatnica.com.pl/produkt/smietanka-36-200-g/), [Lotus Biscoff](https://www.biscoff.com/gb/our-products/biscoff-spread-smooth-400g), [Nutella](https://www.nutella.com/pl/pl/produkty/krem/nutella), [Alpro Stracciatella](https://www.alpro.com/sk/produkty/rastlinne-alternativy-jogurtov/alpro-kokosovy-stracciatella) i [Kinder Chocolate](https://www.kinder.com/pl/sites/kinder_pl/files/2025-11/do-dzielenia-sie-skladniki-7.pdf). Wartości owoców i kakao przyjęto orientacyjnie z [USDA FoodData Central](https://fdc.nal.usda.gov/). Mleczko Suree oszacowano na podstawie [karty dystrybutora](https://www.henderson-foodservice.com/productpdf/download/file/id/2010/name/Suree_Coconut_Milk_%252817-19%2525%2529_FC_%25286x2.9ltr%2529.pdf/). Brakuje etykiet Oreo, mango, przecieru z marakui i syropu z agawy; ich wartości są przybliżone. W przepisach Oreo i Nutella niepotwierdzone ilości zastąpiono jawnymi założeniami widocznymi przy tabelach. Nie należy traktować tych wyników jako wartości zbadanych gotowych lodów.

## Podgląd i publikacja

Lokalnie: `npx serve .` (obsługuje adresy bez `.html`). Vercel serwuje pliki statyczne z katalogu głównego, bez builda. Strona ma `noindex`.
