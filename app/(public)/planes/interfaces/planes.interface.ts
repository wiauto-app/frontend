import type {
  StrapiEstadistica,
  StrapiHero,
  StrapiLink,
  StrapiMobileAdvertisment,
  StrapiPlanesCaracteristicas,
  StrapiPlanesTechAdd,
} from "@/interfaces/strapi-components.interface";

/** Alias histórico acoplado a la UI de planes. */
export interface PlanesLinkAction extends StrapiLink {}

/** Hero de la página planes (`shared.hero` en CMS). */
export interface PlanesHero extends StrapiHero {}

export interface PlanesEstadistica extends StrapiEstadistica {}

export interface PlanesCaracteristicasBlock extends StrapiPlanesCaracteristicas {}

export interface PlanesTechBlock extends StrapiPlanesTechAdd {}

export interface PlanesMobileBlock extends StrapiMobileAdvertisment {}

export interface PlanesPageResponse {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero: PlanesHero | null;
  estadisticas: PlanesEstadistica[] | null;
  caracteristicas: PlanesCaracteristicasBlock | null;
  tech_add: PlanesTechBlock | null;
  mobile_advertisment: PlanesMobileBlock | null;
}

export interface StrapiPlanesResponse {
  data: PlanesPageResponse;
}
