import type {
  StrapiHero,
  StrapiPlanesCaracteristicas,
} from "@/interfaces/strapi-components.interface";

/** Single type `sobre-nosotro` en Strapi. */
export interface AboutUsPageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  /** `shared.hero` — hero principal ("La forma más simple de..."). */
  hero: StrapiHero | null;
  /** `shared.hero` — sección "Misión y visión". */
  mission: StrapiHero | null;
  /** `planes.caracteristicas` — sección "Lo que nos mueve" (valores). */
  caracteristicas: StrapiPlanesCaracteristicas | null;
  /** `shared.hero` — sección "Personas que hacen la diferencia". */
  personas: StrapiHero | null;
}

export interface StrapiAboutUsResponse {
  data: AboutUsPageData | null;
}
