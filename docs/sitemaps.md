# Sitemaps WiAuto

Documentación de los sitemaps que existen **ahora mismo** en el frontend (Next.js) y los endpoints del backend (Nest) que los alimentan.

## 1. Resumen

Los sitemaps ayudan a los buscadores a descubrir:

1. **Fichas de vehículo** (`/vehiculo/{id}`).
2. **Listados indexables de catálogo** (`/vehiculos/{marca}/{modelo}` y `/vehiculos/{marca}/{modelo}/{provincia}`).

Se descubren vía `app/robots.ts` → respuesta pública `/robots.txt`, que declara tres entradas:

| Entrada en robots.txt | Estado |
| --- | --- |
| `{FRONTEND_URL}/sitemap.xml` | Referenciado, pero **no hay** `app/sitemap.ts` (ni equivalente). En la práctica suele responder **404**. |
| `{FRONTEND_URL}/vehiculo/sitemap-index.xml` | Implementado (índice de fichas). |
| `{FRONTEND_URL}/sitemap/vehiculos/listings-index.xml` | Implementado (índice de listados). |

`FRONTEND_URL` cae a `https://www.wiauto.es` si no está definido. Revalidación típica de índices y fetches al API: **3600 s**.

---

## 2. Tabla de sitemaps públicos

| URL pública | Qué URLs indexa | Frontend | Backend |
| --- | --- | --- | --- |
| `/robots.txt` | (no es sitemap; declara sitemaps) | `app/robots.ts` | — |
| `/sitemap.xml` | — (referenciado en robots; **sin implementación**) | — | — |
| `/vehiculo/sitemap-index.xml` | Apunta a segmentos `/vehiculo/sitemap/{id}.xml` | `app/(public)/vehiculo/sitemap-index.xml/route.ts` + `lib/seo/build-vehicle-sitemap-index.ts` | `GET /api/v1/sitemap/vehicles/meta` |
| `/vehiculo/sitemap/{id}.xml` | `/vehiculo/{uuid}` (vehículos activos) | `app/(public)/vehiculo/sitemap.ts` + `lib/seo/fetch-vehicle-sitemap.ts` | `GET /api/v1/sitemap/vehicles?page=&limit=` |
| `/sitemap/vehiculos/listings-index.xml` | Apunta a segmentos catalog + with-province | `app/(public)/sitemap/vehiculos/listings-index.xml/route.ts` + `lib/seo/build-vehicle-listing-sitemap-index.ts` | `GET /api/v1/sitemap/vehicle-listings/meta?variant=` (ambas variantes) |
| `/sitemap/vehiculos/catalog/sitemap/{id}.xml` | `/vehiculos/{makeSlug}/{modelSlug}` | `app/(public)/sitemap/vehiculos/catalog/sitemap.ts` + `lib/seo/fetch-vehicle-listing-sitemap.ts` | `GET /api/v1/sitemap/vehicle-listings?variant=catalog&page=&limit=` |
| `/sitemap/vehiculos/with-province/sitemap/{id}.xml` | `/vehiculos/{makeSlug}/{modelSlug}/{provinceSlug}` | `app/(public)/sitemap/vehiculos/with-province/sitemap.ts` + `lib/seo/fetch-vehicle-listing-sitemap.ts` | `GET /api/v1/sitemap/vehicle-listings?variant=with-province&page=&limit=` |

Constantes de paths de listados: `lib/seo/vehicle-listing-sitemap.constants.ts`.

---

## 3. Detalle por sitemap

### 3.1 Detalle de vehículos

**Índice:** `GET /vehiculo/sitemap-index.xml`

1. Llama a `fetchVehicleSitemapMeta()` → `GET /api/v1/sitemap/vehicles/meta`.
2. Calcula segmentos con `getVehicleSitemapSegmentIds(totalPages)` (`lib/seo/vehicle-sitemap-segments.ts`).
3. Emite XML `sitemapindex` con locs `/vehiculo/sitemap/{id}.xml`.
4. Si falla el meta: emite un único segmento `"0"`.

**Segmentos:** Next `generateSitemaps` + `sitemap` en `app/(public)/vehiculo/sitemap.ts`.

- El `id` del segmento es **0-based** (`"0"`, `"1"`, …).
- La página del API es `page = id + 1` (1-based).
- Cada entrada:
  - `url`: `/vehiculo/{entry.id}`
  - `lastModified`: `entry.updatedAt`
  - `changeFrequency`: `daily`
  - `priority`: `0.9` si destacado activo, si no `0.8` (`getVehicleSitemapPriority`)

**Backend (Nest):**

| Método | Path | Controlador |
| --- | --- | --- |
| `GET` | `/api/v1/sitemap/vehicles/meta` | `vehicle-sitemap.controller.ts` |
| `GET` | `/api/v1/sitemap/vehicles` | idem |

