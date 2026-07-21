import type { StrapiMedia } from "@/lib/strapi.types";

/** Componente `shared.link` */
export interface StrapiLink {
  id: number;
  label: string;
  url: string;
  destacado: boolean | null;
  imagen: StrapiMedia | null;
}

/** Componente `shared.icon-feature` */
export interface StrapiIconFeature {
  id: number;
  label: string;
  descripcion: string | null;
  icon: StrapiMedia | null;
  iconName: string | null;
}

/** Componente `shared.carta-ventaja` (card) */
export interface StrapiCard {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  boton: StrapiLink | null;
  imagen: StrapiMedia | null;
  colorFondo: string | null;
  colorTexto: string | null;
  iconName: string | null;
}

/** Componente `shared.header` */
export interface StrapiHeader {
  id: number;
  titulo: string | null;
  descripcion: string | null;
}

/** Componente `shared.hero` */
export interface StrapiHero {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  acciones: StrapiLink[] | null;
  imagen: StrapiMedia | null;
  caracteristicas: StrapiIconFeature[] | null;
  card: StrapiCard | null;
}

/** Componente `home.features-section` */
export interface StrapiFeaturesSection {
  id: number;
  title: string | null;
  description: string | null;
  feature: StrapiIconFeature[] | null;
}
