import type {
  StrapiListMeta,
  StrapiMedia,
  StrapiSeoComponent,
  StrapiUserComponent,
} from "@/lib/strapi.types";

export type StrapiBlock = Record<string, unknown>;

/** Strapi fields — names match CMS schema */
export type StrapiNewsCategory = {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  description?: StrapiBlock[] | null;
};

export type StrapiCommentNewsRef = {
  documentId: string;
  titulo?: string;
  slug?: string;
};

export type StrapiComment = {
  id: number;
  documentId: string;
  nombre?: string | null;
  email?: string | null;
  comentario?: string | null;
  noticia?: StrapiCommentNewsRef | null;
};

export type StrapiNewsAttributes = {
  titulo: string;
  slug: string;
  contenido: StrapiBlock[];
  resumen: string;
  banner: StrapiMedia[];
  categoria_noticia?: StrapiNewsCategory | null;
  seo?: StrapiSeoComponent | null;
  publicado_por?: StrapiUserComponent | null;
  comentarios?: StrapiComment[] | null;
  citacion?: string | null;
  destacada?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type StrapiNewsEntry = {
  id: number;
  documentId: string;
} & StrapiNewsAttributes;

export type StrapiNewsListResponse = {
  data: StrapiNewsEntry[];
  meta: StrapiListMeta;
};

export type StrapiNewsSingleResponse = {
  data: StrapiNewsEntry;
  meta: Record<string, unknown>;
};
