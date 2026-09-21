# Sitemaps WiAuto

Documentación del sistema de sitemaps del frontend (Next.js) y de los endpoints del backend (Nest) que lo alimentan.

## 1. Resumen

**Solo se envía a Search Console `https://www.wiauto.es/sitemap.xml`.** Es el sitemap index maestro y `robots.txt` lo declara con URL absoluta. El resto se descubre desde ahí.

El maestro lista **únicamente sitemaps hoja** (`<urlset>`): un sitemap index no puede listar otros índices, así que nunca aparecen URLs `-index` en él.

```text
/sitemap.xml                                   MAESTRO (sitemapindex)
 ├─ /sitemap/paginas/sitemap.xml               páginas estáticas indexables
 ├─ /sitemap/noticias/sitemap.xml              /noticias/{slug}        (Strapi)
 ├─ /sitemap/colaboraciones/sitemap.xml        /colaboraciones/{slug}  (Strapi)
 ├─ /sitemap/concesionarios/sitemap.xml        /concesionario/{slug}   (API Nest)
 ├─ /vehiculo/sitemap/{0..N-1}.xml             /vehiculo/{id}
 ├─ /sitemap/vehiculos/catalog/sitemap/{0..}.xml         /vehiculos/{marca}/{modelo}
 └─ /sitemap/vehiculos/with-province/sitemap/{0..}.xml   /vehiculos/{marca}/{modelo}/{provincia}
```

Se mantienen, **sin enviarse ni listarse en el maestro**, dos índices auxiliares útiles para depurar:

- `/vehiculo/sitemap-index.xml`
- `/sitemap/vehiculos/listings-index.xml`

---

## 2. Tabla de sitemaps públicos

| URL pública | Qué URLs indexa | Frontend | Fuente de datos |
| --- | --- | --- | --- |
| `/robots.txt` | (declara el maestro) | `app/robots.ts` | — |
| `/sitemap.xml` | Índice de las hojas | `app/sitemap.xml/route.ts` + `lib/seo/build-sitemap-index.ts` | metas de vehículos y listados |
| `/sitemap/paginas/sitemap.xml` | `INDEXABLE_STATIC_PAGES` | `app/(public)/sitemap/paginas/sitemap.ts` + `lib/seo/static-pages.ts` | código |
| `/sitemap/noticias/sitemap.xml` | `/noticias/{slug}` | `app/(public)/sitemap/noticias/sitemap.ts` + `lib/seo/fetch-strapi-sitemap-entries.ts` + `lib/seo/build-content-sitemap.ts` | Strapi `/noticias` |
| `/sitemap/colaboraciones/sitemap.xml` | `/colaboraciones/{slug}` | `app/(public)/sitemap/colaboraciones/sitemap.ts` (mismos helpers) | Strapi `/landings-colaboracions` |
| `/sitemap/concesionarios/sitemap.xml` | `/concesionario/{slug}` | `app/(public)/sitemap/concesionarios/sitemap.ts` + `lib/seo/fetch-dealership-sitemap.ts` | `GET /v1/dealerships` |
| `/vehiculo/sitemap/{id}.xml` | `/vehiculo/{uuid}` (activos) | `app/(public)/vehiculo/sitemap.ts` + `lib/seo/fetch-vehicle-sitemap.ts` | `GET /v1/sitemap/vehicles` |
| `/sitemap/vehiculos/catalog/sitemap/{id}.xml` | `/vehiculos/{makeSlug}/{modelSlug}` | `app/(public)/sitemap/vehiculos/catalog/sitemap.ts` + `lib/seo/fetch-vehicle-listing-sitemap.ts` | `GET /v1/sitemap/vehicle-listings?variant=catalog` |
| `/sitemap/vehiculos/with-province/sitemap/{id}.xml` | `/vehiculos/{makeSlug}/{modelSlug}/{provinceSlug}` | `app/(public)/sitemap/vehiculos/with-province/sitemap.ts` (mismos helpers) | `GET /v1/sitemap/vehicle-listings?variant=with-province` |
| `/vehiculo/sitemap-index.xml` | (auxiliar, no enviado) | `app/(public)/vehiculo/sitemap-index.xml/route.ts` | meta de vehículos |
| `/sitemap/vehiculos/listings-index.xml` | (auxiliar, no enviado) | `app/(public)/sitemap/vehiculos/listings-index.xml/route.ts` | metas de listados |

