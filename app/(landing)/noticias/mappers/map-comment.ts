import type { Comment, CommentsPaginatedResult } from "../types/comment.types";
import type {
  StrapiCommentEntry,
  StrapiCommentsListResponse,
} from "../types/strapi-comment.types";

export const mapComment = (entry: StrapiCommentEntry): Comment => ({
  document_id: entry.documentId,
  name: entry.nombre ?? null,
  email: entry.email ?? null,
  text: entry.comentario ?? null,
  news_document_id: entry.noticia?.documentId ?? null,
  news_title: entry.noticia?.titulo ?? null,
  news_slug: entry.noticia?.slug ?? null,
  published_at: entry.publishedAt ?? null,
  created_at: entry.createdAt ?? null,
});

export const mapCommentsPaginated = (
  response: StrapiCommentsListResponse,
): CommentsPaginatedResult => ({
  items: response.data.map(mapComment),
  pagination: {
    page: response.meta.pagination.page,
    page_size: response.meta.pagination.pageSize,
    page_count: response.meta.pagination.pageCount,
    total: response.meta.pagination.total,
  },
});
