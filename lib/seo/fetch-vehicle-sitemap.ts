import { buildApiUrl } from "@/lib/api";
import { VEHICLE_SITEMAP_PAGE_SIZE } from "@/lib/seo/vehicle-sitemap.constants";

export interface VehicleSitemapEntry {
  id: string;
  updatedAt: string;
  isFeatured: boolean;
}

export interface VehicleSitemapMeta {
  total: number;
  limit: number;
  totalPages: number;
}

export interface VehicleSitemapPage {
  data: VehicleSitemapEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface VehicleSitemapApiResponse<T> {
  ok: boolean;
  data: T;
}

const SITEMAP_REVALIDATE_SECONDS = 3600;

async function fetchSitemapJson<T>(path: string): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`No se pudo cargar el sitemap de vehículos (${response.status}).`);
  }

  const payload = (await response.json()) as VehicleSitemapApiResponse<T>;

  if (!payload.ok || !payload.data) {
    throw new Error("Respuesta inválida del sitemap de vehículos.");
  }

  return payload.data;
}

export async function fetchVehicleSitemapMeta(): Promise<VehicleSitemapMeta> {
  return fetchSitemapJson<VehicleSitemapMeta>("/v1/sitemap/vehicles/meta");
}

export async function fetchVehicleSitemapPage(
  page: number,
): Promise<VehicleSitemapPage> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(VEHICLE_SITEMAP_PAGE_SIZE),
  });

  return fetchSitemapJson<VehicleSitemapPage>(
    `/v1/sitemap/vehicles?${query.toString()}`,
  );
}
