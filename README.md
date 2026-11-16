# SwirlBook — osobista książka przepisów

Prywatna, statyczna książka przepisów. Strona główna ma taby „Lody” i „Inne przepisy”. Każdy przepis ma własną stronę (`/przepis/<slug>`), a `/ksiazka` zbiera wszystkie do druku. Przepisy lodowe dotyczą Ninja CREAMi Swirl NC701EU.

## Edycja

Treść przepisów jest w `src/recipes.mjs`. Przepisy spoza lodów mają `category: 'other'`. Ilustracje SVG generuje `src/art.mjs`. Po zmianie uruchom:

```bash
node build.mjs
```

Skrypt nadpisuje `index.html`, `ksiazka.html`, `przepis/*.html` i `img/*.svg`. Tych plików nie edytuj ręcznie. Nowy przepis wymaga ilustracji w `src/art.mjs`.

## Podgląd i publikacja

Lokalnie: `npx serve .` (obsługuje adresy bez `.html`). Vercel serwuje pliki statyczne z katalogu głównego, bez builda. Strona ma `noindex`.
