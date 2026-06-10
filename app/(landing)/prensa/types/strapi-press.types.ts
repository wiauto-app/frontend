import type {
  StrapiListMeta,
  StrapiMedia,
  StrapiUserComponent,
} from "@/lib/strapi.types";

export type StrapiBlock = Record<string, unknown>;

/** Strapi fields — names match CMS schema for `noticia-prensas` */
export type StrapiPressAttributes = {
  titulo: string;
  resumen: string;
  imagen?: StrapiMedia | null;
  fecha_publicacion?: string | null;
  destacada?: boolean | null;
  publicado_por?: StrapiUserComponent | null;
  tiempo_lectura?: string | null;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type StrapiPressEntry = {
  id: number;
  documentId: string;
} & StrapiPressAttributes;

export type StrapiPressListResponse = {
  data: StrapiPressEntry[];
  meta: StrapiListMeta;
};
