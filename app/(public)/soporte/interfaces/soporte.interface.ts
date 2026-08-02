import type { BlocksContent } from "@strapi/blocks-react-renderer";

import type {
  StrapiCard,
  StrapiHeader,
  StrapiHero,
  StrapiIconFeature,
  StrapiLink,
} from "@/interfaces/strapi-components.interface";

export type SoporteLink = StrapiLink;
export type SoporteIconFeature = StrapiIconFeature;
export type SoporteCard = StrapiCard;
export type SoporteHeader = StrapiHeader;
export type SoporteHero = StrapiHero;

/** Componente `soporte.channels` */
export interface SoporteCanales {
  id: number;
  header: SoporteHeader | null;
  channel: SoporteCard[] | null;
}

/** Componente `shared.pregunta` */
export interface SoportePreguntaItem {
  id: number;
  pregunta: string | null;
  respuesta: BlocksContent | null;
}

/** Componente `soporte.preguntas` */
export interface SoportePreguntas {
  id: number;
  header: SoporteHeader | null;
  preguntas: SoportePreguntaItem[] | null;
}

/** Single type `soporte` */
export interface SoportePageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero: SoporteHero | null;
  caracteristicas: StrapiIconFeature[] | null;
  canales: SoporteCanales | null;
  preguntas: SoportePreguntas | null;
}

export interface StrapiSoporteResponse {
  data: SoportePageData | null;
}
