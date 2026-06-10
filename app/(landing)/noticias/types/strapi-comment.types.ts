import type { StrapiListMeta } from "@/lib/strapi.types";
import type { StrapiComment } from "./strapi-news.types";

export type StrapiCommentEntry = StrapiComment & {
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type StrapiCommentsListResponse = {
  data: StrapiCommentEntry[];
  meta: StrapiListMeta;
};

export type StrapiCommentSingleResponse = {
  data: StrapiCommentEntry;
  meta: Record<string, unknown>;
};

/** Strapi fields — names match CMS schema */
export type CreateCommentStrapiBody = {
  nombre: string;
  email: string;
  comentario: string;
  noticia: {
    connect: string;
  };
};