Constantes de listados: `lib/seo/vehicle-listing-sitemap.constants.ts`. Segmentos: `lib/seo/vehicle-sitemap-segments.ts`.

**No existe `app/sitemap.ts`**: colisionaría con `/sitemap.xml`. El maestro es un Route Handler en el directorio `app/sitemap.xml/` (mismo patrón que `sitemap-index.xml/route.ts`). Nadie debe crear ese `sitemap.ts`.

`proxy.ts` deja pasar estas rutas sin sesión (Googlebot no envía cookies): no requiere cambios.

---

## 3. Detalle por sitemap

### 3.1 Maestro (`/sitemap.xml`)

1. En paralelo: `fetchVehicleSitemapMeta()`, `fetchVehicleListingSitemapMeta("catalog")` y `("with-province")`.
2. `buildMasterSitemapLocs({ vehiclePages, catalogPages, withProvincePages })` genera los locs de las hojas. Si un meta devuelve `totalPages <= 0` se usa el segmento `"0"` (`getVehicleSitemapSegmentIds`), **solo** después de un meta correcto.
3. `buildSitemapIndexXml(locs)` emite el XML (`<loc>` escapado, **sin `<lastmod>`**: no hay una fecha real que declarar).
4. Cabeceras: `Content-Type: application/xml; charset=utf-8`, `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.

### 3.2 Páginas estáticas

`INDEXABLE_STATIC_PAGES` (`lib/seo/static-pages.ts`) es una **lista blanca**. Una página nueva no entra al sitemap hasta que se añade ahí. Sin `lastModified` (no hay dato real; nunca se inventa `now`).

### 3.3 Noticias y colaboraciones (Strapi)

`fetchAllStrapiSitemapEntries(endpoint, { includeSeo })` pagina con `pagination[pageSize]=100` hasta `pageCount`, pidiendo solo `slug`, `updatedAt` (y `seo.noIndex` en noticias), `status=published` y orden estable (`updatedAt:desc`, `id:asc`). Guardia de **500 páginas** (50.000 URLs, el máximo de un sitemap): si se supera, lanza.

`buildContentSitemap` omite entradas sin slug o con `noIndex === true` y usa `lastModified = updatedAt`.

Colaboraciones no tiene componente `seo`, por eso `includeSeo: false`.

### 3.4 Concesionarios

`fetchAllDealershipSitemapEntries()` usa `fetch` plano (`buildApiUrl`, sin `apiGet` ni auth) contra el endpoint público `GET /v1/dealerships?page=&limit=100&order_by=id`. Respuesta esperada: `{ ok, data: { data: [{ slug, updated_at }], total, page, limit } }`. Incluye **todos** los concesionarios (no filtra por número de vehículos). `lastModified = updated_at`.

### 3.5 Fichas de vehículo

Segmentos con `generateSitemaps` + `sitemap` en `app/(public)/vehiculo/sitemap.ts`.

- El `id` del segmento es **0-based**; la página del API es `page = id + 1`.
- Entrada: `url` `/vehiculo/{id}`, `lastModified` `updatedAt`, `changeFrequency` `daily`, `priority` `0.9` destacado / `0.8` normal.

Backend: `GET /v1/sitemap/vehicles/meta` y `GET /v1/sitemap/vehicles` (`vehicle-sitemap.controller.ts`). Criterio: `status = ACTIVE`, `deleted_at IS NULL`, orden `updated_at DESC`. `PAGE_SIZE = 5000` (FE `vehicle-sitemap.constants.ts`, BE `vehicle-sitemap.http-dto.ts`).

### 3.6 Listados indexables

- **catalog:** `/vehiculos/{makeSlug}/{modelSlug}`, `weekly`, prioridad `0.7`.
- **with-province:** `/vehiculos/{makeSlug}/{modelSlug}/{provinceSlug}`, filtra entradas sin `provinceSlug`, `weekly`, prioridad `0.65`.

Backend: `GET /v1/sitemap/vehicle-listings/meta?variant=` y `GET /v1/sitemap/vehicle-listings?variant=&page=&limit=` (`vehicle-sitemap-list.controller.ts`). Criterio: vehículo `ACTIVE`, no borrado, con `version_id`; `with-province` exige `lat`/`lng` y `ST_Intersects` con `provinces`. `PAGE_SIZE = 5000`.

---

## 4. `FRONTEND_URL` (requisito duro)

Los `<loc>` deben ser **absolutos**. `absoluteUrl()` usa `NEXT_PUBLIC_FRONTEND_URL` y **no tiene fallback** (si falta, produce rutas relativas, que son inválidas en un sitemap).

- Definir en **build time**: `NEXT_PUBLIC_FRONTEND_URL=https://www.wiauto.es` (sin barra final).
- El maestro **lanza** si `absoluteUrl("/")` no tiene host: preferimos fallar el build/la respuesta antes que publicar un sitemap roto.
- `robots.ts` y las hojas usan `absoluteUrl` sin esa guardia (fallar ahí rompería builds ajenos al SEO). Si la variable falta, la línea `Sitemap:` de robots saldría relativa y por tanto inválida: vigilar que la variable esté en el pipeline.

