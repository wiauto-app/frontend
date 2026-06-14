import type { StrapiMedia } from "@/lib/strapi.types";

/** Componente `caracteristicas` — misión, visión, valores, etc. */
export type StrapiAboutUsFeature = {
  id: number;
  label: string;
  descripcion: string;
};

/** Componente `businessCard` */
export type StrapiAboutUsBusinessCard = {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  caracteristicas?: StrapiAboutUsFeature[] | null;
};

/** Componente `equipo` */
export type StrapiAboutUsTeamSection = {
  id: number;
  titulo: string;
  subtitulo: string;
  persona?: StrapiAboutUsPersona[] | null;
};

/** Miembro de equipo dentro del bloque `equipo` en Strapi */
export type StrapiAboutUsPersona = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: StrapiMedia | null;
};

/** Campos del single type `sobre-nosotro` en Strapi */
export type StrapiAboutUsAttributes = {
  titulo: string;
  caracteristicas?: StrapiAboutUsFeature[] | null;
  imagen?: StrapiMedia | null;
  businessCard?: StrapiAboutUsBusinessCard | null;
  equipo?: StrapiAboutUsTeamSection | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type StrapiAboutUsEntry = {
  id: number;
  documentId: string;
} & StrapiAboutUsAttributes;

export type StrapiAboutUsSingleResponse = {
  data: StrapiAboutUsEntry | null;
  meta: Record<string, unknown>;
};
