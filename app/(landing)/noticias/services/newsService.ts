import { getStrapiData } from "@/lib/strapi-api";
import {
  mapNewsCategory,
  mapNewsDetail,
  mapNewsPaginated,
} from "../mappers/map-news";
import type {
  FindAllNewsParams,
  FindOneNewsParams,
  NewsCategory,
  NewsDetail,
  NewsPaginatedResult,
} from "../types/news.types";
import type {
  StrapiNewsCategory,
  StrapiNewsListResponse,
  StrapiNewsSingleResponse,
} from "../types/strapi-news.types";

const NEWS_POPULATE =
  "populate[banner]=true" +
  "&populate[categoria_noticia]=true" +
  "&populate[seo][populate][shareImage]=true" +
  "&populate[publicado_por][populate][imagen]=true" +
  "&populate[comentarios]=true";

const appendPopulateParams = (search_params: URLSearchParams): void => {
  for (const populate_param of NEWS_POPULATE.split("&")) {
    const [key, value] = populate_param.split("=");
    if (key && value) {
      search_params.append(key, value);
    }
  }
};

const buildFindAllQuery = (params?: FindAllNewsParams): string => {
  const search_params = new URLSearchParams();
  search_params.set("sort", "publishedAt:desc");
  search_params.append("pagination[page]", String(params?.page ?? 1));
  search_params.append("pagination[pageSize]", String(params?.page_size ?? 10));

  if (params?.is_featured !== undefined) {
    search_params.append("filters[destacada][$eq]", String(params.is_featured));
  }

  if (params?.category_slug) {
    search_params.append(
      "filters[categoria_noticia][slug][$eq]",
      params.category_slug,
    );
  }

  appendPopulateParams(search_params);
  return search_params.toString();
};

/** Read-only. News content (blocks) is managed in Strapi. Use `commentService.create` to insert comments. */
export const newsService = {
  findAll: async (params?: FindAllNewsParams): Promise<NewsPaginatedResult> => {
    const query = buildFindAllQuery(params);
    const response = await getStrapiData<StrapiNewsListResponse>(
      `/noticias?${query}`,
    );
    return mapNewsPaginated(response);
  },

  findOne: async (params: FindOneNewsParams): Promise<NewsDetail> => {
    if ("document_id" in params && params.document_id) {
      const response = await getStrapiData<StrapiNewsSingleResponse>(
        `/noticias/${params.document_id}?${NEWS_POPULATE}`,
      );
      return mapNewsDetail(response.data);
    }

    const slug = "slug" in params ? params.slug : undefined;
    if (!slug) {
      throw new Error("Provide document_id or slug to fetch the news item");
    }

    const search_params = new URLSearchParams();
    search_params.append("filters[slug][$eq]", slug);
    search_params.append("pagination[pageSize]", "1");
    appendPopulateParams(search_params);

    const response = await getStrapiData<StrapiNewsListResponse>(
      `/noticias?${search_params.toString()}`,
    );

    const entry = response.data[0];
    if (!entry) {
      throw new Error(`News item with slug "${slug}" not found`);
    }

    return mapNewsDetail(entry);
  },

  findAllCategories: async (): Promise<NewsCategory[]> => {
    const response = await getStrapiData<{ data: StrapiNewsCategory[] }>(
      "/categoria-noticias?sort=nombre:asc",
    );
    return response.data.map(mapNewsCategory);
  },
};
