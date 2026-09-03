import { buildApiUrl } from "@/lib/api";
import type { VehicleListingSitemapVariant } from "@/lib/seo/vehicle-listing-sitemap.constants";
import { VEHICLE_LISTING_SITEMAP_PAGE_SIZE } from "@/lib/seo/vehicle-listing-sitemap.constants";

export interface VehicleListingSitemapEntry {
  makeSlug: string;
  modelSlug: string;
  provinceSlug?: string;
}

export interface VehicleListingSitemapMeta {
  total: number;
  limit: number;
  totalPages: number;
  variant: VehicleListingSitemapVariant;
}

export interface VehicleListingSitemapPage {
  data: VehicleListingSitemapEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface VehicleListingSitemapApiResponse<T> {
  ok: boolean;
  data: T;
}

const SITEMAP_REVALIDATE_SECONDS = 3600;

async function fetchListingSitemapJson<T>(path: string): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(
      `No se pudo cargar el sitemap de listados de vehículos (${response.status}).`,
    );
  }

  const payload = (await response.json()) as VehicleListingSitemapApiResponse<T>;

  if (!payload.ok || !payload.data) {
    throw new Error("Respuesta inválida del sitemap de listados de vehículos.");
  }

  return payload.data;
}

export async function fetchVehicleListingSitemapMeta(
  variant: VehicleListingSitemapVariant,
): Promise<VehicleListingSitemapMeta> {
  const query = new URLSearchParams({ variant });

  return fetchListingSitemapJson<VehicleListingSitemapMeta>(
    `/v1/sitemap/vehicle-listings/meta?${query.toString()}`,
  );
}

export async function fetchVehicleListingSitemapPage(
  variant: VehicleListingSitemapVariant,
  page: number,
): Promise<VehicleListingSitemapPage> {
  const query = new URLSearchParams({
    variant,
    page: String(page),
    limit: String(VEHICLE_LISTING_SITEMAP_PAGE_SIZE),
  });

  return fetchListingSitemapJson<VehicleListingSitemapPage>(
    `/v1/sitemap/vehicle-listings?${query.toString()}`,
  );
}
