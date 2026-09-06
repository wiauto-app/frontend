import qs from "qs";

import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { getStrapiData, type StrapiResponse } from "@/lib/strapi-api";
import { HERO_POPULATE } from "@/lib/strapi-populate";

const VEHICLE_DETAIL_ENDPOINT = "/detalle-vehiculo";
const HERO_COMPONENT_UID = "shared.hero" as const;

/**
 * `colaboraciones` es una zona dinámica. El fragmento `on` permite poblar
 * únicamente las relaciones del componente `shared.hero` con la misma
 * configuración compartida por el resto de páginas.
 */
export const VEHICLE_DETAIL_CMS_POPULATE = {
  populate: {
    colaboraciones: {
      on: {
        [HERO_COMPONENT_UID]: HERO_POPULATE,
      },
    },
  },
} as const;

export interface VehicleDetailHeroCollaboration extends StrapiHero {
  __component: typeof HERO_COMPONENT_UID;
}

export interface VehicleDetailUnknownCollaboration {
  id: number;
  __component: string;
  [key: string]: unknown;
}

export type VehicleDetailCollaboration =
  | VehicleDetailHeroCollaboration
  | VehicleDetailUnknownCollaboration;

export interface VehicleDetailCmsContent {
  id: number;
  documentId?: string;
  colaboraciones: VehicleDetailCollaboration[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

const buildVehicleDetailCmsQuery = (): string =>
  qs.stringify(VEHICLE_DETAIL_CMS_POPULATE, {
    encodeValuesOnly: true,
  });

const isHeroCollaboration = (
  collaboration: VehicleDetailCollaboration,
): collaboration is VehicleDetailHeroCollaboration =>
  collaboration.__component === HERO_COMPONENT_UID;

const getContent = async (): Promise<VehicleDetailCmsContent | null> => {
  const query = buildVehicleDetailCmsQuery();
  const response = await getStrapiData<
    StrapiResponse<VehicleDetailCmsContent | null>
  >(`${VEHICLE_DETAIL_ENDPOINT}?${query}`);

  return response.data;
};

const getHeroCollaborations = async (): Promise<
  VehicleDetailHeroCollaboration[]
> => {
  const content = await getContent();
  return content?.colaboraciones.filter(isHeroCollaboration) ?? [];
};

export const vehicleDetailCmsService = {
  getContent,
  getHeroCollaborations,
};
