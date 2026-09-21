import { buildApiUrl } from "@/lib/api";

export interface DealershipSitemapEntry {
  slug: string;
  updatedAt: string;
}

interface DealershipSitemapItem {
  slug: string;
  updated_at: string;
}

interface DealershipSitemapPage {
  data: DealershipSitemapItem[];
  total: number;
  page: number;
  limit: number;
}

interface DealershipSitemapApiResponse {
  ok: boolean;
  data: DealershipSitemapPage;
}

const DEALERSHIP_SITEMAP_PAGE_SIZE = 100;
/** 500 páginas x 100 = 50.000 URLs, el máximo de un sitemap. */
const DEALERSHIP_SITEMAP_MAX_PAGES = 500;
const SITEMAP_REVALIDATE_SECONDS = 3600;

async function fetchDealershipSitemapPage(
  page: number,
): Promise<DealershipSitemapPage> {
  // Orden por id: estable entre páginas aunque un concesionario se actualice a mitad de la carga.
  const query = new URLSearchParams({
    page: String(page),
    limit: String(DEALERSHIP_SITEMAP_PAGE_SIZE),
    order_by: "id",
    order_direction: "ASC",
  });
  const response = await fetch(buildApiUrl(`/v1/dealerships?${query.toString()}`), {
    next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(
      `No se pudo cargar el sitemap de concesionarios (${response.status}).`,
    );
  }

  const payload = (await response.json()) as DealershipSitemapApiResponse;

  if (!payload.ok || !payload.data || !Array.isArray(payload.data.data)) {
    throw new Error("Respuesta inválida del sitemap de concesionarios.");
  }

  return payload.data;
}

export async function fetchAllDealershipSitemapEntries(): Promise<
  DealershipSitemapEntry[]
> {
  const entries: DealershipSitemapEntry[] = [];

  for (let page = 1; page <= DEALERSHIP_SITEMAP_MAX_PAGES; page += 1) {
    const result = await fetchDealershipSitemapPage(page);

    entries.push(
      ...result.data.map((item) => ({
        slug: item.slug,
        updatedAt: item.updated_at,
      })),
    );

    if (
      result.data.length === 0 ||
      page >= Math.ceil(result.total / DEALERSHIP_SITEMAP_PAGE_SIZE)
    ) {
      return entries;
    }
  }

  throw new Error(
    `El sitemap de concesionarios supera el máximo de ${DEALERSHIP_SITEMAP_MAX_PAGES} páginas.`,
  );
}
