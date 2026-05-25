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

export type StrapiSeoComponent = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  canonicalURL?: string | null;
  noIndex?: boolean | null;
  shareImage?: StrapiMedia | null;
};

export type StrapiUserComponent = {
  nombre: string;
  imagen?: StrapiMedia | null;
};

export type StrapiPaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type StrapiListMeta = {
  pagination: StrapiPaginationMeta;
};
