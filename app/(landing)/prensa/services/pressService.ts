import { getStrapiData } from "@/lib/strapi-api";
import { mapPressPaginated } from "../mappers/map-press";
import type {
  FindAllPressParams,
  PressPaginatedResult,
} from "../types/press.types";
import type { StrapiPressListResponse } from "../types/strapi-press.types";

const PRESS_POPULATE =
  "populate[imagen]=true" +
  "&populate[publicado_por][populate][imagen]=true";

const appendPopulateParams = (search_params: URLSearchParams): void => {
  for (const populate_param of PRESS_POPULATE.split("&")) {
    const [key, value] = populate_param.split("=");
    if (key && value) {
      search_params.append(key, value);
    }
  }
};

const buildFindAllQuery = (params?: FindAllPressParams): string => {
  const search_params = new URLSearchParams();
  search_params.set("sort", "fecha_publicacion:desc");
  search_params.append("pagination[page]", String(params?.page ?? 1));
  search_params.append("pagination[pageSize]", String(params?.page_size ?? 12));

  if (params?.is_featured !== undefined) {
    search_params.append("filters[destacada][$eq]", String(params.is_featured));
  }

  appendPopulateParams(search_params);
  return search_params.toString();
};

export const pressService = {
  findAll: async (params?: FindAllPressParams): Promise<PressPaginatedResult> => {
    const query = buildFindAllQuery(params);
    const response = await getStrapiData<StrapiPressListResponse>(
      `/noticia-prensas?${query}`,
    );
    return mapPressPaginated(response);
  },
};