---

## 5. Política de errores

**Ningún sitemap traga errores para devolver un XML vacío.** Un sitemap vacío por un fallo transitorio le dice a Google "ya no hay URLs".

- Sin `try/catch` que devuelva `[]` (ni `[{ id: "0" }]` en `generateSitemaps`).
- Si el API o Strapi fallan, la ruta **lanza y responde 500**; con ISR (`revalidate = 3600`) Next **conserva la última versión buena**.
- `export const revalidate = 3600` en cada hoja y en el maestro, alineado con el `revalidate` de los `fetch`.
- **No** usar `dynamic = "force-dynamic"`: perdería el caché ISR y cada rastreo golpearía el API.
- `<lastmod>` solo se emite cuando hay dato real; nunca se defaulta a `new Date()`.
- Un sitemap sin entradas por falta de datos reales (p. ej. noticias sin publicar) es un `urlset` vacío **válido**, distinto de un error.

---

## 6. Páginas `noindex`

Estas páginas son públicas pero no deben indexarse. Llevan `robots: NOINDEX_ROBOTS` (`lib/seo/noindex.ts` → `{ index: false, follow: true }`) y **no** están en el sitemap:

| Ruta | Archivo |
| --- | --- |
| `/seguros` | `app/(landing)/seguros/page.tsx` (ambas ramas de `generateMetadata`) |
| `/garantia-mecanica` | `app/(landing)/garantia-mecanica/page.tsx` |
| `/revision-vehiculo` | `app/(landing)/revision-vehiculo/page.tsx` |
| `/informe-historial-vehiculo` | `app/(landing)/informe-historial-vehiculo/page.tsx` |
| `/comparador` | `app/(public)/comparador/page.tsx` (vacía; quitar `noindex` al desarrollarla y pasarla a `INDEXABLE_STATIC_PAGES`) |

Reglas:

- **No** añadirles `canonical`.
- **No** ponerlas en `disallow` de robots: si el crawler no puede entrar, nunca ve el `noindex`.
- Para indexar una de ellas: quitar `robots`, moverla de `NOINDEX_STATIC_PAGES` a `INDEXABLE_STATIC_PAGES`.

`tests/unit/lib/seo/static-pages.test.ts` verifica la coherencia entre ambas listas, las rutas reales de `app/` y el `NOINDEX_ROBOTS` de cada archivo.

---

## 7. `robots.txt`