Criterio de filas (`TypeOrmVehicleRepository`):

- `status = ACTIVE`
- `deleted_at IS NULL`
- Orden: `updated_at DESC`
- Campos: `id`, `updatedAt` (ISO), `isFeatured` (destacado vigente)

Constantes FE: `lib/seo/vehicle-sitemap.constants.ts` (`PAGE_SIZE = 5000`, prioridades `0.8` / `0.9`).  
Constante BE alineada: `VEHICLE_SITEMAP_PAGE_SIZE = 5000` en `vehicle-sitemap.http-dto.ts`.

---

### 3.2 Listados indexables

**Índice:** `GET /sitemap/vehiculos/listings-index.xml`

1. En paralelo: meta `variant=catalog` y `variant=with-province`.
2. Construye entradas de ambos (`buildVehicleListingSitemapIndexEntries`).
3. XML con locs:
   - `/sitemap/vehiculos/catalog/sitemap/{id}.xml`
   - `/sitemap/vehiculos/with-province/sitemap/{id}.xml`
4. Si falla: índice vacío (0 páginas → un segmento `"0"` por variante vía `getVehicleSitemapSegmentIds`).

#### Catalog

Archivo: `app/(public)/sitemap/vehiculos/catalog/sitemap.ts`

- URLs: `/vehiculos/{makeSlug}/{modelSlug}`
- `changeFrequency`: `weekly`
- `priority`: **0.7** (`VEHICLE_LISTING_SITEMAP_CATALOG_PRIORITY`)

#### With-province

Archivo: `app/(public)/sitemap/vehiculos/with-province/sitemap.ts`

- URLs: `/vehiculos/{makeSlug}/{modelSlug}/{provinceSlug}`
- Filtra entradas sin `provinceSlug`
- `changeFrequency`: `weekly`
- `priority`: **0.65** (`VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_PRIORITY`)

**Backend (Nest):**

| Método | Path | Controlador |
| --- | --- | --- |
| `GET` | `/api/v1/sitemap/vehicle-listings/meta?variant=` | `vehicle-sitemap-list.controller.ts` |
| `GET` | `/api/v1/sitemap/vehicle-listings?variant=&page=&limit=` | idem |

Servicio de dominio: `sitemap-vehicles-list.service.ts` → repositorio.

Criterio base (ambas variantes):

- Vehículo `ACTIVE`, no borrado, con `version_id`
- Join a make/model del catálogo vía versión
- Agrupación por `make.slug` + `model.slug` (y provincia si aplica)

Variante `with-province` además:

- Exige `lat` / `lng`
- `ST_Intersects` del punto del vehículo con geometría de `provinces`
- Agrupa también por `province.slug`

Constantes FE: `lib/seo/vehicle-listing-sitemap.constants.ts` (`PAGE_SIZE = 5000`).  
BE: `VEHICLE_SITEMAP_LISTING_PAGE_SIZE = 5000`; variantes `catalog` \| `with-province`.

---

### 3.3 `/sitemap.xml` raíz

`robots.ts` lo declara, pero **no existe** un `app/sitemap.ts` (ni ruta equivalente) en el frontend.

Conclusión: está **referenciado** para crawlers; la ruta pública **no está implementada** en este código (esperable 404 hasta que se añada un sitemap raíz u otra fuente).

---

## 4. Por qué los XML de listados NO viven bajo `/vehiculos/`

La página de listado es un catch-all:

```text
app/(public)/vehiculos/[[...slug]]/page.tsx
```

Cualquier path bajo `/vehiculos/*` (p. ej. `/vehiculos/sitemap.xml`) lo capturaría esa ruta como slug de filtros, no como sitemap.

Por eso los **archivos XML** de listados están fuera:

- Índice: `/sitemap/vehiculos/listings-index.xml`
- Segmentos: `/sitemap/vehiculos/catalog/...` y `/sitemap/vehiculos/with-province/...`

Las **URLs dentro del XML** sí son del listado público (`/vehiculos/toyota/avensis`, etc.). Solo la ubicación de los ficheros sitemap evita el conflicto con el catch-all.

El índice de fichas usa `/vehiculo/...` (singular), que no choca con `/vehiculos/[[...slug]]`.

---

## 5. Contrato de datos

### Respuesta API (frontend espera)

```ts
{ ok: true, data: T }
```

### Meta (vehículos y listados)

| Campo | Significado |
| --- | --- |
| `total` | Número de filas / combinaciones |
| `limit` | Tamaño de página (default **5000**, máx. 5000) |
| `totalPages` | `ceil(total / limit)`; `0` si `total === 0` |
| `variant` | Solo listados: `"catalog"` \| `"with-province"` |

### Página

| Campo | Significado |
| --- | --- |
| `data` | Array de entradas |
| `page` | Página 1-based |
| `limit` / `total` / `totalPages` | Igual que meta |
| `variant` | Solo listados |

