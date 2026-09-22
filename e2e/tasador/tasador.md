# E2E — Tasador (`/tasador` y `/usuario/mi-tasador`)

## Cómo se debe hacer

1. `/tasador` es público (no está en `PRIVATE_PATHS` de `proxy.ts`); los tests de
   la variante pública fuerzan `storageState` anónimo (`test.use`) para no
   depender de `.env.e2e`, y mockean `POST /v1/appraisal-requests` con
   `page.route` (catálogo make/model/año/versión sigue yendo contra backend real,
   igual que `/publicar`).
2. `MapInput` requiere `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` cargada en el server de
   dev (`GoogleMapsApiProvider` lanza si falta) — si el mapa no carga, el
   formulario entero falla al montar. En vez de clicar el canvas real de Google
   Maps, los tests conceden el permiso `geolocation` y usan el botón «Mi
   ubicación» (`navigator.geolocation.getCurrentPosition`), determinista y sin
   depender de tiles.
3. `lat`/`lng` ya tienen default válido (`40.4168 / -3.7038`, Madrid) en
   `tasadorDefaultValues`, así que el mapa no bloquea la validación aunque no
   se interactúe con él.
4. `/usuario/mi-tasador` está en `PRIVATE_PATHS`; su test de precargado usa el
   `storageState` autenticado por defecto del proyecto `chromium`
   (`e2e/auth.setup.ts`) y se salta (`test.skip`) si no hay
   `E2E_USER_EMAIL`/`E2E_USER_PASSWORD` en `.env.e2e`.

## Selectores de catálogo

`MakeSelector`, `ModelSelector` y `VersionSelector` usan `SearchSelect` (cmdk,
`role="combobox"`) → `selectFirstSearchSelect`. `QuickYearSelector` y
`VehicleTransmissionTypeSelector` usan `BaseSelector` (Radix `Select`,
`data-slot="select-trigger"`) → `selectFirstRadixOption`.

## Errores visibles vs. solo `data-invalid`

`name`, `email`, `phone` y `transmission_type` están envueltos en `Controller`
+ `FieldError` en `TasadorForm.tsx` y sí muestran texto de error. Los campos
de catálogo (`catalog_make_id`, `catalog_model_id`, `catalog_year_id`,
`version_id`) solo reciben `ariaInvalid` en `TasadorCatalogFields.tsx` — no
hay `FieldError` — así que el test de validación solo puede comprobar
`data-invalid="true"` en su `Field`, no un mensaje.

## Comandos

```bash
pnpm exec playwright install chromium
pnpm test:e2e -- e2e/tasador
pnpm test:e2e:ui
```

## Archivos

| Archivo | Rol |
| --- | --- |
| `tasador-page.ts` | Page Object |
| `tasador.spec.ts` | Happy path, validación, error backend, precargado autenticado |