`app/robots.ts` permite todo (`allow: "/"`) y bloquea rutas privadas o de flujo: `/usuario`, `/publicar`, `/editar-vehiculo`, `/billing-plan`, `/asistente`, `/api/`, `/auth/`, `/iniciar-sesion`, `/registro`, `/cambiar-contrasena`, `/confirmar-correo`, `/olvide-contrasena`, `/verificacion-2fa`, `/oauth-popup-complete`, `/invitacion/`. Declara `Sitemap: {FRONTEND_URL}/sitemap.xml`.

No bloquea `/_next/` (Google necesita los assets para renderizar) ni las páginas `noindex`.

---

## 8. Por qué los XML de listados NO viven bajo `/vehiculos/`

La página de listado es un catch-all (`app/(public)/vehiculos/[[...slug]]/page.tsx`): cualquier path bajo `/vehiculos/*` (p. ej. `/vehiculos/sitemap.xml`) se interpretaría como slug de filtros. Por eso los ficheros XML de listados viven en `/sitemap/vehiculos/...`. Las URLs **dentro** del XML sí son listados públicos (`/vehiculos/toyota/avensis`).

Las fichas usan `/vehiculo/...` (singular), que no choca con el catch-all.

---

## 9. Contrato de datos (vehículos y listados)

Respuesta API: `{ ok: true, data: T }`.

| Meta | Significado |
| --- | --- |
| `total` | Número de filas / combinaciones |
| `limit` | Tamaño de página (default 5000, máx. 5000) |
| `totalPages` | `ceil(total / limit)`; `0` si `total === 0` |
| `variant` | Solo listados |

Página: `{ data, page (1-based), limit, total, totalPages }`. Entradas: vehículos `{ id, updatedAt, isFeatured }`; listados `{ makeSlug, modelSlug, provinceSlug? }`.

Segmentación: `totalPages <= 0` → `"0"`; `totalPages = N` → `"0"…"N-1"`; query al API `page = Number(id) + 1`.

| Tipo | Priority |
| --- | --- |
| Ficha destacada | 0.9 |
| Ficha normal | 0.8 |
| Listado catalog | 0.7 |
| Listado with-province | 0.65 |

Solo entran al sitemap de listados las combinaciones marca + modelo (y provincia geolocalizada) con vehículos activos. El path indexable se define en `lib/vehicles/listing-url/indexable-catalog-listing-url.ts` (`buildIndexableCatalogListingPath`, `isIndexableCatalogSlugPath`, `CATALOG_DEGRADED_QUERY_KEYS`).

---

## 10. Cómo probar

Con `next dev` (no hace falta build) y las variables de `.env` cargadas, incluida `NEXT_PUBLIC_FRONTEND_URL`:

```bash
BASE=http://localhost:3000

# Descubrimiento
curl -sS "$BASE/robots.txt"

# Maestro: solo hojas, sin <lastmod>, sin '-index'
curl -sS "$BASE/sitemap.xml"
curl -sS "$BASE/sitemap.xml" | xmllint --noout - && echo "XML válido"
curl -sS "$BASE/sitemap.xml" | rg -e "-index|<lastmod>" && echo "FALLO" || echo "OK: sin -index ni lastmod"

# Hojas de contenido
curl -sS "$BASE/sitemap/paginas/sitemap.xml"
curl -sS "$BASE/sitemap/noticias/sitemap.xml"
curl -sS "$BASE/sitemap/colaboraciones/sitemap.xml"
curl -sS "$BASE/sitemap/concesionarios/sitemap.xml"

# Hojas de vehículos y listados
curl -sS "$BASE/vehiculo/sitemap/0.xml" | head
curl -sS "$BASE/sitemap/vehiculos/catalog/sitemap/0.xml" | head
curl -sS "$BASE/sitemap/vehiculos/with-province/sitemap/0.xml" | head

# Cada loc del maestro responde 200
curl -sS "$BASE/sitemap.xml" | rg -o "<loc>[^<]+</loc>" | sd "</?loc>" "" | while read -r url; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "$url") $url"
done

# Cabeceras del maestro
curl -sSI "$BASE/sitemap.xml"

# Páginas noindex: deben traer <meta name="robots" content="noindex, follow">
curl -sS "$BASE/seguros" | rg -o '<meta name="robots"[^>]*>'
```

