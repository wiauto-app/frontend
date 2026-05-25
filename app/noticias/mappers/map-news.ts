import { getStrapiMediaUrl } from "@/lib/strapi-media";
import type {
  NewsBanner,
  NewsCategory,
  NewsComment,
  NewsDetail,
  NewsListItem,
  NewsPublisher,
  NewsPaginatedResult,
} from "../types/news.types";
import type {
  StrapiComment,
  StrapiNewsCategory,
  StrapiNewsEntry,
  StrapiNewsListResponse,
} from "../types/strapi-news.types";

const mapCategory = (
  categoria_noticia?: StrapiNewsCategory | null,
): NewsCategory | null => {
  if (!categoria_noticia) {
    return null;
  }
  return {
    document_id: categoria_noticia.documentId,
    name: categoria_noticia.nombre,
    slug: categoria_noticia.slug,
  };
};

const mapComments = (comentarios?: StrapiComment[] | null): NewsComment[] => {
  if (!comentarios?.length) {
    return [];
  }
  return comentarios.map((item) => ({
    document_id: item.documentId,
    name: item.nombre ?? null,
    email: item.email ?? null,
    text: item.comentario ?? null,
  }));
};

const mapBanners = (banner?: StrapiNewsEntry["banner"]): NewsBanner[] => {
  if (!banner?.length) {
    return [];
  }
  return banner.map((media) => ({
    id: media.id,
    url: getStrapiMediaUrl(media.formats?.large?.url ?? media.url) ?? media.url,
    alternative_text: media.alternativeText ?? null,
  }));
};

const pickPrimaryBannerUrl = (banners: NewsBanner[]): string | null => {
  return banners[0]?.url ?? null;
};

const mapPublisher = (
  publicado_por?: StrapiNewsEntry["publicado_por"],
): NewsPublisher | null => {
  if (!publicado_por) {
    return null;
  }
  return {
    name: publicado_por.nombre,
    image_url: getStrapiMediaUrl(publicado_por.imagen?.url),
  };
};

export const mapNewsListItem = (entry: StrapiNewsEntry): NewsListItem => {
  const banners = mapBanners(entry.banner);
  return {
    document_id: entry.documentId,
    title: entry.titulo,
    slug: entry.slug,
    summary: entry.resumen,
    is_featured: Boolean(entry.destacada),
    banner_url: pickPrimaryBannerUrl(banners),
    category: mapCategory(entry.categoria_noticia),
    published_at: entry.publishedAt ?? null,
    created_at: entry.createdAt ?? null,
  };
};

export const mapNewsDetail = (entry: StrapiNewsEntry): NewsDetail => {
  const banners = mapBanners(entry.banner);
  return {
    ...mapNewsListItem(entry),
    content: entry.contenido ?? [],
    banners,
    seo: entry.seo ?? null,
    publisher: mapPublisher(entry.publicado_por),
    comments: mapComments(entry.comentarios),
    citation: entry.citacion ?? null,
    updated_at: entry.updatedAt ?? null,
  };
};

export const mapNewsPaginated = (
  response: StrapiNewsListResponse,
): NewsPaginatedResult => ({
  items: response.data.map(mapNewsListItem),
  pagination: {
    page: response.meta.pagination.page,
    page_size: response.meta.pagination.pageSize,
    page_count: response.meta.pagination.pageCount,
    total: response.meta.pagination.total,
  },
});
