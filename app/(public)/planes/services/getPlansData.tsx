import { getStrapiData } from "@/lib/strapi-api";
import qs from "qs";

import type {
  PlanesPageResponse,
  StrapiPlanesResponse,
} from "../interfaces/planes.interface";
import {
  ADVANTAGES_POPULATE,
  CARD_POPULATE,
  HERO_POPULATE,
} from "@/lib/strapi-populate";

const PLANS_POPULATE_QUERY = {
  populate: {
    hero: HERO_POPULATE,
    action_call_section: HERO_POPULATE,
    ventajas: ADVANTAGES_POPULATE,
    facil_vender: ADVANTAGES_POPULATE,
    contact: CARD_POPULATE,
  },
};

export const getPlansData = async (): Promise<PlanesPageResponse | null> => {
  const query = qs.stringify(PLANS_POPULATE_QUERY, {
    encodeValuesOnly: true,
  });

  const response = await getStrapiData<StrapiPlanesResponse>(
    `/pagina-plan?${query}`,
  );

  return response.data ?? null;
};