Nota: en `next dev` los `<loc>` salen con el host de `NEXT_PUBLIC_FRONTEND_URL` (p. ej. `https://www.wiauto.es`), no con `localhost`; para el bucle de arriba sustituye el host por `$BASE`.

Backend:

```bash
curl -sS "$API_URL/v1/sitemap/vehicles/meta"
curl -sS "$API_URL/v1/sitemap/vehicle-listings/meta?variant=catalog"
curl -sS "$API_URL/v1/sitemap/vehicle-listings/meta?variant=with-province"
curl -sS "$API_URL/v1/dealerships?page=1&limit=100&order_by=id"
```

Tests unitarios: `pnpm vitest run tests/unit/lib/seo`.

### Checklist

- [ ] `/robots.txt` incluye `Sitemap: https://www.wiauto.es/sitemap.xml` y el `disallow` privado.
- [ ] `/sitemap.xml` es un `sitemapindex` válido con las 4 hojas de contenido + hojas de vehículos/listados, sin `<lastmod>` y sin `-index`.
- [ ] Cada `<loc>` del maestro responde 200 con un `<urlset>`.
- [ ] Noticias/colaboraciones/concesionarios: solo entradas publicadas, sin `noIndex`.
- [ ] Las 5 páginas `noindex` traen la meta robots y no aparecen en ningún sitemap.
- [ ] Si se apaga el API, el sitemap responde 500 (o sirve la última versión ISR), nunca un `urlset` vacío.
- [ ] Enviar únicamente `https://www.wiauto.es/sitemap.xml` en Search Console.

---

## Mapa rápido de archivos

```text
wiauto-frontend/
  app/robots.ts
  app/sitemap.xml/route.ts                                  (maestro)
  app/(public)/sitemap/paginas/sitemap.ts
  app/(public)/sitemap/noticias/sitemap.ts
  app/(public)/sitemap/colaboraciones/sitemap.ts
  app/(public)/sitemap/concesionarios/sitemap.ts
  app/(public)/sitemap/vehiculos/catalog/sitemap.ts
  app/(public)/sitemap/vehiculos/with-province/sitemap.ts
  app/(public)/sitemap/vehiculos/listings-index.xml/route.ts (auxiliar)
  app/(public)/vehiculo/sitemap.ts
  app/(public)/vehiculo/sitemap-index.xml/route.ts           (auxiliar)
  lib/seo/build-sitemap-index.ts          (maestro: locs + XML)
  lib/seo/build-content-sitemap.ts
  lib/seo/fetch-strapi-sitemap-entries.ts
  lib/seo/fetch-dealership-sitemap.ts
  lib/seo/static-pages.ts
  lib/seo/noindex.ts
  lib/seo/vehicle-sitemap.constants.ts
  lib/seo/vehicle-listing-sitemap.constants.ts
  lib/seo/fetch-vehicle-sitemap.ts
  lib/seo/fetch-vehicle-listing-sitemap.ts
  lib/seo/build-vehicle-sitemap-index.ts
  lib/seo/build-vehicle-listing-sitemap-index.ts
  lib/seo/vehicle-sitemap-segments.ts
  lib/seo/get-vehicle-sitemap-priority.ts
  lib/vehicles/listing-url/indexable-catalog-listing-url.ts

wiauto-backend/
  src/contexts/vehicles/api/route.constants.ts
    → V1_SITEMAP_VEHICLES = "v1/sitemap/vehicles"
    → V1_SITEMAP_VEHICLE_LISTINGS = "v1/sitemap/vehicle-listings"
  src/contexts/vehicles/api/v1/vehicle-sitemap/*
  src/contexts/vehicles/api/v1/vehicle-sitemap-list/*
  src/contexts/vehicles/services/sitemap-vehicles-list.service.ts
  src/contexts/vehicles/types/vehicle-listing-sitemap.ts
  src/contexts/vehicles/repositories/typeorm.vehicle-repository.ts
  src/contexts/dealership/api/v1/find-all-dealerships/*     (GET /v1/dealerships)
```