### Entradas

**Vehículos:** `{ id, updatedAt, isFeatured }`

**Listados:** `{ makeSlug, modelSlug, provinceSlug? }` (`provinceSlug` en `with-province`)

### Segmentación en Next

- `totalPages <= 0` → un segmento `"0"` (sitemap vacío o fallback).
- `totalPages = N` → ids `"0"…"N-1"`.
- Query al API: `page = Number(id) + 1`.

### Prioridades

| Tipo | Priority |
| --- | --- |
| Ficha destacada | 0.9 |
| Ficha normal | 0.8 |
| Listado catalog | 0.7 |
| Listado with-province | 0.65 |

---

## 6. URLs indexables vs “clásicas”

Solo entran al sitemap de listados las combinaciones **marca + modelo** (y opcionalmente **provincia** geolocalizada) con vehículos activos y versión de catálogo.

En frontend, el path indexable de catálogo se define en `lib/vehicles/listing-url/indexable-catalog-listing-url.ts`:

| Path | Indexable en sitemap |
| --- | --- |
| `/vehiculos/{marca}/{modelo}` | Sí (`catalog`) |
| `/vehiculos/{marca}/{modelo}/{provincia}` | Sí (`with-province`; slug de provincia **sin** prefijo `provincia-`) |
| `/vehiculos/provincia-madrid`, geo con prefijos, 1 segmento, etc. | No (fuera del sitemap; URLs “clásicas” / geo / query) |
| Query degradada (`?marcas=`, `?modelos=`, `?provincias=`, …) | No indexable como canónica de catálogo (`CATALOG_DEGRADED_QUERY_KEYS`) |

Helpers relacionados: `buildIndexableCatalogListingPath`, `isIndexableCatalogSlugPath`, y en listado la metadata canónica de `vehiculos/[[...slug]]/page.tsx`.

---

## 7. Cómo probar localmente

Sustituye el host del frontend (p. ej. `http://localhost:3000`) y del API (p. ej. `http://localhost:3001/api` según tu `.env`).

```bash
# Descubrimiento
curl -sS "$FRONTEND_URL/robots.txt"

# Índices
curl -sS "$FRONTEND_URL/vehiculo/sitemap-index.xml" | head
curl -sS "$FRONTEND_URL/sitemap/vehiculos/listings-index.xml" | head

# Segmento 0 (fichas + listados)
curl -sS "$FRONTEND_URL/vehiculo/sitemap/0.xml" | head
curl -sS "$FRONTEND_URL/sitemap/vehiculos/catalog/sitemap/0.xml" | head
curl -sS "$FRONTEND_URL/sitemap/vehiculos/with-province/sitemap/0.xml" | head

# Raíz referenciada (esperable 404 hoy)
curl -sS -o /dev/null -w "%{http_code}\n" "$FRONTEND_URL/sitemap.xml"

# API Nest
curl -sS "$API_URL/v1/sitemap/vehicles/meta"
curl -sS "$API_URL/v1/sitemap/vehicles?page=1&limit=2"
curl -sS "$API_URL/v1/sitemap/vehicle-listings/meta?variant=catalog"
curl -sS "$API_URL/v1/sitemap/vehicle-listings?variant=catalog&page=1&limit=2"
curl -sS "$API_URL/v1/sitemap/vehicle-listings/meta?variant=with-province"
curl -sS "$API_URL/v1/sitemap/vehicle-listings?variant=with-province&page=1&limit=2"
```

### Checklist corto

- [ ] `/robots.txt` lista las tres URLs de sitemap.
- [ ] `/vehiculo/sitemap-index.xml` apunta a `/vehiculo/sitemap/{n}.xml` y el segmento 0 tiene locs `/vehiculo/{id}`.
- [ ] `/sitemap/vehiculos/listings-index.xml` mezcla catalog + with-province.
- [ ] Catalog: locs `/vehiculos/{marca}/{modelo}`; with-province: tres segmentos.
- [ ] `/sitemap.xml` responde lo esperado (hoy: sin implementación).
- [ ] Meta API: `total` / `totalPages` coherentes con el tamaño de página 5000.
- [ ] Confirmar que **no** existe ruta XML bajo `/vehiculos/sitemap…` (catch-all).

---

## Mapa rápido de archivos

```text
wiauto-frontend/
  app/robots.ts
  app/(public)/vehiculo/sitemap-index.xml/route.ts
  app/(public)/vehiculo/sitemap.ts
  app/(public)/sitemap/vehiculos/listings-index.xml/route.ts
  app/(public)/sitemap/vehiculos/catalog/sitemap.ts
  app/(public)/sitemap/vehiculos/with-province/sitemap.ts
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
    → count/find SitemapVehicles + SitemapVehicleListings
```
