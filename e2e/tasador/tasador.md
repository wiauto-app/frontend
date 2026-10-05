# E2E — Tasador con IA (`/tasador` y `/usuario/mi-tasador`)

## Cómo se debe hacer

1. `/tasador` es pública (no está en `PRIVATE_PATHS` de `proxy.ts`). El login se
   pide al pulsar «Tasar coche»: sin sesión se abre `SignInDialog` y no se llama a
   la IA. Los tests sin sesión fuerzan `storageState` anónimo (`test.use`).
2. La tasación IA (`POST /v1/appraisals/estimate`) y `request-offers` se mockean con
   `page.route` para no consumir cuota de IA ni depender del throttler `vehicle-ai`.
   El catálogo (marca/modelo/año/versión) sigue yendo contra el backend real.
3. Los tests con sesión usan el `storageState` autenticado del proyecto `chromium`
   (`e2e/auth.setup.ts`) y se saltan (`test.skip`) si no hay
   `E2E_USER_EMAIL`/`E2E_USER_PASSWORD` en `.env.e2e`.
4. Ya no hay mapa ni ubicación: la tasación no la necesita.

## Selectores de catálogo

Los labels llevan el asterisco de obligatorio («Marca *», «Año *»…).
`MakeSelector`, `ModelSelector` y `VersionSelector` usan `SearchSelect` (cmdk,
`role="combobox"`) → `selectFirstSearchSelect`. `QuickYearSelector` usa
`BaseSelector` (Base UI Select) → `selectFirstOpenBaseUiOption` del page object.
La transmisión arranca en «Manual», así que el test no la toca.
