# Creación de vehículo — referencia para agentes

Formulario **single-page** (`QuickVehicleForm`). Submit → `POST /api/v1/vehicles`. Backend: auth + cuota → defaults → save → precio → imágenes temp→final → index `pending`.

## Rutas

| Ruta | Componente |
|------|------------|
| `/crear-vehiculo` | `QuickVehicleForm` |
| `/editar-vehiculo/[id]` | `QuickVehicleForm` + `vehicleId` |

Gate auth en cliente. Redirect éxito → `/mis-anuncios`.

## Layout UX

Grid 4 cols: formulario (3) + sidebar preview/opcional (1).

| # | Sección | Obligatorio | Campos |
|---|---------|:-----------:|--------|
| 1 | Fotos | ✓ | `images[]` min 3 — `ImagesForm` |
| 2 | Vehículo | ✓ | cascada Marca→Modelo→Año→Versión (`QuickCatalogFields`) |
| 3 | Estado/precio | ✓ | `condition`, `mileage`, `price` |
| 4 | Ubicación | ✓ | `lat`, `lng` — `MapInput` (buscar, click, geolocalización) |
| 5 | Contacto | ✓ | `phone`, `email` (nombre solo UI desde perfil) |

**Sidebar:** `QuickVehiclePreview` (live) + acordeones opcionales + "Completar después".

### Opcionales (acordeones)

`transmission_type`, `power`, `displacement`, `traction_id`, `features_ids`, `services_ids`, `title`, `description`.

## Archivos clave

```
components/vehicles/quick-publish/QuickVehicleForm.tsx
components/vehicles/schemas/quick-vehicle.schema.ts
components/vehicles/utils/serializeQuickVehiclePayload.ts
components/forms/mapInput.tsx
components/dynamicSelectors/{quickYearSelector,versionSelector}.tsx
```

Wizard legacy (`VehicleForm` 5 pasos) ya no se usa en rutas públicas.

## DTO create — obligatorios vs opcionales

**Obligatorios API:** `version_id`, `price`, `mileage`, `condition`, `lat`, `lng`, `phone_code`, `phone`, `email`, `images` (validación UI min 3).

**Opcionales API:** `title`, `description`, `traction_id`, `displacement`, `vehicle_type_id`, `transmission_type`, `power`, `features_ids`, `services_ids`, etc.

**Defaults backend (create):**
- `title` → auto `{marca} {modelo} {versión}` si vacío
- `description` → `""`
- `publisher_type` → `particular`
- `displacement` → `0` (validación cilindrada solo si `> 0`)
- `traction_id` → `null`

**Serialize frontend:** `serializeQuickVehiclePayload` → `serializeVehiclePayload` (quita `catalog_*`, expande `phone`).

## Imágenes

`ImagesForm` → MinIO temp → backend promueve + WebP. Previews: `getImageUrl` + `NEXT_PUBLIC_MEDIA_URL`.

## MapInput

Requiere `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Places autocomplete + click mapa + botón geolocalización.

## Checklist al modificar

1. Campo obligatorio UI → `quickVehicleSchema` + DTO backend
2. Campo opcional → optional en DTO + omitir en serialize si vacío
3. Preview → `QuickVehiclePreview` + `useWatch`
