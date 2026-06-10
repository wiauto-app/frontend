import { getStrapiData, StrapiResponse } from "@/lib/strapi-api";

import { Service } from "../interfaces/service.interface";

const SERVICE_POPULATE =
  "populate[estructura][on][shared.desplegable][populate][imagen]=true" +
  "&populate[estructura][on][shared.carta-ventaja][populate][boton]=true" +
  "&populate[estructura][on][shared.bloque-caracteristica][populate][imagen]=true" +
  "&populate[estructura][on][shared.anuncio][populate][boton]=true" +
  "&populate[sugerencias][populate][imagen]=true";

const appendPopulateParams = (searchParams: URLSearchParams): void => {
  for (const populateParam of SERVICE_POPULATE.split("&")) {
    const [key, value] = populateParam.split("=");
    if (key && value) {
      searchParams.append(key, value);
    }
  }
};

export const servicesService = {
  findAll: async () => {
    const searchParams = new URLSearchParams();
    searchParams.set("sort", "titulo:asc");

    return getStrapiData<StrapiResponse<Service[]>>(
      `/services?${searchParams.toString()}`,
    );
  },

  findBySlug: async (slug: string): Promise<Service> => {
    const searchParams = new URLSearchParams();
    searchParams.append("filters[slug][$eq]", slug);
    searchParams.append("pagination[pageSize]", "1");
    appendPopulateParams(searchParams);

    const response = await getStrapiData<StrapiResponse<Service[]>>(
      `/services?${searchParams.toString()}`,
    );

    const entry = response.data[0];
    if (!entry) {
      throw new Error(`Servicio con slug "${slug}" no encontrado`);
    }

    return entry;
  },
};
