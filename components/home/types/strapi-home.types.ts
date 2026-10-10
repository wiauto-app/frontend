import type {
  StrapiAppAdvertisment,
  StrapiCard,
  StrapiFeaturesSection,
  StrapiHero,
  StrapiHomeHero,
  StrapiLowEmisions,
  StrapiNewsletter,
  StrapiProcessSection,
  StrapiSeo,
} from "@/interfaces/strapi-components.interface";
import type { StrapiMedia } from "@/lib/strapi.types";

export type { StrapiMedia };

/** Single type Strapi `homepage` (respuesta `data`). */
export interface StrapiHomepageResponse {
  homeSeo: StrapiSeo ;
  homeHero: StrapiHomeHero ;
  herramientas: StrapiCard[];
  homeAppAdvertisment: StrapiAppAdvertisment ;
  homeFeatures: StrapiFeaturesSection ;
  homeNewsletter: StrapiNewsletter ;
  processSection: StrapiProcessSection ;
  bajas_emisiones: StrapiLowEmisions ;
  promocion_planes: StrapiHero ;
  /** Tarjetas de servicios extra del home (`shared.carta-ventaja`, repetible). */
  servicios_extra: StrapiCard[] | null;
}
