# zimnarzecz — książka lodów

Prywatna, statyczna książka przepisów do Ninja CREAMi Swirl NC701EU. Każdy przepis ma własną stronę (`/przepis/<slug>`), a `/ksiazka` zbiera wszystkie do druku.

## Edycja

Treść przepisów jest w `src/recipes.mjs`, ilustracje SVG generuje `src/art.mjs`. Po zmianie uruchom:

```bash
node build.mjs
```

Skrypt nadpisuje `index.html`, `ksiazka.html`, `przepis/*.html` i `img/*.svg`. Tych plików nie edytuj ręcznie. Nowy przepis wymaga też motywu ilustracji w `themes` w `src/art.mjs`.

## Podgląd i publikacja

Lokalnie: `npx serve .` (obsługuje adresy bez `.html`). Vercel serwuje pliki statyczne z katalogu głównego, bez builda. Strona ma `noindex`.
