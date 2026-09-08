import type {
  StrapiCard,
  StrapiEstadistica,
  StrapiHero,
  StrapiLink,
  StrapiMobileAdvertisment,
  StrapiPlanesCaracteristicas,
  StrapiPlanesTechAdd,
} from "@/interfaces/strapi-components.interface";

/** Alias histórico acoplado a la UI de planes. */
export type PlanesLinkAction = StrapiLink;

/** Hero de la página planes (`shared.hero` en CMS). */
export type PlanesHero = StrapiHero;

export type PlanesEstadistica = StrapiEstadistica;

export type PlanesCaracteristicasBlock = StrapiPlanesCaracteristicas;

export type PlanesTechBlock = StrapiPlanesTechAdd;

export type PlanesMobileBlock = StrapiMobileAdvertisment;

export interface PlanesPageResponse {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero: PlanesHero | null;
  action_call_section: StrapiHero;
  ventajas: PlanesCaracteristicasBlock | null;
  facil_vender: PlanesCaracteristicasBlock | null;
  contact: StrapiCard | null;
}

export interface StrapiPlanesResponse {
  data: PlanesPageResponse;
}
