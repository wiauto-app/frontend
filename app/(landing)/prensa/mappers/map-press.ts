import { getStrapiMediaUrl } from "@/lib/strapi-media";
import type {
  PressListItem,
  PressPaginatedResult,
  PressPublisher,
} from "../types/press.types";
import type {
  StrapiPressEntry,
  StrapiPressListResponse,
} from "../types/strapi-press.types";

const mapImageUrl = (imagen?: StrapiPressEntry["imagen"]): string | null => {
  if (!imagen) {
    return null;
  }
  return getStrapiMediaUrl(imagen.formats?.large?.url ?? imagen.url) ?? imagen.url;
};

const mapPublisher = (
  publicado_por?: StrapiPressEntry["publicado_por"],
): PressPublisher | null => {
  if (!publicado_por) {
    return null;
  }
  return {
    name: publicado_por.nombre,
    image_url: getStrapiMediaUrl(publicado_por.imagen?.url),
  };
};

export const mapPressListItem = (entry: StrapiPressEntry): PressListItem => ({
  document_id: entry.documentId,
  title: entry.titulo,
  summary: entry.resumen,
  image_url: mapImageUrl(entry.imagen),
  published_at: entry.fecha_publicacion ?? null,
  is_featured: Boolean(entry.destacada),
  publisher: mapPublisher(entry.publicado_por),
  reading_time: entry.tiempo_lectura ?? null,
  url: entry.url,
});

export const mapPressPaginated = (
  response: StrapiPressListResponse,
): PressPaginatedResult => ({
  items: response.data.map(mapPressListItem),
  pagination: {
    page: response.meta.pagination.page,
    page_size: response.meta.pagination.pageSize,
    page_count: response.meta.pagination.pageCount,
    total: response.meta.pagination.total,
  },
});
