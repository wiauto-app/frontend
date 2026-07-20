import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface SoporteMediaFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
}

export interface SoporteMediaFormats {
  thumbnail?: SoporteMediaFormat;
  small?: SoporteMediaFormat;
  medium?: SoporteMediaFormat;
  large?: SoporteMediaFormat;
}

export interface SoporteMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: SoporteMediaFormats | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/** Componente `shared.link` */
export interface SoporteLink {
  id: number;
  label: string;
  url: string;
  destacado: boolean | null;
  imagen: SoporteMedia | null;
}

/** Componente `shared.icon-feature` */
export interface SoporteIconFeature {
  id: number;
  label: string;
  descripcion: string | null;
  icon: SoporteMedia | null;
  iconName: string | null;
}

/** Componente `shared.carta-ventaja` (card) */
export interface SoporteCard {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  boton: SoporteLink | null;
  imagen: SoporteMedia | null;
  colorFondo: string | null;
  colorTexto: string | null;
  iconName: string | null;
}

/** Componente `shared.header` */
export interface SoporteHeader {
  id: number;
  titulo: string | null;
  descripcion: string | null;
}

/** Componente `shared.hero` */
export interface SoporteHero {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  acciones: SoporteLink[] | null;
  imagen: SoporteMedia | null;
  caracteristicas: SoporteIconFeature[] | null;
  card: SoporteCard | null;
}

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
  caracteristicas: SoporteIconFeature[] | null;
  canales: SoporteCanales | null;
  preguntas: SoportePreguntas | null;
}

export interface StrapiSoporteResponse {
  data: SoportePageData | null;
}
