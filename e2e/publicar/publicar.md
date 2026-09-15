# E2E — Publicación rápida (`/publicar`)

## Cómo se debe hacer

1. **Auth setup (una vez por run):** `e2e/auth.setup.ts` inicia sesión y guarda cookies en `playwright/.auth/user.json`.
2. **Smoke estable (CI / pre-merge):** mock de `vehicle-types` + Page Object; no publica en BD.
3. **Flujo completo (pre-release / local):** sin mocks de create/IA/upload; elige el primer tipo real, sube fotos, catálogo, IA y publica hasta `/publicar/exito`.
4. **Unitario diario:** `pnpm test:quick-publish` (schema + payload). No sustituye E2E.

`/publicar` está en `PRIVATE_PATHS` (`proxy.ts`): sin cookies de sesión redirige a `/iniciar-sesion`.

## Credenciales e imágenes

Copia `.env.e2e.example` → `.env.e2e` (gitignored) y define:

```bash
E2E_USER_EMAIL=...
E2E_USER_PASSWORD=...
E2E_IMAGE_DIR=/Users/irvinpincay/Downloads/wiauto-test
```

`E2E_IMAGE_DIR` debe contener al menos 3 imágenes (jpeg/png/webp/avif). Si no se define, se usa el path por defecto anterior.

No commits de contraseñas. `playwright/.auth/` también está ignorado.

## Comandos

```bash
pnpm exec playwright install chromium
pnpm test:e2e -- e2e/publicar
pnpm test:e2e:ui
```

Backend + Next deben estar en marcha (o `webServer` arranca Next).

## Test Case: smoke — wizard Tipo de vehículo

**Priority:** high

### Flow Steps:
1. Auth vía `storageState`.
2. Ir a `/publicar` y cerrar cookies.
3. Ver heading «Tipo de vehículo» y opción mock «Turismo».

### Expected Result:
- Wizard cargado; botón «Siguiente» visible.

## Test Case: simulación — avanzar a ficha

**Priority:** high

### Flow Steps:
1. Elegir «Turismo» (mock) → «Siguiente».

### Expected Result:
- Texto «¿Qué vehículo vendes?» y botón «Anterior».

## Test Case: flujo completo — publicar hasta éxito

**Priority:** critical

**Preconditions:**
- Backend real (catálogo, upload, IA, create).
- Cuenta no suscrita (publicar en paso Datos).
- ≥3 imágenes en `E2E_IMAGE_DIR`.
- Timeout del test ~5 min.

### Flow Steps:
1. Primer tipo de vehículo → «Siguiente».
2. Subir 3 imágenes; esperar fin de «Subiendo imágenes…».
3. Primera Marca → Modelo → Versión; esperar ficha técnica.
4. Kilometraje `45000`.
5. «Calcular precio justo» → «Usar precio recomendado» (o precio `15000`).
6. «Generar descripción»; assert no vacía.
7. Teléfono `983708845` (prefijo +34).
8. «Publicar anuncio ahora».

### Expected Result:
- URL `/publicar/exito` y texto «¡Anuncio publicado!».
- Queda un anuncio real en BD (borrar a mano si hace falta).

## Archivos

| Archivo | Rol |
| --- | --- |
| `e2e/auth.setup.ts` | Login + `storageState` |
| `e2e/helpers/dismissCookies.ts` | Cierra aviso de cookies |
| `e2e/helpers/selectFirstOption.ts` | SearchSelect / Radix primera opción |
| `e2e/helpers/testImages.ts` | Resuelve `E2E_IMAGE_DIR` |
| `publicar-page.ts` | Page Object |
| `publicar.spec.ts` | Smoke + flujo completo |
| `playwright.config.ts` | Config + webServer + setup |
