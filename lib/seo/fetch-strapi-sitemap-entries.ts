import { getStrapiData } from "@/lib/strapi-api";
import type { StrapiListMeta } from "@/lib/strapi.types";

export interface StrapiSitemapEntry {
  slug: string;
  updatedAt?: string;
  noIndex: boolean;
}

interface StrapiSitemapItem {
  slug?: string | null;
  updatedAt?: string | null;
  seo?: { noIndex?: boolean | null } | null;
}

interface StrapiSitemapResponse {
  data: StrapiSitemapItem[];
  meta?: StrapiListMeta;
}

interface FetchAllStrapiSitemapEntriesOptions {
  /** Popula `seo.noIndex` (los tipos sin componente `seo` deben pasar `false`). */
  includeSeo: boolean;
}

const STRAPI_SITEMAP_PAGE_SIZE = 100;
/** 500 páginas x 100 = 50.000 URLs, el máximo de un sitemap. */
const STRAPI_SITEMAP_MAX_PAGES = 500;
const STRAPI_SITEMAP_REVALIDATE_SECONDS = 3600;

const buildSitemapQuery = (
  page: number,
  { includeSeo }: FetchAllStrapiSitemapEntriesOptions,
): string => {
  const search_params = new URLSearchParams();
  search_params.append("fields[0]", "slug");
  search_params.append("fields[1]", "updatedAt");

  if (includeSeo) {
    search_params.append("populate[seo][fields][0]", "noIndex");
  }

  search_params.append("status", "published");
  search_params.append("sort[0]", "updatedAt:desc");
  search_params.append("sort[1]", "id:asc");
  search_params.append("pagination[page]", String(page));
  search_params.append(
    "pagination[pageSize]",
    String(STRAPI_SITEMAP_PAGE_SIZE),
  );

  return search_params.toString();
};

const mapSitemapItem = (item: StrapiSitemapItem): StrapiSitemapEntry => ({
  slug: item.slug ?? "",
  updatedAt: item.updatedAt ?? undefined,
  noIndex: item.seo?.noIndex === true,
});

/**
 * Recorre todas las páginas de una colección de Strapi (solo slug, updatedAt y
 * noIndex). Lanza ante cualquier error para que el sitemap responda 500 y ISR
 * conserve la última versión válida.
 */
export const fetchAllStrapiSitemapEntries = async (
  endpoint: string,
  options: FetchAllStrapiSitemapEntriesOptions,
): Promise<StrapiSitemapEntry[]> => {
  const entries: StrapiSitemapEntry[] = [];

  for (let page = 1; page <= STRAPI_SITEMAP_MAX_PAGES; page += 1) {
    const response = await getStrapiData<StrapiSitemapResponse>(
      `${endpoint}?${buildSitemapQuery(page, options)}`,
      { revalidate: STRAPI_SITEMAP_REVALIDATE_SECONDS },
    );
    const pageCount = response.meta?.pagination?.pageCount;

    if (typeof pageCount !== "number") {
      throw new Error(`Respuesta inválida de Strapi para el sitemap ${endpoint}.`);
    }

    entries.push(...response.data.map(mapSitemapItem));

    if (page >= pageCount) {
      return entries;
    }
  }

  throw new Error(
    `El sitemap ${endpoint} supera el máximo de ${STRAPI_SITEMAP_MAX_PAGES} páginas.`,
  );
};
