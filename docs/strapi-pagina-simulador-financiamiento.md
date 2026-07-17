# Strapi — Simulador de Financiamiento

Single type de contenido marketing para `/simulador-financiamiento`.  
**No incluye** rangos de sliders, tasas, montos de seguro ni resultados numéricos (eso vive en Nest).  
**No incluye** textos del panel de simulación (`copyUi`): el frontend usa constantes locales del panel.

## Identificadores

| Campo | Valor |
|-------|--------|
| Display name | simulador |
| API ID (singular) | `simulador` |
| Endpoint | `GET /api/simulador` |

## Componentes reutilizados

### `shared.header`

| Campo | Tipo |
|-------|------|
| `titulo` | Text (string) |
| `descripcion` | Text (string) |

### `shared.icon-feature` (`icon_feature`)

| Campo | Tipo |
|-------|------|
| `label` | Text (string, required) |
| `icon` | Media (single, opcional) — suele llegar `null` |
| `descripcion` | Text (text) |
| `iconName` | Text (string, opcional) — p. ej. `LuGlobe`, `FaCar`, `HiOutlineCheck`, `IoCarSport` |

### `simulador.reasons`

| Campo | Tipo |
|-------|------|
| `titulo` | Text (string, required) |
| `razones` | Component `shared.icon-feature` (repeatable) |

### `shared.user`

| Campo | Tipo |
|-------|------|
| `nombre` | Text (string, required) |
| `imagen` | Media (single, opcional) |
| `descripcion` | Text (text, opcional) — se muestra como rol/subtítulo |

### `shared.comment`

| Campo | Tipo |
|-------|------|
| `usuario` | Component `shared.user` (single, required) |
| `rating` | Number integer 0–5 (required) |
| `comentario` | Text (text, required) |

### `simulador.comments`

| Campo | Tipo |
|-------|------|
| `titulo` | Text (string, required) |
| `comentario` | Component `shared.comment` (repeatable) |

## Atributos del single type

| Atributo | Tipo | Uso en frontend |
|----------|------|-----------------|
| `header` | Component `shared.header` (single) | `LandingHeader` + SEO |
| `financiar` | Component `simulador.reasons` (single) | Sección beneficios |
| `facilidades` | Component `simulador.reasons` (single) | Sección pasos/facilidades |
| `comentarios` | Component `simulador.comments` (single) | Sección testimonios |

## Mapeo frontend

| Strapi | Vista |
|--------|--------|
| `header.titulo` / `header.descripcion` | Hero + `seoTitle` / `seoDescription` |
| `financiar.titulo` | Título de beneficios |
| `financiar.razones[].label` | Título de cada beneficio |
| `financiar.razones[].descripcion` | Descripción |
| `financiar.razones[].iconName` | Icono UI (prioridad; `icon` media suele ser null) |
| `financiar.razones[].icon` | Media URL si existe |
| `facilidades.titulo` | Título de pasos |
| `facilidades.razones[]` | Pasos (orden = índice + 1), mismo mapeo de iconos |
| `comentarios.titulo` | Título de testimonios |
| `comentarios.comentario[].usuario.nombre` | Nombre |
| `comentarios.comentario[].usuario.imagen` | Foto |
| `comentarios.comentario[].usuario.descripcion` | Rol / subtítulo |
| `comentarios.comentario[].rating` | Estrellas |
| `comentarios.comentario[].comentario` | Cita |

**Solo locales (no en Strapi):** textos del panel (`copyUi`) y CTA final (`#simulador`).

## Resolución de `iconName`

Helper: `resolveStrapiIconName` en `app/(public)/simulador-financiamiento/utils/`.

| Prefijo | Librería |
|---------|----------|
| `Lu*` | `react-icons/lu` |
| `Fa*` | `react-icons/fa` |
| `Hi*` | `react-icons/hi2`, luego `react-icons/hi` |
| `Io*` | `react-icons/io5` |

En UI: `iconName` tiene prioridad; si no resuelve, se usa la URL de media (si existe).

## Query populate

```
GET /api/simulador?populate[header]=true&populate[financiar][populate][razones][populate][icon]=true&populate[facilidades][populate][razones][populate][icon]=true&populate[comentarios][populate][comentario][populate][usuario][populate][imagen]=true
```

Equivalente con `qs` (como en el frontend):

```js
{
  populate: {
    header: true,
    financiar: {
      populate: {
        razones: { populate: { icon: true } },
      },
    },
    facilidades: {
      populate: {
        razones: { populate: { icon: true } },
      },
    },
    comentarios: {
      populate: {
        comentario: {
          populate: {
            usuario: { populate: { imagen: true } },
          },
        },
      },
    },
  },
}
```

## Notas

1. Publica el single type y otorga permiso `find` al rol Public (o usa token de API).
2. Si Strapi falla o no hay `data`, el frontend no inventa contenido marketing: el panel de simulación sigue usable con copy local; las secciones CMS quedan vacías.
3. El panel del simulador consume Nest (`/v1/financing/simulator/config` y `/simulate`), no Strapi.
