export type StrapiMedia = {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  } | null;
};

/** Alias de `StrapiSeo` (`shared.seo`) para compatibilidad. */
export type { StrapiSeo as StrapiSeoComponent } from "@/interfaces/strapi-components.interface";

/** Alias de `StrapiUser` (`shared.user`) para compatibilidad. */
export type { StrapiUser as StrapiUserComponent } from "@/interfaces/strapi-components.interface";

export type StrapiPaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type StrapiListMeta = {
  pagination: StrapiPaginationMeta;
};

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: StrapiPaginationMeta;
  } | null;
}